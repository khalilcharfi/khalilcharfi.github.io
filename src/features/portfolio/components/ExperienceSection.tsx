import React from 'react';
import { useTranslation } from '@/features/i18n';
import { Section } from '@/shared/components';

export const ExperienceSection: React.FC = () => {
    const { t } = useTranslation();
    const items = t('experience.items', { returnObjects: true }) as { title: string; company: string; location: string; date: string; description: string[] }[];

    return (
        <Section id="experience">
            <h2 className="section-title animate-in">{t('experience.title')}</h2>
            <div className="timeline">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="timeline-item glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{item.title}</h3>
                        <p className="company-date">{item.company} | {item.location} | {item.date}</p>
                        <ul>
                            {item.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>
    );
};
