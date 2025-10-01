import React, { useState, useEffect, useRef, Suspense, useMemo, useLayoutEffect, Component, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from './src/hooks/useTranslation';
import { marked } from 'marked';
import { CertificateItem, translations } from './translations';
// TranslationTest will be dynamically imported when needed
import { GoogleGenAI, Chat } from '@google/genai';
import { Canvas, useFrame, useThree, extend, type ThreeElements } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import './i18n'; // Initializes i18next
import { useDynamicContent, ProfileInsights, useSectionTracking, SHOW_VISITOR_CONTROLS, SHOW_PROFILE_INSIGHTS, SHOW_TRANSLATION_DEBUG, SHOW_DEBUG_INFO, ENABLE_CHATBOT, IS_DEVELOPMENT } from './dynamicContent';
import { analytics } from './userAnalytics';
// VisitorTypeSelector will be dynamically imported when needed
import { PERSONAS_FEATURE_ENABLED } from './personaSettings';

// Extend Three.js objects for React Three Fiber
extend({ Points: THREE.Points, BufferGeometry: THREE.BufferGeometry, BufferAttribute: THREE.BufferAttribute });

// Animation pause context to pause heavy animations when tab not active
export const AnimationPauseContext = createContext<boolean>(false);
export const useAnimationPause = () => useContext(AnimationPauseContext);

// Provider component to track page visibility and focus
const AnimationPauseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      setPaused(document.hidden || document.visibilityState !== 'visible');
    };
    const handleBlur = () => setPaused(true);
    const handleFocus = () => setPaused(document.hidden || document.visibilityState !== 'visible');

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    handleVisibility();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <AnimationPauseContext.Provider value={paused}>
      {children}
    </AnimationPauseContext.Provider>
  );
};

// This is a workaround for environments where TypeScript might not automatically
// pick up the type augmentations for @react-three/fiber. By explicitly
// declaring these elements in the JSX namespace, we solve the type errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: ThreeElements['points'];
      bufferGeometry: ThreeElements['bufferGeometry'];
      bufferAttribute: ThreeElements['bufferAttribute'];
      color: ThreeElements['color'];
      ambientLight: ThreeElements['ambientLight'];
      pointsMaterial: ThreeElements['pointsMaterial'];
    }
  }
}

// WebGL-specific error boundary for backward compatibility
interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL Error caught by ErrorBoundary:', error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Helper for smooth scroll
const smoothScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, onClick }) => (
    <li>
        <a
            href={`#${href}`}
            className={isActive ? 'active' : ''}
            onClick={(e) => {
                e.preventDefault();
                onClick();
                smoothScrollTo(href);
            }}
            aria-current={isActive ? 'page' : undefined}
        >
            {label}
        </a>
    </li>
);

interface SectionProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ id, children, className }) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section id={id} ref={sectionRef} className={className}>
            <div className="container">
                {children}
            </div>
        </section>
    );
};

// SVG Icons
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.836 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM5.106 17.894a.75.75 0 001.061 1.06l1.591-1.59a.75.75 0 00-1.06-1.061l-1.591 1.59zM3 12a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h2.25A.75.75 0 013 12zM6.106 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-3.51 1.713-6.638 4.383-8.528a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 6c-.28 0-.53.11-.71.29l-6 6a1 1 0 101.42 1.42L12 8.41l5.29 5.3a1 1 0 001.42-1.42l-6-6A1 1 0 0012 6z" />
    </svg>
);


const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A6.75 6.75 0 0115.75 12c0 2.593-1.47 4.88-3.642 6.002a.75.75 0 00.723 1.348A8.25 8.25 0 0017.25 12c0-3.41-2.078-6.388-5.037-7.662a.75.75 0 00-.25-.052zM4.75 12A8.25 8.25 0 0112 3.75a.75.75 0 010 1.5A6.75 6.75 0 005.25 12a6.75 6.75 0 006.75 6.75.75.75 0 010 1.5A8.25 8.25 0 014.75 12z" clipRule="evenodd" />
    </svg>
);

const GithubIcon: React.FC = React.memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
));
GithubIcon.displayName = 'GithubIcon';

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.75 8.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z"></path>
        <path fillRule="evenodd" d="M3.501 4.5A2.999 2.999 0 016.5 1.5h11A2.999 2.999 0 0120.5 4.5v11a3 3 0 01-3 3h-11a3 3 0 01-3-3v-11zm1.5 0a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5-1.5h-11a1.5 1.5 0 01-1.5-1.5v-11z" clipRule="evenodd"></path>
    </svg>
);

const LinkedinIcon: React.FC = React.memo(() => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
));
LinkedinIcon.displayName = 'LinkedinIcon';

const MailIcon: React.FC = React.memo(() => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.068 6.787h-17.779l5.057-6.782zm.225-1.352l-5.648-4.616v9.319l5.648-4.703z"></path>
    </svg>
));
MailIcon.displayName = 'MailIcon';

const AiChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M11.25 3.375c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125h-.375a1.125 1.125 0 01-1.125-1.125V3.375z" />
      <path d="M9.375 5.25c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125h-.375A1.125 1.125 0 019.375 5.625V5.25z" />
      <path d="M6 5.625c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125H7.125A1.125 1.125 0 016 5.625V5.625z" />
      <path d="M15.375 5.25c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125h-.375a1.125 1.125 0 01-1.125-1.125V5.25z" />
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.125-3.625a.75.75 0 00-1.5 0v2.69l-1.656-.83a.75.75 0 00-.658 1.338l2.5 1.25a.75.75 0 00.658 0l2.5-1.25a.75.75 0 00-.658-1.338l-1.656.83V8.375z" clipRule="evenodd" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


