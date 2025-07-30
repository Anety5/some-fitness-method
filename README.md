# Package 1: Core Application Files

## Contents
- `/src/` - React TypeScript source code
- `/server/` - Express.js backend
- `/shared/` - Shared types and schemas
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration  
- `drizzle.config.ts` - Database configuration
- `index.html` - Main HTML template

## Netlify Deployment
1. Upload this package to GitHub repository root
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in Netlify dashboard

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production"

## Build Process
The app uses Vite for optimized builds compatible with Netlify's build system.