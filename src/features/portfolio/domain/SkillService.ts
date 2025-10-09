// Skill Domain Service - Business logic for skills
import { 
  allSkills, 
  getExpertSkills, 
  getTechnicalSkills,
  getSoftSkills,
  getSkillsByCategory,
  getSkillsByProficiency,
  skillGroups,
  type Skill,
  type SkillGroup,
  type SkillFilters 
} from '../content/skills';

export class SkillService {
  /**
   * Get all skills
   */
  getAllSkills(): Skill[] {
    return allSkills;
  }

  /**
   * Get expert-level skills
   */
  getExpertSkills(): Skill[] {
    return getExpertSkills();
  }

  /**
   * Get technical skills only
   */
  getTechnicalSkills(): Skill[] {
    return getTechnicalSkills();
  }

  /**
   * Get soft skills only
   */
  getSoftSkills(): Skill[] {
    return getSoftSkills();
  }

  /**
   * Get skills by category
   */
  getSkillsByCategory(category: string): Skill[] {
    return getSkillsByCategory(category);
  }

  /**
   * Get skills by proficiency level
   */
  getSkillsByProficiency(proficiency: string): Skill[] {
    return getSkillsByProficiency(proficiency);
  }

  /**
   * Get skill groups for organized display
   */
  getSkillGroups(): SkillGroup[] {
    return skillGroups;
  }

  /**
   * Filter skills based on criteria
   */
  filterSkills(filters: SkillFilters): Skill[] {
    let filteredSkills = allSkills;

    if (filters.category) {
      filteredSkills = filteredSkills.filter(s => s.category === filters.category);
    }

    if (filters.proficiency) {
      filteredSkills = filteredSkills.filter(s => s.proficiency === filters.proficiency);
    }

    if (filters.minExperience) {
      filteredSkills = filteredSkills.filter(s => s.yearsOfExperience >= filters.minExperience!);
    }

    return filteredSkills;
  }

  /**
   * Get skills for visitor type (for personalization)
   */
  getSkillsForVisitorType(visitorType: string): Skill[] {
    const expertSkills = this.getExpertSkills();
    
    switch (visitorType) {
      case 'recruiter':
      case 'hr_manager':
        // Show leadership and business skills
        return allSkills.filter(s => 
          s.category === 'soft-skills' || 
          (s.category === 'frontend' && s.proficiency === 'expert')
        );
      
      case 'technical_lead':
      case 'peer_developer':
        // Show technical expertise
        return expertSkills.filter(s => 
          ['frontend', 'backend', 'mobile', 'database', 'devops'].includes(s.category)
        );
      
      case 'client':
      case 'business_owner':
        // Show business-relevant skills
        return allSkills.filter(s => 
          s.category === 'soft-skills' || 
          s.name.toLowerCase().includes('management') ||
          s.name.toLowerCase().includes('leadership')
        );
      
      default:
        return expertSkills;
    }
  }

  /**
   * Get skill statistics
   */
  getSkillStatistics() {
    const skills = this.getAllSkills();
    
    return {
      total: skills.length,
      expert: skills.filter(s => s.proficiency === 'expert').length,
      advanced: skills.filter(s => s.proficiency === 'advanced').length,
      intermediate: skills.filter(s => s.proficiency === 'intermediate').length,
      beginner: skills.filter(s => s.proficiency === 'beginner').length,
      byCategory: skills.reduce((acc, skill) => {
        acc[skill.category] = (acc[skill.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageExperience: skills.reduce((sum, skill) => sum + skill.yearsOfExperience, 0) / skills.length,
      totalTechnologies: new Set(skills.map(s => s.name)).size,
    };
  }

  /**
   * Search skills by query
   */
  searchSkills(query: string): Skill[] {
    const lowercaseQuery = query.toLowerCase();
    
    return allSkills.filter(skill => 
      skill.name.toLowerCase().includes(lowercaseQuery) ||
      skill.description?.toLowerCase().includes(lowercaseQuery) ||
      skill.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get skills by project (skills used in specific project)
   */
  getSkillsByProject(projectId: string): Skill[] {
    // This would typically come from project data
    // For now, return all skills that might be relevant
    return allSkills.filter(skill => 
      skill.projects?.includes(projectId)
    );
  }

  /**
   * Get skill recommendations based on current skills
   */
  getSkillRecommendations(currentSkills: string[], limit: number = 5): Skill[] {
    const currentSkillNames = currentSkills.map(s => s.toLowerCase());
    
    return allSkills
      .filter(skill => !currentSkillNames.includes(skill.name.toLowerCase()))
      .map(skill => ({
        skill,
        relevanceScore: this.calculateRelevanceScore(skill, currentSkills),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(item => item.skill);
  }

  private calculateRelevanceScore(skill: Skill, currentSkills: string[]): number {
    let score = 0;
    
    // Same category gets higher score
    const currentCategories = currentSkills.map(s => 
      allSkills.find(sk => sk.name.toLowerCase() === s.toLowerCase())?.category
    ).filter(Boolean);
    
    if (currentCategories.includes(skill.category)) {
      score += 2;
    }
    
    // Similar proficiency level
    const currentProficiencies = currentSkills.map(s => 
      allSkills.find(sk => sk.name.toLowerCase() === s.toLowerCase())?.proficiency
    ).filter(Boolean);
    
    if (currentProficiencies.includes(skill.proficiency)) {
      score += 1;
    }
    
    // Popular skills get higher score
    if (skill.proficiency === 'expert') {
      score += 1;
    }
    
    return score;
  }

  /**
   * Get skill progression path
   */
  getSkillProgressionPath(skillName: string): Skill[] {
    const skill = allSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (!skill) return [];

    const progressionOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentLevelIndex = progressionOrder.indexOf(skill.proficiency);
    
    if (currentLevelIndex === -1) return [];

    return progressionOrder
      .slice(0, currentLevelIndex + 1)
      .map(level => ({
        ...skill,
        proficiency: level as any,
        yearsOfExperience: this.calculateExperienceForLevel(level),
      }));
  }

  private calculateExperienceForLevel(level: string): number {
    const experienceMap = {
      'beginner': 0,
      'intermediate': 1,
      'advanced': 3,
      'expert': 5,
    };
    return experienceMap[level as keyof typeof experienceMap] || 0;
  }
}
