/**
 * Type definitions for skills section
 */

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface SkillCategories {
  [key: string]: SkillCategory;
}

export interface PersonalizedContent {
  home: {
    greeting: string;
    tagline: string;
    intro: string;
  };
  about: {
    title: string;
    professionalSummary: string;
    keyHighlights: string[];
  };
  skills: {
    title: string;
    priorityOrder: string[];
  };
  contact: {
    title: string;
    message: string;
  };
}

export interface VisitorTypeSelectorProps {
  onVisitorTypeChange: (newType: string) => void;
  className?: string;
}
