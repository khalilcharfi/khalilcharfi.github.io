#!/usr/bin/env node

/**
 * CI Accessibility Testing Script
 * Tests accessibility against built files without requiring dev server
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(70) + '\n');
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkHTMLStructure(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic accessibility checks
    const checks = [
      { name: 'DOCTYPE declaration', test: /<!DOCTYPE\s+html>/i.test(content) },
      { name: 'HTML lang attribute', test: /<html[^>]*lang=/i.test(content) },
      { name: 'Title tag', test: /<title>/i.test(content) },
      { name: 'Meta charset', test: /<meta[^>]*charset/i.test(content) },
      { name: 'Meta viewport', test: /<meta[^>]*viewport/i.test(content) },
      { name: 'Alt attributes on images', test: /<img[^>]*alt=/i.test(content) },
      { name: 'Heading structure', test: /<h[1-6]/i.test(content) },
      { name: 'Form labels', test: /<label/i.test(content) || !/<input/i.test(content) },
      { name: 'ARIA attributes', test: /aria-/i.test(content) },
      { name: 'Skip links', test: /skip|skip-link/i.test(content) }
    ];
    
    let passed = 0;
    let total = checks.length;
    
    checks.forEach(check => {
      if (check.test) {
        log(`✅ ${check.name}`, colors.green);
        passed++;
      } else {
        log(`❌ ${check.name}`, colors.red);
      }
    });
    
    return { passed, total };
  } catch (error) {
    log(`❌ Error reading file: ${error.message}`, colors.red);
    return { passed: 0, total: 1 };
  }
}

function main() {
  logSection('🔍 CI Accessibility Testing Suite');
  log('Testing accessibility against built files\n', colors.blue);
  
  // Check if dist directory exists
  const distPath = path.join(process.cwd(), 'dist');
  if (!checkFileExists(distPath)) {
    log('❌ dist directory not found. Please run build first.', colors.red);
    process.exit(1);
  }
  
  // Check main HTML file
  const indexPath = path.join(distPath, 'index.html');
  if (!checkFileExists(indexPath)) {
    log('❌ index.html not found in dist directory.', colors.red);
    process.exit(1);
  }
  
  log('📄 Checking index.html...', colors.blue);
  const results = checkHTMLStructure(indexPath);
  
  // Check language-specific files
  const languages = ['de', 'fr', 'ar'];
  languages.forEach(lang => {
    const langFile = path.join(distPath, `index.${lang}.html`);
    if (checkFileExists(langFile)) {
      log(`📄 Checking index.${lang}.html...`, colors.blue);
      const langResults = checkHTMLStructure(langFile);
      results.passed += langResults.passed;
      results.total += langResults.total;
    }
  });
  
  // Summary
  logSection('📊 Accessibility Test Results');
  const percentage = Math.round((results.passed / results.total) * 100);
  
  if (percentage >= 80) {
    log(`✅ Accessibility Score: ${percentage}% (${results.passed}/${results.total})`, colors.green);
    log('🎉 Good accessibility practices detected!', colors.green);
  } else if (percentage >= 60) {
    log(`⚠️  Accessibility Score: ${percentage}% (${results.passed}/${results.total})`, colors.yellow);
    log('💡 Consider improving accessibility features.', colors.yellow);
  } else {
    log(`❌ Accessibility Score: ${percentage}% (${results.passed}/${results.total})`, colors.red);
    log('🚨 Significant accessibility issues detected!', colors.red);
  }
  
  // Always exit with success for CI (non-blocking)
  log('\n✅ CI accessibility check completed (non-blocking)', colors.green);
  process.exit(0);
}

main();
