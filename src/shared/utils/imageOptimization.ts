/**
 * Image Optimization Utilities
 * Handles lazy loading, responsive images, and format detection
 */

/**
 * Lazy load images using Intersection Observer
 */
export const setupImageLazyLoading = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Load srcset if available
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        // Add loaded class for fade-in effect
        img.classList.add('loaded');
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Load images 50px before they enter viewport
    threshold: 0.01
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};

/**
 * Check if WebP is supported
 */
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise(resolve => {
    const webP = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    const img = new Image();
    img.onload = () => resolve(img.height === 2);
    img.onerror = () => resolve(false);
    img.src = webP;
  });
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = async (originalSrc: string): Promise<string> => {
  const supportsWebP = await isWebPSupported();
  
  if (supportsWebP) {
    // Replace extension with .webp if supported
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return originalSrc;
};

/**
 * Create responsive image element
 */
export const createResponsiveImage = (src: string, alt: string, sizes?: string): HTMLImageElement => {
  const img = document.createElement('img');
  
  // Use data-src for lazy loading
  img.dataset.src = src;
  img.alt = alt;
  
  // Add sizes attribute for responsive images
  if (sizes) {
    img.sizes = sizes;
  }
  
  // Add placeholder or low-quality image
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
  
  // Add loading attribute for native lazy loading
  img.loading = 'lazy';
  
  return img;
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (imageSrcs: string[]) => {
  if (typeof document === 'undefined') return;
  
  imageSrcs.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export default {
  setupImageLazyLoading,
  isWebPSupported,
  getOptimalImageFormat,
  createResponsiveImage,
  preloadCriticalImages
};

