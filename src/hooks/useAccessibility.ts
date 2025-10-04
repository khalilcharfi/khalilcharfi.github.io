// useAccessibility.ts - React hooks for accessibility features
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  FocusTrap, 
  announcer, 
  prefersReducedMotion,
  prefersHighContrast,
  setupReducedMotion,
  setupHighContrast
} from '../utils/accessibility';

/**
 * Hook to manage focus trap for modals/dialogs
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isActive) {
      focusTrapRef.current = new FocusTrap(containerRef.current);
      focusTrapRef.current.activate();
    }

    return () => {
      focusTrapRef.current?.deactivate();
      focusTrapRef.current = null;
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook to announce messages to screen readers
 */
export const useAnnouncer = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announcer.announce(message, priority);
  }, []);

  return { announce };
};

/**
 * Hook to detect and respond to reduced motion preference
 */
export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion());

  useEffect(() => {
    return setupReducedMotion(setReducedMotion);
  }, []);

  return reducedMotion;
};

/**
 * Hook to detect high contrast mode
 */
export const useHighContrast = () => {
  const [highContrast, setHighContrast] = useState(prefersHighContrast());

  useEffect(() => {
    return setupHighContrast(setHighContrast);
  }, []);

  return highContrast;
};

/**
 * Hook to manage keyboard navigation in lists/grids
 */
export const useKeyboardNavigation = (
  itemRefs: React.RefObject<(HTMLElement | null)[]>,
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
  } = {}
) => {
  const { loop = true, orientation = 'both' } = options;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!itemRefs.current) return;

    const items = itemRefs.current.filter(item => item !== null);
    const maxIndex = items.length - 1;

    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = loop 
            ? (currentIndex + 1) % items.length 
            : Math.min(currentIndex + 1, maxIndex);
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = loop 
            ? (currentIndex - 1 + items.length) % items.length 
            : Math.max(currentIndex - 1, 0);
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = loop 
            ? (currentIndex + 1) % items.length 
            : Math.min(currentIndex + 1, maxIndex);
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = loop 
            ? (currentIndex - 1 + items.length) % items.length 
            : Math.max(currentIndex - 1, 0);
        }
        break;

      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        newIndex = maxIndex;
        break;

      default:
        return;
    }

    setCurrentIndex(newIndex);
    items[newIndex]?.focus();
  }, [currentIndex, itemRefs, loop, orientation]);

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown,
  };
};

/**
 * Hook to manage aria-live announcements for dynamic content updates
 */
export const useLiveRegion = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  useEffect(() => {
    if (message) {
      announcer.announce(message, priority);
    }
  }, [message, priority]);
};

/**
 * Hook to manage focus when component mounts
 */
export const useAutoFocus = (shouldFocus: boolean = true) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      // Delay to ensure element is rendered
      const timer = setTimeout(() => {
        elementRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldFocus]);

  return elementRef;
};

/**
 * Hook to handle escape key press
 */
export const useEscapeKey = (callback: () => void, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, isActive]);
};

/**
 * Hook to manage scroll lock (for modals)
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
};

/**
 * Hook for accessible form validation announcements
 */
export const useFormAccessibility = () => {
  const { announce } = useAnnouncer();

  const announceError = useCallback((fieldName: string, error: string) => {
    announce(`${fieldName}: ${error}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  return {
    announceError,
    announceSuccess,
  };
};

