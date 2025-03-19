const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// Configuration
const LANGUAGES = ['en', 'fr', 'de', 'ar'];
const TEMPLATE_PATH = 'templates/template.hbs';
const DATA_DIR = 'data';
const OUTPUT_DIR = '.';

// Minification options
const minifyOptions = {
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
};

// Register Handlebars helper for safe JSON stringification
Handlebars.registerHelper('toJSON', function(obj) {
    return new Handlebars.SafeString(JSON.stringify(obj, null, 2));
});

// Read and compile template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const compiledTemplate = Handlebars.compile(template);

// Generate pages for each language
LANGUAGES.forEach(lang => {
    try {
        // Read language data
        const dataPath = path.join(DATA_DIR, `${lang}.json`);
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // Create output directory if it doesn't exist
        const outputPath = path.join(OUTPUT_DIR, lang);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        // Generate HTML
        const html = compiledTemplate(data);
        
        // Minify HTML
        const minifiedHtml = minify(html, minifyOptions);
        
        // Write file
        const filePath = path.join(outputPath, 'index.html');
        fs.writeFileSync(filePath, minifiedHtml);
        
        // Calculate size reduction
        const originalSize = Buffer.byteLength(html, 'utf8');
        const minifiedSize = Buffer.byteLength(minifiedHtml, 'utf8');
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
        
        console.log(`Generated: ${filePath}`);
        console.log(`Size reduced by ${reduction}% (${originalSize} → ${minifiedSize} bytes)`);
    } catch (error) {
        console.error(`Error processing ${lang}:`, error);
    }
});

console.log('Generation complete!');