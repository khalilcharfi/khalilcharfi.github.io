// Experience Types and Interfaces
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  companyWebsite?: string;
  companyLogo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
  relevantCoursework?: string[];
  achievements?: string[];
  institutionWebsite?: string;
  institutionLogo?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  issuerLogo?: string;
}

export interface ExperienceFilters {
  type?: 'work' | 'education' | 'certification';
  current?: boolean;
  year?: number;
}
