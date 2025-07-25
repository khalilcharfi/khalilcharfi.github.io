// User Analytics and Context Detection System
export interface UserProfile {
  type: 'job_seeker' | 'head_hunter' | 'peer_developer' | 'client' | 'unknown';
  source: 'linkedin' | 'google' | 'github' | 'direct' | 'social' | 'unknown';
  intent: 'hiring' | 'networking' | 'collaboration' | 'learning' | 'unknown';
  interests: string[];
  searchKeywords: string[];
  visitHistory: VisitRecord[];
  sessionData: SessionData;
  preferences: UserPreferences;
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

export class UserAnalytics {
  private profile: UserProfile;
  private sectionStartTimes: { [section: string]: number } = {};
  private observers: ((profile: UserProfile) => void)[] = [];

  constructor() {
    this.profile = this.initializeProfile();
    this.detectUserContext();
    this.startTracking();
  }

  private initializeProfile(): UserProfile {
    const stored = localStorage.getItem('user_profile');
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
        deviceInfo: this.getDeviceInfo()
      },
      preferences: {
        preferredLanguage: navigator.language.split('-')[0] || 'en',
        theme: 'auto',
        animationsEnabled: !this.isLowEndDevice(),
        contactPreference: 'email'
      }
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...baseProfile, ...parsed, sessionData: baseProfile.sessionData };
      } catch (e) {
        console.warn('Failed to parse stored user profile');
      }
    }

    return baseProfile;
  }

  private detectUserContext(): void {
    // Detect source from referrer and URL parameters
    this.detectSource();
    
    // Analyze URL parameters for keywords and intent
    this.analyzeUrlParameters();
    
    // Detect user type based on behavior patterns
    this.detectUserType();
    
    // Update profile based on detection
    this.saveProfile();
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
           navigator.deviceMemory <= 2 ||
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
      
      // Notify observers
      this.observers.forEach(callback => callback(this.profile));
    } catch (e) {
      console.warn('Failed to save user profile');
    }
  }

  // Public methods
  public getProfile(): UserProfile {
    return { ...this.profile };
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    this.profile = { ...this.profile, ...updates };
    this.saveProfile();
  }

  public onProfileUpdate(callback: (profile: UserProfile) => void): void {
    this.observers.push(callback);
  }

  public trackEvent(event: string, data?: any): void {
    console.log(`Event tracked: ${event}`, data);
    // You can extend this to send to analytics services
  }

  public getPersonalizationData() {
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
      industryKeywords: this.getIndustryKeywords()
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

// Singleton instance
export const userAnalytics = new UserAnalytics(); 