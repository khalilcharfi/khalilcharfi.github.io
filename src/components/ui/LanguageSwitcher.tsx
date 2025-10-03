import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { translations } from '../../data/translations';

// Language Switcher Component
const flagEmojis: { [key: string]: string } = {
    en: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    ar: '🇸🇦',
};

const getBaseLang = (lang: string) => lang?.split('-')[0] || 'en';

export const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const selectLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsOpen(false);
    };

    const supportedLanguages = Object.keys(translations);
    const baseLang = getBaseLang(i18n.language);
    const currentFlag = flagEmojis[baseLang] || flagEmojis['en'] || '🌐';
    const currentLangName = t(`languageSwitcher.${baseLang}`) || t('languageSwitcher.en');

    return (
        <div className="language-switcher" ref={switcherRef}>
            <button
                className="language-switcher-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('languageSwitcher.label')}
                aria-haspopup="true"
                aria-expanded={isOpen}
                title={t('languageSwitcher.label')}
            >
                <span className="flag-emoji">{currentFlag}</span>
                <span className="lang-code">{currentLangName}</span>
                <svg className={`chevron-icon ${isOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </button>
            {isOpen && (
                <ul className="language-options">
                    {supportedLanguages.map(lang => (
                        <li key={lang}>
                            <button
                                className={`language-option ${baseLang === lang ? 'active' : ''}`}
                                onClick={() => selectLanguage(lang)}
                            >
                                <span className="flag-emoji">{flagEmojis[lang]}</span>
                                <span>{t(`languageSwitcher.${lang}`)}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

