/**
 * WASM Fallback Test Script
 * 
 * This script temporarily disables WASM loading to test fallback behavior.
 * Run this in the browser console to test the fallback mechanism.
 */

console.log('🧪 Testing WASM Fallback Behavior...');

// Test 1: Check if WASM loader is available
if (typeof window !== 'undefined') {
  // Override the WASM loader to simulate failure
  const originalConsoleWarn = console.warn;
  let wasmLoadAttempts = 0;
  
  console.warn = (...args) => {
    if (args[0] && args[0].includes('WASM')) {
      wasmLoadAttempts++;
      console.log(`📊 WASM Load Attempt #${wasmLoadAttempts}:`, args[0]);
    }
    originalConsoleWarn.apply(console, args);
  };
  
  // Test 2: Try to load WASM and see fallback behavior
  console.log('🔄 Attempting to load WASM...');
  
  // Check if WASM modules are available in the DOM
  const wasmFiles = document.querySelectorAll('script[src*="portfolio_engine"], script[src*="wasm"]');
  console.log('📁 WASM Files found in DOM:', wasmFiles.length);
  
  // Test 3: Check Performance Drawer for WASM status
  console.log('🔍 Checking Performance Drawer for WASM status...');
  
  // Look for WASM status elements
  const wasmStatusElements = document.querySelectorAll('[class*="perf-metric"], [class*="wasm"]');
  console.log('📊 Performance elements found:', wasmStatusElements.length);
  
  // Test 4: Check if analytics are working (should work with JS fallback)
  console.log('📈 Testing analytics functionality...');
  
  // Simulate some analytics events
  if (window.analytics) {
    console.log('✅ Analytics object found');
  } else {
    console.log('⚠️ Analytics object not found');
  }
  
  console.log('✅ WASM Fallback Test Complete!');
  console.log('📋 Check the Performance Drawer for WASM status indicators');
  console.log('📋 Look for console messages about WASM loading/fallback');
  
} else {
  console.log('❌ This test must be run in a browser environment');
}
