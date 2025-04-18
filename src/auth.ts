import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import config from './config'; // Import the loaded configuration

// Configure the Bearer strategy for Passport
passport.use(new BearerStrategy(
  (token, done) => {
    // Log received token for debugging (optional, remove in production)
    // console.log('Received token:', token);
    // console.log('Expected token:', config.bearerToken);

    // Verify the token against the one loaded from config.yaml
    if (token === config.bearerToken) {
      // Tokens match. Authenticate the request.
      // The user object can be customized as needed. Here, a simple placeholder is used.
      const user = { scope: 'all', username: 'service-account' }; // Example user object
      return done(null, user, { scope: 'all' }); // Indicate success, provide user object and options
    } else {
      // Tokens do not match. Reject the request.
      return done(null, false); // Indicate failure, no user object
    }
    // Potential errors during verification could be handled here too, e.g., calling done(error)
  }
));

// Export a middleware function for authenticating requests using the Bearer strategy.
// We disable sessions because token-based authentication is typically stateless.
export const authenticateBearer = passport.authenticate('bearer', { session: false });

// Note: Passport initialization (passport.initialize()) should be done in the main server file (server.ts)
// before applying this middleware to routes. We are only defining the strategy and exporting the middleware here.
