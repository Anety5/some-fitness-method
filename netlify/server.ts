import { Handler } from '@netlify/functions';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';

// Create Express app with lightweight routes for serverless
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'S.O.M.E fitness method API is running' });
});

// Simple test routes for basic functionality
app.get('/api/vitals', (req, res) => {
  res.json({ message: 'Vitals endpoint working' });
});

app.get('/api/users', (req, res) => {
  res.json({ message: 'Users endpoint working' });
});

// Export serverless function
const serverlessApp = serverlessExpress({ app });

export const handler: Handler = async (event, context) => {
  return serverlessApp(event, context);
};
