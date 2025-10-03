#!/usr/bin/env node

/**
 * Comprehensive i18n Scanner
 * Scans the entire codebase for translation key usage and validates completeness
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Comprehensive i18n Scanner...\n');

// Load translations
const translationsPath = path.join(__dirname, '../translations.ts');
let translations = {};

try {
  const content = fs.readFileSync(translationsPath, 'utf8');
  const translationsMatch = content.match(/export const translations: Translations = ({[\s\S]*});/);
  if (translationsMatch) {
    translations = eval(`(${translationsMatch[1]})`);
    console.log('✅ Translations loaded successfully');
  }
} catch (error) {
  console.error('❌ Error loading translations:', error.message);
  process.exit(1);
}

// Helper function to get nested property
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Extract translation keys from code
function extractTranslationKeys(content) {
  const keys = new Set();
  
  // Pattern 1: t('key') or t("key")
  const tPattern = /t\(['"`]([^'"`]+)['"`]\)/g;
  let match;
  while ((match = tPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  // Pattern 2: personalizedContent.section.key
  const personalizedPattern = /personalizedContent\.([a-zA-Z]+)\.([a-zA-Z]+)/g;
  while ((match = personalizedPattern.exec(content)) !== null) {
    keys.add(`${match[1]}.${match[2]}`);
  }
  
  // Pattern 3: Dynamic content keys in dynamicContent.tsx
  const dynamicPattern = /t\(['"`]([^'"`]*dynamicContent[^'"`]*)['"`]\)/g;
  while ((match = dynamicPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

// Scan all relevant files
async function scanFiles() {
  const patterns = [
    'index.tsx',
    'src/**/*.tsx',
    'src/**/*.ts',
    'dynamicContent.tsx',
    '*.tsx'
  ];
  
  const allKeys = new Set();
  const fileResults = [];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, { 
        cwd: path.join(__dirname, '..'),
        ignore: ['node_modules/**', 'dist/**', 'scripts/**']
      });
      
      for (const file of files) {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const keys = extractTranslationKeys(content);
          
          if (keys.length > 0) {
            fileResults.push({ file, keys });
            keys.forEach(key => allKeys.add(key));
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan pattern ${pattern}:`, error.message);
    }
  }
  
  return { allKeys: Array.from(allKeys), fileResults };
}

// Validate keys across all languages
function validateKeys(keys, languages = ['en', 'de', 'fr', 'ar']) {
  const results = {
    total: keys.length * languages.length,
    found: 0,
    missing: [],
    keyStatus: {}
  };
  
  keys.forEach(key => {
    results.keyStatus[key] = {};
    
    languages.forEach(lang => {
      const value = getNestedProperty(translations[lang], key);
      const exists = value && typeof value === 'string' && value.trim() !== '';
      
      results.keyStatus[key][lang] = {
        exists,
        value: exists ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : null
      };
      
      if (exists) {
        results.found++;
      } else {
        results.missing.push(`${lang}.${key}`);
      }
    });
  });
  
  return results;
}

// Main execution
async function main() {
  console.log('📁 Scanning files for translation keys...');
  const { allKeys, fileResults } = await scanFiles();
  
  console.log(`\n📊 Scan Results:`);
  console.log(`- Files scanned: ${fileResults.length}`);
  console.log(`- Unique translation keys found: ${allKeys.length}`);
  
  if (fileResults.length > 0) {
    console.log('\n📝 Keys found per file:');
    fileResults.forEach(({ file, keys }) => {
      console.log(`  ${file}: ${keys.length} keys`);
      if (keys.length <= 10) {
        keys.forEach(key => console.log(`    - ${key}`));
      } else {
        keys.slice(0, 5).forEach(key => console.log(`    - ${key}`));
        console.log(`    ... and ${keys.length - 5} more`);
      }
    });
  }
  
  console.log('\n🌐 Validating translations...');
  const validation = validateKeys(allKeys);
  
  console.log(`\n📈 Validation Results:`);
  console.log(`- Total checks: ${validation.total}`);
  console.log(`- Found: ${validation.found}`);
  console.log(`- Missing: ${validation.missing.length}`);
  console.log(`- Completion rate: ${((validation.found / validation.total) * 100).toFixed(1)}%`);
  
  // Show detailed results
  console.log('\n🔍 Detailed Key Analysis:');
  Object.entries(validation.keyStatus).forEach(([key, langs]) => {
    const missingLangs = Object.entries(langs).filter(([, info]) => !info.exists).map(([lang]) => lang);
    
    if (missingLangs.length === 0) {
      console.log(`  ✅ ${key} - Complete in all languages`);
    } else {
      console.log(`  ❌ ${key} - Missing in: ${missingLangs.join(', ')}`);
    }
  });
  
  if (validation.missing.length > 0) {
    console.log('\n⚠️  Missing Translations:');
    validation.missing.forEach(missing => {
      console.log(`  - ${missing}`);
    });
    
    console.log('\n💡 Recommendations:');
    console.log('1. Add missing translations to translations.ts');
    console.log('2. Run the verification script again');
    console.log('3. Test language switching in the application');
    
    process.exit(1);
  } else {
    console.log('\n🎉 All translation keys are complete!');
    console.log('✨ Your i18n implementation is ready for production.');
  }
}

// Run the scanner
main().catch(error => {
  console.error('❌ Scanner error:', error);
  process.exit(1);
});
