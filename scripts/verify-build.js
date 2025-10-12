#!/usr/bin/env node

/**
 * Build Verification Script
 * Checks that the production build completed successfully
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Build\n');
console.log('='.repeat(50));

const distDir = path.join(__dirname, '../dist');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found');
  process.exit(1);
}

// Required files that should exist after build
const requiredFiles = [
  'index.html',
  'assets',
  'robots.txt',
  'sitemap.xml'
];

let hasErrors = false;

console.log('\n📋 Checking required files:\n');

requiredFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const type = stats.isDirectory() ? 'dir' : 'file';
    const size = stats.isDirectory() ? '' : ` (${(stats.size / 1024).toFixed(2)} KB)`;
    console.log(`  ✅ ${file} ${type}${size}`);
  } else {
    console.log(`  ❌ ${file} missing`);
    hasErrors = true;
  }
});

// Check for JavaScript bundles
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
  const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
  
  console.log(`\n📦 Bundle files:`);
  console.log(`  JS files: ${jsFiles.length}`);
  console.log(`  CSS files: ${cssFiles.length}`);
  
  if (jsFiles.length === 0) {
    console.log('  ❌ No JavaScript bundles found');
    hasErrors = true;
  }
  
  if (cssFiles.length === 0) {
    console.log('  ❌ No CSS bundles found');
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Build verification failed\n');
  process.exit(1);
} else {
  console.log('✅ Build verification passed\n');
  process.exit(0);
}

