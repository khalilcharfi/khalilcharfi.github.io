#!/usr/bin/env node

/**
 * HTML Template Generator with Handlebars
 * Generates index.html from translations data using Handlebars templates
 * No JavaScript required for content display
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🏗️  Generating index.html from Handlebars templates...\n');

// Load translations using tsx
console.log('📦 Loading translations from TypeScript...');
const translationsPath = path.join(__dirname, '../src/features/i18n/data/translations.ts');

let translations;
try {
  // Create a temporary script to extract translations
  const extractScript = `
    import { translations } from '${translationsPath}';
    console.log(JSON.stringify(translations, null, 2));
  `;
  
  const tempFile = path.join(__dirname, '../temp-extract.mjs');
  fs.writeFileSync(tempFile, extractScript);
  
  // Execute with tsx (TypeScript executor)
  const output = execSync(`npx tsx ${tempFile}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  translations = JSON.parse(output);
  
  // Clean up
  fs.unlinkSync(tempFile);
  console.log('✅ Translations loaded successfully\n');
} catch (e) {
  console.error('❌ Error loading translations:', e.message);
  console.error('Exiting...\n');
  process.exit(1);
}

// Profile data
const profile = {
  name: translations.en.home.name.replace('.', ''),
  title: 'Full-Stack Engineer | Software Developer | Digital Solutions Architect',
  location: 'Frankfurt, Germany',
  status: 'Available for Remote & On-site Opportunities',
  email: 'Available on LinkedIn',
  linkedin: 'https://www.linkedin.com/in/khalil-charfi/',
  github: 'https://github.com/khalil-charfi',
  photo: 'https://khalilcharfi.github.io/asset/profile-photo.jpg',
  website: 'https://khalilcharfi.github.io/',
};

// Create JSON-LD structured data
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": profile.name,
  "url": profile.website,
  "image": profile.photo,
  "sameAs": [profile.github, profile.linkedin],
  "jobTitle": "Full-Stack Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Independent"
  },
  "description": translations.en.about.professionalSummary,
  "knowsAbout": translations.en.skills.categories.frontend.items.concat(
    translations.en.skills.categories.backend.items
  ).slice(0, 8),
  "inLanguage": ["en", "de", "fr", "ar"],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": translations.en.education.items[0].institution
  }
}, null, 2);

// Register Handlebars helpers
Handlebars.registerHelper('lt', function(a, b) {
  return a < b;
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Load and register partials
console.log('📄 Loading Handlebars templates...');
const partialsDir = path.join(__dirname, '../templates/partials');
const partialFiles = fs.readdirSync(partialsDir);

partialFiles.forEach(file => {
  if (file.endsWith('.hbs')) {
    const partialName = file.replace('.hbs', '');
    const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf8');
    Handlebars.registerPartial(partialName, partialContent);
  }
});

// Load main template
const templatePath = path.join(__dirname, '../templates/index.hbs');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(templateSource);

console.log('✅ Templates loaded successfully\n');

// Generate HTML for all languages
console.log('🔨 Generating HTML for all languages...\n');

const languages = ['en', 'de', 'fr', 'ar'];
const generatedFiles = [];

// Generate default index.html (English)
console.log('📝 Generating index.html (default: English)...');
const defaultHtml = template({
  lang: 'en',
  profile,
  t: translations.en,
  allTranslations: translations, // Pass all translations for i18n attributes
  jsonLd
});

const defaultPath = path.join(__dirname, '../index.html');
fs.writeFileSync(defaultPath, defaultHtml, 'utf8');
generatedFiles.push({ lang: 'en', path: defaultPath, size: defaultHtml.length });
console.log(`   ✓ index.html (${(defaultHtml.length / 1024).toFixed(2)} KB)\n`);

// Generate language-specific versions
console.log('🌐 Generating language-specific versions...');
languages.forEach(lang => {
  if (lang === 'en') return; // Skip default, already generated
  
  const langHtml = template({
    lang,
    profile,
    t: translations[lang],
    allTranslations: translations,
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.name,
      "url": profile.website,
      "image": profile.photo,
      "sameAs": [profile.github, profile.linkedin],
      "jobTitle": "Full-Stack Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "Independent"
      },
      "description": translations[lang].about.professionalSummary,
      "knowsAbout": translations[lang].skills.categories.frontend.items.concat(
        translations[lang].skills.categories.backend.items
      ).slice(0, 8),
      "inLanguage": ["en", "de", "fr", "ar"],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": translations[lang].education.items[0].institution
      }
    }, null, 2)
  });
  
  const langPath = path.join(__dirname, `../index.${lang}.html`);
  fs.writeFileSync(langPath, langHtml, 'utf8');
  generatedFiles.push({ lang, path: langPath, size: langHtml.length });
  console.log(`   ✓ index.${lang}.html (${(langHtml.length / 1024).toFixed(2)} KB)`);
});

console.log('\n✅ Successfully generated all HTML files\n');
console.log('📊 Statistics:');
console.log(`   Files generated: ${generatedFiles.length}`);
console.log(`   Languages: ${languages.join(', ')}`);
console.log(`   Total size: ${(generatedFiles.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2)} KB`);
console.log(`   Partials: ${partialFiles.length}`);
console.log('\n📁 Generated files:');
generatedFiles.forEach(f => {
  console.log(`   - ${path.basename(f.path)} (${f.lang})`);
});
console.log('\n🎯 Features:');
console.log('   ✓ Multi-language static HTML generation');
console.log('   ✓ Dynamic content from translations');
console.log('   ✓ Client-side language detection with JS');
console.log('   ✓ Server-side language-specific files');
console.log('   ✓ No JavaScript required for content');
console.log('   ✓ Schema.org microdata per language');
console.log('   ✓ SEO optimized with hreflang');
console.log('   ✓ RTL support for Arabic');
console.log('\n💡 Usage:');
console.log('   Default (EN): https://example.com/');
console.log('   German:       https://example.com/index.de.html');
console.log('   French:       https://example.com/index.fr.html');
console.log('   Arabic:       https://example.com/index.ar.html');
console.log('   With JS:      https://example.com/?lang=de (auto-detects)');
console.log('\n💡 Commands:');
console.log('   Regenerate: npm run generate:html');
console.log('   Test no-JS: npm run test:no-js');
console.log('   Build: npm run build\n');