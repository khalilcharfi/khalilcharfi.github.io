// Skills Types and Interfaces
export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience: number;
  icon?: string;
  description?: string;
  projects?: string[]; // Project IDs where this skill was used
  certifications?: string[];
  lastUsed?: string;
}

export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'mobile' 
  | 'database' 
  | 'devops' 
  | 'cloud' 
  | 'tools' 
  | 'languages' 
  | 'soft-skills';

export type ProficiencyLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert';

export interface SkillGroup {
  category: SkillCategory;
  title: string;
  description: string;
  skills: Skill[];
  icon?: string;
}

export interface SkillFilters {
  category?: SkillCategory;
  proficiency?: ProficiencyLevel;
  minExperience?: number;
}
