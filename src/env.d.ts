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
