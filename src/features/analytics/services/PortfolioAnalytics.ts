// Portfolio Analytics Service - Lightweight tracking for portfolio showcase
import { projectService, skillService } from '@/features/portfolio/domain';
import type { Project } from '@/features/portfolio/content/projects';

export interface PortfolioEvent {
  type: 'project_view' | 'skill_interest' | 'cta_click' | 'scroll_depth' | 'section_view' | 'download' | 'contact';
  timestamp: number;
  data: {
    projectId?: string;
    skillName?: string;
    ctaType?: string;
    sectionName?: string;
    depth?: number;
    downloadType?: string;
    contactMethod?: string;
    [key: string]: any;
  };
}

export interface PortfolioMetrics {
  projectViews: { [projectId: string]: number };
  skillInterests: { [skillName: string]: number };
  ctaClicks: { [ctaType: string]: number };
  sectionViews: { [sectionName: string]: number };
  scrollDepth: number;
  timeOnSite: number;
  downloads: { [type: string]: number };
  contactAttempts: { [method: string]: number };
}

export class PortfolioAnalytics {
  private static instance: PortfolioAnalytics;
  private events: PortfolioEvent[] = [];
  private metrics: PortfolioMetrics = {
    projectViews: {},
    skillInterests: {},
    ctaClicks: {},
    sectionViews: {},
    scrollDepth: 0,
    timeOnSite: 0,
    downloads: {},
    contactAttempts: {}
  };
  private sessionStart: number = Date.now();
  private hasConsent: boolean = false;

  static getInstance(): PortfolioAnalytics {
    if (!PortfolioAnalytics.instance) {
      PortfolioAnalytics.instance = new PortfolioAnalytics();
    }
    return PortfolioAnalytics.instance;
  }

  /**
   * Initialize analytics with consent
   */
  initialize(hasConsent: boolean): void {
    this.hasConsent = hasConsent;
    if (hasConsent) {
      this.startSessionTracking();
    }
  }

