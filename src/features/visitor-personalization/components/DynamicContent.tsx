// Dynamic Content Provider Component
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { PERSONAS_FEATURE_ENABLED as PERSONAS_ENABLED, DYNAMIC_CONTENT_ENABLED, FORCE_DEFAULT_CONTENT } from '../../../shared/config';

const useConsent = () => {
  const [consent, setConsent] = useState<{ analytics: boolean }>({ analytics: false });

  useEffect(() => {
    const handleAnalyticsGranted = () => setConsent({ analytics: true });
    const handleAnalyticsDenied = () => setConsent({ analytics: false });

    window.addEventListener('cookieconsent-analytics-granted', handleAnalyticsGranted);
    window.addEventListener('cookieconsent-analytics-denied', handleAnalyticsDenied);

    return () => {
      window.removeEventListener('cookieconsent-analytics-granted', handleAnalyticsGranted);
      window.removeEventListener('cookieconsent-analytics-denied', handleAnalyticsDenied);
    };
  }, []);

  return { consent };
};

// Simple types to avoid conflicts
interface SimpleUserProfile {
  source: string;
  interests: string[];
  timeOnSite: number;
  previousVisits: number;
  preferredContent: string[];
  engagementLevel: 'low' | 'medium' | 'high';
  scrollDepth: number;
}

interface SimplePersonalizedContent {
  home: {
    greeting: string;
    tagline: string;
    intro: string;
  };
  about: {
    title: string;
    professionalSummary: string;
    keyHighlights: string[];
  };
  skills: {
    title: string;
    priorityOrder: string[];
  };
  contact: {
    title: string;
    message: string;
  };
}

interface ContentAdapter {
  getPersonalizedContent: (profile: SimpleUserProfile) => SimplePersonalizedContent;
  trackEvent: (event: string, data?: Record<string, unknown>) => void;
}

interface SimpleDynamicContentContextType {
  personalizedContent: SimplePersonalizedContent;
  userProfile: SimpleUserProfile;
  contentAdapter: ContentAdapter;
  trackEvent: (event: string, data?: Record<string, unknown>) => void;
}

// ===============================
//  Feature Flags: Personas / Profiles & Content Modes
// -------------------------------
// PERSONAS_ENABLED is now imported from shared/config as PERSONAS_FEATURE_ENABLED
// Set VITE_ENABLE_PERSONAS=false in your .env or build command to completely
// disable personalized personas/profiles logic at compile-time.
// All feature flags are now imported from shared/config
// See src/shared/config/featureFlags.ts and personaSettings.ts for full list
// ===============================

// Default content as a function for i18n
const getDefaultContent = (t: (key: string, options?: Record<string, unknown>) => string | object): SimplePersonalizedContent => ({
  home: {
    greeting: t('dynamicContent.defaultGreeting') as string,
    tagline: t('dynamicContent.defaultTagline') as string,
    intro: t('dynamicContent.defaultIntro') as string
  },
  about: {
    title: t('about.title') as string,
    professionalSummary: t('dynamicContent.professionalSummary') as string,
    keyHighlights: [
      t('dynamicContent.fullStackProficiency') as string,
      t('dynamicContent.problemSolving') as string,
      t('dynamicContent.modernFrameworks') as string
    ]
  },
  skills: {
    title: t('skills.title') as string,
    priorityOrder: ['frontend', 'backend', 'mobile', 'databases', 'devops', 'tools']
  },
  contact: {
    title: t('contact.title') as string,
    message: t('contact.message') as string
  }
});

const defaultProfile: SimpleUserProfile = {
  source: 'direct',
  interests: [],
  timeOnSite: 0,
  previousVisits: 0,
  preferredContent: [],
  engagementLevel: 'medium',
  scrollDepth: 0
};

// Context
const DynamicContentContext = createContext<SimpleDynamicContentContextType>({
  personalizedContent: getDefaultContent((key: string) => key),
  userProfile: defaultProfile,
  contentAdapter: {
    getPersonalizedContent: () => getDefaultContent((key: string) => key),
    trackEvent: () => {},
  },
  trackEvent: () => {}
});

interface DynamicContentProviderProps {
  children: ReactNode;
}

