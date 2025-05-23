@echo off
echo 🚀 Starting deployment process...

rem Set environment variables
set VITE_API_URL=https://trybee-backend.railway.app/api
echo ✅ Environment variables set

rem Clean up previous build
echo 🧹 Cleaning up previous build...
if exist dist rmdir /s /q dist

rem Build the project
echo 🏗️ Building project...
call npm run build

rem Create environment config file in dist
echo 📝 Creating environment config file...
echo // This file is dynamically generated during the build process > dist\env-config.js
echo window.ENV = { >> dist\env-config.js
echo   VITE_API_URL: "%VITE_API_URL%" >> dist\env-config.js
echo }; >> dist\env-config.js

rem Copy the CNAME file to dist if it exists
if exist CNAME (
  echo 📋 Copying CNAME file...
  copy CNAME dist\
)

echo 🎉 Build complete! Files ready in the dist directory.
echo 📂 You can now upload the contents of the dist directory to your hosting provider. 