  /**
   * Track project view
   */
  trackProjectView(projectId: string, projectTitle: string): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'project_view',
      timestamp: Date.now(),
      data: {
        projectId,
        projectTitle,
        isFeatured: projectService.getProjectById(projectId)?.featured || false,
        category: projectService.getProjectById(projectId)?.category || 'unknown'
      }
    });

    this.metrics.projectViews[projectId] = (this.metrics.projectViews[projectId] || 0) + 1;
  }

  /**
   * Track skill interest
   */
  trackSkillInterest(skillName: string, category: string): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'skill_interest',
      timestamp: Date.now(),
      data: {
        skillName,
        category,
        proficiency: skillService.getSkillsByTechnology(skillName)[0]?.proficiency || 'unknown'
      }
    });

    this.metrics.skillInterests[skillName] = (this.metrics.skillInterests[skillName] || 0) + 1;
  }

  /**
   * Track CTA click
   */
  trackCTAClick(ctaType: string, context?: string): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'cta_click',
      timestamp: Date.now(),
      data: {
        ctaType,
        context: context || 'unknown'
      }
    });

    this.metrics.ctaClicks[ctaType] = (this.metrics.ctaClicks[ctaType] || 0) + 1;
  }

  /**
   * Track section view
   */
  trackSectionView(sectionName: string, timeSpent?: number): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'section_view',
      timestamp: Date.now(),
      data: {
        sectionName,
        timeSpent: timeSpent || 0
      }
    });

    this.metrics.sectionViews[sectionName] = (this.metrics.sectionViews[sectionName] || 0) + 1;
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'scroll_depth',
      timestamp: Date.now(),
      data: {
        depth
      }
    });

    this.metrics.scrollDepth = Math.max(this.metrics.scrollDepth, depth);
  }

  /**
   * Track download
   */
  trackDownload(downloadType: string, fileName?: string): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'download',
      timestamp: Date.now(),
      data: {
        downloadType,
        fileName: fileName || 'unknown'
      }
    });

    this.metrics.downloads[downloadType] = (this.metrics.downloads[downloadType] || 0) + 1;
  }

  /**
   * Track contact attempt
   */
  trackContactAttempt(method: string, success: boolean = false): void {
    if (!this.hasConsent) return;

    this.addEvent({
      type: 'contact',
      timestamp: Date.now(),
      data: {
        contactMethod: method,
        success
      }
    });

    this.metrics.contactAttempts[method] = (this.metrics.contactAttempts[method] || 0) + 1;
  }

  /**
   * Get portfolio insights
   */
  getPortfolioInsights(): {
    topProjects: Array<{ projectId: string; views: number; title: string }>;
    topSkills: Array<{ skillName: string; interests: number; category: string }>;
    popularSections: Array<{ sectionName: string; views: number }>;
    engagementScore: number;
    recommendations: string[];
  } {
    const topProjects = Object.entries(this.metrics.projectViews)
      .map(([projectId, views]) => {
        const project = projectService.getProjectById(projectId);
        return {
          projectId,
          views,
          title: project?.title || 'Unknown Project'
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const topSkills = Object.entries(this.metrics.skillInterests)
      .map(([skillName, interests]) => {
        const skill = skillService.getSkillsByTechnology(skillName)[0];
        return {
          skillName,
          interests,
          category: skill?.category || 'unknown'
        };
      })
      .sort((a, b) => b.interests - a.interests)
      .slice(0, 5);

    const popularSections = Object.entries(this.metrics.sectionViews)
      .map(([sectionName, views]) => ({ sectionName, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const engagementScore = this.calculateEngagementScore();
    const recommendations = this.generateRecommendations();

    return {
      topProjects,
      topSkills,
      popularSections,
      engagementScore,
      recommendations
    };
  }

  /**
   * Get visitor behavior insights
   */
  getVisitorBehavior(): {
    visitorType: 'recruiter' | 'developer' | 'client' | 'unknown';
    interests: string[];
    engagementLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  } {
    const insights = this.getPortfolioInsights();
    
    // Determine visitor type based on behavior
    let visitorType: 'recruiter' | 'developer' | 'client' | 'unknown' = 'unknown';
    
    if (insights.topProjects.some(p => p.projectId.includes('vv-vehicle'))) {
      visitorType = 'client'; // Interested in business projects
    } else if (insights.topSkills.some(s => s.category === 'frontend' || s.category === 'backend')) {
      visitorType = 'developer'; // Interested in technical skills
    } else if (insights.ctaClicks['contact'] > 0 || insights.ctaClicks['resume'] > 0) {
      visitorType = 'recruiter'; // Interested in contact/resume
    }

    // Determine engagement level
    let engagementLevel: 'low' | 'medium' | 'high' = 'low';
    if (insights.engagementScore > 70) {
      engagementLevel = 'high';
    } else if (insights.engagementScore > 40) {
      engagementLevel = 'medium';
    }

    return {
      visitorType,
      interests: insights.topSkills.map(s => s.skillName),
      engagementLevel,
      recommendations: insights.recommendations
    };
  }

  /**
   * Export analytics data
   */
  exportData(): {
    events: PortfolioEvent[];
    metrics: PortfolioMetrics;
    insights: ReturnType<typeof this.getPortfolioInsights>;
    behavior: ReturnType<typeof this.getVisitorBehavior>;
    sessionDuration: number;
  } {
    return {
      events: [...this.events],
      metrics: { ...this.metrics },
      insights: this.getPortfolioInsights(),
      behavior: this.getVisitorBehavior(),
      sessionDuration: Date.now() - this.sessionStart
    };
  }

  /**
   * Reset analytics data
   */
  reset(): void {
    this.events = [];
    this.metrics = {
      projectViews: {},
      skillInterests: {},
      ctaClicks: {},
      sectionViews: {},
      scrollDepth: 0,
      timeOnSite: 0,
      downloads: {},
      contactAttempts: {}
    };
    this.sessionStart = Date.now();
  }

  private addEvent(event: PortfolioEvent): void {
    this.events.push(event);
    
    // Keep only last 100 events to prevent memory issues
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  private startSessionTracking(): void {
    // Track time on site
    setInterval(() => {
      this.metrics.timeOnSite = Date.now() - this.sessionStart;
    }, 1000);

    // Track scroll depth with throttling
    let maxScrollDepth = 0;
    let lastScrollTime = 0;
    
    const trackScroll = () => {
      const now = performance.now();
      // Throttle scroll tracking to avoid excessive calculations
      if (now - lastScrollTime < 100) return;
      lastScrollTime = now;
      
      // Cache scroll values to avoid multiple DOM queries
      const scrollY = window.scrollY;
      const bodyHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      
      if (bodyHeight > windowHeight) {
        const scrollDepth = Math.round((scrollY / (bodyHeight - windowHeight)) * 100);
        maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
        this.trackScrollDepth(maxScrollDepth);
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  private calculateEngagementScore(): number {
    const totalEvents = this.events.length;
    const uniqueProjects = Object.keys(this.metrics.projectViews).length;
    const uniqueSkills = Object.keys(this.metrics.skillInterests).length;
    const totalClicks = Object.values(this.metrics.ctaClicks).reduce((sum, count) => sum + count, 0);
    
    // Simple scoring algorithm
    let score = 0;
    score += Math.min(totalEvents * 2, 40); // Event participation (max 40)
    score += Math.min(uniqueProjects * 5, 25); // Project diversity (max 25)
    score += Math.min(uniqueSkills * 3, 15); // Skill interest (max 15)
    score += Math.min(totalClicks * 4, 20); // Interaction (max 20)
    
    return Math.min(score, 100);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const insights = this.getPortfolioInsights();
    
    if (insights.topProjects.length === 0) {
      recommendations.push('Consider highlighting featured projects more prominently');
    }
    
    if (insights.engagementScore < 50) {
      recommendations.push('Add more interactive elements to increase engagement');
    }
    
    if (insights.topSkills.length < 3) {
      recommendations.push('Showcase more technical skills to attract developers');
    }
    
    if (this.metrics.ctaClicks['contact'] === 0) {
      recommendations.push('Make contact information more visible and accessible');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const portfolioAnalytics = PortfolioAnalytics.getInstance();
