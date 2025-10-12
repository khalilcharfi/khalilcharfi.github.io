/**
 * SEOHead Component - Dynamic multilingual SEO meta tags
 * 
 * This component dynamically updates meta tags based on the current language
 * and page section to ensure proper multilingual SEO.
 * 
 * Features:
 * - Hreflang tags for language alternatives
 * - Language-specific Open Graph tags
 * - Canonical URLs
 * - Twitter Cards
 * - Structured data (JSON-LD)
 */

import React, { useEffect } from 'react';
import { useTranslation } from '../../i18n';

interface SEOHeadProps {
  /** Current section/page being viewed */
  currentSection?: string;
  /** Override default title */
  customTitle?: string;
  /** Override default description */
  customDescription?: string;
  /** Override default image */
  customImage?: string;
}

const SITE_URL = 'https://khalilcharfi.github.io';
const DEFAULT_IMAGE = `${SITE_URL}/asset/profile/profile-photo.jpg`;

// Supported languages with their ISO codes
const LANGUAGES = {
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  ar: 'ar-SA'
};

/**
 * Get language-specific meta descriptions
 * Uses existing translation keys from the translations file
 */
const getMetaDescriptions = (t: (key: string) => string | object): Record<string, string> => {
  const safeT = (key: string, fallback: string): string => {
    const result = t(key);
    return typeof result === 'string' ? result : fallback;
  };

  return {
    home: safeT('home.intro', 'Khalil Charfi - Full Stack Developer & Software Engineer'),
    about: safeT('about.professionalSummary', 'Learn more about Khalil Charfi - software engineer specializing in full-stack development'),
    skills: safeT('skills.title', 'Technical skills and expertise in modern web technologies'),
    projects: safeT('projects.title', 'Portfolio of software development projects'),
    experience: safeT('experience.title', 'Professional experience in software engineering'),
    education: safeT('education.title', 'Educational background and qualifications'),
    publications: safeT('publications.title', 'Research publications and academic contributions'),
    certificates: safeT('certificates.title', 'Professional certifications and achievements'),
    contact: safeT('contact.title', 'Get in touch with Khalil Charfi')
  };
};

/**
 * Update or create meta tag
 */
const updateMetaTag = (selector: string, attribute: string, content: string) => {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [attr, value] = selector.match(/\[(.*?)="(.*?)"\]/)?.slice(1, 3) || [];
    if (attr && value) {
      element.setAttribute(attr, value);
      document.head.appendChild(element);
    }
  }
  element.setAttribute(attribute, content);
};

/**
 * Update or create link tag
 */
const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang 
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    if (hreflang) {
      element.setAttribute('hreflang', hreflang);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Generate structured data (JSON-LD) for person with portfolio-specific enhancements
 */
const generateStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Khalil Charfi",
    "jobTitle": "Full-Stack Engineer",
    "description": "Full-Stack Engineer with 6+ years of experience building scalable web and mobile applications",
    "url": SITE_URL,
    "image": DEFAULT_IMAGE,
    "sameAs": [
      "https://github.com/khalil-charfi",
      "https://linkedin.com/in/khalil-charfi",
      "https://twitter.com/khalilcharfi"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Full-Stack Development",
      "Web Development",
      "Mobile Development",
      "React",
      "Vue.js",
      "TypeScript",
      "Laravel",
      "Flutter",
      "Node.js",
      "MySQL",
      "Docker"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full-Stack Engineer",
      "description": "Developing web and mobile applications using modern technologies",
      "skills": [
        "Frontend Development",
        "Backend Development",
        "Mobile Development",
        "Database Design",
        "DevOps"
      ]
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Institut Supérieur d'Informatique et de Multimédia de Sfax",
      "description": "Computer Science Master's Degree"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "ASM Software",
      "description": "Software Development Company"
    },
    "inLanguage": Object.keys(LANGUAGES),
    "nationality": "Tunisian",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tunis",
      "addressCountry": "Tunisia"
    }
  };

  // Update or create JSON-LD script
  let scriptElement = document.querySelector('script[type="application/ld+json"]');
  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptElement);
  }
  scriptElement.textContent = JSON.stringify(structuredData, null, 2);
};

/**
 * SEOHead Component
 */
