// Project Domain Service - Business logic for projects
import { 
  allProjects, 
  getFeaturedProjects, 
  getProjectById,
  getProjectsByCategory,
  getProjectsByTechnology,
  type Project,
  type ProjectFilters 
} from '../content/projects';

export class ProjectService {
  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return allProjects;
  }

  /**
   * Get featured projects
   */
  getFeaturedProjects(): Project[] {
    return getFeaturedProjects();
  }

  /**
   * Get project by ID
   */
  getProjectById(id: string): Project | undefined {
    return getProjectById(id);
  }

  /**
   * Get projects by category
   */
  getProjectsByCategory(category: string): Project[] {
    return getProjectsByCategory(category);
  }

  /**
   * Get projects by technology
   */
  getProjectsByTechnology(technology: string): Project[] {
    return getProjectsByTechnology(technology);
  }

  /**
   * Filter projects based on criteria
   */
  filterProjects(filters: ProjectFilters): Project[] {
    let filteredProjects = allProjects;

    if (filters.category) {
      filteredProjects = filteredProjects.filter(p => p.category === filters.category);
    }

    if (filters.status) {
      filteredProjects = filteredProjects.filter(p => p.status === filters.status);
    }

    if (filters.featured !== undefined) {
      filteredProjects = filteredProjects.filter(p => p.featured === filters.featured);
    }

    if (filters.technology) {
      filteredProjects = filteredProjects.filter(p => 
        p.technologies.some(tech => 
          tech.name.toLowerCase().includes(filters.technology!.toLowerCase())
        )
      );
    }

    return filteredProjects;
  }

  /**
   * Get projects by visitor type (for personalization)
   */
  getProjectsForVisitorType(visitorType: string): Project[] {
    const featuredProjects = this.getFeaturedProjects();
    
    switch (visitorType) {
      case 'recruiter':
      case 'hr_manager':
        // Show projects with business impact and metrics
        return featuredProjects.filter(p => p.metrics && p.metrics.impact);
      
      case 'technical_lead':
      case 'peer_developer':
        // Show technically complex projects
        return featuredProjects.filter(p => 
          p.technologies.some(tech => tech.proficiency === 'expert')
        );
      
      case 'client':
      case 'business_owner':
        // Show projects with user metrics and business value
        return featuredProjects.filter(p => 
          p.metrics && (p.metrics.users || p.metrics.impact)
        );
      
      default:
        return featuredProjects;
    }
  }

  /**
   * Get project statistics
   */
  getProjectStatistics() {
    const projects = this.getAllProjects();
    
    return {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      byCategory: projects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalTechnologies: new Set(
        projects.flatMap(p => p.technologies.map(t => t.name))
      ).size,
    };
  }

  /**
   * Search projects by query
   */
  searchProjects(query: string): Project[] {
    const lowercaseQuery = query.toLowerCase();
    
    return allProjects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      project.technologies.some(tech => 
        tech.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  /**
   * Get related projects based on technologies
   */
  getRelatedProjects(projectId: string, limit: number = 3): Project[] {
    const project = this.getProjectById(projectId);
    if (!project) return [];

    const projectTechnologies = project.technologies.map(t => t.name);
    
    return allProjects
      .filter(p => p.id !== projectId)
      .map(p => ({
        project: p,
        commonTechnologies: p.technologies.filter(t => 
          projectTechnologies.includes(t.name)
        ).length,
      }))
      .sort((a, b) => b.commonTechnologies - a.commonTechnologies)
      .slice(0, limit)
      .map(item => item.project);
  }
}
