import React from 'react';
import { useTranslation } from '@/features/i18n';
import { Section, GithubIcon, ExternalLinkIcon } from '@/shared/components';

export const ProjectsSection: React.FC = () => {
    const { t } = useTranslation();
    const items = t('projects.items', { returnObjects: true }) as { title: string; description: string; tech: string[]; liveLink?: string; repoLink?: string; }[];
    
    return (
        <Section id="projects">
            <h2 className="section-title animate-in">{t('projects.title')}</h2>
            <div className="card-grid">
                {Array.isArray(items) && items.map((project, index) => (
                    <div key={index} className="project-card glass-panel animate-in" style={{ '--stagger-index': index + 1 } as React.CSSProperties}>
                        <h3>{project.title}</h3>
                        <p className="description">{project.description}</p>
                        <div className="tech-stack">
                            {project.tech.map((tech, i) => <span key={i}>{tech}</span>)}
                        </div>
                        <div className="project-links">
                            {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer"><ExternalLinkIcon /> {t('projects.liveDemoLabel')}</a>}
                            {project.repoLink && <a href={project.repoLink} target="_blank" rel="noopener noreferrer"><GithubIcon /> {t('projects.githubRepoLabel')}</a>}
                            {!project.liveLink && !project.repoLink && <p className="description">{t('projects.linksUnavailable')}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};
