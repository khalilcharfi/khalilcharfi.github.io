// WASM Fingerprint Engine Types
export interface FingerprintEngine {
  generate_canvas_fingerprint(): string;
  generate_webgl_fingerprint(): string;
  generate_audio_fingerprint(): string;
  generate_media_fingerprint(): string;
  generate_hardware_fingerprint(): string;
  generate_network_fingerprint(): string;
  generate_performance_fingerprint(): string;
  generate_browser_fingerprint(): string;
  generate_comprehensive_fingerprint(): string;
}

export interface FingerprintData {
  canvas: string;
  webgl: string;
  audio: string;
  media: string;
  hardware: string;
  network: string;
  performance: string;
  browser: string;
  comprehensive: string;
  timestamp: number;
}

export interface AdvancedFingerprint {
  canvas?: {
    fingerprint: string;
    context: string;
  };
  webgl?: {
    fingerprint: string;
    vendor: string;
    renderer: string;
  };
  audio?: {
    fingerprint: string;
    context: string;
  };
  hardware?: {
    cores: number;
    memory: number;
    platform: string;
  };
  screen?: {
    resolution: string;
    colorDepth: number;
    pixelRatio: number;
  };
  performance?: {
    timezone: string;
    language: string;
    platform: string;
  };
  browser?: {
    userAgent: string;
    version: string;
    vendor: string;
  };
}
