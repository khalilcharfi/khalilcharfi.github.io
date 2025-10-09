// WASM Module Loader with Error Handling and Lazy Loading
import type { FingerprintEngine, AnalyticsEngine } from '../types';

export class WASMLoader {
  private static fingerprintEngine: FingerprintEngine | null = null;
  private static analyticsEngine: AnalyticsEngine | null = null;
  private static loadingPromise: Promise<void> | null = null;

  /**
   * Lazy load the WASM module with error handling
   */
  static async loadWASM(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadWASMModule();
    return this.loadingPromise;
  }

  private static async loadWASMModule(): Promise<void> {
    try {
      // Dynamic import of WASM module
      const wasmModule = await import('/portfolio_engine.js');
      
      // Initialize engines
      this.fingerprintEngine = new wasmModule.FingerprintEngine();
      this.analyticsEngine = new wasmModule.AnalyticsEngine();
      
      console.log('WASM modules loaded successfully');
    } catch (error) {
      console.warn('Failed to load WASM modules:', error);
      // Graceful degradation - continue without WASM features
    }
  }

  /**
   * Get the fingerprint engine instance
   */
  static getFingerprintEngine(): FingerprintEngine | null {
    return this.fingerprintEngine;
  }

  /**
   * Get the analytics engine instance
   */
  static getAnalyticsEngine(): AnalyticsEngine | null {
    return this.analyticsEngine;
  }

  /**
   * Check if WASM modules are loaded
   */
  static isLoaded(): boolean {
    return this.fingerprintEngine !== null && this.analyticsEngine !== null;
  }

  /**
   * Reset the loader state (useful for testing)
   */
  static reset(): void {
    this.fingerprintEngine = null;
    this.analyticsEngine = null;
    this.loadingPromise = null;
  }
}
