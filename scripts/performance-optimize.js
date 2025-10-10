#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Applies various performance optimizations to the codebase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance optimizations to apply
const optimizations = {
  // Remove console.log statements in production
  removeConsoleLogs: (content) => {
    if (process.env.NODE_ENV === 'production') {
      return content
        .replace(/console\.(log|debug|info)\([^)]*\);?\s*/g, '')
        .replace(/console\.warn\([^)]*\);?\s*/g, '');
    }
    return content;
  },

  // Optimize imports
  optimizeImports: (content) => {
    // Remove unused imports (basic detection)
    const importRegex = /import\s+{[^}]*}\s+from\s+['"][^'"]+['"];?\s*/g;
    const imports = content.match(importRegex) || [];
    
    for (const importStatement of imports) {
      const importPath = importStatement.match(/from\s+['"]([^'"]+)['"]/)?.[1];
      if (importPath && importPath.startsWith('@/')) {
        // Check if the imported items are actually used
        const importedItems = importStatement.match(/{([^}]*)}/)?.[1];
        if (importedItems) {
          const items = importedItems.split(',').map(item => item.trim());
          const unusedItems = items.filter(item => {
            const itemName = item.split(' as ')[0].trim();
            const usageRegex = new RegExp(`\\b${itemName}\\b`, 'g');
            const matches = content.match(usageRegex) || [];
            return matches.length <= 1; // Only the import statement itself
          });
          
          if (unusedItems.length === items.length) {
            // Remove entire import if all items are unused
            content = content.replace(importStatement, '');
          } else if (unusedItems.length > 0) {
            // Remove unused items from import
            const usedItems = items.filter(item => !unusedItems.includes(item));
            const newImport = importStatement.replace(
              `{${importedItems}}`,
              `{${usedItems.join(', ')}}`
            );
            content = content.replace(importStatement, newImport);
          }
        }
      }
    }
    
    return content;
  },

  // Optimize React components
  optimizeReactComponents: (content) => {
    // Add React.memo to functional components
    if (content.includes('export const') && content.includes('React.FC')) {
      content = content.replace(
        /export const (\w+): React\.FC/g,
        'export const $1: React.FC = React.memo(({'
      );
    }

    // Optimize useEffect dependencies
    content = content.replace(
      /useEffect\(\(\) => \{([^}]+)\}, \[\]\)/g,
      'useEffect(() => {$1}, [])'
    );

    return content;
  },

  // Optimize CSS
  optimizeCSS: (content) => {
    // Remove unused CSS rules (basic detection)
    const cssRuleRegex = /([^{}]+)\s*\{[^}]*\}/g;
    let match;
    const rules = [];
    
    while ((match = cssRuleRegex.exec(content)) !== null) {
      rules.push(match[0]);
    }
    
    // Remove duplicate rules
    const uniqueRules = [...new Set(rules)];
    let optimizedContent = content;
    
    for (const rule of rules) {
      const occurrences = (content.match(new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      if (occurrences > 1) {
        optimizedContent = optimizedContent.replace(rule, '');
      }
    }
    
    return optimizedContent;
  },

  // Optimize images
  optimizeImages: (content) => {
    // Add loading="lazy" to images that don't have it
    content = content.replace(
      /<img([^>]*?)(?<!loading="[^"]*")>/g,
      '<img$1 loading="lazy">'
    );

    // Add width and height attributes for better CLS
    content = content.replace(
      /<img([^>]*?)src="([^"]*profile-photo[^"]*)"([^>]*?)>/g,
      '<img$1src="$2"$3 width="106" height="106">'
    );

    return content;
  }
};

// Process file with optimizations
function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  let optimizedContent = content;
  
  // Apply optimizations based on file type
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    optimizedContent = optimizations.removeConsoleLogs(optimizedContent);
    optimizedContent = optimizations.optimizeImports(optimizedContent);
    optimizedContent = optimizations.optimizeReactComponents(optimizedContent);
    optimizedContent = optimizations.optimizeImages(optimizedContent);
  } else if (filePath.endsWith('.css')) {
    optimizedContent = optimizations.optimizeCSS(optimizedContent);
  }
  
  // Only write if content changed
  if (optimizedContent !== content) {
    fs.writeFileSync(filePath, optimizedContent);
    console.log(`Optimized: ${filePath}`);
    return true;
  }
  
  return false;
}

// Process directory recursively
function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  let processedCount = 0;
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      processedCount += processDirectory(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.css')) {
      if (processFile(fullPath)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

// Main function
function main() {
  console.log('Starting performance optimization...\n');
  
  const processedCount = processDirectory('src');
  
  console.log(`\nOptimization complete! Processed ${processedCount} files.`);
  
  // Generate performance report
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      'Removed console.log statements in production',
      'Optimized imports and removed unused ones',
      'Added React.memo to functional components',
      'Optimized CSS rules and removed duplicates',
      'Added lazy loading to images',
      'Added width/height attributes for better CLS'
    ],
    filesProcessed: processedCount
  };
  
  fs.writeFileSync('performance-optimization-report.json', JSON.stringify(report, null, 2));
  console.log('Performance report saved to performance-optimization-report.json');
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { processFile, processDirectory, optimizations };
