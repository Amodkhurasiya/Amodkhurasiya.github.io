/**
 * Cleanup script to help prepare the project for GitHub deployment
 * 
 * Usage: 
 * - Navigate to project root
 * - Run: node cleanup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Files that should be considered for removal before GitHub deployment
const filesToCheck = [
  { path: 'new.html', reason: 'Appears to be a temporary file' },
  { path: 'backend/uploads', reason: 'Upload directory should be empty except for .gitkeep' },
  { path: '.DS_Store', reason: 'macOS system file' },
  { path: 'node_modules', reason: 'Should be excluded via .gitignore' },
  { path: 'backend/node_modules', reason: 'Should be excluded via .gitignore' },
  { path: 'dist', reason: 'Build output, should be excluded via .gitignore' },
  { path: '.env', reason: 'Environment variables with sensitive data' },
  { path: 'backend/.env', reason: 'Environment variables with sensitive data' },
];

// Create example .env files if needed
const envExamples = [
  { 
    path: '.env.example', 
    content: 'VITE_API_URL=http://localhost:5000/api\n'
  },
  { 
    path: 'backend/.env.example', 
    content: `PORT=5000
MONGODB_URI=mongodb://localhost:27017/trybee
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@trybee.com
`
  },
];

console.log('🧹 Trybee Project Cleanup Utility');
console.log('--------------------------------');
console.log('This script will help prepare your project for GitHub deployment\n');

// Check for files that should be removed or gitignored
console.log('Checking for files that should be removed or gitignored...');

filesToCheck.forEach(file => {
  try {
    if (fs.existsSync(file.path)) {
      console.log(`⚠️  ${file.path} - ${file.reason}`);
    }
  } catch (err) {
    console.error(`Error checking ${file.path}:`, err);
  }
});

// Check for .gitignore
if (!fs.existsSync('.gitignore')) {
  console.log('\n⚠️  .gitignore file is missing! Creating one...');
  
  const gitignoreContent = `# Node modules
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build files
dist/
build/
*/dist/

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Backend specific
backend/uploads/*
!backend/uploads/.gitkeep

# Frontend specific
coverage/
.eslintcache

# Miscellaneous
*.log
.cache/
`;
  
  fs.writeFileSync('.gitignore', gitignoreContent);
  console.log('✅ Created .gitignore file');
}

// Create environment variable example files
console.log('\nChecking for environment variable example files...');

envExamples.forEach(example => {
  try {
    if (!fs.existsSync(example.path)) {
      console.log(`⚠️  ${example.path} is missing. Creating one...`);
      
      // Create directory if it doesn't exist
      const dir = path.dirname(example.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(example.path, example.content);
      console.log(`✅ Created ${example.path}`);
    }
  } catch (err) {
    console.error(`Error creating ${example.path}:`, err);
  }
});

// Create uploads directory with .gitkeep if it doesn't exist
const uploadsDir = path.join('backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('\n⚠️  backend/uploads directory is missing. Creating it...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created backend/uploads directory');
}

const gitkeepFile = path.join(uploadsDir, '.gitkeep');
if (!fs.existsSync(gitkeepFile)) {
  console.log('⚠️  backend/uploads/.gitkeep is missing. Creating it...');
  fs.writeFileSync(gitkeepFile, '');
  console.log('✅ Created backend/uploads/.gitkeep');
}

// Remove unnecessary files
console.log('\nWould you like to remove unnecessary files? (y/n)');
rl.question('', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\nRemoving unnecessary files...');
    
    // Files to delete
    const filesToDelete = ['new.html'];
    
    filesToDelete.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`✅ Deleted ${file}`);
        }
      } catch (err) {
        console.error(`Error deleting ${file}:`, err);
      }
    });
    
    // Clean uploads directory except .gitkeep
    try {
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        
        files.forEach(file => {
          if (file !== '.gitkeep') {
            const filePath = path.join(uploadsDir, file);
            fs.unlinkSync(filePath);
            console.log(`✅ Deleted ${filePath}`);
          }
        });
      }
    } catch (err) {
      console.error(`Error cleaning uploads directory:`, err);
    }
  }
  
  console.log('\n✅ Cleanup process completed!');
  console.log('\nNext steps for deploying to GitHub:');
  console.log('1. Create a new repository on GitHub');
  console.log('2. Run the following commands:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial commit"');
  console.log('   git branch -M main');
  console.log('   git remote add origin https://github.com/username/repo-name.git');
  console.log('   git push -u origin main');
  
  rl.close();
}); 