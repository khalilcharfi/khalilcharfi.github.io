/**
 * React Hook for Google Analytics
 * Provides easy access to GA tracking functions with consent management
 */

import { useEffect, useCallback } from 'react';
import { useConsent } from '../context/ConsentContext';
import { googleAnalytics } from '../services/googleAnalytics';

export const useGoogleAnalytics = () => {
  const { consent } = useConsent();

  // Initialize GA when consent is granted
  useEffect(() => {
    const analyticsConsent = consent.analytics;
    googleAnalytics.updateConsent(analyticsConsent);
  }, [consent.analytics]);

  // Track page view on mount
  useEffect(() => {
    if (consent.analytics) {
      googleAnalytics.pageView();
    }
  }, [consent.analytics]);

  const trackPageView = useCallback((page?: any) => {
    if (consent.analytics) {
      googleAnalytics.pageView(page);
    }
  }, [consent.analytics]);

  const trackEvent = useCallback((name: string, params?: Record<string, any>) => {
    if (consent.analytics) {
      googleAnalytics.trackEvent(name, params);
    }
  }, [consent.analytics]);

  const trackSectionView = useCallback((sectionName: string, metadata?: Record<string, any>) => {
    if (consent.analytics) {
      googleAnalytics.trackSectionView(sectionName, metadata);
    }
  }, [consent.analytics]);

  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    if (consent.analytics) {
      googleAnalytics.trackButtonClick(buttonName, location);
    }
  }, [consent.analytics]);

  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    if (consent.analytics) {
      googleAnalytics.trackFormSubmit(formName, success);
    }
  }, [consent.analytics]);

  const trackOutboundLink = useCallback((url: string, linkText: string) => {
    if (consent.analytics) {
      googleAnalytics.trackOutboundLink(url, linkText);
    }
  }, [consent.analytics]);

  const trackProjectView = useCallback((projectName: string, techStack?: string[]) => {
    if (consent.analytics) {
      googleAnalytics.trackProjectView(projectName, techStack);
    }
  }, [consent.analytics]);

  const trackCertificateView = useCallback((certificateName: string, issuer: string) => {
    if (consent.analytics) {
      googleAnalytics.trackCertificateView(certificateName, issuer);
    }
  }, [consent.analytics]);

  const trackPublicationView = useCallback((publicationTitle: string, year: number) => {
    if (consent.analytics) {
      googleAnalytics.trackPublicationView(publicationTitle, year);
    }
  }, [consent.analytics]);

  const setUserProperties = useCallback((properties: any) => {
    if (consent.analytics) {
      googleAnalytics.setUserProperties(properties);
    }
  }, [consent.analytics]);

  return {
    trackPageView,
    trackEvent,
    trackSectionView,
    trackButtonClick,
    trackFormSubmit,
    trackOutboundLink,
    trackProjectView,
    trackCertificateView,
    trackPublicationView,
    setUserProperties,
    isEnabled: consent.analytics,
  };
};

