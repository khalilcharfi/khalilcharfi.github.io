/**
 * Critical CSS Extraction Utility
 * Extracts and inlines critical above-the-fold CSS
 */

export const getCriticalCSS = (): string => {
  return `
    /* Critical above-the-fold styles */
    :root {
      --accent-color: #00A6FF;
      --primary-bg-raw: 13, 17, 23;
      --primary-bg: rgb(var(--primary-bg-raw));
      --primary-text: #c9d1d9;
      --secondary-text: #8b949e;
      --nav-height: 70px;
      --transition-speed: 0.3s;
    }
    
    html[data-theme="light"] {
      --accent-color: #4F46E5;
      --primary-bg-raw: 241, 245, 249;
      --primary-bg: rgb(var(--primary-bg-raw));
      --primary-text: #1e293b;
      --secondary-text: #475569;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--primary-bg);
      color: var(--primary-text);
      min-height: 100vh;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--nav-height);
      z-index: 1000;
      background: rgba(13, 17, 23, 0.7);
      backdrop-filter: blur(16px);
    }
    
    #home {
      min-height: 100vh;
      padding-top: var(--nav-height);
    }
  `;
};

export const injectCriticalCSS = () => {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('critical-css');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = getCriticalCSS();
  document.head.insertBefore(style, document.head.firstChild);
};

export default {
  getCriticalCSS,
  injectCriticalCSS
};

