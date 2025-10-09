// Key Achievements and Highlights
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'leadership' | 'business' | 'personal';
  year: number;
  impact?: string;
  metrics?: {
    value: string;
    description: string;
  }[];
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  icon?: string;
  achievements: Achievement[];
}

export const keyAchievements: Achievement[] = [
  {
    id: 'performance-optimization',
    title: 'Performance Optimization Expert',
    description: 'Consistently improved application performance across multiple projects',
    category: 'technical',
    year: 2024,
    impact: '40% average performance improvement',
    metrics: [
      { value: '40%', description: 'Average performance improvement' },
      { value: '99.9%', description: 'Uptime achieved' },
      { value: '<2s', description: 'Average page load time' },
    ],
  },
  {
    id: 'team-leadership',
    title: 'Team Leadership & Mentoring',
    description: 'Successfully led development teams and mentored junior developers',
    category: 'leadership',
    year: 2023,
    impact: 'Improved team productivity by 50%',
    metrics: [
      { value: '4', description: 'Team members mentored' },
      { value: '50%', description: 'Productivity improvement' },
      { value: '100%', description: 'On-time project delivery' },
    ],
  },
  {
    id: 'mobile-expertise',
    title: 'Mobile Development Excellence',
    description: 'Built high-quality mobile applications with excellent user ratings',
    category: 'technical',
    year: 2023,
    impact: '4.8/5 average app store rating',
    metrics: [
      { value: '4.8/5', description: 'Average app store rating' },
      { value: '10K+', description: 'App downloads' },
      { value: '3', description: 'Mobile apps published' },
    ],
  },
  {
    id: 'client-satisfaction',
    title: '100% Client Satisfaction',
    description: 'Maintained perfect client satisfaction across all freelance projects',
    category: 'business',
    year: 2022,
    impact: '15+ successful projects delivered',
    metrics: [
      { value: '100%', description: 'Client satisfaction rate' },
      { value: '15+', description: 'Projects completed' },
      { value: '5+', description: 'Long-term client relationships' },
    ],
  },
  {
    id: 'open-source',
    title: 'Open Source Contributor',
    description: 'Active contributor to open source projects and developer community',
    category: 'personal',
    year: 2024,
    impact: 'Active in developer community',
    metrics: [
      { value: '50+', description: 'GitHub repositories' },
      { value: '100+', description: 'GitHub contributions' },
      { value: '10+', description: 'Open source projects contributed' },
    ],
  },
];

export const highlights: Highlight[] = [
  {
    id: 'technical-excellence',
    title: 'Technical Excellence',
    description: 'Consistent delivery of high-quality, performant applications',
    achievements: keyAchievements.filter(a => a.category === 'technical'),
  },
  {
    id: 'leadership-impact',
    title: 'Leadership & Impact',
    description: 'Proven ability to lead teams and drive positive outcomes',
    achievements: keyAchievements.filter(a => a.category === 'leadership'),
  },
  {
    id: 'business-results',
    title: 'Business Results',
    description: 'Delivering measurable value to clients and organizations',
    achievements: keyAchievements.filter(a => a.category === 'business'),
  },
  {
    id: 'community-involvement',
    title: 'Community Involvement',
    description: 'Contributing to the developer community and continuous learning',
    achievements: keyAchievements.filter(a => a.category === 'personal'),
  },
];
