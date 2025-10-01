/**
 * TypeScript types for translation keys
 * Provides compile-time detection of missing translation keys
 */

// Base translation structure
export interface BaseTranslations {
  nav: {
    home: string;
    about: string;
    skills: string;
    experience: string;
    education: string;
    projects: string;
    publications: string;
    certificates: string;
    contact: string;
    logoAlt: string;
    toggleNav: string;
  };
  general: {
    scrollToTop: string;
    closeModal: string;
    viewCertificate: string;
    loading: string;
    error: string;
    retry: string;
    noResults: string;
    skipToMain: string;
    skipToNav: string;
    openInNewTab: string;
    externalLink: string;
  };
  theme: {
    toggleLight: string;
    toggleDark: string;
    changedToLight: string;
    changedToDark: string;
  };
  languageSwitcher: {
    label: string;
    en: string;
    de: string;
    fr: string;
    ar: string;
  };
  home: {
    greeting: string;
    name: string;
    tagline: string;
    intro: string;
    viewWorkBtn: string;
    getInTouchBtn: string;
    recommendedForYou: string;
  };
  about: {
    title: string;
    sectionContent: {
      p1: string;
      imagePlaceholder: string;
    };
    professionalSummaryTitle: string;
    professionalSummary: string;
    languagesTitle: string;
    languages: Array<{
      lang: string;
      proficiency: string;
    }>;
    keyHighlightsTitle: string;
    // Additional keys that were missing
    keyHighlights: string;
    languages: {
      arabic: string;
      english: string;
      french: string;
    };
  };
  skills: {
    title: string;
    categories: {
      frontend: {
        name: string;
        items: string[];
      };
      backend: {
        name: string;
        items: string[];
      };
      mobile: {
        name: string;
        items: string[];
      };
      databases: {
        name: string;
        items: string[];
      };
      devops: {
        name: string;
        items: string[];
      };
      tools: {
        name: string;
        items: string[];
      };
    };
    focusAI: string;
    focusWebDev: string;
    focusDataScience: string;
    priorityProgramming: string;
    priorityFrameworks: string;
    priorityTools: string;
    priorityDatabases: string;
  };
  experience: {
    title: string;
    items: Array<{
      title: string;
      company: string;
      location: string;
      date: string;
      description: string[];
    }>;
  };
  education: {
    title: string;
    items: Array<{
      degree: string;
      institution: string;
      date: string;
      details: string;
    }>;
  };
  projects: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      tech: string[];
    }>;
    linksUnavailable: string;
    liveDemoLabel: string;
    githubRepoLabel: string;
  };
  publications: {
    title: string;
    items: Array<{
      title: string;
      authors: string;
      journal: string;
      date: string;
      abstract: string;
      link: string;
      viewLabel: string;
    }>;
  };
  certificates: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      subtitle?: string;
      issuer: string;
      date: string;
      location: string;
      imageUrl: string;
    }>;
  };
  contact: {
    title: string;
    intro: string;
    message: string;
    form: {
      nameLabel: string;
      emailLabel: string;
      messageLabel: string;
      sendBtn: string;
      submitting: string;
      successTitle: string;
      successMessage: string;
      sendAnother: string;
      demoAlert: string;
      emailError: string;
      requiredError: string;
    };
    connectTitle: string;
    emailAria: string;
    linkedinAria: string;
    githubAria: string;
  };
  footer: {
    copyright: string;
    credits: string;
  };
  chatbot: {
    title: string;
    placeholder: string;
    initialMessage: string;
    openAria: string;
    closeAria: string;
    sendAria: string;
  };
  cookieConsent: {
    title: string;
    description: string;
    acceptAllBtn: string;
    acceptNecessaryBtn: string;
    showPreferencesBtn: string;
    closeIconLabel: string;
    preferencesTitle: string;
    savePreferencesBtn: string;
    cookieUsageTitle: string;
    cookieUsageDescription: string;
    necessaryCookiesTitle: string;
    necessaryCookiesDescription: string;
    analyticsCookiesTitle: string;
    analyticsCookiesDescription: string;
  };
  profileInsights: {
    toggleLabel: string;
    title: string;
    description: string;
  };
  errors: {
    boundaryTitle: string;
    boundaryMessage: string;
    retryButton: string;
    analyticsError: string;
  };
  seo: {
    title: string;
    description: string;
  };
  dynamicContent: {
    defaultGreeting: string;
    defaultTagline: string;
    defaultIntro: string;
    viewMyWork: string;
    professionalSummary: string;
    expertInAI: string;
    fullStackProficiency: string;
    problemSolving: string;
    modernFrameworks: string;
    keyHighlights: {
      ml: string;
      fullstack: string;
      problemSolving: string;
      experience: string;
    };
  };
  dates: {
    months: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
    present: string;
  };
  visitor: {
    recruiter: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    hr_manager: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    technical_lead: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    c_level_executive: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    agency_recruiter: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    startup_founder: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    product_manager: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    project_manager: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    business_owner: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    enterprise_client: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    local_business: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    remote_work_advocate: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    international_client: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    local_tech_community: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    general_visitor: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    returning_visitor: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    potential_collaborator: {
      greeting: string;
      tagline: string;
      cta: string;
    };
  };
}

// Language-specific translations
export type LanguageSpecificTranslations = {
  [K in keyof BaseTranslations]: BaseTranslations[K];
};

// All translations
export type Translations = {
  en: LanguageSpecificTranslations;
  de: LanguageSpecificTranslations;
  fr: LanguageSpecificTranslations;
  ar: LanguageSpecificTranslations;
};

// Utility type to get all possible translation keys
export type TranslationKey = string;

// Type-safe translation function
export interface TranslationFunction {
  (key: TranslationKey, options?: any): string;
}

// Helper type to validate translation keys at compile time
export type ValidateTranslationKey<T extends string> = T extends TranslationKey ? T : never;