export const DynamicContentProvider: React.FC<DynamicContentProviderProps> = React.memo(({ children }) => {
  const { i18n, t, ready } = useTranslation();
  const { consent } = useConsent();
  const [userProfile] = useState<SimpleUserProfile>(defaultProfile);
  const [personalizedContent, setPersonalizedContent] = useState<SimplePersonalizedContent>(() => getDefaultContent(t));

  // Check if analytics consent is granted
  const analyticsConsent = (consent as any).analytics === true;

  // Personas are only active when the feature is enabled *and* analytics consent is given
  const personasActive = PERSONAS_ENABLED && analyticsConsent;
  
  // Content mode logic: force default content overrides everything
  const useDefaultContent = FORCE_DEFAULT_CONTENT || !DYNAMIC_CONTENT_ENABLED;
  const useDynamicContent = DYNAMIC_CONTENT_ENABLED && !FORCE_DEFAULT_CONTENT;
  
  // Debug logging for content mode (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Content Mode Debug:', {
        PERSONAS_ENABLED,
        DYNAMIC_CONTENT_ENABLED,
        FORCE_DEFAULT_CONTENT,
        useDefaultContent,
        useDynamicContent,
        personasActive,
        analyticsConsent
      });
    }
  }, [useDefaultContent, useDynamicContent, personasActive, analyticsConsent]);

  const trackEvent = (event: string, data?: any) => {
    if (!personasActive || !useDynamicContent) {
      if (import.meta.env.DEV) {
        console.log('Event tracking skipped - no analytics consent, personas disabled, or dynamic content disabled');
      }
      return;
    }
    if (import.meta.env.DEV) {
      console.log('Event tracked:', event, data);
    }
  };

  // Update meta tags based on content mode and personas
  useEffect(() => {
    if (!personasActive || !useDynamicContent) {
      // Use generic meta tags when no consent or dynamic content disabled
      document.title = 'Khalil Charfi | Portfolio';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Portfolio of Khalil Charfi, Full-Stack Developer');
      }
      return;
    }

    // Use personalized meta tags when consent is granted and dynamic content is enabled
    // ... existing meta tag logic ...
  }, [personasActive, useDynamicContent, personalizedContent, i18n.language]);

  // Update content on language change and when i18n is ready
  useEffect(() => {
    if (ready) {
      setPersonalizedContent(getDefaultContent(t));
    }
  }, [t, i18n.language, ready]);

  // Content selection logic with new flags
  const currentContent = useDefaultContent 
    ? getDefaultContent(t) 
    : (personasActive && useDynamicContent ? personalizedContent : getDefaultContent(t));
  
  // Don't render children until i18n is ready to prevent showing translation keys
  if (!ready) {
    return <div>Loading...</div>;
  }
  
  return (
    <DynamicContentContext.Provider value={{
      personalizedContent: currentContent,
      userProfile: (personasActive && useDynamicContent) ? userProfile : defaultProfile,
      contentAdapter: {
        getPersonalizedContent: () => getDefaultContent(t),
        trackEvent: () => {}
      },
      trackEvent
    }}>
      {children}
    </DynamicContentContext.Provider>
  );
});

export const useDynamicContent = () => {
  return useContext(DynamicContentContext);
};

// Utility function to get current content mode info
export const getContentModeInfo = () => {
  return {
    personasEnabled: PERSONAS_ENABLED,
    dynamicContentEnabled: DYNAMIC_CONTENT_ENABLED,
    forceDefaultContent: FORCE_DEFAULT_CONTENT,
    isUsingDefaultContent: FORCE_DEFAULT_CONTENT || !DYNAMIC_CONTENT_ENABLED,
    isUsingDynamicContent: DYNAMIC_CONTENT_ENABLED && !FORCE_DEFAULT_CONTENT
  };
};

// Section tracking hook
// Updated signature: return an object with a manual tracking method for compatibility
export const useSectionTracking = (section: string): {
  ref: React.RefObject<HTMLElement | null>;
  isIntersecting: boolean;
  trackSectionView: () => void;
} => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Manual tracker (used by components that want to trigger logging explicitly)
  const trackSectionView = () => {
    if (import.meta.env.DEV) {
      console.log('Section view tracked:', section);
    }
    // Here you can wire up real analytics if needed, e.g. analytics.trackEvent('section_view', { section })
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Automatically detect section visibility using IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          trackSectionView();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [section]);

  return { ref, isIntersecting, trackSectionView };
};

// Dynamic Section component
export const DynamicSection: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  return <div>{children}</div>;
});

// Dynamic CTA component
export const DynamicCTA: React.FC<{ className?: string }> = React.memo(({ className }) => {
  return (
    <a href="#projects" className={className} onClick={(e) => { 
      e.preventDefault(); 
      const projectsElement = document.getElementById('projects');
      if (projectsElement) {
        projectsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }}>
      View My Work
    </a>
  );
});

// Helper to detect debug mode
const isDebugMode = (): boolean => {
  // Always show in local dev server (Vite)
  // Use safe access to avoid TypeScript errors when types are not present
  if ((import.meta as any).env?.DEV) return true;

  // Guard for SSR environments where "window" is not available
  if (typeof window === 'undefined') return false;

  // Check URL param or localStorage flag
  const urlDebug = window.location.search.includes('debug=true');
  const storageDebug = localStorage.getItem('show_profile_insights') === 'true';
  return urlDebug || storageDebug;
};

// Profile Insights component
export const ProfileInsights: React.FC<{ chatbotOpen?: boolean; scrollToTopVisible?: boolean; }> = React.memo(({ chatbotOpen = false, scrollToTopVisible = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const debug = isDebugMode();
  if (!PERSONAS_ENABLED || !DYNAMIC_CONTENT_ENABLED) return null;

  // Dynamically calculate bottom offset
  let bottom = 160;
  if (chatbotOpen) bottom += 80; // Chatbot window open, move up
  else if (scrollToTopVisible) bottom += 60; // Scroll-to-top visible, move up

  if (!debug) return null;

  return (
    <>
      <button 
        className="profile-insights-toggle"
        style={{ bottom, zIndex: 1001 }}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Toggle profile insights"
      >
        📊
      </button>
      <div className={`profile-insights ${isVisible ? 'visible' : ''}`} style={{ bottom: bottom + 60, zIndex: 1000 }}>
        <h4>Profile Insights</h4>
        <p>Visit source: Direct</p>
        <p>Engagement: Medium</p>
        <p>Time on site: Active</p>
      </div>
    </>
  );
});