export const SEOHead: React.FC<SEOHeadProps> = React.memo(({
  currentSection = 'home',
  customTitle,
  customDescription,
  customImage
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] || 'en';
  
  useEffect(() => {
    // Get section-specific descriptions
    const descriptions = getMetaDescriptions(t);
    
    // Construct title
    const siteTitle = 'Khalil Charfi';
    const sectionTitleRaw = t(`nav.${currentSection}`);
    const sectionTitle = typeof sectionTitleRaw === 'string' ? sectionTitleRaw : currentSection;
    const fullTitle = customTitle || 
      (currentSection === 'home' ? siteTitle : `${sectionTitle} | ${siteTitle}`);
    
    // Get description
    const description = customDescription || 
      descriptions[currentSection as keyof typeof descriptions] || 
      descriptions.home;
    
    // Get image
    const image = customImage || DEFAULT_IMAGE;
    
    // Current URL with language parameter
    const currentUrl = currentSection === 'home' 
      ? `${SITE_URL}/?lang=${currentLang}`
      : `${SITE_URL}/#${currentSection}?lang=${currentLang}`;
    
    // Update document title
    document.title = fullTitle;
    
    // Update basic meta tags
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="author"]', 'content', 'Khalil Charfi');
    updateMetaTag('meta[name="keywords"]', 'content', 
      'Khalil Charfi, Full-Stack Engineer, Software Engineer, Web Development, Mobile Development, React, Vue.js, TypeScript, Laravel, Flutter, Portfolio, Tunisia, Tunis');
    
    // Portfolio-specific meta tags
    updateMetaTag('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('meta[name="googlebot"]', 'content', 'index, follow');
    updateMetaTag('meta[name="theme-color"]', 'content', '#1a1a1a');
    updateMetaTag('meta[name="msapplication-TileColor"]', 'content', '#1a1a1a');
    updateMetaTag('meta[name="viewport"]', 'content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    
    // Update Open Graph tags (for social media sharing)
    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:image"]', 'content', image);
    updateMetaTag('meta[property="og:image:width"]', 'content', '1200');
    updateMetaTag('meta[property="og:image:height"]', 'content', '630');
    updateMetaTag('meta[property="og:image:alt"]', 'content', 'Khalil Charfi - Full-Stack Engineer Portfolio');
    updateMetaTag('meta[property="og:url"]', 'content', currentUrl);
    updateMetaTag('meta[property="og:type"]', 'content', 'profile');
    updateMetaTag('meta[property="og:site_name"]', 'content', 'Khalil Charfi Portfolio');
    updateMetaTag('meta[property="og:locale"]', 'content', LANGUAGES[currentLang as keyof typeof LANGUAGES]);
    updateMetaTag('meta[property="profile:first_name"]', 'content', 'Khalil');
    updateMetaTag('meta[property="profile:last_name"]', 'content', 'Charfi');
    updateMetaTag('meta[property="profile:username"]', 'content', 'khalil-charfi');
    
    // Add alternate locales for Open Graph
    Object.keys(LANGUAGES).forEach(lang => {
      if (lang !== currentLang) {
        const alternateLang = lang as keyof typeof LANGUAGES;
        updateMetaTag(
          `meta[property="og:locale:alternate"][content="${LANGUAGES[alternateLang]}"]`,
          'content',
          LANGUAGES[alternateLang]
        );
      }
    });
    
    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', image);
    updateMetaTag('meta[name="twitter:creator"]', 'content', '@khalilcharfi');
    
    // Update canonical URL
    updateLinkTag('canonical', currentSection === 'home' ? SITE_URL : `${SITE_URL}/#${currentSection}`);
    
    // Update hreflang tags for all language versions
    Object.keys(LANGUAGES).forEach(lang => {
      const url = currentSection === 'home'
        ? `${SITE_URL}/?lang=${lang}`
        : `${SITE_URL}/#${currentSection}?lang=${lang}`;
      updateLinkTag('alternate', url, lang);
    });
    
    // Add x-default hreflang (fallback language)
    const defaultUrl = currentSection === 'home' ? SITE_URL : `${SITE_URL}/#${currentSection}`;
    updateLinkTag('alternate', defaultUrl, 'x-default');
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update HTML dir attribute for RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = rtlLanguages.includes(currentLang) ? 'rtl' : 'ltr';
    
    // Generate structured data
    generateStructuredData();
    
    // Log SEO updates in development
    if (import.meta.env.DEV) {
      console.log('🔍 SEO Meta Tags Updated:', {
        title: fullTitle,
        description: description.substring(0, 100) + '...',
        language: currentLang,
        section: currentSection,
        url: currentUrl
      });
    }
  }, [currentSection, customTitle, customDescription, customImage, t, i18n.language, currentLang]);
  
  return null; // This component only manages head elements
});

export default SEOHead;
