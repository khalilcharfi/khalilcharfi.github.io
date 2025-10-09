// All Projects - Centralized exports
export * from './types';
export * from './featured';
export * from './web';
export * from './mobile';

import { webProjects } from './web';
import { mobileProjects } from './mobile';
import type { Project } from './types';

// Combine all projects
export const allProjects: Project[] = [
  ...webProjects,
  ...mobileProjects,
];

// Helper functions
export const getProjectById = (id: string): Project | undefined => 
  allProjects.find(project => project.id === id);

export const getProjectsByCategory = (category: string): Project[] => 
  allProjects.filter(project => project.category === category);

export const getFeaturedProjects = (): Project[] => 
  allProjects.filter(project => project.featured);

export const getProjectsByTechnology = (technology: string): Project[] => 
  allProjects.filter(project => 
    project.technologies.some(tech => tech.name.toLowerCase().includes(technology.toLowerCase()))
  );

export const getProjectsByStatus = (status: string): Project[] => 
  allProjects.filter(project => project.status === status);
