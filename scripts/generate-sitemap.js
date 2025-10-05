/**
 * Generate multilingual sitemap.xml with hreflang support for SEO
 * Run this as part of the build process or manually
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://khalilcharfi.github.io';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Supported languages with their metadata
const LANGUAGES = {
  en: { name: 'English', region: 'US' },
  de: { name: 'Deutsch', region: 'DE' },
  fr: { name: 'Français', region: 'FR' },
  ar: { name: 'العربية', region: 'SA' }
};

// Define all pages/sections in your portfolio
const pages = [
  {
    loc: '/',
    priority: '1.0',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#home',
    priority: '1.0',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#about',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#skills',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#projects',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#experience',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#education',
    priority: '0.8',
    changefreq: 'yearly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#publications',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#certificates',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: CURRENT_DATE
  },
  {
    loc: '/#contact',
    priority: '0.8',
    changefreq: 'yearly',
    lastmod: CURRENT_DATE
  }
];

/**
 * Generate hreflang tags for a given URL
 * @param {string} baseUrl - The base URL
 * @returns {string} - Hreflang XML tags
 */
const generateHreflang = (baseUrl) => {
  const hreflangs = [];
  
  // Add all language versions
  Object.keys(LANGUAGES).forEach(lang => {
    const url = baseUrl === '/' 
      ? `${SITE_URL}/?lang=${lang}`
      : `${SITE_URL}${baseUrl}${baseUrl.includes('?') ? '&' : '?'}lang=${lang}`;
    hreflangs.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`);
  });
  
  // Add x-default (usually points to default language)
  const defaultUrl = baseUrl === '/' ? SITE_URL : `${SITE_URL}${baseUrl}`;
  hreflangs.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`);
  
  return hreflangs.join('\n');
};

/**
 * Generate multilingual sitemap with hreflang support
 */
const generateSitemap = () => {
  const urlset = pages.map(page => {
    const hreflangTags = generateHreflang(page.loc);
    
    return `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangTags}
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlset}
</urlset>`;

  return sitemap;
};

/**
 * Write sitemap to public and dist directories
 */
const writeSitemap = () => {
  const sitemap = generateSitemap();
  
  try {
    // Write to public directory (for development)
    const publicPath = join(__dirname, '..', 'public', 'sitemap.xml');
    writeFileSync(publicPath, sitemap, 'utf-8');
    console.log('✅ Multilingual sitemap generated successfully in public/sitemap.xml');
    
    // Write to dist directory (for production)
    try {
      const distPath = join(__dirname, '..', 'dist', 'sitemap.xml');
      writeFileSync(distPath, sitemap, 'utf-8');
      console.log('✅ Sitemap copied to dist/sitemap.xml');
    } catch (err) {
      console.log('ℹ️  Dist directory not found (run build first), skipping dist/sitemap.xml');
    }
    
    console.log('\n📊 Multilingual Sitemap Statistics:');
    console.log(`   - Total URLs: ${pages.length}`);
    console.log(`   - Languages: ${Object.keys(LANGUAGES).length} (${Object.keys(LANGUAGES).join(', ')})`);
    console.log(`   - Total Language Variants: ${pages.length * Object.keys(LANGUAGES).length}`);
    console.log(`   - Site URL: ${SITE_URL}`);
    console.log(`   - Last Updated: ${CURRENT_DATE}`);
    console.log('\n✨ Features:');
    console.log('   ✓ Hreflang tags for language targeting');
    console.log('   ✓ x-default fallback language');
    console.log('   ✓ Language-specific URLs');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the script
writeSitemap();
