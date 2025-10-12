// Personalized CTA Component - Dynamic CTAs based on visitor behavior
import React from 'react';
import { portfolioAnalytics } from '../../analytics/services/PortfolioAnalytics';
import { projectService } from '../../portfolio/domain';
import { personalInfo } from '../../portfolio/content/profile';

interface PersonalizedCTAProps {
  context?: 'hero' | 'projects' | 'skills' | 'contact' | 'footer';
  className?: string;
}

export const PersonalizedCTA: React.FC = React.memo(({<PersonalizedCTAProps> = ({
  context = 'hero',
  className = ''
}) => {
  const behavior = portfolioAnalytics.getVisitorBehavior();
  const insights = portfolioAnalytics.getPortfolioInsights();

  const getCTAsForVisitor = () => {
    switch (behavior.visitorType) {
      case 'recruiter':
        return getRecruiterCTAs();
      case 'developer':
        return getDeveloperCTAs();
      case 'client':
        return getClientCTAs();
      default:
        return getDefaultCTAs();
    }
  };

  const getRecruiterCTAs = () => {
    const ctas = [
      {
        id: 'resume',
        label: 'Download Resume',
        href: '/asset/resume.pdf',
        icon: '📄',
        priority: 'primary',
        description: 'View my complete professional background'
      },
      {
        id: 'linkedin',
        label: 'Connect on LinkedIn',
        href: personalInfo.linkedin,
        icon: '💼',
        priority: 'secondary',
        description: 'Let\'s connect professionally'
      },
      {
        id: 'contact',
        label: 'Schedule Interview',
        href: `mailto:${personalInfo.email}?subject=Interview Request`,
        icon: '📅',
        priority: 'secondary',
        description: 'Ready to discuss opportunities'
      }
    ];

    // Add project-specific CTA if they viewed projects
    if (insights.topProjects.length > 0) {
      const topProject = insights.topProjects[0];
      ctas.push({
        id: 'project-demo',
        label: `See ${topProject.title} Live`,
        href: projectService.getProjectById(topProject.projectId)?.links.live || '#',
        icon: '🚀',
        priority: 'tertiary',
        description: 'Experience the project firsthand'
      });
    }

    return ctas;
  };

  const getDeveloperCTAs = () => {
    const ctas = [
      {
        id: 'github',
        label: 'View GitHub',
        href: personalInfo.github,
        icon: '💻',
        priority: 'primary',
        description: 'Check out my code and contributions'
      },
      {
        id: 'collaborate',
        label: 'Let\'s Collaborate',
        href: `mailto:${personalInfo.email}?subject=Collaboration Opportunity`,
        icon: '🤝',
        priority: 'secondary',
        description: 'Work together on exciting projects'
      },
      {
        id: 'tech-talk',
        label: 'Tech Discussion',
        href: `mailto:${personalInfo.email}?subject=Technical Discussion`,
        icon: '💬',
        priority: 'secondary',
        description: 'Discuss technology and best practices'
      }
    ];

    // Add skill-specific CTA if they showed interest in specific skills
    if (insights.topSkills.length > 0) {
      const topSkill = insights.topSkills[0];
      ctas.push({
        id: 'skill-demo',
        label: `See ${topSkill.skillName} in Action`,
        href: '#projects',
        icon: '⚡',
        priority: 'tertiary',
        description: 'View projects using this technology'
      });
    }

    return ctas;
  };

  const getClientCTAs = () => {
    const ctas = [
      {
        id: 'start-project',
        label: 'Start a Project',
        href: `mailto:${personalInfo.email}?subject=Project Inquiry`,
        icon: '🚀',
        priority: 'primary',
        description: 'Let\'s discuss your project needs'
      },
      {
        id: 'portfolio',
        label: 'View Portfolio',
        href: '#projects',
        icon: '💼',
        priority: 'secondary',
        description: 'See more of my work and capabilities'
      },
      {
        id: 'consultation',
        label: 'Free Consultation',
        href: `mailto:${personalInfo.email}?subject=Free Consultation`,
        icon: '💡',
        priority: 'secondary',
        description: 'Get expert advice on your project'
      }
    ];

    // Add project-specific CTA if they viewed similar projects
    if (insights.topProjects.length > 0) {
      const topProject = insights.topProjects[0];
      const project = projectService.getProjectById(topProject.projectId);
      if (project?.metrics?.impact) {
        ctas.push({
          id: 'case-study',
          label: `Learn About ${project.title}`,
          href: `#project-${project.id}`,
          icon: '📊',
          priority: 'tertiary',
          description: `See how it achieved: ${project.metrics.impact}`
        });
      }
    }

    return ctas;
  };

  const getDefaultCTAs = () => {
    return [
      {
        id: 'contact',
        label: 'Get In Touch',
        href: `mailto:${personalInfo.email}`,
        icon: '📧',
        priority: 'primary',
        description: 'Let\'s start a conversation'
      },
      {
        id: 'portfolio',
        label: 'View My Work',
        href: '#projects',
        icon: '💼',
        priority: 'secondary',
        description: 'Explore my projects and skills'
      },
      {
        id: 'about',
        label: 'Learn More',
        href: '#about',
        icon: '👨‍💻',
        priority: 'secondary',
        description: 'Discover my background and expertise'
      }
    ];
  };

  const getContextualCTAs = () => {
    const allCTAs = getCTAsForVisitor();
    
    // Filter CTAs based on context
    switch (context) {
      case 'hero':
        return allCTAs.filter(cta => cta.priority === 'primary' || cta.priority === 'secondary');
      case 'projects':
        return allCTAs.filter(cta => 
          cta.id.includes('project') || 
          cta.id.includes('demo') || 
          cta.id.includes('github')
        );
      case 'skills':
        return allCTAs.filter(cta => 
          cta.id.includes('skill') || 
          cta.id.includes('collaborate') || 
          cta.id.includes('tech')
        );
      case 'contact':
        return allCTAs.filter(cta => 
          cta.id.includes('contact') || 
          cta.id.includes('email') || 
          cta.id.includes('schedule')
        );
      case 'footer':
        return allCTAs.filter(cta => cta.priority === 'secondary' || cta.priority === 'tertiary');
      default:
        return allCTAs.slice(0, 3);
    }
  };

  const handleCTAClick = (ctaId: string, ctaLabel: string) => {
    portfolioAnalytics.trackCTAClick(ctaId, context);
    
    // Track specific actions
    if (ctaId.includes('resume') || ctaId.includes('download')) {
      portfolioAnalytics.trackDownload('resume');
    } else if (ctaId.includes('contact') || ctaId.includes('email')) {
      portfolioAnalytics.trackContactAttempt('email');
    }
  };

  const ctas = getContextualCTAs();

  if (ctas.length === 0) {
    return null;
  }

  return (
    <div className={`personalized-cta ${className}`}>
      <div className="cta-container">
        {ctas.map((cta, index) => (
          <a
            key={cta.id}
            href={cta.href}
            className={`cta-button ${cta.priority} ${index === 0 ? 'primary-focus' : ''}`}
            onClick={() => handleCTAClick(cta.id, cta.label)}
            target={cta.href.startsWith('http') ? '_blank' : undefined}
            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={cta.description}
          >
            <span className="cta-icon">{cta.icon}</span>
            <span className="cta-label">{cta.label}</span>
            {cta.description && (
              <span className="cta-description">{cta.description}</span>
            )}
          </a>
        ))}
      </div>
      
      {/* Visitor type indicator (for debugging) */}
      {import.meta.env.DEV && (
        <div className="visitor-type-indicator">
          <small>
            Visitor Type: {behavior.visitorType} | 
            Engagement: {behavior.engagementLevel} | 
            Interests: {behavior.interests.slice(0, 3).join(', ')}
          </small>
        </div>
      )}

      <style jsx>{`
        .personalized-cta {
          margin: 2rem 0;
        }

        .cta-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }

        .cta-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          min-width: 140px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-button.primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .cta-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .cta-button.tertiary {
          background: transparent;
          color: #ccc;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cta-button.tertiary:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .cta-button.primary-focus {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 4px 25px rgba(102, 126, 234, 0.5); }
          100% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
        }

        .cta-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .cta-label {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .cta-description {
          font-size: 0.75rem;
          opacity: 0.8;
          line-height: 1.2;
        }

        .visitor-type-indicator {
          margin-top: 1rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          text-align: center;
        }

        .visitor-type-indicator small {
          color: #999;
          font-size: 0.7rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cta-container {
            flex-direction: column;
            gap: 0.75rem;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .cta-button {
            padding: 0.75rem 1rem;
            min-width: 120px;
          }

          .cta-icon {
            font-size: 1.25rem;
          }

          .cta-label {
            font-size: 0.8rem;
          }

          .cta-description {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalizedCTA;
