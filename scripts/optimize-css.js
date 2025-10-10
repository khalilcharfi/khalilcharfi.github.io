#!/usr/bin/env node

/**
 * CSS Optimization Script
 * Removes unused CSS and optimizes styles for better performance
 */

const fs = require('fs');
const path = require('path');

// CSS files to optimize
const cssFiles = [
  'index.css',
  'src/styles/accessibility.css',
  'src/styles/scrollbar.css'
];

// Critical CSS that should always be kept
const criticalSelectors = [
  'html', 'body', 'head', 'main',
  '.navbar', '.section', '.container',
  '.profile-photo', '.theme-transitioning',
  '.loading-screen', '.suspense-fallback',
  '.visitor-controls', '.personalization-indicator'
];

// Utility function to extract selectors from CSS
function extractSelectors(css) {
  const selectorRegex = /([^{}]+)\s*{/g;
  const selectors = [];
  let match;
  
  while ((match = selectorRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    if (selector && !selector.includes('@') && !selector.includes('/*')) {
      selectors.push(selector);
    }
  }
  
  return selectors;
}

// Utility function to check if selector is used in HTML/JSX files
function isSelectorUsed(selector, sourceFiles) {
  const cleanSelector = selector.replace(/[.#:\[\]()]/g, '').trim();
  
  for (const file of sourceFiles) {
    if (file.includes(cleanSelector)) {
      return true;
    }
  }
  
  return false;
}

// Get all source files
function getAllSourceFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        walkDir(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.jsx') || item.endsWith('.js')) {
        files.push(fs.readFileSync(fullPath, 'utf8'));
      }
    }
  }
  
  walkDir('src');
  return files;
}

// Optimize CSS file
function optimizeCSS(filePath) {
  console.log(`Optimizing ${filePath}...`);
  
  const css = fs.readFileSync(filePath, 'utf8');
  const sourceFiles = getAllSourceFiles('src');
  const selectors = extractSelectors(css);
  
  let optimizedCSS = css;
  let removedCount = 0;
  
  // Remove unused selectors (keep critical ones)
  for (const selector of selectors) {
    const isCritical = criticalSelectors.some(critical => 
      selector.includes(critical) || critical.includes(selector.replace(/[.#:\[\]()]/g, ''))
    );
    
    if (!isCritical && !isSelectorUsed(selector, sourceFiles)) {
      // Remove the entire rule block
      const ruleRegex = new RegExp(
        selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 
        '\\s*{[^}]*}',
        'g'
      );
      
      const beforeLength = optimizedCSS.length;
      optimizedCSS = optimizedCSS.replace(ruleRegex, '');
      
      if (optimizedCSS.length < beforeLength) {
        removedCount++;
      }
    }
  }
  
  // Clean up multiple newlines
  optimizedCSS = optimizedCSS.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Write optimized CSS
  const outputPath = filePath.replace('.css', '.optimized.css');
  fs.writeFileSync(outputPath, optimizedCSS);
  
  console.log(`  Removed ${removedCount} unused rules`);
  console.log(`  Original size: ${(css.length / 1024).toFixed(2)}KB`);
  console.log(`  Optimized size: ${(optimizedCSS.length / 1024).toFixed(2)}KB`);
  console.log(`  Saved: ${(((css.length - optimizedCSS.length) / css.length) * 100).toFixed(1)}%`);
  
  return {
    originalSize: css.length,
    optimizedSize: optimizedCSS.length,
    removedRules: removedCount
  };
}

// Main optimization
function main() {
  console.log('Starting CSS optimization...\n');
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalRemovedRules = 0;
  
  for (const cssFile of cssFiles) {
    if (fs.existsSync(cssFile)) {
      const result = optimizeCSS(cssFile);
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      totalRemovedRules += result.removedRules;
    }
  }
  
  console.log('\n=== Optimization Summary ===');
  console.log(`Total original size: ${(totalOriginalSize / 1024).toFixed(2)}KB`);
  console.log(`Total optimized size: ${(totalOptimizedSize / 1024).toFixed(2)}KB`);
  console.log(`Total rules removed: ${totalRemovedRules}`);
  console.log(`Total savings: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`Size reduction: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(2)}KB`);
}

if (require.main === module) {
  main();
}

module.exports = { optimizeCSS, extractSelectors, isSelectorUsed };
