// TypeScript binding for WASM Fingerprint Engine
import { WASMLoader } from '../loaders/wasmLoader';
import type { FingerprintData, AdvancedFingerprint } from '../types';

export class FingerprintBinding {
  private engine: any = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await WASMLoader.loadWASM();
    this.engine = WASMLoader.getFingerprintEngine();
  }

  /**
   * Generate comprehensive fingerprint data
   */
  async generateFingerprint(): Promise<FingerprintData | null> {
    if (!this.engine) {
      console.warn('Fingerprint engine not available');
      return null;
    }

    try {
      const canvas = this.engine.generate_canvas_fingerprint();
      const webgl = this.engine.generate_webgl_fingerprint();
      const audio = this.engine.generate_audio_fingerprint();
      const media = this.engine.generate_media_fingerprint();
      const hardware = this.engine.generate_hardware_fingerprint();
      const network = this.engine.generate_network_fingerprint();
      const performance = this.engine.generate_performance_fingerprint();
      const browser = this.engine.generate_browser_fingerprint();
      const comprehensive = this.engine.generate_comprehensive_fingerprint();

      return {
        canvas,
        webgl,
        audio,
        media,
        hardware,
        network,
        performance,
        browser,
        comprehensive,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      return null;
    }
  }

  /**
   * Generate advanced fingerprint with structured data
   */
  async generateAdvancedFingerprint(): Promise<AdvancedFingerprint | null> {
    if (!this.engine) {
      console.warn('Fingerprint engine not available');
      return null;
    }

    try {
      const canvas = this.engine.generate_canvas_fingerprint();
      const webgl = this.engine.generate_webgl_fingerprint();
      const audio = this.engine.generate_audio_fingerprint();
      const hardware = this.engine.generate_hardware_fingerprint();
      const performance = this.engine.generate_performance_fingerprint();
      const browser = this.engine.generate_browser_fingerprint();

      return {
        canvas: {
          fingerprint: canvas,
          context: '2d'
        },
        webgl: {
          fingerprint: webgl,
          vendor: 'WebGL',
          renderer: 'WebGL'
        },
        audio: {
          fingerprint: audio,
          context: 'audio'
        },
        hardware: {
          cores: navigator.hardwareConcurrency || 0,
          memory: (navigator as any).deviceMemory || 0,
          platform: navigator.platform
        },
        screen: {
          resolution: `${screen.width}x${screen.height}`,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        },
        performance: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform
        },
        browser: {
          userAgent: navigator.userAgent,
          version: this.getBrowserVersion(),
          vendor: navigator.vendor
        }
      };
    } catch (error) {
      console.error('Error generating advanced fingerprint:', error);
      return null;
    }
  }

  private getBrowserVersion(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * Check if fingerprint engine is available
   */
  isAvailable(): boolean {
    return this.engine !== null;
  }
}
