#!/usr/bin/env node
/**
 * Copy asset folder to dist after build
 * This ensures profile photos and certificates are available in production
 */

import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const sourceDir = 'asset';
const destDir = 'dist/asset';

function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  // Read all files/folders in source
  const entries = readdirSync(source);

  for (const entry of entries) {
    const sourcePath = join(source, entry);
    const destPath = join(destination, entry);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy file
      copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied: ${entry}`);
    }
  }
}

console.log('📦 Copying asset folder to dist...');
try {
  copyDirectory(sourceDir, destDir);
  console.log('✅ Assets copied successfully!');
} catch (error) {
  console.error('❌ Error copying assets:', error);
  process.exit(1);
}

// Copy SEO files from public to dist
console.log('\n📦 Copying SEO files to dist...');
const seoFiles = ['robots.txt', 'llms.txt', 'sitemap.xml'];
const publicDir = 'public';
const distRoot = 'dist';

try {
  for (const file of seoFiles) {
    const sourcePath = join(publicDir, file);
    const destPath = join(distRoot, file);
    
    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied: ${file}`);
    } else {
      console.log(`⚠ Skipped: ${file} (not found in public/)`);
    }
  }
  console.log('✅ SEO files copied successfully!');
} catch (error) {
  console.error('❌ Error copying SEO files:', error);
  process.exit(1);
}

// Copy WASM files to dist
console.log('\n🚀 Copying WASM files to dist...');
const wasmFiles = [
  'wasm-modules/pkg/portfolio_engine_bg.wasm',
  'wasm-modules/pkg/portfolio_engine.js'
];

try {
  for (const file of wasmFiles) {
    if (existsSync(file)) {
      const filename = file.split('/').pop(); // Get just the filename
      const destPath = join(distRoot, filename);
      copyFileSync(file, destPath);
      console.log(`✓ Copied WASM: ${filename}`);
    } else {
      console.log(`⚠ Skipped: ${file} (not found)`);
    }
  }
  console.log('✅ WASM files copied successfully!');
} catch (error) {
  console.error('❌ Error copying WASM files:', error);
  process.exit(1);
}

// Copy language-specific HTML files to dist
console.log('\n🌐 Copying language-specific HTML files to dist...');
const langFiles = ['index.de.html', 'index.fr.html', 'index.ar.html'];

try {
  for (const file of langFiles) {
    const sourcePath = file;
    const destPath = join(distRoot, file);
    
    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied: ${file}`);
    } else {
      console.log(`⚠ Skipped: ${file} (not found in root)`);
    }
  }
  console.log('✅ Language files copied successfully!');
} catch (error) {
  console.error('❌ Error copying language files:', error);
  process.exit(1);
}

