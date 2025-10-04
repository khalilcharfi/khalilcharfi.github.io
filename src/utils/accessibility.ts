/**
 * Manages focus trap for modals and dialogs
 */
export class FocusTrap {
  private focusableElements: HTMLElement[] = [];
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private previousFocus: HTMLElement | null = null;

  constructor(private container: HTMLElement) {
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(',');

    this.focusableElements = Array.from(
      this.container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    this.firstFocusable = this.focusableElements[0] || null;
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  activate() {
    this.previousFocus = document.activeElement as HTMLElement;
    this.updateFocusableElements();
    this.firstFocusable?.focus();

    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.previousFocus?.focus();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  };
}

/**
 * Screen Reader Announcer for dynamic content
 */
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement;

  constructor() {
    this.liveRegion = this.createLiveRegion();
  }

  private createLiveRegion(): HTMLElement {
    const existing = document.getElementById('a11y-live-region');
    if (existing) return existing;

    const region = document.createElement('div');
    region.id = 'a11y-live-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(region);
    return region;
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    this.liveRegion.setAttribute('aria-live', priority);
    
    // Clear and set new message with slight delay for screen readers
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);

    // Clear after announcement
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 3000);
  }
}

/**
 * Keyboard Navigation Helper
 */
export class KeyboardNavigationHelper {
  private elements: HTMLElement[] = [];
  private currentIndex = 0;

  constructor(containerSelector: string, elementSelector: string) {
    this.updateElements(containerSelector, elementSelector);
  }

  updateElements(containerSelector: string, elementSelector: string) {
    const container = document.querySelector(containerSelector);
    if (container) {
      this.elements = Array.from(container.querySelectorAll<HTMLElement>(elementSelector));
    }
  }

  handleKeyDown(e: KeyboardEvent, onActivate?: (element: HTMLElement) => void) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.currentIndex = (this.currentIndex + 1) % this.elements.length;
        this.elements[this.currentIndex]?.focus();
        break;
      
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
        this.elements[this.currentIndex]?.focus();
        break;
      
      case 'Home':
        e.preventDefault();
        this.currentIndex = 0;
        this.elements[0]?.focus();
        break;
      
      case 'End':
        e.preventDefault();
        this.currentIndex = this.elements.length - 1;
        this.elements[this.currentIndex]?.focus();
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        const activeElement = this.elements[this.currentIndex];
        if (activeElement && onActivate) {
          onActivate(activeElement);
        }
        break;
    }
  }

  setIndex(index: number) {
    this.currentIndex = Math.max(0, Math.min(index, this.elements.length - 1));
  }
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user prefers high contrast
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Get color contrast ratio
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(val => {
      const channel = parseInt(val) / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Validate WCAG contrast requirements
 */
export const meetsWCAGContrast = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const minRatio = level === 'AAA' ? (largeText ? 4.5 : 7) : (largeText ? 3 : 4.5);
  return ratio >= minRatio;
};

/**
 * Create unique ID for ARIA relationships
 */
let idCounter = 0;
export const generateAriaId = (prefix: string = 'aria'): string => {
  return `${prefix}-${Date.now()}-${idCounter++}`;
};

/**
 * Manage aria-describedby relationships
 */
export const setAriaDescribedBy = (element: HTMLElement, descriptionId: string) => {
  const current = element.getAttribute('aria-describedby');
  const ids = current ? current.split(' ') : [];
  
  if (!ids.includes(descriptionId)) {
    ids.push(descriptionId);
    element.setAttribute('aria-describedby', ids.join(' '));
  }
};

/**
 * Remove aria-describedby relationship
 */
export const removeAriaDescribedBy = (element: HTMLElement, descriptionId: string) => {
  const current = element.getAttribute('aria-describedby');
  if (!current) return;
  
  const ids = current.split(' ').filter(id => id !== descriptionId);
  if (ids.length > 0) {
    element.setAttribute('aria-describedby', ids.join(' '));
  } else {
    element.removeAttribute('aria-describedby');
  }
};

/**
 * Check if element is visible and not hidden
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  ) && window.getComputedStyle(element).visibility !== 'hidden';
};

/**
 * Focus management utility
 */
export const manageFocus = {
  /**
   * Store current focus
   */
  store(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  },

  /**
   * Restore focus to element
   */
  restore(element: HTMLElement | null) {
    if (element && isElementVisible(element)) {
      element.focus();
    }
  },

  /**
   * Move focus to first error in form
   */
  moveToFirstError(formElement: HTMLElement) {
    const firstError = formElement.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

/**
 * Global announcer instance
 */
export const announcer = new ScreenReaderAnnouncer();

/**
 * Hook helper to announce route changes
 */
export const announceRouteChange = (routeName: string) => {
  announcer.announce(`Navigated to ${routeName}`, 'polite');
};

/**
 * Add skip link functionality
 */
export const initializeSkipLinks = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        if (target) {
          const targetElement = document.querySelector(target) as HTMLElement;
          if (targetElement) {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            targetElement.addEventListener('blur', () => {
              targetElement.removeAttribute('tabindex');
            }, { once: true });
          }
        }
      });
    });
  });
};

/**
 * Reduced motion media query hook
 */
export const setupReducedMotion = (callback: (prefersReduced: boolean) => void) => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  callback(mediaQuery.matches);
  
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener('change', handler);
  
  return () => mediaQuery.removeEventListener('change', handler);
};

/**
 * High contrast mode detection
 */
export const setupHighContrast = (callback: (highContrast: boolean) => void) => {
  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  
  callback(mediaQuery.matches);
  
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener('change', handler);
  
  return () => mediaQuery.removeEventListener('change', handler);
};

