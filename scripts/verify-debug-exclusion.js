#!/usr/bin/env node

/**
 * Script to verify that debug components are excluded from production builds
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const bundleAnalysisFile = path.join(distDir, 'bundle-analysis.html');

console.log('🔍 Verifying debug component exclusion from production build...\n');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Dist directory not found. Please run "npm run build:prod" first.');
  process.exit(1);
}

// Check for debug components in JavaScript files
const jsFiles = [];
function findJsFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findJsFiles(filePath);
    } else if (file.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  });
}

findJsFiles(distDir);

let debugComponentsFound = false;
let totalFilesChecked = 0;

console.log('📁 Checking JavaScript files for debug components...');

jsFiles.forEach(file => {
  totalFilesChecked++;
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for PerformanceDrawer references
  if (content.includes('PerformanceDrawer')) {
    console.log(`❌ Found PerformanceDrawer in: ${path.relative(distDir, file)}`);
    debugComponentsFound = true;
  }
  
  // Check for debug directory references
  if (content.includes('debug/') || content.includes('debug\\')) {
    console.log(`❌ Found debug directory reference in: ${path.relative(distDir, file)}`);
    debugComponentsFound = true;
  }
  
  // Check for debug component CSS
  if (content.includes('perf-drawer') || content.includes('performance-drawer')) {
    console.log(`❌ Found debug CSS in: ${path.relative(distDir, file)}`);
    debugComponentsFound = true;
  }
});

// Check bundle analysis file
if (fs.existsSync(bundleAnalysisFile)) {
  console.log('\n📊 Checking bundle analysis for debug components...');
  const analysisContent = fs.readFileSync(bundleAnalysisFile, 'utf8');
  
  if (analysisContent.includes('PerformanceDrawer') || analysisContent.includes('debug')) {
    console.log('❌ Found debug components in bundle analysis');
    debugComponentsFound = true;
  } else {
    console.log('✅ No debug components found in bundle analysis');
  }
}

// Check CSS files for debug styles
console.log('\n🎨 Checking CSS files for debug styles...');
const cssFiles = [];
function findCssFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findCssFiles(filePath);
    } else if (file.endsWith('.css')) {
      cssFiles.push(filePath);
    }
  });
}

findCssFiles(distDir);

cssFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('perf-drawer') || content.includes('performance-drawer')) {
    console.log(`❌ Found debug CSS in: ${path.relative(distDir, file)}`);
    debugComponentsFound = true;
  }
});

// Summary
console.log('\n📋 Verification Summary:');
console.log(`   Files checked: ${totalFilesChecked} JS files, ${cssFiles.length} CSS files`);
console.log(`   Bundle analysis: ${fs.existsSync(bundleAnalysisFile) ? 'Available' : 'Not found'}`);

if (debugComponentsFound) {
  console.log('\n❌ Debug components found in production build!');
  console.log('   Please check the Vite configuration and ensure proper exclusion.');
  process.exit(1);
} else {
  console.log('\n✅ Success! Debug components are properly excluded from production build.');
  console.log('   Production bundle is clean and optimized.');
}

// Additional checks
console.log('\n🔧 Additional Checks:');
console.log('   - Verify build mode: Check that NODE_ENV=production');
console.log('   - Check Vite config: Ensure debug exclusions are active');
console.log('   - Test runtime: Verify PerformanceDrawer is not rendered in production');
console.log('   - Monitor bundle size: Debug components should not increase production bundle size');
