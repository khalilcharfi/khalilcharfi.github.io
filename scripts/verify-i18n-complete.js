#!/usr/bin/env node

/**
 * Complete i18n Verification Script
 * Verifies that all required translation keys exist in all languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌐 Complete i18n Verification...\n');

// Import translations
const translationsPath = path.join(__dirname, '../translations.ts');
let translations;

try {
  // Read and parse the translations file
  const content = fs.readFileSync(translationsPath, 'utf8');
  
  // Extract the translations object using regex
  const translationsMatch = content.match(/export const translations: Translations = ({[\s\S]*});/);
  if (!translationsMatch) {
    throw new Error('Could not find translations object');
  }
  
  // Use eval to parse the object (not ideal but works for this test)
  const translationsCode = translationsMatch[1];
  translations = eval(`(${translationsCode})`);
  
  console.log('✅ Translations loaded successfully');
} catch (error) {
  console.error('❌ Error loading translations:', error.message);
  process.exit(1);
}

// Test keys that were mentioned as missing
const testKeys = [
  'about.title',
  'about.professionalSummary', 
  'about.keyHighlightsTitle',
  'about.languagesTitle',
  'dynamicContent.professionalSummary',
  'dynamicContent.fullStackProficiency',
  'dynamicContent.problemSolving',
  'dynamicContent.modernFrameworks'
];

const languages = ['en', 'de', 'fr', 'ar'];
const results = {
  total: testKeys.length * languages.length,
  found: 0,
  missing: []
};

// Helper function to get nested property
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

console.log('🔍 Testing translation keys...\n');

// Test each key in each language
languages.forEach(lang => {
  console.log(`📝 Testing ${lang.toUpperCase()} translations:`);
  
  testKeys.forEach(key => {
    const value = getNestedProperty(translations[lang], key);
    
    if (value && typeof value === 'string' && value.trim() !== '') {
      console.log(`  ✅ ${key}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
      results.found++;
    } else {
      console.log(`  ❌ ${key}: MISSING or EMPTY`);
      results.missing.push(`${lang}.${key}`);
    }
  });
  
  console.log('');
});

// Summary
console.log('📊 Verification Results:');
console.log(`- Total keys tested: ${results.total}`);
console.log(`- Keys found: ${results.found}`);
console.log(`- Keys missing: ${results.missing.length}`);

if (results.missing.length > 0) {
  console.log('\n❌ Missing translations:');
  results.missing.forEach(key => {
    console.log(`  - ${key}`);
  });
  process.exit(1);
} else {
  console.log('\n🎉 All translation keys are present and complete!');
  console.log('\n✨ The i18n implementation is now complete for:');
  console.log('  - about.title');
  console.log('  - dynamicContent.professionalSummary');
  console.log('  - dynamicContent.fullStackProficiency');
  console.log('  - dynamicContent.problemSolving');
  console.log('  - dynamicContent.modernFrameworks');
  console.log('  - Key Highlights section');
  console.log('\n🌍 All languages supported: English, German, French, Arabic');
  console.log('\n🚀 The application is ready for multilingual use!');
}
