// Mobile Development Projects
import type { Project } from './types';
import { PROJECT_IDS } from './types';

export const mobileProjects: Project[] = [
  {
    id: PROJECT_IDS.FLUTTER_MOBILE_APP,
    title: 'Flutter E-Commerce App',
    description: 'Cross-platform mobile application for e-commerce with offline support, payment integration, and real-time notifications.',
    shortDescription: 'Cross-platform e-commerce app with offline support',
    longDescription: 'A comprehensive e-commerce mobile application built with Flutter for both iOS and Android. Features include product catalog, shopping cart, secure payment processing, user authentication, offline data synchronization, push notifications, and order tracking. The app supports multiple languages and currencies.',
    technologies: [
      { name: 'Flutter', category: 'mobile', proficiency: 'expert' },
      { name: 'Dart', category: 'mobile', proficiency: 'expert' },
      { name: 'Firebase', category: 'backend', proficiency: 'advanced' },
      { name: 'SQLite', category: 'database', proficiency: 'advanced' },
      { name: 'Stripe', category: 'other', proficiency: 'intermediate' },
      { name: 'Google Maps', category: 'other', proficiency: 'advanced' },
    ],
    category: 'mobile',
    status: 'completed',
    featured: true,
    images: {
      thumbnail: '/asset/projects/flutter-app-thumb.jpg',
      hero: '/asset/projects/flutter-app-hero.jpg',
      screenshots: [
        '/asset/projects/flutter-app-1.jpg',
        '/asset/projects/flutter-app-2.jpg',
        '/asset/projects/flutter-app-3.jpg',
      ],
    },
    links: {
      live: 'https://play.google.com/store/apps/details?id=com.example.ecommerce',
      github: 'https://github.com/khalil-charfi/flutter-ecommerce-app',
    },
    metrics: {
      users: 10000,
      performance: '4.8/5 app store rating',
      impact: '30% increase in mobile sales',
    },
    startDate: '2023-03',
    endDate: '2023-10',
    duration: '7 months',
    teamSize: 3,
    role: 'Mobile Lead Developer',
    challenges: [
      'Implementing offline-first architecture',
      'Optimizing app performance for low-end devices',
      'Ensuring consistent UI across iOS and Android',
    ],
    achievements: [
      'Achieved 4.8/5 rating on app stores',
      'Reduced app size by 40% through optimization',
      'Implemented offline functionality with 95% reliability',
    ],
  },
  {
    id: PROJECT_IDS.IONIC_HYBRID_APP,
    title: 'Ionic Healthcare App',
    description: 'Hybrid mobile application for healthcare management with patient records, appointment scheduling, and telemedicine features.',
    shortDescription: 'Healthcare management app with telemedicine features',
    longDescription: 'A comprehensive healthcare management application built with Ionic and Angular. Features include patient record management, appointment scheduling, telemedicine video calls, prescription management, health tracking, and secure messaging between patients and healthcare providers. The app ensures HIPAA compliance and data security.',
    technologies: [
      { name: 'Ionic', category: 'mobile', proficiency: 'expert' },
      { name: 'Angular', category: 'frontend', proficiency: 'expert' },
      { name: 'TypeScript', category: 'frontend', proficiency: 'expert' },
      { name: 'Cordova', category: 'mobile', proficiency: 'advanced' },
      { name: 'WebRTC', category: 'other', proficiency: 'intermediate' },
      { name: 'PostgreSQL', category: 'database', proficiency: 'advanced' },
    ],
    category: 'mobile',
    status: 'completed',
    featured: true,
    images: {
      thumbnail: '/asset/projects/ionic-healthcare-thumb.jpg',
      hero: '/asset/projects/ionic-healthcare-hero.jpg',
      screenshots: [
        '/asset/projects/ionic-healthcare-1.jpg',
        '/asset/projects/ionic-healthcare-2.jpg',
        '/asset/projects/ionic-healthcare-3.jpg',
      ],
    },
    links: {
      live: 'https://healthcare-app.example.com',
      github: 'https://github.com/khalil-charfi/ionic-healthcare-app',
    },
    metrics: {
      users: 5000,
      performance: '99.9% uptime',
      impact: '60% reduction in appointment no-shows',
    },
    startDate: '2022-09',
    endDate: '2023-04',
    duration: '8 months',
    teamSize: 5,
    role: 'Hybrid Mobile Developer',
    challenges: [
      'Ensuring HIPAA compliance and data security',
      'Implementing real-time video calling functionality',
      'Optimizing performance across different devices',
    ],
    achievements: [
      'Achieved HIPAA compliance certification',
      'Reduced appointment no-shows by 60%',
      'Implemented secure video calling with 99.9% reliability',
    ],
  },
];
