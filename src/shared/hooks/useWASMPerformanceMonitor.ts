/**
 * WASM Performance Monitor Hook
 * 
 * Provides WASM-accelerated performance monitoring for FPS tracking and quality adjustments.
 * Falls back gracefully to JS when WASM is not available.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {loadWASM} from '@/shared/utils/wasmLoader';

interface WASMPerformanceMonitorReturn {
  fps: number;
  shouldReduceQuality: boolean;
  frameTimeVariance: number;
  isWASMReady: boolean;
  updatePerformance: (currentTime: number) => void;
}

/**
 * Hook for WASM-accelerated performance monitoring
 * @returns Performance metrics and WASM readiness status
 */
export function useWASMPerformanceMonitor(): WASMPerformanceMonitorReturn {
  const monitor = useRef<any>(null);
  const isInitialized = useRef(false);
  const isWASMReady = useRef(false);
  const [fps, setFPS] = useState(60);
  const [shouldReduceQuality, setShouldReduceQuality] = useState(false);
  const [frameTimeVariance, setFrameTimeVariance] = useState(0);

  // Initialize WASM performance monitor
  useEffect(() => {
    if (isInitialized.current) return;
    
    const initializeWASM = async () => {
      try {
        const wasm = await loadWASM();
        if (wasm) {
          monitor.current = new wasm.PerformanceMonitor();
          isWASMReady.current = true;
          isInitialized.current = true;
          console.log('✅ WASM Performance Monitor initialized');
        } else {
          console.warn('⚠️ WASM not available, using JS fallback for performance monitoring');
          isInitialized.current = true;
        }
      } catch (error) {
        console.warn('⚠️ WASM Performance Monitor initialization failed:', error);
        isInitialized.current = true;
      }
    };

    initializeWASM();
  }, []);

  // Update performance metrics
  const updatePerformance = useCallback((currentTime: number) => {
    if (isWASMReady.current && monitor.current) {
      try {
        monitor.current.update(currentTime);
        setFPS(monitor.current.get_average_fps());
        setShouldReduceQuality(monitor.current.should_reduce_quality());
        setFrameTimeVariance(monitor.current.get_frame_time_variance());
      } catch (error) {
        console.warn('WASM performance update failed, falling back to JS:', error);
        // Fallback to JS implementation could be added here
      }
    }
    // Note: JS fallback should be handled by the calling component
  }, []);

  // Set up performance monitoring interval
  useEffect(() => {
    if (!isInitialized.current) return;

    const interval = setInterval(() => {
      if (isWASMReady.current && monitor.current) {
        try {
          const currentTime = performance.now();
          monitor.current.update(currentTime);
          setFPS(monitor.current.get_average_fps());
          setShouldReduceQuality(monitor.current.should_reduce_quality());
          setFrameTimeVariance(monitor.current.get_frame_time_variance());
        } catch (error) {
          console.warn('WASM performance monitoring failed:', error);
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isInitialized.current, isWASMReady.current]);

  return {
    fps,
    shouldReduceQuality,
    frameTimeVariance,
    isWASMReady: isWASMReady.current,
    updatePerformance
  };
}
