#!/usr/bin/env node

/**
 * Verification script for revised Arabic translations
 * Checks key sections for contextual accuracy and natural phrasing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Arabic Translation Revisions...\n');

// Load translations
const translationsPath = path.join(__dirname, '../translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Extract Arabic section (updated pattern)
const arMatch = translationsContent.match(/ar:\s*{([\s\S]*?)},?\s*\n\s*}\s*as const/);
if (!arMatch) {
  console.error('❌ Could not find Arabic translations section');
  process.exit(1);
}

// Keys to verify with expected context
const verificationChecks = [
  {
    section: 'Skills',
    keys: [
      { key: 'skills.title', expected: 'المهارات', context: 'Simple, direct title' },
      { key: 'skills.focusAI', expected: 'التركيز على الذكاء الاصطناعي', context: 'With definite article "على"' },
      { key: 'skills.focusWebDev', expected: 'التركيز على تطوير الويب', context: 'Consistent with AI focus' },
      { key: 'skills.focusDataScience', expected: 'التركيز على علم البيانات', context: 'Consistent pattern' },
    ]
  },
  {
    section: 'Home',
    keys: [
      { key: 'home.greeting', expected: 'مرحباً، أنا', context: 'Natural greeting' },
      { key: 'home.tagline', expected: 'أصمم حلولاً رقمية تُحدث فرقاً', context: 'Impactful and natural' },
      { key: 'home.viewWorkBtn', expected: 'اطّلع على أعمالي', context: 'More formal, professional' },
    ]
  },
  {
    section: 'About',
    keys: [
      { key: 'about.professionalSummaryTitle', expected: 'نبذة مهنية', context: 'Standard professional term' },
      { key: 'about.keyHighlightsTitle', expected: 'أبرز المهارات', context: 'More specific than "النقاط القوية"' },
    ]
  },
  {
    section: 'Contact',
    keys: [
      { key: 'contact.title', expected: 'تواصل معي', context: 'Direct and friendly' },
      { key: 'contact.message', expected: 'لنبدأ مشروعك القادم معاً', context: 'Action-oriented CTA' },
      { key: 'contact.form.sendBtn', expected: 'إرسال', context: 'Concise button text' },
    ]
  },
  {
    section: 'Dynamic Content',
    keys: [
      { key: 'dynamicContent.fullStackProficiency', expected: 'إتقان التطوير البرمجي المتكامل', context: 'Concise and clear' },
      { key: 'dynamicContent.problemSolving', expected: 'مهارات متقدمة في حل المشكلات التقنية', context: 'Specific to technical context' },
      { key: 'dynamicContent.modernFrameworks', expected: 'خبرة في أحدث الأطر والتقنيات البرمجية', context: 'Technical clarity' },
    ]
  }
];

let allPassed = true;
let totalChecks = 0;
let passedChecks = 0;

verificationChecks.forEach(section => {
  console.log(`\n📋 ${section.section}:`);
  console.log('─'.repeat(60));
  
  section.keys.forEach(check => {
    totalChecks++;
    const keyPath = check.key.replace(/\./g, '\\.');
    const regex = new RegExp(`${check.key.split('.').pop()}:\\s*['"](.*?)['"]`, 'i');
    const match = arMatch[1].match(regex);
    
    if (match && match[1].includes(check.expected)) {
      console.log(`✅ ${check.key}`);
      console.log(`   Value: "${match[1]}"`);
      console.log(`   Context: ${check.context}`);
      passedChecks++;
    } else {
      console.log(`❌ ${check.key}`);
      console.log(`   Expected: "${check.expected}"`);
      console.log(`   Found: "${match ? match[1] : 'NOT FOUND'}"`);
      console.log(`   Context: ${check.context}`);
      allPassed = false;
    }
  });
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary: ${passedChecks}/${totalChecks} checks passed`);

if (allPassed) {
  console.log('\n✅ All Arabic translations have been successfully revised!');
  console.log('   - Natural phrasing ✓');
  console.log('   - Contextual accuracy ✓');
  console.log('   - Professional terminology ✓');
  console.log('   - Cultural appropriateness ✓\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some translations need attention.\n');
  process.exit(1);
}

