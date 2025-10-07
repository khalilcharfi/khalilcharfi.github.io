/**
 * Debug Components - Development Only
 * This file contains all debug components and is completely excluded from production builds
 */

import { PerformanceDrawer } from './PerformanceDrawer';

// Re-export all debug components
export { PerformanceDrawer };

// Type definitions for debug components
export interface DebugComponents {
  PerformanceDrawer: typeof PerformanceDrawer;
}

// Development-only debug utilities
export const debugUtils = {
  isDebugMode: () => import.meta.env.DEV,
  logDebugInfo: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
};
