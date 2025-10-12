import React, { useState, useEffect, useMemo, useLayoutEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';

// Safely handle React DevTools
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Suppress React DevTools-related console errors
    const originalError = console.error;
    const suppressedPatterns = ['displayName', 'React DevTools', 'getDisplayNameForFiber', 'renderer.js'];
    
    console.error = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && suppressedPatterns.some(pattern => msg.includes(pattern))) {
        return;
      }
      originalError(...args);
    };
    
    // Disable React DevTools hook
    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook) {
      for (const prop of ['inject', 'onCommitFiberRoot', 'onCommitFiberUnmount']) {
        hook[prop] = () => {};
      }
      hook.supportsFiber = false;
    }
  }

import '@/i18n';
import { useTranslation, CertificateItem } from '@/features/i18n';
import { useGeminiConnectionCheck } from '@/features/chatbot/hooks/useGeminiConnection';
import { useChatbotLoader } from '@/features/chatbot/hooks/useChatbotLoader';
import { useReducedMotion, useAnnouncer } from '@/shared/hooks';
import { DynamicContentProvider, ProfileInsights } from '@/features/visitor-personalization';
import { analytics } from '@/features/analytics';
import { 
  PERSONAS_FEATURE_ENABLED, 
  getSectionIds,
  SHOW_VISITOR_CONTROLS,
  SHOW_PROFILE_INSIGHTS,
  SHOW_TRANSLATION_DEBUG,
  SHOW_DEBUG_INFO,
  IS_DEVELOPMENT,
  SHOW_RECOMMENDED_SECTIONS
} from '@/shared/config';
import { AnimationPauseProvider, SimpleConsentProvider, useAnimationPauseControl } from '@/core';
import { Navbar, SkipLinks, SEOHead, EnhancedLoadingScreen } from '@/shared/components';
import { performanceLogger, LazyThreeBackground, loadingManager, useLoadingManager } from '@/shared/utils';
import { LazyTranslationTest } from '@/shared/utils/lazyLoading'; // Direct import to avoid circular dependency
import { ANIMATION_DURATION, SCROLL, OBSERVER_CONFIG } from '@/shared/constants';
import { 
  HomeSection,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  EducationSection,
  ContactSection,
  ScrollToTop,
  Footer
} from '@/features/portfolio';

// Lazy load heavy components with preloading hints
const Chatbot = lazy(() => import('@/features/chatbot/components/Chatbot').then(m => ({ default: m.Chatbot })));
const CertificateModal = lazy(() => import('@/features/portfolio').then(m => ({ default: m.CertificateModal })));
const ProjectsSection = lazy(() => import('@/features/portfolio').then(m => ({ default: m.ProjectsSection })));
const PublicationsSection = lazy(() => import('@/features/portfolio').then(m => ({ default: m.PublicationsSection })));
const CertificatesSection = lazy(() => import('@/features/portfolio').then(m => ({ default: m.CertificatesSection })));

// Lazy load debug components only in development
const PerformanceDrawer = import.meta.env.DEV 
  ? lazy(() => import('@/shared/components/debug/PerformanceDrawer').then(m => ({ default: m.PerformanceDrawer })))
  : () => null;

// Preload critical components after initial render
const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed soon
  import('@/features/portfolio').then(() => {
    // Components are now cached
  });
  
  // Preload chatbot after a delay
  setTimeout(() => {
    import('@/shared/components').then(() => {
      // Chatbot is now cached
    });
  }, 2000);
};


// Helper function to get base language
const getBaseLang = (lang: string) => lang?.split('-')[0] || 'en';

// Toggle to completely disable the initial loading overlay for static builds
const SHOW_LOADING_SCREEN = false;

