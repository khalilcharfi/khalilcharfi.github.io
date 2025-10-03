// Configuration and settings types
export interface AdaptiveContent {
  [key: string]: {
    [userType: string]: any;
  };
}

export interface PersonalizedContent {
  home: {
    greeting: string;
    tagline: string;
    intro: string;
    ctaText: string;
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
  projects: {
    title: string;
    description: string;
    featuredProjects: string[];
  };
  experience: {
    title: string;
    emphasis: 'achievements' | 'responsibilities' | 'impact';
  };
  contact: {
    title: string;
    message: string;
    primaryCTA: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface EnvironmentConfig {
  PERSONAS_ENABLED: boolean;
  DYNAMIC_CONTENT_ENABLED: boolean;
  FORCE_DEFAULT_CONTENT: boolean;
  SHOW_DEV_ELEMENTS: boolean;
  SHOW_VISITOR_CONTROLS: boolean;
  SHOW_PROFILE_INSIGHTS: boolean;
  SHOW_TRANSLATION_DEBUG: boolean;
  SHOW_DEBUG_INFO: boolean;
  ENABLE_CHATBOT: boolean;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}
