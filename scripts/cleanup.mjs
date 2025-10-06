#!/usr/bin/env node

/**
 * Cleanup Script
 * 
 * This script removes temporary files, build artifacts, and other unnecessary files
 * from the project directory to keep the repository clean.
 */

import { rm, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const itemsToClean = [
  // Build artifacts
  'dist',
  'build',
  
  // Test results
  'test-results',
  'playwright-report',
  'playwright/.cache',
  
  // Storybook
  'storybook-static',
  
  // Cache directories
  '.cache',
  
  // Temporary files
  'depcheck-results.json',
  
  // WASM build artifacts (keep source, remove compiled)
  'wasm-modules/target',
  
  // Node modules (optional - uncomment if needed)
  // 'node_modules',
];

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function cleanupItem(itemPath) {
  const fullPath = join(rootDir, itemPath);
  
  if (await fileExists(fullPath)) {
    try {
      await rm(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed: ${itemPath}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to remove ${itemPath}:`, error.message);
      return false;
    }
  } else {
    console.log(`  Skipped: ${itemPath} (not found)`);
    return true;
  }
}

async function cleanup() {
  console.log('🧹 Starting cleanup...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const item of itemsToClean) {
    const success = await cleanupItem(item);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n✨ Cleanup complete!`);
  console.log(`   Processed: ${successCount} items`);
  if (failCount > 0) {
    console.log(`   Failed: ${failCount} items`);
    process.exit(1);
  }
}

// Run cleanup
cleanup().catch((error) => {
  console.error('Cleanup failed:', error);
  process.exit(1);
});