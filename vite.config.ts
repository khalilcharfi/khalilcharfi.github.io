import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// Server Configuration
const SERVER_PORT = 5177;
const PREVIEW_PORT = 4173;

// Build Configuration
const ASSETS_INLINE_LIMIT = 2048;
const CHUNK_SIZE_WARNING_LIMIT = 400;
const BUILD_TARGET = 'es2020';
const TERSER_COMPRESSION_PASSES = 5;
const TERSER_INLINE_LEVEL = 2;

// Asset Patterns
const ASSETS_CHUNK_FILE_PATTERN = 'assets/[name]-[hash].js';
const ASSETS_ENTRY_FILE_PATTERN = 'assets/[name]-[hash].js';
const ASSETS_FILE_PATTERN = 'assets/[name]-[hash].[ext]';
const BUNDLE_ANALYSIS_FILE = 'dist/bundle-analysis.html';

// Path Aliases
const PATHS = {
  SRC: './src',
  FEATURES: './src/features',
  SHARED: './src/shared',
  WASM: './wasm-modules/pkg',
} as const;

// Dependencies to Dedupe
const DEDUPE_DEPS = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'scheduler',
  'use-sync-external-store'
] as const;

// Dependencies to Optimize
const OPTIMIZE_DEPS = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'scheduler',
  'use-sync-external-store',
  '@react-three/fiber',
  '@react-three/drei',
  'react-i18next',
  'i18next'
] as const;

// Dependencies to Exclude in Production
const PROD_EXCLUDE_DEPS = [
  '@axe-core/puppeteer',
  'puppeteer',
  'lighthouse'
] as const;

// External Patterns for Production
const PROD_EXTERNAL_PATTERNS = [
  /.*PerformanceDrawer.*/,
  /.*TranslationTest.*/,
  /.*DebugComponents.*/,
  /@axe-core/,
  /puppeteer/,
  /lighthouse/
] as const;

// Dev-Only Patterns
const DEV_ONLY_PATTERNS = [
  '@axe-core',
  'puppeteer',
  'lighthouse',
  'TranslationTest',
  'PerformanceDrawer',
  'debug/',
  'react-devtools',
  '__REACT_DEVTOOLS_GLOBAL_HOOK__'
] as const;

// Chunk Names
const CHUNK_NAMES = {
  // Source file chunks
  PORTFOLIO_CONTENT: 'portfolio-content',
  PORTFOLIO_DOMAIN: 'portfolio-domain',
  PERFORMANCE_CORE: 'performance-core',
  WASM_MODULES: 'wasm-modules',
  
  // Portfolio section chunks
  PORTFOLIO_HOME: 'portfolio-home',
  PORTFOLIO_ABOUT: 'portfolio-about',
  PORTFOLIO_SKILLS: 'portfolio-skills',
  PORTFOLIO_EXPERIENCE: 'portfolio-experience',
  PORTFOLIO_PROJECTS: 'portfolio-projects',
  PORTFOLIO_CONTACT: 'portfolio-contact',
  
  // Feature chunks
  ANALYTICS_FEATURES: 'analytics-features',
  CHATBOT_FEATURES: 'chatbot-features',
  I18N_FEATURES: 'i18n-features',
  
  // Vendor chunks
  REACT_VENDOR: 'react-vendor',
  THREE_MATH: 'three-math',
  THREE_OBJECTS: 'three-objects',
  THREE_MATERIALS: 'three-materials',
  THREE_RENDER: 'three-render',
  THREE_ADDONS: 'three-addons',
  THREE_NOISE: 'three-noise',
  THREE_POSTPROCESSING: 'three-postprocessing',
  THREE_VENDOR: 'three-vendor',
  AI_TYPES: 'ai-types',
  AI_MODELS: 'ai-models',
  AI_VENDOR: 'ai-vendor',
  MARKDOWN_VENDOR: 'markdown-vendor',
  COOKIE_VENDOR: 'cookie-vendor',
  VENDOR: 'vendor',
} as const;

// React Vendor Patterns
const REACT_VENDOR_PATTERNS = [
  /\/node_modules\/react\//,
  /\/node_modules\/react-dom\//,
  /\/node_modules\/scheduler\//,
  /\/node_modules\/use-sync-external-store\//,
  /\/node_modules\/react-reconciler\//
] as const;

// React Ecosystem Libraries
const REACT_ECOSYSTEM_LIBS = [
  '/@react-three/',
  '/react-hook-consent/',
  '/react-i18next/',
  '/i18next/',
  '/i18next-',
  '/its-fine/',
  '/react-use-measure/',
  '/zustand/'
] as const;

// Three.js Related Libraries
const THREE_LIBS = ['three', 'simplex-noise', 'postprocessing'] as const;

// CORS Headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
} as const;

