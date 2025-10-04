import React, { useState, useEffect, useRef, Suspense, useMemo, useLayoutEffect, Component, createContext, useContext, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

import './src/i18n';
import { useTranslation, useGeminiConnectionCheck, useReducedMotion, useAnnouncer } from './src/hooks';
import { CertificateItem, translations } from './src/data/translations';
import { 
  DynamicContentProvider, 
  useDynamicContent, 
  ProfileInsights, 
  useSectionTracking, 
  SHOW_VISITOR_CONTROLS, 
  SHOW_PROFILE_INSIGHTS, 
  SHOW_TRANSLATION_DEBUG, 
  SHOW_DEBUG_INFO, 
  ENABLE_CHATBOT, 
  IS_DEVELOPMENT, 
  SHOW_RECOMMENDED_SECTIONS 
} from './src/components/DynamicContent';
import { analytics } from './src/services/userAnalytics';
import { PERSONAS_FEATURE_ENABLED } from './src/config/personaSettings';
import { smoothScrollTo } from './src/utils/navigation';
import { AnimationPauseProvider, SimpleConsentProvider, useConsent, useAnimationPause } from './src/context';
import { 
  Section, 
  Navbar, 
  Chatbot,
  SkipLinks,
  UserIcon,
  AwardIcon,
  GithubIcon,
  ExternalLinkIcon,
  LinkedinIcon,
  MailIcon,
  ArrowUpIcon,
  AiChatIcon,
  SendIcon
} from './src/components';
// import { CustomCursor } from './src/components/CustomCursor'; // Disabled for now
import { LazyTranslationTest, LazyThreeBackground } from './src/utils/lazyLoading';

// WebGLErrorBoundary, PerformanceMonitor, FractalParticles, and InteractiveBackground
// have been moved to src/components/ThreeBackground.tsx for better code organization














const Home: React.FC = () => {
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

const About: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent } = useDynamicContent();
    const sectionTracking = useSectionTracking('about');
    const languages = t('about.languages', { returnObjects: true }) as { lang: string; proficiency: string }[];
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('/asset/profile-photo.jpg');
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
            '/asset/profile-photo.jpg',
            '/asset/profile-photo.jpeg'
        ];

        let currentIndex = 0;
        const img = new Image();
        const timeout = 5000; // 5 second timeout per URL
        let timeoutId: NodeJS.Timeout;
        
        const tryNextUrl = () => {
            if (currentIndex >= profilePhotoUrls.length) {
                // All attempts failed, use final fallback
                setProfilePhotoUrl('/asset/profile-photo.jpg');
                return;
            }

            const url = profilePhotoUrls[currentIndex];
            
            // Set timeout for each URL attempt
            timeoutId = setTimeout(() => {
                console.warn(`Timeout fetching profile photo from: ${url}`);
                currentIndex++;
                tryNextUrl();
            }, timeout);
            
            img.src = url;
        };

        img.onload = () => {
            clearTimeout(timeoutId);
            console.log(`Successfully loaded profile photo from: ${img.src}`);
            setProfilePhotoUrl(img.src);
            // Cache successful URL (except local asset)
            if (!img.src.includes('/asset/')) {
                try {
                    localStorage.setItem('cached_profile_photo_url', img.src);
                    localStorage.setItem('cached_profile_photo_timestamp', Date.now().toString());
                } catch (e) {
                    console.warn('Failed to cache profile photo URL', e);
                }
            }
        };

        img.onerror = () => {
            clearTimeout(timeoutId);
            console.warn(`Failed to load profile photo from: ${profilePhotoUrls[currentIndex]}`);
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
            console.warn('Failed to read cached profile photo URL', e);
        }

        // Start trying URLs
        tryNextUrl();

        return () => {
            clearTimeout(timeoutId);
            img.src = '';
        };
    }, []);

    return (
        <Section id="about">
            <h2 className="section-title animate-in">{personalizedContent.about.title}</h2>
            <div className="about-content animate-in glass-panel">
                <div className="about-text">
                    <p>{personalizedContent.about.professionalSummary}</p>
                    <h3>{t('about.keyHighlightsTitle')}</h3>
                    <ul>
                        {personalizedContent.about.keyHighlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>
                    <h3>{t('about.languagesTitle')}</h3>
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
                                target.src = '/asset/profile-photo.jpg';
                            } else if (photoRetryCount < 3) {
                                // Try another fallback
                                setPhotoRetryCount(prev => prev + 1);
                                target.src = './asset/profile-photo.jpg';
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

const Skills: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent, contentAdapter } = useDynamicContent();
    const sectionTracking = useSectionTracking('skills');
    const categories = t('skills.categories', { returnObjects: true });

    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    return (
        <Section id="skills">
            <h2 className="section-title animate-in">{personalizedContent.skills.title}</h2>
            <p className="skills-focus animate-in">
                {t('skills.focusAreasLabel')} {personalizedContent.skills.focusAreas.join(', ')}
            </p>
            <div className="card-grid">
                {categories && typeof categories === 'object' && 
                    personalizedContent.skills.priorityOrder.map((categoryKey: string, index: number) => {
                        const category = (categories as any)[categoryKey];
                        if (!category) return null;
                        
                        return (
                            <div 
                                key={category.name} 
                                className="skill-category glass-panel animate-in" 
                                style={{'--stagger-index': index + 1} as React.CSSProperties}
                            >
                                <h3>{category.name}</h3>
                                <div className="skill-items-container">
                                    {Array.isArray(category.items) && category.items.map((skill: string) => (
                                        <span key={skill} className="skill-item">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </Section>
    );
};

const Experience: React.FC = () => {
    const { t } = useTranslation();
    const items = t('experience.items', { returnObjects: true }) as { title: string; company: string; location: string; date: string; description: string[] }[];

    return (
        <Section id="experience">
            <h2 className="section-title animate-in">{t('experience.title')}</h2>
            <div className="timeline">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="timeline-item glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{item.title}</h3>
                        <p className="company-date">{item.company} | {item.location} | {item.date}</p>
                        <ul>
                            {item.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Education: React.FC = () => {
    const { t } = useTranslation();
    const items = t('education.items', { returnObjects: true }) as { degree: string; institution: string; date: string; details?: string }[];
    return (
        <Section id="education">
            <h2 className="section-title animate-in">{t('education.title')}</h2>
            <div className="timeline">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="timeline-item glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{item.degree}</h3>
                        <p className="company-date">{item.institution} | {item.date}</p>
                        {item.details && <p>{item.details}</p>}
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Projects: React.FC = () => {
    const { t } = useTranslation();
    const items = t('projects.items', { returnObjects: true }) as { title: string; description: string; tech: string[]; liveLink?: string; repoLink?: string; }[];
    return (
        <Section id="projects">
            <h2 className="section-title animate-in">{t('projects.title')}</h2>
            <div className="card-grid">
                {Array.isArray(items) && items.map((project, index) => (
                    <div key={index} className="project-card glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{project.title}</h3>
                        <p className="description">{project.description}</p>
                        <div className="tech-stack">
                            {project.tech.map((tech, i) => <span key={i}>{tech}</span>)}
                        </div>
                        <div className="project-links">
                            {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer"><ExternalLinkIcon /> {t('projects.liveDemoLabel')}</a>}
                            {project.repoLink && <a href={project.repoLink} target="_blank" rel="noopener noreferrer"><GithubIcon /> {t('projects.githubRepoLabel')}</a>}
                            {!project.liveLink && !project.repoLink && <p className="description">{t('projects.linksUnavailable')}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Publications: React.FC = () => {
    const { t } = useTranslation();
    const items = t('publications.items', { returnObjects: true }) as { title: string; authors: string; journal: string; date: string; abstract: string; link: string; viewLabel: string }[];
    return (
        <Section id="publications">
            <h2 className="section-title animate-in">{t('publications.title')}</h2>
            <div className="publication-container">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="publication-card glass-panel animate-in" style={{'--stagger-index': index + 1} as React.CSSProperties}>
                        <h3>{item.title}</h3>
                        <p className="publication-authors">{item.authors}</p>
                        <p className="publication-journal">{item.journal} - {item.date}</p>
                        <p className="publication-abstract">{item.abstract}</p>
                        <a href={item.link} className="btn" target="_blank" rel="noopener noreferrer">{item.viewLabel}</a>
                    </div>
                ))}
            </div>
        </Section>
    );
};

interface CertificatesProps {
    onCertClick: (cert: CertificateItem) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ onCertClick }) => {
    const { t } = useTranslation();
    const items = t('certificates.items', { returnObjects: true }) as CertificateItem[];

    return (
        <Section id="certificates">
            <h2 className="section-title animate-in">{t('certificates.title')}</h2>
            <div className="card-grid">
                {Array.isArray(items) && items.map((cert, index) => (
                    <div
                        key={cert.id}
                        className="certificate-card glass-panel animate-in"
                        style={{ '--stagger-index': index + 1 } as React.CSSProperties}
                        onClick={() => onCertClick(cert)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCertClick(cert)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${t('general.viewCertificate')}: ${cert.title}`}
                    >
                        <div className="certificate-image-container">
                            <img 
                                src={cert.imageUrl} 
                                alt={cert.title}
                                loading="lazy"
                                className="certificate-image"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const container = target.parentElement;
                                    if (container) {
                                        container.innerHTML = '<div class="certificate-image-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80"><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A6.75 6.75 0 0115.75 12c0 2.593-1.47 4.88-3.642 6.002a.75.75 0 00.723 1.348A8.25 8.25 0 0017.25 12c0-3.41-2.078-6.388-5.037-7.662a.75.75 0 00-.25-.052zM4.75 12A8.25 8.25 0 0112 3.75a.75.75 0 010 1.5A6.75 6.75 0 005.25 12a6.75 6.75 0 006.75 6.75.75.75 0 010 1.5A8.25 8.25 0 014.75 12z" clipRule="evenodd" /></svg></div>';
                                    }
                                }}
                            />
                        </div>
                        <div className="certificate-info">
                            <h3>{cert.title}</h3>
                            <p>{cert.issuer}</p>
                            <p className="date">{cert.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent, userProfile } = useDynamicContent();
    const sectionTracking = useSectionTracking('contact');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const nameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    // Enhanced email validation with RFC 5322 simplified regex
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    };

    // Validate individual field
    const validateField = (fieldName: 'name' | 'email' | 'message', value: string): string | undefined => {
        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    return t('contact.form.requiredError');
                }
                if (value.trim().length < 2) {
                    return t('contact.form.nameTooShort');
                }
                if (value.trim().length > 100) {
                    return t('contact.form.nameTooLong');
                }
                break;
            case 'email':
                if (!value.trim()) {
                    return t('contact.form.requiredError');
                }
                if (!validateEmail(value.trim())) {
                    return t('contact.form.emailError');
                }
                break;
            case 'message':
                if (!value.trim()) {
                    return t('contact.form.requiredError');
                }
                if (value.trim().length < 10) {
                    return t('contact.form.messageTooShort');
                }
                if (value.trim().length > 1000) {
                    return t('contact.form.messageTooLong');
                }
                break;
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: { name?: string; email?: string; message?: string } = {};

        const nameError = validateField('name', name);
        const emailError = validateField('email', email);
        const messageError = validateField('message', message);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (messageError) newErrors.message = messageError;

        setErrors(newErrors);
        setTouched({ name: true, email: true, message: true });

        // Focus first field with error
        if (nameError && nameInputRef.current) {
            nameInputRef.current.focus();
        } else if (emailError && emailInputRef.current) {
            emailInputRef.current.focus();
        } else if (messageError && messageInputRef.current) {
            messageInputRef.current.focus();
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (fieldName: 'name' | 'email' | 'message', value: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const handleResetForm = () => {
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});
        setTouched({});
        setSubmissionStatus('idle');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmissionStatus('submitting');
            setTimeout(() => {
                setSubmissionStatus('success');
            }, 1500); // Mock API call
        }
    };
    
    if (submissionStatus === 'success') {
        return (
            <Section id="contact">
                 <div className="contact-content">
                    <h2 className="section-title animate-in">{personalizedContent.contact.title}</h2>
                    <div className="contact-form-success glass-panel animate-in">
                        <h3>{t('contact.form.successTitle')}</h3>
                        <p>{t('contact.form.successMessage')}</p>
                        <button onClick={handleResetForm} className="btn">{t('contact.form.sendAnother')}</button>
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <Section id="contact">
            <div className="contact-content">
                 <h2 className="section-title animate-in">{personalizedContent.contact.title}</h2>
                 <p className="contact-intro animate-in">{personalizedContent.contact.message}</p>
                <form onSubmit={handleSubmit} className="contact-form glass-panel animate-in" noValidate>
                     <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">{t('contact.form.nameLabel')}</label>
                            <input
                                ref={nameInputRef}
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                    if (touched.name) {
                                        const error = validateField('name', e.target.value);
                                        setErrors(prev => ({ ...prev, name: error }));
                                    }
                                }}
                                onBlur={() => handleBlur('name', name)}
                                required
                                maxLength={100}
                                className={errors.name && touched.name ? 'invalid' : ''}
                                aria-invalid={!!(errors.name && touched.name)}
                                aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                                autoComplete="name"
                            />
                            {errors.name && touched.name && (
                                <p id="name-error" className="error-message" role="alert">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('contact.form.emailLabel')}</label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    if (touched.email) {
                                        const error = validateField('email', e.target.value);
                                        setErrors(prev => ({ ...prev, email: error }));
                                    }
                                }}
                                onBlur={() => handleBlur('email', email)}
                                className={errors.email && touched.email ? 'invalid' : ''}
                                aria-invalid={!!(errors.email && touched.email)}
                                aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                                required
                                autoComplete="email"
                            />
                            {errors.email && touched.email && (
                                <p id="email-error" className="error-message" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="message">{t('contact.form.messageLabel')}</label>
                        <textarea
                            ref={messageInputRef}
                            id="message"
                            name="message"
                            rows={5}
                            value={message}
                            onChange={e => {
                                setMessage(e.target.value);
                                if (touched.message) {
                                    const error = validateField('message', e.target.value);
                                    setErrors(prev => ({ ...prev, message: error }));
                                }
                            }}
                            onBlur={() => handleBlur('message', message)}
                            required
                            maxLength={1000}
                            className={errors.message && touched.message ? 'invalid' : ''}
                            aria-invalid={!!(errors.message && touched.message)}
                            aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
                        ></textarea>
                        {errors.message && touched.message && (
                            <p id="message-error" className="error-message" role="alert">
                                {errors.message}
                            </p>
                        )}
                        <small className="character-count" aria-live="polite">
                            {message.length}/1000
                        </small>
                    </div>
                    <button type="submit" className="btn" disabled={submissionStatus === 'submitting'}>
                        {submissionStatus === 'submitting' ? t('contact.form.submitting') : t('contact.form.sendBtn')}
                    </button>
                </form>
                <div className="social-links animate-in">
                    <h3>{t('contact.connectTitle')}</h3>
                    <a href="mailto:khalilcharfi8@gmail.com" aria-label={String(t('contact.emailAria'))} target="_blank" rel="noopener noreferrer"><MailIcon /></a>
                    <a href="https://www.linkedin.com/in/khalil-charfi/" aria-label={String(t('contact.linkedinAria'))} target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
                    <a href="https://github.com/khalil-charfi" aria-label={String(t('contact.githubAria'))} target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
                </div>
            </div>
        </Section>
    );
};

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container">
                <p>{t('footer.copyright', { year })}</p>
                <p>{t('footer.credits')}</p>
            </div>
        </footer>
    );
};


interface ScrollToTopProps {
  chatbotVisible: boolean;
  isVisible: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ chatbotVisible, isVisible }) => {
    const { t } = useTranslation();
    const bottom = chatbotVisible ? 95 : 25;
    return (
        <button
            type="button"
            onClick={() => smoothScrollTo('home')}
            className={`scroll-to-top${isVisible ? ' visible' : ''}`}
            aria-label={String(t('general.scrollToTop'))}
            title={String(t('general.scrollToTop'))}
            style={{ bottom }}
        >
            <ArrowUpIcon />
        </button>
    );
};

interface CertificateModalProps {
    cert: CertificateItem | null;
    onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ cert, onClose }) => {
    const { t } = useTranslation();
    const modalOverlayRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { announce } = useAnnouncer();
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Handle modal close with animation
    const handleClose = useCallback(() => {
        setIsVisible(false);
        setImageLoaded(false);
        // Wait for animation to complete before calling onClose
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    // Keyboard event handler
    useEffect(() => {
        if (!cert) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [cert, handleClose]);

    // Focus trap implementation
    useEffect(() => {
        if (!cert || !modalContentRef.current) return;

        const focusableElements = modalContentRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
    }, [cert]);

    // Body scroll lock and initial focus
    useEffect(() => {
        if (cert) {
            // Lock body scroll
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            
            // Trigger animation
            requestAnimationFrame(() => {
                setIsVisible(true);
            });

            // Focus close button after animation
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);

            // Announce to screen readers
            announce(t('general.viewCertificate') + ': ' + cert.title, 'polite');
        } else {
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [cert, announce, t]);

    if (!cert) return null;

    return (
        <div
            ref={modalOverlayRef}
            className={`modal-overlay ${isVisible ? 'modal-visible' : ''}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            aria-describedby="cert-modal-description"
        >
            <div 
                ref={modalContentRef}
                className={`modal-content ${isVisible ? 'modal-content-visible' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    ref={closeButtonRef}
                    onClick={handleClose} 
                    className="modal-close-btn" 
                    aria-label={String(t('general.closeModal'))}
                    type="button"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        width="24"
                        height="24"
                        aria-hidden="true"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                
                <div className="modal-image-container">
                    {!imageLoaded && (
                        <div className="modal-image-loading" aria-live="polite" aria-busy="true">
                            <div className="spinner"></div>
                        </div>
                    )}
                    <img 
                        src={cert.imageUrl} 
                        alt={cert.title}
                        className={`modal-image ${imageLoaded ? 'modal-image-loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Error%3C/text%3E%3C/svg%3E';
                            setImageLoaded(true);
                        }}
                    />
                </div>
                
                <div className="modal-info">
                    <h3 id="cert-modal-title" className="modal-title">{cert.title}</h3>
                    <p id="cert-modal-description" className="modal-description">
                        <span className="modal-issuer">{cert.issuer}</span>
                        <span className="modal-separator" aria-hidden="true"> • </span>
                        <span className="modal-date">{cert.date}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Performance monitoring and adaptive rendering utilities
const getBaseLang = (lang: string) => lang?.split('-')[0] || 'en';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
    const reducedMotion = useReducedMotion();
    const { announce } = useAnnouncer();
    const [activeSection, setActiveSection] = useState('home');
    const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const { 
        isAvailable: isChatbotAvailable, 
        isChecking: isChatbotChecking,
        connectionStatus,
        errorMessage,
        retryCount,
        retryConnection
    } = useGeminiConnectionCheck();
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [personalizedContent, setPersonalizedContent] = useState<any>(null);
    const [showVisitorSelector, setShowVisitorSelector] = useState(false);
    const [VisitorTypeSelector, setVisitorTypeSelector] = useState<React.ComponentType<any> | null>(null);

    // Performance optimization: Initialize on mount
    useEffect(() => {
        setIsPageLoaded(true);
        
        const loadingScreen = document.getElementById('initial-loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 300);
        }

        // Add keyboard navigation class for focus styles
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        };

        const handleMouseDown = () => {
            document.body.classList.remove('keyboard-nav');
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        
        // Apply reduced motion class if user prefers
        if (reducedMotion) {
            document.body.classList.add('reduce-motion');
        }
        
        // Initialize performance optimizations
        if (typeof window !== 'undefined') {
            import('./src/utils/performanceInit').then(module => {
                module.initializePerformanceOptimizations().catch(console.error);
            });
        }
        
        // Report performance metrics after load
        window.addEventListener('load', () => {
            setTimeout(() => {
                import('./src/utils/performanceInit').then(module => {
                    module.reportPerformanceMetrics();
                });
            }, 2000);
        });

        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const scrolled = window.scrollY > 50;
                navbar.classList.toggle('scrolled', scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [reducedMotion]);

    useLayoutEffect(() => {
        // Apply theme immediately before any paint
        const root = document.documentElement;
        const body = document.body;
        
        // Set color-scheme for native browser controls
        root.style.colorScheme = theme;
        
        // Update theme attribute
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Add transitioning class for smooth animation
        if (isThemeTransitioning) {
            // Force a reflow to ensure the class is applied
            body.offsetHeight;
            body.classList.add('theme-transitioning');
            
            const timeout = setTimeout(() => {
                body.classList.remove('theme-transitioning');
                setIsThemeTransitioning(false);
            }, 400); // Match CSS transition duration (0.4s)
            
            return () => clearTimeout(timeout);
        }
    }, [theme, isThemeTransitioning]);

    useEffect(() => {
        const lang = getBaseLang(i18n.language);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', ['ar'].includes(lang) ? 'rtl' : 'ltr');
    }, [i18n.language]);

    const toggleTheme = () => {
        // Prevent multiple rapid toggles
        if (isThemeTransitioning) return;
        
        setIsThemeTransitioning(true);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        // Use RAF to ensure smooth transition
        requestAnimationFrame(() => {
            setTheme(newTheme);
            
            // Announce theme change to screen readers
            const message = newTheme === 'light' 
                ? t('theme.changedToLight') 
                : t('theme.changedToDark');
            announce(message, 'polite');
        });
    };

    useEffect(() => {
        const seo = t('seo', { returnObjects: true }) as { title: string, description: string };
        if(seo && typeof seo.title === 'string' && typeof seo.description === 'string') {
            document.title = seo.title;
            document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.title);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description);
            document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', seo.title);
            document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', seo.description);
        }
    }, [i18n.language, t]);

    // TranslationTest is now lazy loaded via LazyTranslationTest - no need for dynamic import

    useEffect(() => {
        if (PERSONAS_FEATURE_ENABLED && SHOW_VISITOR_CONTROLS && !VisitorTypeSelector) {
            import('./src/components/VisitorTypeSelector').then((module) => {
                setVisitorTypeSelector(() => module.default);
            });
        }
    }, [VisitorTypeSelector]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-30% 0px -70% 0px', threshold: 0 }
        );
        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));
        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    const [isScrollToTopVisible, setScrollToTopVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => {
            setScrollToTopVisible(window.scrollY > 400);
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        const profile = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getProfile() : null;
        const content = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getPersonalizedContent(t) : null;
        
        if (profile && profile.visitorType !== 'general_visitor') {
            setIsPersonalized(true);
        }
        
        setPersonalizedContent(content);

        if (SHOW_RECOMMENDED_SECTIONS && analytics) {
            analytics.trackEvent('portfolio_visited', {
                language: getBaseLang(i18n.language),
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            });
        }
    }, [i18n.language, t]);

    const handleVisitorTypeChange = (newType: any) => {
        const content = SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getPersonalizedContent(t) : null;
        setPersonalizedContent(content);
        setIsPersonalized(newType !== 'general_visitor');
        
        if (SHOW_RECOMMENDED_SECTIONS && analytics) {
            analytics.trackEvent('personalized_content_updated', {
                newVisitorType: newType,
                language: getBaseLang(i18n.language)
            });
        }
    };

    return (
        <Suspense fallback={t('general.loading')}>
            <>
                {/* Custom Cursor - Disabled for now */}
                {/* <CustomCursor /> */}
                
                {/* Skip Links for Keyboard Navigation */}
                <SkipLinks />
                
                {/* Visitor Type Selector - Optional */}
                {PERSONAS_FEATURE_ENABLED && SHOW_VISITOR_CONTROLS && (
                  <div className="visitor-controls">
                      <button 
                          onClick={() => setShowVisitorSelector(!showVisitorSelector)}
                          className="visitor-toggle"
                          aria-label="Customize experience for your visitor type"
                      >
                          🎯 Personalize
                      </button>
                      
                      {showVisitorSelector && VisitorTypeSelector && (
                          <div className="visitor-selector-container">
                              <VisitorTypeSelector 
                                  onVisitorTypeChange={handleVisitorTypeChange}
                                  className="visitor-selector"
                              />
                          </div>
                      )}
                  </div>
                )}

                <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: theme === 'light' ? '#f1f5f9' : '#0a0a0a' }} />}>
                    <LazyThreeBackground theme={theme} />
                </Suspense>
                <Navbar activeSection={activeSection} setActiveSectionDirectly={setActiveSection} theme={theme} toggleTheme={toggleTheme} />
                <main id="main-content" role="main" aria-label={String(t('general.skipToMain'))}>
                    <Home />
                    <About />
                    <Skills />
                    <Projects />
                    <Experience />
                    <Education />
                    <Publications />
                    <Certificates onCertClick={setSelectedCert} />
                    <Contact />
                    {SHOW_PROFILE_INSIGHTS && <ProfileInsights chatbotOpen={isChatbotAvailable && !isChatbotChecking} scrollToTopVisible={isScrollToTopVisible} />}
                </main>
                
                {/* Translation Debug Component - Only in development */}
                {IS_DEVELOPMENT && SHOW_TRANSLATION_DEBUG && (
                    <Suspense fallback={null}>
                        <LazyTranslationTest showDebugInfo={true} />
                    </Suspense>
                )}
                <Footer />
                <ScrollToTop chatbotVisible={isChatbotAvailable && !isChatbotChecking} isVisible={isScrollToTopVisible} />
                {isChatbotAvailable && !isChatbotChecking && <Chatbot />}
                
                {/* Gemini API Connection Status Indicator - Only show in development */}
                {IS_DEVELOPMENT && (
                    <div className="gemini-connection-status" style={{
                        position: 'fixed',
                        bottom: '10px',
                        left: '10px',
                        background: connectionStatus === 'connected' ? '#2d5a2d' : 
                                   connectionStatus === 'failed' ? '#5a2d2d' : 
                                   connectionStatus === 'checking' ? '#2d4a5a' : '#5a5a5a',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        zIndex: 1000,
                        maxWidth: '300px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            Gemini API: {connectionStatus.toUpperCase()}
                        </div>
                        {errorMessage && (
                            <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>
                                {errorMessage}
                            </div>
                        )}
                        {retryCount > 0 && (
                            <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>
                                Retries: {retryCount}
                            </div>
                        )}
                        {connectionStatus === 'failed' && (
                            <button 
                                onClick={retryConnection}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}
                <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
                {PERSONAS_FEATURE_ENABLED && isPersonalized && (
                  <div className="personalization-indicator">
                    <span>🎯 Personalized for you</span>
                  </div>
                )}

                {/* Debug Info */}
                {PERSONAS_FEATURE_ENABLED && IS_DEVELOPMENT && SHOW_DEBUG_INFO && personalizedContent && (
                    <div className="debug-info">
                        <details>
                            <summary>Visitor Profile Debug</summary>
                            <pre>{JSON.stringify((SHOW_RECOMMENDED_SECTIONS && analytics ? analytics.getProfile() : {}) || {}, null, 2)}</pre>
                        </details>
                    </div>
                )}

                <style>{`
                    .visitor-controls {
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        z-index: 1000;
                    }

                    .visitor-toggle {
                        background: var(--accent-color, #007bff);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
                    }

                    .visitor-toggle:hover {
                        background: var(--accent-color-dark, #0056b3);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
                    }

                    .visitor-selector-container {
                        position: absolute;
                        top: 100%;
                        right: 0;
                        margin-top: 8px;
                        min-width: 300px;
                    }

                    .personalization-indicator {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: var(--success-color, #28a745);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 500;
                        z-index: 1000;
                        animation: slideInRight 0.5s ease-out;
                    }

                    .debug-info {
                        position: fixed;
                        bottom: 20px;
                        left: 20px;
                        background: var(--bg-primary, #fff);
                        border: 1px solid var(--border-color, #ddd);
                        border-radius: 8px;
                        padding: 12px;
                        max-width: 300px;
                        font-size: 10px;
                        z-index: 1000;
                    }

                    .debug-info details {
                        cursor: pointer;
                    }

                    .debug-info pre {
                        margin-top: 8px;
                        padding: 8px;
                        background: var(--bg-secondary, #f8f9fa);
                        border-radius: 4px;
                        overflow: auto;
                        max-height: 200px;
                    }

                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    @media (max-width: 768px) {
                        .visitor-controls {
                            top: 100px;
                            right: 10px;
                        }
                        
                        .visitor-selector-container {
                            min-width: 280px;
                            right: -20px;
                        }
                        
                        .personalization-indicator {
                            bottom: 10px;
                            right: 10px;
                            font-size: 10px;
                            padding: 6px 12px;
                        }
                    }
                `}</style>
            </>
        </Suspense>
    );
};

// ConsentContext is imported from './src/context'

const root = createRoot(document.getElementById('root')!);
root.render(
    <SimpleConsentProvider>
        <AnimationPauseProvider>
            <DynamicContentProvider>
                <App />
            </DynamicContentProvider>
        </AnimationPauseProvider>
    </SimpleConsentProvider>
 );