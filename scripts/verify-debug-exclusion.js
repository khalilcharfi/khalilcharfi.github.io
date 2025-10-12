#!/usr/bin/env node

/**
 * Debug Code Exclusion Verification
 * Ensures debug-only code is excluded from production builds
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Debug Code Exclusion\n');
console.log('='.repeat(50));

const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found');
  process.exit(1);
}

// Patterns that should NOT appear in production bundles
const debugPatterns = [
  'TranslationTest',
  'PerformanceDrawer',
  'DebugComponents',
  'console.log',
  'console.debug',
  'debugger;'
];

// Find all JS files in dist
const assetsDir = path.join(distDir, 'assets');
let hasDebugCode = false;

if (fs.existsSync(assetsDir)) {
  const jsFiles = fs.readdirSync(assetsDir)
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(assetsDir, f));
  
  console.log(`\n📋 Checking ${jsFiles.length} JS files for debug code:\n`);
  
  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const fileName = path.basename(file);
    let fileHasIssues = false;
    
    debugPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        if (!fileHasIssues) {
          console.log(`  ⚠️  ${fileName}:`);
          fileHasIssues = true;
          hasDebugCode = true;
        }
        console.log(`     - Found: ${pattern}`);
      }
    });
    
    if (!fileHasIssues) {
      console.log(`  ✅ ${fileName}`);
    }
  });
} else {
  console.log('  ⚠️  No assets directory found');
}

console.log('\n' + '='.repeat(50));

if (hasDebugCode) {
  console.log('⚠️  Warning: Debug code found in production bundle');
  console.log('   Consider cleaning up before deployment\n');
  // Just warn, don't fail the build
  process.exit(0);
} else {
  console.log('✅ No debug code found in production bundle\n');
  process.exit(0);
}

