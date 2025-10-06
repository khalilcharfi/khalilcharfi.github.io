import React from 'react';
import { useTranslation } from '@/features/i18n';
import { Section } from '@/shared/components';

export const EducationSection: React.FC = () => {
    const { t } = useTranslation();
    const items = t('education.items', { returnObjects: true }) as { degree: string; institution: string; date: string; details?: string }[];
    
    return (
        <Section id="education">
            <h2 className="section-title animate-in">{t('education.title')}</h2>
            <div className="timeline">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="timeline-item glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{item.degree}</h3>
                        <p className="company-date">{item.institution} | {item.date}</p>
                        {item.details && <p>{item.details}</p>}
                    </div>
                ))}
            </div>
        </Section>
    );
};
