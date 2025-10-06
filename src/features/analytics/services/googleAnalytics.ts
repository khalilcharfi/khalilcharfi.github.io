/**
 * Google Analytics 4 (GA4) Integration Service
 * Free and easy-to-use analytics solution
 * 
 * Setup Instructions:
 * 1. Create a GA4 property at https://analytics.google.com
 * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 3. Add VITE_GA_MEASUREMENT_ID to your .env file or GitHub Secrets
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug: boolean;
  anonymizeIp: boolean;
  cookieFlags: string;
}

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

export interface UserProperties {
  user_type?: string;
  preferred_language?: string;
  theme?: string;
  device_type?: string;
}

class GoogleAnalyticsService {
  private config: AnalyticsConfig;
  private initialized: boolean = false;
  private consentGranted: boolean = false;
  private eventQueue: AnalyticsEvent[] = [];

  constructor(config?: Partial<AnalyticsConfig>) {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;

    this.config = {
      measurementId: config?.measurementId || measurementId,
      enabled: config?.enabled ?? isProd,
      debug: config?.debug ?? isDev,
      anonymizeIp: config?.anonymizeIp ?? true,
      cookieFlags: config?.cookieFlags || 'SameSite=None;Secure',
    };

    if (this.config.debug) {
      console.log('📊 Google Analytics initialized with config:', {
        measurementId: this.config.measurementId ? 'Set' : 'Not set',
        enabled: this.config.enabled,
        debug: this.config.debug,
      });
    }
  }

  /**
   * Initialize Google Analytics
   * This should be called once the user grants analytics consent
   */
  initialize(): void {
    if (this.initialized || !this.config.measurementId || !this.config.enabled) {
      if (this.config.debug && !this.config.measurementId) {
        console.warn('⚠️ GA Measurement ID not set. Skipping initialization.');
      }
      return;
    }

    try {
      // Create gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };

      // Configure gtag
      window.gtag('js', new Date());
      window.gtag('config', this.config.measurementId, {
        anonymize_ip: this.config.anonymizeIp,
        cookie_flags: this.config.cookieFlags,
        send_page_view: false, // We'll manually send page views for SPA
      });

      this.initialized = true;

      if (this.config.debug) {
        console.log('✅ Google Analytics initialized successfully');
      }

      // Process queued events
      this.processEventQueue();
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Update consent status
   */
  updateConsent(granted: boolean): void {
    this.consentGranted = granted;

    if (granted && !this.initialized) {
      this.initialize();
    }

    if (this.initialized && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied', // We don't use ads
      });
    }

    if (this.config.debug) {
      console.log('📊 Analytics consent updated:', granted);
    }
  }

  /**
   * Track page view (for Single Page Applications)
   */
  pageView(page: Partial<PageViewEvent> = {}): void {
    if (!this.canTrack()) {
      this.queueEvent({ name: 'page_view', params: page });
      return;
    }

    const pageData: PageViewEvent = {
      page_title: page.page_title || document.title,
      page_location: page.page_location || window.location.href,
      page_path: page.page_path || window.location.pathname,
    };

    window.gtag('event', 'page_view', pageData);

    if (this.config.debug) {
      console.log('📊 Page view tracked:', pageData);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, params?: Record<string, any>): void {
    if (!this.canTrack()) {
      this.queueEvent({ name: eventName, params });
      return;
    }

    window.gtag('event', eventName, params);

    if (this.config.debug) {
      console.log('📊 Event tracked:', eventName, params);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.canTrack()) return;

    window.gtag('set', 'user_properties', properties);

    if (this.config.debug) {
      console.log('📊 User properties set:', properties);
    }
  }

  /**
   * Track section view
   */
  trackSectionView(sectionName: string, metadata?: Record<string, any>): void {
    this.trackEvent('section_view', {
      section_name: sectionName,
      ...metadata,
    });
  }

  /**
   * Track interaction
   */
  trackInteraction(interactionType: string, element: string, metadata?: Record<string, any>): void {
    this.trackEvent('user_interaction', {
      interaction_type: interactionType,
      element_name: element,
      ...metadata,
    });
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location: string): void {
    this.trackEvent('button_click', {
      button_name: buttonName,
      location: location,
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, success: boolean): void {
    this.trackEvent('form_submit', {
      form_name: formName,
      success: success,
    });
  }

  /**
   * Track outbound link
   */
  trackOutboundLink(url: string, linkText: string): void {
    this.trackEvent('outbound_click', {
      link_url: url,
      link_text: linkText,
    });
  }

  /**
   * Track download
   */
  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
    });
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number): void {
    this.trackEvent('scroll_depth', {
      depth_percentage: depth,
    });
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(seconds: number): void {
    this.trackEvent('time_on_page', {
      time_seconds: seconds,
    });
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string): void {
    this.trackEvent('search', {
      search_term: searchTerm,
    });
  }

  /**
   * Track error
   */
  trackError(errorMessage: string, errorType: string): void {
    this.trackEvent('error', {
      error_message: errorMessage,
      error_type: errorType,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
    });
  }

  /**
   * Track project view
   */
  trackProjectView(projectName: string, techStack?: string[]): void {
    this.trackEvent('project_view', {
      project_name: projectName,
      tech_stack: techStack?.join(', '),
    });
  }

  /**
   * Track certificate view
   */
  trackCertificateView(certificateName: string, issuer: string): void {
    this.trackEvent('certificate_view', {
      certificate_name: certificateName,
      issuer: issuer,
    });
  }

  /**
   * Track publication view
   */
  trackPublicationView(publicationTitle: string, year: number): void {
    this.trackEvent('publication_view', {
      publication_title: publicationTitle,
      publication_year: year,
    });
  }

  /**
   * Check if tracking is allowed
   */
  private canTrack(): boolean {
    return this.initialized && this.consentGranted && !!window.gtag;
  }

  /**
   * Queue event for later processing
   */
  private queueEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
    if (this.config.debug) {
      console.log('📊 Event queued:', event);
    }
  }

  /**
   * Process queued events
   */
  private processEventQueue(): void {
    if (!this.canTrack() || this.eventQueue.length === 0) return;

    this.eventQueue.forEach((event) => {
      window.gtag('event', event.name, event.params);
    });

    if (this.config.debug) {
      console.log(`📊 Processed ${this.eventQueue.length} queued events`);
    }

    this.eventQueue = [];
  }

  /**
   * Reset analytics (for testing or privacy reasons)
   */
  reset(): void {
    this.initialized = false;
    this.consentGranted = false;
    this.eventQueue = [];
  }
}

// Singleton instance
export const googleAnalytics = new GoogleAnalyticsService();

// Export for testing or custom configurations
export { GoogleAnalyticsService };

// Convenience methods for direct import
export const initGA = () => googleAnalytics.initialize();
export const updateGAConsent = (granted: boolean) => googleAnalytics.updateConsent(granted);
export const trackPageView = (page?: Partial<PageViewEvent>) => googleAnalytics.pageView(page);
export const trackEvent = (name: string, params?: Record<string, any>) => googleAnalytics.trackEvent(name, params);
export const setUserProperties = (props: UserProperties) => googleAnalytics.setUserProperties(props);

