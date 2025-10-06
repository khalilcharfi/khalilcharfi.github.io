// User Analytics and Context Detection System
import React from 'react';
import { advancedFingerprinter, type AdvancedFingerprint } from './advancedFingerprinting';
import { useConsent } from 'react-hook-consent';
import { ENABLED_PERSONAS } from '../../../shared/config';

export interface UserProfile {
  type: 'job_seeker' | 'head_hunter' | 'peer_developer' | 'client' | 'unknown';
  source: 'linkedin' | 'google' | 'github' | 'direct' | 'social' | 'unknown';
  intent: 'hiring' | 'networking' | 'collaboration' | 'learning' | 'unknown';
  interests: string[];
  searchKeywords: string[];
  visitHistory: VisitRecord[];
  sessionData: SessionData;
  preferences: UserPreferences;
  // Enhanced with advanced fingerprinting
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

// Enhanced visitor profiling with comprehensive detection and personalization
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

export class UserAnalytics {
  private profile: UserProfile = this.getDefaultProfile();
  private sectionStartTimes: { [section: string]: number } = {};
  private observers: ((profile: UserProfile) => void)[] = [];
  private isInitialized: boolean = false;
  private consentGranted: boolean = false;
  private fallbackMode: boolean = false;
  private errorCount: number = 0;
  private maxErrors: number = 3;

  constructor() {
    try {
      this.profile = this.getDefaultProfile();
      this.loadProfile();
      this.initializeSafely();
    } catch (error) {
      console.warn('UserAnalytics initialization failed, using fallback mode:', error);
      this.enableFallbackMode();
    }
  }

  private initializeSafely(): void {
    try {
      this.detectUserContext();
      this.startTracking();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize user analytics:', error);
      this.handleError('initialization', error);
    }
  }

  private enableFallbackMode(): void {
    this.fallbackMode = true;
    this.profile = this.getFallbackProfile();
    this.isInitialized = true;
    console.info('Analytics running in fallback mode with default persona');
  }

  private handleError(context: string, error: any): void {
    this.errorCount++;
    console.warn(`Analytics error in ${context}:`, error);
    
    if (this.errorCount >= this.maxErrors) {
      console.warn('Too many analytics errors, switching to fallback mode');
      this.enableFallbackMode();
    }
  }

  private getFallbackProfile(): UserProfile {
    return {
      type: 'unknown',
      source: 'direct',
      intent: 'unknown',
      interests: ['about', 'skills', 'projects'],
      searchKeywords: [],
      visitHistory: [],
      sessionData: {
        startTime: Date.now(),
        pageViews: 1,
        scrollDepth: 0,
        clickedElements: [],
        timeOnSections: {},
        deviceInfo: this.getSafeDeviceInfo(),
        events: [],
        sections: {}
      },
      preferences: {
        preferredLanguage: 'en',
        theme: 'dark',
        animationsEnabled: true,
        contactPreference: 'email'
      }
    };
  }

  private getSafeDeviceInfo(): DeviceInfo {
    try {
      return this.getDeviceInfo();
    } catch (error) {
      console.warn('Failed to get device info, using defaults:', error);
      return {
        isMobile: false,
        screenSize: '1920x1080',
        browser: 'Unknown',
        os: 'Unknown',
        timezone: 'UTC',
        language: 'en'
      };
    }
  }

