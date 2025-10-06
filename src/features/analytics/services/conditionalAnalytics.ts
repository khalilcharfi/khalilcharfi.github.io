// Conditional analytics import - tree-shaken when disabled
import { SHOW_RECOMMENDED_SECTIONS } from '../../visitor-personalization';

// Type definition for analytics to maintain type safety
interface ConditionalAnalytics {
    getPersonalizedContent?: (t: any) => any;
    trackEvent?: (event: string, data: any) => void;
    getProfile?: () => any;
}

// Conditionally import analytics
let analyticsInstance: ConditionalAnalytics = {};

if (SHOW_RECOMMENDED_SECTIONS) {
    try {
        // Direct import - this will be tree-shaken when SHOW_RECOMMENDED_SECTIONS is false
        import('../services/userAnalytics').then(module => {
            analyticsInstance = module.analytics || {};
        }).catch(error => {
            console.warn('Analytics module could not be loaded:', error);
        });
    } catch (error) {
        console.warn('Analytics module could not be loaded:', error);
    }
}

// Helper function to safely call analytics methods
export const safeAnalyticsCall = (method: keyof ConditionalAnalytics, ...args: any[]) => {
    if (SHOW_RECOMMENDED_SECTIONS && analyticsInstance[method] && typeof analyticsInstance[method] === 'function') {
        try {
            return (analyticsInstance[method] as any)(...args);
        } catch (error) {
            console.warn(`Failed to call analytics method ${String(method)}:`, error);
            return null;
        }
    }
    return null;
};