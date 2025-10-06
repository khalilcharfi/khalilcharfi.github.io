#!/usr/bin/env node

/**
 * Auto-fix Missing Translation Keys
 * Adds missing keys with placeholder values to all languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the translations file - try multiple locations
let translationsPath = path.join(__dirname, '../src/features/i18n/data/translations.ts');
if (!fs.existsSync(translationsPath)) {
  translationsPath = path.join(__dirname, '../src/data/translations.ts');
}
if (!fs.existsSync(translationsPath)) {
  translationsPath = path.join(__dirname, '../translations.ts');
}

if (!fs.existsSync(translationsPath)) {
  console.error('❌ Could not find translations.ts file');
  process.exit(1);
}

let translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Parse the translations using the same method as validate-translations.js
let translations;
try {
  // Extract just the translations object value
  const exportMatch = translationsContent.match(/export const translations(?:: Translations)? = (\{[\s\S]*?\n\});?\s*$/m);
  if (!exportMatch) {
    console.error('❌ Could not parse translations.ts file structure');
    process.exit(1);
  }
  
  // Create a temporary file that exports the translations as a module
  const tempFile = path.join(__dirname, '../temp-translations-fix.mjs');
  const jsContent = `export const translations = ${exportMatch[1]};`;
  fs.writeFileSync(tempFile, jsContent, 'utf8');
  
  // Import the temporary file
  const module = await import(`file://${tempFile}`);
  translations = module.translations;
  
  // Clean up temp file
  fs.unlinkSync(tempFile);
} catch (error) {
  console.error('❌ Error parsing translations:', error.message);
  process.exit(1);
}

const supportedLanguages = Object.keys(translations);
const baseLanguage = 'en';

console.log('🔧 Auto-fixing missing translation keys...\n');

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

// Helper function to set nested value
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Helper function to get nested value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Get all keys from base language
const baseKeys = getAllKeys(translations[baseLanguage]);
let totalFixed = 0;

// Fix each language
supportedLanguages.forEach(lang => {
  if (lang === baseLanguage) return;
  
  const langKeys = getAllKeys(translations[lang]);
  const missing = baseKeys.filter(key => !langKeys.includes(key));
  
  if (missing.length > 0) {
    console.log(`📝 Fixing ${lang}: ${missing.length} missing keys`);
    
    missing.forEach(key => {
      const baseValue = getNestedValue(translations[baseLanguage], key);
      
      // Create placeholder value based on the base value
      let placeholderValue;
      if (typeof baseValue === 'string') {
        placeholderValue = `[${lang.toUpperCase()}] ${baseValue}`;
      } else if (Array.isArray(baseValue)) {
        placeholderValue = baseValue.map(item => `[${lang.toUpperCase()}] ${item}`);
      } else if (typeof baseValue === 'object' && baseValue !== null) {
        // For objects, we'll create a placeholder structure
        placeholderValue = `[${lang.toUpperCase()}] Object placeholder`;
      } else {
        placeholderValue = `[${lang.toUpperCase()}] ${String(baseValue)}`;
      }
      
      setNestedValue(translations[lang], key, placeholderValue);
      totalFixed++;
    });
  }
});

// Write the updated translations back to file
if (totalFixed > 0) {
  // Convert the translations object back to TypeScript format
  const updatedTranslations = `export const translations: Translations = ${JSON.stringify(translations, null, 2)};`;
  
  // Replace the translations in the file
  const newContent = translationsContent.replace(
    /export const translations: Translations = \{[\s\S]*?\};/,
    updatedTranslations
  );
  
  fs.writeFileSync(translationsPath, newContent, 'utf8');
  
  console.log(`\n✅ Fixed ${totalFixed} missing translation keys!`);
  console.log(`📁 Updated: ${translationsPath}`);
  console.log(`\n⚠️  Please review and translate the placeholder values marked with [LANG]`);
} else {
  console.log(`\n✅ No missing translation keys found!`);
}

console.log(`\n🔍 Run 'npm run i18n:validate' to verify all translations are complete.`);