// Utility to hide the legacy #initial-loading element when we skip the fancy loader
function hideLegacyInitialLoader() {
  const el = document.getElementById('initial-loading');
  if (el) {
    el.style.display = 'none';
  }
}

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { state: loadingState, progress: loadingProgress } = SHOW_LOADING_SCREEN
        ? useLoadingManager()
        : { state: 'success', progress: { percentage: 100, stage: 'Complete' } as any };
    
    console.log('[App Render] Rendering with state:', {
        loadingState,
        progress: loadingProgress.percentage,
        stage: loadingProgress.stage
    });
    
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
    const [showBackground] = useState(true);
    const reducedMotion = useReducedMotion();
    const { setPaused } = useAnimationPauseControl();
    
    // Lazy load chatbot on user interaction
    const { isLoaded: isChatbotLoaded, isLoading: isChatbotLoading, error: chatbotError } = useChatbotLoader();

    // Make sure the legacy loader is removed on first paint when disabled
    useEffect(() => {
        if (!SHOW_LOADING_SCREEN) {
            hideLegacyInitialLoader();
        }
    }, []);
    const { announce } = useAnnouncer();
    const [activeSection, setActiveSection] = useState('home');
    const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
    const { 
        isAvailable: isChatbotAvailable, 
        isChecking: isChatbotChecking,
        connectionStatus,
        errorMessage,
        retryCount,
        retryConnection
    } = useGeminiConnectionCheck();
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [personalizedContent, setPersonalizedContent] = useState<Record<string, unknown> | null>(null);
    const [showVisitorSelector, setShowVisitorSelector] = useState(false);
    const [VisitorTypeSelector, setVisitorTypeSelector] = useState<React.ComponentType<{ onVisitorTypeChange: (type: string) => void; className?: string }> | null>(null);

    // Performance optimization: Initialize on mount
    useEffect(() => {
        console.log('[App Init] Starting initialization...', {
            isDev: import.meta.env.DEV,
            isProd: import.meta.env.PROD,
            mode: import.meta.env.MODE,
            nodeEnv: process.env.NODE_ENV
        });
        
        if (SHOW_LOADING_SCREEN) {
            // Start loading manager
            loadingManager.startLoading(10);
            console.log('[Loading] Started with 10 steps');
            loadingManager.updateProgress(1, 10, 'Initializing application');
            console.log('[Loading] Progress: 1/10 - Initializing application');
        }
        
        // Disable scroll on page load and keep at top
        if (SHOW_LOADING_SCREEN) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        }
        
        // Prevent any scroll attempts during initial load
        const preventScroll = (e: Event) => {
            e.preventDefault();
            window.scrollTo(0, 0);
        };
        
        // Add scroll prevention listeners
        if (SHOW_LOADING_SCREEN) {
            window.addEventListener('scroll', preventScroll, { passive: false });
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
        }
        
        if (SHOW_LOADING_SCREEN) {
            loadingManager.incrementProgress('Setting up UI');
            console.log('[Loading] Progress: 2/10 - Setting up UI');
        }

        // Add keyboard navigation class for focus styles
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        };

        const handleMouseDown = () => {
            document.body.classList.remove('keyboard-nav');
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        console.log('[App Init] Event listeners attached');
        
        // Apply reduced motion class if user prefers
        if (reducedMotion) {
            document.body.classList.add('reduce-motion');
            console.log('[App Init] Reduced motion enabled');
        }
        
        // Initialize performance optimizations
        if (typeof window !== 'undefined') {
            console.log('[App Init] Loading performance optimizations...');
            import('@/shared/utils').then(module => {
                if (SHOW_LOADING_SCREEN) {
                    loadingManager.incrementProgress('Loading performance optimizations');
                    console.log('[Loading] Progress: 3/10 - Loading performance optimizations');
                }
                module.initializePerformanceOptimizations().catch((error) => {
                    console.error('[App Init] Performance optimization failed:', error);
                    performanceLogger.error('Failed to initialize performance optimizations:', error);
                    loadingManager.trackResource('failed');
                });
            }).catch(err => {
                console.error('[App Init] Failed to import utils:', err);
            });
        }
        
        if (SHOW_LOADING_SCREEN) {
            loadingManager.incrementProgress('Loading React components');
            console.log('[Loading] Progress: 4/10 - Loading React components');
        }
        
        // Complete loading after a short delay (components are ready)
        let completeTimer: any;
        if (SHOW_LOADING_SCREEN) {
            completeTimer = setTimeout(() => {
                console.log('[Loading] Timer fired - completing loading...');
                loadingManager.incrementProgress('Finalizing');
                console.log('[Loading] Progress: 5/10 - Finalizing');
                loadingManager.completeLoading();
                console.log('[Loading] ✅ Loading complete! State should be "success"');
                
                // Re-enable scrolling after loading completes
                document.body.style.overflow = '';
                
                // Remove scroll prevention listeners
                window.removeEventListener('scroll', preventScroll);
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
                console.log('[App Init] Scrolling re-enabled');
            }, 500);
        } else {
            // When loading screen is disabled, ensure scrolling is enabled immediately
            document.body.style.overflow = '';
            console.log('[App Init] Scrolling enabled immediately (no loading screen)');
        }
        
        console.log('[App Init] Complete timer set for 500ms');
        
        // Report performance metrics after full load
        window.addEventListener('load', () => {
            console.log('[App Init] Window load event fired');
            setTimeout(() => {
                import('@/shared/utils').then(module => {
                    console.log('[App Init] Reporting performance metrics');
                    module.reportPerformanceMetrics();
                });
            }, ANIMATION_DURATION.PERF_REPORT_DELAY);
            
            // Preload critical components after initial load
            preloadCriticalComponents();
        });

        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const scrolled = window.scrollY > SCROLL.NAVBAR_THRESHOLD;
                navbar.classList.toggle('scrolled', scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        console.log('[App Init] Setup complete, returning cleanup function');
        
        return () => {
            if (completeTimer) clearTimeout(completeTimer);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
            if (SHOW_LOADING_SCREEN) {
                window.removeEventListener('scroll', preventScroll);
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
            }
            console.log('[App Init] Cleanup complete');
        };
    }, [reducedMotion]);

    useLayoutEffect(() => {
        // Only disable scroll during loading screen, not for theme changes
        if (SHOW_LOADING_SCREEN) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        }
        
        // Apply theme immediately before any paint
        const root = document.documentElement;
        const body = document.body;
        
        // Set color-scheme for native browser controls
        root.style.colorScheme = theme;
        
        // Update theme attribute
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Add transitioning class for smooth animation
        if (isThemeTransitioning) {
            // Use requestAnimationFrame to avoid forced reflow
            requestAnimationFrame(() => {
                body.classList.add('theme-transitioning');
                
                const timeout = setTimeout(() => {
                    body.classList.remove('theme-transitioning');
                    setIsThemeTransitioning(false);
                }, ANIMATION_DURATION.THEME_TRANSITION); // Match CSS transition duration
                
                return () => clearTimeout(timeout);
            });
        }
    }, [theme, isThemeTransitioning]);

    useEffect(() => {
        const lang = getBaseLang(i18n.language);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', ['ar'].includes(lang) ? 'rtl' : 'ltr');
    }, [i18n.language]);

    const toggleTheme = () => {
        // Prevent multiple rapid toggles
        if (isThemeTransitioning) return;
        
        setIsThemeTransitioning(true);
        
        // Pause particle animations immediately for smooth transition
        setPaused(true);
        
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        // Use View Transition API for smooth theme switching (with fallback)
        const updateTheme = () => {
            // Small delay to let the overlay appear
            setTimeout(() => {
                setTheme(newTheme);
                
                // Announce theme change to screen readers
                const message = String(newTheme === 'light' 
                    ? t('theme.changedToLight') 
                    : t('theme.changedToDark'));
                announce(message, 'polite');
            }, 50); // 50ms delay for smooth overlay appearance
        };

        // Check if View Transition API is supported
        if ('startViewTransition' in document && !reducedMotion) {
            // Use native browser View Transition API for ultra-smooth transitions
            (document as any).startViewTransition(() => {
                updateTheme();
            });
        } else {
            // Fallback for browsers without View Transition API
            requestAnimationFrame(() => {
                updateTheme();
            });
        }
        
        // Resume particles after transition completes with smooth fade-in
        setTimeout(() => {
            setPaused(false);
        }, 400); // Resume after transition
    };

    useEffect(() => {
        if (PERSONAS_FEATURE_ENABLED && SHOW_VISITOR_CONTROLS && !VisitorTypeSelector) {
            import('@/features/visitor-personalization').then((module) => {
                    setVisitorTypeSelector(() => module.VisitorTypeSelector as React.ComponentType<{ onVisitorTypeChange: (type: string) => void; className?: string }>);
            });
        }
    }, [VisitorTypeSelector]);
    
    // Memoize enabled sections to avoid recalculating on every render
    const enabledSections = useMemo(() => getSectionIds(), []);

    // Create a section component map for cleaner rendering
    const sectionComponents = useMemo(() => ({
        'home': <HomeSection key="home" />,
        'about': <AboutSection key="about" />,
        'skills': <SkillsSection key="skills" />,
        'projects': (
            <Suspense key="projects" fallback={<div className="section-loading">{String(t('general.loading'))}</div>}>
                <ProjectsSection />
            </Suspense>
        ),
        'experience': <ExperienceSection key="experience" />,
        'education': <EducationSection key="education" />,
        'publications': (
            <Suspense key="publications" fallback={<div className="section-loading">{String(t('general.loading'))}</div>}>
                <PublicationsSection />
            </Suspense>
        ),
        'certificates': (
            <Suspense key="certificates" fallback={<div className="section-loading">{String(t('general.loading'))}</div>}>
                <CertificatesSection onCertClick={setSelectedCert} />
            </Suspense>
        ),
        'contact': <ContactSection key="contact" />
    }), [setSelectedCert, t]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: OBSERVER_CONFIG.SECTION_ROOT_MARGIN, threshold: OBSERVER_CONFIG.SECTION_THRESHOLD }
        );
        
        // Only observe sections that are actually rendered
        const sections = document.querySelectorAll('section');
        const sectionsArray = Array.from(sections).filter(
            section => enabledSections.includes(section.id)
        );
        
        sectionsArray.forEach(section => observer.observe(section));
        return () => sectionsArray.forEach(section => observer.unobserve(section));
    }, [enabledSections]);

    const [isScrollToTopVisible, setScrollToTopVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => {
            setScrollToTopVisible(window.scrollY > SCROLL.SHOW_TOP_BUTTON);
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        const profile = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getProfile() : null;
        const content = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getPersonalizedContent(t) : null;
        
        if (profile && profile.visitorType !== 'general_visitor') {
            setIsPersonalized(true);
        }
        
        setPersonalizedContent(content);

        if (SHOW_RECOMMENDED_SECTIONS && analytics) {
            analytics.trackEvent('portfolio_visited', {
                language: getBaseLang(i18n.language),
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            });
        }
    }, [i18n.language, t]);

    const handleVisitorTypeChange = (newType: string) => {
        const content = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getPersonalizedContent(t) : null;
        setPersonalizedContent(content);
        setIsPersonalized(newType !== 'general_visitor');
        
        if (SHOW_RECOMMENDED_SECTIONS && analytics) {
            analytics.trackEvent('personalized_content_updated', {
                newVisitorType: newType,
                language: getBaseLang(i18n.language)
            });
        }
    };

    return (
        <>
            {SHOW_LOADING_SCREEN && loadingState === 'loading' && (
                <EnhancedLoadingScreen 
                    progress={loadingProgress.percentage} 
                    stage={loadingProgress.stage} 
                />
            )}
            
            <Suspense fallback={<div className="suspense-fallback">{String(t('general.loading'))}</div>}>
                {/* SEO Meta Tags - Multilingual Support */}
                <SEOHead currentSection={activeSection} />
                
                {/* Skip Links for Keyboard Navigation */}
                <SkipLinks />
                
                {/* Visitor Type Selector - Optional */}
                {PERSONAS_FEATURE_ENABLED && SHOW_VISITOR_CONTROLS && (
                  <div className="visitor-controls">
                      <button 
                          onClick={() => setShowVisitorSelector(!showVisitorSelector)}
                          className="visitor-toggle"
                          aria-label="Customize experience for your visitor type"
                      >
                          🎯 Personalize
                      </button>
                      
                      {showVisitorSelector && VisitorTypeSelector && (
                          <div className="visitor-selector-container">
                              <VisitorTypeSelector 
                                  onVisitorTypeChange={handleVisitorTypeChange}
                                  className="visitor-selector"
                              />
                          </div>
                      )}
                  </div>
                )}

                {/* Three.js Background - Deferred loading after critical content */}
                {showBackground && (
                    <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: theme === 'light' ? '#f1f5f9' : '#0a0a0a' }} />}>
                        <LazyThreeBackground theme={theme} />
                    </Suspense>
                )}
                <Navbar activeSection={activeSection} setActiveSectionDirectly={setActiveSection} theme={theme} toggleTheme={toggleTheme} />
                <main id="main-content" role="main" aria-label={String(t('general.skipToMain'))}>
                    {enabledSections.map((id: string) => sectionComponents[id as keyof typeof sectionComponents]).filter(Boolean)}
                    {SHOW_PROFILE_INSIGHTS && <ProfileInsights chatbotOpen={isChatbotAvailable && !isChatbotChecking} scrollToTopVisible={isScrollToTopVisible} />}
                </main>
                
                {/* Translation Debug Component - Only in development */}
                {IS_DEVELOPMENT && SHOW_TRANSLATION_DEBUG && (
                    <Suspense fallback={null}>
                        <LazyTranslationTest showDebugInfo={true} />
                    </Suspense>
                )}
                <Footer />
                <ScrollToTop chatbotVisible={isChatbotAvailable && !isChatbotChecking} isVisible={isScrollToTopVisible} />
                {/* Chatbot - Lazy loaded on user interaction */}
                {isChatbotAvailable && !isChatbotChecking && isChatbotLoaded && (
                    <Suspense fallback={null}>
                        <Chatbot />
                    </Suspense>
                )}
                {isChatbotLoading && (
                    <div style={{ 
                        position: 'fixed', 
                        bottom: '20px', 
                        right: '20px', 
                        background: 'rgba(0,0,0,0.8)', 
                        color: 'white', 
                        padding: '10px', 
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 1000
                    }}>
                        Loading AI assistant...
                    </div>
                )}
                
                <Suspense fallback={null}>
                    <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
                </Suspense>
                
                {/* Performance Drawer - Only in development */}
                {import.meta.env.DEV && (
                    <Suspense fallback={null}>
                        <PerformanceDrawer 
                            geminiStatus={{
                                connectionStatus,
                                errorMessage,
                                retryCount,
                                retryConnection
                            }}
                        />
                    </Suspense>
                )}
                
                {PERSONAS_FEATURE_ENABLED && isPersonalized && (
                  <div className="personalization-indicator">
                    <span>🎯 Personalized for you</span>
                  </div>
                )}

                {/* Debug Info */}
                {PERSONAS_FEATURE_ENABLED && IS_DEVELOPMENT && SHOW_DEBUG_INFO && personalizedContent && (
                    <div className="debug-info">
                        <details>
                            <summary>Visitor Profile Debug</summary>
                            <pre>{JSON.stringify((SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getProfile() : {}) || {}, null, 2)}</pre>
                        </details>
                    </div>
                )}

                <style>{`
                    .visitor-controls {
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        z-index: 1000;
                    }

                    .visitor-toggle {
                        background: var(--accent-color, #007bff);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
                    }

                    .visitor-toggle:hover {
                        background: var(--accent-color-dark, #0056b3);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
                    }

                    .visitor-selector-container {
                        position: absolute;
                        top: 100%;
                        right: 0;
                        margin-top: 8px;
                        min-width: 300px;
                    }

                    .personalization-indicator {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: var(--success-color, #28a745);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 500;
                        z-index: 1000;
                        animation: slideInRight 0.5s ease-out;
                    }

                    .debug-info {
                        position: fixed;
                        bottom: 20px;
                        left: 20px;
                        background: var(--bg-primary, #fff);
                        border: 1px solid var(--border-color, #ddd);
                        border-radius: 8px;
                        padding: 12px;
                        max-width: 300px;
                        font-size: 10px;
                        z-index: 1000;
                    }

                    .debug-info details {
                        cursor: pointer;
                    }

                    .debug-info pre {
                        margin-top: 8px;
                        padding: 8px;
                        background: var(--bg-secondary, #f8f9fa);
                        border-radius: 4px;
                        overflow: auto;
                        max-height: 200px;
                    }

                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    @media (max-width: 768px) {
                        .visitor-controls {
                            top: 100px;
                            right: 10px;
                        }
                        
                        .visitor-selector-container {
                            min-width: 280px;
                            right: -20px;
                        }
                        
                        .personalization-indicator {
                            bottom: 10px;
                            right: 10px;
                            font-size: 10px;
                            padding: 6px 12px;
                        }
                    }
                `}</style>
                
            </Suspense>
        </>
    );
};

// Initialize app - force execution with IIFE and side effects
(() => {
  // This IIFE must execute immediately to hydrate the React app
  // It's marked with side effects to prevent tree-shaking
  
  // Force a side effect by modifying the DOM
  const scriptTag = document.currentScript || document.querySelector('script[type="module"]');
  if (scriptTag) {
    scriptTag.setAttribute('data-init', 'true');
  }
  
  function initApp() {
    const container = document.getElementById('root');
    if (!container) {
      console.error('[Init] Root element not found');
      return;
    }
    
    const root = createRoot(container);
    root.render(
      <SimpleConsentProvider>
        <AnimationPauseProvider>
          <DynamicContentProvider>
            <App />
          </DynamicContentProvider>
        </AnimationPauseProvider>
      </SimpleConsentProvider>
    );
  }

  // Check if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp, { once: true });
  } else {
    // DOM is already ready, init immediately
    initApp();
  }
})();