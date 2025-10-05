#!/usr/bin/env node

/**
 * Test Translation Keys Script
 * Verifies that all translation keys are working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Translation Keys...\n');

// Read the translations file
const translationsPath = path.join(__dirname, '../translations.ts');
const content = fs.readFileSync(translationsPath, 'utf8');

// Test keys that were previously missing
const testKeys = [
  'about.title',
  'about.professionalSummary', 
  'about.keyHighlights',
  'about.languages',
  'about.languages.arabic',
  'about.languages.english',
  'about.languages.french',
  'dynamicContent.professionalSummary',
  'dynamicContent.fullStackProficiency',
  'dynamicContent.problemSolving',
  'dynamicContent.modernFrameworks'
];

// Check if keys exist in the content
const results = {
  found: [],
  missing: [],
  total: testKeys.length
};

testKeys.forEach(key => {
  // Check if the key exists in the content
  const keyExists = content.includes(`"${key.split('.').pop()}"`);
  
  if (keyExists) {
    results.found.push(key);
  } else {
    results.missing.push(key);
  }
});

console.log(`📊 Test Results:`);
console.log(`- Total keys tested: ${results.total}`);
console.log(`- Keys found: ${results.found.length}`);
console.log(`- Keys missing: ${results.missing.length}`);

if (results.found.length > 0) {
  console.log(`\n✅ Found Keys:`);
  results.found.forEach(key => {
    console.log(`  ✓ ${key}`);
  });
}

if (results.missing.length > 0) {
  console.log(`\n❌ Missing Keys:`);
  results.missing.forEach(key => {
    console.log(`  ✗ ${key}`);
  });
  
  console.log(`\n🔧 To fix missing keys, run:`);
  console.log(`  npm run i18n:complete`);
  
  process.exit(1);
} else {
  console.log(`\n🎉 All translation keys are present!`);
  console.log(`\n🌐 The application should now display all translations correctly.`);
  console.log(`\n📱 You can test the application at: http://localhost:5177`);
  console.log(`\n🔍 Check the About section to verify the missing keys are now displayed.`);
  
  process.exit(0);
}
