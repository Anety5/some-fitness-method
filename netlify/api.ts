import { Handler } from '@netlify/functions';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';

// Import your existing Express app routes
const app = express();

// Add your API routes here
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Add all your existing server routes
// app.use('/api', yourExistingRoutes);

export const handler: Handler = serverlessExpress({ app });