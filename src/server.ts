import express, { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport'; // Import Passport
import config from './config'; // Import the loaded configuration
import apiRouter from './routes'; // Import the API router

// Initialize the Express application
const app: Express = express();

// Middleware setup
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(passport.initialize()); // Initialize Passport

// Mount API routes
app.use('/api', apiRouter); // Use the routes defined in routes.ts, prefixed with /api

// Error handling middleware (example - can be expanded)
// This should typically come after routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Function to start the server
const startServer = () => {
  try {
    app.listen(config.port, config.bindAddress, () => {
      console.log(`Server listening at http://${config.bindAddress}:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit if server fails to start
  }
};

// Start the server
startServer();

// Export the app instance for potential use in tests or other modules
export default app;
