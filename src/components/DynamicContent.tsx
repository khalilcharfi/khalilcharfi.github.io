// Dynamic Content Provider Component
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { PERSONAS_FEATURE_ENABLED } from '../config/personaSettings';
import type { DynamicContentProviderProps, ProfileInsightsProps } from '../types/components';
import type { EnvironmentConfig } from '../types/config';

// Import useConsent from the main app file (exported there)
// This will be available because it's exported from index.tsx
declare global {
  interface Window {
    useConsent?: () => { consent: { analytics: boolean } };
  }
}

// Temporary consent hook - will use the one from index.tsx when available
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

interface SimpleDynamicContentContextType {
  personalizedContent: SimplePersonalizedContent;
  userProfile: SimpleUserProfile;
  contentAdapter: any;
  trackEvent: (event: string, data?: any) => void;
}

// ===============================
//  Feature Flags: Personas / Profiles & Content Modes
// -------------------------------
// Set VITE_ENABLE_PERSONAS=false in your .env or build command to completely
// disable personalized personas/profiles logic at compile-time.
// Alternatively, change the constant below directly.
export const PERSONAS_ENABLED: boolean = (import.meta as any).env?.VITE_ENABLE_PERSONAS !== 'false';

// Dynamic content control flags
export const DYNAMIC_CONTENT_ENABLED: boolean = (import.meta as any).env?.VITE_ENABLE_DYNAMIC_CONTENT !== 'false';
export const FORCE_DEFAULT_CONTENT: boolean = (import.meta as any).env?.VITE_FORCE_DEFAULT_CONTENT === 'true';

// Development elements visibility flags
export const SHOW_DEV_ELEMENTS: boolean = (import.meta as any).env?.VITE_SHOW_DEV_ELEMENTS === 'true';
export const SHOW_VISITOR_CONTROLS: boolean = (import.meta as any).env?.VITE_SHOW_VISITOR_CONTROLS === 'true';
export const SHOW_PROFILE_INSIGHTS: boolean = (import.meta as any).env?.VITE_SHOW_PROFILE_INSIGHTS === 'true';
export const SHOW_TRANSLATION_DEBUG: boolean = (import.meta as any).env?.VITE_SHOW_TRANSLATION_DEBUG === 'true';
export const SHOW_DEBUG_INFO: boolean = (import.meta as any).env?.VITE_SHOW_DEBUG_INFO === 'true';

// Chatbot configuration
export const ENABLE_CHATBOT: boolean = (import.meta as any).env?.VITE_ENABLE_CHATBOT !== 'false';

// Recommended sections configuration - DISABLED BY DEFAULT
// Priority sections will only render when explicitly enabled via VITE_SHOW_RECOMMENDED_SECTIONS=true
export const SHOW_RECOMMENDED_SECTIONS: boolean = (import.meta as any).env?.VITE_SHOW_RECOMMENDED_SECTIONS === 'true';

// Environment detection
export const IS_DEVELOPMENT: boolean = (import.meta as any).env?.DEV === true;
export const IS_PRODUCTION: boolean = (import.meta as any).env?.PROD === true;
// ===============================

// Default content as a function for i18n
const getDefaultContent = (t: (key: string, options?: any) => string | object): SimplePersonalizedContent => ({
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
    priorityOrder: [
      t('skills.priorityProgramming') as string, 
      t('skills.priorityFrameworks') as string, 
      t('skills.priorityTools') as string, 
      t('skills.priorityDatabases') as string
    ]
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
  contentAdapter: {},
  trackEvent: () => {}
});

interface DynamicContentProviderProps {
  children: ReactNode;
}

export const DynamicContentProvider: React.FC<DynamicContentProviderProps> = ({ children }) => {
  const { i18n, t, ready } = useTranslation();
  const { consent } = useConsent();
  const [userProfile] = useState<SimpleUserProfile>(defaultProfile);
  const [personalizedContent, setPersonalizedContent] = useState<SimplePersonalizedContent>(() => getDefaultContent(t));

  // Check if analytics consent is granted
  const analyticsConsent = (consent as any).analytics === true;

  // Personas are only active when the feature is enabled *and* analytics consent is given
  const personasActive = PERSONAS_FEATURE_ENABLED && analyticsConsent;
  
  // Content mode logic: force default content overrides everything
  const useDefaultContent = FORCE_DEFAULT_CONTENT || !DYNAMIC_CONTENT_ENABLED;
  const useDynamicContent = DYNAMIC_CONTENT_ENABLED && !FORCE_DEFAULT_CONTENT;
  
  // Debug logging for content mode
  useEffect(() => {
    console.log('Content Mode Debug:', {
      PERSONAS_ENABLED,
      DYNAMIC_CONTENT_ENABLED,
      FORCE_DEFAULT_CONTENT,
      useDefaultContent,
      useDynamicContent,
      personasActive,
      analyticsConsent
    });
  }, [useDefaultContent, useDynamicContent, personasActive, analyticsConsent]);

  const trackEvent = (event: string, data?: any) => {
    if (!personasActive || !useDynamicContent) {
      console.log('Event tracking skipped - no analytics consent, personas disabled, or dynamic content disabled');
      return;
    }
    console.log('Event tracked:', event, data);
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
      contentAdapter: {},
      trackEvent
    }}>
      {children}
    </DynamicContentContext.Provider>
  );
};

export const useDynamicContent = () => {
  return useContext(DynamicContentContext);
};

// Utility function to get current content mode info
export const getContentModeInfo = () => {
  return {
    personasEnabled: PERSONAS_FEATURE_ENABLED,
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
    console.log('Section view tracked:', section);
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
export const DynamicSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

// Dynamic CTA component
export const DynamicCTA: React.FC<{ className?: string }> = ({ className }) => {
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
};

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
export const ProfileInsights: React.FC<{ chatbotOpen?: boolean; scrollToTopVisible?: boolean; }>
  = ({ chatbotOpen = false, scrollToTopVisible = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const debug = isDebugMode();
  if (!PERSONAS_FEATURE_ENABLED || !DYNAMIC_CONTENT_ENABLED) return null;

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
};
