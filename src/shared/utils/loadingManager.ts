import React from 'react';
/**
 * Loading Manager - Centralized loading state management
 * Handles loading states, progress tracking, and performance monitoring
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingProgress {
  current: number;
  total: number;
  percentage: number;
  stage: string;
}

export interface LoadingMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  resourcesLoaded: number;
  resourcesFailed: number;
  cacheHits: number;
  networkRequests: number;
}

class LoadingManager {
  private listeners: Set<(state: LoadingState, progress?: LoadingProgress) => void> = new Set();
  private state: LoadingState = 'idle';
  private progress: LoadingProgress = { current: 0, total: 0, percentage: 0, stage: 'Initializing' };
  private metrics: LoadingMetrics = {
    startTime: Date.now(),
    resourcesLoaded: 0,
    resourcesFailed: 0,
    cacheHits: 0,
    networkRequests: 0
  };
  private loadingStages = [
    'Initializing application',
    'Loading critical resources',
    'Loading React components',
    'Loading assets',
    'Finalizing'
  ];
  private currentStageIndex = 0;

  /**
   * Start loading process
   */
  startLoading(totalResources: number = 10): void {
    console.log('[LoadingManager] startLoading() called with total:', totalResources);
    this.state = 'loading';
    this.metrics.startTime = Date.now();
    this.progress = {
      current: 0,
      total: totalResources,
      percentage: 0,
      stage: this.loadingStages[0]
    };
    console.log('[LoadingManager] State set to:', this.state, 'Progress:', this.progress);
    this.notifyListeners();
    console.log('[LoadingManager] Notified', this.listeners.size, 'listeners');
  }

  /**
   * Update loading progress
   */
  updateProgress(current: number, total?: number, stage?: string): void {
    if (total) this.progress.total = total;
    this.progress.current = Math.min(current, this.progress.total);
    this.progress.percentage = Math.round((this.progress.current / this.progress.total) * 100);
    
    if (stage) {
      this.progress.stage = stage;
    } else {
      // Auto-advance stage based on percentage
      const stageIndex = Math.floor((this.progress.percentage / 100) * (this.loadingStages.length - 1));
      if (stageIndex !== this.currentStageIndex) {
        this.currentStageIndex = stageIndex;
        this.progress.stage = this.loadingStages[stageIndex];
      }
    }
    
    this.notifyListeners();
  }

  /**
   * Increment progress by one
   */
  incrementProgress(stage?: string): void {
    this.updateProgress(this.progress.current + 1, undefined, stage);
  }

  /**
   * Mark loading as complete
   */
  completeLoading(): void {
    console.log('[LoadingManager] completeLoading() called');
    console.log('[LoadingManager] Previous state:', this.state);
    this.state = 'success';
    this.progress.percentage = 100;
    this.progress.stage = 'Complete';
    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    console.log('[LoadingManager] New state:', this.state, 'Duration:', this.metrics.duration, 'ms');
    this.notifyListeners();
    console.log('[LoadingManager] Notified', this.listeners.size, 'listeners about completion');
    
    // Log performance metrics
    this.logMetrics();
    
    // Hide initial loading screen
    this.hideInitialLoader();
    console.log('[LoadingManager] hideInitialLoader() called');
  }

  /**
   * Mark loading as failed
   */
  failLoading(error?: Error): void {
    this.state = 'error';
    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    console.error('[LoadingManager] Loading failed:', error);
    this.notifyListeners();
  }

  /**
   * Track resource loading
   */
  trackResource(type: 'loaded' | 'failed' | 'cached' | 'network'): void {
    switch (type) {
      case 'loaded':
        this.metrics.resourcesLoaded++;
        break;
      case 'failed':
        this.metrics.resourcesFailed++;
        break;
      case 'cached':
        this.metrics.cacheHits++;
        break;
      case 'network':
        this.metrics.networkRequests++;
        break;
    }
  }

  /**
   * Subscribe to loading state changes
   */
  subscribe(callback: (state: LoadingState, progress?: LoadingProgress) => void): () => void {
    console.log('[LoadingManager] New subscriber added. Total listeners:', this.listeners.size + 1);
    this.listeners.add(callback);
    // Immediately notify with current state
    console.log('[LoadingManager] Notifying new subscriber with current state:', this.state, this.progress);
    callback(this.state, this.progress);
    
    // Return unsubscribe function
    return () => {
      console.log('[LoadingManager] Unsubscribing listener');
      this.listeners.delete(callback);
    };
  }

  /**
   * Get current state
   */
  getState(): LoadingState {
    return this.state;
  }

  /**
   * Get current progress
   */
  getProgress(): LoadingProgress {
    return { ...this.progress };
  }

  /**
   * Get metrics
   */
  getMetrics(): LoadingMetrics {
    return { ...this.metrics };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    console.log('[LoadingManager] notifyListeners() called. Notifying', this.listeners.size, 'listeners');
    console.log('[LoadingManager] Current state:', this.state, 'Progress:', this.progress);
    Array.from(this.listeners).forEach((listener, idx) => {
      try {
        console.log('[LoadingManager] Calling listener', idx + 1, 'with state:', this.state);
        listener(this.state, this.progress);
      } catch (error) {
        console.error('[LoadingManager] Listener error:', error);
      }
    });
    console.log('[LoadingManager] All listeners notified');
  }

  /**
   * Hide initial loading screen with animation
   */
  private hideInitialLoader(): void {
    const loader = document.getElementById('initial-loading');
    if (loader) {
      // Add fade-out animation
      loader.style.transition = 'opacity 0.5s ease-out';
      loader.style.opacity = '0';
      
      setTimeout(() => {
        loader.style.display = 'none';
        loader.remove();
      }, 500);
    }
  }

  /**
   * Log performance metrics
   */
  private logMetrics(): void {
    const { duration, resourcesLoaded, resourcesFailed, cacheHits, networkRequests } = this.metrics;
    
    console.log(
      `%c⚡ Loading Performance`,
      'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;'
    );
    console.table({
      'Duration': `${duration}ms`,
      'Resources Loaded': resourcesLoaded,
      'Resources Failed': resourcesFailed,
      'Cache Hits': cacheHits,
      'Network Requests': networkRequests,
      'Cache Hit Rate': `${Math.round((cacheHits / (cacheHits + networkRequests)) * 100)}%`
    });

    // Track in performance API if available
    if (
      typeof window !== 'undefined' &&
      window.performance &&
      typeof window.performance.mark === 'function'
    ) {
      performance.mark('app-loaded');
      performance.measure('app-loading-duration', 'navigationStart', 'app-loaded');
    }
  }

  /**
   * Reset manager state
   */
  reset(): void {
    this.state = 'idle';
    this.progress = { current: 0, total: 0, percentage: 0, stage: 'Initializing' };
    this.metrics = {
      startTime: Date.now(),
      resourcesLoaded: 0,
      resourcesFailed: 0,
      cacheHits: 0,
      networkRequests: 0
    };
    this.currentStageIndex = 0;
  }
}

