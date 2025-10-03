import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    const clientEnv = {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
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
          '@': path.resolve(__dirname, '.'),
        }
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
        port: 5177,
        strictPort: true,
        cors: true
      },
      
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('i18next') || id.includes('i18n')) {
              return 'i18n-vendor';
            }
            if (id.includes('marked') || id.includes('cookie')) {
              return 'ui-vendor';
            }
            if (id.includes('@google/genai')) {
              return 'ai-vendor';
            }
            if (id.includes('simplex-noise')) {
              return 'three-vendor'; // Group with Three.js
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
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
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ]
};
});
