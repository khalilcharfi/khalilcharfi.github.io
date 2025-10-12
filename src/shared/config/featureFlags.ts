// Feature Flags Configuration
// This file contains all feature toggle flags for the application
// Import from here to avoid circular dependencies

// ===============================
// Chatbot Configuration
// ===============================
export const ENABLE_CHATBOT: boolean = import.meta.env.VITE_ENABLE_CHATBOT !== 'false';

// ===============================
// Content Personalization Flags
// ===============================
export const DYNAMIC_CONTENT_ENABLED: boolean = import.meta.env.VITE_ENABLE_DYNAMIC_CONTENT !== 'false';
export const FORCE_DEFAULT_CONTENT: boolean = import.meta.env.VITE_FORCE_DEFAULT_CONTENT === 'true';
export const PERSONAS_FEATURE_ENABLED: boolean = import.meta.env.VITE_ENABLE_PERSONAS !== 'false';

// ===============================
// Development & Debug Flags
// ===============================
export const SHOW_DEV_ELEMENTS: boolean = import.meta.env.VITE_SHOW_DEV_ELEMENTS === 'true';
export const SHOW_VISITOR_CONTROLS: boolean = import.meta.env.VITE_SHOW_VISITOR_CONTROLS === 'true';
export const SHOW_PROFILE_INSIGHTS: boolean = import.meta.env.VITE_SHOW_PROFILE_INSIGHTS === 'true';
export const SHOW_TRANSLATION_DEBUG: boolean = import.meta.env.VITE_SHOW_TRANSLATION_DEBUG === 'true';
export const SHOW_DEBUG_INFO: boolean = import.meta.env.VITE_SHOW_DEBUG_INFO === 'true';

// ===============================
// UI Feature Flags
// ===============================
// Recommended sections configuration - PERMANENTLY DISABLED
// Priority sections feature is disabled and will not render
export const SHOW_RECOMMENDED_SECTIONS: boolean = false;

// ===============================
// Environment Detection
// ===============================
export const IS_DEVELOPMENT: boolean = import.meta.env.DEV === true;
export const IS_PRODUCTION: boolean = import.meta.env.PROD === true;

