#!/usr/bin/env node

/**
 * Extract translations from TypeScript file to JSON for easier processing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the translations file
const translationsPath = path.join(__dirname, '../translations.ts');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Simple regex to extract the content between the export and closing brace
const exportMatch = translationsContent.match(/export const translations: Translations = \{([\s\S]*)\};/);
if (!exportMatch) {
  console.error('❌ Could not parse translations.ts file');
  process.exit(1);
}

// Convert TypeScript object to JSON
let jsonContent = exportMatch[1];

// Replace TypeScript syntax with JSON syntax
jsonContent = jsonContent
  .replace(/(\w+):/g, '"$1":') // Add quotes around keys
  .replace(/'/g, '"') // Replace single quotes with double quotes
  .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
  .replace(/\s+/g, ' ') // Normalize whitespace
  .trim();

// Write to temporary JSON file
const tempJsonPath = path.join(__dirname, '../temp-translations.json');
fs.writeFileSync(tempJsonPath, `{${jsonContent}}`, 'utf8');

console.log('✅ Extracted translations to temp-translations.json');
console.log('📁 File:', tempJsonPath);