  // Check if analytics consent is granted
  private checkConsent(): boolean {
    // In a hook context, this would use useConsent()
    // For class usage, we check localStorage or get it passed in
    const consentData = localStorage.getItem('react-hook-consent');
    if (consentData) {
      try {
        const consent = JSON.parse(consentData);
        return consent.analytics === true;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Update consent state
  public updateConsentState(granted: boolean): void {
    this.consentGranted = granted;
    if (!granted) {
      // Clear analytics data if consent is revoked
      this.clearAnalyticsData();
    }
  }

  // Clear analytics data when consent is revoked
  private clearAnalyticsData(): void {
    const keys = ['user_profile', 'user_analytics_session', 'user_visit_history'];
    keys.forEach(key => localStorage.removeItem(key));
    this.profile = this.getDefaultProfile();
  }

  private getDefaultProfile(): UserProfile {
    const baseProfile: UserProfile = {
      type: 'unknown',
      source: 'unknown',
      intent: 'unknown',
      interests: [],
      searchKeywords: [],
      visitHistory: [],
      sessionData: {
        startTime: Date.now(),
        pageViews: 1,
        scrollDepth: 0,
        clickedElements: [],
        timeOnSections: {},
        deviceInfo: this.getDeviceInfo(),
        events: [],
        sections: {}
      },
      preferences: {
        preferredLanguage: navigator.language.split('-')[0] || 'en',
        theme: 'auto',
        animationsEnabled: !this.isLowEndDevice(),
        contactPreference: 'email'
      }
    };

    return baseProfile;
  }

  private detectUserContext(): void {
    try {
      // Detect source from referrer and URL parameters
      this.detectSource();
      
      // Analyze URL parameters for keywords and intent
      this.analyzeUrlParameters();
      
      // Detect user type based on behavior patterns
      this.detectUserType();
      
      // Update profile based on detection
      this.saveProfile();
    } catch (error) {
      this.handleError('detectUserContext', error);
    }
  }

  private async enhanceWithFingerprinting(): Promise<void> {
    try {
      // Get advanced fingerprint data
      const fingerprintData = advancedFingerprinter.getFingerprintSync();
      const fingerprintId = advancedFingerprinter.generateUniqueId();
      const classification = advancedFingerprinter.classifyUser();
      
      // Store fingerprint data
      this.profile.fingerprint = fingerprintData;
      this.profile.fingerprintId = fingerprintId;
      this.profile.fingerprintClassification = classification;
      
      // Enhance user type detection with fingerprint classification
      if (classification.confidence > 0.5) {
        // Map fingerprint classification to our user types
        const fingerprintUserType = this.mapFingerprintUserType(classification.userType);
        
        // If we don't have a confident user type, use fingerprint data
        if (this.profile.type === 'unknown' || classification.confidence > 0.7) {
          this.profile.type = fingerprintUserType;
        }
      }
      
      // Enhance device info with fingerprint data
      if (fingerprintData.hardware) {
        this.profile.sessionData.deviceInfo = {
          ...this.profile.sessionData.deviceInfo,
          screenSize: fingerprintData.screen?.resolution || this.profile.sessionData.deviceInfo.screenSize,
          browser: this.getBrowserFromFingerprint(fingerprintData) || this.profile.sessionData.deviceInfo.browser,
          os: fingerprintData.hardware.platform || this.profile.sessionData.deviceInfo.os,
          timezone: fingerprintData.performance?.timezone || this.profile.sessionData.deviceInfo.timezone
        };
      }
      
      // Detect bot behavior
      if (classification.userType === 'bot') {
        this.profile.type = 'unknown'; // Don't personalize for bots
        console.log('Bot detected, disabling personalization');
      }
      
      // Save enhanced profile
      this.saveProfile();
      
    } catch (error) {
      console.warn('Fingerprinting enhancement failed:', error);
    }
  }
  
  private mapFingerprintUserType(fingerprintType: string): 'job_seeker' | 'head_hunter' | 'peer_developer' | 'client' | 'unknown' {
    switch (fingerprintType) {
      case 'developer':
        return 'peer_developer';
      case 'recruiter':
        return 'head_hunter';
      case 'client':
        return 'client';
      case 'job_seeker':
        return 'job_seeker';
      default:
        return 'unknown';
    }
  }
  
  private getBrowserFromFingerprint(fingerprint: Partial<AdvancedFingerprint>): string | null {
    if (!fingerprint.browser?.userAgent) return null;
    
    const ua = fingerprint.browser.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return null;
  }

  private detectSource(): void {
    const referrer = document.referrer.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check URL parameters first (most reliable)
    const utmSource = urlParams.get('utm_source')?.toLowerCase();
    const source = urlParams.get('source')?.toLowerCase();
    const ref = urlParams.get('ref')?.toLowerCase();
    
    if (utmSource || source || ref) {
      const sourceParam = utmSource || source || ref;
      if (sourceParam?.includes('linkedin')) this.profile.source = 'linkedin';
      else if (sourceParam?.includes('github')) this.profile.source = 'github';
      else if (sourceParam?.includes('google')) this.profile.source = 'google';
      else if (sourceParam?.includes('twitter') || sourceParam?.includes('facebook')) this.profile.source = 'social';
    }
    // Fallback to referrer analysis
    else if (referrer) {
      if (referrer.includes('linkedin.com')) this.profile.source = 'linkedin';
      else if (referrer.includes('github.com')) this.profile.source = 'github';
      else if (referrer.includes('google.com') || referrer.includes('bing.com')) this.profile.source = 'google';
      else if (referrer.includes('twitter.com') || referrer.includes('facebook.com')) this.profile.source = 'social';
    } else {
      this.profile.source = 'direct';
    }

    // Extract search keywords from Google/Bing referrer (limited due to privacy)
    if (this.profile.source === 'google') {
      const keywords = urlParams.get('q') || urlParams.get('keywords') || '';
      if (keywords) {
        this.profile.searchKeywords = keywords.split(' ').filter(k => k.length > 2);
      }
    }
  }

  private analyzeUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for specific campaign parameters
    const campaign = urlParams.get('utm_campaign')?.toLowerCase();
    const medium = urlParams.get('utm_medium')?.toLowerCase();
    
    if (campaign?.includes('hiring') || medium?.includes('recruitment')) {
      this.profile.intent = 'hiring';
      this.profile.type = 'head_hunter';
    } else if (campaign?.includes('network') || medium?.includes('connect')) {
      this.profile.intent = 'networking';
    } else if (campaign?.includes('job') || medium?.includes('career')) {
      this.profile.intent = 'hiring';
      this.profile.type = 'job_seeker';
    }

    // Extract interests from URL hash
    const hash = window.location.hash.substring(1);
    if (hash && ['skills', 'projects', 'experience', 'education'].includes(hash)) {
      this.profile.interests.push(hash);
    }
  }

  private detectUserType(): void {
    const { source, searchKeywords, visitHistory } = this.profile;
    
    // LinkedIn source analysis
    if (source === 'linkedin') {
      // Check if coming from recruiter search vs job seeker activity
      const recruiterIndicators = ['talent', 'recruit', 'hiring', 'hr'];
      const jobSeekerIndicators = ['jobs', 'career', 'opportunity', 'position'];
      
      const hasRecruiterKeywords = searchKeywords.some(k => 
        recruiterIndicators.some(indicator => k.includes(indicator))
      );
      const hasJobSeekerKeywords = searchKeywords.some(k =>
        jobSeekerIndicators.some(indicator => k.includes(indicator))
      );
      
      if (hasRecruiterKeywords) this.profile.type = 'head_hunter';
      else if (hasJobSeekerKeywords) this.profile.type = 'job_seeker';
      else this.profile.type = 'peer_developer'; // Default for LinkedIn
    }
    
    // GitHub source analysis
    else if (source === 'github') {
      this.profile.type = 'peer_developer';
      this.profile.intent = 'collaboration';
    }
    
    // Google search analysis
    else if (source === 'google') {
      const hiringKeywords = ['hire', 'recruit', 'developer', 'engineer', 'portfolio', 'cv', 'resume'];
      const learningKeywords = ['tutorial', 'learn', 'example', 'code', 'project'];
      
      if (searchKeywords.some(k => hiringKeywords.includes(k))) {
        this.profile.type = 'head_hunter';
        this.profile.intent = 'hiring';
      } else if (searchKeywords.some(k => learningKeywords.includes(k))) {
        this.profile.type = 'peer_developer';
        this.profile.intent = 'learning';
      }
    }

    // Behavior analysis from visit history
    if (visitHistory.length > 0) {
      const recentVisit = visitHistory[visitHistory.length - 1];
      if (recentVisit.sectionsViewed.includes('contact') && recentVisit.timeSpent > 30000) {
        this.profile.intent = 'hiring';
      }
    }
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      browser: this.getBrowser(),
      os: this.getOS(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private isLowEndDevice(): boolean {
    return navigator.hardwareConcurrency <= 2 || 
           (navigator as any).deviceMemory <= 2 ||
           /Android.*(?:SM-|GT-|SCH-|SGH-|SPH-|SHV-|SHW-|GT-|SCH-|SGH-|SPH-|SHV-|SHW-)/i.test(navigator.userAgent);
  }

  private startTracking(): void {
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track section viewing time
    this.trackSectionViewing();
    
    // Track clicks
    this.trackClicks();
    
    // Save profile periodically
    setInterval(() => this.saveProfile(), 30000);
    
    // Save profile on page unload
    window.addEventListener('beforeunload', () => this.saveProfile());
  }

  private trackScrollDepth(): void {
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrolled > maxScroll) {
        maxScroll = scrolled;
        this.profile.sessionData.scrollDepth = Math.round(maxScroll);
      }
    });
  }

  private trackSectionViewing(): void {
    const sections = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'publications', 'certificates', 'contact'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          this.sectionStartTimes[sectionId] = Date.now();
        } else if (this.sectionStartTimes[sectionId]) {
          const timeSpent = Date.now() - this.sectionStartTimes[sectionId];
          this.profile.sessionData.timeOnSections[sectionId] = 
            (this.profile.sessionData.timeOnSections[sectionId] || 0) + timeSpent;
          delete this.sectionStartTimes[sectionId];
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
  }

  private trackClicks(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const elementId = target.id || target.className || target.tagName;
      this.profile.sessionData.clickedElements.push(`${elementId}-${Date.now()}`);
      
      // Keep only last 50 clicks to prevent memory bloat
      if (this.profile.sessionData.clickedElements.length > 50) {
        this.profile.sessionData.clickedElements.shift();
      }
    });
  }

