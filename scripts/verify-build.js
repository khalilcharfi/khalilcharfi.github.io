#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies that the build output is correct and all required files exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Build Verification\n');
console.log('='.repeat(50));

const distDir = path.join(__dirname, '../dist');
let hasErrors = false;

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found');
  process.exit(1);
}

console.log('\n✅ dist directory exists\n');

// Required files
const requiredFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt'
];

console.log('📄 Checking required files:\n');

for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ ${file} (${sizeKB} KB)`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    hasErrors = true;
  }
}

// Check assets directory
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  console.log('\n📦 Assets directory:');
  console.log(`   ✅ ${jsFiles.length} JavaScript files`);
  console.log(`   ✅ ${cssFiles.length} CSS files`);
} else {
  console.log('\n   ❌ assets directory - MISSING');
  hasErrors = true;
}

// Check asset directory (images, etc.)
const assetDir = path.join(distDir, 'asset');
if (fs.existsSync(assetDir)) {
  const files = fs.readdirSync(assetDir);
  console.log(`\n🖼️  Asset directory:`);
  console.log(`   ✅ ${files.length} asset files`);
} else {
  console.log('\n   ⚠️  asset directory not found (optional)');
}

// Verify index.html content
console.log('\n🔍 Verifying index.html content:');
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Check for essential elements
  const checks = [
    { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
    { name: 'HTML tag', pattern: /<html/i },
    { name: 'Head tag', pattern: /<head>/i },
    { name: 'Body tag', pattern: /<body/i },
    { name: 'Root div', pattern: /<div id="root"/i },
    { name: 'Script tags', pattern: /<script/i },
  ];
  
  for (const check of checks) {
    if (check.pattern.test(content)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - NOT FOUND`);
      hasErrors = true;
    }
  }
}

// Verify SEO files content
console.log('\n🔍 Verifying SEO files:');

// Check robots.txt
const robotsPath = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const content = fs.readFileSync(robotsPath, 'utf8');
  if (content.includes('User-agent:') && content.includes('Sitemap:')) {
    console.log('   ✅ robots.txt has valid content');
  } else {
    console.log('   ⚠️  robots.txt may have invalid content');
  }
}

// Check sitemap.xml
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  if (content.includes('<?xml') && content.includes('<urlset')) {
    console.log('   ✅ sitemap.xml has valid XML structure');
  } else {
    console.log('   ⚠️  sitemap.xml may have invalid XML');
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('\n❌ Build verification FAILED\n');
  console.log('Please fix the errors above before deploying.\n');
  process.exit(1);
} else {
  console.log('\n✅ Build verification PASSED\n');
  console.log('All required files are present and valid.\n');
  process.exit(0);
}
