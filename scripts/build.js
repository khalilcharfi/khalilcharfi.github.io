const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Configuration
const LANGUAGES = ['en', 'fr', 'de', 'ar'];
const TEMPLATE_PATH = 'templates/template.hbs';
const DATA_DIR = 'data';
const OUTPUT_DIR = '.';

// Register Handlebars helper for safe JSON stringification
Handlebars.registerHelper('toJSON', function(obj) {
    return new Handlebars.SafeString(JSON.stringify(obj, null, 2));
});

// Read and compile template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const compiledTemplate = Handlebars.compile(template);

// Generate pages for each language
LANGUAGES.forEach(lang => {
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
    
    // Write file
    const filePath = path.join(outputPath, 'index.html');
    fs.writeFileSync(filePath, html);
    console.log(`Generated: ${filePath}`);
});

console.log('Generation complete!');