  private saveProfile(): void {
    if (!this.checkConsent()) {
      return;
    }

    try {
      // Update visit history
      const currentVisit: VisitRecord = {
        timestamp: this.profile.sessionData.startTime,
        referrer: document.referrer,
        searchQuery: this.profile.searchKeywords.join(' '),
        timeSpent: Date.now() - this.profile.sessionData.startTime,
        sectionsViewed: Object.keys(this.profile.sessionData.timeOnSections),
        interactions: this.profile.sessionData.clickedElements.slice(-10) // Last 10 interactions
      };

      // Update or add current visit
      const existingIndex = this.profile.visitHistory.findIndex(v => v.timestamp === currentVisit.timestamp);
      if (existingIndex >= 0) {
        this.profile.visitHistory[existingIndex] = currentVisit;
      } else {
        this.profile.visitHistory.push(currentVisit);
      }

      // Keep only last 10 visits
      if (this.profile.visitHistory.length > 10) {
        this.profile.visitHistory = this.profile.visitHistory.slice(-10);
      }

      localStorage.setItem('user_profile', JSON.stringify(this.profile));
      localStorage.setItem('user_analytics_session', JSON.stringify(this.profile.sessionData));
      
      // Notify observers
      this.observers.forEach(callback => callback(this.profile));
    } catch (e) {
      console.warn('Failed to save user profile');
    }
  }

