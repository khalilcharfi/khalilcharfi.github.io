import React from 'react';
import { useTranslation } from '@/features/i18n';
import { Section } from '@/shared/components';

export const PublicationsSection: React.FC = () => {
    const { t } = useTranslation();
    const items = t('publications.items', { returnObjects: true }) as { title: string; authors: string; journal: string; date: string; abstract: string; link: string; viewLabel: string }[];
    
    return (
        <Section id="publications">
            <h2 className="section-title animate-in">{t('publications.title')}</h2>
            <div className="publication-container">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="publication-card glass-panel animate-in" style={{'--stagger-index': index + 1} as React.CSSProperties}>
                        <h3>{item.title}</h3>
                        <p className="publication-authors">{item.authors}</p>
                        <p className="publication-journal">{item.journal} - {item.date}</p>
                        <p className="publication-abstract">{item.abstract}</p>
                        <a href={item.link} className="btn" target="_blank" rel="noopener noreferrer">{item.viewLabel}</a>
                    </div>
                ))}
            </div>
        </Section>
    );
};
