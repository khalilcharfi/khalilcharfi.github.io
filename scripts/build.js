const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// Configuration
// Update CONFIG to use dist directory
const CONFIG = {
  paths: {
    template: 'templates/template.hbs',
    data: 'data',
    output: '.',
    assets: {
      css: 'css',
      img: 'img',
      js: 'js'
    }
  },
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    sortAttributes: true,
    sortClassName: true,
    preserveLineBreaks: false,
    ignoreCustomComments: [
      /^!/,
      /^@preserve/,
      /^@license/,
      /^@cc_on/
    ]
  }
};

// Environment setup
const isDevelopment = process.env.NODE_ENV === 'development';

// Console colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

// Register Handlebars helpers
Handlebars.registerHelper('toJSON', function(obj) {
    return new Handlebars.SafeString(JSON.stringify(obj, null, 2));
});

Handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toISOString();
});

// Utility functions
const utils = {
    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    },

    calculateSizeReduction(originalSize, minifiedSize) {
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
        const originalKb = (originalSize / 1024).toFixed(2);
        const minifiedKb = (minifiedSize / 1024).toFixed(2);
        return {
            percentage: reduction,
            original: originalKb,
            minified: minifiedKb
        };
    },

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
    }
};

// Main generator class
class StaticSiteGenerator {
    constructor() {
        this.template = null;
        this.compiledTemplate = null;
    }

    async initialize() {
        try {
            // Read and compile template
            this.template = await fs.promises.readFile(CONFIG.paths.template, 'utf8');
            this.compiledTemplate = Handlebars.compile(this.template);
            utils.logSuccess('Template loaded and compiled successfully');
        } catch (error) {
            utils.logError('Failed to initialize generator', error);
            process.exit(1);
        }
    }

    async generatePage(lang) {
        try {
            // Read language data
            const dataPath = path.join(CONFIG.paths.data, `${lang}.json`);
            const data = JSON.parse(await fs.promises.readFile(dataPath, 'utf8'));

            // Create output directory
            const outputPath = path.join(CONFIG.paths.output, lang);
            utils.ensureDirectoryExists(outputPath);

            // Generate HTML
            const html = this.compiledTemplate(data);

            // Minify HTML if not in development mode
            const finalHtml = isDevelopment ? html : minify(html, CONFIG.minify);

            // Write file
            const filePath = path.join(outputPath, 'index.html');
            await fs.promises.writeFile(filePath, finalHtml);

            // Calculate and log size reduction
            const originalSize = Buffer.byteLength(html, 'utf8');
            const finalSize = Buffer.byteLength(finalHtml, 'utf8');
            const sizeInfo = utils.calculateSizeReduction(originalSize, finalSize);

            utils.logSuccess(
                `Generated ${lang}/index.html (${sizeInfo.original}KB → ${sizeInfo.minified}KB, -${sizeInfo.percentage}%)`
            );

            return true;
        } catch (error) {
            utils.logError(`Failed to generate ${lang} page`, error);
            return false;
        }
    }

    async generate() {
        utils.logInfo(`Starting generation in ${isDevelopment ? 'development' : 'production'} mode`);
        
        await this.initialize();

        const results = await Promise.all(
            CONFIG.languages.map(lang => this.generatePage(lang))
        );

        const successful = results.filter(Boolean).length;
        const failed = results.length - successful;

        if (failed === 0) {
            utils.logSuccess(`Generation complete! Generated ${successful} pages successfully`);
        } else {
            utils.logError(`Generation completed with errors. Success: ${successful}, Failed: ${failed}`);
        }
    }
}

// Run generator
const generator = new StaticSiteGenerator();
generator.generate().catch(error => {
    utils.logError('Fatal error during generation', error);
    process.exit(1);
});