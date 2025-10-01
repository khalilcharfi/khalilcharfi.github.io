#!/usr/bin/env node

/**
 * Test Performance Optimization Implementation
 * Verifies all optimization files are in place and valid
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(path, description) {
  const fullPath = resolve(__dirname, path);
  const exists = existsSync(fullPath);
  
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - NOT FOUND: ${path}`, 'red');
    return false;
  }
}

function checkFileContent(path, searchTerms, description) {
  try {
    const content = readFileSync(resolve(__dirname, path), 'utf8');
    const allFound = searchTerms.every(term => content.includes(term));
    
    if (allFound) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      const missing = searchTerms.filter(term => !content.includes(term));
      log(`⚠️  ${description} - Missing: ${missing.join(', ')}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error reading file: ${error.message}`, 'red');
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('🚀 Performance Optimization Test', 'cyan');
console.log('='.repeat(60) + '\n');

let passed = 0;
let failed = 0;

// Test 1: Core Files Exist
log('📁 Testing Core Files...', 'blue');
if (checkFile('src/utils/lazyLoading.ts', 'Lazy Loading Utilities')) passed++; else failed++;
if (checkFile('src/utils/performanceInit.ts', 'Performance Initialization')) passed++; else failed++;
if (checkFile('src/components/AIChatBox.tsx', 'AI ChatBox Component')) passed++; else failed++;
if (checkFile('public/sw.js', 'Service Worker')) passed++; else failed++;
if (checkFile('src/hooks/usePerformanceMonitor.ts', 'Performance Monitor Hook')) passed++; else failed++;
console.log();

// Test 2: Documentation Files
log('📚 Testing Documentation...', 'blue');
if (checkFile('PERFORMANCE_OPTIMIZATION_GUIDE.md', 'Optimization Guide')) passed++; else failed++;
if (checkFile('OPTIMIZATION_SUMMARY.md', 'Optimization Summary')) passed++; else failed++;
if (checkFile('QUICK_REFERENCE.md', 'Quick Reference')) passed++; else failed++;
console.log();

// Test 3: Configuration Files
log('⚙️  Testing Configuration...', 'blue');
if (checkFileContent(
  'vite.config.ts',
  ['manualChunks', 'three-vendor', 'ai-vendor', 'react-vendor'],
  'Vite Config - Code Splitting'
)) passed++; else failed++;

if (checkFileContent(
  'vite.config.ts',
  ['visualizer', 'gzipSize', 'brotliSize'],
  'Vite Config - Bundle Analysis'
)) passed++; else failed++;

if (checkFileContent(
  'package.json',
  ['build:analyze', 'perf:audit', 'perf:report'],
  'Package.json - Performance Scripts'
)) passed++; else failed++;
console.log();

// Test 4: Lazy Loading Implementation
log('🔄 Testing Lazy Loading...', 'blue');
if (checkFileContent(
  'src/utils/lazyLoading.ts',
  ['LazyThreeBackground', 'loadAIModule', 'registerServiceWorker'],
  'Lazy Loading - Core Functions'
)) passed++; else failed++;

if (checkFileContent(
  'src/utils/lazyLoading.ts',
  ['preloadCriticalChunks', 'conditionallyPreloadThreeJS'],
  'Lazy Loading - Preloading'
)) passed++; else failed++;
console.log();

// Test 5: Performance Monitoring
log('📊 Testing Performance Monitoring...', 'blue');
if (checkFileContent(
  'src/utils/performanceInit.ts',
  ['setupPerformanceMonitoring', 'canHandleHeavyAnimations', 'getOptimalParticleCount'],
  'Performance Init - Core Functions'
)) passed++; else failed++;

if (checkFileContent(
  'src/utils/performanceInit.ts',
  ['PerformanceObserver', 'largest-contentful-paint', 'first-input'],
  'Performance Init - Web Vitals'
)) passed++; else failed++;

if (checkFileContent(
  'src/hooks/usePerformanceMonitor.ts',
  ['fps', 'memoryUsage', 'loadTime'],
  'Performance Monitor Hook - Metrics'
)) passed++; else failed++;
console.log();

// Test 6: Service Worker Configuration
log('🔧 Testing Service Worker...', 'blue');
if (checkFileContent(
  'public/sw.js',
  ['STATIC_CACHE', 'DYNAMIC_CACHE', 'install', 'activate', 'fetch'],
  'Service Worker - Core Events'
)) passed++; else failed++;

if (checkFileContent(
  'public/sw.js',
  ['caches.match', 'cache.addAll', 'isStaticAsset'],
  'Service Worker - Caching Strategy'
)) passed++; else failed++;
console.log();

// Test 7: AI ChatBox
log('🤖 Testing AI ChatBox...', 'blue');
if (checkFileContent(
  'src/components/AIChatBox.tsx',
  ['loadAIModule', 'GoogleGenAI', 'sendMessage'],
  'AI ChatBox - Core Functions'
)) passed++; else failed++;

if (checkFileContent(
  'src/components/AIChatBox.tsx',
  ['isLoading', 'error', 'messages'],
  'AI ChatBox - State Management'
)) passed++; else failed++;
console.log();

// Results
console.log('='.repeat(60));
log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`, passed === passed + failed ? 'green' : 'yellow');

if (failed === 0) {
  log('✨ All optimization files are in place!', 'green');
  log('\n📋 Next Steps:', 'cyan');
  log('  1. Read PERFORMANCE_OPTIMIZATION_GUIDE.md', 'reset');
  log('  2. Integrate optimizations into index.tsx', 'reset');
  log('  3. Run: npm run build:analyze', 'reset');
  log('  4. Run: npm run perf:audit', 'reset');
} else {
  log('⚠️  Some files are missing or incomplete.', 'yellow');
  log('Please check the errors above.', 'yellow');
}

console.log('\n' + '='.repeat(60) + '\n');

process.exit(failed === 0 ? 0 : 1);

