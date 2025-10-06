import React from 'react';
import { useTranslation } from '@/features/i18n';

export const Footer: React.FC = () => {
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
