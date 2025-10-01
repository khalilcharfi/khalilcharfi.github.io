#!/usr/bin/env node

/**
 * Validate TypeScript translations file for missing keys
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating TypeScript translations...\n');

// Read the translations file
const translationsPath = path.join(__dirname, '../translations.ts');
const content = fs.readFileSync(translationsPath, 'utf8');

// Extract all translation keys from the file
function extractKeysFromContent(content) {
  const keys = new Set();
  
  // Find all string keys in the content
  const keyRegex = /"([a-zA-Z_][a-zA-Z0-9_.]*)":\s*["`]/g;
  let match;
  
  while ((match = keyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

// Get all keys from the content
const allKeys = extractKeysFromContent(content);

// Define expected keys that should exist
const expectedKeys = [
  'nav.home', 'nav.about', 'nav.skills', 'nav.experience', 'nav.education', 'nav.projects', 'nav.publications', 'nav.certificates', 'nav.contact',
  'general.scrollToTop', 'general.closeModal', 'general.viewCertificate', 'general.loading', 'general.error', 'general.retry',
  'theme.toggleLight', 'theme.toggleDark', 'theme.changedToLight', 'theme.changedToDark',
  'languageSwitcher.label', 'languageSwitcher.en', 'languageSwitcher.de', 'languageSwitcher.fr', 'languageSwitcher.ar',
  'home.greeting', 'home.name', 'home.tagline', 'home.intro', 'home.viewWorkBtn', 'home.getInTouchBtn',
  'about.title', 'about.professionalSummary', 'about.keyHighlights', 'about.languages',
  'about.languages.arabic', 'about.languages.english', 'about.languages.french',
  'skills.title', 'skills.focusAI', 'skills.focusWebDev', 'skills.focusDataScience',
  'dynamicContent.professionalSummary', 'dynamicContent.expertInAI', 'dynamicContent.fullStackProficiency',
  'dynamicContent.problemSolving', 'dynamicContent.modernFrameworks'
];

// Check for missing keys
const missingKeys = expectedKeys.filter(key => !allKeys.includes(key));

console.log(`📊 Analysis Results:`);
console.log(`- Total keys found: ${allKeys.length}`);
console.log(`- Expected keys: ${expectedKeys.length}`);
console.log(`- Missing keys: ${missingKeys.length}`);

if (missingKeys.length > 0) {
  console.log(`\n❌ Missing Keys:`);
  missingKeys.forEach(key => {
    console.log(`  - ${key}`);
  });
  
  console.log(`\n🔧 To fix missing keys, run:`);
  console.log(`  npm run i18n:complete`);
  
  process.exit(1);
} else {
  console.log(`\n✅ All expected translation keys are present!`);
  process.exit(0);
}
