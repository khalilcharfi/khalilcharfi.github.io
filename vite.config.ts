import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Environment variables that should be available in the browser
    const clientEnv = {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_ENABLE_CHATBOT': JSON.stringify(env.VITE_ENABLE_CHATBOT),
        'process.env.VITE_ENABLE_DYNAMIC_CONTENT': JSON.stringify(env.VITE_ENABLE_DYNAMIC_CONTENT),
        'process.env.VITE_ENABLE_PERSONAS': JSON.stringify(env.VITE_ENABLE_PERSONAS),
        'process.env.VITE_FORCE_DEFAULT_CONTENT': JSON.stringify(env.VITE_FORCE_DEFAULT_CONTENT),
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
        strictPort: true,
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'ui-vendor': ['marked', 'react-hook-consent'],
          'ai-vendor': ['@google/genai']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  },
  // Enable preloading and bundle analysis
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