// Console Functions to Remove in Production
const PROD_PURE_FUNCS = [
  'console.log',
  'console.debug',
  'console.info',
  'console.warn'
] as const;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  
  // API Key configuration
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
  
  // Dead Code Elimination - enabled by default in production
  const enableDCE = env.VITE_ENABLE_DCE !== 'false' && (env.VITE_ENABLE_DCE === 'true' || isProd);
  
  // Tree shaking - disabled if VITE_DISABLE_TREE_SHAKING is true
  const disableTreeShaking = env.VITE_DISABLE_TREE_SHAKING === 'true';
  
  // Build optimization flags
  const shouldMinify = env.VITE_NO_MINIFY !== 'true';
  
  // Client environment variables
  const clientEnv = {
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    'import.meta.env.VITE_ENABLE_CHATBOT': JSON.stringify(env.VITE_ENABLE_CHATBOT),
    'import.meta.env.VITE_ENABLE_DYNAMIC_CONTENT': JSON.stringify(env.VITE_ENABLE_DYNAMIC_CONTENT),
    'import.meta.env.VITE_ENABLE_PERSONAS': JSON.stringify(env.VITE_ENABLE_PERSONAS),
    'import.meta.env.VITE_ENABLED_PERSONAS': JSON.stringify(env.VITE_ENABLED_PERSONAS),
    'import.meta.env.VITE_DISABLED_PERSONAS': JSON.stringify(env.VITE_DISABLED_PERSONAS),
    'import.meta.env.VITE_FORCE_DEFAULT_CONTENT': JSON.stringify(env.VITE_FORCE_DEFAULT_CONTENT),
    'import.meta.env.VITE_SHOW_RECOMMENDED_SECTIONS': JSON.stringify(env.VITE_SHOW_RECOMMENDED_SECTIONS),
    'import.meta.env.VITE_SHOW_DEV_ELEMENTS': JSON.stringify(env.VITE_SHOW_DEV_ELEMENTS),
    'import.meta.env.VITE_SHOW_VISITOR_CONTROLS': JSON.stringify(env.VITE_SHOW_VISITOR_CONTROLS),
    'import.meta.env.VITE_SHOW_PROFILE_INSIGHTS': JSON.stringify(env.VITE_SHOW_PROFILE_INSIGHTS),
    'import.meta.env.VITE_SHOW_TRANSLATION_DEBUG': JSON.stringify(env.VITE_SHOW_TRANSLATION_DEBUG),
    'import.meta.env.VITE_SHOW_DEBUG_INFO': JSON.stringify(env.VITE_SHOW_DEBUG_INFO),
    'import.meta.env.DEV': JSON.stringify(isDev),
    'import.meta.env.PROD': JSON.stringify(isProd),
    'import.meta.env.MODE': JSON.stringify(mode)
  };
    
  return {
    define: clientEnv,
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, PATHS.SRC),
        '@/features': path.resolve(__dirname, PATHS.FEATURES),
        '@/shared': path.resolve(__dirname, PATHS.SHARED),
        '@/wasm': path.resolve(__dirname, PATHS.WASM), // WASM module resolution
      },
      dedupe: [...DEDUPE_DEPS]
    },
    
    optimizeDeps: {
      include: [...OPTIMIZE_DEPS],
      exclude: isProd ? [...PROD_EXCLUDE_DEPS] : []
    },
    server: {
      port: SERVER_PORT,
      strictPort: false,
      cors: true,
      headers: CORS_HEADERS,
      hmr: {
        overlay: true,
        clientPort: undefined
      }
    },
    
    preview: {
      port: PREVIEW_PORT,
      strictPort: false,
      cors: true
    },
    publicDir: 'public',
    assetsInclude: ['**/*.wasm'],
    
    build: {
      copyPublicDir: true,
      target: BUILD_TARGET,
      assetsInlineLimit: ASSETS_INLINE_LIMIT, // Reduced for better caching
      chunkSizeWarningLimit: CHUNK_SIZE_WARNING_LIMIT, // Further reduced to catch large chunks
      cssCodeSplit: true,
      cssMinify: shouldMinify && isProd,
      minify: shouldMinify ? 'terser' : false,
      sourcemap: isDev || !shouldMinify,
      reportCompressedSize: true,
      modulePreload: { polyfill: false },
      // Performance optimizations
      rollupOptions: {
        external: isProd ? [...PROD_EXTERNAL_PATTERNS] : [],
        output: {
          // Chunking disabled - all code in single bundle
          chunkFileNames: ASSETS_CHUNK_FILE_PATTERN,
          entryFileNames: ASSETS_ENTRY_FILE_PATTERN,
          assetFileNames: ASSETS_FILE_PATTERN,
          // Inline all dynamic imports into single bundle
          inlineDynamicImports: true
        },
        
        treeshake: disableTreeShaking ? false : (enableDCE ? {
          moduleSideEffects: (id) => {
            // Preserve side effects for entry point to ensure app initialization
            if (id.includes('index.tsx') || id.includes('i18n')) {
              return true;
            }
            // Return false for external modules (node_modules)
            return !id.includes('node_modules');
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          unknownGlobalSideEffects: false,
          preset: 'recommended'
        } : {
          moduleSideEffects: (id) => !id.includes('node_modules'),
          propertyReadSideEffects: true,
          tryCatchDeoptimization: true
        })
      },
      
      terserOptions: shouldMinify ? {
        compress: {
          passes: TERSER_COMPRESSION_PASSES, // Increased for better compression
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? [...PROD_PURE_FUNCS] : [],
          unsafe_arrows: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_Function: true,
          // Additional compression options for large files
          sequences: true,
          properties: true,
          conditionals: true,
          comparisons: true,
          evaluate: true,
          booleans: true,
          loops: true,
          hoist_funs: true,
          hoist_vars: true,
          if_return: true,
          join_vars: true,
          collapse_vars: true,
          reduce_vars: true,
          inline: TERSER_INLINE_LEVEL,
          keep_fargs: false,
          keep_fnames: false,
          ...(enableDCE && {
            dead_code: true,
            unused: true,
            side_effects: false
          })
        },
        format: {
          comments: false
        },
        mangle: {
          safari10: true,
          ...(enableDCE && {
            toplevel: true,
            properties: {
              regex: /^_/
            }
          })
        }
      } : undefined
    },
    
    plugins: [
      visualizer({
        filename: BUNDLE_ANALYSIS_FILE,
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ]
  };
});
