import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Support both GEMINI_API_KEY and VITE_GEMINI_API_KEY
    const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
    
    const clientEnv = {
        'process.env.API_KEY': JSON.stringify(geminiApiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'process.env.VITE_ENABLE_CHATBOT': JSON.stringify(env.VITE_ENABLE_CHATBOT),
        'process.env.VITE_ENABLE_DYNAMIC_CONTENT': JSON.stringify(env.VITE_ENABLE_DYNAMIC_CONTENT),
        'process.env.VITE_ENABLE_PERSONAS': JSON.stringify(env.VITE_ENABLE_PERSONAS),
        'process.env.VITE_FORCE_DEFAULT_CONTENT': JSON.stringify(env.VITE_FORCE_DEFAULT_CONTENT),
        'process.env.VITE_SHOW_RECOMMENDED_SECTIONS': JSON.stringify(env.VITE_SHOW_RECOMMENDED_SECTIONS),
        'process.env.VITE_SHOW_DEV_ELEMENTS': JSON.stringify(env.VITE_SHOW_DEV_ELEMENTS),
        'process.env.VITE_SHOW_VISITOR_CONTROLS': JSON.stringify(env.VITE_SHOW_VISITOR_CONTROLS),
        'process.env.VITE_SHOW_PROFILE_INSIGHTS': JSON.stringify(env.VITE_SHOW_PROFILE_INSIGHTS),
        'process.env.VITE_SHOW_TRANSLATION_DEBUG': JSON.stringify(env.VITE_SHOW_TRANSLATION_DEBUG),
        'process.env.VITE_SHOW_DEBUG_INFO': JSON.stringify(env.VITE_SHOW_DEBUG_INFO),
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.DEV': JSON.stringify(mode === 'development'),
        'process.env.PROD': JSON.stringify(mode === 'production')
    };
    
    return {
      define: clientEnv,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@/features': path.resolve(__dirname, './src/features'),
          '@/shared': path.resolve(__dirname, './src/shared'),
        },
        dedupe: ['react', 'react-dom', 'react/jsx-runtime']
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime'],
        exclude: []
      },
      server: {
        port: 5177,
        strictPort: false, // Allow fallback to another port if 5177 is busy
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        },
        hmr: {
          overlay: true, // Show error overlay
          clientPort: undefined // Use the server port
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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Exclude dev-only dependencies in production
            if (mode === 'production') {
              // Skip bundling development tools
              if (id.includes('@axe-core') || id.includes('puppeteer') || id.includes('lighthouse')) {
                return undefined;
              }
              // Skip TranslationTest in production builds
              if (id.includes('TranslationTest')) {
                return undefined;
              }
              // Skip PerformanceDrawer and debug components in production builds
              if (id.includes('PerformanceDrawer') || id.includes('debug/')) {
                return undefined;
              }
            }
            
            // Keep React and React-DOM together - CRITICAL for proper React hooks
            if (id.includes('react-dom') || id.includes('react/') || 
                (id.includes('react') && !id.includes('react-') && !id.includes('@react'))) {
              return 'react-vendor';
            }
            // React-based libraries that depend on React (keep separate to avoid duplication)
            if (id.includes('@react-three') || id.includes('react-i18next') || 
                id.includes('react-hook-consent') || id.includes('scheduler')) {
              return 'react-libs';
            }
            // Split Three.js for better tree-shaking
            if (id.includes('three/')) {
              // Core Three.js modules
              if (id.includes('three/src/')) {
                return 'three-core';
              }
              // Three.js examples/addons (usually larger)
              if (id.includes('three/examples/')) {
                return 'three-addons';
              }
            }
            // Main Three.js bundle, simplex-noise, and postprocessing
            if (id.includes('three') || id.includes('simplex-noise') || id.includes('postprocessing')) {
              return 'three-vendor';
            }
            if (id.includes('i18next') && !id.includes('react-i18next')) {
              return 'i18n-vendor';
            }
            if (id.includes('marked') || id.includes('cookie')) {
              return 'ui-vendor';
            }
            if (id.includes('@google/genai')) {
              return 'ai-vendor';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Enable tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      // Exclude debug components from production builds
      external: mode === 'production' ? (id) => {
        // Only externalize if it's a direct import of debug components
        if (id.includes('debug/PerformanceDrawer') || id.includes('debug/DebugComponents')) {
          return true;
        }
        return false;
      } : undefined
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
        passes: 2, // Multiple passes for better compression
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true
      },
      format: {
        comments: false
      },
      mangle: {
        safari10: true // Better Safari compatibility
      }
    },
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    cssMinify: mode === 'production',
    target: 'es2020', // Updated for better modern features
    assetsInlineLimit: 4096,
    reportCompressedSize: true,
    modulePreload: {
      polyfill: false // Disable if targeting modern browsers only
    }
  },
  plugins: [
    // Plugin to remove debug components in production
    mode === 'production' ? {
      name: 'remove-debug-components',
      generateBundle(options, bundle) {
        // Remove debug component files from the bundle
        Object.keys(bundle).forEach(fileName => {
          if (bundle[fileName].type === 'chunk' && 
              (fileName.includes('debug-') || fileName.includes('PerformanceDrawer'))) {
            delete bundle[fileName];
          }
        });
      }
    } : null,
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean)
};
});
