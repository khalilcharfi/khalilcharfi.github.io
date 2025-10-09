// Portfolio Domain Services - Centralized exports
export * from './ProjectService';
export * from './SkillService';

// Create singleton instances for easy access
import { ProjectService } from './ProjectService';
import { SkillService } from './SkillService';

export const projectService = new ProjectService();
export const skillService = new SkillService();
