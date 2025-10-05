#!/usr/bin/env node

/**
 * Complete Translation Keys Script
 * Analyzes the translations.ts file and ensures all keys exist in all languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Completing all missing translation keys...\n');

// Read the translations file
const translationsPath = path.join(__dirname, '../translations.ts');
let content = fs.readFileSync(translationsPath, 'utf8');

// Define all the missing keys that need to be added
const missingKeys = {
  // About section missing keys
  'about.title': {
    en: 'About Me',
    de: 'Über Mich', 
    fr: 'À Propos de Moi',
    ar: 'عني'
  },
  'about.professionalSummary': {
    en: 'Full-stack engineer with extensive experience delivering scalable web and mobile applications. Skilled in front-end development with Vue.js and Angular, back-end with Laravel and Laminas, and mobile apps using Flutter and Ionic. Passionate about clean architecture, offline-first capabilities, and DevOps-driven deployment. Experienced in cross-functional teams across Tunisia and Germany.',
    de: 'Full-Stack-Ingenieur mit umfassender Erfahrung in der Bereitstellung skalierbarer Web- und Mobilanwendungen. Kompetent in der Frontend-Entwicklung mit Vue.js und Angular, Backend mit Laravel und Laminas sowie mobilen Apps mit Flutter und Ionic. Leidenschaft für saubere Architektur, Offline-First-Funktionen und DevOps-gesteuerte Bereitstellung. Erfahren in funktionsübergreifenden Teams in Tunesien und Deutschland.',
    fr: 'Ingénieur full-stack avec une vaste expérience dans la livraison d\'applications web et mobiles évolutives. Compétent en développement front-end avec Vue.js et Angular, back-end avec Laravel et Laminas, et applications mobiles utilisant Flutter et Ionic. Passionné par l\'architecture propre, les capacités hors ligne et le déploiement axé sur DevOps. Expérimenté dans des équipes interfonctionnelles en Tunisie et en Allemagne.',
    ar: 'مهندس متكامل ذو خبرة واسعة في تقديم تطبيقات الويب والجوال القابلة للتطوير. ماهر في تطوير الواجهة الأمامية باستخدام Vue.js و Angular، والواجهة الخلفية باستخدام Laravel و Laminas، وتطبيقات الجوال باستخدام Flutter و Ionic. شغوف بالهندسة النظيفة، وقدرات العمل دون اتصال بالإنترنت، والنشر الموجه بـ DevOps. من ذوي الخبرة في فرق متعددة الوظائف في تونس وألمانيا.'
  },
  'about.keyHighlights': {
    en: 'Key Highlights',
    de: 'Schlüsselmerkmale',
    fr: 'Points Fort',
    ar: 'النقاط القوية'
  },
  'about.languages': {
    en: 'Languages',
    de: 'Sprachen',
    fr: 'Langues',
    ar: 'اللغات'
  },
  'about.languages.arabic': {
    en: 'Arabic: Native',
    de: 'Arabisch: Muttersprache',
    fr: 'Arabe: Natif',
    ar: 'العربية: لغة أم'
  },
  'about.languages.english': {
    en: 'English: Fluent',
    de: 'Englisch: Fließend',
    fr: 'Anglais: Courant',
    ar: 'الإنجليزية: بطلاقة'
  },
  'about.languages.french': {
    en: 'French: Fluent',
    de: 'Französisch: Fließend',
    fr: 'Français: Courant',
    ar: 'الفرنسية: بطلاقة'
  },
  
  // Dynamic content missing keys
  'dynamicContent.professionalSummary': {
    en: 'Full-stack engineer with extensive experience delivering scalable web and mobile applications. Skilled in front-end development with Vue.js and Angular, back-end with Laravel and Laminas, and mobile apps using Flutter and Ionic. Passionate about clean architecture, offline-first capabilities, and DevOps-driven deployment. Experienced in cross-functional teams across Tunisia and Germany.',
    de: 'Full-Stack-Ingenieur mit umfassender Erfahrung in der Bereitstellung skalierbarer Web- und Mobilanwendungen. Kompetent in der Frontend-Entwicklung mit Vue.js und Angular, Backend mit Laravel und Laminas sowie mobilen Apps mit Flutter und Ionic. Leidenschaft für saubere Architektur, Offline-First-Funktionen und DevOps-gesteuerte Bereitstellung. Erfahren in funktionsübergreifenden Teams in Tunesien und Deutschland.',
    fr: 'Ingénieur full-stack avec une vaste expérience dans la livraison d\'applications web et mobiles évolutives. Compétent en développement front-end avec Vue.js et Angular, back-end avec Laravel et Laminas, et applications mobiles utilisant Flutter et Ionic. Passionné par l\'architecture propre, les capacités hors ligne et le déploiement axé sur DevOps. Expérimenté dans des équipes interfonctionnelles en Tunisie et en Allemagne.',
    ar: 'مهندس متكامل ذو خبرة واسعة في تقديم تطبيقات الويب والجوال القابلة للتطوير. ماهر في تطوير الواجهة الأمامية باستخدام Vue.js و Angular، والواجهة الخلفية باستخدام Laravel و Laminas، وتطبيقات الجوال باستخدام Flutter و Ionic. شغوف بالهندسة النظيفة، وقدرات العمل دون اتصال بالإنترنت، والنشر الموجه بـ DevOps. من ذوي الخبرة في فرق متعددة الوظائف في تونس وألمانيا.'
  },
  'dynamicContent.fullStackProficiency': {
    en: 'Full-stack web development proficiency',
    de: 'Kompetenz in der Full-Stack-Webentwicklung',
    fr: 'Compétence en développement web full-stack',
    ar: 'كفاءة في تطوير الويب الكامل'
  },
  'dynamicContent.problemSolving': {
    en: 'Strong problem-solving and analytical skills',
    de: 'Starke Problemlösungs- und Analysefähigkeiten',
    fr: 'Fortes compétences en résolution de problèmes et analyse',
    ar: 'مهارات قوية في حل المشكلات والتحليل'
  },
  'dynamicContent.modernFrameworks': {
    en: 'Experience with modern frameworks and technologies',
    de: 'Erfahrung mit modernen Frameworks und Technologien',
    fr: 'Expérience avec des frameworks et technologies modernes',
    ar: 'خبرة مع الإطارات والتقنيات الحديثة'
  }
};

// Function to add missing keys to the translations
function addMissingKeys(content, missingKeys) {
  let updatedContent = content;
  
  // For each missing key, add it to all languages
  Object.entries(missingKeys).forEach(([keyPath, translations]) => {
    const keyParts = keyPath.split('.');
    
    // Add to each language
    Object.entries(translations).forEach(([lang, value]) => {
      // Find the language section and add the key
      const langRegex = new RegExp(`"${lang}":\\s*\\{([\\s\\S]*?)\\}(?=\\s*[,}])`, 'g');
      
      updatedContent = updatedContent.replace(langRegex, (match, langContent) => {
        // Check if the key already exists
        const keyName = keyParts[keyParts.length - 1];
        const keyRegex = new RegExp(`"${keyName}"\\s*:`, 'g');
        
        if (keyRegex.test(langContent)) {
          return match; // Key already exists, don't add it
        }
        
        // Add the key to the language content
        const newKey = `"${keyName}": "${value}"`;
        const lastCommaIndex = langContent.lastIndexOf(',');
        
        if (lastCommaIndex !== -1) {
          // Add after the last comma
          const beforeComma = langContent.substring(0, lastCommaIndex + 1);
          const afterComma = langContent.substring(lastCommaIndex + 1);
          return `"${lang}": {${beforeComma}\n        ${newKey}${afterComma}}`;
        } else {
          // No comma found, add at the beginning
          return `"${lang}": {\n        ${newKey},\n        ${langContent.substring(1)}`;
        }
      });
    });
  });
  
  return updatedContent;
}

// Add the missing keys
const updatedContent = addMissingKeys(content, missingKeys);

// Write the updated content back to the file
fs.writeFileSync(translationsPath, updatedContent, 'utf8');

console.log('✅ Added missing translation keys:');
Object.keys(missingKeys).forEach(key => {
  console.log(`  - ${key}`);
});

console.log(`\n📁 Updated: ${translationsPath}`);
console.log(`\n🔍 Run 'npm run dev' to test the translations.`);

// Clean up temporary files
const tempFiles = ['temp-translations.json'];
tempFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Cleaned up: ${file}`);
  }
});

console.log(`\n🎉 Translation completion finished!`);