// Export singleton instance
export const loadingManager = new LoadingManager();

/**
 * Hook to use loading manager in React components
 */
export function useLoadingManager() {
  const [state, setState] = React.useState<LoadingState>(loadingManager.getState());
  const [progress, setProgress] = React.useState<LoadingProgress>(loadingManager.getProgress());

  console.log('[useLoadingManager] Hook called. Current state:', state, 'Progress:', progress);

  React.useEffect(() => {
    console.log('[useLoadingManager] Setting up subscription...');
    const unsubscribe = loadingManager.subscribe((newState, newProgress) => {
      console.log('[useLoadingManager] Received update - State:', newState, 'Progress:', newProgress);
      console.log('[useLoadingManager] Setting state to:', newState);
      setState(newState);
      if (newProgress) {
        console.log('[useLoadingManager] Setting progress to:', newProgress);
        setProgress(newProgress);
      }
    });

    console.log('[useLoadingManager] Subscription setup complete');
    return () => {
      console.log('[useLoadingManager] Cleaning up subscription');
      unsubscribe();
    };
  }, []);

  return {
    state,
    progress,
    metrics: loadingManager.getMetrics(),
    startLoading: (total?: number) => loadingManager.startLoading(total),
    updateProgress: (current: number, total?: number, stage?: string) => 
      loadingManager.updateProgress(current, total, stage),
    incrementProgress: (stage?: string) => loadingManager.incrementProgress(stage),
    completeLoading: () => loadingManager.completeLoading(),
    failLoading: (error?: Error) => loadingManager.failLoading(error)
  };
}

/**
 * Enhanced resource loader with progress tracking
 */
export class ResourceLoader {
  private resources: Map<string, Promise<any>> = new Map();
  private loadedCount = 0;
  private totalCount = 0;

  constructor(private onProgress?: (loaded: number, total: number) => void) {}

  /**
   * Load a resource with progress tracking
   */
  async load<T>(key: string, loader: () => Promise<T>): Promise<T> {
    if (this.resources.has(key)) {
      return this.resources.get(key) as Promise<T>;
    }

    this.totalCount++;
    const promise = loader()
      .then(result => {
        this.loadedCount++;
        loadingManager.trackResource('loaded');
        this.onProgress?.(this.loadedCount, this.totalCount);
        loadingManager.incrementProgress();
        return result;
      })
      .catch(error => {
        this.loadedCount++;
        loadingManager.trackResource('failed');
        this.onProgress?.(this.loadedCount, this.totalCount);
        console.error(`[ResourceLoader] Failed to load ${key}:`, error);
        throw error;
      });

    this.resources.set(key, promise);
    return promise;
  }

  /**
   * Load multiple resources in parallel
   */
  async loadAll<T>(resources: Array<{ key: string; loader: () => Promise<T> }>): Promise<T[]> {
    const promises = resources.map(({ key, loader }) => this.load(key, loader));
    return Promise.all(promises);
  }

  /**
   * Preload resources without waiting
   */
  preload(resources: Array<{ key: string; loader: () => Promise<any> }>): void {
    resources.forEach(({ key, loader }) => {
      this.load(key, loader).catch(() => {
        // Silent fail for preload
      });
    });
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      loaded: this.loadedCount,
      total: this.totalCount,
      percentage: Math.round((this.loadedCount / this.totalCount) * 100) || 0
    };
  }
}

/**
 * Progressive image loader with skeleton support
 */
export function loadImageWithProgress(
  src: string,
  onProgress?: (loaded: boolean) => void
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      loadingManager.trackResource('loaded');
      onProgress?.(true);
      resolve(img);
    };
    
    img.onerror = (error) => {
      loadingManager.trackResource('failed');
      onProgress?.(false);
      reject(error);
    };
    
    img.src = src;
  });
}

/**
 * Check if resource is cached
 */
export async function isResourceCached(url: string): Promise<boolean> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const response = await cache.match(url);
        if (response) {
          loadingManager.trackResource('cached');
          return true;
        }
      }
    } catch (error) {
      console.warn('[ResourceLoader] Cache check failed:', error);
    }
  }
  loadingManager.trackResource('network');
  return false;
}

export default loadingManager;

