import React from 'react';
import './SkeletonScreen.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton component for loading placeholders
 */
export const Skeleton: React.FC = React.memo(({<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  className = '',
  variant = 'text',
  animation = 'pulse'
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (borderRadius !== undefined) {
    style.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
  } else {
    // Default border radius based on variant
    switch (variant) {
      case 'circular':
        style.borderRadius = '50%';
        break;
      case 'rounded':
        style.borderRadius = '8px';
        break;
      case 'text':
        style.borderRadius = '4px';
        break;
      case 'rectangular':
        style.borderRadius = '0';
        break;
    }
  }

  return (
    <div
      className={`skeleton skeleton-${variant} skeleton-${animation} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
});

/**
 * Skeleton for profile section
 */
export const ProfileSkeleton: React.FC = React.memo(() => (
  <div className="skeleton-profile">
    <Skeleton variant="circular" width={120} height={120} />
    <div className="skeleton-profile-content">
      <Skeleton width="60%" height={32} />
      <Skeleton width="40%" height={24} />
      <Skeleton width="80%" height={16} />
      <Skeleton width="90%" height={16} />
    </div>
  </div>
);

/**
 * Skeleton for section card
 */
export const CardSkeleton: React.FC = React.memo(({<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-card">
        <Skeleton width="100%" height={200} variant="rounded" />
        <div className="skeleton-card-content">
          <Skeleton width="70%" height={24} />
          <Skeleton width="50%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
        </div>
      </div>
    ))}
  </>
);

/**
 * Skeleton for skills section
 */
export const SkillsSkeleton: React.FC = React.memo(() => (
  <div className="skeleton-skills">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="skeleton-skill-category">
        <Skeleton width="40%" height={24} />
        <div className="skeleton-skill-items">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width={80} height={32} variant="rounded" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton for timeline (experience/education)
 */
export const TimelineSkeleton: React.FC = React.memo(({<{ count?: number }> = ({ count = 3 }) => (
  <div className="skeleton-timeline">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-timeline-item">
        <Skeleton variant="circular" width={12} height={12} />
        <div className="skeleton-timeline-content">
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="70%" height={16} />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton for project grid
 */
export const ProjectsSkeleton: React.FC = React.memo(() => (
  <div className="skeleton-projects">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="skeleton-project-card">
        <Skeleton width="100%" height={180} variant="rounded" />
        <div className="skeleton-project-content">
          <Skeleton width="80%" height={24} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <div className="skeleton-project-tags">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} width={60} height={24} variant="rounded" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Enhanced loading screen with progress
 */
export interface EnhancedLoadingScreenProps {
  progress?: number;
  stage?: string;
  onComplete?: () => void;
}

export const EnhancedLoadingScreen: React.FC = React.memo(({<EnhancedLoadingScreenProps> = ({
  progress = 0,
  stage = 'Loading...'
}) => {
  return (
    <div className="enhanced-loading-screen">
      <div className="loading-content">
        {/* Logo or Branding */}
        <div className="loading-logo">
          <div className="loading-logo-circle"></div>
          <h1 className="loading-title">Khalil Charfi</h1>
        </div>

        {/* Progress Bar */}
        <div className="loading-progress-container">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${progress}%` }}
          >
            <div className="loading-progress-shimmer"></div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="loading-percentage">{progress}%</div>

        {/* Stage Text */}
        <div className="loading-stage">{stage}</div>

        {/* Loading Animation */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
});

/**
 * Section loading placeholder
 */
export interface SectionLoadingProps {
  type: 'profile' | 'skills' | 'timeline' | 'projects' | 'cards';
  count?: number;
}

export const SectionLoading: React.FC = React.memo(({<SectionLoadingProps> = ({ type, count = 3 }) => {
  switch (type) {
    case 'profile':
      return <ProfileSkeleton />;
    case 'skills':
      return <SkillsSkeleton />;
    case 'timeline':
      return <TimelineSkeleton count={count} />;
    case 'projects':
      return <ProjectsSkeleton />;
    case 'cards':
      return <CardSkeleton count={count} />;
    default:
      return <Skeleton />;
  }
};

export default Skeleton;

