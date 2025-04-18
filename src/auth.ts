import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import axios from 'axios'; // Import axios
import config from './config'; // Import the loaded configuration

// Configure the Bearer strategy for Passport
passport.use(new BearerStrategy(
  async (token, done) => {
    // 1. Check for Development Token (if enabled)
    if (config.enableDevToken && token === config.bearerToken) {
      console.log('Authenticating using development token.');
      const devUser = { user: 'dev_token_user', source: 'dev_token', scope: 'all', username: 'dev-user' }; // Example dev user
      return done(null, devUser, { scope: 'all' });
    }

    console.log(`Introspecting token with Hydra at ${config.hydraIntrospectionUrl}`);

    // 2. Fallback to Hydra Introspection
    const body = new URLSearchParams();
    body.append('token', token);

    try {
      const response = await axios.post(
        config.hydraIntrospectionUrl,
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      // Log Hydra response for debugging (optional)
      // console.log('Hydra introspection response:', response.data);

      if (response.data && response.data.active === true) {
        // Token is active, pass Hydra's response data as the user object
        // Adding a 'source' field to distinguish from dev token
        console.log('Hydra token introspection successful.');
        const hydraUser = { ...response.data, source: 'hydra' };
        return done(null, hydraUser, { scope: response.data.scope || 'all' }); // Use scope from Hydra if available
      } else if (response.data && response.data.active === false) {
        // Token is inactive or invalid according to Hydra
        console.log('Hydra token introspection returned inactive.');
        return done(null, false);
      } else {
        // Unexpected response format from Hydra
        console.error('Invalid introspection response from Hydra:', response.data);
        return done(new Error('Invalid introspection response'));
      }
    } catch (error) {
      // Network error or other issue calling Hydra
      console.error('Error during Hydra token introspection:', error.message || error);
      // Check if it's an axios error and provide more detail
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.status, error.response?.data);
      }
      return done(error); // Pass the error to Passport
    }
  }
));

// Export a middleware function for authenticating requests using the Bearer strategy.
// We disable sessions because token-based authentication is typically stateless.
export const authenticateBearer = passport.authenticate('bearer', { session: false });

// Note: Passport initialization (passport.initialize()) should be done in the main server file (server.ts)
// before applying this middleware to routes. We are only defining the strategy and exporting the middleware here.
