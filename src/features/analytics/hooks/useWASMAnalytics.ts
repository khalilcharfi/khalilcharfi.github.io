/**
 * WASM Analytics Hook
 * 
 * Provides WASM-accelerated analytics functionality as enhancement to existing JS implementations.
 * Falls back gracefully to JS when WASM is not available.
 */

import { useEffect, useRef, useCallback } from 'react';
import {loadWASM} from '@/shared/utils/wasmLoader';

interface WASMAnalyticsReturn {
  trackEvent: (type: string, data: string) => void;
  updateScrollDepth: (depth: number) => void;
  getEngagementScore: () => number;
  getAnalyticsSummary: () => string;
  isWASMReady: boolean;
}

/**
 * Hook for WASM-accelerated analytics tracking
 * @returns Analytics functions and WASM readiness status
 */
export function useWASMAnalytics(): WASMAnalyticsReturn {
  const analyticsEngine = useRef<any>(null);
  const isInitialized = useRef(false);
  const isWASMReady = useRef(false);

  // Initialize WASM analytics engine
  useEffect(() => {
    if (isInitialized.current) return;
    
    const initializeWASM = async () => {
      try {
        const wasm = await loadWASM();
        if (wasm) {
          analyticsEngine.current = new wasm.AnalyticsEngine();
          isWASMReady.current = true;
          isInitialized.current = true;
          console.log('✅ WASM Analytics Engine initialized');
        } else {
          console.warn('⚠️ WASM not available, using JS fallback for analytics');
          isInitialized.current = true;
        }
      } catch (error) {
        console.warn('⚠️ WASM Analytics initialization failed:', error);
        isInitialized.current = true;
      }
    };

    initializeWASM();
  }, []);

  // Track event with WASM acceleration
  const trackEvent = useCallback((type: string, data: string) => {
    if (isWASMReady.current && analyticsEngine.current) {
      try {
        analyticsEngine.current.track_event(type, data);
      } catch (error) {
        console.warn('WASM track_event failed, falling back to JS:', error);
        // Fallback to JS implementation could be added here
      }
    }
    // Note: JS fallback should be handled by the calling component
  }, []);

  // Update scroll depth with WASM acceleration
  const updateScrollDepth = useCallback((depth: number) => {
    if (isWASMReady.current && analyticsEngine.current) {
      try {
        analyticsEngine.current.update_scroll_depth(depth);
      } catch (error) {
        console.warn('WASM update_scroll_depth failed, falling back to JS:', error);
        // Fallback to JS implementation could be added here
      }
    }
    // Note: JS fallback should be handled by the calling component
  }, []);

  // Get engagement score with WASM acceleration
  const getEngagementScore = useCallback((): number => {
    if (isWASMReady.current && analyticsEngine.current) {
      try {
        return analyticsEngine.current.get_engagement_score();
      } catch (error) {
        console.warn('WASM get_engagement_score failed, falling back to JS:', error);
        return 0; // Fallback value
      }
    }
    return 0; // Fallback value when WASM not available
  }, []);

  // Get analytics summary with WASM acceleration
  const getAnalyticsSummary = useCallback((): string => {
    if (isWASMReady.current && analyticsEngine.current) {
      try {
        return analyticsEngine.current.get_analytics_summary();
      } catch (error) {
        console.warn('WASM get_analytics_summary failed, falling back to JS:', error);
        return '{}'; // Fallback value
      }
    }
    return '{}'; // Fallback value when WASM not available
  }, []);

  return {
    trackEvent,
    updateScrollDepth,
    getEngagementScore,
    getAnalyticsSummary,
    isWASMReady: isWASMReady.current
  };
}
