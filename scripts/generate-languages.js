const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

// Configure paths
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'templates');
const OUTPUT_DIR = ROOT_DIR;

// Configure Nunjucks
const env = nunjucks.configure(TEMPLATE_DIR, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});

// Add custom filters
env.addFilter('json', function(obj) {
  return JSON.stringify(obj);
});

// Define supported languages
const languages = ['en', 'fr', 'ar', 'de'];

// Function to generate language files
function generateLanguageFiles() {
  console.log('Starting language file generation...');
  
  // Process each language
  languages.forEach(lang => {
    try {
      console.log(`Processing ${lang}...`);
      
      // Read language data
      const dataPath = path.join(DATA_DIR, `${lang}.json`);
      if (!fs.existsSync(dataPath)) {
        console.error(`Error: Data file for ${lang} not found at ${dataPath}`);
        return;
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Render template with data
      const html = nunjucks.render('page.html', data);
      
      // Ensure output directory exists
      const outputDir = path.join(OUTPUT_DIR, lang);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write output file
      const outputPath = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputPath, html);
      
      console.log(`Generated ${outputPath}`);
    } catch (error) {
      console.error(`Error processing ${lang}:`, error);
    }
  });
  
  // Generate root index.html for language redirection
  generateRootIndex();
  
  // Generate sitemap
  generateSitemap();
  
  // Generate robots.txt
  generateRobotsTxt();
  
  console.log('Language file generation completed successfully!');
}

// Function to generate root index.html
function generateRootIndex() {
  console.log('Generating root index.html...');
  
  const rootIndexPath = path.join(OUTPUT_DIR, 'index.html');
  const rootIndexTemplatePath = path.join(TEMPLATE_DIR, 'root-index.html');
  
  if (!fs.existsSync(rootIndexTemplatePath)) {
    console.error(`Error: Root index template not found at ${rootIndexTemplatePath}`);
    return;
  }
  
  const rootIndexTemplate = fs.readFileSync(rootIndexTemplatePath, 'utf8');
  fs.writeFileSync(rootIndexPath, rootIndexTemplate);
  console.log(`Generated ${rootIndexPath}`);
}

// Function to generate sitemap
function generateSitemap() {
  console.log('Generating sitemap...');
  
  const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  const sitemapTemplatePath = path.join(TEMPLATE_DIR, 'sitemap.xml');
  
  if (!fs.existsSync(sitemapTemplatePath)) {
    console.error(`Error: Sitemap template not found at ${sitemapTemplatePath}`);
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://khalilcharfi.github.io';
  
  // Read the sitemap template
  let sitemapTemplate = fs.readFileSync(sitemapTemplatePath, 'utf8');
  
  // Replace placeholders with dynamic content
  let languageAlternates = '';
  let languageUrls = '';
  
  // Generate alternate language links for root URL
  languages.forEach(lang => {
    languageAlternates += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}/" />\n`;
  });
  
  // Generate language-specific URLs with their alternates
  languages.forEach(lang => {
    let alternates = '';
    languages.forEach(altLang => {
      alternates += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/" />\n`;
    });
    
    languageUrls += `
  <url>
    <loc>${baseUrl}/${lang}/</loc>
${alternates}    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  });
  
  // Replace placeholders in the template
  sitemapTemplate = sitemapTemplate
    .replace('{{TODAY}}', today)
    .replace('{{LANGUAGE_ALTERNATES}}', languageAlternates)
    .replace('{{LANGUAGE_URLS}}', languageUrls);
  
  fs.writeFileSync(sitemapPath, sitemapTemplate);
  console.log(`Generated ${sitemapPath}`);
}

// Function to generate robots.txt
function generateRobotsTxt() {
  console.log('Generating robots.txt...');
  
  const robotsPath = path.join(OUTPUT_DIR, 'robots.txt');
  const robotsTemplatePath = path.join(TEMPLATE_DIR, 'robots.txt');
  
  if (!fs.existsSync(robotsTemplatePath)) {
    console.error(`Error: Robots.txt template not found at ${robotsTemplatePath}`);
    return;
  }
  
  const robotsContent = fs.readFileSync(robotsTemplatePath, 'utf8');
  fs.writeFileSync(robotsPath, robotsContent);
  console.log(`Generated ${robotsPath}`);
}

// Execute if run directly
if (require.main === module) {
  generateLanguageFiles();
}

module.exports = {
  generateLanguageFiles,
  generateRootIndex,
  generateSitemap,
  generateRobotsTxt
};