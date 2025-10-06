#!/usr/bin/env node

/**
 * Detailed Bundle Analysis Script
 * Provides insights into what's taking up space in the bundle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Detailed Bundle Analysis\n');
console.log('='.repeat(70));

const distDir = path.join(__dirname, '../dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('❌ Error: dist/assets directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Function to get gzipped size
function getGzippedSize(filePath) {
  try {
    const gzipped = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
    return parseInt(gzipped.trim());
  } catch (error) {
    return 0;
  }
}

// Get all files
const files = fs.readdirSync(assetsDir)
  .filter(f => f.endsWith('.js') || f.endsWith('.css'))
  .map(file => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const gzipped = getGzippedSize(filePath);
    
    return {
      name: file,
      size: stats.size,
      gzipped: gzipped,
      type: file.endsWith('.js') ? 'JS' : 'CSS'
    };
  });

// Categorize files
const categories = {
  'Three.js': files.filter(f => f.name.includes('three')),
  'AI/Gemini': files.filter(f => f.name.includes('ai-vendor')),
  'React': files.filter(f => f.name.includes('react')),
  'Main App': files.filter(f => f.name.includes('index-') && f.name.endsWith('.js')),
  'UI Components': files.filter(f => f.name.includes('ui-vendor')),
  'Vendor/Utils': files.filter(f => f.name.includes('vendor') && !f.name.includes('react') && !f.name.includes('three') && !f.name.includes('ai') && !f.name.includes('ui')),
  'Styles': files.filter(f => f.name.endsWith('.css')),
  'Other': files.filter(f => !f.name.includes('three') && !f.name.includes('ai-vendor') && !f.name.includes('react') && !f.name.includes('index-') && !f.name.includes('ui-vendor') && !f.name.includes('vendor') && !f.name.endsWith('.css'))
};

console.log('\n📊 Bundle Breakdown by Category:\n');

let totalGzipped = 0;
const categoryStats = [];

for (const [category, categoryFiles] of Object.entries(categories)) {
  if (categoryFiles.length === 0) continue;
  
  const categorySize = categoryFiles.reduce((sum, f) => sum + f.gzipped, 0);
  totalGzipped += categorySize;
  
  categoryStats.push({
    category,
    size: categorySize,
    files: categoryFiles.length,
    percentage: 0 // Will calculate after we have total
  });
}

// Calculate percentages
categoryStats.forEach(stat => {
  stat.percentage = ((stat.size / totalGzipped) * 100).toFixed(1);
});

// Sort by size
categoryStats.sort((a, b) => b.size - a.size);

// Display category breakdown
console.log('| Category | Size (gzipped) | Files | % of Total |');
console.log('|----------|----------------|-------|------------|');

for (const stat of categoryStats) {
  const sizeKB = (stat.size / 1024).toFixed(2);
  console.log(`| ${stat.category.padEnd(20)} | ${sizeKB.padStart(8)} KB | ${String(stat.files).padStart(5)} | ${stat.percentage.padStart(6)}% |`);
}

const totalKB = (totalGzipped / 1024).toFixed(2);
console.log('\n' + '='.repeat(70));
console.log(`\n**Total: ${totalKB} KB (gzipped)**\n`);

// Top 10 largest files
console.log('\n📦 Top 10 Largest Files:\n');
console.log('| Rank | File | Original | Gzipped | % of Total |');
console.log('|------|------|----------|---------|------------|');

const sortedFiles = [...files].sort((a, b) => b.gzipped - a.gzipped).slice(0, 10);

sortedFiles.forEach((file, index) => {
  const originalKB = (file.size / 1024).toFixed(2);
  const gzippedKB = (file.gzipped / 1024).toFixed(2);
  const percentage = ((file.gzipped / totalGzipped) * 100).toFixed(1);
  const shortName = file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name;
  
  console.log(`| ${(index + 1).toString().padStart(4)} | ${shortName.padEnd(30)} | ${originalKB.padStart(8)} KB | ${gzippedKB.padStart(7)} KB | ${percentage.padStart(6)}% |`);
});

// Optimization suggestions
console.log('\n' + '='.repeat(70));
console.log('\n💡 Optimization Recommendations:\n');

const suggestions = [];

// Check Three.js
const threeSize = categoryStats.find(c => c.category === 'Three.js')?.size || 0;
if (threeSize > 150 * 1024) {
  suggestions.push({
    priority: 'HIGH',
    category: 'Three.js',
    issue: `Three.js bundle is ${(threeSize / 1024).toFixed(2)} KB (${((threeSize / totalGzipped) * 100).toFixed(1)}% of total)`,
    solutions: [
      'Consider lazy loading Three.js only when 3D background is needed',
      'Use tree-shaking to import only required Three.js modules',
      'Evaluate if all Three.js features are necessary',
      'Consider making 3D background optional/toggleable'
    ]
  });
}

// Check AI vendor
const aiSize = categoryStats.find(c => c.category === 'AI/Gemini')?.size || 0;
if (aiSize > 30 * 1024) {
  suggestions.push({
    priority: 'HIGH',
    category: 'AI/Gemini',
    issue: `AI/Gemini bundle is ${(aiSize / 1024).toFixed(2)} KB (${((aiSize / totalGzipped) * 100).toFixed(1)}% of total)`,
    solutions: [
      'Lazy load AI/chatbot features only when user activates them',
      'Consider making chatbot an optional feature',
      'Use dynamic imports for @google/genai',
      'Load AI vendor chunk on-demand'
    ]
  });
}

// Check React
const reactSize = categoryStats.find(c => c.category === 'React')?.size || 0;
if (reactSize > 50 * 1024) {
  suggestions.push({
    priority: 'MEDIUM',
    category: 'React',
    issue: `React bundle is ${(reactSize / 1024).toFixed(2)} KB (${((reactSize / totalGzipped) * 100).toFixed(1)}% of total)`,
    solutions: [
      'React size is expected, but ensure production build is used',
      'Check if any dev dependencies are included',
      'Verify tree-shaking is working correctly'
    ]
  });
}

// Check main app
const appSize = categoryStats.find(c => c.category === 'Main App')?.size || 0;
if (appSize > 50 * 1024) {
  suggestions.push({
    priority: 'MEDIUM',
    category: 'Main App',
    issue: `Main app bundle is ${(appSize / 1024).toFixed(2)} KB`,
    solutions: [
      'Consider code splitting for routes/sections',
      'Lazy load heavy components (certificates, projects)',
      'Review if all translations need to be loaded upfront',
      'Split vendor and app code more aggressively'
    ]
  });
}

// Display suggestions
suggestions.forEach((suggestion, index) => {
  console.log(`${index + 1}. [${suggestion.priority}] ${suggestion.category}`);
  console.log(`   Issue: ${suggestion.issue}`);
  console.log(`   Solutions:`);
  suggestion.solutions.forEach(sol => {
    console.log(`   • ${sol}`);
  });
  console.log('');
});

// Target comparison
console.log('='.repeat(70));
console.log('\n🎯 Target Comparison:\n');

const TARGET = 350;
const STRETCH = 300;
const CRITICAL = 450;
const current = parseFloat(totalKB);

console.log(`Current:      ${current.toFixed(2)} KB`);
console.log(`Target:       ${TARGET} KB`);
console.log(`Stretch Goal: ${STRETCH} KB`);
console.log(`Critical:     ${CRITICAL} KB`);
console.log('');

const overTarget = current - TARGET;
const overStretch = current - STRETCH;

if (current > TARGET) {
  console.log(`⚠️  Over target by: ${overTarget.toFixed(2)} KB (${((overTarget / TARGET) * 100).toFixed(1)}%)`);
  console.log(`⚠️  Over stretch goal by: ${overStretch.toFixed(2)} KB (${((overStretch / STRETCH) * 100).toFixed(1)}%)`);
  
  // Calculate what needs to be reduced
  console.log('\n📉 To reach target:');
  console.log(`   Need to reduce by: ${overTarget.toFixed(2)} KB`);
  console.log(`   Suggested reductions:`);
  
  if (threeSize > 150 * 1024) {
    const reduction = Math.min(overTarget * 1024, threeSize - 100 * 1024);
    console.log(`   • Three.js: -${(reduction / 1024).toFixed(2)} KB (lazy load or optimize)`);
  }
  
  if (aiSize > 20 * 1024) {
    const reduction = Math.min(overTarget * 1024, aiSize - 10 * 1024);
    console.log(`   • AI/Gemini: -${(reduction / 1024).toFixed(2)} KB (lazy load chatbot)`);
  }
} else {
  console.log(`✅ Under target by: ${(TARGET - current).toFixed(2)} KB`);
}

console.log('\n' + '='.repeat(70));
console.log('\n📁 Full bundle analysis available at: dist/bundle-analysis.html\n');
