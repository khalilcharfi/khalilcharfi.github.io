// All Experience - Centralized exports
export * from './types';
export * from './work';
export * from './education';

import { workExperience } from './work';
import { education } from './education';
import type { WorkExperience, Education } from './types';

// Helper functions
export const getCurrentWorkExperience = (): WorkExperience | undefined => 
  workExperience.find(exp => exp.current);

export const getWorkExperienceByCompany = (company: string): WorkExperience[] => 
  workExperience.filter(exp => 
    exp.company.toLowerCase().includes(company.toLowerCase())
  );

export const getWorkExperienceByTechnology = (technology: string): WorkExperience[] => 
  workExperience.filter(exp => 
    exp.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );

export const getEducationByInstitution = (institution: string): Education[] => 
  education.filter(edu => 
    edu.institution.toLowerCase().includes(institution.toLowerCase())
  );

export const getLatestEducation = (): Education | undefined => 
  education.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];

export { workExperience, education };
