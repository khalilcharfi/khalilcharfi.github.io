// Mobile Navigation Component - Touch-optimized for portfolio
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';

interface MobileNavbarProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

export const MobileNavbar: React.FC = React.memo(({<MobileNavbarProps> = ({
  currentSection = 'home',
  onSectionChange
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation items
  const navItems = [
    { id: 'home', label: t('nav.home'), icon: '🏠' },
    { id: 'about', label: t('nav.about'), icon: '👨‍💻' },
    { id: 'skills', label: t('nav.skills'), icon: '🛠️' },
    { id: 'projects', label: t('nav.projects'), icon: '💼' },
    { id: 'experience', label: t('nav.experience'), icon: '📈' },
    { id: 'contact', label: t('nav.contact'), icon: '📧' }
  ];

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section change
  const handleSectionClick = (sectionId: string) => {
    setIsOpen(false);
    onSectionChange?.(sectionId);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const diff = startY - currentY;
      
      // Swipe up to close menu
      if (diff > 50) {
        setIsOpen(false);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <>
      {/* Mobile Header */}
      <header 
        className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}
        onTouchStart={handleTouchStart}
      >
        <div className="mobile-header-content">
          {/* Logo */}
          <div className="mobile-logo">
            <span className="logo-text">KC</span>
          </div>
          
          {/* Hamburger Menu */}
          <button
            className={`hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <div className="mobile-nav-header">
            <h2 className="mobile-nav-title">Navigation</h2>
            <button
              className="mobile-nav-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>
          
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="mobile-nav-item">
                <button
                  className={`mobile-nav-link ${currentSection === item.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(item.id)}
                  aria-current={currentSection === item.id ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {currentSection === item.id && (
                    <span className="nav-indicator">→</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          
          {/* Mobile Contact Info */}
          <div className="mobile-nav-footer">
            <div className="mobile-contact-info">
              <p className="contact-text">Let's work together!</p>
              <div className="mobile-social-links">
                <a 
                  href="https://github.com/khalil-charfi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub Profile"
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/khalil-charfi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn Profile"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="mobile-nav-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <style jsx>{`
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(26, 26, 26, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-header.scrolled {
          background: rgba(26, 26, 26, 0.98);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          max-width: 100%;
        }

        .mobile-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
        }

        .logo-text {
          background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 2rem;
          height: 2rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }

        .hamburger-line {
          width: 2rem;
          height: 0.25rem;
          background: #fff;
          border-radius: 10px;
          transition: all 0.3s linear;
          position: relative;
          transform-origin: 1px;
        }

        .hamburger.open .hamburger-line:first-child {
          transform: rotate(45deg);
        }

        .hamburger.open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }

        .hamburger.open .hamburger-line:last-child {
          transform: rotate(-45deg);
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-nav-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-nav {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          height: 100%;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 2rem 0;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .mobile-nav-overlay.open .mobile-nav {
          transform: translateX(0);
        }

        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-nav-title {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .mobile-nav-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s ease;
        }

        .mobile-nav-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-nav-list {
          list-style: none;
          padding: 0;
          margin: 2rem 0;
        }

        .mobile-nav-item {
          margin: 0;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem 2rem;
          background: none;
          border: none;
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .mobile-nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .mobile-nav-link.active {
          background: rgba(102, 126, 234, 0.2);
          border-right: 3px solid #667eea;
        }

        .nav-icon {
          font-size: 1.25rem;
          margin-right: 1rem;
          width: 1.5rem;
          text-align: center;
        }

        .nav-label {
          flex: 1;
          font-weight: 500;
        }

        .nav-indicator {
          color: #667eea;
          font-weight: bold;
        }

        .mobile-nav-footer {
          padding: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }

        .mobile-contact-info {
          text-align: center;
        }

        .contact-text {
          color: #fff;
          margin: 0 0 1rem;
          font-size: 0.9rem;
        }

        .mobile-social-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .social-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .social-link:hover {
          color: #764ba2;
        }

        .mobile-nav-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
        }

        /* Responsive adjustments */
        @media (min-width: 768px) {
          .mobile-header {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .mobile-nav {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default MobileNavbar;
