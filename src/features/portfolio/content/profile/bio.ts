// Professional Bio and Personal Information
export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  website: string;
  linkedin: string;
  github: string;
  twitter?: string;
  languages: string[];
  nationality: string;
  availability: 'available' | 'busy' | 'unavailable';
  timezone: string;
}

export interface ProfessionalSummary {
  headline: string;
  summary: string;
  keyPoints: string[];
  specialties: string[];
  yearsOfExperience: number;
}

export const personalInfo: PersonalInfo = {
  name: 'Khalil Charfi',
  title: 'Full-Stack Engineer',
  location: 'Tunis, Tunisia',
  email: 'khalil.charfi@example.com',
  phone: '+216 XX XXX XXX',
  website: 'https://khalilcharfi.github.io',
  linkedin: 'https://linkedin.com/in/khalil-charfi',
  github: 'https://github.com/khalil-charfi',
  twitter: 'https://twitter.com/khalilcharfi',
  languages: ['Arabic (Native)', 'English (Fluent)', 'French (Fluent)', 'German (Intermediate)'],
  nationality: 'Tunisian',
  availability: 'available',
  timezone: 'CET (UTC+1)',
};

export const professionalSummary: ProfessionalSummary = {
  headline: 'Full-Stack Engineer with 6+ years of experience building scalable web and mobile applications',
  summary: 'Passionate full-stack engineer specializing in modern web technologies, mobile development, and cloud solutions. I design and build exceptional digital products that are both scalable and user-centric. With extensive experience across the entire development stack, I thrive on turning complex problems into elegant, maintainable solutions.',
  keyPoints: [
    '6+ years of full-stack development experience',
    'Expert in Vue.js, React, Laravel, and Flutter',
    'Proven track record of delivering 20+ successful projects',
    'Strong background in team leadership and mentoring',
    'Experience working with international teams across Tunisia and Germany',
    'Passionate about clean architecture and modern development practices',
  ],
  specialties: [
    'Frontend Development (React, Vue.js, TypeScript)',
    'Backend Development (Laravel, Node.js, PHP)',
    'Mobile Development (Flutter, Ionic)',
    'Database Design & Optimization (MySQL, PostgreSQL)',
    'Cloud & DevOps (AWS, Docker, CI/CD)',
    'Team Leadership & Mentoring',
  ],
  yearsOfExperience: 6,
};
