const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register Handlebars helpers
Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

Handlebars.registerHelper('if', function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// Define paths
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'templates');
const TEMPLATE_PATH = path.join(TEMPLATE_DIR, 'page.html');
const OUTPUT_DIR = ROOT_DIR;

// Read template file
const templateSource = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const template = Handlebars.compile(templateSource);

// Process each language
const languages = ['en', 'fr', 'ar', 'de'];

languages.forEach(lang => {
  console.log(`Processing ${lang}...`);
  
  // Read language data
  const dataPath = path.join(DATA_DIR, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Render template with data
  const html = template(data);
  
  // Ensure output directory exists
  const outputDir = path.join(OUTPUT_DIR, lang);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write output file
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);
  
  console.log(`Generated ${outputPath}`);
});

// Update root index.html to handle language redirection
console.log('Updating root index.html...');

const rootIndexPath = path.join(OUTPUT_DIR, 'index.html');
const rootIndexTemplatePath = path.join(TEMPLATE_DIR, 'root-index.html');

if (!fs.existsSync(rootIndexTemplatePath)) {
  console.error(`Error: Root index template not found at ${rootIndexTemplatePath}`);
  process.exit(1);
}

const rootIndexTemplate = fs.readFileSync(rootIndexTemplatePath, 'utf8');
fs.writeFileSync(rootIndexPath, rootIndexTemplate);

console.log('Build completed successfully!');