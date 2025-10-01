#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors website performance metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📊 Performance Monitoring Report\n');

// Analyze bundle sizes
const distPath = path.join(__dirname, '../dist/assets');
const files = fs.readdirSync(distPath);

let totalSize = 0;
let gzipSize = 0;

console.log('📦 Bundle Analysis:');
console.log('==================');

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.css')) {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const gzip = Math.round(size * 0.3); // Approximate gzip ratio
    
    totalSize += size;
    gzipSize += gzip;
    
    console.log(`${file.padEnd(30)} ${(size / 1024).toFixed(2).padStart(8)} kB (gzip: ${gzip.toFixed(2)} kB)`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Total Bundle Size: ${(totalSize / 1024).toFixed(2)} kB`);
console.log(`Gzipped Size: ${(gzipSize / 1024).toFixed(2)} kB`);

// Performance recommendations
console.log('\n🎯 Performance Recommendations:');
console.log('================================');

if (totalSize > 1024 * 1024) {
  console.log('⚠️  Bundle size exceeds 1MB - consider code splitting');
}

if (gzipSize > 500 * 1024) {
  console.log('⚠️  Gzipped size exceeds 500kB - optimize further');
}

console.log('✅ Bundle analysis complete');
