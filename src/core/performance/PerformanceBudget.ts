// Performance Budget - Portfolio-specific performance targets
export const PERFORMANCE_BUDGETS = {
  lighthouse: {
    performance: 95,
    accessibility: 100,
    seo: 100,
    bestPractices: 95,
  },
  metrics: {
    fcp: 1500,  // First Contentful Paint (ms)
    lcp: 2500,  // Largest Contentful Paint (ms)
    fid: 100,   // First Input Delay (ms)
    cls: 0.1,   // Cumulative Layout Shift
    tti: 3500,  // Time to Interactive (ms)
  },
  bundles: {
    initial: 150,    // KB - Initial bundle size
    total: 500,      // KB - Total bundle size
    threeJs: 100,    // KB - Three.js bundle
    wasm: 50,        // KB - WASM modules
    vendor: 200,     // KB - Vendor libraries
  },
  images: {
    maxSize: 500,    // KB - Max image size
    maxWidth: 1920,  // px - Max image width
    maxHeight: 1080, // px - Max image height
    quality: 85,     // % - JPEG quality
  },
  network: {
    maxRequests: 50,     // Max HTTP requests
    maxConcurrent: 6,    // Max concurrent requests
    timeout: 5000,       // ms - Request timeout
  },
} as const;

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number> = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start monitoring performance metrics
   */
  startMonitoring(): void {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTI();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Get current performance score
   */
  getPerformanceScore(): number {
    const scores = this.calculateScores();
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Check if performance budget is met
   */
  isBudgetMet(): boolean {
    const scores = this.calculateScores();
    return scores.every(score => score >= 90);
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    score: number;
    metrics: Record<string, number>;
    budgetStatus: Record<string, boolean>;
    recommendations: string[];
  } {
    const scores = this.calculateScores();
    const score = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    return {
      score,
      metrics: { ...this.metrics },
      budgetStatus: this.checkBudgetStatus(),
      recommendations: this.generateRecommendations(),
    };
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  private observeFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  private observeTTI(): void {
    // TTI is calculated differently, this is a simplified version
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.tti = navigation.loadEventEnd - navigation.fetchStart;
    });
  }

  private calculateScores(): number[] {
    const scores: number[] = [];
    
    // FCP Score
    if (this.metrics.fcp) {
      const fcpScore = this.metrics.fcp <= PERFORMANCE_BUDGETS.metrics.fcp ? 100 : 
        Math.max(0, 100 - ((this.metrics.fcp - PERFORMANCE_BUDGETS.metrics.fcp) / 100));
      scores.push(fcpScore);
    }
    
    // LCP Score
    if (this.metrics.lcp) {
      const lcpScore = this.metrics.lcp <= PERFORMANCE_BUDGETS.metrics.lcp ? 100 : 
        Math.max(0, 100 - ((this.metrics.lcp - PERFORMANCE_BUDGETS.metrics.lcp) / 100));
      scores.push(lcpScore);
    }
    
    // FID Score
    if (this.metrics.fid) {
      const fidScore = this.metrics.fid <= PERFORMANCE_BUDGETS.metrics.fid ? 100 : 
        Math.max(0, 100 - ((this.metrics.fid - PERFORMANCE_BUDGETS.metrics.fid) / 10));
      scores.push(fidScore);
    }
    
    // CLS Score
    if (this.metrics.cls !== undefined) {
      const clsScore = this.metrics.cls <= PERFORMANCE_BUDGETS.metrics.cls ? 100 : 
        Math.max(0, 100 - (this.metrics.cls * 1000));
      scores.push(clsScore);
    }
    
    return scores;
  }

  private checkBudgetStatus(): Record<string, boolean> {
    return {
      fcp: this.metrics.fcp ? this.metrics.fcp <= PERFORMANCE_BUDGETS.metrics.fcp : true,
      lcp: this.metrics.lcp ? this.metrics.lcp <= PERFORMANCE_BUDGETS.metrics.lcp : true,
      fid: this.metrics.fid ? this.metrics.fid <= PERFORMANCE_BUDGETS.metrics.fid : true,
      cls: this.metrics.cls !== undefined ? this.metrics.cls <= PERFORMANCE_BUDGETS.metrics.cls : true,
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.fcp && this.metrics.fcp > PERFORMANCE_BUDGETS.metrics.fcp) {
      recommendations.push('Optimize First Contentful Paint by reducing render-blocking resources');
    }
    
    if (this.metrics.lcp && this.metrics.lcp > PERFORMANCE_BUDGETS.metrics.lcp) {
      recommendations.push('Optimize Largest Contentful Paint by optimizing images and critical resources');
    }
    
    if (this.metrics.fid && this.metrics.fid > PERFORMANCE_BUDGETS.metrics.fid) {
      recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time');
    }
    
    if (this.metrics.cls && this.metrics.cls > PERFORMANCE_BUDGETS.metrics.cls) {
      recommendations.push('Reduce Cumulative Layout Shift by reserving space for dynamic content');
    }
    
    return recommendations;
  }
}
