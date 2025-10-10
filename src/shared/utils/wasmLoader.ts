/**
 * WASM Loader Utility
 * 
 * Provides lazy loading and caching for WASM modules with fallback support.
 * Handles initialization errors gracefully and provides a clean API for WASM usage.
 */

let wasmInstance: any = null;
let wasmLoadPromise: Promise<any> | null = null;
let isInitialized = false;

/**
 * Loads the WASM module asynchronously with caching and error handling
 * @returns Promise that resolves to the WASM module or null if loading fails
 */
export async function loadWASM(): Promise<any> {
  if (wasmInstance) return wasmInstance;
  if (wasmLoadPromise) return wasmLoadPromise;
  
  wasmLoadPromise = import('../wasm/portfolio_engine.js')
    .then(async (module) => {
      try {
        // Initialize WASM module
        await module.default();
        wasmInstance = module;
        isInitialized = true;
        console.log('✅ WASM module loaded successfully');
        return module;
      } catch (error) {
        console.warn('⚠️ WASM initialization failed:', error);
        throw error;
      }
    })
    .catch(async (error) => {
      console.warn('⚠️ WASM loading failed, using JS fallback:', error);
      return null;
    });
  
  return wasmLoadPromise;
}

/**
 * Checks if WASM is available and initialized
 * @returns boolean indicating WASM availability
 */
export function isWASMAvailable(): boolean {
  return isInitialized && wasmInstance !== null;
}

/**
 * Gets the current WASM instance if available
 * @returns WASM instance or null
 */
export function getWASMInstance(): any {
  return wasmInstance;
}

/**
 * Resets the WASM loader state (useful for testing)
 */
export function resetWASMLoader(): void {
  wasmInstance = null;
  wasmLoadPromise = null;
  isInitialized = false;
}

/**
 * Preloads WASM module in the background
 * Useful for performance optimization
 */
export function preloadWASM(): void {
  if (typeof window !== 'undefined' && !wasmInstance && !wasmLoadPromise) {
    // Use requestIdleCallback for non-blocking preload
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadWASM().catch(() => {
          // Silently handle preload failures
        });
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadWASM().catch(() => {
          // Silently handle preload failures
        });
      }, 1000);
    }
  }
}
