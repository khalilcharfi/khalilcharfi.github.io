// Work Experience
import type { WorkExperience } from './types';

export const workExperience: WorkExperience[] = [
  {
    id: 'asm-software-developer',
    company: 'ASM Software',
    position: 'Full-Stack Software Developer',
    location: 'Tunis, Tunisia',
    startDate: '2021-03',
    endDate: '2024-12',
    current: true,
    description: 'Developed and maintained web and mobile applications for various clients, focusing on scalable solutions and modern technologies.',
    responsibilities: [
      'Developed full-stack web applications using Vue.js, Laravel, and MySQL',
      'Built cross-platform mobile applications with Flutter and Ionic',
      'Collaborated with cross-functional teams to deliver high-quality software solutions',
      'Mentored junior developers and conducted code reviews',
      'Implemented CI/CD pipelines and automated testing processes',
      'Optimized application performance and ensured scalability',
    ],
    achievements: [
      'Led development of 5+ major projects with 100% on-time delivery',
      'Improved application performance by 40% through optimization techniques',
      'Reduced bug reports by 60% through improved testing and code quality',
      'Successfully mentored 3 junior developers',
    ],
    technologies: [
      'Vue.js', 'Laravel', 'Flutter', 'Ionic', 'TypeScript', 'MySQL', 
      'Docker', 'Git', 'AWS', 'Firebase'
    ],
    companyWebsite: 'https://asm-software.com',
    companyLogo: '/asset/company-logos/asm.jpg',
  },
  {
    id: 'asmdev-senior-developer',
    company: 'ASM Dev',
    position: 'Senior Full-Stack Developer',
    location: 'Tunis, Tunisia',
    startDate: '2019-06',
    endDate: '2021-02',
    current: false,
    description: 'Specialized in building enterprise-level applications and leading development teams for complex projects.',
    responsibilities: [
      'Architected and developed enterprise web applications',
      'Led a team of 4 developers on multiple projects',
      'Implemented microservices architecture for scalable solutions',
      'Integrated third-party APIs and payment systems',
      'Established coding standards and best practices',
      'Conducted technical interviews and onboarding',
    ],
    achievements: [
      'Successfully delivered 3 enterprise projects worth $500K+',
      'Reduced development time by 30% through reusable components',
      'Implemented automated testing reducing production bugs by 70%',
      'Trained team on modern development practices',
    ],
    technologies: [
      'Angular', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 
      'Kubernetes', 'AWS', 'Microservices', 'REST APIs'
    ],
    companyWebsite: 'https://asmdev.com',
    companyLogo: '/asset/company-logos/asmdev.jpg',
  },
  {
    id: 'freelance-developer',
    company: 'Freelance',
    position: 'Full-Stack Developer',
    location: 'Remote',
    startDate: '2018-01',
    endDate: '2019-05',
    current: false,
    description: 'Provided web and mobile development services to various clients, specializing in custom solutions and rapid prototyping.',
    responsibilities: [
      'Developed custom web applications for small to medium businesses',
      'Created mobile applications using hybrid technologies',
      'Provided technical consulting and project planning',
      'Maintained and updated existing client applications',
      'Collaborated with clients to understand requirements',
    ],
    achievements: [
      'Completed 15+ projects with 100% client satisfaction',
      'Built 3 mobile applications with 4.5+ app store ratings',
      'Established long-term relationships with 5+ clients',
      'Developed reusable component library saving 50% development time',
    ],
    technologies: [
      'React', 'Vue.js', 'Laravel', 'Ionic', 'Cordova', 
      'MySQL', 'MongoDB', 'JavaScript', 'PHP'
    ],
  },
];
