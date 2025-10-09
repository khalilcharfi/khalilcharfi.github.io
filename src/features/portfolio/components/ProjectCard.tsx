// Responsive Project Card Component - Portfolio showcase
import React, { useState } from 'react';
import type { Project } from '../content/projects';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'default',
  onClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onClick?.(project);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'concept': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'concept': return 'Concept';
      default: return status;
    }
  };

  return (
    <div 
      className={`project-card ${variant} ${project.featured ? 'featured' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View ${project.title} project details`}
    >
      {/* Project Image */}
      <div className="project-image-container">
        {!imageError ? (
          <img
            src={project.images.thumbnail}
            alt={`${project.title} project screenshot`}
            className={`project-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="project-image-placeholder">
            <div className="placeholder-icon">💼</div>
            <div className="placeholder-text">Project Image</div>
          </div>
        )}
        
        {/* Project Status Badge */}
        <div 
          className="project-status"
          style={{ backgroundColor: getStatusColor(project.status) }}
        >
          {getStatusText(project.status)}
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="project-featured">
            ⭐ Featured
          </div>
        )}

        {/* Hover Overlay */}
        <div className="project-overlay">
          <div className="project-overlay-content">
            <h3 className="project-title-overlay">{project.title}</h3>
            <p className="project-description-overlay">{project.shortDescription}</p>
            <div className="project-links-overlay">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View live demo of ${project.title}`}
                >
                  🌐 Live Demo
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View source code of ${project.title} on GitHub`}
                >
                  📁 GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="project-content">
        <div className="project-header">
          <h3 className="project-title">{project.title}</h3>
          <div className="project-category">{project.category}</div>
        </div>
        
        <p className="project-description">{project.shortDescription}</p>
        
        {/* Technologies */}
        <div className="project-technologies">
          {project.technologies.slice(0, variant === 'compact' ? 3 : 5).map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech.name}
            </span>
          ))}
          {project.technologies.length > (variant === 'compact' ? 3 : 5) && (
            <span className="tech-more">
              +{project.technologies.length - (variant === 'compact' ? 3 : 5)} more
            </span>
          )}
        </div>

        {/* Project Metrics */}
        {project.metrics && variant !== 'compact' && (
          <div className="project-metrics">
            {project.metrics.users && (
              <div className="metric">
                <span className="metric-value">{project.metrics.users.toLocaleString()}</span>
                <span className="metric-label">Users</span>
              </div>
            )}
            {project.metrics.performance && (
              <div className="metric">
                <span className="metric-value">{project.metrics.performance}</span>
                <span className="metric-label">Performance</span>
              </div>
            )}
            {project.metrics.impact && (
              <div className="metric">
                <span className="metric-value">{project.metrics.impact}</span>
                <span className="metric-label">Impact</span>
              </div>
            )}
          </div>
        )}

        {/* Project Links */}
        <div className="project-links">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-button primary"
              onClick={(e) => e.stopPropagation()}
            >
              View Live
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-button secondary"
              onClick={(e) => e.stopPropagation()}
            >
              Source Code
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .project-card {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .project-card.featured {
          border-color: rgba(102, 126, 234, 0.5);
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        }

        .project-card.compact {
          display: flex;
          align-items: center;
          padding: 1rem;
        }

        .project-card.compact .project-image-container {
          width: 80px;
          height: 80px;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .project-card.compact .project-content {
          flex: 1;
          padding: 0;
        }

        .project-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #2a2a2a;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .project-image.loaded {
          opacity: 1;
        }

        .project-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }

        .placeholder-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .placeholder-text {
          font-size: 0.875rem;
        }

        .project-status {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .project-featured {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .project-overlay {
          opacity: 1;
        }

        .project-overlay-content {
          text-align: center;
          padding: 1rem;
        }

        .project-title-overlay {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .project-description-overlay {
          color: #ccc;
          font-size: 0.875rem;
          margin: 0 0 1rem;
        }

        .project-links-overlay {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .project-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .project-link:hover {
          color: #764ba2;
        }

        .project-content {
          padding: 1.5rem;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin: 0;
          flex: 1;
        }

        .project-category {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
          margin-left: 0.75rem;
        }

        .project-description {
          color: #ccc;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0 0 1rem;
        }

        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tech-tag {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .tech-more {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .project-metrics {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }

        .metric-label {
          display: block;
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .project-links {
          display: flex;
          gap: 0.75rem;
        }

        .project-link-button {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          text-align: center;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .project-link-button.primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .project-link-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .project-link-button.secondary {
          background: transparent;
          color: #667eea;
          border: 1px solid #667eea;
        }

        .project-link-button.secondary:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .project-card {
            margin-bottom: 1rem;
          }

          .project-image-container {
            height: 180px;
          }

          .project-content {
            padding: 1rem;
          }

          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .project-category {
            margin-left: 0;
            align-self: flex-start;
          }

          .project-metrics {
            flex-direction: column;
            gap: 0.75rem;
          }

          .project-links {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .project-image-container {
            height: 160px;
          }

          .project-technologies {
            gap: 0.25rem;
          }

          .tech-tag {
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
          }
        }

        /* Compact variant specific styles */
        .project-card.compact .project-image-container {
          border-radius: 8px;
        }

        .project-card.compact .project-title {
          font-size: 1rem;
        }

        .project-card.compact .project-description {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }

        .project-card.compact .project-technologies {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
