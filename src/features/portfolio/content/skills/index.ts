// All Skills - Centralized exports
export * from './types';
export * from './technical';
export * from './soft';

import { technicalSkills, skillGroups } from './technical';
import { softSkills } from './soft';
import type { Skill, SkillGroup } from './types';

// Combine all skills
export const allSkills: Skill[] = [
  ...technicalSkills,
  ...softSkills,
];

// Helper functions
export const getSkillsByCategory = (category: string): Skill[] => 
  allSkills.filter(skill => skill.category === category);

export const getSkillsByProficiency = (proficiency: string): Skill[] => 
  allSkills.filter(skill => skill.proficiency === proficiency);

export const getExpertSkills = (): Skill[] => 
  allSkills.filter(skill => skill.proficiency === 'expert');

export const getTechnicalSkills = (): Skill[] => technicalSkills;
export const getSoftSkills = (): Skill[] => softSkills;
export const getSkillGroups = (): SkillGroup[] => skillGroups;

export const getSkillsByTechnology = (technology: string): Skill[] => 
  allSkills.filter(skill => 
    skill.name.toLowerCase().includes(technology.toLowerCase())
  );
