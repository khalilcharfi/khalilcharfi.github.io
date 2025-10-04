// SkipLinks.tsx - Skip Navigation Component for Accessibility
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface SkipLink {
  href: string;
  label: string;
}

export const SkipLinks: React.FC = () => {
  const { t } = useTranslation();

  const skipLinks: SkipLink[] = [
    { href: '#main-content', label: t('general.skipToMain') },
    { href: '#navigation', label: t('general.skipToNav') },
  ];

  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId) as HTMLElement;
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: false });
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Remove tabindex after blur to restore natural tab order
      const removeTabIndex = () => {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', removeTabIndex);
      };
      target.addEventListener('blur', removeTabIndex);
    }
  };

  return (
    <nav className="skip-links" aria-label="Skip navigation links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleSkipClick(e, link.href)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

