// Dynamic Content Provider Component
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from 'react-hook-consent';
import { userAnalytics, UserProfile } from './userAnalytics';
import { ContentAdapter, PersonalizedContent } from './contentAdapter';
import { analytics, VisitorType } from './userAnalytics';
import VisitorTypeSelector from './VisitorTypeSelector';
import { PERSONAS_FEATURE_ENABLED } from './personaSettings';

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
    focusAreas: string[];
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
//  Feature Flag: Personas / Profiles
// -------------------------------
// Set VITE_ENABLE_PERSONAS=false in your .env or build command to completely
// disable personalized personas/profiles logic at compile-time.
// Alternatively, change the constant below directly.
export const PERSONAS_ENABLED: boolean = (import.meta as any).env?.VITE_ENABLE_PERSONAS !== 'false';
// ===============================

// Default content as a function for i18n
const getDefaultContent = (t: (key: string) => string): SimplePersonalizedContent => ({
  home: {
    greeting: t('dynamicContent.defaultGreeting'),
    tagline: t('dynamicContent.defaultTagline'),
    intro: t('dynamicContent.defaultIntro')
  },
  about: {
    title: t('about.title'),
    professionalSummary: t('dynamicContent.professionalSummary'),
    keyHighlights: [
      t('dynamicContent.expertInAI'),
      t('dynamicContent.fullStackProficiency'),
      t('dynamicContent.problemSolving'),
      t('dynamicContent.modernFrameworks')
    ]
  },
  skills: {
    title: t('skills.title'),
    focusAreas: [t('skills.focusAI'), t('skills.focusWebDev'), t('skills.focusDataScience')],
    priorityOrder: [t('skills.priorityProgramming'), t('skills.priorityFrameworks'), t('skills.priorityTools'), t('skills.priorityDatabases')]
  },
  contact: {
    title: t('contact.title'),
    message: t('contact.message')
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
  const { i18n, t } = useTranslation();
  const { consent } = useConsent();
  const [userProfile] = useState<SimpleUserProfile>(defaultProfile);
  const [personalizedContent, setPersonalizedContent] = useState<SimplePersonalizedContent>(() => getDefaultContent(t));

  // Check if analytics consent is granted
  const analyticsConsent = (consent as any).analytics === true;

  // Personas are only active when the feature is enabled *and* analytics consent is given
  const personasActive = PERSONAS_FEATURE_ENABLED && analyticsConsent;

  const trackEvent = (event: string, data?: any) => {
    if (!personasActive) {
      console.log('Event tracking skipped - no analytics consent or personas disabled');
      return;
    }
    console.log('Event tracked:', event, data);
  };

  // Update meta tags only if personas are active
  useEffect(() => {
    if (!personasActive) {
      // Use generic meta tags when no consent
      document.title = 'Khalil Charfi | Portfolio';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Portfolio of Khalil Charfi, Full-Stack Developer');
      }
      return;
    }

    // Use personalized meta tags when consent is granted
    // ... existing meta tag logic ...
  }, [personasActive, personalizedContent, i18n.language]);

  // Update content on language change
  useEffect(() => {
    setPersonalizedContent(getDefaultContent(t));
  }, [t, i18n.language]);

  return (
    <DynamicContentContext.Provider value={{
      personalizedContent: personasActive ? personalizedContent : getDefaultContent(t),
      userProfile: personasActive ? userProfile : defaultProfile,
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
  if (!PERSONAS_FEATURE_ENABLED) return null;

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

const getBaseLang = (lang: string) => lang?.split('-')[0] || 'en';
// Replace all i18n.language usages in translation/analytics with getBaseLang(i18n.language)
// ... existing code ... 