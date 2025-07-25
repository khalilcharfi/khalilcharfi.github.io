import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VisitorType, VisitorCategory, analytics } from './userAnalytics';

interface VisitorTypeSelectorProps {
  onVisitorTypeChange?: (type: VisitorType) => void;
  className?: string;
}

const VISITOR_TYPE_CATEGORIES = {
  professional: [
    'recruiter',
    'hr_manager', 
    'technical_lead',
    'c_level_executive',
    'agency_recruiter'
  ] as VisitorType[],
  business: [
    'startup_founder',
    'product_manager',
    'project_manager', 
    'business_owner',
    'enterprise_client'
  ] as VisitorType[],
  geographic: [
    'local_business',
    'remote_work_advocate',
    'international_client',
    'local_tech_community'
  ] as VisitorType[],
  general: [
    'general_visitor',
    'returning_visitor',
    'potential_collaborator'
  ] as VisitorType[]
};

const CATEGORY_LABELS = {
  professional: 'Professional & Recruitment',
  business: 'Business & Client',
  geographic: 'Geographic & Local',
  general: 'General'
};

const VISITOR_TYPE_LABELS = {
  recruiter: 'Talent Recruiter',
  hr_manager: 'HR Manager',
  technical_lead: 'Technical Lead',
  c_level_executive: 'C-Level Executive',
  agency_recruiter: 'Agency Recruiter',
  startup_founder: 'Startup Founder',
  product_manager: 'Product Manager',
  project_manager: 'Project Manager',
  business_owner: 'Business Owner',
  enterprise_client: 'Enterprise Client',
  local_business: 'Local Business',
  remote_work_advocate: 'Remote Work Advocate',
  international_client: 'International Client',
  local_tech_community: 'Tech Community',
  general_visitor: 'General Visitor',
  returning_visitor: 'Returning Visitor',
  potential_collaborator: 'Potential Collaborator'
};

export const VisitorTypeSelector: React.FC<VisitorTypeSelectorProps> = ({
  onVisitorTypeChange,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<VisitorType>('general_visitor');

  const handleVisitorTypeSelect = (type: VisitorType) => {
    setSelectedType(type);
    analytics.updateVisitorType(type);
    onVisitorTypeChange?.(type);
    setIsOpen(false);
    
    // Track analytics event
    analytics.trackEvent('visitor_type_manually_selected', {
      visitorType: type,
      timestamp: Date.now()
    });
  };

  const getPersonalizedGreeting = () => {
    const personalizedContent = analytics.getPersonalizedContent(t);
    return personalizedContent?.greeting || t('visitor.general_visitor.greeting');
  };

  return (
    <div className={`visitor-type-selector ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="visitor-selector-trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select your visitor type for personalized content"
      >
        <span className="current-selection">
          {VISITOR_TYPE_LABELS[selectedType]}
        </span>
        <svg 
          className={`chevron ${isOpen ? 'open' : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="visitor-selector-dropdown" role="listbox">
          {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
            <div key={category} className="visitor-category">
              <div className="category-header">{label}</div>
              <div className="category-options">
                {VISITOR_TYPE_CATEGORIES[category as VisitorCategory].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleVisitorTypeSelect(type)}
                    className={`visitor-option ${selectedType === type ? 'selected' : ''}`}
                    role="option"
                    aria-selected={selectedType === type}
                  >
                    <div className="option-content">
                      <span className="option-title">
                        {VISITOR_TYPE_LABELS[type]}
                      </span>
                      <span className="option-preview">
                        {t(`visitor.${type}.tagline`)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Personalized Greeting Preview */}
      <div className="personalized-preview">
        <span className="preview-label">Current greeting:</span>
        <span className="preview-content">{getPersonalizedGreeting()}</span>
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="visitor-selector-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <style>{`
        .visitor-type-selector {
          position: relative;
          max-width: 400px;
        }

        .visitor-selector-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-secondary, #f8f9fa);
          border: 2px solid var(--border-color, #e9ecef);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary, #333);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .visitor-selector-trigger:hover {
          border-color: var(--accent-color, #007bff);
          background: var(--bg-hover, #f0f0f0);
        }

        .visitor-selector-trigger:focus {
          outline: none;
          border-color: var(--accent-color, #007bff);
          box-shadow: 0 0 0 3px var(--accent-color-alpha, rgba(0, 123, 255, 0.1));
        }

        .current-selection {
          flex: 1;
          text-align: left;
        }

        .chevron {
          transition: transform 0.2s ease;
          color: var(--text-secondary, #666);
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .visitor-selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: var(--bg-primary, #fff);
          border: 2px solid var(--border-color, #e9ecef);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }

        .visitor-category {
          border-bottom: 1px solid var(--border-light, #f0f0f0);
        }

        .visitor-category:last-child {
          border-bottom: none;
        }

        .category-header {
          padding: 12px 16px 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary, #666);
          background: var(--bg-secondary, #f8f9fa);
        }

        .category-options {
          padding: 4px 0;
        }

        .visitor-option {
          display: block;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .visitor-option:hover {
          background: var(--bg-hover, #f0f0f0);
        }

        .visitor-option.selected {
          background: var(--accent-color-light, #e3f2fd);
          color: var(--accent-color, #007bff);
        }

        .option-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-title {
          font-weight: 500;
          font-size: 14px;
          color: var(--text-primary, #333);
        }

        .option-preview {
          font-size: 12px;
          color: var(--text-secondary, #666);
          line-height: 1.3;
        }

        .visitor-option.selected .option-title {
          color: var(--accent-color, #007bff);
        }

        .personalized-preview {
          margin-top: 12px;
          padding: 12px;
          background: var(--bg-secondary, #f8f9fa);
          border-radius: 6px;
          font-size: 13px;
        }

        .preview-label {
          display: block;
          font-weight: 500;
          color: var(--text-secondary, #666);
          margin-bottom: 4px;
        }

        .preview-content {
          color: var(--text-primary, #333);
          font-style: italic;
        }

        .visitor-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .visitor-selector-trigger {
            background: var(--bg-secondary-dark, #2d3748);
            border-color: var(--border-color-dark, #4a5568);
            color: var(--text-primary-dark, #f7fafc);
          }

          .visitor-selector-dropdown {
            background: var(--bg-primary-dark, #1a202c);
            border-color: var(--border-color-dark, #4a5568);
          }

          .category-header {
            background: var(--bg-secondary-dark, #2d3748);
            color: var(--text-secondary-dark, #a0aec0);
          }

          .visitor-option:hover {
            background: var(--bg-hover-dark, #2d3748);
          }

          .personalized-preview {
            background: var(--bg-secondary-dark, #2d3748);
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .visitor-selector-dropdown {
            max-height: 300px;
          }

          .option-content {
            gap: 2px;
          }

          .option-preview {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default VisitorTypeSelector; 