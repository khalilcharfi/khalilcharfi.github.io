#!/usr/bin/env node

/**
 * Comprehensive Translation Validation Script
 * Identifies missing, extra, and inconsistent translation keys across all languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the translations file - try both locations
let translationsPath = path.join(__dirname, '../src/data/translations.ts');
if (!fs.existsSync(translationsPath)) {
  translationsPath = path.join(__dirname, '../translations.ts');
}

if (!fs.existsSync(translationsPath)) {
  console.error('❌ Could not find translations.ts file');
  process.exit(1);
}

// Import and evaluate the TypeScript file using dynamic import
let translations;
try {
  // Create a temporary JS file by removing TypeScript types
  const translationsContent = fs.readFileSync(translationsPath, 'utf8');
  
  // Extract just the translations object value
  const exportMatch = translationsContent.match(/export const translations(?:: Translations)? = (\{[\s\S]*?\n\});?\s*$/m);
  if (!exportMatch) {
    console.error('❌ Could not parse translations.ts file structure');
    process.exit(1);
  }
  
  // Create a temporary file that exports the translations as a module
  const tempFile = path.join(__dirname, '../temp-translations.mjs');
  const jsContent = `export const translations = ${exportMatch[1]};`;
  fs.writeFileSync(tempFile, jsContent, 'utf8');
  
  // Import the temporary file
  const module = await import(`file://${tempFile}`);
  translations = module.translations;
  
  // Clean up temp file
  fs.unlinkSync(tempFile);
} catch (error) {
  console.error('❌ Error loading translations:', error.message);
  console.error('This might be due to:');
  console.error('1. Invalid JavaScript syntax in translations.ts');
  console.error('2. Unescaped special characters in strings');
  console.error('3. Malformed object structure');
  process.exit(1);
}

// Get all supported languages
const supportedLanguages = Object.keys(translations);
const baseLanguage = 'en';

console.log('🌐 Translation Validation Report');
console.log('================================\n');

// Helper function to get all nested keys
function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

// Helper function to get nested value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Get all keys from base language
const baseKeys = getAllKeys(translations[baseLanguage]);
console.log(`📊 Base language (${baseLanguage}): ${baseKeys.length} keys`);

// Validate each language
const results = {
  missing: {},
  extra: {},
  inconsistent: {},
  summary: {
    totalLanguages: supportedLanguages.length,
    totalKeys: baseKeys.length,
    missingCount: 0,
    extraCount: 0,
    inconsistentCount: 0
  }
};

supportedLanguages.forEach(lang => {
  if (lang === baseLanguage) return;
  
  const langKeys = getAllKeys(translations[lang]);
  const missing = baseKeys.filter(key => !langKeys.includes(key));
  const extra = langKeys.filter(key => !baseKeys.includes(key));
  const inconsistent = [];
  
  // Check for inconsistent values (different types or structures)
  baseKeys.forEach(key => {
    const baseValue = getNestedValue(translations[baseLanguage], key);
    const langValue = getNestedValue(translations[lang], key);
    
    if (baseValue !== undefined && langValue !== undefined) {
      const baseType = typeof baseValue;
      const langType = typeof langValue;
      
      // Check if types are different
      if (baseType !== langType) {
        inconsistent.push(`${key} (type: ${baseType} vs ${langType})`);
      }
      
      // Check if arrays have different lengths
      if (Array.isArray(baseValue) && Array.isArray(langValue)) {
        if (baseValue.length !== langValue.length) {
          inconsistent.push(`${key} (array length: ${baseValue.length} vs ${langValue.length})`);
        }
      }
      
      // Check if objects have different structures
      if (baseType === 'object' && langType === 'object' && !Array.isArray(baseValue) && !Array.isArray(langValue)) {
        const baseObjKeys = Object.keys(baseValue);
        const langObjKeys = Object.keys(langValue);
        
        if (baseObjKeys.length !== langObjKeys.length || !baseObjKeys.every(k => langObjKeys.includes(k))) {
          inconsistent.push(`${key} (object structure differs)`);
        }
      }
    }
  });
  
  if (missing.length > 0) {
    results.missing[lang] = missing;
    results.summary.missingCount += missing.length;
  }
  
  if (extra.length > 0) {
    results.extra[lang] = extra;
    results.summary.extraCount += extra.length;
  }
  
  if (inconsistent.length > 0) {
    results.inconsistent[lang] = inconsistent;
    results.summary.inconsistentCount += inconsistent.length;
  }
});

// Print summary
console.log(`\n📈 Summary:`);
console.log(`- Total Languages: ${results.summary.totalLanguages}`);
console.log(`- Total Keys: ${results.summary.totalKeys}`);
console.log(`- Missing Keys: ${results.summary.missingCount}`);
console.log(`- Extra Keys: ${results.summary.extraCount}`);
console.log(`- Inconsistent Keys: ${results.summary.inconsistentCount}`);
console.log(`- Overall Status: ${results.summary.missingCount === 0 && results.summary.extraCount === 0 && results.summary.inconsistentCount === 0 ? '✅ Valid' : '❌ Issues Found'}`);

// Print detailed results
if (Object.keys(results.missing).length > 0) {
  console.log(`\n❌ Missing Keys:`);
  Object.entries(results.missing).forEach(([lang, keys]) => {
    console.log(`  ${lang}: ${keys.length} missing`);
    keys.slice(0, 10).forEach(key => console.log(`    - ${key}`));
    if (keys.length > 10) console.log(`    ... and ${keys.length - 10} more`);
  });
}

if (Object.keys(results.extra).length > 0) {
  console.log(`\n➕ Extra Keys:`);
  Object.entries(results.extra).forEach(([lang, keys]) => {
    console.log(`  ${lang}: ${keys.length} extra`);
    keys.slice(0, 10).forEach(key => console.log(`    - ${key}`));
    if (keys.length > 10) console.log(`    ... and ${keys.length - 10} more`);
  });
}

if (Object.keys(results.inconsistent).length > 0) {
  console.log(`\n⚠️  Inconsistent Keys:`);
  Object.entries(results.inconsistent).forEach(([lang, keys]) => {
    console.log(`  ${lang}: ${keys.length} inconsistent`);
    keys.slice(0, 10).forEach(key => console.log(`    - ${key}`));
    if (keys.length > 10) console.log(`    ... and ${keys.length - 10} more`);
  });
}

// Generate fix suggestions
if (results.summary.missingCount > 0) {
  console.log(`\n🔧 Fix Suggestions:`);
  console.log(`1. Add missing keys to translation files`);
  console.log(`2. Run: npm run i18n:fix-missing`);
  console.log(`3. Review and translate the added keys`);
}

// Exit with error code if issues found
if (results.summary.missingCount > 0 || results.summary.extraCount > 0 || results.summary.inconsistentCount > 0) {
  process.exit(1);
} else {
  console.log(`\n✅ All translations are valid!`);
  process.exit(0);
}
