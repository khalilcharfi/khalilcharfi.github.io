import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks';
import { getSectionIds } from '../../config';
import { NavLink, ThemeToggle, LanguageSwitcher } from '../../ui';
import { PrivacySettings } from '../../../features/privacy';
import { smoothScrollTo } from '../../utils';

interface NavbarProps {
    activeSection: string;
    setActiveSectionDirectly: (id: string) => void;
    theme: string;
    toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSectionDirectly, theme, toggleTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const sectionDetails = getSectionIds().map((id) => ({ id, labelKey: `nav.${id}` }));

    useEffect(() => {
        document.body.classList.toggle('mobile-menu-open', isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    const handleLinkClick = (id: string) => {
        setActiveSectionDirectly(id);
        setIsMobileMenuOpen(false);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLUListElement>) => {
        // Close menu when clicking on the backdrop (the ul element itself, not its children)
        if (e.target === e.currentTarget) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-logo">
                    <a
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('home');
                            smoothScrollTo('home');
                        }}
                        aria-label={String(t('nav.logoAlt'))}
                    >
                        {String(t('nav.logoAlt'))}
                    </a>
                </div>
                
                {/* Header controls - always visible on mobile */}
                <div className="header-controls">
                    <PrivacySettings />
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <LanguageSwitcher />
                </div>
                
                <button
                    className="nav-toggle"
                    aria-label={String(t('nav.toggleNav'))}
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                        </svg>
                    )}
                </button>
                <ul 
                    className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={handleBackdropClick}
                >
                    {sectionDetails.map(section => (
                        <NavLink
                            key={section.id}
                            href={section.id}
                            label={String(t(section.labelKey))}
                            isActive={activeSection === section.id}
                            onClick={() => handleLinkClick(section.id)}
                        />
                    ))}
                </ul>
                
                {/* Desktop controls - includes all controls */}
                <div className="desktop-controls">
                    <PrivacySettings />
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
};

