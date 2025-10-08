import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  
  // API Key configuration
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
  
  // Dead Code Elimination - enabled by default in production
  const enableDCE = env.VITE_ENABLE_DCE !== 'false' && (env.VITE_ENABLE_DCE === 'true' || isProd);
  
  // Build optimization flags
  const shouldMinify = env.VITE_NO_MINIFY !== 'true';
  
  // Client environment variables
  const clientEnv = Object.entries({
    API_KEY: geminiApiKey,
    GEMINI_API_KEY: geminiApiKey,
    VITE_ENABLE_CHATBOT: env.VITE_ENABLE_CHATBOT,
    VITE_ENABLE_DYNAMIC_CONTENT: env.VITE_ENABLE_DYNAMIC_CONTENT,
    VITE_ENABLE_PERSONAS: env.VITE_ENABLE_PERSONAS,
    VITE_FORCE_DEFAULT_CONTENT: env.VITE_FORCE_DEFAULT_CONTENT,
    VITE_SHOW_RECOMMENDED_SECTIONS: env.VITE_SHOW_RECOMMENDED_SECTIONS,
    VITE_SHOW_DEV_ELEMENTS: env.VITE_SHOW_DEV_ELEMENTS,
    VITE_SHOW_VISITOR_CONTROLS: env.VITE_SHOW_VISITOR_CONTROLS,
    VITE_SHOW_PROFILE_INSIGHTS: env.VITE_SHOW_PROFILE_INSIGHTS,
    VITE_SHOW_TRANSLATION_DEBUG: env.VITE_SHOW_TRANSLATION_DEBUG,
    VITE_SHOW_DEBUG_INFO: env.VITE_SHOW_DEBUG_INFO,
    VITE_ENABLE_DCE: enableDCE,
    NODE_ENV: mode,
    DEV: isDev,
    PROD: isProd
  }).reduce((acc, [key, value]) => {
    acc[`process.env.${key}`] = JSON.stringify(value);
    return acc;
  }, {} as Record<string, string>);
    
  return {
    define: clientEnv,
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/shared': path.resolve(__dirname, './src/shared'),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'scheduler', 'use-sync-external-store']
    },
    
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react/jsx-runtime', 
        'scheduler', 
        'use-sync-external-store',
        '@react-three/fiber',
        '@react-three/drei',
        'react-i18next',
        'i18next'
      ],
      exclude: isProd ? ['@axe-core/puppeteer', 'puppeteer', 'lighthouse'] : []
    },
    server: {
      port: 5177,
      strictPort: false,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      },
      hmr: {
        overlay: true,
        clientPort: undefined
      }
    },
    
    preview: {
      port: 4173,
      strictPort: false,
      cors: true
    },
    publicDir: 'public',
    
    build: {
      copyPublicDir: true,
      target: 'es2020',
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 500, // Reduced to catch large chunks earlier
      cssCodeSplit: true,
      cssMinify: shouldMinify && isProd,
      minify: shouldMinify ? 'terser' : false,
      sourcemap: isDev || !shouldMinify,
      reportCompressedSize: true,
      modulePreload: { polyfill: false },
      
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return;
            
            // Exclude dev-only dependencies in production
            if (isProd) {
              const devOnlyPatterns = [
                '@axe-core', 'puppeteer', 'lighthouse',
                'TranslationTest', 'PerformanceDrawer', 
                'debug/', 'react-devtools', '__REACT_DEVTOOLS_GLOBAL_HOOK__'
              ];
              if (devOnlyPatterns.some(pattern => id.includes(pattern))) {
                return undefined;
              }
            }
            
            // React ecosystem - MUST be first to ensure React is bundled properly
            // Include ALL React-related packages to prevent undefined errors
            // Check for React core packages and reconciler
            if (id.match(/\/node_modules\/react\//) ||
                id.match(/\/node_modules\/react-dom\//) ||
                id.match(/\/node_modules\/scheduler\//) ||
                id.match(/\/node_modules\/use-sync-external-store\//) ||
                id.match(/\/node_modules\/react-reconciler\//)) {
              return 'react-vendor';
            }
            
            // Check for React ecosystem libraries and hooks
            if (id.includes('/@react-three/') ||
                id.includes('/react-hook-consent/') ||
                id.includes('/react-i18next/') ||
                id.includes('/i18next/') ||
                id.includes('/i18next-') ||
                id.includes('/its-fine/') ||
                id.includes('/react-use-measure/') ||
                id.includes('/zustand/')) {
              return 'react-vendor';
            }
            
            // Three.js - split for better tree-shaking and smaller chunks
            if (id.includes('three/src/')) return 'three-core';
            if (id.includes('three/examples/')) return 'three-addons';
            if (id.includes('three') || id.includes('simplex-noise') || id.includes('postprocessing')) {
              // Split large Three.js into smaller chunks
              if (id.includes('three/src/math/') || id.includes('three/src/core/')) return 'three-math';
              if (id.includes('three/src/objects/') || id.includes('three/src/geometries/')) return 'three-objects';
              if (id.includes('three/src/materials/') || id.includes('three/src/shaders/')) return 'three-materials';
              if (id.includes('three/src/renderers/') || id.includes('three/src/scenes/')) return 'three-render';
              return 'three-vendor';
            }
            
            // Split AI vendor into smaller chunks
            if (id.includes('@google/genai')) {
              if (id.includes('@google/genai/src/types/')) return 'ai-types';
              if (id.includes('@google/genai/src/models/')) return 'ai-models';
              return 'ai-vendor';
            }
            
            // Other vendors - split large ones
            if (id.includes('marked')) return 'markdown-vendor';
            if (id.includes('cookie')) return 'cookie-vendor';
            
            return 'vendor';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Ensure proper chunk loading order - React vendor must load first
          inlineDynamicImports: false
        },
        
        treeshake: enableDCE ? {
          moduleSideEffects: (id) => {
            // Preserve side effects for entry point to ensure app initialization
            if (id.includes('index.tsx') || id.includes('i18n')) {
              return true;
            }
            return 'no-external';
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          unknownGlobalSideEffects: false,
          preset: 'recommended'
        } : {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: true,
          tryCatchDeoptimization: true
        }
      },
      
      terserOptions: shouldMinify ? {
        compress: {
          passes: 3, // Increased for better compression
          drop_console: isProd,
          drop_debugger: isProd,
        //  pure_funcs: isProd ? ['console.log', 'console.debug', 'console.info'] : [],
          unsafe_arrows: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
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
        filename: 'dist/bundle-analysis.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ]
  };
});
