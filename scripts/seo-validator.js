/**
 * SEO Validation Script
 * Checks for common SEO issues in the built site
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const errors = [];
const warnings = [];
const passes = [];

const addError = (message) => errors.push(`❌ ${message}`);
const addWarning = (message) => warnings.push(`⚠️  ${message}`);
const addPass = (message) => passes.push(`✅ ${message}`);

// Check if file exists
const checkFile = (filepath, name) => {
  if (existsSync(filepath)) {
    addPass(`${name} exists`);
    return true;
  } else {
    addError(`${name} is missing`);
    return false;
  }
};

// Validate HTML meta tags
const validateHTML = (htmlPath) => {
  if (!existsSync(htmlPath)) {
    addError('index.html not found');
    return;
  }

  const html = readFileSync(htmlPath, 'utf-8');

  // Check for essential meta tags
  const checks = [
    { regex: /<title>.*?<\/title>/, name: 'Title tag', critical: true },
    { regex: /<meta name="description"[^>]*content="[^"]{50,160}"/, name: 'Meta description (50-160 chars)', critical: false },
    { regex: /<meta name="description"[^>]*content="/, name: 'Meta description exists', critical: true },
    { regex: /<meta name="viewport"/, name: 'Viewport meta tag', critical: true },
    { regex: /<html[^>]*lang="/, name: 'HTML lang attribute', critical: true },
    { regex: /<meta property="og:title"/, name: 'Open Graph title', critical: false },
    { regex: /<meta property="og:description"/, name: 'Open Graph description', critical: false },
    { regex: /<meta property="og:image"/, name: 'Open Graph image', critical: false },
    { regex: /<meta property="og:url"/, name: 'Open Graph URL', critical: false },
    { regex: /<meta property="og:type"/, name: 'Open Graph type', critical: false },
    { regex: /<meta (?:name|property)="twitter:card"/, name: 'Twitter card', critical: false },
    { regex: /<link rel="canonical"/, name: 'Canonical link', critical: false },
    { regex: /<meta name="theme-color"/, name: 'Theme color', critical: false },
    { regex: /<link rel="manifest"/, name: 'Web manifest', critical: false }
  ];

  checks.forEach(check => {
    if (check.regex.test(html)) {
      addPass(check.name);
    } else {
      if (check.critical) {
        addError(`Missing ${check.name}`);
      } else {
        addWarning(`Missing ${check.name}`);
      }
    }
  });

  // Check title length
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (titleMatch) {
    const titleLength = titleMatch[1].length;
    if (titleLength < 30) {
      addWarning(`Title is too short (${titleLength} chars, recommend 30-60)`);
    } else if (titleLength > 60) {
      addWarning(`Title is too long (${titleLength} chars, recommend 30-60)`);
    } else {
      addPass(`Title length is optimal (${titleLength} chars)`);
    }
  }

  // Check for structured data
  if (html.includes('application/ld+json')) {
    addPass('Structured data (JSON-LD) found');
  } else {
    addWarning('No structured data (JSON-LD) found');
  }

  // Check for images without alt text
  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const imgsWithoutAlt = imgTags.filter(img => !img.includes('alt='));
  if (imgsWithoutAlt.length > 0) {
    addWarning(`${imgsWithoutAlt.length} image(s) without alt text`);
  } else if (imgTags.length > 0) {
    addPass('All images have alt text');
  }
};

// Validate robots.txt
const validateRobotsTxt = (robotsPath) => {
  if (!checkFile(robotsPath, 'robots.txt')) return;

  const content = readFileSync(robotsPath, 'utf-8');
  
  if (content.includes('User-agent:')) {
    addPass('robots.txt has User-agent directive');
  } else {
    addError('robots.txt missing User-agent directive');
  }

  if (content.includes('Sitemap:')) {
    addPass('robots.txt references sitemap');
  } else {
    addWarning('robots.txt should reference sitemap');
  }

  // Check if robots.txt blocks everything (only if there's no Allow directive before Disallow: /)
  const lines = content.split('\n');
  let hasGeneralAllow = false;
  let hasDisallowAll = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'Allow: /') {
      hasGeneralAllow = true;
    }
    if (trimmed === 'Disallow: /' && !hasGeneralAllow) {
      hasDisallowAll = true;
    }
  }
  
  if (hasDisallowAll) {
    addWarning('robots.txt disallows all pages (check if intentional)');
  } else if (hasGeneralAllow) {
    addPass('robots.txt allows all pages');
  }
};

// Validate sitemap.xml
const validateSitemap = (sitemapPath) => {
  if (!checkFile(sitemapPath, 'sitemap.xml')) return;

  const content = readFileSync(sitemapPath, 'utf-8');
  
  if (content.includes('<?xml')) {
    addPass('sitemap.xml is valid XML');
  } else {
    addError('sitemap.xml is not valid XML');
  }

  if (content.includes('<urlset')) {
    addPass('sitemap.xml has urlset tag');
  } else {
    addError('sitemap.xml missing urlset tag');
  }

  const urlCount = (content.match(/<url>/g) || []).length;
  addPass(`sitemap.xml contains ${urlCount} URL(s)`);

  if (urlCount === 0) {
    addWarning('sitemap.xml has no URLs');
  }
};

// Main validation
const runValidation = () => {
  console.log('\n🔍 Running SEO Validation...\n');
  console.log('═'.repeat(60));
  
  const projectRoot = join(__dirname, '..');
  const distPath = join(projectRoot, 'dist');
  const publicPath = join(projectRoot, 'public');
  
  // Check which directory to validate
  const isDistAvailable = existsSync(distPath);
  const basePath = isDistAvailable ? distPath : publicPath;
  const basePathName = isDistAvailable ? 'dist' : 'public';
  
  console.log(`\n📂 Validating: ${basePathName}/\n`);

  // Run checks
  validateHTML(join(basePath === distPath ? basePath : projectRoot, 'index.html'));
  validateRobotsTxt(join(basePath, 'robots.txt'));
  validateSitemap(join(basePath, 'sitemap.xml'));

  // Report results
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 VALIDATION RESULTS:\n');
  
  if (passes.length > 0) {
    console.log('✅ PASSED CHECKS:');
    passes.forEach(p => console.log(`   ${p}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(e => console.log(`   ${e}`));
    console.log('');
  }

  console.log('═'.repeat(60));
  console.log(`\n📈 Score: ${passes.length}/${passes.length + warnings.length + errors.length} checks passed\n`);

  if (errors.length > 0) {
    console.log('❌ SEO validation failed. Please fix the errors above.\n');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('⚠️  SEO validation passed with warnings. Consider addressing them.\n');
  } else {
    console.log('✅ SEO validation passed successfully!\n');
  }
};

runValidation();
