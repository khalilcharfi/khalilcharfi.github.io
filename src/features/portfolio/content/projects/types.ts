// Project Types and Interfaces
export interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
}

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'ai' | 'devops' | 'other';
export type ProjectStatus = 'completed' | 'in-progress' | 'concept';

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;     // For cards
  longDescription: string;      // For detail pages
  technologies: Technology[];
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  images: {
    thumbnail: string;
    hero: string;
    screenshots: string[];
  };
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  metrics?: {
    users?: number;
    performance?: string;
    impact?: string;
  };
  testimonials?: Testimonial[];
  startDate: string;
  endDate?: string;
  duration?: string;
  teamSize?: number;
  role?: string;
  challenges?: string[];
  achievements?: string[];
}

export interface Testimonial {
  author: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
}

export interface ProjectFilters {
  category?: ProjectCategory;
  status?: ProjectStatus;
  featured?: boolean;
  technology?: string;
}

// Project IDs for easy reference
export const PROJECT_IDS = {
  VV_VEHICLE_MANAGEMENT: 'vv-vehicle-management',
  FLUTTER_MOBILE_APP: 'flutter-mobile-app',
  IONIC_HYBRID_APP: 'ionic-hybrid-app',
  REACT_PORTFOLIO: 'react-portfolio',
  LARAVEL_API: 'laravel-api',
  VUE_DASHBOARD: 'vue-dashboard',
} as const;