interface ThemeToggleProps {
    theme: string;
    toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
    const { t } = useTranslation();
    const label = theme === 'light' ? t('theme.toggleDark') : t('theme.toggleLight');
    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

// Language Switcher Component
const flagEmojis: { [key: string]: string } = {
    en: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    ar: '🇸🇦',
};

const getBaseLang = (lang: string) => lang?.split('-')[0] || 'en';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const selectLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsOpen(false);
    };

    const supportedLanguages = Object.keys(translations);
    const baseLang = getBaseLang(i18n.language);
    const currentFlag = flagEmojis[baseLang] || flagEmojis['en'] || '🌐';
    const currentLangName = t(`languageSwitcher.${baseLang}`) || t('languageSwitcher.en');

    return (
        <div className="language-switcher" ref={switcherRef}>
            <button
                className="language-switcher-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('languageSwitcher.label')}
                aria-haspopup="true"
                aria-expanded={isOpen}
                title={t('languageSwitcher.label')}
            >
                <span className="flag-emoji">{currentFlag}</span>
                <span className="lang-code">{currentLangName}</span>
                <svg className={`chevron-icon ${isOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </button>
            {isOpen && (
                <ul className="language-options">
                    {supportedLanguages.map(lang => (
                        <li key={lang}>
                            <button
                                className={`language-option ${baseLang === lang ? 'active' : ''}`}
                                onClick={() => selectLanguage(lang)}
                            >
                                <span className="flag-emoji">{flagEmojis[lang]}</span>
                                <span>{t(`languageSwitcher.${lang}`)}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const NavControls: React.FC<{ theme: string; toggleTheme: () => void; }> = ({ theme, toggleTheme }) => (
    <>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <LanguageSwitcher />
    </>
);

const Navbar: React.FC<{ activeSection: string; setActiveSectionDirectly: (id: string) => void; theme: string; toggleTheme: () => void; }> = ({ activeSection, setActiveSectionDirectly, theme, toggleTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const sectionDetails = [
        { id: 'home', labelKey: 'nav.home' }, { id: 'about', labelKey: 'nav.about' },
        { id: 'skills', labelKey: 'nav.skills' }, { id: 'projects', labelKey: 'nav.projects' },
        { id: 'experience', labelKey: 'nav.experience' }, { id: 'education', labelKey: 'nav.education' },
        { id: 'publications', labelKey: 'nav.publications' }, { id: 'certificates', labelKey: 'nav.certificates' },
        { id: 'contact', labelKey: 'nav.contact' }
    ];

    useEffect(() => {
        document.body.classList.toggle('mobile-menu-open', isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    const handleLinkClick = (id: string) => {
        setActiveSectionDirectly(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-logo">
                    <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('home'); smoothScrollTo('home'); }} aria-label={t('nav.logoAlt')}>{t('nav.logoAlt')}</a>
                </div>
                <button className="nav-toggle" aria-label={t('nav.toggleNav')} aria-expanded={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                    )}
                </button>
                <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    {sectionDetails.map(section => (
                        <NavLink key={section.id} href={section.id} label={t(section.labelKey)} isActive={activeSection === section.id} onClick={() => handleLinkClick(section.id)} />
                    ))}
                    <li className="mobile-controls"><NavControls theme={theme} toggleTheme={toggleTheme} /></li>
                </ul>
                <div className="desktop-controls"><NavControls theme={theme} toggleTheme={toggleTheme} /></div>
            </div>
        </nav>
    );
};

const Home: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent, userProfile, trackEvent } = useDynamicContent();
    const sectionTracking = useSectionTracking('home');
    
    // Get enhanced personalized content from analytics
    const analyticsContent = analytics.getPersonalizedContent(t);
    
    useEffect(() => {
        sectionTracking.trackSectionView();
        analytics.trackEvent('home_section_viewed', { timestamp: Date.now() });
    }, []);

    const handleCtaClick = (action: string) => {
        trackEvent('cta_clicked', { section: 'home', action });
        analytics.trackEvent('cta_clicked', { action, section: 'home', timestamp: Date.now() });
    };

    // Use analytics content if available, fallback to dynamic content
    const greeting = analyticsContent?.greeting || personalizedContent.home.greeting;
    const tagline = analyticsContent?.tagline || personalizedContent.home.tagline;
    const ctaText = analyticsContent?.cta || t('home.viewWorkBtn');

    return (
        <Section id="home">
            <p className="greeting animate-in" style={{ '--stagger-index': 1 } as React.CSSProperties}>
                {greeting}
                {userProfile.source !== 'unknown' && userProfile.source !== 'direct' && (
                    <span className="source-hint"> (from {userProfile.source})</span>
                )}
            </p>
            <h1 className="animate-in" style={{ '--stagger-index': 2 } as React.CSSProperties}>{t('home.name')}</h1>
            <p className="tagline animate-in" style={{ '--stagger-index': 3 } as React.CSSProperties}>{tagline}</p>
            <p className="intro-text animate-in" style={{ '--stagger-index': 4 } as React.CSSProperties}>{personalizedContent.home.intro}</p>
            <div className="cta-buttons animate-in" style={{ '--stagger-index': 5 } as React.CSSProperties}>
                <button className="btn" onClick={() => { handleCtaClick('viewWork'); smoothScrollTo('projects'); }}>
                    {ctaText}
                </button>
                <a 
                    href="#contact" 
                    className="btn btn-outline" 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        handleCtaClick('contact');
                        smoothScrollTo('contact'); 
                    }}
                >
                    {t('home.getInTouchBtn')}
                </a>
            </div>

            {/* Priority Sections Indicator */}
            {PERSONAS_FEATURE_ENABLED && analyticsContent?.prioritySections?.length > 0 && (
                <div className="priority-sections animate-in" style={{ '--stagger-index': 6 } as React.CSSProperties}>
                    <h3>{t('home.recommendedForYou')}</h3>
                    <div className="section-chips">
                        {analyticsContent.prioritySections.map((section: string) => (
                            <button 
                                key={section} 
                                className="section-chip"
                                onClick={() => {
                                    analytics.trackEvent('priority_section_clicked', { section });
                                    smoothScrollTo(section);
                                }}
                            >
                                {t(`nav.${section}`) || section}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </Section>
    );
};

const About: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent } = useDynamicContent();
    const sectionTracking = useSectionTracking('about');
    const languages = t('about.languages', { returnObjects: true }) as { lang: string; proficiency: string }[];
    
    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    return (
        <Section id="about">
            <h2 className="section-title animate-in">{personalizedContent.about.title}</h2>
            <div className="about-content animate-in glass-panel">
                <div className="about-text">
                    <p>{personalizedContent.about.professionalSummary}</p>
                    <h3>{t('about.keyHighlightsTitle')}</h3>
                    <ul>
                        {personalizedContent.about.keyHighlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>
                    <h3>{t('about.languagesTitle')}</h3>
                    <ul>
                        {Array.isArray(languages) && languages.map((lang, index) => (
                            <li key={index}><span className="language-name">{lang.lang}:</span> {lang.proficiency}</li>
                        ))}
                    </ul>
                </div>
                <div className="about-image-placeholder">
                    <UserIcon />
                </div>
            </div>
        </Section>
    );
};

const Skills: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent, contentAdapter } = useDynamicContent();
    const sectionTracking = useSectionTracking('skills');
    const categories = t('skills.categories', { returnObjects: true });

    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    return (
        <Section id="skills">
            <h2 className="section-title animate-in">{personalizedContent.skills.title}</h2>
            <p className="skills-focus animate-in">
                Focus areas: {personalizedContent.skills.focusAreas.join(', ')}
            </p>
            <div className="card-grid">
                {categories && typeof categories === 'object' && 
                    personalizedContent.skills.priorityOrder.map((categoryKey: string, index: number) => {
                        const category = (categories as any)[categoryKey];
                        if (!category) return null;
                        
                        return (
                            <div 
                                key={category.name} 
                                className="skill-category glass-panel animate-in" 
                                style={{'--stagger-index': index + 1} as React.CSSProperties}
                            >
                                <h3>{category.name}</h3>
                                <div className="skill-items-container">
                                    {Array.isArray(category.items) && category.items.map((skill: string) => (
                                        <span key={skill} className="skill-item">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </Section>
    );
};

const Experience: React.FC = () => {
    const { t } = useTranslation();
    const items = t('experience.items', { returnObjects: true }) as { title: string; company: string; location: string; date: string; description: string[] }[];

    return (
        <Section id="experience">
            <h2 className="section-title animate-in">{t('experience.title')}</h2>
            <div className="timeline">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="timeline-item glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{item.title}</h3>
                        <p className="company-date">{item.company} | {item.location} | {item.date}</p>
                        <ul>
                            {item.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Education: React.FC = () => {
    const { t } = useTranslation();
    const items = t('education.items', { returnObjects: true }) as { degree: string; institution: string; date: string; details?: string }[];
    return (
        <Section id="education">
            <h2 className="section-title animate-in">{t('education.title')}</h2>
            <div className="timeline">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="timeline-item glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{item.degree}</h3>
                        <p className="company-date">{item.institution} | {item.date}</p>
                        {item.details && <p>{item.details}</p>}
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Projects: React.FC = () => {
    const { t } = useTranslation();
    const items = t('projects.items', { returnObjects: true }) as { title: string; description: string; tech: string[]; liveLink?: string; repoLink?: string; }[];
    return (
        <Section id="projects">
            <h2 className="section-title animate-in">{t('projects.title')}</h2>
            <div className="card-grid">
                {Array.isArray(items) && items.map((project, index) => (
                    <div key={index} className="project-card glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{project.title}</h3>
                        <p className="description">{project.description}</p>
                        <div className="tech-stack">
                            {project.tech.map((tech, i) => <span key={i}>{tech}</span>)}
                        </div>
                        <div className="project-links">
                            {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer"><ExternalLinkIcon /> {t('projects.liveDemoLabel')}</a>}
                            {project.repoLink && <a href={project.repoLink} target="_blank" rel="noopener noreferrer"><GithubIcon /> {t('projects.githubRepoLabel')}</a>}
                            {!project.liveLink && !project.repoLink && <p className="description">{t('projects.linksUnavailable')}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Publications: React.FC = () => {
    const { t } = useTranslation();
    const items = t('publications.items', { returnObjects: true }) as { title: string; authors: string; journal: string; date: string; abstract: string; link: string; viewLabel: string }[];
    return (
        <Section id="publications">
            <h2 className="section-title animate-in">{t('publications.title')}</h2>
            <div className="publication-container">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="publication-card glass-panel animate-in" style={{'--stagger-index': index + 1} as React.CSSProperties}>
                        <h3>{item.title}</h3>
                        <p className="publication-authors">{item.authors}</p>
                        <p className="publication-journal">{item.journal} - {item.date}</p>
                        <p className="publication-abstract">{item.abstract}</p>
                        <a href={item.link} className="btn" target="_blank" rel="noopener noreferrer">{item.viewLabel}</a>
                    </div>
                ))}
            </div>
        </Section>
    );
};

interface CertificatesProps {
    onCertClick: (cert: CertificateItem) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ onCertClick }) => {
    const { t } = useTranslation();
    const items = t('certificates.items', { returnObjects: true }) as CertificateItem[];

    return (
        <Section id="certificates">
            <h2 className="section-title animate-in">{t('certificates.title')}</h2>
            <div className="card-grid">
                {Array.isArray(items) && items.map((cert, index) => (
                    <div
                        key={cert.id}
                        className="certificate-card glass-panel animate-in"
                        style={{ '--stagger-index': index + 1 } as React.CSSProperties}
                        onClick={() => onCertClick(cert)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCertClick(cert)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${t('general.viewCertificate')}: ${cert.title}`}
                    >
                        <div className="certificate-image-container">
                            <img 
                                src={cert.imageUrl} 
                                alt={cert.title}
                                loading="lazy"
                                className="certificate-image"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const container = target.parentElement;
                                    if (container) {
                                        container.innerHTML = '<div class="certificate-image-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80"><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A6.75 6.75 0 0115.75 12c0 2.593-1.47 4.88-3.642 6.002a.75.75 0 00.723 1.348A8.25 8.25 0 0017.25 12c0-3.41-2.078-6.388-5.037-7.662a.75.75 0 00-.25-.052zM4.75 12A8.25 8.25 0 0112 3.75a.75.75 0 010 1.5A6.75 6.75 0 005.25 12a6.75 6.75 0 006.75 6.75.75.75 0 010 1.5A8.25 8.25 0 014.75 12z" clipRule="evenodd" /></svg></div>';
                                    }
                                }}
                            />
                        </div>
                        <div className="certificate-info">
                            <h3>{cert.title}</h3>
                            <p>{cert.issuer}</p>
                            <p className="date">{cert.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent, userProfile } = useDynamicContent();
    const sectionTracking = useSectionTracking('contact');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: { name?: string; email?: string; message?: string } = {};

        if (!name.trim()) {
            newErrors.name = t('contact.form.requiredError');
        }

        if (!email.trim()) {
            newErrors.email = t('contact.form.requiredError');
        } else {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(email)) {
                newErrors.email = t('contact.form.emailError');
            }
        }

        if (!message.trim()) {
            newErrors.message = t('contact.form.requiredError');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetForm = () => {
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});
        setSubmissionStatus('idle');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmissionStatus('submitting');
            setTimeout(() => {
                setSubmissionStatus('success');
            }, 1500); // Mock API call
        }
    };
    
    if (submissionStatus === 'success') {
        return (
            <Section id="contact">
                 <div className="contact-content">
                    <h2 className="section-title animate-in">{personalizedContent.contact.title}</h2>
                    <div className="contact-form-success glass-panel animate-in">
                        <h3>{t('contact.form.successTitle')}</h3>
                        <p>{t('contact.form.successMessage')}</p>
                        <button onClick={handleResetForm} className="btn">{t('contact.form.sendAnother')}</button>
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <Section id="contact">
            <div className="contact-content">
                 <h2 className="section-title animate-in">{personalizedContent.contact.title}</h2>
                 <p className="contact-intro animate-in">{personalizedContent.contact.message}</p>
                <form onSubmit={handleSubmit} className="contact-form glass-panel animate-in" noValidate>
                     <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">{t('contact.form.nameLabel')}</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                                }}
                                required
                                className={errors.name ? 'invalid' : ''}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('contact.form.emailLabel')}</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({...prev, email: undefined}));
                                }}
                                className={errors.email ? 'invalid' : ''}
                                aria-invalid={!!errors.email}
                                required
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="message">{t('contact.form.messageLabel')}</label>
                        <textarea
                            id="message"
                            rows={5}
                            value={message}
                            onChange={e => {
                                setMessage(e.target.value);
                                if (errors.message) setErrors(prev => ({...prev, message: undefined}));
                            }}
                            required
                            className={errors.message ? 'invalid' : ''}
                            aria-invalid={!!errors.message}
                        ></textarea>
                        {errors.message && <p className="error-message">{errors.message}</p>}
                    </div>
                    <button type="submit" className="btn" disabled={submissionStatus === 'submitting'}>
                        {submissionStatus === 'submitting' ? t('contact.form.submitting') : t('contact.form.sendBtn')}
                    </button>
                </form>
                <div className="social-links animate-in">
                    <h3>{t('contact.connectTitle')}</h3>
                    <a href="mailto:khalilcharfi8@gmail.com" aria-label={t('contact.emailAria')} target="_blank" rel="noopener noreferrer"><MailIcon /></a>
                    <a href="https://www.linkedin.com/in/khalil-charfi/" aria-label={t('contact.linkedinAria')} target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
                    <a href="https://github.com/khalil-charfi" aria-label={t('contact.githubAria')} target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
                </div>
            </div>
        </Section>
    );
};

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container">
                <p>{t('footer.copyright', { year })}</p>
                <p>{t('footer.credits')}</p>
            </div>
        </footer>
    );
};

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// Enhanced Gemini API connection checker
const useGeminiConnectionCheck = () => {
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed' | 'disabled'>('checking');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [retryCount, setRetryCount] = useState(0);

    const validateApiKey = (apiKey: string): { isValid: boolean; error?: string } => {
        if (!apiKey || apiKey.trim() === '') {
            return { isValid: false, error: 'API key is empty' };
        }
        
        if (apiKey === 'your-gemini_api_key_here' || apiKey === 'your_api_key_here') {
            return { isValid: false, error: 'API key is placeholder value' };
        }
        
        if (apiKey.length < 20) {
            return { isValid: false, error: 'API key is too short' };
        }
        
        // Basic format validation for Gemini API keys
        if (!apiKey.startsWith('AIza') || apiKey.length < 35) {
            return { isValid: false, error: 'API key format appears invalid' };
        }
        
        return { isValid: true };
    };

    const testGeminiConnection = async (apiKey: string, retries = 3): Promise<{ success: boolean; error?: string }> => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Testing Gemini API connection (attempt ${attempt}/${retries})...`);
                
                const ai = new GoogleGenAI({ apiKey });
                const testChat = ai.chats.create({
                    model: 'gemini-2.5-flash-preview-04-17',
                    config: { 
                        systemInstruction: 'You are a test assistant. Respond with "OK" to confirm connection.',
                        temperature: 0.1
                    },
                });

                // Test with a simple message
                const testStream = await testChat.sendMessageStream({ 
                    message: ["Test connection - respond with OK"] 
                });
                
                let responseReceived = false;
                for await (const chunk of testStream) {
                    if (chunk.text) {
                        responseReceived = true;
                        console.log('Gemini API connection successful:', chunk.text);
                        break;
                    }
                }
                
                if (responseReceived) {
                    return { success: true };
                } else {
                    throw new Error('No response received from API');
                }
                
            } catch (error: any) {
                console.warn(`Gemini API connection attempt ${attempt} failed:`, error);
                
                if (attempt === retries) {
                    // Determine specific error type
                    let errorMsg = 'Unknown connection error';
                    
                    if (error.message?.includes('API key')) {
                        errorMsg = 'Invalid API key';
                    } else if (error.message?.includes('quota')) {
                        errorMsg = 'API quota exceeded';
                    } else if (error.message?.includes('permission')) {
                        errorMsg = 'API permission denied';
                    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
                        errorMsg = 'Network connection failed';
                    } else if (error.message?.includes('timeout')) {
                        errorMsg = 'Connection timeout';
                    } else {
                        errorMsg = error.message || 'Connection failed';
                    }
                    
                    return { success: false, error: errorMsg };
                }
                
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
        
        return { success: false, error: 'Max retries exceeded' };
    };

    const checkConnection = async () => {
        setConnectionStatus('checking');
        setErrorMessage('');
        
        // First check if chatbot is enabled via environment variable
        if (!ENABLE_CHATBOT) {
            setConnectionStatus('disabled');
            setErrorMessage('Chatbot is disabled via environment variable');
            return;
        }
        
        // Check if API key exists and validate format
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        const keyValidation = validateApiKey(apiKey);
        
        if (!keyValidation.isValid) {
            setConnectionStatus('failed');
            setErrorMessage(keyValidation.error || 'Invalid API key');
            return;
        }
        
        // Skip API validation in development for faster startup
        if (window.location.hostname === 'localhost' && process.env.NODE_ENV === 'development') {
            console.log('Development mode: Skipping API connection test');
            setConnectionStatus('connected');
            return;
        }
        
        // Test actual API connection
        const connectionResult = await testGeminiConnection(apiKey);
        
        if (connectionResult.success) {
            setConnectionStatus('connected');
            setErrorMessage('');
            setRetryCount(0);
        } else {
            setConnectionStatus('failed');
            setErrorMessage(connectionResult.error || 'Connection failed');
            setRetryCount(prev => prev + 1);
        }
    };

    const retryConnection = () => {
        checkConnection();
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return { 
        connectionStatus, 
        errorMessage, 
        retryCount, 
        retryConnection,
        isAvailable: connectionStatus === 'connected',
        isChecking: connectionStatus === 'checking'
    };
};

// Legacy hook for backward compatibility
const useChatbotAvailability = () => {
    const { isAvailable, isChecking } = useGeminiConnectionCheck();
    return { isAvailable, isChecking };
};

const Chatbot: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const { isAvailable: isChatbotAvailable, isChecking: isChatbotChecking } = useChatbotAvailability();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const createMarkup = (text: string) => {
        const rawMarkup = marked.parse(text, { gfm: true, breaks: true, async: false });
        return { __html: rawMarkup as string };
    };

    const buildContext = (lang: string) => {
        const bundle = translations[lang as keyof typeof translations];
        if (!bundle) return '{}';
        
        const data = {
            about: bundle.about,
            skills: bundle.skills,
            experience: bundle.experience,
            education: bundle.education,
            projects: bundle.projects,
            publications: bundle.publications,
            contactInfo: {
                email: "khalilcharfi8@gmail.com",
                linkedin: "https://www.linkedin.com/in/khalil-charfi/",
                github: "https://github.com/khalil-charfi"
            }
        };
        return JSON.stringify(data);
    };

    // Initialize chat when component mounts and chatbot is available
    useEffect(() => {
        if (!isChatbotAvailable) return;
        
        const initializeChat = async () => {
            try {
                const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
                const ai = new GoogleGenAI({ apiKey: apiKey! });
                const context = buildContext(i18n.language);
                const langName = t(`languageSwitcher.${i18n.language}`);

                const systemInstruction = `You are a helpful and friendly AI assistant for Khalil Charfi's portfolio. Your answers must be based *only* on the provided JSON data about his skills, experience, projects, etc. Be friendly, conversational, and keep answers concise. Format responses with markdown for lists or emphasis. If asked about something outside the context, politely state you can only answer questions about Khalil's portfolio. The user is viewing the portfolio in ${langName}. Here is the portfolio data: ${context}`;
                
                const newChat = ai.chats.create({
                  model: 'gemini-2.5-flash-preview-04-17',
                  config: { systemInstruction },
                });

                setChat(newChat);
                setMessages([{
                    sender: 'ai',
                    text: t('chatbot.initialMessage')
                }]);
            } catch (err) {
                console.warn("Failed to initialize chatbot:", err);
            }
        };

        initializeChat();
    }, [i18n.language, t, isChatbotAvailable]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userInput = inputRef.current?.value.trim();
        if (!userInput || isLoading || !chat) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        if (inputRef.current) inputRef.current.value = '';
        setIsLoading(true);

        setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
        
        try {
            const responseStream = await chat.sendMessageStream({ message: [userInput] });

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                setMessages(prev => {
                    const latestMessages = [...prev];
                    latestMessages[latestMessages.length - 1].text += chunkText;
                    return latestMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            setMessages(prev => {
                 const latestMessages = [...prev];
                 latestMessages[latestMessages.length - 1].text = "Sorry, I encountered an error. Please try again.";
                 return latestMessages;
            });
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };
    
    // Don't render if chatbot is not available or still checking
    if (!isChatbotAvailable || isChatbotChecking) return null;

    return (
        <>
            <button className="chatbot-fab" onClick={() => setIsOpen(true)} aria-label={t('chatbot.openAria')} title={t('chatbot.openAria')}>
                <AiChatIcon />
            </button>
            <div className={`chat-window ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="chat-window-title">
                <div className="chat-header">
                    <h3 id="chat-window-title">{t('chatbot.title')}</h3>
                    <button onClick={() => setIsOpen(false)} aria-label={t('chatbot.closeAria')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.08 1.04L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.sender}`}>
                            <div className="markdown-content" dangerouslySetInnerHTML={createMarkup(msg.text)} />
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-bubble ai">
                           <div className="typing-indicator">
                               <span></span><span></span><span></span>
                           </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form className="message-input-area" onSubmit={handleSendMessage}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={t('chatbot.placeholder')}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <button type="submit" disabled={isLoading} aria-label={t('chatbot.sendAria')}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </>
    );
};

interface ScrollToTopProps {
  chatbotVisible: boolean;
  isVisible: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ chatbotVisible, isVisible }) => {
    const { t } = useTranslation();
    // If chatbot is not visible, use its FAB position
    const bottom = chatbotVisible ? 95 : 25;
    return (
        <button
            type="button"
            onClick={() => smoothScrollTo('home')}
            className={`scroll-to-top${isVisible ? ' visible' : ''}`}
            aria-label={t('general.scrollToTop')}
            title={t('general.scrollToTop')}
            style={{ bottom }}
        >
            <ArrowUpIcon />
        </button>
    );
};

interface CertificateModalProps {
    cert: CertificateItem | null;
    onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ cert, onClose }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (cert) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = '';
        }
    }, [cert]);

    if (!cert) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            tabIndex={-1}
            ref={modalRef}
        >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn" aria-label={t('general.closeModal')}>
                    &times;
                </button>
                <img src={cert.imageUrl} alt={cert.title} loading="lazy" />
                <div className="modal-info">
                    <h3 id="cert-modal-title">{cert.title}</h3>
                    <p>{cert.issuer} - {cert.date}</p>
                </div>
            </div>
        </div>
    );
};

// Performance monitoring and adaptive rendering utilities
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
  connectionSpeed: string;
  isLowEndDevice: boolean;
  gpuTier: 'low' | 'medium' | 'high';
}

interface AdaptiveSettings {
  particleCount: number;
  renderQuality: number;
  bloomEnabled: boolean;
  animationComplexity: number;
  frameSkip: number;
  noiseComplexity: number;
  interactionEnabled: boolean;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private frameTimes: number[] = [];
  private fpsHistory: number[] = [];
  private memoryHistory: number[] = [];
  private adaptiveSettings: AdaptiveSettings;
  private callbacks: ((settings: AdaptiveSettings) => void)[] = [];

  constructor() {
    this.adaptiveSettings = this.getInitialSettings();
    this.startMonitoring();
  }

  private getInitialSettings(): AdaptiveSettings {
    const metrics = this.getCurrentMetrics();
    return this.calculateOptimalSettings(metrics);
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const nav = navigator as any;
    const memory = (performance as any).memory;
    
    // Detect device capabilities
    const isLowEndDevice = this.detectLowEndDevice();
    const gpuTier = this.estimateGPUTier();
    
    return {
      fps: this.getAverageFPS(),
      frameTime: this.getAverageFrameTime(),
      memoryUsage: memory ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0,
      devicePixelRatio: window.devicePixelRatio || 1,
      hardwareConcurrency: nav.hardwareConcurrency || 4,
      connectionSpeed: this.getConnectionSpeed(),
      isLowEndDevice,
      gpuTier
    };
  }

  private detectLowEndDevice(): boolean {
    const nav = navigator as any;
    // Check for low-end device indicators
    return (
      nav.hardwareConcurrency <= 2 ||
      nav.deviceMemory <= 2 ||
      /Android.*Chrome\/[0-5]/.test(nav.userAgent) ||
      window.innerWidth < 768 ||
      window.devicePixelRatio < 1.5
    );
  }

  private estimateGPUTier(): 'low' | 'medium' | 'high' {
    // Cache GPU tier to avoid creating multiple WebGL contexts
    if ((window as any).__gpuTierCache) {
      return (window as any).__gpuTierCache;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const gl = canvas.getContext('webgl2', { 
        failIfMajorPerformanceCaveat: true,
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false
      }) || canvas.getContext('webgl', { 
        failIfMajorPerformanceCaveat: true,
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false
      });
      
      if (!gl) {
        (window as any).__gpuTierCache = 'low';
        return 'low';
      }
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      
      // Clean up immediately
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.width = 0;
      canvas.height = 0;
      
      let tier: 'low' | 'medium' | 'high' = 'medium';
      
      // Basic GPU tier estimation
      if (/Intel.*HD|Intel.*UHD|Mali-400|Adreno.*3|PowerVR.*SGX/.test(renderer)) {
        tier = 'low';
      } else if (/GTX.*10|RTX.*20|RX.*5|Mali-G|Adreno.*5|Apple.*A1[0-9]/.test(renderer)) {
        tier = 'high';
      }
      
      // Cache the result
      (window as any).__gpuTierCache = tier;
      return tier;
    } catch (error) {
      console.warn('GPU tier estimation failed:', error);
      (window as any).__gpuTierCache = 'low';
      return 'low';
    }
  }

  private getConnectionSpeed(): string {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }

  private getAverageFPS(): number {
    return this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length 
      : 60;
  }

  private getAverageFrameTime(): number {
    return this.frameTimes.length > 0
      ? this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length
      : 16.67;
  }

  private calculateOptimalSettings(metrics: PerformanceMetrics): AdaptiveSettings {
    const baseCount = 5000;
    let particleCount = baseCount;
    let renderQuality = 1.0;
    let bloomEnabled = true;
    let animationComplexity = 1.0; // Start with full complexity
    let frameSkip = 1;
    let noiseComplexity = 1.0;
    let interactionEnabled = true;

    // Only reduce settings if we detect actual performance issues
    // Be less aggressive with initial restrictions
    if (metrics.fps > 0 && metrics.fps < 25) { // Only restrict if very low FPS
      particleCount *= 0.4;
      renderQuality = 0.6;
      bloomEnabled = false;
      animationComplexity = 0.6; // Still allow some animation
      frameSkip = 3;
      noiseComplexity = 0.6;
    } else if (metrics.fps > 0 && metrics.fps < 35) {
      particleCount *= 0.6;
      renderQuality = 0.8;
      animationComplexity = 0.8; // Keep most animations
      frameSkip = 2;
      noiseComplexity = 0.8;
    } else if (metrics.fps > 0 && metrics.fps < 45) {
      particleCount *= 0.9;
      renderQuality = 0.95;
      animationComplexity = 0.95; // Barely reduce animations
      noiseComplexity = 0.95;
    }

    // Less aggressive memory restrictions
    if (metrics.memoryUsage > 0.9) { // Only restrict at very high memory usage
      particleCount *= 0.6;
      bloomEnabled = false;
      frameSkip = Math.max(frameSkip, 2);
    } else if (metrics.memoryUsage > 0.8) {
      particleCount *= 0.8;
      animationComplexity *= 0.9; // Minor reduction only
    }

    // Be more generous with low-end device detection
    if (metrics.isLowEndDevice) {
      particleCount = Math.min(particleCount, 2000); // Increased from 1000
      renderQuality = Math.min(renderQuality, 0.8); // Increased from 0.6
      animationComplexity = Math.min(animationComplexity, 0.7); // Keep some animations
      frameSkip = Math.max(frameSkip, 2);
    }

    // Less aggressive GPU-based restrictions
    switch (metrics.gpuTier) {
      case 'low':
        particleCount *= 0.6; // Less aggressive reduction
        renderQuality *= 0.8; // Less aggressive reduction
        animationComplexity *= 0.7; // Keep most animations
        break;
      case 'medium':
        particleCount *= 0.85; // Less aggressive reduction
        renderQuality *= 0.9;
        animationComplexity *= 0.95; // Barely reduce
        break;
      case 'high':
        particleCount *= 1.2;
        renderQuality = 1.0;
        animationComplexity = 1.2;
        break;
    }

    // Less aggressive mobile restrictions
    if (window.innerWidth < 768) {
      particleCount = Math.min(particleCount, 3000); // Increased from 2000
      renderQuality *= 0.9; // Less aggressive
      animationComplexity *= 0.85; // Keep most animations
      frameSkip = Math.max(frameSkip, 2);
    }

    // Connection speed adjustments (for initial load)
    if (metrics.connectionSpeed === 'slow-2g' || metrics.connectionSpeed === '2g') {
      particleCount *= 0.7; // Less aggressive
      renderQuality *= 0.8; // Less aggressive
    }

    return {
      particleCount: Math.max(Math.floor(particleCount), 500), // Increased minimum
      renderQuality: Math.max(renderQuality, 0.5), // Increased minimum
      bloomEnabled,
      animationComplexity: Math.max(animationComplexity, 0.5), // Increased minimum for animations
      frameSkip: Math.min(frameSkip, 3), // Reduced maximum frame skip
      noiseComplexity: Math.max(noiseComplexity, 0.5), // Increased minimum
      interactionEnabled
    };
  }

  private startMonitoring(): void {
    let frameCounter = 0;
    const monitor = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - this.lastTime;
      const fps = 1000 / frameTime;

      // Only sample every 10th frame to reduce overhead
      if (frameCounter % 10 === 0) {
        this.frameTimes.push(frameTime);
        this.fpsHistory.push(fps);

        // Keep only recent history
        if (this.frameTimes.length > 30) this.frameTimes.shift();
        if (this.fpsHistory.length > 30) this.fpsHistory.shift();

        // Update memory usage less frequently
        if (frameCounter % 60 === 0) {
          const memory = (performance as any).memory;
          if (memory) {
            this.memoryHistory.push(memory.usedJSHeapSize / memory.jsHeapSizeLimit);
            if (this.memoryHistory.length > 10) this.memoryHistory.shift();
          }
        }
      }

      frameCounter++;

      // Check if settings need adjustment every 2 seconds
      if (this.frameCount % 120 === 0) {
        this.updateSettings();
      }

      this.lastTime = currentTime;
      this.frameCount++;
      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  private updateSettings(): void {
    const metrics = this.getCurrentMetrics();
    const newSettings = this.calculateOptimalSettings(metrics);
    
    // Only update if there's a significant change
    if (this.shouldUpdateSettings(newSettings)) {
      this.adaptiveSettings = newSettings;
      this.callbacks.forEach(callback => callback(newSettings));
    }
  }

  private shouldUpdateSettings(newSettings: AdaptiveSettings): boolean {
    const current = this.adaptiveSettings;
    return (
      Math.abs(current.particleCount - newSettings.particleCount) > current.particleCount * 0.1 ||
      Math.abs(current.renderQuality - newSettings.renderQuality) > 0.1 ||
      current.bloomEnabled !== newSettings.bloomEnabled ||
      current.frameSkip !== newSettings.frameSkip
    );
  }

  public subscribe(callback: (settings: AdaptiveSettings) => void): void {
    this.callbacks.push(callback);
    // Immediately call with current settings
    callback(this.adaptiveSettings);
  }

  public getCurrentSettings(): AdaptiveSettings {
    return { ...this.adaptiveSettings };
  }

  public getMetrics(): PerformanceMetrics {
    return this.getCurrentMetrics();
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

function FractalParticles({ count = 5000, theme }: { count?: number; theme: string; }) {
  const ref = useRef<THREE.Points>(null!);
  const { viewport, mouse, camera } = useThree();
  const frameCount = useRef(0);
  
  // Performance-adaptive settings
  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveSettings>(() => 
    performanceMonitor.getCurrentSettings()
  );
  
  // Subscribe to performance updates
  useEffect(() => {
    performanceMonitor.subscribe(setAdaptiveSettings);
  }, []);
  
  // Enhanced mouse interaction system
  const mouseTarget = useRef(new THREE.Vector3());
  const currentMouse = useRef(new THREE.Vector3());
  const mouseVelocity = useRef(new THREE.Vector3());
  const lastMousePosition = useRef(new THREE.Vector3());
  const mouseHistory = useRef<THREE.Vector3[]>([]);
  const mouseInfluenceRadius = useRef(0);
  const isMouseMoving = useRef(false);
  const lastMouseMoveTime = useRef(0);
  
  // Cursor trail and interaction effects
  const mouseTrail = useRef<THREE.Vector3[]>([]);
  const maxTrailLength = 20;
  const attractionStrength = useRef(0);
  const repulsionStrength = useRef(0);
  const colorInfluence = useRef(0);
  
  // Mouse interaction mode (can be: 'attract', 'repel', 'flow', 'ripple')
  const [interactionMode, setInteractionMode] = useState<'attract' | 'repel' | 'flow' | 'ripple'>('attract');
  
  // Enhanced mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect?.();
      if (!rect) return;
      
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Enhanced mouse tracking with 3D projection
      const mousePos = new THREE.Vector3(x, y, 0);
      mousePos.unproject(camera);
      
      // Update mouse trail
      mouseTrail.current.push(mousePos.clone());
      if (mouseTrail.current.length > maxTrailLength) {
        mouseTrail.current.shift();
      }
      
      // Update mouse movement detection
      isMouseMoving.current = true;
      lastMouseMoveTime.current = Date.now();
      
      // Cycle interaction modes based on mouse behavior
      const now = Date.now();
      if (now - lastMouseMoveTime.current < 100) {
        // Fast movement - ripple effect
        setInteractionMode('ripple');
      } else if (mouseVelocity.current.length() > 0.1) {
        // Medium movement - flow effect
        setInteractionMode('flow');
      }
    };
    
    const handleMouseEnter = () => {
      attractionStrength.current = 1.0;
      colorInfluence.current = 1.0;
    };
    
    const handleMouseLeave = () => {
      attractionStrength.current = 0;
      colorInfluence.current = 0;
      isMouseMoving.current = false;
      mouseTrail.current = [];
    };
    
    const handleClick = () => {
      // Toggle between attract and repel on click
      setInteractionMode(prev => prev === 'attract' ? 'repel' : 'attract');
      
      // Create explosive effect on click
      repulsionStrength.current = 2.0;
      setTimeout(() => {
        repulsionStrength.current = 0;
      }, 500);
    };
    
    // Stop mouse movement detection after delay
    const checkMouseMovement = () => {
      if (Date.now() - lastMouseMoveTime.current > 200) {
        isMouseMoving.current = false;
        setInteractionMode('attract'); // Default back to attract
      }
    };
    setInterval(checkMouseMovement, 100);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [camera]);
  
  // Performance-optimized particle count
  const optimizedCount = useMemo(() => {
    const baseCount = Math.min(count, adaptiveSettings.particleCount);
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.min(baseCount, adaptiveSettings.particleCount * 0.6) : baseCount;
  }, [count, adaptiveSettings.particleCount]);

  const noise3D = useMemo(() => createNoise3D(), []);
  
  // Theme-specific configurations with performance adjustments and smooth transitions
  const themeConfig = useMemo(() => {
    const qualityMultiplier = Math.max(adaptiveSettings.renderQuality, 0.7); // Ensure minimum quality for light mode
    const complexityMultiplier = Math.max(adaptiveSettings.animationComplexity, 0.8); // Ensure minimum animation for light mode
    
    // Define both theme configurations
    const lightConfig = {
      // Light theme: Modern, sophisticated, elegant - ENHANCED FOR VISIBILITY
      baseColor: new THREE.Color('#4F46E5'), // Darker indigo for better contrast
      highlightColor: new THREE.Color('#7C3AED'), // Rich purple
      attractColor: new THREE.Color('#EA580C'), // Dark orange
      repelColor: new THREE.Color('#DC2626'), // Strong red
      accentColor: new THREE.Color('#7C2D12'), // Dark brown-red
      secondaryColor: new THREE.Color('#0F766E'), // Dark teal
      tertiaryColor: new THREE.Color('#166534'), // Dark green
      particleSize: { 
        min: Math.max(0.025 * qualityMultiplier, 0.02), // Larger particles for visibility
        max: Math.max(0.055 * qualityMultiplier, 0.045) 
      },
      animationSpeed: { 
        base: Math.max(0.12 * complexityMultiplier, 0.1), // Ensure minimum animation
        mouse: Math.max(0.0035 * complexityMultiplier, 0.003),
        wave: Math.max(0.8 * complexityMultiplier, 0.6) // Boosted wave speed
      },
      rotationSpeed: { 
        x: Math.max(0.006 * complexityMultiplier, 0.004), // Boosted rotation
        y: Math.max(0.012 * complexityMultiplier, 0.008) 
      },
      noiseIntensity: Math.max(2.2 * adaptiveSettings.noiseComplexity, 1.5), // Enhanced noise
      interactionRadius: adaptiveSettings.interactionEnabled ? 6.5 : 0,
      bloomIntensity: Math.max(0.4 * qualityMultiplier, 0.3), // Reduced bloom for light mode
      opacity: 0.95, // Higher opacity for visibility
      blending: THREE.NormalBlending, // Changed to normal blending for light backgrounds
      distribution: 'organic',
      colorVariation: Math.max(0.8 * qualityMultiplier, 0.6), // Enhanced color variation
      waveAmplitude: 3.5, // Increased wave amplitude
      spiralTightness: 0.8
    };

    const darkConfig = {
      // Dark theme: Dynamic, energetic, futuristic
      baseColor: new THREE.Color('#00D9FF'), // Cyan
      highlightColor: new THREE.Color('#FFFFFF'), // Pure white
      attractColor: new THREE.Color('#FF6B9D'), // Pink
      repelColor: new THREE.Color('#FFE066'), // Electric yellow
      accentColor: new THREE.Color('#B794F6'), // Light purple
      secondaryColor: new THREE.Color('#F59E0B'), // Amber
      tertiaryColor: new THREE.Color('#34D399'), // Green
      particleSize: { 
        min: 0.012 * qualityMultiplier, 
        max: 0.028 * qualityMultiplier 
      },
      animationSpeed: { 
        base: 0.15 * complexityMultiplier, 
        mouse: 0.004 * complexityMultiplier,
        wave: 1.0 * complexityMultiplier
      },
      rotationSpeed: { 
        x: 0.008 * complexityMultiplier, 
        y: 0.015 * complexityMultiplier 
      },
      noiseIntensity: 2.0 * adaptiveSettings.noiseComplexity,
      interactionRadius: adaptiveSettings.interactionEnabled ? 7.0 : 0,
      bloomIntensity: 0.8 * qualityMultiplier,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      distribution: 'galaxy',
      colorVariation: 0.8 * qualityMultiplier,
      waveAmplitude: 3.0,
      spiralTightness: 1.2
    };

    // Return theme configuration immediately - no interpolation delay
    return theme === 'light' ? lightConfig : darkConfig;
  }, [theme, adaptiveSettings]);

  const { positions, originalPositions, velocities, randomFactors, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(optimizedCount * 3);
    const orig = new Float32Array(optimizedCount * 3);
    const vel = new Float32Array(optimizedCount * 3);
    const col = new Float32Array(optimizedCount * 3);
    const rand = new Float32Array(optimizedCount * 3); // [speed, size, colorVariation] factors
    const sizeArray = new Float32Array(optimizedCount);
    const initialColor = new THREE.Color();

    for (let i = 0; i < optimizedCount; i++) {
      const i3 = i * 3;
      
      // Theme-specific particle distribution
      const spherical = new THREE.Vector3();
      let radius, phi, theta;
      
      if (themeConfig.distribution === 'organic') {
        // Light theme: Organic, flowing, natural distribution
        const layer = Math.floor(Math.random() * 4); // 4 layers for depth
        const layerRadius = 2 + layer * 2.5; // Graduated layers
        
        // Create flowing, organic patterns
        const flowAngle = Math.random() * 2 * Math.PI;
        const flowOffset = Math.sin(flowAngle * 3) * 0.5; // Organic wave
        const spiralness = themeConfig.spiralTightness;
        
        radius = layerRadius + Math.pow(Math.random(), 1.1) * 8;
        phi = Math.acos(1 - 2 * Math.random()) * 0.7 + Math.PI * 0.15; // More concentrated around equator
        theta = flowAngle + Math.sin(flowAngle * spiralness) * Math.PI * 0.3 + flowOffset;
      } else if (themeConfig.distribution === 'spherical') {
        // Alternative spherical distribution
        radius = Math.pow(Math.random(), 1.2) * 10 + 2;
        phi = Math.acos(1 - 2 * Math.random());
        theta = Math.random() * 2 * Math.PI;
      } else {
        // Dark theme: Galaxy-like, more organic distribution
        const armAngle = Math.random() * 2 * Math.PI;
        const armOffset = (Math.random() - 0.5) * Math.PI * 0.3;
        const spiralFactor = Math.random() * 3;
        
        radius = Math.pow(Math.random(), 0.8) * 15 + 1;
        phi = Math.acos(1 - 2 * Math.random()) * 0.6 + Math.PI * 0.2; // Flatter distribution
        theta = armAngle + spiralFactor + armOffset;
      }
      
      spherical.setFromSphericalCoords(radius, phi, theta);

      pos[i3] = spherical.x;
      pos[i3 + 1] = spherical.y;
      pos[i3 + 2] = spherical.z;
      
      orig[i3] = spherical.x;
      orig[i3 + 1] = spherical.y;
      orig[i3 + 2] = spherical.z;

      // Initialize velocities
      vel[i3] = 0;
      vel[i3 + 1] = 0;
      vel[i3 + 2] = 0;

      // Random factors: [speed, size, colorVariation]
      rand[i3] = THREE.MathUtils.randFloat(0.3, 1.8); // speed
      rand[i3 + 1] = THREE.MathUtils.randFloat(0.5, 2.0); // size
      rand[i3 + 2] = Math.random(); // color variation
      
      // Variable particle sizes based on theme
      const sizeRange = themeConfig.particleSize.max - themeConfig.particleSize.min;
      sizeArray[i] = themeConfig.particleSize.min + rand[i3 + 1] * sizeRange;
      
      // Theme-specific initial colors
      const colorMix = rand[i3 + 2] * themeConfig.colorVariation;
      initialColor.copy(themeConfig.baseColor);
      initialColor.lerp(themeConfig.accentColor, colorMix);
      
      col[i3] = initialColor.r;
      col[i3 + 1] = initialColor.g;
      col[i3 + 2] = initialColor.b;
    }
    return { 
      positions: pos, 
      originalPositions: orig, 
      velocities: vel,
      randomFactors: rand, 
      colors: col,
      sizes: sizeArray
    };
  }, [optimizedCount, themeConfig]);

  const tempColor = useMemo(() => new THREE.Color(), []);
  const tempVector = useMemo(() => new THREE.Vector3(), []);

  const paused = useAnimationPause();

  useFrame((state, delta) => {
    if (paused) return;
    if (!ref.current) return;
    
    frameCount.current++;
    
    // Performance-adaptive frame skipping - Less aggressive for light mode
    const frameSkip = theme === 'light' ? Math.min(adaptiveSettings.frameSkip, 2) : adaptiveSettings.frameSkip;
    if (frameCount.current % frameSkip !== 0) return;

    // Smooth mouse following with easing (only if interaction enabled)
    if (adaptiveSettings.interactionEnabled) {
      mouseTarget.current.set(
        mouse.x * viewport.width / 2, 
        mouse.y * viewport.height / 2, 
        0
      );
      
      // Calculate mouse velocity for enhanced effects
      mouseVelocity.current.subVectors(mouseTarget.current, lastMousePosition.current);
      lastMousePosition.current.copy(mouseTarget.current);
      
      // Smooth interpolation towards target with dynamic influence
      const mouseInfluence = isMouseMoving.current ? 0.15 : 0.08;
      currentMouse.current.lerp(mouseTarget.current, mouseInfluence);
      
      // Update mouse influence radius based on movement
      const targetRadius = isMouseMoving.current ? themeConfig.interactionRadius * 1.5 : themeConfig.interactionRadius;
      mouseInfluenceRadius.current += (targetRadius - mouseInfluenceRadius.current) * 0.1;
    }
    
    // Theme-specific rotation animations
    const rotationMultiplier = theme === 'light' ? 1.2 : 1.8; // Enhanced for light mode
    ref.current.rotation.y += delta * themeConfig.rotationSpeed.y * rotationMultiplier + 
      (adaptiveSettings.interactionEnabled ? mouseVelocity.current.x * themeConfig.animationSpeed.mouse : 0);
    ref.current.rotation.x += delta * themeConfig.rotationSpeed.x * rotationMultiplier + 
      (adaptiveSettings.interactionEnabled ? mouseVelocity.current.y * themeConfig.animationSpeed.mouse : 0);
    
    // Additional theme-specific animations - LOWERED THRESHOLD FOR LIGHT MODE
    const animationThreshold = theme === 'light' ? 0.3 : 0.7; // Much lower threshold for light mode
    if (adaptiveSettings.animationComplexity > animationThreshold) {
      if (theme === 'dark') {
        // Dark theme: Add pulsing effect
        const pulseIntensity = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1 + 1;
        ref.current.scale.setScalar(pulseIntensity);
        
        // Add subtle wobble
        ref.current.rotation.z += Math.sin(state.clock.getElapsedTime() * 0.3) * 0.002;
      } else {
        // Light theme: Sophisticated breathing and flowing effects
        const time = state.clock.getElapsedTime();
        const breathe = Math.sin(time * 0.8) * 0.08 + 1; // Enhanced breathing
        const flow = Math.cos(time * 0.4) * 0.04 + 1;
        
        ref.current.scale.setScalar(breathe * flow);
        
        // Add gentle flowing rotation
        ref.current.rotation.z += Math.sin(time * 0.2) * 0.0015; // Enhanced rotation
        
        // Subtle position drift for organic feel
        ref.current.position.x = Math.sin(time * 0.1) * 0.3; // Enhanced movement
        ref.current.position.y = Math.cos(time * 0.15) * 0.2;
      }
    }

    const time = state.clock.getElapsedTime();
    const positionsArray = ref.current.geometry.attributes.position.array as Float32Array;
    const colorsArray = ref.current.geometry.attributes.color.array as Float32Array;
    const sizesArray = ref.current.geometry.attributes.size?.array as Float32Array;

    // Theme-specific interaction parameters
    const localMouseInfluenceRadius = mouseInfluenceRadius.current || themeConfig.interactionRadius;
    const localAttractionStrength = attractionStrength.current || (theme === 'light' ? 2.8 : 4.2) * adaptiveSettings.animationComplexity;
    const localRepulsionStrength = repulsionStrength.current || (theme === 'light' ? 1.5 : 2.8) * adaptiveSettings.animationComplexity;
    const velocityDamping = theme === 'light' ? 0.96 : 0.98;
    const mouseSpeed = adaptiveSettings.interactionEnabled ? mouseVelocity.current.length() : 0;
    
    // Dynamic interaction mode based on mouse speed
    const isAttracting = mouseSpeed < (theme === 'light' ? 0.08 : 0.12);

    for (let i = 0; i < optimizedCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];
        
        const speedFactor = randomFactors[i3];
        const sizeFactor = randomFactors[i3 + 1];
        const colorVariation = randomFactors[i3 + 2];
        
        // Base noise animation
        const noiseScale = 0.15;
        const noiseValue = noise3D(
          ox * noiseScale + time * themeConfig.animationSpeed.base,
          oy * noiseScale + time * themeConfig.animationSpeed.base * 0.8,
          oz * noiseScale + time * themeConfig.animationSpeed.base * 0.6
        );
        
        // Enhanced mouse interaction effects
        let mouseInfluence = 0;
        let mouseColorInfluence = 0;
        let displacement = new THREE.Vector3();
        
        if (adaptiveSettings.interactionEnabled && localAttractionStrength > 0) {
          // Calculate distance to current mouse position
          const particlePos = new THREE.Vector3(positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2]);
          const distanceToMouse = particlePos.distanceTo(currentMouse.current);
          
          if (distanceToMouse < localMouseInfluenceRadius) {
            const influence = (1 - distanceToMouse / localMouseInfluenceRadius) * localAttractionStrength;
            mouseInfluence = influence;
            mouseColorInfluence = influence * colorInfluence.current;
            
            // Direction to/from mouse
            const direction = new THREE.Vector3()
              .subVectors(currentMouse.current, particlePos)
              .normalize();
            
            // Apply different interaction modes
            switch (interactionMode) {
              case 'attract':
                displacement.add(direction.multiplyScalar(influence * 2.5));
                break;
                
              case 'repel':
                displacement.add(direction.multiplyScalar(-influence * 3.0));
                break;
                
              case 'flow':
                // Create flowing motion around mouse
                const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z);
                const flowDirection = perpendicular.multiplyScalar(Math.sin(time * 2 + i * 0.1));
                displacement.add(flowDirection.multiplyScalar(influence * 1.8));
                displacement.add(direction.multiplyScalar(influence * 0.5)); // Slight attraction
                break;
                
              case 'ripple':
                // Create ripple effect
                const ripplePhase = Math.sin(time * 5 - distanceToMouse * 0.1);
                displacement.add(direction.multiplyScalar(ripplePhase * influence * 2.0));
                break;
            }
            
            // Add mouse trail influence
            mouseTrail.current.forEach((trailPos, index) => {
              const trailDistance = particlePos.distanceTo(trailPos);
              const trailAge = (mouseTrail.current.length - index) / mouseTrail.current.length;
              const trailInfluence = (1 - trailDistance / (localMouseInfluenceRadius * 0.5)) * trailAge * 0.3;
              
              if (trailInfluence > 0) {
                const trailDirection = new THREE.Vector3()
                  .subVectors(trailPos, particlePos)
                  .normalize();
                displacement.add(trailDirection.multiplyScalar(trailInfluence));
              }
            });
          }
          
          // Explosive repulsion effect on click
          if (localRepulsionStrength > 0) {
            const explosionInfluence = (1 - distanceToMouse / (localMouseInfluenceRadius * 2)) * localRepulsionStrength;
            if (explosionInfluence > 0) {
              const explosionDirection = new THREE.Vector3()
                .subVectors(particlePos, currentMouse.current)
                .normalize();
              displacement.add(explosionDirection.multiplyScalar(explosionInfluence * 4.0));
            }
          }
        }
        
        // Apply noise displacement with mouse influence modification
        const noiseIntensity = themeConfig.noiseIntensity * (1 + mouseInfluence * 0.5);
        displacement.x += noiseValue * noiseIntensity * speedFactor;
        displacement.y += noiseValue * noiseIntensity * speedFactor * 0.8;
        displacement.z += noiseValue * noiseIntensity * speedFactor * 0.6;
        
        // Theme-specific additional animations (enhanced for mouse interaction)
        if (theme === 'light' && adaptiveSettings.animationComplexity > 0.2) {
          // Light theme: Add sophisticated wave motion - ENHANCED
          const waveTime = time * themeConfig.animationSpeed.wave;
          const mouseWaveBoost = 1 + mouseInfluence * 0.5; // Boost waves near mouse
          
          const wave1 = Math.sin(waveTime + ox * 0.1 + oy * 0.15) * themeConfig.waveAmplitude * 1.5 * mouseWaveBoost;
          const wave2 = Math.cos(waveTime * 0.7 + oz * 0.12) * themeConfig.waveAmplitude * 0.8 * mouseWaveBoost;
          const flow = Math.sin(waveTime * 0.3 + Math.sqrt(ox*ox + oy*oy) * 0.05) * 1.8 * mouseWaveBoost;
          const spiral = Math.cos(waveTime * 0.5 + i * 0.01) * 0.8;
          
          displacement.x += (wave1 * 0.4 + flow * 0.3) * speedFactor;
          displacement.y += (wave2 * 0.5 + Math.sin(waveTime * 0.8 + i * 0.01) * 0.7) * speedFactor;
          displacement.z += ((wave1 + wave2) * 0.3 + spiral * 0.2) * speedFactor;
        } else if (theme === 'dark' && adaptiveSettings.animationComplexity > 0.8) {
          // Dark theme: Add swirling motion
          const swirl = Math.sin(time * 0.5 + i * 0.01) * 0.3;
          displacement.x += Math.cos(time * 0.3 + i * 0.02) * swirl;
          displacement.y += Math.sin(time * 0.4 + i * 0.015) * swirl;
        }
        
        // Current position with organic movement
        const currentPos = tempVector.set(ox, oy, oz).add(displacement);
        
        // Add previous velocity
        currentPos.x += velocities[i3];
        currentPos.y += velocities[i3 + 1];
        currentPos.z += velocities[i3 + 2];
        
        // Apply velocity damping
        velocities[i3] *= 0.98;
        velocities[i3 + 1] *= 0.98;
        velocities[i3 + 2] *= 0.98;
        
        // Update position
        positionsArray[i3] = currentPos.x;
        positionsArray[i3 + 1] = currentPos.y;
        positionsArray[i3 + 2] = currentPos.z;
        
        // Enhanced dynamic color mixing with mouse interaction
        tempColor.copy(themeConfig.baseColor);
        
        if (theme === 'light') {
          // Light theme: Sophisticated, multi-layered color transitions with mouse influence
          const primaryMix = colorVariation * 0.4 * adaptiveSettings.renderQuality;
          const accentMix = colorVariation * 0.3 * adaptiveSettings.renderQuality;
          const secondaryMix = Math.sin(time * 0.15 + i * 0.02) * 0.2 + 0.2;
          
          // Mouse-influenced color mixing
          const mouseColorMix = mouseColorInfluence * 0.6;
          
          // Create gradient-like color transitions
          tempColor.lerp(themeConfig.highlightColor, primaryMix + mouseColorMix * 0.3);
          tempColor.lerp(themeConfig.accentColor, accentMix + mouseColorMix * 0.4);
          tempColor.lerp(themeConfig.secondaryColor, secondaryMix * adaptiveSettings.renderQuality);
          
          // Add mouse interaction color boost
          if (mouseColorInfluence > 0) {
            switch (interactionMode) {
              case 'attract':
                tempColor.lerp(themeConfig.attractColor, mouseColorInfluence * 0.5);
                break;
              case 'repel':
                tempColor.lerp(themeConfig.repelColor, mouseColorInfluence * 0.6);
                break;
              case 'flow':
                tempColor.lerp(themeConfig.secondaryColor, mouseColorInfluence * 0.4);
                break;
              case 'ripple':
                const rippleColor = Math.sin(time * 8 + i * 0.1) * 0.5 + 0.5;
                tempColor.lerp(themeConfig.tertiaryColor, mouseColorInfluence * rippleColor * 0.7);
                break;
            }
          }
          
          // Add subtle tertiary color for depth
          const tertiaryMix = Math.cos(time * 0.12 + i * 0.015) * 0.15 + 0.15;
          tempColor.lerp(themeConfig.tertiaryColor, tertiaryMix * adaptiveSettings.renderQuality);
        } else {
          // Dark theme: Dynamic, energetic color mixing
          const energyMix = Math.sin(time * 0.3 + i * 0.05) * 0.3 + 0.3;
          const accentMix = colorVariation * 0.4;
          
          tempColor.lerp(themeConfig.highlightColor, energyMix * adaptiveSettings.renderQuality);
          tempColor.lerp(themeConfig.accentColor, accentMix * adaptiveSettings.renderQuality);
          
          // Dynamic tertiary color pulse
          const pulseMix = Math.sin(time * 0.2 + i * 0.01) * 0.2 + 0.2;
          tempColor.lerp(themeConfig.tertiaryColor, pulseMix * adaptiveSettings.renderQuality);
          
          // Add mouse interaction effects for dark theme too
          if (mouseColorInfluence > 0) {
            const interactionColor = isAttracting ? themeConfig.attractColor : themeConfig.repelColor;
            tempColor.lerp(interactionColor, mouseColorInfluence * 0.4);
          }
        }
        
        colorsArray[i3] = tempColor.r;
        colorsArray[i3 + 1] = tempColor.g;
        colorsArray[i3 + 2] = tempColor.b;
        
        // Dynamic size based on mouse interaction and theme
        if (sizesArray) {
          const baseSizeVariation = Math.sin(time * 0.5 + i * 0.02) * 0.2 + 1;
          const mouseSizeBoost = 1 + mouseInfluence * 0.8; // Particles grow near mouse
          const baseSize = themeConfig.particleSize.min + sizeFactor * (themeConfig.particleSize.max - themeConfig.particleSize.min);
          sizesArray[i] = baseSize * baseSizeVariation * mouseSizeBoost;
        }
      }
      
      // Update geometry attributes
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.geometry.attributes.color.needsUpdate = true;
      if (ref.current.geometry.attributes.size) {
        ref.current.geometry.attributes.size.needsUpdate = true;
      }
  });

  return (
    React.createElement('points', { ref, key: optimizedCount },
      React.createElement('bufferGeometry', { key: optimizedCount },
        React.createElement('bufferAttribute', {
          attach: "attributes-position",
          count: positions.length / 3,
          array: positions,
          itemSize: 3
        }),
        React.createElement('bufferAttribute', {
          attach: "attributes-color",
          count: colors.length / 3,
          array: colors,
          itemSize: 3
        }),
        React.createElement('bufferAttribute', {
          attach: "attributes-size",
          count: sizes.length,
          array: sizes,
          itemSize: 1
        })
      ),
      React.createElement(PointMaterial, {
        transparent: true,
        size: (theme === 'light' ? 0.035 : 0.022) * adaptiveSettings.renderQuality, // Larger particles for light mode
        sizeAttenuation: true,
        depthWrite: false,
        depthTest: theme === 'light' ? true : false, // Enable depth testing for light mode
        vertexColors: true,
        opacity: themeConfig.opacity,
        blending: themeConfig.blending,
        alphaTest: theme === 'light' ? 0.1 : 0.01 // Higher alpha test for cleaner edges in light mode
      })
    )
  );
}


const InteractiveBackground = ({ theme }: { theme: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  
  // Immediate background color switching
  const bgColor = theme === 'light' ? '#f1f5f9' : '#0a0a0a';
  
  // Theme-specific bloom configuration - immediate switching
  const bloomConfig = useMemo(() => {
    if (theme === 'light') {
      return {
        luminanceThreshold: 0.6,
        intensity: 0.4,
        levels: 6,
        mipmapBlur: true,
        radius: 0.7
      };
    } else {
      return {
        luminanceThreshold: 0.1,
        intensity: 1.2,
        levels: 9,
        mipmapBlur: true,
        radius: 0.9
      };
    }
  }, [theme]);

  // Error recovery
  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => setHasError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  // Add touch support for mobile devices
  useEffect(() => {
    const canvas = canvasRef.current?.parentElement?.querySelector('canvas');
    if (!canvas) return;

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling when touching particles
      // Touch events are automatically handled by React Three Fiber's mouse tracking
    };

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', handleTouch, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchend', handleTouch);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        background: bgColor,
        transition: 'background-color 0.3s ease'
      }} />
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <WebGLErrorBoundary
        fallback={
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: bgColor,
            transition: 'background-color 0.3s ease'
          }} />
        }
        onError={() => setHasError(true)}
      >
        <Canvas 
          ref={canvasRef}
          camera={{ position: [0, 0, 12], fov: theme === 'light' ? 60 : 75 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            // Handle context loss
            const handleContextLoss = () => setHasError(true);
            gl.domElement.addEventListener('webglcontextlost', handleContextLoss);
            return () => gl.domElement.removeEventListener('webglcontextlost', handleContextLoss);
          }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: theme === 'light' ? THREE.NoToneMapping : THREE.LinearToneMapping,
            toneMappingExposure: 1.0,
            outputColorSpace: THREE.SRGBColorSpace,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
        >
          {React.createElement('color', { attach: "background", args: [bgColor] })}
          {React.createElement('ambientLight', { intensity: theme === 'light' ? 0.3 : 0.6 })}
          {theme === 'light' ? (
            React.createElement('directionalLight', { 
              position: [5, 5, 5], 
              intensity: 0.2,
              color: '#ffffff'
            })
          ) : (
            <>
              {React.createElement('pointLight', { 
                position: [10, 10, 10], 
                intensity: 0.3,
                color: '#00D9FF'
              })}
              {React.createElement('pointLight', { 
                position: [-8, -6, 8], 
                intensity: 0.2,
                color: '#FF6B9D'
              })}
            </>
          )}
          <FractalParticles theme={theme} />
          <Suspense fallback={null}>
            <EffectComposer>
              <Bloom 
                luminanceThreshold={bloomConfig.luminanceThreshold}
                intensity={bloomConfig.intensity}
                levels={bloomConfig.levels}
                mipmapBlur={bloomConfig.mipmapBlur}
                radius={bloomConfig.radius}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};


const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
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
    const [personalizedContent, setPersonalizedContent] = useState<any>(null);
    const [showVisitorSelector, setShowVisitorSelector] = useState(false);
    const [TranslationTest, setTranslationTest] = useState<React.ComponentType<any> | null>(null);
    const [VisitorTypeSelector, setVisitorTypeSelector] = useState<React.ComponentType<any> | null>(null);

    // Use useLayoutEffect for immediate DOM update
    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (isThemeTransitioning) {
            document.body.classList.add('theme-transitioning');
            const timeout = setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
                setIsThemeTransitioning(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [theme, isThemeTransitioning]);

    useEffect(() => {
        const lang = getBaseLang(i18n.language);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', ['ar'].includes(lang) ? 'rtl' : 'ltr');
    }, [i18n.language]);

    // Make theme switching instant and reactive
    const toggleTheme = () => {
        setIsThemeTransitioning(true);
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    // Dynamic SEO
    useEffect(() => {
        const seo = t('seo', { returnObjects: true }) as { title: string, description: string };
        if(seo && typeof seo.title === 'string' && typeof seo.description === 'string') {
            document.title = seo.title;
            document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.title);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description);
            document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', seo.title);
            document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', seo.description);
        }
    }, [i18n.language, t]);

    // Dynamically import TranslationTest component only when needed
    useEffect(() => {
        if (IS_DEVELOPMENT && SHOW_TRANSLATION_DEBUG && !TranslationTest) {
            import('./src/components/TranslationTest').then((module) => {
                setTranslationTest(() => module.default);
            });
        }
    }, [TranslationTest]);

    // Dynamically import VisitorTypeSelector component only when needed
    useEffect(() => {
        if (PERSONAS_FEATURE_ENABLED && SHOW_VISITOR_CONTROLS && !VisitorTypeSelector) {
            import('./VisitorTypeSelector').then((module) => {
                setVisitorTypeSelector(() => module.default);
            });
        }
    }, [VisitorTypeSelector]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-30% 0px -70% 0px', threshold: 0 }
        );
        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));
        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    // Track scroll-to-top visibility
    const [isScrollToTopVisible, setScrollToTopVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => {
            setScrollToTopVisible(window.scrollY > 400);
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        // Initialize analytics and check for personalization
        const profile = analytics.getProfile();
        const content = analytics.getPersonalizedContent(t);
        
        if (profile && profile.visitorType !== 'general_visitor') {
            setIsPersonalized(true);
        }
        
        setPersonalizedContent(content);

        // Track page view
        analytics.trackEvent('portfolio_visited', {
            language: getBaseLang(i18n.language),
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        });
    }, [i18n.language, t]);

    const handleVisitorTypeChange = (newType: any) => {
        const content = analytics.getPersonalizedContent(t);
        setPersonalizedContent(content);
        setIsPersonalized(newType !== 'general_visitor');
        
        analytics.trackEvent('personalized_content_updated', {
            newVisitorType: newType,
            language: getBaseLang(i18n.language)
        });
    };

    return (
        <Suspense fallback={t('general.loading')}>
            <>
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

                <InteractiveBackground theme={theme} />
                <Navbar activeSection={activeSection} setActiveSectionDirectly={setActiveSection} theme={theme} toggleTheme={toggleTheme} />
                <main>
                    <Home />
                    <About />
                    <Skills />
                    <Projects />
                    <Experience />
                    <Education />
                    <Publications />
                    <Certificates onCertClick={setSelectedCert} />
                    <Contact />
                    {SHOW_PROFILE_INSIGHTS && <ProfileInsights chatbotOpen={isChatbotAvailable && !isChatbotChecking} scrollToTopVisible={isScrollToTopVisible} />}
                </main>
                
                {/* Translation Debug Component - Only in development */}
                {IS_DEVELOPMENT && SHOW_TRANSLATION_DEBUG && TranslationTest && (
                    <TranslationTest showDebugInfo={true} />
                )}
                <Footer />
                <ScrollToTop chatbotVisible={isChatbotAvailable && !isChatbotChecking} isVisible={isScrollToTopVisible} />
                {isChatbotAvailable && !isChatbotChecking && <Chatbot />}
                
                {/* Gemini API Connection Status Indicator - Only show in development */}
                {IS_DEVELOPMENT && (
                    <div className="gemini-connection-status" style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        background: connectionStatus === 'connected' ? '#2d5a2d' : 
                                   connectionStatus === 'failed' ? '#5a2d2d' : 
                                   connectionStatus === 'checking' ? '#2d4a5a' : '#5a5a5a',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        zIndex: 1000,
                        maxWidth: '300px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            Gemini API: {connectionStatus.toUpperCase()}
                        </div>
                        {errorMessage && (
                            <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>
                                {errorMessage}
                            </div>
                        )}
                        {retryCount > 0 && (
                            <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>
                                Retries: {retryCount}
                            </div>
                        )}
                        {connectionStatus === 'failed' && (
                            <button 
                                onClick={retryConnection}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}
                <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
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
                            <pre>{JSON.stringify(analytics.getProfile(), null, 2)}</pre>
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

                    /* Mobile responsive */
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
    <AnimationPauseProvider>
        <App />
    </AnimationPauseProvider>
 );