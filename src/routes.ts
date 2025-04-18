import { Router, Request, Response } from 'express';
import { authenticateBearer } from './auth'; // Import the authentication middleware

// Create a new Express Router instance
const router = Router();

// Define a public route - accessible without authentication
router.get('/public', (req: Request, res: Response) => {
  res.json({ message: 'This is a public route. Anyone can access it.' });
});

// Define a protected route - requires Bearer token authentication
// The authenticateBearer middleware is applied before the route handler
router.get('/secure', authenticateBearer, (req: Request, res: Response) => {
  // If the request reaches here, it means authenticateBearer middleware succeeded
  // req.user contains the user object passed from the BearerStrategy's done callback
  res.json({
    message: 'This is a protected route. Authentication successful!',
    user: req.user // Optionally include user information in the response
  });
});

// Export the configured router
export default router;
