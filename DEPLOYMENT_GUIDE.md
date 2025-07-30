# S.O.M.E Fitness - Complete Deployment Guide

## Overview
This guide covers the complete deployment process from GitHub to Netlify and Google Play Store integration.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Netlify Functions
- **Database**: PostgreSQL (Neon/Supabase compatible)
- **Styling**: Tailwind CSS + shadcn/ui
- **Mobile**: PWA + Android App Bundle

## Package Deployment Order

### Step 1: Package 1 - Core Application
1. Create new GitHub repository
2. Upload Package 1 contents to repository root
3. Ensure all source files are in correct structure:
   ```
   /src/ (React components)
   /server/ (Express API)
   /shared/ (TypeScript types)
   package.json, tsconfig.json, vite.config.ts
   ```

### Step 2: Package 2 - Static Assets
1. Create `public/` directory in repository root
2. Upload Package 2 contents maintaining directory structure
3. Verify audio files are properly organized:
   - `/public/assets/audio/ambient/` (41MB)
   - `/public/assets/audio/breathing/` (28MB)
   - `/public/assets/audio/meditation/` (81MB)

### Step 3: Package 3 - Deployment Configuration
1. Copy `netlify.toml` to repository root
2. Create `.github/workflows/` directory and add deploy.yml
3. Copy `android-integration/` folder for Google Play preparation

### Step 4: Package 4 - Documentation
1. Add README.md and other documentation files
2. Include deployment guides and API documentation

## Netlify Setup

### 1. Connect Repository
1. Link GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### 2. Environment Variables
Add to Netlify dashboard:
```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
```

### 3. Functions Configuration
- API routes automatically redirect to Netlify Functions
- Serverless backend handles database operations
- CORS configured for frontend communication

## Google Play Integration

### PWA to Android App
1. Use Android Studio with Package 3 files
2. Configure health permissions in AndroidManifest.xml
3. Implement Health Connect integration
4. Build signed APK/AAB for Play Store

### Health Connect Features
- Activity tracking integration
- Sleep and wellness data sync
- Proper permission handling
- GDPR compliance for health data

## Post-Deployment Checklist
- [ ] Test all audio playback on mobile devices
- [ ] Verify GPS tracking functionality
- [ ] Test PWA installation on iOS/Android
- [ ] Validate health data permissions
- [ ] Check responsive design on various screens
- [ ] Test offline functionality
- [ ] Verify database connections
- [ ] Test API endpoints in production

## Troubleshooting

### Common Issues
1. **Audio not loading**: Check MIME types in netlify.toml
2. **API errors**: Verify environment variables and function routing
3. **Build failures**: Check Node.js version compatibility
4. **Mobile issues**: Validate PWA manifest and service worker

### Support Resources
- Netlify Functions documentation
- Google Play Console guides
- Health Connect API documentation
- PWA best practices