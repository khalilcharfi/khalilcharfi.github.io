import React from 'react';
import { useTranslation } from '@/features/i18n';

export const Footer: React.FC = React.memo(() => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="container">
                <p>{String(t('footer.copyright', { year }))}</p>
                <p>{String(t('footer.credits'))}</p>
            </div>
        </footer>
    );
});