  private loadProfile(): void {
    if (!this.checkConsent()) {
      return;
    }

    try {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.profile = { ...this.getDefaultProfile(), ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user profile:', error);
      this.profile = this.getDefaultProfile();
    }
  }

  // Public methods
  public getProfile(): UserProfile {
    try {
      return { ...this.profile };
    } catch (error) {
      this.handleError('getProfile', error);
      return this.getFallbackProfile();
    }
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    try {
      if (this.fallbackMode) {
        console.warn('Cannot update profile in fallback mode');
        return;
      }
      this.profile = { ...this.profile, ...updates };
      this.saveProfile();
    } catch (error) {
      this.handleError('updateProfile', error);
    }
  }

  public onProfileUpdate(callback: (profile: UserProfile) => void): void {
    this.observers.push(callback);
  }

  public trackEvent(event: string, data?: any): void {
    if (!this.checkConsent()) {
      console.log('Analytics tracking skipped - no consent');
      return;
    }

    console.log(`Event tracked: ${event}`, data);
    // You can extend this to send to analytics services
    this.profile.sessionData.events.push({
      type: event,
      timestamp: Date.now(),
      data: data || {}
    });

    this.saveProfile();
  }

  public getPersonalizationData() {
    try {
      const { type, source, intent, interests, searchKeywords } = this.profile;
      
      return {
        primaryFocus: this.getPrimaryFocus(),
        highlightSections: this.getHighlightSections(),
        contentTone: this.getContentTone(),
        callToAction: this.getCallToAction(),
        preferredContactMethod: this.profile.preferences.contactPreference,
        showMetrics: type === 'head_hunter' || intent === 'hiring',
        emphasizeProjects: type === 'peer_developer' || source === 'github',
        showCertifications: type === 'head_hunter' || intent === 'hiring',
        industryKeywords: this.getIndustryKeywords(),
        fallbackMode: this.fallbackMode
      };
    } catch (error) {
      this.handleError('getPersonalizationData', error);
      return this.getFallbackPersonalizationData();
    }
  }

  private getFallbackPersonalizationData() {
    return {
      primaryFocus: 'balanced',
      highlightSections: ['about', 'skills', 'projects', 'contact'],
      contentTone: 'friendly' as const,
      callToAction: 'get-in-touch',
      preferredContactMethod: 'email' as const,
      showMetrics: false,
      emphasizeProjects: true,
      showCertifications: false,
      industryKeywords: ['web development', 'react', 'typescript', 'full-stack'],
      fallbackMode: true
    };
  }

  private getPrimaryFocus(): string {
    const { type, intent } = this.profile;
    if (type === 'head_hunter' || intent === 'hiring') return 'professional-achievements';
    if (type === 'peer_developer') return 'technical-skills';
    if (type === 'client') return 'business-results';
    return 'balanced';
  }

  private getHighlightSections(): string[] {
    const { type, intent, interests } = this.profile;
    
    if (type === 'head_hunter' || intent === 'hiring') {
      return ['experience', 'skills', 'education', 'certificates'];
    }
    if (type === 'peer_developer') {
      return ['projects', 'skills', 'publications'];
    }
    if (type === 'client') {
      return ['projects', 'experience', 'contact'];
    }
    
    return interests.length > 0 ? interests : ['about', 'skills', 'projects'];
  }

  private getContentTone(): 'professional' | 'technical' | 'friendly' | 'business' {
    const { type, source } = this.profile;
    
    if (type === 'head_hunter') return 'professional';
    if (type === 'peer_developer' || source === 'github') return 'technical';
    if (type === 'client') return 'business';
    return 'friendly';
  }

  private getCallToAction(): string {
    const { type, intent } = this.profile;
    
    if (type === 'head_hunter' || intent === 'hiring') return 'hire-me';
    if (type === 'peer_developer') return 'collaborate';
    if (type === 'client') return 'work-together';
    return 'get-in-touch';
  }

  private getIndustryKeywords(): string[] {
    const keywords = [...this.profile.searchKeywords];
    const techKeywords = ['react', 'typescript', 'node', 'python', 'ai', 'machine learning', 'web development'];
    
    return [...new Set([...keywords, ...techKeywords])];
  }
}

// Hook for using analytics with consent
export const useUserAnalytics = () => {
  const { consent } = useConsent();
  const analytics = new UserAnalytics();
  
  // Update consent state when it changes
  React.useEffect(() => {
    // The consent object has service IDs as properties
    const analyticsConsent = (consent as any).analytics === true;
    analytics.updateConsentState(analyticsConsent);
  }, [consent]);

  return {
    ...analytics,
    consentGranted: (consent as any).analytics === true
  };
};

// Singleton instance
export const userAnalytics = new UserAnalytics();

// Visitor detection logic
export function detectVisitorType(): { type: VisitorType; category: VisitorCategory; method: string; context: any } {
  try {
    const referrer = document.referrer?.toLowerCase() || '';
    const urlParams = new URLSearchParams(window.location.search);
    const userAgent = navigator.userAgent?.toLowerCase() || '';
  
  // UTM parameter detection
  const utmSource = urlParams.get('utm_source')?.toLowerCase();
  const utmCampaign = urlParams.get('utm_campaign')?.toLowerCase();
  
  // Referrer-based detection
  if (referrer.includes('linkedin.com')) {
    if (referrer.includes('/jobs/') || referrer.includes('/talent/')) {
      return { type: 'recruiter', category: 'professional', method: 'referrer', context: { referrer } };
    }
    return { type: 'hr_manager', category: 'professional', method: 'referrer', context: { referrer } };
  }
  
  if (referrer.includes('github.com')) {
    return { type: 'technical_lead', category: 'professional', method: 'referrer', context: { referrer } };
  }
  
  if (referrer.includes('stackoverflow.com') || referrer.includes('dev.to')) {
    return { type: 'technical_lead', category: 'professional', method: 'referrer', context: { referrer } };
  }
  
  if (referrer.includes('angel.co') || referrer.includes('crunchbase.com')) {
    return { type: 'startup_founder', category: 'business', method: 'referrer', context: { referrer } };
  }
  
  // UTM-based detection
  if (utmSource) {
    switch (utmSource) {
      case 'linkedin_recruiter':
        return { type: 'recruiter', category: 'professional', method: 'utm', context: { utm_source: utmSource } };
      case 'startup_network':
        return { type: 'startup_founder', category: 'business', method: 'utm', context: { utm_source: utmSource } };
      case 'tech_community':
        return { type: 'local_tech_community', category: 'geographic', method: 'utm', context: { utm_source: utmSource } };
      case 'remote_job_board':
        return { type: 'remote_work_advocate', category: 'geographic', method: 'utm', context: { utm_source: utmSource } };
    }
  }
  
  // Device/Platform detection
  if (userAgent.includes('mobile')) {
    return { type: 'general_visitor', category: 'general', method: 'device', context: { device: 'mobile' } };
  }
  
  // Default
  return { type: 'general_visitor', category: 'general', method: 'behavioral', context: {} };
  } catch (error) {
    console.warn('Visitor type detection failed, using fallback:', error);
    return { 
      type: 'general_visitor', 
      category: 'general', 
      method: 'fallback', 
      context: { error: error instanceof Error ? error.message : 'Unknown error' } 
    };
  }
}

// Personalized content generation
export function generatePersonalizedContent(visitorType: VisitorType, t: any, forcedGreeting?: string) {
  try {
    // Fallback to general persona if the requested one is disabled
    if (!ENABLED_PERSONAS[visitorType]) {
      visitorType = 'general_visitor';
    }
    const contentMap = {
    // Professional/Recruitment
    recruiter: {
      greeting: t('visitor.recruiter.greeting'),
      tagline: t('visitor.recruiter.tagline'),
      prioritySections: ['experience', 'skills', 'contact'],
      cta: t('visitor.recruiter.cta'),
      featuredProjects: ['enterprise', 'scalable'],
    },
    hr_manager: {
      greeting: t('visitor.hr_manager.greeting'),
      tagline: t('visitor.hr_manager.tagline'),
      prioritySections: ['about', 'values', 'experience'],
      cta: t('visitor.hr_manager.cta'),
      featuredProjects: ['team', 'collaborative'],
    },
    technical_lead: {
      greeting: t('visitor.technical_lead.greeting'),
      tagline: t('visitor.technical_lead.tagline'),
      prioritySections: ['projects', 'skills', 'architecture'],
      cta: t('visitor.technical_lead.cta'),
      featuredProjects: ['technical', 'architecture'],
    },
    c_level_executive: {
      greeting: t('visitor.c_level_executive.greeting'),
      tagline: t('visitor.c_level_executive.tagline'),
      prioritySections: ['impact', 'results', 'strategy'],
      cta: t('visitor.c_level_executive.cta'),
      featuredProjects: ['business_impact', 'strategic'],
    },
    agency_recruiter: {
      greeting: t('visitor.agency_recruiter.greeting'),
      tagline: t('visitor.agency_recruiter.tagline'),
      prioritySections: ['experience', 'availability', 'rates'],
      cta: t('visitor.agency_recruiter.cta'),
      featuredProjects: ['diverse', 'client_work'],
    },
    
    // Business/Client
    startup_founder: {
      greeting: t('visitor.startup_founder.greeting'),
      tagline: t('visitor.startup_founder.tagline'),
      prioritySections: ['innovation', 'mvp', 'scaling'],
      cta: t('visitor.startup_founder.cta'),
      featuredProjects: ['startup', 'mvp'],
    },
    product_manager: {
      greeting: t('visitor.product_manager.greeting'),
      tagline: t('visitor.product_manager.tagline'),
      prioritySections: ['product_development', 'user_experience', 'metrics'],
      cta: t('visitor.product_manager.cta'),
      featuredProjects: ['product', 'user_focused'],
    },
    project_manager: {
      greeting: t('visitor.project_manager.greeting'),
      tagline: t('visitor.project_manager.tagline'),
      prioritySections: ['delivery', 'timeline', 'communication'],
      cta: t('visitor.project_manager.cta'),
      featuredProjects: ['on_time', 'well_managed'],
    },
    business_owner: {
      greeting: t('visitor.business_owner.greeting'),
      tagline: t('visitor.business_owner.tagline'),
      prioritySections: ['solutions', 'roi', 'support'],
      cta: t('visitor.business_owner.cta'),
      featuredProjects: ['business_solutions', 'roi_focused'],
    },
    enterprise_client: {
      greeting: t('visitor.enterprise_client.greeting'),
      tagline: t('visitor.enterprise_client.tagline'),
      prioritySections: ['enterprise', 'security', 'scalability'],
      cta: t('visitor.enterprise_client.cta'),
      featuredProjects: ['enterprise', 'secure'],
    },
    
    // Geographic/Local
    local_business: {
      greeting: t('visitor.local_business.greeting'),
      tagline: t('visitor.local_business.tagline'),
      prioritySections: ['local_presence', 'community', 'support'],
      cta: t('visitor.local_business.cta'),
      featuredProjects: ['local', 'community'],
    },
    remote_work_advocate: {
      greeting: t('visitor.remote_work_advocate.greeting'),
      tagline: t('visitor.remote_work_advocate.tagline'),
      prioritySections: ['remote_experience', 'communication', 'tools'],
      cta: t('visitor.remote_work_advocate.cta'),
      featuredProjects: ['remote', 'distributed'],
    },
    international_client: {
      greeting: t('visitor.international_client.greeting'),
      tagline: t('visitor.international_client.tagline'),
      prioritySections: ['global_experience', 'timezone', 'cultural'],
      cta: t('visitor.international_client.cta'),
      featuredProjects: ['international', 'multicultural'],
    },
    local_tech_community: {
      greeting: t('visitor.local_tech_community.greeting'),
      tagline: t('visitor.local_tech_community.tagline'),
      prioritySections: ['community', 'meetups', 'knowledge_sharing'],
      cta: t('visitor.local_tech_community.cta'),
      featuredProjects: ['open_source', 'community'],
    },
    
    // General
    general_visitor: {
      greeting: t('visitor.general_visitor.greeting'),
      tagline: t('visitor.general_visitor.tagline'),
      prioritySections: ['about', 'projects', 'contact'],
      cta: t('visitor.general_visitor.cta'),
      featuredProjects: ['showcase', 'diverse'],
    },
    returning_visitor: {
      greeting: t('visitor.returning_visitor.greeting'),
      tagline: t('visitor.returning_visitor.tagline'),
      prioritySections: ['recent_updates', 'new_projects', 'contact'],
      cta: t('visitor.returning_visitor.cta'),
      featuredProjects: ['recent', 'updated'],
    },
    potential_collaborator: {
      greeting: t('visitor.potential_collaborator.greeting'),
      tagline: t('visitor.potential_collaborator.tagline'),
      prioritySections: ['collaboration', 'open_source', 'partnership'],
      cta: t('visitor.potential_collaborator.cta'),
      featuredProjects: ['collaborative', 'open_source'],
    },
  };
  
  const content = contentMap[visitorType] || contentMap.general_visitor;
  
  // Override greeting logic: if forcedGreeting provided, use it; otherwise use a unified default greeting
  content.greeting = forcedGreeting || t('visitor.general_visitor.greeting');
  
  return content;
  } catch (error) {
    console.warn('Personalized content generation failed, using fallback:', error);
    return {
      greeting: 'Hello!',
      tagline: 'Full-Stack Developer',
      prioritySections: ['about', 'skills', 'projects', 'contact'],
      cta: 'Get In Touch',
      featuredProjects: ['recent']
    };
  }
}

// Enhanced analytics with visitor profiling
export class EnhancedUserAnalytics {
  private profile: SimpleUserProfile | null = null;
  private sessionStartTime: number = Date.now();
  private interactions: number = 0;
  private sectionsViewed: Set<string> = new Set();
  private fallbackMode: boolean = false;
  private errorCount: number = 0;
  private maxErrors: number = 3;

