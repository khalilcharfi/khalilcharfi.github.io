import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple Consent Context to replace react-hook-consent
const ConsentContext = createContext<{ consent: { analytics: boolean } }>({ 
    consent: { analytics: false } 
});

export const SimpleConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [consent, setConsent] = useState({ analytics: false });

    useEffect(() => {
        // Listen for vanilla-cookieconsent events
        const handleAnalyticsGranted = () => setConsent({ analytics: true });
        const handleAnalyticsDenied = () => setConsent({ analytics: false });

        window.addEventListener('cookieconsent-analytics-granted', handleAnalyticsGranted);
        window.addEventListener('cookieconsent-analytics-denied', handleAnalyticsDenied);

        return () => {
            window.removeEventListener('cookieconsent-analytics-granted', handleAnalyticsGranted);
            window.removeEventListener('cookieconsent-analytics-denied', handleAnalyticsDenied);
        };
    }, []);

    return (
        <ConsentContext.Provider value={{ consent }}>
            {children}
        </ConsentContext.Provider>
    );
};

// Export hook for compatibility
export const useConsent = () => useContext(ConsentContext);

