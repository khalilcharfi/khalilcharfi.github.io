// Performance Layer - Centralized exports
export * from './CriticalPathManager';
export * from './ImageOptimizer';
export * from './PerformanceBudget';

// Create singleton instances for easy access
import { CriticalPathManager } from './CriticalPathManager';
import { ImageOptimizer } from './ImageOptimizer';
import { PerformanceMonitor } from './PerformanceBudget';

export const criticalPathManager = CriticalPathManager.getInstance();
export const imageOptimizer = ImageOptimizer.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
