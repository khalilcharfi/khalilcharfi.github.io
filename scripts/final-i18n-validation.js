#!/usr/bin/env node

/**
 * Final i18n Validation
 * Validates the originally requested keys and critical translation keys
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 Final i18n Validation...\n');

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

// Originally requested keys
const originallyRequestedKeys = [
  'about.title',
  'dynamicContent.professionalSummary',
  'dynamicContent.expertInAI',
  'dynamicContent.fullStackProficiency',
  'dynamicContent.problemSolving',
  'dynamicContent.modernFrameworks'
];

// Critical application keys (commonly used)
const criticalKeys = [
  'nav.home',
  'nav.about',
  'nav.skills',
  'nav.experience',
  'nav.education',
  'nav.projects',
  'nav.publications',
  'nav.certificates',
  'nav.contact',
  'home.greeting',
  'home.name',
  'home.tagline',
  'home.intro',
  'home.viewWorkBtn',
  'home.getInTouchBtn',
  'about.keyHighlightsTitle',
  'about.languagesTitle',
  'skills.title',
  'experience.title',
  'education.title',
  'projects.title',
  'publications.title',
  'certificates.title',
  'contact.title',
  'contact.message',
  'footer.copyright',
  'footer.credits',
  'chatbot.title',
  'chatbot.placeholder',
  'chatbot.send',
  'general.scrollToTop',
  'general.loading'
];

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
function main() {
  console.log('🎯 Validating Originally Requested Keys...');
  const originalValidation = validateKeys(originallyRequestedKeys);
  
  console.log(`\n📊 Original Keys Results:`);
  console.log(`- Keys requested: ${originallyRequestedKeys.length}`);
  console.log(`- Total checks: ${originalValidation.total}`);
  console.log(`- Found: ${originalValidation.found}`);
  console.log(`- Missing: ${originalValidation.missing.length}`);
  console.log(`- Completion rate: ${((originalValidation.found / originalValidation.total) * 100).toFixed(1)}%`);
  
  console.log('\n🔍 Original Keys Status:');
  originallyRequestedKeys.forEach(key => {
    const langs = originalValidation.keyStatus[key];
    const missingLangs = Object.entries(langs).filter(([, info]) => !info.exists).map(([lang]) => lang);
    
    if (missingLangs.length === 0) {
      console.log(`  ✅ ${key} - Complete in all languages`);
    } else {
      console.log(`  ❌ ${key} - Missing in: ${missingLangs.join(', ')}`);
    }
  });
  
  console.log('\n🔧 Validating Critical Application Keys...');
  const criticalValidation = validateKeys(criticalKeys);
  
  console.log(`\n📊 Critical Keys Results:`);
  console.log(`- Keys checked: ${criticalKeys.length}`);
  console.log(`- Total checks: ${criticalValidation.total}`);
  console.log(`- Found: ${criticalValidation.found}`);
  console.log(`- Missing: ${criticalValidation.missing.length}`);
  console.log(`- Completion rate: ${((criticalValidation.found / criticalValidation.total) * 100).toFixed(1)}%`);
  
  // Show only missing critical keys
  const missingCritical = [];
  criticalKeys.forEach(key => {
    const langs = criticalValidation.keyStatus[key];
    const missingLangs = Object.entries(langs).filter(([, info]) => !info.exists).map(([lang]) => lang);
    
    if (missingLangs.length > 0) {
      missingCritical.push({ key, missingLangs });
    }
  });
  
  if (missingCritical.length > 0) {
    console.log('\n⚠️  Missing Critical Keys:');
    missingCritical.forEach(({ key, missingLangs }) => {
      console.log(`  ❌ ${key} - Missing in: ${missingLangs.join(', ')}`);
    });
  } else {
    console.log('\n✅ All critical keys are complete!');
  }
  
  // Final summary
  const allMissing = [...originalValidation.missing, ...criticalValidation.missing];
  
  if (originalValidation.missing.length === 0) {
    console.log('\n🎉 SUCCESS: All originally requested keys are complete!');
    console.log('\n✨ The following keys are working perfectly:');
    originallyRequestedKeys.forEach(key => {
      console.log(`  ✅ ${key}`);
    });
    
    if (criticalValidation.missing.length === 0) {
      console.log('\n🚀 BONUS: All critical application keys are also complete!');
      console.log('\n🌍 Your i18n implementation is production-ready with full language support:');
      console.log('  🇺🇸 English (en)');
      console.log('  🇩🇪 German (de)');
      console.log('  🇫🇷 French (fr)');
      console.log('  🇸🇦 Arabic (ar)');
      
      return true;
    } else {
      console.log('\n⚠️  Some critical keys are missing, but the original request is complete.');
      return true;
    }
  } else {
    console.log('\n❌ Some originally requested keys are still missing.');
    console.log('\n💡 Missing keys to fix:');
    originalValidation.missing.forEach(missing => {
      console.log(`  - ${missing}`);
    });
    
    return false;
  }
}

// Run the validation
const success = main();
process.exit(success ? 0 : 1);
