import React from 'react';
import { useTranslation, CertificateItem } from '@/features/i18n';
import { Section } from '@/shared/components';

interface CertificatesSectionProps {
    onCertClick: (cert: CertificateItem) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ onCertClick }) => {
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
