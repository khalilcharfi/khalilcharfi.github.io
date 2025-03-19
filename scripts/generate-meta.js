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
          sitemap: path.join(__dirname, '../sitemap.xml'),
          robots: path.join(__dirname, '../robots.txt'),
          humans: path.join(__dirname, '../humans.txt')
      },
      assets: {
          css: path.join(__dirname, '../css'),
          js: path.join(__dirname, '../js'),
          img: path.join(__dirname, '../img'),
          dest: {
              css: path.join(__dirname, '../css'),
              js: path.join(__dirname, '../js'),
              img: path.join(__dirname, '../img')
          }
      }
  },
  // Add meta information
  meta: {
      author: 'Khalil Charfi',
      location: 'Frankfurt, Germany',
      github: 'https://github.com/khalilcharfi',
      linkedin: 'https://www.linkedin.com/in/khalilcharfi/',
      twitter: 'https://twitter.com/khalilcharfi8'
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
    },
    
    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    },
    
    copyDirectory(source, destination) {
        // Create destination directory if it doesn't exist
        this.ensureDirectoryExists(destination);
        
        // Read all files in source directory
        const files = fs.readdirSync(source);
        
        // Copy each file to destination
        let copiedFiles = 0;
        files.forEach(file => {
            const sourcePath = path.join(source, file);
            const destPath = path.join(destination, file);
            
            // Check if it's a directory
            if (fs.statSync(sourcePath).isDirectory()) {
                copiedFiles += this.copyDirectory(sourcePath, destPath);
            } else {
                // Copy file
                fs.copyFileSync(sourcePath, destPath);
                copiedFiles++;
            }
        });
        
        return copiedFiles;
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

    copyAssets() {
        try {
            utils.logInfo('Copying assets to dist folder...');
            
            // Ensure destination directories exist
            Object.values(CONFIG.paths.assets.dest).forEach(dir => {
                utils.ensureDirectoryExists(dir);
            });
            
            // Copy CSS files
            if (fs.existsSync(CONFIG.paths.assets.css)) {
                const cssFiles = utils.copyDirectory(CONFIG.paths.assets.css, CONFIG.paths.assets.dest.css);
                utils.logSuccess(`Copied ${cssFiles} CSS files to dist/css`);
            }
            
            // Copy JS files
            if (fs.existsSync(CONFIG.paths.assets.js)) {
                const jsFiles = utils.copyDirectory(CONFIG.paths.assets.js, CONFIG.paths.assets.dest.js);
                utils.logSuccess(`Copied ${jsFiles} JS files to dist/js`);
            }
            
            // Copy image files
            if (fs.existsSync(CONFIG.paths.assets.img)) {
                const imgFiles = utils.copyDirectory(CONFIG.paths.assets.img, CONFIG.paths.assets.dest.img);
                utils.logSuccess(`Copied ${imgFiles} image files to dist/img`);
            }
            
            return true;
        } catch (error) {
            utils.logError('Failed to copy assets', error);
            return false;
        }
    }

    async generateAll() {
        try {
            utils.logInfo('Starting meta files generation...');
            
            // Copy assets first
            this.copyAssets();
            
            // Generate meta files
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