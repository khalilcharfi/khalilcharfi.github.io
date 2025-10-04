/**
 * Generate sitemap.xml for SEO
 * Run this as part of the build process or manually
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://khalilcharfi.github.io';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

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

// Generate XML
const generateSitemap = () => {
  const urlset = pages.map(page => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlset}
</urlset>`;

  return sitemap;
};

// Write sitemap to public and dist directories
const writeSitemap = () => {
  const sitemap = generateSitemap();
  
  try {
    // Write to public directory (for development)
    const publicPath = join(__dirname, '..', 'public', 'sitemap.xml');
    writeFileSync(publicPath, sitemap, 'utf-8');
    console.log('✅ Sitemap generated successfully in public/sitemap.xml');
    
    // Write to dist directory (for production)
    try {
      const distPath = join(__dirname, '..', 'dist', 'sitemap.xml');
      writeFileSync(distPath, sitemap, 'utf-8');
      console.log('✅ Sitemap copied to dist/sitemap.xml');
    } catch (err) {
      console.log('ℹ️  Dist directory not found (run build first), skipping dist/sitemap.xml');
    }
    
    console.log('\n📊 Sitemap Statistics:');
    console.log(`   - Total URLs: ${pages.length}`);
    console.log(`   - Site URL: ${SITE_URL}`);
    console.log(`   - Last Updated: ${CURRENT_DATE}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the script
writeSitemap();
