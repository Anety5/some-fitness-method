import { Handler } from '@netlify/functions';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { registerRoutes } from '../../server/routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
registerRoutes(app);

// Export serverless function
const serverlessApp = serverlessExpress({ app });

export const handler: Handler = async (event, context) => {
  return serverlessApp(event, context);
};