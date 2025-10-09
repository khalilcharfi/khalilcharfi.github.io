// Image Optimizer - Portfolio-specific image optimization
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private loadedImages = new Set<string>();

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  /**
   * Generate responsive image sets for different screen sizes
   */
  generateSrcSet(imagePath: string, sizes: number[] = [320, 640, 1024, 1920]): string {
    const basePath = imagePath.replace(/\.[^/.]+$/, '');
    const extension = imagePath.split('.').pop();
    
    return sizes
      .map(size => `${basePath}-${size}w.${extension} ${size}w`)
      .join(', ');
  }

  /**
   * Lazy load images below the fold
   */
  lazyLoadImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => this.loadImage(img as HTMLImageElement));
    }
  }

  /**
   * Preload critical images (hero, profile)
   */
  preloadCritical(): void {
    const criticalImages = [
      '/asset/profile/profile-photo.jpg',
      '/asset/logo.png',
    ];

    criticalImages.forEach(src => {
      if (!this.loadedImages.has(src)) {
        this.preloadImage(src);
      }
    });
  }

  /**
   * Optimize project images
   */
  optimizeProjectImages(): void {
    const projectImages = document.querySelectorAll('.project-image, .project-thumbnail');
    
    projectImages.forEach(img => {
      const imageElement = img as HTMLImageElement;
      
      // Add loading="lazy" if not already present
      if (!imageElement.hasAttribute('loading')) {
        imageElement.setAttribute('loading', 'lazy');
      }
      
      // Add decoding="async" for better performance
      if (!imageElement.hasAttribute('decoding')) {
        imageElement.setAttribute('decoding', 'async');
      }
    });
  }

  /**
   * Generate WebP fallback for supported browsers
   */
  generateWebPFallback(imagePath: string): string {
    const basePath = imagePath.replace(/\.[^/.]+$/, '');
    return `${basePath}.webp`;
  }

  /**
   * Check if WebP is supported
   */
  isWebPSupported(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get optimized image source based on device capabilities
   */
  async getOptimizedImageSrc(imagePath: string): Promise<string> {
    const isWebP = await this.isWebPSupported();
    const isRetina = window.devicePixelRatio > 1;
    
    if (isWebP) {
      return this.generateWebPFallback(imagePath);
    }
    
    if (isRetina) {
      return this.generateSrcSet(imagePath, [640, 1280, 1920]);
    }
    
    return imagePath;
  }

  /**
   * Compress image on client side (for user uploads)
   */
  compressImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      this.loadedImages.add(src);
    }
  }

  private preloadImage(src: string): void {
    const img = new Image();
    img.src = src;
    this.loadedImages.add(src);
  }

  /**
   * Get loading progress for images
   */
  getImageLoadingProgress(): number {
    const totalImages = document.querySelectorAll('img').length;
    return (this.loadedImages.size / totalImages) * 100;
  }

  /**
   * Reset image loading state
   */
  reset(): void {
    this.loadedImages.clear();
  }
}
