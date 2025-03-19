const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// Configuration
const CONFIG = {
    paths: {
        template: 'templates/redirect.hbs',
        data: 'data/redirect.json',
        output: 'index.html'
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
        sortClassName: true
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
    }
};

// Register Handlebars helpers
Handlebars.registerHelper('toJSON', function(obj) {
    return new Handlebars.SafeString(JSON.stringify(obj, null, 2));
});

class RedirectPageGenerator {
    async generate() {
        try {
            utils.logInfo(`Starting redirect page generation in ${isDevelopment ? 'development' : 'production'} mode`);

            // Read template and data
            const template = await fs.promises.readFile(CONFIG.paths.template, 'utf8');
            const data = JSON.parse(await fs.promises.readFile(CONFIG.paths.data, 'utf8'));

            // Compile template
            const compiledTemplate = Handlebars.compile(template);

            // Generate HTML
            const html = compiledTemplate(data);

            // Minify if in production
            const finalHtml = isDevelopment ? html : minify(html, CONFIG.minify);

            // Write file
            await fs.promises.writeFile(CONFIG.paths.output, finalHtml);

            // Calculate size reduction
            const originalSize = Buffer.byteLength(html, 'utf8');
            const finalSize = Buffer.byteLength(finalHtml, 'utf8');
            const reduction = ((originalSize - finalSize) / originalSize * 100).toFixed(2);
            const originalKb = (originalSize / 1024).toFixed(2);
            const finalKb = (finalSize / 1024).toFixed(2);

            utils.logSuccess(
                `Generated redirect page (${originalKb}KB → ${finalKb}KB, -${reduction}%)`
            );

        } catch (error) {
            utils.logError('Failed to generate redirect page', error);
            process.exit(1);
        }
    }
}

// Run generator
const generator = new RedirectPageGenerator();
generator.generate().catch(error => {
    utils.logError('Fatal error during generation', error);
    process.exit(1);
});