// Content Adaptation System
import type { UserProfile } from '../types/analytics';
import { translations, type LanguageSpecificTranslations } from '../data/translations';

export interface AdaptiveContent {
  [key: string]: {
    [userType: string]: any;
  };
}

export interface PersonalizedContent {
  home: {
    greeting: string;
    tagline: string;
    intro: string;
    ctaText: string;
  };
  about: {
    title: string;
    professionalSummary: string;
    keyHighlights: string[];
  };
  skills: {
    title: string;
    focusAreas: string[];
    priorityOrder: string[];
  };
  projects: {
    title: string;
    description: string;
    featuredProjects: string[];
  };
  experience: {
    title: string;
    emphasis: 'achievements' | 'responsibilities' | 'impact';
  };
  contact: {
    title: string;
    message: string;
    primaryCTA: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Adaptive content variations
const adaptiveContent: AdaptiveContent = {
  home: {
    head_hunter: {
      greeting: "Professional Full-Stack Developer",
      tagline: "Building scalable solutions with proven impact",
      intro: "Results-driven developer with {{years}}+ years of experience delivering enterprise-grade applications. Proven track record of leading teams and driving technical innovation.",
      ctaText: "View Professional Profile"
    },
    job_seeker: {
      greeting: "Hello, I'm looking for my next opportunity",
      tagline: "Passionate developer ready to contribute",
      intro: "Full-stack developer eager to bring creativity and technical expertise to your team. I thrive in collaborative environments and love solving complex challenges.",
      ctaText: "Let's Connect"
    },
    peer_developer: {
      greeting: "Hey fellow developer! 👋",
      tagline: "Building cool stuff with modern tech",
      intro: "I'm a developer who loves experimenting with new technologies and contributing to open source. Always up for discussing architecture, best practices, or the latest frameworks.",
      ctaText: "Check Out My Code"
    },
    client: {
      greeting: "Your Technical Partner",
      tagline: "Transforming ideas into digital solutions",
      intro: "I help businesses leverage technology to achieve their goals. From concept to deployment, I deliver solutions that drive growth and efficiency.",
      ctaText: "Start Your Project"
    },
    unknown: {
      greeting: "Hello, I am",
      tagline: "Full-Stack Developer & Problem Solver",
      intro: "I create digital experiences that matter. With expertise in modern web technologies, I build applications that are both powerful and user-friendly.",
      ctaText: "Explore My Work"
    }
  },
  about: {
    head_hunter: {
      title: "Professional Background",
      professionalSummary: "Senior Full-Stack Developer with expertise in React, Node.js, and cloud technologies. Led multiple successful projects from conception to deployment, with a focus on scalable architecture and team leadership. Proven ability to deliver results in fast-paced environments.",
      keyHighlights: [
        "{{projects_count}}+ successful projects delivered",
        "Team leadership and mentoring experience",
        "Strong problem-solving and analytical skills",
        "Excellent communication and collaboration abilities",
        "Continuous learning and adaptation to new technologies"
      ]
    },
    job_seeker: {
      title: "About Me",
      professionalSummary: "Passionate full-stack developer with a love for creating intuitive user experiences and robust backend systems. I'm always eager to learn new technologies and contribute to meaningful projects.",
      keyHighlights: [
        "Quick learner with strong technical foundation",
        "Collaborative team player",
        "Detail-oriented with focus on quality",
        "Open to new challenges and opportunities",
        "Committed to professional growth"
      ]
    },
    peer_developer: {
      title: "Developer Profile",
      professionalSummary: "Full-stack developer passionate about clean code, modern architecture, and emerging technologies. I enjoy sharing knowledge, contributing to open source, and discussing technical challenges with fellow developers.",
      keyHighlights: [
        "Modern web technologies enthusiast",
        "Open source contributor",
        "Clean code and best practices advocate",
        "Always exploring new tech and methodologies",
        "Active in developer communities"
      ]
    },
    client: {
      title: "Business Partnership",
      professionalSummary: "Technical consultant and full-stack developer who understands business needs. I translate your vision into robust, scalable solutions that drive growth and improve efficiency.",
      keyHighlights: [
        "Business-focused technical solutions",
        "End-to-end project management",
        "ROI-driven development approach",
        "Clear communication and transparency",
        "Long-term partnership mindset"
      ]
    }
  },
  skills: {
    head_hunter: {
      title: "Technical Expertise",
      focusAreas: ["Leadership", "Architecture", "Scalability", "Performance"],
      priorityOrder: ["backend", "frontend", "devops", "databases", "tools", "mobile"]
    },
    peer_developer: {
      title: "Tech Stack",
      focusAreas: ["Modern Frameworks", "Best Practices", "Innovation", "Open Source"],
      priorityOrder: ["frontend", "backend", "tools", "devops", "databases", "mobile"]
    },
    client: {
      title: "Solution Capabilities",
      focusAreas: ["Business Impact", "User Experience", "Reliability", "Growth"],
      priorityOrder: ["frontend", "backend", "databases", "devops", "tools", "mobile"]
    }
  },
  projects: {
    head_hunter: {
      title: "Professional Projects",
      description: "Selection of enterprise-grade projects demonstrating technical leadership and business impact.",
      featuredProjects: ["most_complex", "team_leadership", "business_impact"]
    },
    peer_developer: {
      title: "Code & Projects",
      description: "Open source contributions and personal projects showcasing modern development practices.",
      featuredProjects: ["open_source", "innovative", "technical_challenge"]
    },
    client: {
      title: "Success Stories",
      description: "Real-world solutions that delivered measurable business results for clients.",
      featuredProjects: ["business_impact", "client_success", "roi_focused"]
    }
  },
  meta: {
    head_hunter: {
      title: "Khalil Charfi - Senior Full-Stack Developer | Available for Hire",
      description: "Experienced full-stack developer with proven track record in React, Node.js, and modern web technologies. Ready to join your team and drive technical innovation.",
      keywords: ["full-stack developer", "react developer", "node.js", "hiring", "available", "senior developer", "team lead"]
    },
    job_seeker: {
      title: "Khalil Charfi - Full-Stack Developer Seeking Opportunities",
      description: "Passionate full-stack developer looking for new challenges. Expertise in modern web technologies with a focus on user experience and clean code.",
      keywords: ["developer job search", "full-stack developer", "career opportunity", "web developer", "react", "node.js"]
    },
    peer_developer: {
      title: "Khalil Charfi - Developer & Tech Enthusiast",
      description: "Full-stack developer passionate about modern web technologies, open source, and sharing knowledge with the developer community.",
      keywords: ["developer portfolio", "full-stack", "open source", "tech blog", "web development", "modern frameworks"]
    },
    client: {
      title: "Khalil Charfi - Technical Consultant & Full-Stack Developer",
      description: "Transform your business ideas into powerful digital solutions. Expert full-stack development services with focus on ROI and growth.",
      keywords: ["web development services", "technical consultant", "full-stack developer", "business solutions", "digital transformation"]
    }
  }
};

export class ContentAdapter {
  private profile: UserProfile;
  private baseTranslations: LanguageSpecificTranslations;

  constructor(profile: UserProfile, language: string = 'en') {
    this.profile = profile;
    this.baseTranslations = translations[language] || translations.en;
  }

  public getPersonalizedContent(): PersonalizedContent {
    const userType = this.getUserType();
    const content = this.adaptContent(userType);
    
    return {
      home: this.adaptHomeContent(content),
      about: this.adaptAboutContent(content),
      skills: this.adaptSkillsContent(content),
      projects: this.adaptProjectsContent(content),
      experience: this.adaptExperienceContent(content),
      contact: this.adaptContactContent(content),
      meta: this.adaptMetaContent(content)
    };
  }

  private getUserType(): string {
    // Priority order for user type detection
    if (this.profile.type !== 'unknown') return this.profile.type;
    if (this.profile.source === 'linkedin') return 'head_hunter';
    if (this.profile.source === 'github') return 'peer_developer';
    if (this.profile.intent === 'hiring') return 'head_hunter';
    return 'unknown';
  }

  private adaptContent(userType: string): any {
    const adapted: any = {};
    
    Object.keys(adaptiveContent).forEach(section => {
      adapted[section] = adaptiveContent[section][userType] || adaptiveContent[section]['unknown'] || {};
    });
    
    return adapted;
  }

  private adaptHomeContent(content: any): PersonalizedContent['home'] {
    const homeContent = content.home || adaptiveContent.home.unknown;
    
    return {
      greeting: homeContent.greeting || this.baseTranslations.home.greeting,
      tagline: this.interpolateContent(homeContent.tagline || this.baseTranslations.home.tagline),
      intro: this.interpolateContent(homeContent.intro || this.baseTranslations.home.intro),
      ctaText: homeContent.ctaText || this.baseTranslations.home.viewWorkBtn
    };
  }

  private adaptAboutContent(content: any): PersonalizedContent['about'] {
    const aboutContent = content.about || adaptiveContent.about.unknown;
    
    return {
      title: aboutContent.title || this.baseTranslations.about.title,
      professionalSummary: aboutContent.professionalSummary || this.baseTranslations.about.professionalSummary,
      keyHighlights: aboutContent.keyHighlights || []
    };
  }

  private adaptSkillsContent(content: any): PersonalizedContent['skills'] {
    const skillsContent = content.skills || adaptiveContent.skills.unknown;
    
    return {
      title: skillsContent.title || this.baseTranslations.skills.title,
      focusAreas: skillsContent.focusAreas || [],
      priorityOrder: skillsContent.priorityOrder || ['frontend', 'backend', 'databases', 'devops', 'tools', 'mobile']
    };
  }

  private adaptProjectsContent(content: any): PersonalizedContent['projects'] {
    const projectsContent = content.projects || adaptiveContent.projects.unknown;
    
    return {
      title: projectsContent.title || this.baseTranslations.projects.title,
      description: projectsContent.description || "",
      featuredProjects: projectsContent.featuredProjects || []
    };
  }

  private adaptExperienceContent(content: any): PersonalizedContent['experience'] {
    const userType = this.getUserType();
    
    return {
      title: this.baseTranslations.experience.title,
      emphasis: userType === 'head_hunter' ? 'achievements' : 
               userType === 'client' ? 'impact' : 'responsibilities'
    };
  }

  private adaptContactContent(content: any): PersonalizedContent['contact'] {
    const userType = this.getUserType();
    const messages: { [key: string]: string } = {
      head_hunter: "I'm interested in discussing how I can contribute to your team. Let's talk about how my experience aligns with your needs.",
      job_seeker: "I'm actively seeking new opportunities and would love to hear about potential roles that match my skills.",
      peer_developer: "Always happy to connect with fellow developers! Whether it's about collaboration, code reviews, or just tech talk.",
      client: "Ready to bring your vision to life? Let's discuss your project requirements and how I can help achieve your goals.",
      unknown: "Feel free to reach out for any inquiries or potential collaborations."
    };

    const ctas: { [key: string]: string } = {
      head_hunter: "Schedule Interview",
      job_seeker: "Discuss Opportunities",
      peer_developer: "Let's Connect",
      client: "Start Project Discussion",
      unknown: "Get In Touch"
    };
    
    return {
      title: this.baseTranslations.contact.title,
      message: messages[userType] || messages.unknown,
      primaryCTA: ctas[userType] || ctas.unknown
    };
  }

  private adaptMetaContent(content: any): PersonalizedContent['meta'] {
    const metaContent = content.meta || adaptiveContent.meta.unknown;
    
    return {
      title: metaContent.title || this.baseTranslations.seo.title,
      description: metaContent.description || this.baseTranslations.seo.description,
      keywords: this.generateKeywords(metaContent.keywords || [])
    };
  }

  private interpolateContent(content: string): string {
    // Replace placeholders with actual data
    const replacements = {
      '{{years}}': this.calculateExperience(),
      '{{projects_count}}': this.getProjectsCount(),
      '{{name}}': 'Khalil Charfi'
    };
    
    let result = content;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      result = result.replace(new RegExp(placeholder, 'g'), value.toString());
    });
    
    return result;
  }

