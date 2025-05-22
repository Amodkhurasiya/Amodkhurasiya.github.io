# Trybee Deployment Guide

This guide will walk you through the process of deploying the Trybee e-commerce platform, including both the frontend and backend components.

## Prerequisites

- GitHub account
- Node.js and npm installed
- MongoDB Atlas account (for production database)
- Hosting accounts (Vercel/Netlify for frontend, Heroku/Railway/Render for backend)

## 1. Preparing Your Project for Deployment

### Clean Up Unnecessary Files

Before deployment, remove any unnecessary files:

- Remove any test or dummy data
- Delete any unused components or code
- Ensure all console.log statements are removed or commented out
- Check for hardcoded development URLs or credentials

### Create Environment Variables

For frontend (.env.production):
```
VITE_API_URL=https://your-backend-url.com/api
```

For backend (.env):
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trybee
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## 2. Setting Up GitHub Repository

1. Create a new repository on GitHub
2. Initialize Git in your local project folder (if not already done)
   ```bash
   git init
   ```
3. Add your files to Git
   ```bash
   git add .
   ```
4. Commit the files
   ```bash
   git commit -m "Initial commit"
   ```
5. Add the GitHub repository as the remote origin
   ```bash
   git remote add origin https://github.com/yourusername/trybee.git
   ```
6. Push the code to GitHub
   ```bash
   git push -u origin main
   ```

## 3. Frontend Deployment (Vercel)

### Deploying to Vercel

1. Sign up/login to [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add your `VITE_API_URL`
5. Click "Deploy"

### Deploying to Netlify

1. Sign up/login to [Netlify](https://netlify.com/)
2. Click "New site from Git"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables: Add your `VITE_API_URL`
5. Click "Deploy site"

## 4. Backend Deployment (Heroku)

### Deploying to Heroku

1. Create a `Procfile` in the backend directory:
   ```
   web: node start.js
   ```

2. Install Heroku CLI and login
   ```bash
   npm install -g heroku
   heroku login
   ```

3. Create a new Heroku app
   ```bash
   heroku create trybee-api
   ```

4. Add environment variables
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_HOST=your_email_host
   # Add other necessary environment variables
   ```

5. Deploy the backend to Heroku
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Deploying to Railway

1. Sign up/login to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `/backend`
   - Start Command: `npm start`
   - Add environment variables in the "Variables" tab
5. Deploy

## 5. Setting Up MongoDB Atlas

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster
3. Set up database access user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get your connection string and add it to your backend environment variables

## 6. Connecting Frontend to Backend

After deploying both frontend and backend:

1. Update the environment variable on your frontend hosting platform:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. Redeploy the frontend if necessary

## 7. Verify Deployment

1. Test the website functionality:
   - User registration and login
   - Product browsing and filtering
   - Adding items to cart
   - Checkout process
   - Admin functionalities

2. Check for any CORS issues:
   - Ensure your backend is properly configured to accept requests from your frontend domain

## 8. Common Deployment Issues and Solutions

### CORS Errors
- Make sure your backend has CORS configured correctly:
  ```javascript
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-url.com' 
      : 'http://localhost:5173',
    credentials: true
  }));
  ```

### 404 Not Found on Page Refresh (Frontend)
- For Netlify, create a `_redirects` file in the `public` directory:
  ```
  /* /index.html 200
  ```
- For Vercel, create a `vercel.json` file in the root directory:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### Database Connection Issues
- Ensure your MongoDB connection string is correct
- Check IP whitelist settings in MongoDB Atlas

### Missing Environment Variables
- Double-check all required environment variables are set on your hosting platform

## 9. Post-Deployment Tasks

1. Set up a custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and logging tools
4. Create admin account for the production environment
5. Add initial product data

## 10. Maintenance Plan

1. Regular backups of the database
2. Monitoring of error logs
3. Regular updates of dependencies
4. Performance monitoring and optimization
5. Regular security audits 