  constructor() {
    try {
      this.initializeProfile();
      this.setupEventListeners();
    } catch (error) {
      console.warn('EnhancedUserAnalytics initialization failed, using fallback mode:', error);
      this.enableFallbackMode();
    }
  }

  private enableFallbackMode(): void {
    this.fallbackMode = true;
    this.profile = this.getFallbackProfile();
    console.info('Enhanced analytics running in fallback mode');
  }

  private handleError(context: string, error: any): void {
    this.errorCount++;
    console.warn(`Enhanced analytics error in ${context}:`, error);
    
    if (this.errorCount >= this.maxErrors && !this.fallbackMode) {
      console.warn('Too many enhanced analytics errors, switching to fallback mode');
      this.enableFallbackMode();
    }
  }

  private getFallbackProfile(): SimpleUserProfile {
    return {
      id: this.generateSessionId(),
      timestamp: Date.now(),
      visitorType: 'general_visitor',
      category: 'general',
      detectionMethod: 'behavioral',
      detectionContext: {
        userAgent: navigator.userAgent || 'Unknown'
      },
      sessionData: {
        pageViews: 1,
        timeSpent: 0,
        interactions: 0,
        sectionsViewed: [],
        deviceType: this.getDeviceType(),
        language: navigator.language?.split('-')[0] || 'en'
      },
      preferences: {
        theme: 'dark',
        language: navigator.language?.split('-')[0] || 'en',
        preferredContactMethod: 'email',
        interests: ['about', 'skills', 'projects']
      }
    };
  }

