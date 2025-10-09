import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Enhanced consent types
export interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
    personalization: boolean;
}

export interface PrivacySettings {
    dnt: boolean; // Do Not Track
    dataCollection: boolean;
    lastUpdated: number;
}

export interface ConsentContextValue {
    consent: ConsentState;
    privacySettings: PrivacySettings;
    updateConsent: (category: keyof ConsentState, value: boolean) => void;
    updateAllConsent: (value: boolean) => void;
    clearAllData: () => void;
    exportData: () => string;
    getStoredDataSize: () => number;
    respectedDNT: boolean;
}

const defaultConsent: ConsentState = {
    necessary: true, // Always true, can't be disabled
    analytics: false,
    functional: false,
    marketing: false,
    personalization: false
};

const defaultPrivacySettings: PrivacySettings = {
    dnt: false,
    dataCollection: true,
    lastUpdated: Date.now()
};

const ConsentContext = createContext<ConsentContextValue>({ 
    consent: defaultConsent,
    privacySettings: defaultPrivacySettings,
    updateConsent: () => {},
    updateAllConsent: () => {},
    clearAllData: () => {},
    exportData: () => '',
    getStoredDataSize: () => 0,
    respectedDNT: false
});

export const SimpleConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [consent, setConsent] = useState<ConsentState>(defaultConsent);
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
    const [respectedDNT, setRespectedDNT] = useState(false);

    // Check for Do Not Track (DNT)
    useEffect(() => {
        const dnt = navigator.doNotTrack === '1' || 
                    (window as any).doNotTrack === '1' || 
                    (navigator as any).msDoNotTrack === '1';
        
        setRespectedDNT(dnt);
        
        if (dnt) {
            setPrivacySettings(prev => ({ ...prev, dnt: true, dataCollection: false }));
            setConsent({
                necessary: true,
                analytics: false,
                functional: false,
                marketing: false,
                personalization: false
            });
        }
    }, []);

    // Listen for vanilla-cookieconsent events
    useEffect(() => {
        const handleConsentChange = (e: CustomEvent) => {
            const categories = e.detail?.cookie?.categories || [];
            setConsent(prev => ({
                ...prev,
                analytics: categories.includes('analytics'),
                functional: categories.includes('functional'),
                marketing: categories.includes('marketing'),
                personalization: categories.includes('personalization')
            }));
        };

        // Legacy event handlers for backward compatibility
        const handleAnalyticsGranted = () => setConsent(prev => ({ ...prev, analytics: true }));
        const handleAnalyticsDenied = () => setConsent(prev => ({ ...prev, analytics: false }));

        window.addEventListener('cookieconsent-analytics-granted', handleAnalyticsGranted);
        window.addEventListener('cookieconsent-analytics-denied', handleAnalyticsDenied);
        window.addEventListener('cc:onChange' as any, handleConsentChange as any);

        return () => {
            window.removeEventListener('cookieconsent-analytics-granted', handleAnalyticsGranted);
            window.removeEventListener('cookieconsent-analytics-denied', handleAnalyticsDenied);
            window.removeEventListener('cc:onChange' as any, handleConsentChange as any);
        };
    }, []);

    const updateConsent = useCallback((category: keyof ConsentState, value: boolean) => {
        if (category === 'necessary') return; // Can't change necessary
        if (respectedDNT && category !== 'necessary') return; // Respect DNT
        
        setConsent(prev => ({ ...prev, [category]: value }));
        setPrivacySettings(prev => ({ ...prev, lastUpdated: Date.now() }));
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('consent-updated', { 
            detail: { category, value } 
        }));
    }, [respectedDNT]);

    const updateAllConsent = useCallback((value: boolean) => {
        if (respectedDNT && value) return; // Can't enable if DNT is active
        
        setConsent({
            necessary: true,
            analytics: value,
            functional: value,
            marketing: value,
            personalization: value
        });
        setPrivacySettings(prev => ({ ...prev, lastUpdated: Date.now() }));
        
        window.dispatchEvent(new CustomEvent('consent-updated-all', { 
            detail: { value } 
        }));
    }, [respectedDNT]);

    const clearAllData = useCallback(() => {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('user-') || 
                key.startsWith('analytics-') || 
                key.startsWith('visitor-') ||
                key === 'userProfile' ||
                key === 'visitorFingerprint'
            )) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        window.dispatchEvent(new CustomEvent('privacy-data-cleared'));
        
        return keysToRemove.length;
    }, []);

    const exportData = useCallback(() => {
        const data: Record<string, any> = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('user-') || 
                key.startsWith('analytics-') || 
                key.startsWith('visitor-') ||
                key === 'userProfile' ||
                key === 'visitorFingerprint'
            )) {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key) || '');
                } catch {
                    data[key] = localStorage.getItem(key);
                }
            }
        }
        
        return JSON.stringify({
            exportDate: new Date().toISOString(),
            consent,
            privacySettings,
            data
        }, null, 2);
    }, [consent, privacySettings]);

    const getStoredDataSize = useCallback(() => {
        let totalSize = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('user-') || 
                key.startsWith('analytics-') || 
                key.startsWith('visitor-') ||
                key === 'userProfile' ||
                key === 'visitorFingerprint'
            )) {
                const value = localStorage.getItem(key);
                if (value) {
                    totalSize += key.length + value.length;
                }
            }
        }
        
        return totalSize; // Size in characters (approximate bytes in UTF-16)
    }, []);

    return (
        <ConsentContext.Provider value={{ 
            consent, 
            privacySettings,
            updateConsent,
            updateAllConsent,
            clearAllData,
            exportData,
            getStoredDataSize,
            respectedDNT
        }}>
            {children}
        </ConsentContext.Provider>
    );
};

// Export hook for compatibility
export const useConsent = () => useContext(ConsentContext);

