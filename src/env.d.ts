/// <reference types="vite/client" />

/**
 * Environment variable type definitions
 * Provides type safety for import.meta.env usage
 */

interface ImportMetaEnv {
  // API Keys
  readonly GEMINI_API_KEY?: string;
  
  // Feature Flags
  readonly VITE_ENABLE_CHATBOT?: string;
  readonly VITE_ENABLE_DYNAMIC_CONTENT?: string;
  readonly VITE_ENABLE_PERSONAS?: string;
  readonly VITE_ENABLED_PERSONAS?: string;
  readonly VITE_DISABLED_PERSONAS?: string;
  readonly VITE_FORCE_DEFAULT_CONTENT?: string;
  readonly VITE_SHOW_RECOMMENDED_SECTIONS?: string;
  
  // Development/Debug Flags
  readonly VITE_SHOW_DEV_ELEMENTS?: string;
  readonly VITE_SHOW_VISITOR_CONTROLS?: string;
  readonly VITE_SHOW_PROFILE_INSIGHTS?: string;
  readonly VITE_SHOW_TRANSLATION_DEBUG?: string;
  readonly VITE_SHOW_DEBUG_INFO?: string;
  
  // Build Environment
  readonly NODE_ENV?: string;
  readonly DEV?: boolean;
  readonly PROD?: boolean;
  readonly MODE?: string;
  
  // Base URL
  readonly BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Window interface for global types
interface Window {
  // Analytics
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
  
  // Consent
  useConsent?: () => { consent: { analytics: boolean } };
  
  // Performance
  __analytics_fallback_mode?: boolean;
  
  // Three.js
  __three_scene?: any;
  __three_renderer?: any;
}

// Declare module for WASM
declare module '*.wasm' {
  const content: string;
  export default content;
}

// Declare WASM module types
declare module '@/wasm' {
  export default function init(input?: string | URL | Request | Response): Promise<any>;
  export class FingerprintEngine {
    constructor();
    free(): void;
    generate_canvas_fingerprint(): string;
    generate_webgl_fingerprint(): string;
    generate_performance_fingerprint(): string;
    generate_complete_fingerprint(): string;
  }
  export class AnalyticsEngine {
    constructor();
    free(): void;
    track_event(event_type: string, data: string): void;
    update_scroll_depth(depth: number): void;
    get_engagement_score(): number;
    classify_visitor_behavior(): string;
    get_analytics_summary(): string;
  }
  export class PerformanceMonitor {
    constructor();
    free(): void;
    update(current_time: number): void;
    get_average_fps(): number;
    get_frame_time_variance(): number;
    should_reduce_quality(): boolean;
  }
  export class ParticleSystem {
    constructor(count: number);
    free(): void;
    update(delta_time: number, theme_is_dark: boolean): void;
    set_mouse_position(x: number, y: number): void;
    get_positions(): Float32Array;
    get_colors(): Float32Array;
    get_sizes(): Float32Array;
  }
}

// Declare module for worker files
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

// Declare module for worker URL
declare module '*?worker&url' {
  const workerUrl: string;
  export default workerUrl;
}