  private initializeProfile(): void {
    const detection = detectVisitorType();
    
    this.profile = {
      id: this.generateSessionId(),
      timestamp: Date.now(),
      visitorType: detection.type,
      category: detection.category,
      detectionMethod: detection.method as any,
      detectionContext: detection.context,
      sessionData: {
        pageViews: 1,
        timeSpent: 0,
        interactions: 0,
        sectionsViewed: [],
        deviceType: this.getDeviceType(),
        language: navigator.language.split('-')[0],
        location: this.getLocationData(),
      },
      preferences: {
        theme: this.getPreferredTheme(),
        language: localStorage.getItem('preferredLanguage') || 'en',
        interests: [],
      },
    };
    
    this.saveProfile();
  }

  private setupEventListeners(): void {
    // Track interactions
    document.addEventListener('click', () => this.trackInteraction('click'));
    document.addEventListener('scroll', () => this.trackInteraction('scroll'));
    
    // Track section views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.className;
          this.trackSectionView(sectionId);
        }
      });
    });
    
    document.querySelectorAll('section, .section').forEach((section) => {
      observer.observe(section);
    });
  }

  private trackInteraction(type: string): void {
    this.interactions++;
    if (this.profile) {
      this.profile.sessionData.interactions = this.interactions;
      this.saveProfile();
    }
  }

  private trackSectionView(sectionId: string): void {
    this.sectionsViewed.add(sectionId);
    if (this.profile) {
      this.profile.sessionData.sectionsViewed = Array.from(this.sectionsViewed);
      this.saveProfile();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getPreferredTheme(): 'light' | 'dark' | 'auto' {
    const saved = localStorage.getItem('theme');
    if (saved) return saved as any;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private getLocationData() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return { timezone };
    } catch {
      return undefined;
    }
  }

  private saveProfile(): void {
    if (this.profile) {
      this.profile.sessionData.timeSpent = Date.now() - this.sessionStartTime;
      localStorage.setItem('userProfile', JSON.stringify(this.profile));
    }
  }

  public getProfile(): SimpleUserProfile | null {
    try {
      return this.profile;
    } catch (error) {
      this.handleError('getProfile', error);
      return this.getFallbackProfile();
    }
  }

  public updateVisitorType(newType: VisitorType): void {
    try {
      if (this.fallbackMode) {
        console.warn('Cannot update visitor type in fallback mode');
        return;
      }
      if (this.profile) {
        this.profile.visitorType = newType;
        this.profile.detectionMethod = 'manual';
        this.saveProfile();
      }
    } catch (error) {
      this.handleError('updateVisitorType', error);
    }
  }

  public getPersonalizedContent(t: any, forcedGreeting?: string) {
    try {
      if (!this.profile) return this.getFallbackPersonalizedContent(t, forcedGreeting);
      return generatePersonalizedContent(this.profile.visitorType, t, forcedGreeting);
    } catch (error) {
      this.handleError('getPersonalizedContent', error);
      return this.getFallbackPersonalizedContent(t, forcedGreeting);
    }
  }

  private getFallbackPersonalizedContent(t: any, forcedGreeting?: string) {
    try {
      return generatePersonalizedContent('general_visitor', t, forcedGreeting);
    } catch (error) {
      console.warn('Fallback content generation failed:', error);
      return {
        greeting: 'Hello!',
        tagline: 'Full-Stack Developer',
        prioritySections: ['about', 'skills', 'projects', 'contact'],
        cta: 'Get In Touch',
        featuredProjects: ['recent']
      };
    }
  }

  public trackEvent(eventName: string, properties?: Record<string, any>): void {
    console.log('Analytics Event:', eventName, properties, this.profile);
  }
}

// Global analytics instance
export const analytics = new EnhancedUserAnalytics(); 