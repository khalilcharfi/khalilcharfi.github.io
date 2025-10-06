import React, { useEffect } from 'react';
import { useTranslation } from '@/features/i18n';
import { useDynamicContent, useSectionTracking } from '@/features/visitor-personalization';
import { Section } from '@/shared/components';
import type { SkillCategories } from '@/shared/types';

export const SkillsSection: React.FC = () => {
    const { t } = useTranslation();
    const { personalizedContent } = useDynamicContent();
    const sectionTracking = useSectionTracking('skills');
    const categories = t('skills.categories', { returnObjects: true }) as SkillCategories;

    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    return (
        <Section id="skills">
            <h2 className="section-title animate-in">{personalizedContent.skills.title}</h2>
            <div className="card-grid">
                {categories && typeof categories === 'object' && 
                    personalizedContent.skills.priorityOrder.map((categoryKey: string, index: number) => {
                        const category = categories[categoryKey];
                        if (!category) return null;
                        
                        return (
                            <div 
                                key={category.name} 
                                className="skill-category glass-panel animate-in" 
                                style={{'--stagger-index': index + 1} as React.CSSProperties}
                            >
                                <h3>{category.name}</h3>
                                <div className="skill-items-container">
                                    {Array.isArray(category.items) && category.items.map((skill: string) => (
                                        <span key={skill} className="skill-item">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </Section>
    );
};
