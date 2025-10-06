import React, { useEffect } from 'react';
import { useTranslation } from '@/features/i18n';
import { useDynamicContent, useSectionTracking, SHOW_RECOMMENDED_SECTIONS, IS_DEVELOPMENT } from '@/features/visitor-personalization';
import { analytics } from '@/features/analytics';
import { PERSONAS_FEATURE_ENABLED } from '@/shared/config';
import { smoothScrollTo } from '@/shared/utils';
import { Section } from '@/shared/components';

export const HomeSection: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent, userProfile, trackEvent } = useDynamicContent();
    const sectionTracking = useSectionTracking('home');
    
    const analyticsContent = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getPersonalizedContent(t) : null;
    
    useEffect(() => {
        sectionTracking.trackSectionView();
        if (SHOW_RECOMMENDED_SECTIONS && analytics) {
            analytics.trackEvent('home_section_viewed', { timestamp: Date.now() });
        }
    }, []);

    const handleCtaClick = (action: string) => {
        trackEvent('cta_clicked', { section: 'home', action });
        if (SHOW_RECOMMENDED_SECTIONS && analytics) {
            analytics.trackEvent('cta_clicked', { action, section: 'home', timestamp: Date.now() });
        }
    };

    const greeting = analyticsContent?.greeting || personalizedContent.home.greeting;
    const tagline = analyticsContent?.tagline || personalizedContent.home.tagline;
    const ctaText = analyticsContent?.cta || t('home.viewWorkBtn');

    return (
        <Section id="home">
            <p className="greeting animate-in" style={{ '--stagger-index': 1 } as React.CSSProperties}>
                {greeting}
                {userProfile.source !== 'unknown' && userProfile.source !== 'direct' && (
                    <span className="source-hint"> (from {userProfile.source})</span>
                )}
            </p>
            <h1 className="animate-in" style={{ '--stagger-index': 2 } as React.CSSProperties}>{t('home.name')}</h1>
            <p className="tagline animate-in" style={{ '--stagger-index': 3 } as React.CSSProperties}>{tagline}</p>
            <p className="intro-text animate-in" style={{ '--stagger-index': 4 } as React.CSSProperties}>{personalizedContent.home.intro}</p>
            <div className="cta-buttons animate-in" style={{ '--stagger-index': 5 } as React.CSSProperties}>
                <button className="btn" onClick={() => { handleCtaClick('viewWork'); smoothScrollTo('projects'); }}>
                    {ctaText}
                </button>
                <a 
                    href="#contact" 
                    className="btn btn-outline" 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        handleCtaClick('contact');
                        smoothScrollTo('contact'); 
                    }}
                >
                    {t('home.getInTouchBtn')}
                </a>
            </div>

            {PERSONAS_FEATURE_ENABLED && SHOW_RECOMMENDED_SECTIONS && analyticsContent?.prioritySections && analyticsContent.prioritySections.length > 0 && (
                <div className="priority-sections animate-in" style={{ '--stagger-index': 6 } as React.CSSProperties}>
                    <h3>{t('home.recommendedForYou')}</h3>
                    <div className="section-chips">
                        {analyticsContent.prioritySections.map((section: string) => (
                            <button 
                                key={section} 
                                className="section-chip"
                                onClick={() => {
                                    if (SHOW_RECOMMENDED_SECTIONS && analytics) {
                                        analytics.trackEvent('priority_section_clicked', { section });
                                    }
                                    smoothScrollTo(section);
                                }}
                            >
                                {t(`nav.${section}`) || section}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </Section>
    );
};