  private calculateExperience(): number {
    // Calculate years of experience (this would be dynamic based on your actual start date)
    const startYear = 2019; // Adjust this to your actual start year
    return new Date().getFullYear() - startYear;
  }

  private getProjectsCount(): number {
    // This would come from your actual projects data
    return this.baseTranslations.projects.items?.length || 10;
  }

  private generateKeywords(baseKeywords: string[]): string[] {
    const profileKeywords = this.profile.searchKeywords;
    const sourceKeywords = this.getSourceKeywords();
    const industryKeywords = ['web development', 'react', 'node.js', 'typescript', 'full-stack'];
    
    return [...new Set([...baseKeywords, ...profileKeywords, ...sourceKeywords, ...industryKeywords])];
  }

  private getSourceKeywords(): string[] {
    const sourceMap: { [key: string]: string[] } = {
      linkedin: ['linkedin', 'professional', 'career', 'hiring'],
      github: ['github', 'open source', 'code', 'developer'],
      google: ['portfolio', 'developer', 'web development'],
      social: ['social media', 'networking'],
      direct: ['portfolio', 'personal website'],
      unknown: []
    };
    
    return sourceMap[this.profile.source] || [];
  }

  // Method to get dynamic call-to-action based on user profile
  public getDynamicCTA(): { text: string; action: string; style: 'primary' | 'secondary' } {
    const userType = this.getUserType();
    
    const ctas: { [key: string]: { text: string; action: string; style: 'primary' | 'secondary' } } = {
      head_hunter: { text: "Download Resume", action: "download-cv", style: 'primary' as const },
      job_seeker: { text: "View Opportunities", action: "contact", style: 'primary' as const },
      peer_developer: { text: "Check GitHub", action: "github", style: 'secondary' as const },
      client: { text: "Start Project", action: "contact", style: 'primary' as const },
      unknown: { text: "Get In Touch", action: "contact", style: 'primary' as const }
    };
    
    return ctas[userType] || ctas.unknown;
  }

  // Method to get section priority for layout optimization
  public getSectionPriority(): string[] {
    const userType = this.getUserType();
    
    const priorities: { [key: string]: string[] } = {
      head_hunter: ['about', 'experience', 'skills', 'education', 'certificates', 'projects', 'publications', 'contact'],
      job_seeker: ['about', 'skills', 'projects', 'experience', 'education', 'certificates', 'contact', 'publications'],
      peer_developer: ['about', 'projects', 'skills', 'publications', 'experience', 'education', 'contact', 'certificates'],
      client: ['about', 'projects', 'experience', 'skills', 'contact', 'education', 'certificates', 'publications'],
      unknown: ['about', 'skills', 'projects', 'experience', 'education', 'publications', 'certificates', 'contact']
    };
    
    return priorities[userType] || priorities.unknown;
  }
} 