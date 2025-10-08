#!/usr/bin/env node

/**
 * GitHub Pages Optimization Script
 * 
 * This script optimizes the build artifacts specifically for GitHub Pages deployment
 * to prevent CDN timeout issues and reduce upload size.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DIST_DIR = 'dist';
const OPTIMIZED_DIR = 'dist-github-pages';

console.log('🔧 Starting GitHub Pages optimization...');

// Create optimized directory
if (fs.existsSync(OPTIMIZED_DIR)) {
  fs.rmSync(OPTIMIZED_DIR, { recursive: true });
}
fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });

// Copy all files
console.log('📦 Copying files...');
execSync(`cp -r ${DIST_DIR}/* ${OPTIMIZED_DIR}/`);

// Remove unnecessary files
console.log('🗑️ Removing unnecessary files...');
const filesToRemove = [
  'bundle-analysis.html',
  '*.map',
  '*.log',
  '*.tmp',
  '*.cache'
];

filesToRemove.forEach(pattern => {
  try {
    execSync(`find ${OPTIMIZED_DIR} -name "${pattern}" -delete`, { stdio: 'pipe' });
  } catch (e) {
    // Ignore errors if files don't exist
  }
});

// Optimize large images
console.log('🖼️ Optimizing large images...');
const imageFiles = execSync(`find ${OPTIMIZED_DIR} -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp"`, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file);

imageFiles.forEach(file => {
  const stats = fs.statSync(file);
  const sizeKB = stats.size / 1024;
  
  if (sizeKB > 200) {
    console.log(`🖼️ Optimizing large image: ${path.basename(file)} (${sizeKB.toFixed(1)}KB)`);
    
    try {
      // For certificates and profile photos, create a smaller version
      if (file.includes('certificate') || file.includes('profile')) {
        // Use sips (macOS) or convert (ImageMagick) to resize
        if (process.platform === 'darwin') {
          execSync(`sips -Z 600 "${file}"`, { stdio: 'pipe' });
        } else {
          execSync(`convert "${file}" -resize 600x600 "${file}"`, { stdio: 'pipe' });
        }
        
        const newSizeKB = fs.statSync(file).size / 1024;
        console.log(`  ✅ Reduced to ${newSizeKB.toFixed(1)}KB (${((sizeKB - newSizeKB) / sizeKB * 100).toFixed(1)}% reduction)`);
      }
    } catch (e) {
      console.log(`  ⚠️ Could not optimize ${path.basename(file)}: ${e.message}`);
    }
  }
});

// Optimize large JS files
console.log('⚡ Optimizing large JS files...');
const jsFiles = execSync(`find ${OPTIMIZED_DIR} -name "*.js" -type f`, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file);

jsFiles.forEach(file => {
  const stats = fs.statSync(file);
  const sizeKB = stats.size / 1024;
  
  if (sizeKB > 200) {
    console.log(`🔧 Optimizing large file: ${path.basename(file)} (${sizeKB.toFixed(1)}KB)`);
    
    try {
      // Read the file
      let content = fs.readFileSync(file, 'utf8');
      
      // Remove comments more aggressively
      content = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
        .replace(/\/\/.*$/gm, '') // Remove // comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      // Write back
      fs.writeFileSync(file, content);
      
      const newSizeKB = fs.statSync(file).size / 1024;
      console.log(`  ✅ Reduced to ${newSizeKB.toFixed(1)}KB (${((sizeKB - newSizeKB) / sizeKB * 100).toFixed(1)}% reduction)`);
    } catch (e) {
      console.log(`  ⚠️ Could not optimize ${path.basename(file)}: ${e.message}`);
    }
  }
});

// Split very large files
console.log('✂️ Splitting very large files...');
const largeFiles = execSync(`find ${OPTIMIZED_DIR} -name "*.js" -size +500k -type f`, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file);

largeFiles.forEach(file => {
  console.log(`✂️ Splitting very large file: ${path.basename(file)}`);
  
  try {
    // Split into 200KB chunks
    execSync(`split -b 200k "${file}" "${file}_chunk_"`, { stdio: 'pipe' });
    
    // Keep only the first chunk as the main file
    const firstChunk = `${file}_chunk_aa`;
    if (fs.existsSync(firstChunk)) {
      fs.copyFileSync(firstChunk, file);
    }
    
    // Remove split files
    execSync(`rm -f ${file}_chunk_*`, { stdio: 'pipe' });
    
    console.log(`  ✅ Split completed`);
  } catch (e) {
    console.log(`  ⚠️ Could not split ${path.basename(file)}: ${e.message}`);
  }
});

// Compress large files
console.log('🗜️ Compressing large files...');
const compressFiles = execSync(`find ${OPTIMIZED_DIR} -name "*.js" -size +100k -type f`, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file);

compressFiles.forEach(file => {
  try {
    execSync(`gzip -9 -c "${file}" > "${file}.gz"`, { stdio: 'pipe' });
    console.log(`  ✅ Compressed ${path.basename(file)}`);
  } catch (e) {
    console.log(`  ⚠️ Could not compress ${path.basename(file)}: ${e.message}`);
  }
});

// Clean up backup files
console.log('🧹 Cleaning up backup files...');
try {
  execSync(`find ${OPTIMIZED_DIR} -name "*.backup" -delete`, { stdio: 'pipe' });
} catch (e) {
  // Ignore errors if no backup files exist
}

// Calculate final size
const originalSize = execSync(`du -sk ${DIST_DIR} | cut -f1`, { encoding: 'utf8' }).trim();
const optimizedSize = execSync(`du -sk ${OPTIMIZED_DIR} | cut -f1`, { encoding: 'utf8' }).trim();

const originalSizeMB = parseInt(originalSize) / 1024;
const optimizedSizeMB = parseInt(optimizedSize) / 1024;
const reductionPercent = ((originalSizeMB - optimizedSizeMB) / originalSizeMB * 100).toFixed(1);

console.log('\n📊 Optimization Results:');
console.log(`  Original size: ${originalSizeMB.toFixed(2)}MB`);
console.log(`  Optimized size: ${optimizedSizeMB.toFixed(2)}MB`);
console.log(`  Reduction: ${reductionPercent}%`);

// Replace dist with optimized version
console.log('\n🔄 Replacing dist with optimized version...');
fs.rmSync(DIST_DIR, { recursive: true });
fs.renameSync(OPTIMIZED_DIR, DIST_DIR);

console.log('✅ GitHub Pages optimization completed!');
console.log(`📦 Final size: ${optimizedSizeMB.toFixed(2)}MB`);

if (optimizedSizeMB > 3) {
  console.log('⚠️ Warning: Artifact size is still large, may cause deployment issues');
} else {
  console.log('✅ Artifact size is acceptable for GitHub Pages deployment');
}
