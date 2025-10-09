// Education
import type { Education } from './types';

export const education: Education[] = [
  {
    id: 'isims-master',
    institution: 'Institut Supérieur d\'Informatique et de Multimédia de Sfax',
    degree: 'Master\'s Degree',
    field: 'Computer Science',
    location: 'Sfax, Tunisia',
    startDate: '2016-09',
    endDate: '2018-06',
    gpa: '3.8/4.0',
    description: 'Advanced studies in computer science with focus on software engineering, algorithms, and modern web technologies.',
    relevantCoursework: [
      'Advanced Software Engineering',
      'Database Systems Design',
      'Web Application Development',
      'Mobile Application Development',
      'Project Management',
      'Software Architecture',
    ],
    achievements: [
      'Graduated with High Honors (Magna Cum Laude)',
      'Completed final project on e-commerce platform development',
      'Participated in multiple hackathons and coding competitions',
    ],
    institutionWebsite: 'https://isims.usf.tn',
    institutionLogo: '/asset/company-logos/isims.jpg',
  },
  {
    id: 'isims-license',
    institution: 'Institut Supérieur d\'Informatique et de Multimédia de Sfax',
    degree: 'Bachelor\'s Degree',
    field: 'Computer Science',
    location: 'Sfax, Tunisia',
    startDate: '2013-09',
    endDate: '2016-06',
    gpa: '3.6/4.0',
    description: 'Comprehensive computer science education covering programming fundamentals, data structures, and software development principles.',
    relevantCoursework: [
      'Programming Fundamentals',
      'Data Structures and Algorithms',
      'Object-Oriented Programming',
      'Database Management Systems',
      'Computer Networks',
      'Operating Systems',
    ],
    achievements: [
      'Graduated with Honors',
      'Active member of computer science student association',
      'Completed multiple programming projects',
    ],
    institutionWebsite: 'https://isims.usf.tn',
    institutionLogo: '/asset/company-logos/isims.jpg',
  },
];
