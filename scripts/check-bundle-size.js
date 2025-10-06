#!/usr/bin/env node

/**
 * Bundle Size Check Script
 * Mimics the GitHub Actions bundle size check workflow
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Bundle Size Check\n');
console.log('='.repeat(50));

// Get dist directory
const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Function to get gzipped size
function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
    return parseInt(gzipped.trim());
  } catch (error) {
    console.error(`Error getting size for ${filePath}:`, error.message);
    return 0;
  }
}

// Get all JS and CSS files
const assetsDir = path.join(distDir, 'assets');
let totalSize = 0;
const files = [];

if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  
  for (const file of assetFiles) {
    if (file.endsWith('.js') || file.endsWith('.css')) {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      const gzippedSize = getGzippedSize(filePath);
      
      totalSize += gzippedSize;
      files.push({
        name: file,
        size: stats.size,
        gzipped: gzippedSize
      });
    }
  }
}

// Sort by gzipped size (descending)
files.sort((a, b) => b.gzipped - a.gzipped);

// Display results
console.log('\n📊 Bundle Sizes (gzipped):\n');
console.log('| File | Original | Gzipped |');
console.log('|------|----------|---------|');

for (const file of files) {
  const originalKB = (file.size / 1024).toFixed(2);
  const gzippedKB = (file.gzipped / 1024).toFixed(2);
  console.log(`| ${file.name} | ${originalKB} KB | ${gzippedKB} KB |`);
}

const totalKB = (totalSize / 1024).toFixed(2);
console.log('\n' + '='.repeat(50));
console.log(`\n**Total Bundle Size: ${totalKB} KB (gzipped)**\n`);

// Check against targets
const TARGET_SIZE = 350;
const STRETCH_TARGET = 300;
const CRITICAL_SIZE = 450;

console.log('🎯 Bundle Size Targets:\n');
console.log(`- Current:      ${totalKB} KB`);
console.log(`- Target:       ${TARGET_SIZE} KB`);
console.log(`- Stretch Goal: ${STRETCH_TARGET} KB`);
console.log(`- Critical:     ${CRITICAL_SIZE} KB`);
console.log('');

const currentSize = parseFloat(totalKB);

if (currentSize <= STRETCH_TARGET) {
  console.log('✅ **Excellent!** Bundle is under stretch goal! 🏆');
  console.log(`   Savings: ${(TARGET_SIZE - currentSize).toFixed(2)} KB under target\n`);
  process.exit(0);
} else if (currentSize <= TARGET_SIZE) {
  console.log('✅ **Good!** Bundle meets target size! 📊');
  console.log(`   Savings: ${(TARGET_SIZE - currentSize).toFixed(2)} KB under target\n`);
  process.exit(0);
} else if (currentSize <= CRITICAL_SIZE) {
  console.log('⚠️  **Warning:** Bundle exceeds target!');
  console.log(`   Over by: ${(currentSize - TARGET_SIZE).toFixed(2)} KB\n`);
  console.log('   Consider optimizing bundle size before deployment.');
  process.exit(0); // Don't fail, just warn
} else {
  console.log('❌ **Error:** Bundle is critically large!');
  console.log(`   Over by: ${(currentSize - TARGET_SIZE).toFixed(2)} KB\n`);
  console.log('   Bundle size must be reduced before deployment.');
  process.exit(1);
}
