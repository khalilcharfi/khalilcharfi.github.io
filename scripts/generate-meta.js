const fs = require('fs');
const path = require('path');

// Configuration
// Update CONFIG to use dist directory
const CONFIG = {
  baseUrl: 'https://khalilcharfi.github.io',
  languages: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
      { code: 'ar', name: 'Arabic' },
      { code: 'de', name: 'German' }
  ],
  paths: {
      output: {
          sitemap: path.join(__dirname, '../dist/sitemap.xml'),
          robots: path.join(__dirname, '../dist/robots.txt'),
          humans: path.join(__dirname, '../dist/humans.txt')
      }
  }
};

// Console colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

// Utility functions
const utils = {
    logSuccess(message) {
        console.log(`${colors.green}✓ ${message}${colors.reset}`);
    },

    logError(message, error) {
        console.error(`${colors.red}✗ ${message}${colors.reset}`);
        if (error) {
            console.error(`${colors.red}${error.stack}${colors.reset}`);
        }
    },

    logInfo(message) {
        console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
    },

    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }
};

class MetaFilesGenerator {
    generateSitemap() {
        try {
            // Generate language alternates for root URL
            const languageAlternates = CONFIG.languages
                .map(lang => `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${CONFIG.baseUrl}/${lang.code}/"/>`)
                .join('\n');

            // Generate language-specific URLs
            const languageUrls = CONFIG.languages
                .map(lang => `
  <url>
    <loc>${CONFIG.baseUrl}/${lang.code}/</loc>
${CONFIG.languages
    .map(altLang => `    <xhtml:link rel="alternate" hreflang="${altLang.code}" href="${CONFIG.baseUrl}/${altLang.code}/"/>`)
    .join('\n')}
    <lastmod>${utils.getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
                .join('\n');

            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${CONFIG.baseUrl}/</loc>
${languageAlternates}
    <lastmod>${utils.getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${languageUrls}
</urlset>`;

            fs.writeFileSync(CONFIG.paths.output.sitemap, sitemap);
            utils.logSuccess('Generated sitemap.xml');
        } catch (error) {
            utils.logError('Failed to generate sitemap.xml', error);
        }
    }

    generateRobots() {
        try {
            const robots = `# www.robotstxt.org

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Host
Host: ${CONFIG.baseUrl}

# Crawl-delay
Crawl-delay: 10`;

            fs.writeFileSync(CONFIG.paths.output.robots, robots);
            utils.logSuccess('Generated robots.txt');
        } catch (error) {
            utils.logError('Failed to generate robots.txt', error);
        }
    }

    generateHumans() {
        try {
            // Create language list
            const languageList = CONFIG.languages
                .map(lang => lang.name)
                .join(', ');

            const humans = `/* TEAM */
Developer: ${CONFIG.meta.author}
Location: ${CONFIG.meta.location}
GitHub: ${CONFIG.meta.github}
LinkedIn: ${CONFIG.meta.linkedin}
Twitter: ${CONFIG.meta.twitter}

/* SITE */
Last update: ${utils.getCurrentDate()}
Standards: HTML5, CSS3, JavaScript
Components: Vue.js, Angular, Laravel
Software: Visual Studio Code, Git
Hosting: GitHub Pages
Languages: ${languageList}

/* TECHNOLOGIES */
Frontend: HTML5, CSS3, JavaScript
Frameworks: Vue.js, Angular
Backend: Laravel, PHP
Fonts: Google Fonts (Poppins)
Icons: Font Awesome
Animations: Three.js

/* THANKS */
- Font Awesome for icons
- Three.js for animations
- Google Fonts for typography
- GitHub Pages for hosting

/* NOTE */
This site is a multilingual portfolio with automatic language detection.
Built with performance and accessibility in mind.`;

            fs.writeFileSync(CONFIG.paths.output.humans, humans);
            utils.logSuccess('Generated humans.txt');
        } catch (error) {
            utils.logError('Failed to generate humans.txt', error);
        }
    }

    async generateAll() {
        try {
            utils.logInfo('Starting meta files generation...');
            
            this.generateSitemap();
            this.generateRobots();
            this.generateHumans();
            
            utils.logSuccess('All meta files generated successfully');
        } catch (error) {
            utils.logError('Failed to generate meta files', error);
            process.exit(1);
        }
    }
}

// Run generator
const generator = new MetaFilesGenerator();
generator.generateAll().catch(error => {
    utils.logError('Fatal error during generation', error);
    process.exit(1);
});