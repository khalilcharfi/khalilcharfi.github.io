import React from 'react';
import { useTranslation } from '../../hooks';
import { SunIcon, MoonIcon } from '../../components/icons';

interface ThemeToggleProps {
    theme: string;
    toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
    const { t } = useTranslation();
    const label = theme === 'light' ? t('theme.toggleDark') : t('theme.toggleLight');
    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

