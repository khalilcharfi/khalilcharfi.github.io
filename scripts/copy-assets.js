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

