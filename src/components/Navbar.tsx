import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavLink, ThemeToggle, LanguageSwitcher } from './ui';
import { smoothScrollTo } from '../utils/navigation';

interface NavControls {
    theme: string;
    toggleTheme: () => void;
}

const NavControls: React.FC<NavControls> = ({ theme, toggleTheme }) => (
    <>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <LanguageSwitcher />
    </>
);

interface NavbarProps {
    activeSection: string;
    setActiveSectionDirectly: (id: string) => void;
    theme: string;
    toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSectionDirectly, theme, toggleTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const sectionDetails = [
        { id: 'home', labelKey: 'nav.home' },
        { id: 'about', labelKey: 'nav.about' },
        { id: 'skills', labelKey: 'nav.skills' },
        { id: 'projects', labelKey: 'nav.projects' },
        { id: 'experience', labelKey: 'nav.experience' },
        { id: 'education', labelKey: 'nav.education' },
        { id: 'publications', labelKey: 'nav.publications' },
        { id: 'certificates', labelKey: 'nav.certificates' },
        { id: 'contact', labelKey: 'nav.contact' }
    ];

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
                    <li className="mobile-controls">
                        <NavControls theme={theme} toggleTheme={toggleTheme} />
                    </li>
                </ul>
                <div className="desktop-controls">
                    <NavControls theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
        </nav>
    );
};

