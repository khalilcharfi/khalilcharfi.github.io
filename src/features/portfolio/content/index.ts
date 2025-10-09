// Portfolio Content - Main export file
export * from './projects';
export * from './skills';
export * from './experience';
export * from './profile';

// Re-export commonly used items for convenience
export { 
  allProjects, 
  getFeaturedProjects, 
  getProjectById,
  PROJECT_IDS 
} from './projects';

export { 
  allSkills, 
  getExpertSkills, 
  getTechnicalSkills,
  getSoftSkills,
  skillGroups 
} from './skills';

export { 
  workExperience, 
  education, 
  getCurrentWorkExperience 
} from './experience';

export { 
  personalInfo, 
  professionalSummary, 
  keyAchievements, 
  highlights 
} from './profile';
