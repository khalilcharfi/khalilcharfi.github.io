#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the project is ready for GitHub Pages deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔍 Verifying GitHub Pages deployment configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: GitHub Actions workflow exists
console.log('✓ Checking GitHub Actions workflow...');
const workflowPath = path.join(rootDir, '.github', 'workflows', 'deploy.yml');
if (fs.existsSync(workflowPath)) {
  console.log('  ✅ Workflow file exists: .github/workflows/deploy.yml\n');
} else {
  console.log('  ❌ ERROR: Workflow file not found!\n');
  hasErrors = true;
}

// Check 2: Package.json scripts
console.log('✓ Checking package.json scripts...');
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredScripts = ['build', 'build:prod'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length === 0) {
    console.log('  ✅ All required build scripts present\n');
  } else {
    console.log(`  ❌ ERROR: Missing scripts: ${missingScripts.join(', ')}\n`);
    hasErrors = true;
  }
} else {
  console.log('  ❌ ERROR: package.json not found!\n');
  hasErrors = true;
}

// Check 3: Vite config
console.log('✓ Checking Vite configuration...');
const viteConfigPath = path.join(rootDir, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check for environment variable handling
  if (viteConfig.includes('loadEnv') && viteConfig.includes('define')) {
    console.log('  ✅ Environment variables configured correctly\n');
  } else {
    console.log('  ⚠️  WARNING: Environment variable handling might be incomplete\n');
    hasWarnings = true;
  }
} else {
  console.log('  ❌ ERROR: vite.config.ts not found!\n');
  hasErrors = true;
}

// Check 4: .nojekyll file in public
console.log('✓ Checking .nojekyll file...');
const nojekyllPath = path.join(rootDir, 'public', '.nojekyll');
if (fs.existsSync(nojekyllPath)) {
  console.log('  ✅ .nojekyll file exists in public folder\n');
} else {
  console.log('  ⚠️  WARNING: .nojekyll file not found in public folder\n');
  console.log('     This might cause issues with files starting with underscore\n');
  hasWarnings = true;
}

// Check 5: Public folder structure
console.log('✓ Checking public folder...');
const publicPath = path.join(rootDir, 'public');
if (fs.existsSync(publicPath)) {
  const publicFiles = fs.readdirSync(publicPath);
  console.log(`  ✅ Public folder exists with ${publicFiles.length} files\n`);
} else {
  console.log('  ⚠️  WARNING: public folder not found\n');
  hasWarnings = true;
}

// Check 6: Required dependencies
console.log('✓ Checking dependencies...');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['vite', 'react', 'react-dom'];
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length === 0) {
    console.log('  ✅ All required dependencies present\n');
  } else {
    console.log(`  ❌ ERROR: Missing dependencies: ${missingDeps.join(', ')}\n`);
    hasErrors = true;
  }
}

// Check 7: Dist folder (from previous build)
console.log('✓ Checking for previous builds...');
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  const distFiles = fs.readdirSync(distPath);
  console.log(`  ℹ️  Previous build found (${distFiles.length} items)\n`);
} else {
  console.log('  ℹ️  No previous build found (will be created during deployment)\n');
}

// Final summary
console.log('\n' + '='.repeat(60));
console.log('DEPLOYMENT READINESS SUMMARY');
console.log('='.repeat(60) + '\n');

if (hasErrors) {
  console.log('❌ ERRORS FOUND: Please fix the errors above before deploying\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS FOUND: Deployment should work but review warnings\n');
  console.log('📋 Next Steps:');
  console.log('   1. Fix any warnings (optional but recommended)');
  console.log('   2. Set up GitHub Secrets (GEMINI_API_KEY, etc.)');
  console.log('   3. Enable GitHub Pages in repository settings');
  console.log('   4. Push to main or next branch to trigger deployment\n');
  console.log('📖 See docs/GITHUB_PAGES_DEPLOYMENT.md for detailed instructions\n');
} else {
  console.log('✅ ALL CHECKS PASSED!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Set up GitHub Secrets (GEMINI_API_KEY, etc.)');
  console.log('   2. Enable GitHub Pages in repository settings');
  console.log('   3. Push to main or next branch to trigger deployment\n');
  console.log('📖 See docs/GITHUB_PAGES_DEPLOYMENT.md for detailed instructions\n');
}

// Instructions for GitHub Secrets
console.log('🔐 Required GitHub Secrets:');
console.log('   Go to: Settings → Secrets and variables → Actions\n');
console.log('   Required:');
console.log('   - GEMINI_API_KEY: Your Gemini API key\n');
console.log('   Optional (have defaults):');
console.log('   - VITE_ENABLE_CHATBOT: true/false (default: true)');
console.log('   - VITE_ENABLE_DYNAMIC_CONTENT: true/false (default: true)');
console.log('   - VITE_SHOW_RECOMMENDED_SECTIONS: true/false (default: true)\n');

