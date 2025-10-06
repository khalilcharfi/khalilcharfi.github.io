import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/features/i18n';
import { useDynamicContent, useSectionTracking } from '@/features/visitor-personalization';
import { Section } from '@/shared/components';
import { logger } from '@/shared/utils';
import { IMAGE } from '@/shared/constants';

export const AboutSection: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent } = useDynamicContent();
    const sectionTracking = useSectionTracking('about');
    const languages = t('about.languages', { returnObjects: true }) as { lang: string; proficiency: string }[];
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('/asset/profile/profile-photo.jpg');
    const [photoRetryCount, setPhotoRetryCount] = useState(0);
    
    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    // Try to fetch profile photo from multiple sources on mount
    useEffect(() => {
        const profilePhotoUrls = [
            // Note: Direct LinkedIn CDN URLs cause CORS errors and cannot be used
            // LinkedIn blocks cross-origin image requests
            // Fallback to local asset
            '/asset/profile/profile-photo.jpg',
            '/asset/profile/profile-photo.jpeg'
        ];

        let currentIndex = 0;
        let isMounted = true;
        const img = new Image();
        const timeout = 5000; // 5 second timeout per URL
        let timeoutId: NodeJS.Timeout;
        
        const cleanup = () => {
            clearTimeout(timeoutId);
            img.onload = null;
            img.onerror = null;
            img.src = '';
        };

        const tryNextUrl = () => {
            if (!isMounted || currentIndex >= profilePhotoUrls.length) {
                // All attempts failed, use final fallback
                if (isMounted) {
                    setProfilePhotoUrl('/asset/profile/profile-photo.jpg');
                }
                return;
            }

            const url = profilePhotoUrls[currentIndex];
            
            // Set timeout for each URL attempt
            timeoutId = setTimeout(() => {
                logger.warn(`Timeout fetching profile photo from: ${url}`);
                currentIndex++;
                tryNextUrl();
            }, timeout);
            
            img.src = url;
        };

        img.onload = () => {
            if (!isMounted) return;
            clearTimeout(timeoutId);
            logger.log(`Successfully loaded profile photo from: ${img.src}`);
            setProfilePhotoUrl(img.src);
            // Cache successful URL (except local asset)
            if (!img.src.includes('/asset/')) {
                try {
                    localStorage.setItem('cached_profile_photo_url', img.src);
                    localStorage.setItem('cached_profile_photo_timestamp', Date.now().toString());
                } catch (e) {
                    logger.warn('Failed to cache profile photo URL', e);
                }
            }
        };

        img.onerror = () => {
            if (!isMounted) return;
            clearTimeout(timeoutId);
            logger.warn(`Failed to load profile photo from: ${profilePhotoUrls[currentIndex]}`);
            currentIndex++;
            tryNextUrl();
        };

        // Check cache first (valid for 7 days)
        try {
            const cachedUrl = localStorage.getItem('cached_profile_photo_url');
            const cachedTimestamp = localStorage.getItem('cached_profile_photo_timestamp');
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            
            if (cachedUrl && cachedTimestamp && 
                (Date.now() - parseInt(cachedTimestamp)) < sevenDaysMs) {
                // Try cached URL first
                profilePhotoUrls.unshift(cachedUrl);
            }
        } catch (e) {
            logger.warn('Failed to read cached profile photo URL', e);
        }

        // Start trying URLs
        tryNextUrl();

        return () => {
            isMounted = false;
            cleanup();
        };
    }, []);

    return (
        <Section id="about">
            <h2 className="section-title animate-in">{personalizedContent.about.title}</h2>
            <div className="about-content animate-in glass-panel">
                <div className="about-text">
                    <p>{personalizedContent.about.professionalSummary}</p>
                    <h3>{String(t('about.keyHighlightsTitle'))}</h3>
                    <ul>
                        {personalizedContent.about.keyHighlights.map((highlight: string, index: number) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>
                    <h3>{String(t('about.languagesTitle'))}</h3>
                    <ul>
                        {Array.isArray(languages) && languages.map((lang, index) => (
                            <li key={index}><span className="language-name">{lang.lang}:</span> {lang.proficiency}</li>
                        ))}
                    </ul>
                </div>
                <div className="about-image-container">
                    <img 
                        src={profilePhotoUrl}
                        alt="Khalil Charfi - Professional Profile" 
                        className="profile-photo"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (photoRetryCount < 2) {
                                // Try fallback to asset
                                setPhotoRetryCount(prev => prev + 1);
                                target.src = '/asset/profile/profile-photo.jpg';
                            } else if (photoRetryCount < 3) {
                                // Try another fallback
                                setPhotoRetryCount(prev => prev + 1);
                                target.src = './asset/profile/profile-photo.jpg';
                            } else {
                                // Final fallback to icon
                                target.style.display = 'none';
                                const container = target.parentElement;
                                if (container) {
                                    container.innerHTML = '<div class="about-image-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg></div>';
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </Section>
    );
};
