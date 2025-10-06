// Analytics and user profiling types
export interface AdvancedFingerprint {
  // Core identifiers
  fingerprintId: string;
  clientId: string;
  canvasFingerprint: string;
  webglFingerprint: string;
  audioFingerprint: string;
  
  // Device characteristics
  screen: {
    resolution: string;
    colorDepth: number;
    pixelRatio: number;
    orientation: string;
  };
  
  // Browser environment
  browser: {
    userAgent: string;
    language: string;
    languages: string[];
    plugins: string[];
    mimeTypes: string[];
    cookieEnabled: boolean;
    doNotTrack: string | null;
  };
  
  // Hardware capabilities
  hardware: {
    hardwareConcurrency: number;
    deviceMemory?: number;
    maxTouchPoints: number;
    platform: string;
    architecture?: string;
  };
  
  // Timing and performance
  performance: {
    timezone: string;
    timezoneOffset: number;
    performanceMemory?: any;
    renderingEngine: string;
  };
  
  // Feature detection
  features: {
    webgl: boolean;
    webrtc: boolean;
    webassembly: boolean;
    webworkers: boolean;
    indexeddb: boolean;
    websockets: boolean;
    geolocation: boolean;
    notification: boolean;
    vibration: boolean;
    touchscreen: boolean;
    speechRecognition: boolean;
    speechSynthesis: boolean;
  };
  
  // Network and connection
  network: {
    connectionType?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  
  // Storage capabilities
  storage: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webSQL: boolean;
    quota?: number;
  };
  
  // Security and privacy
  privacy: {
    incognitoMode: boolean;
    adBlocker: boolean;
    jsEnabled: boolean;
    flashEnabled: boolean;
  };
  
  // Behavioral indicators
  behavioral: {
    mouseMovements: number[];
    keyboardDynamics: number[];
    scrollPattern: number[];
    clickTiming: number[];
  };
}

export interface UserProfile {
  type: 'job_seeker' | 'head_hunter' | 'peer_developer' | 'client' | 'unknown';
  source: 'linkedin' | 'google' | 'github' | 'direct' | 'social' | 'unknown';
  intent: 'hiring' | 'networking' | 'collaboration' | 'learning' | 'unknown';
  interests: string[];
  searchKeywords: string[];
  visitHistory: VisitRecord[];
  sessionData: SessionData;
  preferences: UserPreferences;
  fingerprint?: Partial<AdvancedFingerprint>;
  fingerprintId?: string;
  fingerprintClassification?: {
    userType: string;
    confidence: number;
    indicators: string[];
  };
}

export interface VisitRecord {
  timestamp: number;
  referrer: string;
  searchQuery?: string;
  timeSpent: number;
  sectionsViewed: string[];
  interactions: string[];
}

export interface SessionData {
  startTime: number;
  pageViews: number;
  scrollDepth: number;
  clickedElements: string[];
  timeOnSections: { [section: string]: number };
  deviceInfo: DeviceInfo;
  events: { type: string; timestamp: number; data: any }[];
  sections: { [section: string]: { viewTime: number; duration: number; scrollDepth: number; interactions: number } };
}

export interface DeviceInfo {
  isMobile: boolean;
  screenSize: string;
  browser: string;
  os: string;
  timezone: string;
  language: string;
}

export interface UserPreferences {
  preferredLanguage: string;
  theme: 'light' | 'dark' | 'auto';
  animationsEnabled: boolean;
  contactPreference: 'email' | 'linkedin' | 'phone';
}

export type VisitorType = 
  // Professional/Recruitment
  | 'recruiter' | 'hr_manager' | 'technical_lead' | 'c_level_executive' | 'agency_recruiter'
  // Business/Client  
  | 'startup_founder' | 'product_manager' | 'project_manager' | 'business_owner' | 'enterprise_client'
  // Geographic/Local
  | 'local_business' | 'remote_work_advocate' | 'international_client' | 'local_tech_community'
  // General
  | 'general_visitor' | 'returning_visitor' | 'potential_collaborator';

export type VisitorCategory = 'professional' | 'business' | 'geographic' | 'general';

export interface SimpleUserProfile {
  id: string;
  timestamp: number;
  visitorType: VisitorType;
  category: VisitorCategory;
  detectionMethod: 'referrer' | 'utm' | 'manual' | 'behavioral' | 'device';
  detectionContext?: {
    referrer?: string;
    utm_source?: string;
    utm_campaign?: string;
    device?: string;
    userAgent?: string;
  };
  sessionData: {
    pageViews: number;
    timeSpent: number;
    interactions: number;
    sectionsViewed: string[];
    deviceType: 'mobile' | 'tablet' | 'desktop';
    language: string;
    location?: {
      country?: string;
      city?: string;
      timezone?: string;
    };
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    preferredContactMethod?: 'email' | 'linkedin' | 'phone' | 'form';
    interests: string[];
  };
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  bundleSize: number;
}
