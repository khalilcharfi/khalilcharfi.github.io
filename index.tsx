import React, { useState, useEffect, useMemo, useLayoutEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';

import '@/i18n';
import { useTranslation, CertificateItem } from '@/features/i18n';
import { useGeminiConnectionCheck } from '@/features/chatbot';
import { useReducedMotion, useAnnouncer } from '@/shared/hooks';
import { 
  DynamicContentProvider, 
  ProfileInsights, 
  SHOW_VISITOR_CONTROLS, 
  SHOW_PROFILE_INSIGHTS, 
  SHOW_TRANSLATION_DEBUG, 
  SHOW_DEBUG_INFO, 
  IS_DEVELOPMENT, 
  SHOW_RECOMMENDED_SECTIONS 
} from '@/features/visitor-personalization';
import { analytics } from '@/features/analytics';
import { PERSONAS_FEATURE_ENABLED, getSectionIds } from '@/shared/config';
import { AnimationPauseProvider, SimpleConsentProvider } from '@/context';
import { Navbar, SkipLinks, SEOHead, PerformanceDrawer } from '@/shared/components';
import { performanceLogger, LazyTranslationTest, LazyThreeBackground } from '@/shared/utils';
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

// Lazy load heavy components
const Chatbot = lazy(() => import('@/shared/components').then(m => ({ default: m.Chatbot })));
const CertificateModal = lazy(() => import('@/features/portfolio').then(m => ({ default: m.CertificateModal })));
const ProjectsSection = lazy(() => import('@/features/portfolio').then(m => ({ default: m.ProjectsSection })));
const PublicationsSection = lazy(() => import('@/features/portfolio').then(m => ({ default: m.PublicationsSection })));
const CertificatesSection = lazy(() => import('@/features/portfolio').then(m => ({ default: m.CertificatesSection })));

// Helper function to get base language
const getBaseLang = (lang: string) => lang?.split('-')[0] || 'en';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
    const reducedMotion = useReducedMotion();
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
        
        const loadingScreen = document.getElementById('initial-loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 300);
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
        
        // Apply reduced motion class if user prefers
        if (reducedMotion) {
            document.body.classList.add('reduce-motion');
        }
        
        // Initialize performance optimizations
        if (typeof window !== 'undefined') {
            import('@/shared/utils').then(module => {
                module.initializePerformanceOptimizations().catch((error) => {
                    performanceLogger.error('Failed to initialize performance optimizations:', error);
                });
            });
        }
        
        // Report performance metrics after load
        window.addEventListener('load', () => {
            setTimeout(() => {
                import('@/shared/utils').then(module => {
                    module.reportPerformanceMetrics();
                });
            }, ANIMATION_DURATION.PERF_REPORT_DELAY);
        });

        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const scrolled = window.scrollY > SCROLL.NAVBAR_THRESHOLD;
                navbar.classList.toggle('scrolled', scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [reducedMotion]);

    useLayoutEffect(() => {
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
            // Force a reflow to ensure the class is applied
            body.offsetHeight;
            body.classList.add('theme-transitioning');
            
            const timeout = setTimeout(() => {
                body.classList.remove('theme-transitioning');
                setIsThemeTransitioning(false);
            }, ANIMATION_DURATION.THEME_TRANSITION); // Match CSS transition duration
            
            return () => clearTimeout(timeout);
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
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        // Use RAF to ensure smooth transition
        requestAnimationFrame(() => {
            setTheme(newTheme);
            
            // Announce theme change to screen readers
            const message = String(newTheme === 'light' 
                ? t('theme.changedToLight') 
                : t('theme.changedToDark'));
            announce(message, 'polite');
        });
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
        <Suspense fallback={<div>{String(t('general.loading'))}</div>}>
            <>
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

                <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: theme === 'light' ? '#f1f5f9' : '#0a0a0a' }} />}>
                    <LazyThreeBackground theme={theme} />
                </Suspense>
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
                {isChatbotAvailable && !isChatbotChecking && (
                    <Suspense fallback={null}>
                        <Chatbot />
                    </Suspense>
                )}
                
                <Suspense fallback={null}>
                    <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
                </Suspense>
                
                {/* Performance Drawer - Only in development */}
                {IS_DEVELOPMENT && (
                    <PerformanceDrawer 
                        geminiStatus={{
                            connectionStatus,
                            errorMessage,
                            retryCount,
                            retryConnection
                        }}
                    />
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
            </>
        </Suspense>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(
    <SimpleConsentProvider>
        <AnimationPauseProvider>
            <DynamicContentProvider>
                <App />
            </DynamicContentProvider>
        </AnimationPauseProvider>
    </SimpleConsentProvider>
 );