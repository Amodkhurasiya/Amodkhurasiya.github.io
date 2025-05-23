#!/bin/bash

# Deployment script for Trybee frontend

echo "🚀 Starting deployment process..."

# Set environment variables
export VITE_API_URL="https://trybee-backend.railway.app/api"
echo "✅ Environment variables set"

# Clean up previous build
echo "🧹 Cleaning up previous build..."
rm -rf dist

# Build the project
echo "🏗️ Building project..."
npm run build

# Create environment config file in dist
echo "📝 Creating environment config file..."
cat > dist/env-config.js << EOL
// This file is dynamically generated during the build process
window.ENV = {
  VITE_API_URL: "${VITE_API_URL}"
};
EOL

# Copy the CNAME file to dist if it exists
if [ -f "CNAME" ]; then
  echo "📋 Copying CNAME file..."
  cp CNAME dist/
fi

echo "🎉 Build complete! Files ready in the dist directory."
echo "📂 You can now upload the contents of the dist directory to your hosting provider." 