// translations.ts

export interface CertificateItem {
  id: string;
  title: string;
  subtitle?: string;
  issuer: string;
  date: string;
  location?: string;
  imageUrl: string;
}

export interface LanguageSpecificTranslations {
  nav: {
    home: string;
    about: string;
    skills: string;
    experience: string;
    education: string;
    projects: string;
    publications: string;
    certificates: string;
    contact: string;
    logoAlt: string;
    toggleNav: string;
  };
  general: {
    scrollToTop: string;
    closeModal: string;
    viewCertificate: string;
    loading: string; // For Suspense fallback
    error: string; // For error states
    retry: string; // For retry buttons
    noResults: string; // For empty states
    skipToMain: string; // Accessibility
    skipToNav: string; // Accessibility
    openInNewTab: string; // Accessibility
    externalLink: string; // Accessibility
  };
  theme: {
    toggleLight: string;
    toggleDark: string;
    changedToLight: string;
    changedToDark: string;
  };
  languageSwitcher: {
    label: string; // For accessibility if it's just an icon
    en: string;
    de: string;
    fr: string;
    ar: string;
  };
  home: {
    greeting: string;
    name: string;
    tagline: string;
    intro: string;
    viewWorkBtn: string;
    getInTouchBtn: string;
    recommendedForYou: string;
  };
  about: {
    title: string;
    sectionContent: {
        p1: string;
        imagePlaceholder: string;
    };
    professionalSummaryTitle: string;
    professionalSummary: string; // From user prompt
    languagesTitle: string;
    languages: { lang: string; proficiency: string }[]; // From user prompt
    keyHighlightsTitle: string; // For 'Key Highlights' fallback
  };
  skills: {
    title: string;
    categories: {
      frontend: { name: string; items: string[] };
      backend: { name: string; items: string[] };
      mobile: { name: string; items: string[] };
      databases: { name: string; items: string[] };
      devops: { name: string; items: string[] };
      tools: { name: string; items: string[] };
    };
    focusAreasLabel: string;
    focusAI: string;
    focusWebDev: string;
    focusDataScience: string;
    priorityProgramming: string;
    priorityFrameworks: string;
    priorityTools: string;
    priorityDatabases: string;
  };
  experience: {
    title: string;
    items: {
      title: string;
      company: string;
      location: string;
      date: string;
      description: string[];
    }[];
  };
  education: {
    title: string;
    items: {
      degree: string;
      institution: string;
      date: string;
      details?: string;
    }[];
  };
  projects: {
    title: string;
    items: {
      title: string;
      description: string;
      tech: string[]; // Tech names usually not translated
      liveLink?: string;
      repoLink?: string;
    }[];
    linksUnavailable: string;
    liveDemoLabel: string;
    githubRepoLabel: string;
  };
  publications: {
    title: string;
    items: {
      title: string;
      authors: string;
      journal: string;
      date: string;
      abstract: string;
      link: string;
      viewLabel: string;
    }[];
  };
  certificates: {
    title: string;
    items: CertificateItem[];
  };
  contact: {
    title: string;
    intro: string;
    message: string;
    form: {
      nameLabel: string;
      emailLabel: string;
      messageLabel: string;
      sendBtn: string;
      submitting: string;
      successTitle: string;
      successMessage: string;
      sendAnother: string;
      demoAlert: string;
      emailError: string;
      requiredError: string;
    };
    connectTitle: string;
    emailAria: string;
    linkedinAria: string;
    githubAria: string;
  };
  footer: {
    copyright: string; // Use {{year}} for dynamic year
    credits: string;
  };
  chatbot: {
    title: string;
    placeholder: string;
    initialMessage: string;
    openAria: string;
    closeAria: string;
    sendAria: string;
    send: string;
  };
  cookieConsent: {
    title: string;
    description: string;
    acceptAllBtn: string;
    acceptNecessaryBtn: string;
    showPreferencesBtn: string;
    closeIconLabel: string;
    preferencesTitle: string;
    savePreferencesBtn: string;
    cookieUsageTitle: string;
    cookieUsageDescription: string;
    necessaryCookiesTitle: string;
    necessaryCookiesDescription: string;
    analyticsCookiesTitle: string;
    analyticsCookiesDescription: string;
  };
  profileInsights: {
    toggleLabel: string;
    title: string;
    description: string;
  };
  errors: {
    boundaryTitle: string;
    boundaryMessage: string;
    retryButton: string;
    analyticsError: string;
  };
  seo: {
    title: string;
    description: string;
  };
  dynamicContent: {
    defaultGreeting: string;
    defaultTagline: string;
    defaultIntro: string;
    viewMyWork: string;
    professionalSummary: string;
    fullStackProficiency: string;
    problemSolving: string;
    modernFrameworks: string;
    keyHighlights: {
      ml: string;
      fullstack: string;
      problemSolving: string;
      experience: string;
    };
  };
  dates: {
    months: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
    present: string;
  };
  visitor: {
    recruiter: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    hr_manager: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    technical_lead: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    c_level_executive: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    agency_recruiter: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    startup_founder: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    product_manager: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    project_manager: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    business_owner: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    enterprise_client: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    local_business: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    remote_work_advocate: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    international_client: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    local_tech_community: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    general_visitor: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    returning_visitor: {
      greeting: string;
      tagline: string;
      cta: string;
    };
    potential_collaborator: {
      greeting: string;
      tagline: string;
      cta: string;
    }
  }
}

export interface Translations {
  [key: string]: LanguageSpecificTranslations;
}

export const translations: Translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      publications: 'Publications',
      certificates: 'Certificates',
      contact: 'Contact',
      logoAlt: 'KC',
      toggleNav: 'Toggle navigation',
    },
    general: {
        scrollToTop: 'Scroll to Top',
        closeModal: 'Close Modal',
        viewCertificate: 'View Certificate',
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
        noResults: 'No results',
        skipToMain: 'Skip to main content',
        skipToNav: 'Skip to navigation',
        openInNewTab: 'Open in new tab',
        externalLink: 'External link',
    },
    theme: {
      toggleLight: 'Switch to light mode',
      toggleDark: 'Switch to dark mode',
      changedToLight: 'Theme changed to light mode.',
      changedToDark: 'Theme changed to dark mode.',
    },
    languageSwitcher: {
        label: 'Change language',
        en: 'English',
        de: 'German',
        fr: 'French',
        ar: 'Arabic',
    },
    home: {
      greeting: 'Hello, I am',
      name: 'Khalil Charfi.',
      tagline: 'I craft powerful digital experiences.',
      intro:
        "I design and build exceptional digital products. As a Full-Stack Engineer, I specialize in creating intuitive, high-performance web and mobile applications that are both scalable and user-centric.",
      viewWorkBtn: 'Explore My Projects',
      getInTouchBtn: 'Get In Touch',
      recommendedForYou: 'Recommended for you:',
    },
    about: {
      title: 'About Me',
      sectionContent: {
          p1: "My journey into tech started with a fascination for solving complex problems with elegant code. I thrive on turning ideas into reality, from conceptualization to deployment, and I'm passionate about creating seamless user interfaces that are both beautiful and highly functional.",
          imagePlaceholder: "Crafting code, building solutions.",
      },
      professionalSummaryTitle: 'Professional Summary',
      professionalSummary: 'Full-stack engineer with extensive experience delivering scalable web and mobile applications. Skilled in front-end development with Vue.js and Angular, back-end with Laravel and Laminas, and mobile apps using Flutter and Ionic. Passionate about clean architecture, offline-first capabilities, and DevOps-driven deployment. Experienced in cross-functional teams across Tunisia and Germany.',
      languagesTitle: 'Languages',
      languages: [
        { lang: 'Arabic', proficiency: 'Native' },
        { lang: 'English', proficiency: 'Fluent' },
        { lang: 'French', proficiency: 'Fluent' },
      ],
      keyHighlightsTitle: 'Key Highlights',
    },
    skills: {
      title: 'Core Technical Skills',
      categories: {
        frontend: { name: 'Front-End', items: ['Vue.js', 'Angular', 'JavaScript/TypeScript', 'HTML5', 'CSS3 (Sass/LESS)', 'Bootstrap'] },
        backend: { name: 'Back-End', items: ['PHP (Laravel, Laminas)', 'Java (Spring Boot)'] },
        mobile: { name: 'Mobile Development', items: ['Flutter', 'Ionic', 'Android (Java)'] },
        databases: { name: 'Databases & APIs', items: ['MySQL', 'MongoDB', 'SQLite', 'CouchDB', 'GraphQL (Apollo Client)'] },
        devops: { name: 'DevOps & CI/CD', items: ['Git', 'Docker', 'Jenkins', 'GitLab CI/CD', 'Bitrise', 'Puppet'] },
        tools: { name: 'Others & Tools', items: ['Drupal', 'Keycloak', 'Firebase', 'Mapbox GL', 'WSO2 CEP', 'JHipster', 'TestCafe', 'Cucumber', 'Grafana', 'Kibana'] },
      },
      focusAreasLabel: 'Focus areas:',
      focusAI: 'AI Focus',
      focusWebDev: 'Web Development Focus',
      focusDataScience: 'Data Science Focus',
      priorityProgramming: 'Programming Priority',
      priorityFrameworks: 'Frameworks Priority',
      priorityTools: 'Tools Priority',
      priorityDatabases: 'Databases Priority',
    },
    experience: {
      title: 'Experience',
      items: [
        {
          title: 'Software Engineer – Fullstack Developer',
          company: 'CHECK24 Vergleichsportal GmbH',
          location: 'Frankfurt, Germany',
          date: 'Aug 2022 – Present',
          description: [
            'Improved front-end performance and user interaction on Germany\'s top comparison platform using Vue.js and Laminas.',
            'Enhanced the bicycle insurance (Fahrradversicherung) product with advanced features and REST API integration.',
            'Contributed to the redesign of Drupal components and embedded analytics tracking.',
            'Applied caching and optimized database queries for faster loading and smoother user flow.',
          ],
        },
        {
          title: 'Software Engineer – Full-Stack Developer',
          company: 'ASM - All Soft Multimedia',
          location: 'Sfax, Tunisia',
          date: 'Jan 2019 – Aug 2022',
          description: [
            'Led development of web and mobile apps across sectors including retail, restaurants, and inventory management.',
            'Built hybrid mobile apps with Flutter and Ionic, featuring offline sync via CouchDB/PouchDB.',
            'Delivered projects such as: Cover 3D Mobile (field sales tool), 3andi & 3andi Partner (loyalty apps), ProInventory & ProCaisse Mobility (inventory/sales tracking).',
            'Ensured secure access and authentication with Keycloak.',
          ],
        },
        {
          title: 'Software Engineer – Mobile Developer',
          company: 'MyBus – Monkey Factory',
          location: 'Sfax, Tunisia',
          date: 'Mar 2020 – Nov 2020',
          description: [
            'Built a real-time public transportation app using Ionic, Angular, and Mapbox GL.',
            'Integrated GraphQL with Apollo Client for efficient data updates.',
            'Enabled CI/CD with Docker and GitLab for faster iterations.',
          ],
        },
        {
            title: 'Front-End Developer',
            company: 'Softtodo IT Solutions',
            location: 'Sfax, Tunisia',
            date: 'May 2018 – Dec 2018',
            description: [
                'Modernized IRIDION\'s e-commerce UI using Bootstrap and responsive design.',
                'Implemented dynamic JSP components and A/B testing tools.',
            ]
        },
        {
            title: 'Android Developer',
            company: 'ASM - All Soft Multimedia',
            location: 'Sfax, Tunisia',
            date: 'Mar 2017 – May 2018',
            description: [
                'Delivered business-critical Android apps with offline capabilities and secure sync via SQLite and Laravel.',
                'Built custom tools like DUX Mobile (ERP companion), FastQueue (queue system via Bluetooth), and ProCaisse Mobile.',
            ]
        },
        {
            title: 'Researcher – THERALYTICS Project',
            company: 'University of Marburg / Digital Research Centre of Sfax',
            location: 'Germany & Tunisia',
            date: 'Oct 2016 – Feb 2017',
            description: [
                'Developed a cardiac monitoring prototype using IoT sensors and Complex Event Processing (WSO2 CEP).',
                'Designed real-time alert systems and data pipelines with Spring Boot, MongoDB, and JHipster.',
                'Collaborated in international research for early detection of cardiac anomalies.',
            ]
        }
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          degree: 'Master of Science, Enterprise Systems Engineering',
          institution: 'Higher Institute of Informatics and Multimedia of Sfax',
          date: 'Sep 2014 – Feb 2017',
          details: 'Focused on designing and building large-scale software systems and enterprise architectures.'
        },
        {
          degree: "Bachelor\'s Degree, Computer Science",
          institution: 'Higher Institute of Informatics and Multimedia of Sfax',
          date: 'Sep 2011 – Jun 2014',
          details: 'Gained a strong foundation in algorithms, data structures, and software development principles.'
        }
      ]
    },
    projects: {
      title: 'My Projects',
      items: [
        {
            title: 'Cover 3D Mobile (ASM)',
            description: 'A field sales tool for sales representatives with dynamic forms generation, complex pricing logic, multimedia support for product presentations, and offline capabilities with CouchDB/PouchDB sync.',
            tech: ['Ionic', 'Angular', 'CouchDB', 'PouchDB', 'Keycloak'],
        },
        {
            title: '3andi & 3andi Partner (ASM)',
            description: 'Customer and vendor loyalty applications. Features included QR code scanning for points, promotional offers, and Firebase for push notifications and analytics.',
            tech: ['Flutter', 'Firebase (Auth, Firestore, FCM)', 'Node.js'],
        },
        {
            title: 'Public Transportation App (MyBus)',
            description: 'Real-time tracking and information for public transport users. Leveraged Mapbox GL for interactive maps and GraphQL for efficient data fetching.',
            tech: ['Ionic', 'Angular', 'Mapbox GL', 'GraphQL', 'Apollo Client', 'Docker'],
        },
        {
            title: 'Cardiac Monitoring Prototype (Theralytics)',
            description: 'IoT-based cardiac anomaly detection system using wearable sensors. Developed real-time data processing pipelines and alert systems with WSO2 CEP, Spring Boot, and MongoDB.',
            tech: ['Java', 'Spring Boot', 'WSO2 CEP', 'MongoDB', 'JHipster', 'IoT'],
        }
      ],
      linksUnavailable: 'Links available upon request or project is private.',
      liveDemoLabel: 'Live Demo',
      githubRepoLabel: 'GitHub',
    },
    publications: {
      title: 'Publications',
      items: [
        {
          title: 'CEP4HFP: Complex Event Processing for Heart Failure Prediction',
          authors: 'Afef Mdhaffar, Ismael Bouassida Rodriguez, Khalil Charfi, Leila Abid, and Bernd Freisleben',
          journal: 'IEEE Transactions on Nanobioscience, Vol. 16, No. 8',
          date: 'December 2017',
          abstract: "This paper presents a novel health analysis approach for heart failure prediction. It is based on the use of complex event processing (CEP) technology, combined with statistical approaches. A CEP engine processes incoming health data by executing threshold-based analysis rules. Instead of having to manually set up thresholds, our novel statistical algorithm automatically computes and updates thresholds according to recorded historical data. Experimental results demonstrate the merits of our approach in terms of speed, precision, and recall.",
          link: "https://ieeexplore.ieee.org/document/8094944",
          viewLabel: "View Publication"
        }
      ]
    },
    certificates: {
      title: 'Certificates & Awards',
      items: [
        {
          id: 'cert-presentation-darmstadt-2016',
          title: 'Certificate for Presentation at 2nd DAAD Workshop on E-health',
          subtitle: 'A Reactive Monitoring Approach for Cardiac Patients (Heart Failure)',
          issuer: 'DAAD Workshop on E-health',
          date: 'December 7-9, 2016',
          location: 'Darmstadt, Germany',
          imageUrl: './asset/Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg',
        },
        {
          id: 'cert-attendance-theralytics-darmstadt-2016',
          title: 'Certificate of Attendance for The Second DAAD Theralytics Workshop',
          issuer: 'DAAD Theralytics Workshop',
          date: 'December 7-9, 2016',
          location: 'Darmstadt, Germany',
          imageUrl: './asset/Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg',
        },
        {
          id: 'cert-presentation-sfax-2016',
          title: 'Certificate for Presentation at 1st DAAD Workshop on E-health',
          subtitle: 'A Reactive Monitoring Approach for Cardiac Patients (Heart Failure)',
          issuer: 'DAAD Workshop on E-health',
          date: 'September 28, 2016',
          location: 'Sfax, Tunisia',
          imageUrl: './asset/Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg',
        },
        {
          id: 'cert-attendance-sfax-2016',
          title: 'Certificate of Attendance for DAAD E-Health Workshop',
          issuer: 'DAAD E-Health Workshop',
          date: 'September 28, 2016',
          location: 'Sfax, Tunisia',
          imageUrl: './asset/Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg',
        },
        {
          id: 'cert-cardiac-patient-monitoring',
          title: 'Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring',
          issuer: 'DAAD E-Health Workshop',
          date: '2016',
          imageUrl: './asset/Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg',
        },
      ],
    },
    contact: {
      title: "Let\'s Build Something Great",
      intro: "I\'m always open to discussing new projects, collaborations, or opportunities. Have a question or just want to say hi? Feel free to reach out.",
      message: "I'm always open to discussing new projects, collaborations, or opportunities. Have a question or just want to say hi? Feel free to reach out.",
      form: {
        nameLabel: 'Name',
        emailLabel: 'Email',
        messageLabel: 'Message',
        sendBtn: 'Send Message',
        submitting: 'Sending...',
        successTitle: 'Message Sent!',
        successMessage: "Thank you for reaching out! I\'ll get back to you as soon as possible.",
        sendAnother: 'Send Another Message',
        demoAlert: 'Thank you for your message! (This is a demo, no email was sent)',
        emailError: 'Please enter a valid email address.',
        requiredError: 'This field is required.',
      },
      connectTitle: 'Connect with me',
      emailAria: 'Email Khalil Charfi',
      linkedinAria: "Khalil Charfi\'s LinkedIn Profile",
      githubAria: "Khalil Charfi\'s GitHub Profile",
    },
    footer: {
      copyright: '© {{year}} Khalil Charfi. All rights reserved.',
      credits: 'Designed & Built by Khalil Charfi (with AI assistance)',
    },
    chatbot: {
      title: "AI Assistant",
      placeholder: "Ask about my skills, projects...",
      initialMessage: "Hello! I\'m Khalil\'s AI assistant. I can answer questions about his portfolio. How can I help?",
      openAria: "Open AI Assistant Chat",
      closeAria: "Close AI Assistant Chat",
      sendAria: "Send message",
      send: "Send",
    },
    cookieConsent: {
      title: "Cookie Consent",
      description: "We use cookies to ensure you get the best experience on our website. By continuing to use this site, you agree to our use of cookies.",
      acceptAllBtn: "Accept All",
      acceptNecessaryBtn: "Accept Necessary",
      showPreferencesBtn: "Show Preferences",
      closeIconLabel: "Close",
      preferencesTitle: "Cookie Preferences",
      savePreferencesBtn: "Save Preferences",
      cookieUsageTitle: "Cookie Usage",
      cookieUsageDescription: "This website uses cookies to improve your experience while you navigate through the website. Out of these, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website, and tailor our advertisements to your interests.",
      necessaryCookiesTitle: "Necessary cookies",
      necessaryCookiesDescription: "These cookies are necessary for the website to function properly. Without these cookies, the website would not work properly.",
      analyticsCookiesTitle: "Analytics cookies",
      analyticsCookiesDescription: "These cookies are used to collect information about how you use the website. We use this information to improve our website and tailor our advertisements to your interests."
    },
    profileInsights: {
      toggleLabel: "Toggle Profile Insights",
      title: "Profile Insights",
      description: "Discover insights about Khalil's professional journey and skills."
    },
    errors: {
      boundaryTitle: "Error Boundary",
      boundaryMessage: "Something went wrong. Please try again.",
      retryButton: "Retry",
      analyticsError: "An error occurred while fetching analytics data."
    },
    seo: {
        title: "Khalil Charfi | Full-Stack Engineer Portfolio",
        description: "Explore the projects and experience of Khalil Charfi, a specialist in scalable and user-centric web and mobile applications."
    },
    dynamicContent: {
      defaultGreeting: 'Hello, I am',
      defaultTagline: 'I craft powerful digital experiences.',
      defaultIntro: "I design and build exceptional digital products. As a Full-Stack Engineer, I specialize in creating intuitive, high-performance web and mobile applications that are both scalable and user-centric.",
      viewMyWork: 'Explore My Projects',
      professionalSummary: 'Full-stack engineer with extensive experience delivering scalable web and mobile applications. Skilled in front-end development with Vue.js and Angular, back-end with Laravel and Laminas, and mobile apps using Flutter and Ionic. Passionate about clean architecture, offline-first capabilities, and DevOps-driven deployment. Experienced in cross-functional teams across Tunisia and Germany.',
      fullStackProficiency: 'Full-stack web development proficiency',
      problemSolving: 'Strong problem-solving and analytical skills',
      modernFrameworks: 'Experience with modern frameworks and technologies',
      keyHighlights: {
        ml: 'Machine Learning',
        fullstack: 'Full-Stack Development',
        problemSolving: 'Problem Solving',
        experience: 'Extensive Experience',
      },
    },
    dates: {
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
      },
      present: 'Present',
    },
    visitor: {
      recruiter: {
        greeting: "Welcome, Talent Acquisition Professional!",
        tagline: "Experienced Full-Stack Developer Ready for Your Next Opportunity",
        cta: "Download Resume & Schedule Interview"
      },
      hr_manager: {
        greeting: "Hello HR Professional!",
        tagline: "Collaborative Team Player with Strong Technical & Soft Skills",
        cta: "View Cultural Fit & Values"
      },
      technical_lead: {
        greeting: "Greetings, Technical Leader!",
        tagline: "Senior Developer with Architecture & Leadership Experience",
        cta: "Explore Technical Deep Dive"
      },
      c_level_executive: {
        greeting: "Welcome, Executive Leader!",
        tagline: "Strategic Technology Partner Driving Business Results",
        cta: "Discuss Strategic Partnership"
      },
      agency_recruiter: {
        greeting: "Hello Recruiting Partner!",
        tagline: "Versatile Developer Available for Client Placements",
        cta: "View Availability & Rates"
      },
      startup_founder: {
        greeting: "Hey Fellow Entrepreneur!",
        tagline: "Technical Co-Founder & MVP Specialist Ready to Scale",
        cta: "Let's Build Your Vision"
      },
      product_manager: {
        greeting: "Hello Product Leader!",
        tagline: "User-Focused Developer with Product Development Expertise",
        cta: "Collaborate on Product Strategy"
      },
      project_manager: {
        greeting: "Welcome Project Manager!",
        tagline: "Reliable Developer with Proven Delivery Track Record",
        cta: "Plan Your Next Project"
      },
      business_owner: {
        greeting: "Hello Business Owner!",
        tagline: "Technology Solutions Partner for Business Growth",
        cta: "Explore Business Solutions"
      },
      enterprise_client: {
        greeting: "Welcome Enterprise Partner!",
        tagline: "Enterprise-Grade Solutions with Security & Scalability",
        cta: "Discuss Enterprise Needs"
      },
      local_business: {
        greeting: "Hello Local Business!",
        tagline: "Your Neighborhood Tech Partner for Digital Growth",
        cta: "Support Local Innovation"
      },
      remote_work_advocate: {
        greeting: "Greetings Remote Work Champion!",
        tagline: "Experienced Remote Developer with Global Collaboration Skills",
        cta: "Explore Remote Opportunities"
      },
      international_client: {
        greeting: "Welcome International Partner!",
        tagline: "Global Developer with Cross-Cultural Project Experience",
        cta: "Connect Across Borders"
      },
      local_tech_community: {
        greeting: "Hey Tech Community!",
        tagline: "Active Community Member & Knowledge Sharing Enthusiast",
        cta: "Join the Conversation"
      },
      general_visitor: {
        greeting: "Welcome to My Portfolio!",
        tagline: "Full-Stack Developer Creating Innovative Digital Solutions",
        cta: "Explore My Work"
      },
      returning_visitor: {
        greeting: "Welcome Back!",
        tagline: "Discover What's New in My Development Journey",
        cta: "See Recent Updates"
      },
      potential_collaborator: {
        greeting: "Hello Future Collaborator!",
        tagline: "Open Source Contributor Ready for Partnership",
        cta: "Start Collaboration"
      }
    }
  },
  de: {
    nav: {
      home: 'Startseite',
      about: 'Über mich',
      skills: 'Fähigkeiten',
      experience: 'Erfahrung',
      education: 'Ausbildung',
      projects: 'Projekte',
      publications: 'Publikationen',
      certificates: 'Zertifikate',
      contact: 'Kontakt',
      logoAlt: 'KC',
      toggleNav: 'Navigation umschalten',
    },
    general: {
        scrollToTop: 'Nach oben scrollen',
        closeModal: 'Modal schließen',
        viewCertificate: 'Zertifikat ansehen',
        loading: 'Laden...',
        error: 'Fehler',
        retry: 'Erneut versuchen',
        noResults: 'Keine Ergebnisse',
        skipToMain: 'Zum Hauptinhalt springen',
        skipToNav: 'Zum Navigationsmenü springen',
        openInNewTab: 'In neuem Tab öffnen',
        externalLink: 'Externer Link',
    },
    theme: {
      toggleLight: 'Zum hellen Modus wechseln',
      toggleDark: 'Zum dunklen Modus wechseln',
      changedToLight: 'Theme auf hellen Modus geändert.',
      changedToDark: 'Theme auf dunklen Modus geändert.',
    },
     languageSwitcher: {
        label: 'Sprache ändern',
        en: 'Englisch',
        de: 'Deutsch',
        fr: 'Französisch',
        ar: 'Arabisch',
    },
    home: {
      greeting: 'Willkommen! Ich bin', // More welcoming and professional
      name: 'Khalil Charfi.',
      tagline: 'Ich entwickle überzeugende digitale Lösungen.', // More natural German phrasing
      intro:
        "Ich konzipiere und entwickle außergewöhnliche digitale Produkte. Als Full-Stack-Entwickler spezialisiere ich mich auf intuitive, hochperformante Web- und Mobilanwendungen, die skalierbar und benutzerzentriert sind.", // More natural flow, "Full-Stack-Entwickler" is more common than "Ingenieur"
      viewWorkBtn: 'Projekte ansehen',
      getInTouchBtn: 'Kontakt aufnehmen',
      recommendedForYou: 'Empfohlen für Sie:',
    },
    about: {
      title: 'Über Mich',
      sectionContent: {
          p1: "Meine Reise in die Tech-Welt begann mit der Faszination, komplexe Probleme mit elegantem Code zu lösen. Ich lebe davon, Ideen in die Realität umzusetzen, von der Konzeption bis zur Bereitstellung, und es ist meine Leidenschaft, nahtlose Benutzeroberflächen zu schaffen, die sowohl schön als auch hochfunktional sind.",
          imagePlaceholder: "Code gestalten, Lösungen bauen.",
      },
      professionalSummaryTitle: 'Berufliches Profil',
      professionalSummary: 'Full-Stack-Entwickler mit umfangreicher Erfahrung in der Entwicklung skalierbarer Web- und Mobile-Anwendungen. Versiert im Frontend mit Vue.js und Angular, im Backend mit Laravel und Laminas sowie in der mobilen Entwicklung mit Flutter und Ionic. Mit Leidenschaft für Clean Architecture, Offline-First-Ansätze und DevOps-getriebene Deployments. Erfahrung in crossfunktionalen Teams in Tunesien und Deutschland.',
      languagesTitle: 'Sprachen',
      languages: [
        { lang: 'Arabisch', proficiency: 'Muttersprache' },
        { lang: 'Englisch', proficiency: 'Fließend' },
        { lang: 'Französisch', proficiency: 'Fließend' },
      ],
      keyHighlightsTitle: 'Schlüsselmerkmale',
    },
     skills: {
      title: 'Technische Kernkompetenzen',
      categories: {
        frontend: { name: 'Front-End', items: ['Vue.js', 'Angular', 'JavaScript/TypeScript', 'HTML5', 'CSS3 (Sass/LESS)', 'Bootstrap'] },
        backend: { name: 'Back-End', items: ['PHP (Laravel, Laminas)', 'Java (Spring Boot)'] },
        mobile: { name: 'Mobile Entwicklung', items: ['Flutter', 'Ionic', 'Android (Java)'] },
        databases: { name: 'Datenbanken & APIs', items: ['MySQL', 'MongoDB', 'SQLite', 'CouchDB', 'GraphQL (Apollo Client)'] },
        devops: { name: 'DevOps & CI/CD', items: ['Git', 'Docker', 'Jenkins', 'GitLab CI/CD', 'Bitrise', 'Puppet'] },
        tools: { name: 'Sonstiges & Werkzeuge', items: ['Drupal', 'Keycloak', 'Firebase', 'Mapbox GL', 'WSO2 CEP', 'JHipster', 'TestCafe', 'Cucumber', 'Grafana', 'Kibana'] },
      },
      focusAreasLabel: 'Schwerpunkte:',
      focusAI: 'Schwerpunkt KI',
      focusWebDev: 'Schwerpunkt Webentwicklung',
      focusDataScience: 'Schwerpunkt Data Science',
      priorityProgramming: 'Programmierung Priorität',
      priorityFrameworks: 'Frameworks Priorität',
      priorityTools: 'Werkzeuge Priorität',
      priorityDatabases: 'Datenbanken Priorität',
    },
    experience: {
      title: 'Erfahrung',
      items: [
        {
          title: 'Software Engineer – Fullstack Entwickler',
          company: 'CHECK24 Vergleichsportal GmbH',
          location: 'Frankfurt, Deutschland',
          date: 'Aug 2022 – Heute',
          description: [
            'Verbesserung der Frontend-Performance und Benutzerinteraktion auf Deutschlands führender Vergleichsplattform mit Vue.js und Laminas.',
            'Erweiterung des Produkts Fahrradversicherung um fortschrittliche Funktionen und REST-API-Integration.',
            'Mitwirkung am Redesign von Drupal-Komponenten und der Einbettung von Analytics-Tracking.',
            'Anwendung von Caching und Optimierung von Datenbankabfragen für schnellere Ladezeiten.',
          ],
        },
        {
          title: 'Software Engineer – Full-Stack Entwickler',
          company: 'ASM - All Soft Multimedia',
          location: 'Sfax, Tunesien',
          date: 'Jan 2019 – Aug 2022',
          description: [
            'Leitung der Entwicklung von Web- und mobilen Apps für Einzelhandel, Gastronomie und Bestandsverwaltung.',
            'Erstellung hybrider mobiler Apps mit Flutter und Ionic, mit Offline-Synchronisation über CouchDB/PouchDB.',
            'Lieferung von Projekten wie: Cover 3D Mobile (Außendienst-Tool), 3andi & 3andi Partner (Kundenbindungs-Apps) und ProInventory.',
            'Sicherstellung von Zugriff und Authentifizierung mit Keycloak.',
          ],
        },
         {
          title: 'Software Engineer – Mobile Entwickler',
          company: 'MyBus – Monkey Factory',
          location: 'Sfax, Tunesien',
          date: 'Mär 2020 – Nov 2020',
          description: [
            'Entwicklung einer Echtzeit-App für den öffentlichen Nahverkehr mit Ionic, Angular und Mapbox GL.',
            'Integration von GraphQL mit Apollo Client für effiziente Daten-Updates.',
            'Ermöglichung von CI/CD mit Docker und GitLab für schnellere Iterationen.'
            ]
        },
         {
            title: 'Front-End Entwickler',
            company: 'Softtodo IT Solutions',
            location: 'Sfax, Tunesien',
            date: 'Mai 2018 – Dez 2018',
            description: [
                'Modernisierung der E-Commerce-Benutzeroberfläche von IRIDION mit Bootstrap und responsivem Design.',
                'Implementierung dynamischer JSP-Komponenten und A/B-Testwerkzeuge.'
            ]
        },
        {
            title: 'Android Entwickler',
            company: 'ASM - All Soft Multimedia',
            location: 'Sfax, Tunesien',
            date: 'Mär 2017 – Mai 2018',
            description: [
                'Lieferung geschäftskritischer Android-Apps mit Offline-Fähigkeiten und sicherer Synchronisation über SQLite und Laravel.',
                'Erstellung benutzerdefinierter Tools wie DUX Mobile (ERP-Begleiter), FastQueue (Warteschlangensystem) und ProCaisse Mobile.'
            ]
        },
         {
            title: 'Forscher – THERALYTICS Projekt',
            company: 'Universität Marburg / Digital Research Centre of Sfax',
            location: 'Deutschland & Tunesien',
            date: 'Okt 2016 – Feb 2017',
            description: [
                'Entwicklung eines Prototyps zur Herzüberwachung mittels IoT-Sensoren und Complex Event Processing (WSO2 CEP).',
                'Entwurf von Echtzeit-Alarmsystemen und Datenpipelines mit Spring Boot, MongoDB und JHipster.',
                'Mitarbeit an internationaler Forschung zur Früherkennung von Herzanomalien.'
            ]
        }
      ],
    },
    education: {
      title: 'Ausbildung',
      items: [
        {
          degree: 'Master of Science, Enterprise Systems Engineering',
          institution: 'Institut Supérieur d\'Informatique et de Multimédia de Sfax',
          date: 'Sep 2014 – Feb 2017',
          details: 'Schwerpunkt auf der Konzeption und dem Bau von großen Softwaresystemen und Unternehmensarchitekturen.'
        },
        {
          degree: 'Bachelor of Science, Informatik',
          institution: 'Institut Supérieur d\'Informatique et de Multimédia de Sfax',
          date: 'Sep 2011 – Jun 2014',
          details: 'Starke Grundlagen in Algorithmen, Datenstrukturen und den Prinzipien der Softwareentwicklung erworben.'
        }
      ]
    },
    projects: {
      title: 'Meine Projekte',
      items: [
         {
            title: 'Cover 3D Mobile (ASM)',
            description: 'Ein Außendienst-Tool für Vertriebsmitarbeiter mit dynamischer Formulargenerierung, komplexer Preislogik, Multimedia-Unterstützung für Produktpräsentationen und Offline-Funktionen mit CouchDB/PouchDB-Synchronisation.',
            tech: ['Ionic', 'Angular', 'CouchDB', 'PouchDB', 'Keycloak'],
        },
        {
            title: '3andi & 3andi Partner (ASM)',
            description: 'Kunden- und Händlerbindungsanwendungen. Zu den Funktionen gehörten das Scannen von QR-Codes für Punkte, Werbeangebote und Firebase für Push-Benachrichtigungen und Analysen.',
            tech: ['Flutter', 'Firebase', 'Node.js'],
        },
        {
            title: 'ÖPNV-App (MyBus)',
            description: 'Echtzeit-Tracking und Informationen für Nutzer öffentlicher Verkehrsmittel. Nutzte Mapbox GL für interaktive Karten und GraphQL für effizientes Datenabrufen.',
            tech: ['Ionic', 'Angular', 'Mapbox GL', 'GraphQL', 'Docker'],
        },
        {
            title: 'Herzüberwachungs-Prototyp (Theralytics)',
            description: 'IoT-basiertes System zur Erkennung von Herzanomalien mittels tragbarer Sensoren. Entwickelte Echtzeit-Datenverarbeitungspipelines und Alarmsysteme mit WSO2 CEP, Spring Boot und MongoDB.',
            tech: ['Java', 'Spring Boot', 'WSO2 CEP', 'MongoDB', 'JHipster', 'IoT'],
        }
      ],
      linksUnavailable: 'Links auf Anfrage verfügbar oder Projekt ist privat.',
      liveDemoLabel: 'Live Demo',
      githubRepoLabel: 'GitHub',
    },
    publications: {
      title: 'Publikationen',
      items: [
        {
          title: 'CEP4HFP: Komplexe Ereignisverarbeitung zur Vorhersage von Herzinsuffizienz',
          authors: 'Afef Mdhaffar, Ismael Bouassida Rodriguez, Khalil Charfi, Leila Abid, and Bernd Freisleben',
          journal: 'IEEE Transactions on Nanobioscience, Vol. 16, Nr. 8',
          date: 'Dezember 2017',
          abstract: "Dieses Paper stellt einen neuartigen Gesundheitsanalyseansatz zur Vorhersage von Herzinsuffizienz vor. Es basiert auf der Verwendung von Complex Event Processing (CEP)-Technologie in Kombination mit statistischen Ansätzen. Eine CEP-Engine verarbeitet eingehende Gesundheitsdaten durch die Ausführung von schwellenwertbasierten Analyseregeln. Anstatt Schwellenwerte manuell einrichten zu müssen, berechnet und aktualisiert unser neuartiger statistischer Algorithmus die Schwellenwerte automatisch anhand aufgezeichneter historischer Daten.",
          link: "https://ieeexplore.ieee.org/document/8094944",
          viewLabel: "Publikation ansehen"
        }
      ]
    },
    certificates: {
      title: 'Zertifikate & Auszeichnungen',
      items: [
        {
          id: 'cert-presentation-darmstadt-2016',
          title: 'Zertifikat für Präsentation beim 2. DAAD Workshop für E-Health',
          subtitle: 'Ein reaktiver Überwachungsansatz für Herzpatienten (Herzinsuffizienz)',
          issuer: 'DAAD Workshop für E-Health',
          date: '7.-9. Dezember 2016',
          location: 'Darmstadt, Deutschland',
          imageUrl: './asset/Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg',
        },
        {
          id: 'cert-attendance-theralytics-darmstadt-2016',
          title: 'Teilnahmezertifikat für den Zweiten DAAD Theralytics Workshop',
          issuer: 'DAAD Theralytics Workshop',
          date: '7.-9. Dezember 2016',
          location: 'Darmstadt, Deutschland',
          imageUrl: './asset/Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg',
        },
        {
          id: 'cert-presentation-sfax-2016',
          title: 'Zertifikat für Präsentation beim 1. DAAD Workshop für E-Health',
          subtitle: 'Ein reaktiver Überwachungsansatz für Herzpatienten (Herzinsuffizienz)',
          issuer: 'DAAD Workshop für E-Health',
          date: '28. September 2016',
          location: 'Sfax, Tunesien',
          imageUrl: './asset/Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg',
        },
        {
          id: 'cert-attendance-sfax-2016',
          title: 'Teilnahmezertifikat für DAAD E-Health Workshop',
          issuer: 'DAAD E-Health Workshop',
          date: '28. September 2016',
          location: 'Sfax, Tunesien',
          imageUrl: './asset/Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg',
        },
        {
          id: 'cert-cardiac-patient-monitoring',
          title: 'Teilnahmezertifikat E-Health Workshop über Herzpatientenüberwachung',
          issuer: 'DAAD E-Health Workshop',
          date: '2016',
          imageUrl: './asset/Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg',
        },
      ],
    },
    contact: {
              title: 'Lassen Sie uns zusammenarbeiten',
        intro: "Ich freue mich über Austausch zu neuen Projekten, Kooperationen oder beruflichen Möglichkeiten. Sie haben eine Frage oder möchten einfach Hallo sagen? Kontaktieren Sie mich gerne.",
        message: "Ich freue mich über Austausch zu neuen Projekten, Kooperationen oder beruflichen Möglichkeiten. Sie haben eine Frage oder möchten einfach Hallo sagen? Kontaktieren Sie mich gerne.",
      form: {
        nameLabel: 'Name',
        emailLabel: 'E-Mail',
        messageLabel: 'Nachricht',
        sendBtn: 'Nachricht senden',
        submitting: 'Wird gesendet...',
        successTitle: 'Nachricht gesendet!',
        successMessage: 'Vielen Dank für Ihre Nachricht! Ich werde mich so schnell wie möglich bei Ihnen melden.',
        sendAnother: 'Weitere Nachricht senden',
        demoAlert: 'Vielen Dank für Ihre Nachricht! (Dies ist eine Demo, es wurde keine E-Mail gesendet)',
        emailError: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        requiredError: 'Dieses Feld ist erforderlich.',
      },
      connectTitle: 'Vernetzen Sie mich',
      emailAria: 'E-Mail an Khalil Charfi',
      linkedinAria: "Khalil Charfis LinkedIn Profil",
      githubAria: "Khalil Charfis GitHub Profil",
    },
    footer: {
      copyright: '© {{year}} Khalil Charfi. Alle Rechte vorbehalten.',
      credits: 'Entworfen & erstellt von Khalil Charfi (mit KI-Unterstützung)',
    },
    chatbot: {
      title: "KI-Assistent",
      placeholder: "Fragen zu Skills, Projekten...",
      initialMessage: "Hallo! Ich bin Khalils KI-Assistent. Ich kann Fragen zu seinem Portfolio beantworten. Wie kann ich helfen?",
      openAria: "KI-Assistenten-Chat öffnen",
      closeAria: "KI-Assistenten-Chat schließen",
      sendAria: "Nachricht senden",
      send: "Senden",
    },
    cookieConsent: {
      title: "Cookie Consent",
      description: "Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. Indem Sie diese Seite nutzen, erklären Sie sich mit der Verwendung von Cookies einverstanden.",
      acceptAllBtn: "Alle akzeptieren",
      acceptNecessaryBtn: "Nur notwendige akzeptieren",
      showPreferencesBtn: "Einstellungen anzeigen",
      closeIconLabel: "Schließen",
      preferencesTitle: "Cookie-Einstellungen",
      savePreferencesBtn: "Enregistrer les préférences",
      cookieUsageTitle: "Utilisation des cookies",
      cookieUsageDescription: "Ce site web utilise des cookies pour améliorer votre expérience lorsque vous naviguez sur le site. Parmi ces cookies, les cookies nécessaires sont stockés dans votre navigateur car ils sont indispensables pour le bon fonctionnement des fonctionnalités de base du site. Nous utilisons également des cookies tiers qui nous aident à analyser et à comprendre comment vous utilisez ce site, et à nous aider à améliorer l'annonce de publicités qui pourraient vous intéresser.",
      necessaryCookiesTitle: "Cookies nécessaires",
      necessaryCookiesDescription: "Ces cookies sont nécessaires pour que le site fonctionne correctement. Sans ces cookies, le site ne fonctionnerait pas correctement.",
      analyticsCookiesTitle: "Cookies d'analyse",
              analyticsCookiesDescription: "Ces cookies sont utilisés pour collecter des informations sur la manière dont vous utilisez le site. Nous utilisons ces informations pour améliorer notre site et personnaliser l'annonce de publicités qui pourrait vous intéresser."
    },
    profileInsights: {
      toggleLabel: "Basculer les aperçus du profil",
      title: "Aperçus du profil",
      description: "Découvrez des aperçus sur le parcours professionnel et les compétences de Khalil."
    },
    errors: {
      boundaryTitle: "Limite d'erreur",
      boundaryMessage: "Quelque chose s'est mal passé. Veuillez réessayer.",
      retryButton: "Réessayer",
      analyticsError: "Une erreur s'est produite lors de la récupération des données d'analyse."
    },
    seo: {
        title: "Khalil Charfi | Full-Stack-Ingenieur Portfolio",
        description: "Entdecken Sie die Projekte und Erfahrungen von Khalil Charfi, einem Spezialisten für skalierbare und benutzerzentrierte Web- und Mobilanwendungen."
    },
    dynamicContent: {
      defaultGreeting: 'Willkommen! Ich bin',
      defaultTagline: 'Ich entwickle überzeugende digitale Lösungen.',
      defaultIntro: "Ich konzipiere und entwickle außergewöhnliche digitale Produkte. Als Full-Stack-Entwickler spezialisiere ich mich auf intuitive, hochperformante Web- und Mobilanwendungen, die skalierbar und benutzerzentriert sind.",
      viewMyWork: 'Projekte ansehen',
      professionalSummary: 'Full-Stack-Entwickler mit umfangreicher Erfahrung in der Entwicklung skalierbarer Web- und Mobile-Anwendungen. Versiert im Frontend mit Vue.js und Angular, im Backend mit Laravel und Laminas sowie in der mobilen Entwicklung mit Flutter und Ionic. Mit Leidenschaft für Clean Architecture, Offline-First-Ansätze und DevOps-getriebene Deployments. Erfahrung in crossfunktionalen Teams in Tunesien und Deutschland.',
      fullStackProficiency: 'Umfassende Full-Stack-Entwicklungskompetenz',
      problemSolving: 'Ausgeprägte Problemlösungs- und Analysefähigkeiten',
      modernFrameworks: 'Versiert in modernen Frameworks und Technologien',
      keyHighlights: {
        ml: 'Maschinelles Lernen',
        fullstack: 'Full-Stack-Entwicklung',
        problemSolving: 'Problemlösung',
        experience: 'Umfangreiche Erfahrung',
      },
    },
    dates: {
      months: {
        january: 'Januar',
        february: 'Februar',
        march: 'März',
        april: 'April',
        may: 'Mai',
        june: 'Juni',
        july: 'Juli',
        august: 'August',
        september: 'September',
        october: 'Oktober',
        november: 'November',
        december: 'Dezember',
      },
      present: 'Gegenwärtig',
    },
    visitor: {
      recruiter: {
        greeting: "Willkommen, Talent-Akquisitions-Profi!",
        tagline: "Erfahrener Full-Stack-Entwickler bereit für Ihre nächste Gelegenheit",
        cta: "Lebenslauf herunterladen & Interview vereinbaren"
      },
      hr_manager: {
        greeting: "Hallo HR-Profi!",
        tagline: "Kollaborativer Teamplayer mit starken technischen & sozialen Fähigkeiten",
        cta: "Kulturelle Passung & Werte ansehen"
      },
      technical_lead: {
        greeting: "Grüße, Technischer Leiter!",
        tagline: "Senior-Entwickler mit Architektur- & Führungserfahrung",
        cta: "Technischen Deep-Dive erkunden"
      },
      c_level_executive: {
        greeting: "Willkommen, Führungskraft!",
        tagline: "Strategischer Technologie-Partner für Geschäftsergebnisse",
        cta: "Strategische Partnerschaft besprechen"
      },
      agency_recruiter: {
        greeting: "Hallo Recruiting-Partner!",
        tagline: "Vielseitiger Entwickler verfügbar für Kundenplatzierungen",
        cta: "Verfügbarkeit & Preise ansehen"
      },
      startup_founder: {
        greeting: "Hey Mitunternehmer!",
        tagline: "Technischer Co-Founder & MVP-Spezialist bereit zum Skalieren",
        cta: "Lass uns deine Vision bauen"
      },
      product_manager: {
        greeting: "Hallo Produktleiter!",
        tagline: "Nutzerorientierter Entwickler mit Produktentwicklungsexpertise",
        cta: "An Produktstrategie zusammenarbeiten"
      },
      project_manager: {
        greeting: "Willkommen Projektmanager!",
        tagline: "Zuverlässiger Entwickler mit bewährter Lieferhistorie",
        cta: "Nächstes Projekt planen"
      },
              business_owner: {
          greeting: "Hallo Geschäftsinhaber!",
          tagline: "Technologie-Lösungspartner für Geschäftswachstum",
          cta: "Geschäftslösungen erkunden"
        },
        enterprise_client: {
          greeting: "Willkommen Unternehmenspartner!",
          tagline: "Enterprise-Lösungen mit Sicherheit & Skalierbarkeit",
          cta: "Discuss Enterprise Needs"
        },
        local_business: {
          greeting: "Hallo lokales Unternehmen!",
          tagline: "Ihr Nachbarschafts-Tech-Partner für digitales Wachstum",
          cta: "Lokale Innovation unterstützen"
        },
        remote_work_advocate: {
          greeting: "Grüße Remote-Work-Champion!",
          tagline: "Erfahrener Remote-Entwickler mit globalen Kollaborationsfähigkeiten",
          cta: "Explorer Remote Opportunities"
        },
        international_client: {
          greeting: "Willkommen internationaler Partner!",
          tagline: "Global Developer with Cross-Cultural Project Experience",
          cta: "Connect Across Borders"
        },
        local_tech_community: {
          greeting: "Hey Tech-Community!",
          tagline: "Active Community Member & Knowledge Sharing Enthusiast",
          cta: "Join the Conversation"
        },
        general_visitor: {
          greeting: "Willkommen zu meinem Portfolio!",
          tagline: "Full-Stack-Entwickler für innovative digitale Lösungen",
          cta: "Explorer Mon Travail"
        },
        returning_visitor: {
          greeting: "Willkommen zurück!",
          tagline: "Entdecke was neu ist in meiner Entwicklungsreise",
          cta: "Neueste Updates ansehen"
        },
        potential_collaborator: {
          greeting: "Hello Future Collaborator!",
          tagline: "Open Source Contributor Ready for Partnership",
          cta: "Start Collaboration"
        }
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      skills: 'Compétences',
      experience: 'Expérience',
      education: 'Formation',
      projects: 'Projets',
      publications: 'Publications',
      certificates: 'Certificats',
      contact: 'Contact',
      logoAlt: 'KC',
      toggleNav: 'Basculer la navigation',
    },
    general: {
        scrollToTop: 'Retour en haut',
        closeModal: 'Fermer la modale',
        viewCertificate: 'Voir le certificat',
        loading: 'Chargement...',
        error: 'Erreur',
        retry: 'Réessayer',
        noResults: 'Aucun résultat',
        skipToMain: 'Passer au contenu principal',
        skipToNav: 'Passer au menu de navigation',
        openInNewTab: 'Ouvrir dans un nouvel onglet',
        externalLink: 'Lien externe',
    },
    theme: {
      toggleLight: 'Passer en mode clair',
      toggleDark: 'Passer en mode sombre',
      changedToLight: 'Thème changé en mode clair.',
      changedToDark: 'Thème changé en mode sombre.',
    },
    languageSwitcher: {
        label: 'Changer de langue',
        en: 'Anglais',
        de: 'Allemand',
        fr: 'Français',
        ar: 'Arabe',
    },
    home: {
      greeting: 'Bonjour, je suis',
      name: 'Khalil Charfi.',
      tagline: 'Je conçois des expériences numériques d\'exception.', // More elegant and natural French
      intro:
        "Je conçois et développe des produits numériques exceptionnels. En tant que développeur Full-Stack, je me spécialise dans la création d\'applications web et mobiles intuitives et performantes, alliant évolutivité et approche centrée utilisateur.", // More natural flow and better word choice
      viewWorkBtn: 'Découvrir mes projets',
      getInTouchBtn: 'Me contacter',
      recommendedForYou: 'Recommandé pour vous :',
    },
    about: {
      title: 'À Propos de Moi',
      sectionContent: {
        p1: "Mon parcours dans la technologie a commencé par une fascination pour la résolution de problèmes complexes avec un code élégant. Je m\'épanouis en transformant les idées en réalité, de la conceptualisation au déploiement, et je suis passionné par la création d\'interfaces utilisateur transparentes, à la fois belles et hautement fonctionnelles.",
        imagePlaceholder: "Créer du code, construire des solutions.",
      },
      professionalSummaryTitle: 'Profil Professionnel',
      professionalSummary: 'Développeur Full-Stack avec une solide expérience dans la conception d\'applications web et mobiles évolutives. Expert en développement front-end (Vue.js, Angular), back-end (Laravel, Laminas) et mobile (Flutter, Ionic). Passionné par l\'architecture logicielle rigoureuse, les solutions hors ligne et le déploiement DevOps. Expérience confirmée au sein d\'équipes pluridisciplinaires en Tunisie et en Allemagne.',
      languagesTitle: 'Langues',
      languages: [
        { lang: 'Arabe', proficiency: 'Natif' },
        { lang: 'Anglais', proficiency: 'Courant' },
        { lang: 'Français', proficiency: 'Courant' },
      ],
      keyHighlightsTitle: 'Points Fort',
    },
    skills: {
      title: 'Compétences Clés',
      categories: {
        frontend: { name: 'Front-End', items: ['Vue.js', 'Angular', 'JavaScript/TypeScript', 'HTML5', 'CSS3 (Sass/LESS)', 'Bootstrap'] },
        backend: { name: 'Back-End', items: ['PHP (Laravel, Laminas)', 'Java (Spring Boot)'] },
        mobile: { name: 'Développement Mobile', items: ['Flutter', 'Ionic', 'Android (Java)'] },
        databases: { name: 'Bases de données & APIs', items: ['MySQL', 'MongoDB', 'SQLite', 'CouchDB', 'GraphQL (Apollo Client)'] },
        devops: { name: 'DevOps & CI/CD', items: ['Git', 'Docker', 'Jenkins', 'GitLab CI/CD', 'Bitrise', 'Puppet'] },
        tools: { name: 'Autres & Outils', items: ['Drupal', 'Keycloak', 'Firebase', 'Mapbox GL', 'WSO2 CEP', 'JHipster', 'TestCafe', 'Cucumber', 'Grafana', 'Kibana'] },
      },
      focusAreasLabel: 'Domaines de spécialisation :',
      focusAI: 'Spécialisation IA',
      focusWebDev: 'Spécialisation Développement Web',
      focusDataScience: 'Spécialisation Data Science',
      priorityProgramming: 'Priorité Programmation',
      priorityFrameworks: 'Priorité Frameworks',
      priorityTools: 'Priorité Outils',
      priorityDatabases: 'Priorité Bases de données',
    },
    experience: {
      title: 'Expérience',
      items: [
         {
          title: 'Ingénieur Logiciel – Développeur Fullstack',
          company: 'CHECK24 Vergleichsportal GmbH',
          location: 'Francfort, Allemagne',
          date: 'Août 2022 – Présent',
          description: [
            "Amélioration des performances front-end et de l\'interaction utilisateur sur la principale plateforme de comparaison d\'Allemagne en utilisant Vue.js et Laminas.",
            "Amélioration du produit d\'assurance vélo (Fahrradversicherung) avec des fonctionnalités avancées et l\'intégration d\'API REST.",
            "Contribution à la refonte des composants Drupal et à l\'intégration du suivi analytique.",
            "Application de la mise en cache et optimisation des requêtes de base de données pour un chargement plus rapide.",
          ],
        },
        {
          title: 'Ingénieur Logiciel – Développeur Full-Stack',
          company: 'ASM - All Soft Multimedia',
          location: 'Sfax, Tunisie',
          date: 'Jan 2019 – Août 2022',
          description: [
            "Direction du développement d\'applications web et mobiles dans divers secteurs, y compris le commerce de détail et la restauration.",
            "Création d\'applications mobiles hybrides avec Flutter et Ionic, avec synchronisation hors ligne via CouchDB/PouchDB.",
            "Livraison de projets tels que : Cover 3D Mobile (outil de vente), 3andi & 3andi Partner (applications de fidélité), et ProInventory.",
            "Garantie d\'un accès et d\'une authentification sécurisés avec Keycloak.",
          ],
        },
        {
          title: 'Ingénieur Logiciel – Développeur Mobile',
          company: 'MyBus – Monkey Factory',
          location: 'Sfax, Tunisie',
          date: 'Mar 2020 – Nov 2020',
          description: [
            "Création d\'une application de transport public en temps réel utilisant Ionic, Angular et Mapbox GL.",
            "Intégration de GraphQL avec Apollo Client pour des mises à jour de données efficaces.",
            "Activation de CI / CD avec Docker et GitLab pour des itérations plus rapides."
          ]
        },
        {
            title: 'Développeur Front-End',
            company: 'Softtodo IT Solutions',
            location: 'Sfax, Tunisie',
            date: 'Mai 2018 – Déc 2018',
            description: [
                "Modernisation de l\'interface utilisateur e-commerce d\'IRIDION en utilisant Bootstrap et un design responsive.",
                "Implémentation de composants JSP dynamiques et d\'outils de test A/B."
            ]
        },
        {
            title: 'Développeur Android',
            company: 'ASM - All Soft Multimedia',
            location: 'Sfax, Tunisie',
            date: 'Mar 2017 – Mai 2018',
            description: [
                "Livraison d\'applications Android critiques pour l\'entreprise avec des capacités hors ligne et une synchronisation sécurisée via SQLite et Laravel.",
                "Création d\'outils personnalisés comme DUX Mobile (compagnon ERP), FastQueue (système de file d\'attente) et ProCaisse Mobile."
            ]
        },
        {
            title: 'Chercheur – Projet THERALYTICS',
            company: 'Université de Marburg / Centre de Recherche Numérique de Sfax',
            location: 'Allemagne & Tunisie',
            date: 'Oct 2016 – Fév 2017',
            description: [
                "Développement d\'un prototype de surveillance cardiaque utilisant des capteurs IoT et le traitement d\'événements complexes (WSO2 CEP).",
                "Conception de systèmes d\'alerte en temps réel et de pipelines de données avec Spring Boot, MongoDB et JHipster.",
                "Collaboration à une recherche internationale pour la détection précoce des anomalies cardiaques."
            ]
        }
      ],
    },
    education: {
      title: 'Formation',
      items: [
        {
          degree: "Master of Science, Ingénierie des Systèmes d\'Entreprise",
          institution: "Institut Supérieur d\'Informatique et de Multimédia de Sfax",
          date: 'Sep 2014 – Fév 2017',
          details: "Accent mis sur la conception et la construction de systèmes logiciels à grande échelle et d\'architectures d\'entreprise."
        },
        {
          degree: "Licence en Informatique",
          institution: "Institut Supérieur d\'Informatique et de Multimédia de Sfax",
          date: 'Sep 2011 – Juin 2014',
          details: "Acquisition d\'une base solide en algorithmes, structures de données et principes de développement logiciel."
        }
      ]
    },
    projects: {
      title: 'Mes Projets',
      items: [
        {
            title: 'Cover 3D Mobile (ASM)',
            description: "Un outil de vente sur le terrain pour les représentants commerciaux avec génération dynamique de formulaires, logique de tarification complexe, support multimédia pour les présentations de produits et capacités hors ligne avec synchronisation CouchDB/PouchDB.",
            tech: ['Ionic', 'Angular', 'CouchDB', 'PouchDB', 'Keycloak'],
        },
        {
            title: '3andi & 3andi Partner (ASM)',
            description: "Applications de fidélisation pour clients et fournisseurs. Les fonctionnalités comprenaient la lecture de codes QR pour les points, les offres promotionnelles et Firebase pour les notifications push et l\'analyse.",
            tech: ['Flutter', 'Firebase', 'Node.js'],
        },
        {
            title: 'App de Transport Public (MyBus)',
            description: "Suivi en temps réel et informations pour les utilisateurs des transports publics. Utilisation de Mapbox GL pour des cartes interactives et de GraphQL pour une récupération efficace des données.",
            tech: ['Ionic', 'Angular', 'Mapbox GL', 'GraphQL', 'Docker'],
        },
        {
            title: 'Prototype de Surveillance Cardiaque (Theralytics)',
            description: "Système de détection d\'anomalies cardiaques basé sur l\'IoT utilisant des capteurs portables. Développement de pipelines de traitement de données en temps réel et de systèmes d\'alerte avec WSO2 CEP et Spring Boot.",
            tech: ['Java', 'Spring Boot', 'WSO2 CEP', 'MongoDB', 'JHipster', 'IoT'],
        }
      ],
      linksUnavailable: 'Liens disponibles sur demande ou projet privé.',
      liveDemoLabel: 'Démo Live',
      githubRepoLabel: 'GitHub',
    },
    publications: {
      title: 'Publications',
      items: [
        {
          title: "CEP4HFP : Traitement Complexe d\'Événements pour la Prédiction de l\'Insuffisance Cardiaque",
          authors: 'Afef Mdhaffar, Ismael Bouassida Rodriguez, Khalil Charfi, Leila Abid, and Bernd Freisleben',
          journal: 'IEEE Transactions on Nanobioscience, Vol. 16, No. 8',
          date: 'Décembre 2017',
          abstract: "Cet article présente une nouvelle approche d\'analyse de la santé pour la prédiction de l\'insuffisance cardiaque. Elle est basée sur l\'utilisation de la technologie de traitement complexe d\'événements (CEP), combinée à des approches statistiques. Un moteur CEP traite les données de santé entrantes en exécutant des règles d\'analyse basées sur des seuils. Au lieu de devoir configurer manuellement les seuils, notre nouvel algorithme statistique les calcule et les met à jour automatiquement.",
          link: "https://ieeexplore.ieee.org/document/8094944",
          viewLabel: "Voir la publication"
        }
      ]
    },
    certificates: {
      title: 'Certificats et Récompenses',
      items: [
        {
          id: 'cert-presentation-darmstadt-2016',
          title: 'Certificat de Présentation au 2ème Atelier DAAD sur l\'E-santé',
          subtitle: 'Une Approche de Surveillance Réactive pour les Patients Cardiaques (Insuffisance Cardiaque)',
          issuer: 'Atelier DAAD sur l\'E-santé',
          date: '7-9 décembre 2016',
          location: 'Darmstadt, Allemagne',
          imageUrl: './asset/Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg',
        },
        {
          id: 'cert-attendance-theralytics-darmstadt-2016',
          title: 'Certificat de Présence au Deuxième Atelier DAAD Theralytics',
          issuer: 'Atelier DAAD Theralytics',
          date: '7-9 décembre 2016',
          location: 'Darmstadt, Allemagne',
          imageUrl: './asset/Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg',
        },
        {
          id: 'cert-presentation-sfax-2016',
          title: 'Certificat de Présentation au 1er Atelier DAAD sur l\'E-santé',
          subtitle: 'Une Approche de Surveillance Réactive pour les Patients Cardiaques (Insuffisance Cardiaque)',
          issuer: 'Atelier DAAD sur l\'E-santé',
          date: '28 septembre 2016',
          location: 'Sfax, Tunisie',
          imageUrl: './asset/Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg',
        },
        {
          id: 'cert-attendance-sfax-2016',
          title: 'Certificat de Présence à l\'Atelier DAAD E-santé',
          issuer: 'Atelier DAAD E-santé',
          date: '28 septembre 2016',
          location: 'Sfax, Tunisie',
          imageUrl: './asset/Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg',
        },
        {
          id: 'cert-cardiac-patient-monitoring',
          title: 'Certificat de Participation à l\'Atelier E-Santé sur la Surveillance des Patients Cardiaques',
          issuer: 'DAAD E-Health Workshop',
          date: '2016',
          imageUrl: './asset/Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg',
        },
      ],
    },
    contact: {
              title: 'Créons Ensemble',
        intro: "Je suis toujours disponible pour échanger sur de nouveaux projets, des collaborations ou des opportunités professionnelles. Une question ou simplement envie de dire bonjour ? N\'hésitez pas à me contacter.",
        message: "Je suis toujours disponible pour échanger sur de nouveaux projets, des collaborations ou des opportunités professionnelles. Une question ou simplement envie de dire bonjour ? N'hésitez pas à me contacter.",
      form: {
        nameLabel: 'Nom',
        emailLabel: 'E-mail',
        messageLabel: 'Message',
        sendBtn: 'Envoyer le message',
        submitting: 'Envoi en cours...',
        successTitle: 'Message envoyé !',
        successMessage: "Merci de m'avoir contacté ! Je vous répondrai dès que possible.",
        sendAnother: 'Envoyer un autre message',
        demoAlert: 'Merci pour votre message ! (Ceci est une Demo, es-vous sûr de vouloir envoyer ce message ?)',
        emailError: 'Veuillez entrer une adresse e-mail valide.',
        requiredError: 'Ce champ est obligatoire.',
      },
      connectTitle: 'Connectez-vous avec moi',
      emailAria: 'Envoyer un e-mail à Khalil Charfi',
      linkedinAria: "Profil LinkedIn de Khalil Charfi",
      githubAria: "Profil GitHub de Khalil Charfi",
    },
    footer: {
      copyright: '© {{year}} Khalil Charfi. Tous droits réservés.',
      credits: 'Conçu et réalisé par Khalil Charfi (avec assistance IA)',
    },
    chatbot: {
      title: "Assistant IA",
      placeholder: "Posez une question sur mes compétences...",
      initialMessage: "Bonjour ! Je suis l'assistant IA de Khalil. Je peux répondre à des questions sur son portfolio. Comment puis-je vous aider ?",
      openAria: "Ouvrir le chat de l'assistant IA",
      closeAria: "Fermer le chat de l'assistant IA",
      sendAria: "Envoyer le message",
      send: "Envoyer",
    },
    cookieConsent: {
      title: "Cookie Consent",
      description: "Nous utilisons des cookies pour vous offrir la meilleure expérience possible sur notre site web. En continuant à utiliser ce site, vous acceptez l'utilisation de cookies.",
      acceptAllBtn: "Tout accepter",
      acceptNecessaryBtn: "Accepter uniquement les nécessaires",
      showPreferencesBtn: "Afficher les préférences",
      closeIconLabel: "Fermer",
      preferencesTitle: "Préférences des cookies",
      savePreferencesBtn: "Enregistrer les préférences",
      cookieUsageTitle: "Utilisation des cookies",
      cookieUsageDescription: "Ce site web utilise des cookies pour améliorer votre expérience lorsque vous naviguez sur le site. Parmi ces cookies, les cookies nécessaires sont stockés dans votre navigateur car ils sont indispensables pour le bon fonctionnement des fonctionnalités de base du site. Nous utilisons également des cookies tiers qui nous aident à analyser et à comprendre comment vous utilisez ce site, et à nous aider à améliorer l'annonce de publicités qui pourraient vous intéresser.",
      necessaryCookiesTitle: "Cookies nécessaires",
      necessaryCookiesDescription: "Ces cookies sont nécessaires pour que le site fonctionne correctement. Sans ces cookies, le site ne fonctionnerait pas correctement.",
      analyticsCookiesTitle: "Cookies d'analyse",
              analyticsCookiesDescription: "Ces cookies sont utilisés pour collecter des informations sur la manière dont vous utilisez le site. Nous utilisons ces informations pour améliorer notre site et personnaliser l'annonce de publicités qui pourrait vous intéresser."
    },
    profileInsights: {
      toggleLabel: "Basculer les aperçus du profil",
      title: "Aperçus du profil",
      description: "Découvrez des aperçus sur le parcours professionnel et les compétences de Khalil."
    },
    errors: {
      boundaryTitle: "Limite d'erreur",
      boundaryMessage: "Quelque chose s'est mal passé. Veuillez réessayer.",
      retryButton: "Réessayer",
      analyticsError: "Une erreur s'est produite lors de la récupération des données d'analyse."
    },
    seo: {
        title: "Khalil Charfi | Portfolio d'Ingénieur Full-Stack",
        description: "Découvrez les projets et l'expérience de Khalil Charfi, spécialiste des applications web et mobiles évolutives et centrées sur l'utilisateur."
    },
    dynamicContent: {
      defaultGreeting: 'Bonjour, je suis',
      defaultTagline: 'Je conçois des expériences numériques d\'exception.',
      defaultIntro: "Je conçois et développe des produits numériques exceptionnels. En tant que développeur Full-Stack, je me spécialise dans la création d\'applications web et mobiles intuitives et performantes, alliant évolutivité et approche centrée utilisateur.",
      viewMyWork: 'Découvrir mes projets',
      professionalSummary: 'Développeur Full-Stack avec une solide expérience dans la conception d\'applications web et mobiles évolutives. Expert en développement front-end (Vue.js, Angular), back-end (Laravel, Laminas) et mobile (Flutter, Ionic). Passionné par l\'architecture logicielle rigoureuse, les solutions hors ligne et le déploiement DevOps. Expérience confirmée au sein d\'équipes pluridisciplinaires en Tunisie et en Allemagne.',
      fullStackProficiency: 'Maîtrise complète du développement Full-Stack',
      problemSolving: 'Solides compétences en résolution de problèmes et analyse',
      modernFrameworks: 'Expertise des frameworks et technologies modernes',
      keyHighlights: {
        ml: 'Apprentissage automatique',
        fullstack: 'Développement Full-Stack',
        problemSolving: 'Résolution de problèmes',
        experience: 'Expérience étendue',
      },
    },
    dates: {
      months: {
        january: 'Janvier',
        february: 'Février',
        march: 'Mars',
        april: 'Avril',
        may: 'Mai',
        june: 'Juin',
        july: 'Juillet',
        august: 'Août',
        september: 'Septembre',
        october: 'Octobre',
        november: 'Novembre',
        december: 'Décembre',
      },
      present: 'Présent',
    },
    visitor: {
      recruiter: {
        greeting: "Bienvenue, Professionnel de l'Acquisition de Talents !",
        tagline: "Développeur Full-Stack Expérimenté Prêt pour Votre Prochaine Opportunité",
        cta: "Télécharger CV & Planifier Entretien"
      },
      hr_manager: {
        greeting: "Bonjour Professionnel RH !",
        tagline: "Équipier Collaboratif avec de Fortes Compétences Techniques & Relationnelles",
        cta: "Voir Adéquation Culturelle & Valeurs"
      },
      technical_lead: {
        greeting: "Salutations, Leader Technique !",
        tagline: "Développeur Senior avec Expérience Architecture & Leadership",
        cta: "Explorer l'Approfondissement Technique"
      },
      c_level_executive: {
        greeting: "Bienvenue, Leader Exécutif !",
        tagline: "Partenaire Technologique Stratégique Générant des Résultats Business",
        cta: "Discuter Partenariat Stratégique"
      },
      agency_recruiter: {
        greeting: "Bonjour Partenaire Recrutement !",
        tagline: "Développeur Polyvalent Disponible pour Placements Clients",
        cta: "Voir Disponibilité & Tarifs"
      },
      startup_founder: {
        greeting: "Salut Collègue Entrepreneur !",
        tagline: "Co-Fondateur Technique & Spécialiste MVP Prêt à Scaler",
        cta: "Construisons Votre Vision"
      },
      product_manager: {
        greeting: "Bonjour Leader Produit !",
        tagline: "Développeur Orienté Utilisateur avec Expertise Développement Produit",
        cta: "Collaborer sur Stratégie Produit"
      },
      project_manager: {
        greeting: "Bienvenue Chef de Projet !",
        tagline: "Développeur Fiable avec Historique de Livraison Prouvé",
        cta: "Planifier Votre Prochain Projet"
      }
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عني',
      skills: 'المهارات',
      experience: 'الخبرة',
      education: 'التعليم',
      projects: 'المشاريع',
      publications: 'المنشورات',
      certificates: 'الشهادات',
      contact: 'الاتصال',
      logoAlt: 'KC',
      toggleNav: 'تبديل التنقل',
    },
    general: {
        scrollToTop: 'الصعود للأعلى',
        closeModal: 'إغلاق النافذة',
        viewCertificate: 'عرض الشهادة',
        loading: 'جار التحميل...',
        error: 'خطأ',
        retry: 'إعادة المحاولة',
        noResults: 'لا توجد نتائج',
        skipToMain: 'التخطي إلى المحتوى الرئيسي',
        skipToNav: 'التخطي إلى قائمة التنقل',
        openInNewTab: 'فتح في علامة تبويب جديدة',
        externalLink: 'رابط خارجي',
    },
    theme: {
      toggleLight: 'التحويل إلى الوضع الفاتح',
      toggleDark: 'التحويل إلى الوضع الداكن',
      changedToLight: 'تم تغيير السمة إلى الوضع الفاتح.',
      changedToDark: 'تم تغيير السمة إلى الوضع الداكن.',
    },
     languageSwitcher: {
        label: 'تغيير اللغة',
        en: 'الإنجليزية',
        de: 'الألمانية',
        fr: 'الفرنسية',
        ar: 'العربية',
    },
    home: {
      greeting: 'مرحباً، أنا',
      name: 'خليل الشرفي.',
      tagline: 'أصمم حلولاً رقمية تُحدث فرقاً.',
      intro:
        "أصمّم وأطوّر منتجات رقمية متميّزة تجمع بين الابتكار والأداء. بصفتي مطوّر برمجيات متكامل، أتخصص في بناء تطبيقات ويب وجوّال حديثة قابلة للتوسع وسهلة الاستخدام، مع التركيز على تقديم تجربة مستخدم استثنائية.",
      viewWorkBtn: 'اطّلع على أعمالي',
      getInTouchBtn: 'تواصل معي',
      recommendedForYou: 'موصى به لك:',
    },
    about: {
      title: 'عني',
      sectionContent: {
          p1: "بدأت رحلتي في عالم التقنية بشغف كبير لحل المشكلات المعقدة عبر كود برمجي أنيق ومبتكر. أستمتع بتحويل الأفكار إلى واقع ملموس، من مرحلة المفهوم حتى التنفيذ الكامل. أركّز على تصميم واجهات مستخدم سلسة تجمع بين الجمالية والوظائف المتقدمة لتقديم تجربة استثنائية.",
          imagePlaceholder: "أكتب الكود، أبني الحلول.",
      },
      professionalSummaryTitle: 'نبذة مهنية',
      professionalSummary: 'مطوّر برمجيات متكامل بخبرة واسعة في بناء تطبيقات ويب وجوّال قابلة للتوسع. خبير في تطوير الواجهات الأمامية (Vue.js، Angular)، والخلفية (Laravel، Laminas)، والتطبيقات المحمولة (Flutter، Ionic). شغوف بالهندسة البرمجية النظيفة، والحلول دون اتصال بالإنترنت، ونشر التطبيقات باستخدام DevOps. خبرة مثبتة في العمل ضمن فرق متعددة التخصصات في تونس وألمانيا.',
      languagesTitle: 'اللغات',
      languages: [
        { lang: 'العربية', proficiency: 'لغة أم' },
        { lang: 'الإنجليزية', proficiency: 'بطلاقة' },
        { lang: 'الفرنسية', proficiency: 'بطلاقة' },
      ],
      keyHighlightsTitle: 'أبرز المهارات',
    },
    skills: {
      title: 'المهارات',
      categories: {
        frontend: { name: 'الواجهة الأمامية', items: ['Vue.js', 'Angular', 'JavaScript/TypeScript', 'HTML5', 'CSS3 (Sass/LESS)', 'Bootstrap'] },
        backend: { name: 'الواجهة الخلفية', items: ['PHP (Laravel, Laminas)', 'Java (Spring Boot)'] },
        mobile: { name: 'تطوير الجوال', items: ['Flutter', 'Ionic', 'Android (Java)'] },
        databases: { name: 'قواعد البيانات وواجهات برمجة التطبيقات', items: ['MySQL', 'MongoDB', 'SQLite', 'CouchDB', 'GraphQL (Apollo Client)'] },
        devops: { name: 'DevOps و CI/CD', items: ['Git', 'Docker', 'Jenkins', 'GitLab CI/CD', 'Bitrise', 'Puppet'] },
        tools: { name: 'أخرى وأدوات', items: ['Drupal', 'Keycloak', 'Firebase', 'Mapbox GL', 'WSO2 CEP', 'JHipster', 'TestCafe', 'Cucumber', 'Grafana', 'Kibana'] },
      },
      focusAreasLabel: 'مجالات التركيز:',
      focusAI: 'التركيز على الذكاء الاصطناعي',
      focusWebDev: 'التركيز على تطوير الويب',
      focusDataScience: 'التركيز على علم البيانات',
      priorityProgramming: 'أولوية البرمجة',
      priorityFrameworks: 'أولوية الأطر البرمجية',
      priorityTools: 'أولوية الأدوات',
      priorityDatabases: 'أولوية قواعد البيانات',
    },
    experience: {
      title: 'الخبرة',
      items: [
        {
          title: 'مهندس برمجيات – مطور متكامل',
          company: 'CHECK24 Vergleichsportal GmbH',
          location: 'فرانكفورت، ألمانيا',
          date: 'أغسطس 2022 – حتى الآن',
          description: [
            'تحسين أداء الواجهة الأمامية وتفاعل المستخدم على أفضل منصة مقارنة في ألمانيا باستخدام Vue.js و Laminas.',
            'تعزيز منتج تأمين الدراجات (Fahrradversicherung) بميزات متقدمة وتكامل واجهة برمجة تطبيقات REST.',
            'المساهمة في إعادة تصميم مكونات Drupal وتتبع التحليلات المضمنة.',
            'تطبيق التخزين المؤقت وتحسين استعلامات قاعدة البيانات لتحميل أسرع.',
          ],
        },
        {
          title: 'مهندس برمجيات – مطور متكامل',
          company: 'ASM - All Soft Multimedia',
          location: 'صفاقس، تونس',
          date: 'يناير 2019 – أغسطس 2022',
          description: [
            'قيادة تطوير تطبيقات الويب والجوال عبر قطاعات تشمل البيع بالتجزئة والمطاعم وإدارة المخزون.',
            'بناء تطبيقات جوال هجينة باستخدام Flutter و Ionic ، تتميز بالمزامنة دون اتصال عبر CouchDB / PouchDB.',
            'تسليم مشاريع مثل: Cover 3D Mobile (أداة مبيعات)، 3andi & 3andi Partner (تطبيقات ولاء)، و ProInventory.',
            'ضمان الوصول الآمن والمصادقة باستخدام Keycloak.',
          ],
        },
        {
          title: 'مهندس برمجيات – مطور تطبيقات جوال',
          company: 'MyBus – Monkey Factory',
          location: 'صفاقس، تونس',
          date: 'مارس 2020 – نوفمبر 2020',
          description: [
            'بناء تطبيق للنقل العام في الوقت الفعلي باستخدام Ionic و Angular و Mapbox GL.',
            'دمج GraphQL مع Apollo Client لتحديثات البيانات الفعالة.',
            'تمكين CI / CD باستخدام Docker و GitLab لتكرارات أسرع.'
          ]
        },
        {
            title: 'مطور الواجهة الأمامية',
            company: 'Softtodo IT Solutions',
            location: 'صفاقس، تونس',
            date: 'مايو 2018 – ديسمبر 2018',
            description: [
                'تحديث واجهة مستخدم التجارة الإلكترونية لـ IRIDION باستخدام Bootstrap وتصميم متجاوب.',
                'تنفيذ مكونات JSP ديناميكية وأدوات اختبار A/B.'
            ]
        },
        {
            title: 'مطور أندرويد',
            company: 'ASM - All Soft Multimedia',
            location: 'صفاقس، تونس',
            date: 'مارس 2017 – مايو 2018',
            description: [
                'تسليم تطبيقات أندرويد مهمة للأعمال مع إمكانات العمل دون اتصال ومزامنة آمنة عبر SQLite و Laravel.',
                'بناء أدوات مخصصة مثل DUX Mobile (رفيق ERP)، و FastQueue (نظام قائمة انتظار)، و ProCaisse Mobile.'
            ]
        },
        {
            title: 'باحث – مشروع THERALYTICS',
            company: 'جامعة ماربورغ / مركز البحوث الرقمية بصفاقس',
            location: 'ألمانيا وتونس',
            date: 'أكتوبر 2016 – فبراير 2017',
            description: [
                'تطوير نموذج أولي لمراقبة القلب باستخدام مستشعرات إنترنت الأشياء ومعالجة الأحداث المعقدة (WSO2 CEP).',
                'تصميم أنظمة إنذار في الوقت الفعلي وخطوط أنابيب بيانات باستخدام Spring Boot و MongoDB و JHipster.',
                'التعاون في بحث دولي للكشف المبكر عن تشوهات القلب.'
            ]
        }
      ],
    },
    education: {
      title: 'التعليم',
      items: [
        {
          degree: 'ماجستير العلوم، هندسة نظم المؤسسات',
          institution: 'المعهد العالي للإعلامية والملتيميديا بصفاقس',
          date: 'سبتمبر 2014 – فبراير 2017',
          details: 'التركيز على تصميم وبناء أنظمة برمجية واسعة النطاق وهياكل الشركات.'
        },
        {
          degree: 'بكالوريوس، علوم الحاسوب',
          institution: 'المعهد العالي للإعلامية والملتيميديا بصفاقs',
          date: 'سبتمبر 2011 – يونيو 2014',
          details: 'اكتساب أساس متين في الخوارزميات وهياكل البيانات ومبادئ تطوير البرمجيات.'
        }
      ]
    },
    projects: {
      title: 'مشاريعي',
      items: [
        {
            title: 'Cover 3D Mobile (ASM)',
            description: 'أداة مبيعات ميدانية لمندوبي المبيعات مع إنشاء نماذج ديناميكية، ومنطق تسعير معقد، ودعم الوسائط المتعددة لعروض المنتجات، وقدرات العمل دون اتصال مع مزامنة CouchDB/PouchDB.',
            tech: ['Ionic', 'Angular', 'CouchDB', 'PouchDB', 'Keycloak'],
        },
        {
            title: '3andi & 3andi Partner (ASM)',
            description: 'تطبيقات ولاء العملاء والموردين. تضمنت الميزات مسح رمز الاستجابة السريعة للنقاط والعروض الترويجية و Firebase للإشعارات الفورية والتحليلات.',
            tech: ['Flutter', 'Firebase', 'Node.js'],
        },
        {
            title: 'تطبيق النقل العام (MyBus)',
            description: 'تتبع ومعلومات في الوقت الفعلي لمستخدمي وسائل النقل العام. تم الاستفادة من Mapbox GL للخرائط التفاعلية و GraphQL لجلب البيانات بكفاءة.',
            tech: ['Ionic', 'Angular', 'Mapbox GL', 'GraphQL', 'Docker'],
        },
        {
            title: 'نموذج مراقبة القلب (Theralytics)',
            description: 'نظام كشف تشوهات القلب قائم على إنترنت الأشياء باستخدام أجهزة استشعار يمكن ارتداؤها. تم تطوير خطوط أنابيب لمعالجة البيانات في الوقت الفعلي وأنظمة إنذار باستخدام WSO2 CEP و Spring Boot.',
            tech: ['Java', 'Spring Boot', 'WSO2 CEP', 'MongoDB', 'JHipster', 'IoT'],
        }
      ],
      linksUnavailable: 'الروابط متاحة عند الطلب أو المشروع خاص.',
      liveDemoLabel: 'عرض مباشر',
      githubRepoLabel: 'GitHub',
    },
    publications: {
      title: 'المنشورات العلمية',
      items: [
        {
          title: 'CEP4HFP: معالجة الأحداث المعقدة لتوقع قصور القلب',
          authors: 'عفاف المظفر، إسماعيل بوعصيدة رودريغيز، خليل الشرفي، ليلى عبيد، وبيرند فرايسليبن',
          journal: 'IEEE Transactions on Nanobioscience, Vol. 16, No. 8',
          date: 'ديسمبر 2017',
          abstract: "يقدم هذا البحث نهجًا جديدًا لتحليل البيانات الصحية لتوقع قصور القلب. يعتمد على استخدام تقنية معالجة الأحداث المعقدة (CEP)، جنبًا إلى جنب مع الأساليب الإحصائية. يقوم محرك CEP بمعالجة البيانات الصحية الواردة عن طريق تنفيذ قواعد تحليل قائمة على العتبات. بدلاً من الحاجة إلى إعداد العتبات يدويًا، تقوم خوارزميتنا الإحصائية المبتكرة بحساب وتحديث العتبات تلقائيًا.",
          link: "https://ieeexplore.ieee.org/document/8094944",
          viewLabel: "عرض البحث"
        }
      ]
    },
    certificates: {
      title: 'الشهادات والجوائز',
      items: [
        {
          id: 'cert-presentation-darmstadt-2016',
          title: 'شهادة عرض تقديمي في ورشة عمل DAAD الثانية للصحة الإلكترونية',
          subtitle: 'نهج مراقبة تفاعلي لمرضى القلب (قصور القلب)',
          issuer: 'ورشة عمل DAAD للصحة الإلكترونية',
          date: '7-9 ديسمبر 2016',
          location: 'دارمشتات، ألمانيا',
          imageUrl: './asset/Certificate Recognizing an E-Health Talk Presentation on Cardiac Monitoring.jpeg',
        },
        {
          id: 'cert-attendance-theralytics-darmstadt-2016',
          title: 'شهادة حضور ورشة عمل DAAD Theralytics الثانية',
          issuer: 'ورشة عمل DAAD Theralytics',
          date: '7-9 ديسمبر 2016',
          location: 'دارمشتات، ألمانيا',
          imageUrl: './asset/Certificate Template from Second DAAD Theralytics Workshop in Darmstadt 2016.jpeg',
        },
        {
          id: 'cert-presentation-sfax-2016',
          title: 'شهادة عرض تقديمي في ورشة عمل DAAD الأولى للصحة الإلكترونية',
          subtitle: 'نهج مراقبة تفاعلي لمرضى القلب (قصور القلب)',
          issuer: 'ورشة عمل DAAD للصحة الإلكترونية',
          date: '28 سبتمبر 2016',
          location: 'صفاقس، تونس',
          imageUrl: './asset/Certificate of Participation in an E-Health Workshop on Heart Failure.jpeg',
        },
        {
          id: 'cert-attendance-sfax-2016',
          title: 'شهادة حضور ورشة عمل DAAD للصحة الإلكترونية',
          issuer: 'ورشة عمل DAAD للصحة الإلكترونية',
          date: '28 سبتمبر 2016',
          location: 'صفاقس، تونس',
          imageUrl: './asset/Certificate of Attendance for DAAD E-Health Workshop in Sfax 2016.jpeg',
        },
        {
          id: 'cert-cardiac-patient-monitoring',
          title: 'شهادة مشاركة في ورشة عمل الصحة الإلكترونية حول مراقبة مرضى القلب',
          issuer: 'DAAD E-Health Workshop',
          date: '2016',
          imageUrl: './asset/Certificate of Participation in E-Health Workshop on Cardiac Patient Monitoring.jpeg',
        },
      ],
    },
    contact: {
      title: 'تواصل معي',
      intro: "يسعدني التواصل معك لمناقشة المشاريع والفرص المهنية. لديك استفسار أو تود التعاون؟ لا تتردد في مراسلتي.",
      message: "لنبدأ مشروعك القادم معاً!",
      form: {
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        messageLabel: 'الرسالة',
        sendBtn: 'إرسال',
        submitting: 'جارٍ الإرسال...',
        successTitle: 'تم الإرسال بنجاح!',
        successMessage: 'شكراً لتواصلك! سأرد عليك في أقرب وقت.',
        sendAnother: 'إرسال رسالة أخرى',
        demoAlert: 'شكراً لرسالتك! (هذه نسخة تجريبية - لم يتم إرسال بريد فعلي)',
        emailError: 'يرجى إدخال عنوان بريد إلكتروني صالح.',
        requiredError: 'هذا الحقل مطلوب.',
      },
      connectTitle: 'تواصل معي عبر',
      emailAria: 'إرسال بريد إلكتروني إلى خليل الشرفي',
      linkedinAria: "ملف خليل الشرفي الشخصي على LinkedIn",
      githubAria: "ملف خليل الشرفي الشخصي على GitHub",
    },
    footer: {
      copyright: '© {{year}} خليل الشرفي. جميع الحقوق محفوظة.',
      credits: 'تصميم وبناء خليل الشرفي (بمساعدة الذكاء الاصطناعي)',
    },
    chatbot: {
      title: "المساعد الذكي",
      placeholder: "اسأل عن المهارات، المشاريع...",
      initialMessage: "مرحباً! أنا المساعد الذكي لخليل. يمكنني الإجابة على أسئلتك حول ملفه الشخصي. كيف يمكنني مساعدتك؟",
      openAria: "فتح نافذة المساعد الذكي",
      closeAria: "إغلاق نافذة المساعد الذكي",
      sendAria: "إرسال الرسالة",
      send: "إرسال",
    },
    cookieConsent: {
      title: "سياسة ملفات تعريف الارتباط",
      description: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. باستمرارك في التصفح، فإنك توافق على استخدامها.",
      acceptAllBtn: "قبول الكل",
      acceptNecessaryBtn: "الضرورية فقط",
      showPreferencesBtn: "إدارة التفضيلات",
      closeIconLabel: "إغلاق",
      preferencesTitle: "تفضيلات الخصوصية",
      savePreferencesBtn: "حفظ",
      cookieUsageTitle: "كيف نستخدم ملفات الارتباط",
      cookieUsageDescription: "نستخدم ملفات الارتباط لتحسين أداء الموقع وتجربة المستخدم. كما نستخدم ملفات طرف ثالث لتحليل استخدام الموقع.",
      necessaryCookiesTitle: "ملفات الارتباط الأساسية",
      necessaryCookiesDescription: "ضرورية لعمل الوظائف الأساسية للموقع. بدونها لن يعمل الموقع بشكل صحيح.",
      analyticsCookiesTitle: "ملفات التحليلات",
      analyticsCookiesDescription: "تساعدنا على فهم كيفية استخدام الزوار للموقع وتحسين المحتوى المقدم."
    },
    profileInsights: {
      toggleLabel: "تبديل رؤى الملف الشخصي",
      title: "رؤى الملف الشخصي",
      description: "اكتشف رؤى حول رحلة خليل المهنية ومهاراته."
    },
    errors: {
      boundaryTitle: "حدود الخطأ",
      boundaryMessage: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      retryButton: "إعادة المحاولة",
      analyticsError: "حدث خطأ أثناء جلب بيانات التحليل."
    },
    seo: {
        title: "خليل الشرفي | ملف أعمال مهندس برمجيات متكامل",
        description: "استكشف مشاريع وخبرات خليل الشرفي، المتخصص في تطبيقات الويب والجوال القابلة للتطوير والمتمحورة حول المستخدم."
    },
    dynamicContent: {
      defaultGreeting: 'مرحباً، أنا',
      defaultTagline: 'أصمم حلولاً رقمية تُحدث فرقاً.',
      defaultIntro: "أصمّم وأطوّر منتجات رقمية متميّزة تجمع بين الابتكار والأداء. بصفتي مطوّر برمجيات متكامل، أتخصص في بناء تطبيقات ويب وجوّال حديثة قابلة للتوسع وسهلة الاستخدام، مع التركيز على تقديم تجربة مستخدم استثنائية.",
      viewMyWork: 'اطّلع على أعمالي',
      professionalSummary: 'مطوّر برمجيات متكامل بخبرة واسعة في بناء تطبيقات ويب وجوّال قابلة للتوسع. خبير في تطوير الواجهات الأمامية (Vue.js، Angular)، والخلفية (Laravel، Laminas)، والتطبيقات المحمولة (Flutter، Ionic). شغوف بالهندسة البرمجية النظيفة، والحلول دون اتصال بالإنترنت، ونشر التطبيقات باستخدام DevOps. خبرة مثبتة في العمل ضمن فرق متعددة التخصصات في تونس وألمانيا.',
      fullStackProficiency: 'إتقان التطوير البرمجي المتكامل',
      problemSolving: 'مهارات متقدمة في حل المشكلات التقنية',
      modernFrameworks: 'خبرة في أحدث الأطر والتقنيات البرمجية',
      keyHighlights: {
        ml: 'التعلم الآلي',
        fullstack: 'تطوير الواجهة الكاملة',
        problemSolving: 'حل المشكلات',
        experience: 'خبرة واسعة',
      },
    },
    dates: {
      months: {
        january: 'يناير',
        february: 'فبراير',
        march: 'مارس',
        april: 'أبريل',
        may: 'مايو',
        june: 'يونيو',
        july: 'يوليو',
        august: 'أغسطس',
        september: 'سبتمبر',
        october: 'أكتوبر',
        november: 'نوفمبر',
        december: 'ديسمبر',
      },
      present: 'حالي',
    },
    visitor: {
      recruiter: {
        greeting: "مرحباً، محترف اكتساب المواهب!",
        tagline: "مطور متكامل ذو خبرة جاهز لفرصتكم القادمة",
        cta: "تحميل السيرة الذاتية وجدولة مقابلة"
      },
      hr_manager: {
        greeting: "أهلاً محترف الموارد البشرية!",
        tagline: "عضو فريق تعاوني بمهارات تقنية واجتماعية قوية",
        cta: "عرض التوافق الثقافي والقيم"
      },
      technical_lead: {
        greeting: "تحياتي، القائد التقني!",
        tagline: "مطور أول بخبرة في الهندسة المعمارية والقيادة",
        cta: "استكشاف الغوص التقني العميق"
      },
      c_level_executive: {
        greeting: "مرحباً، القائد التنفيذي!",
        tagline: "شريك تكنولوجي استراتيجي يحقق نتائج أعمال",
        cta: "مناقشة الشراكة الاستراتيجية"
      },
      agency_recruiter: {
        greeting: "أهلاً شريك التوظيف!",
        tagline: "مطور متعدد المهارات متاح لتوظيف العملاء",
        cta: "عرض التوفر والأسعار"
      },
      startup_founder: {
        greeting: "مرحباً زميل رائد الأعمال!",
        tagline: "مؤسس مشارك تقني ومتخصص MVP جاهز للتوسع",
        cta: "لنبني رؤيتك"
      },
      product_manager: {
        greeting: "أهلاً قائد المنتج!",
        tagline: "مطور يركز على المستخدم بخبرة تطوير المنتجات",
        cta: "تعاون في استراتيجية المنتج"
      },
      project_manager: {
        greeting: "مرحباً مدير المشروع!",
        tagline: "مطور موثوق بسجل تسليم مثبت",
        cta: "خطط لمشروعك القادم"
      },
      business_owner: {
        greeting: "أهلاً صاحب العمل!",
        tagline: "شريك حلول تكنولوجية لنمو الأعمال",
        cta: "استكشاف حلول الأعمال"
      },
      enterprise_client: {
        greeting: "مرحباً شريك المؤسسة!",
        tagline: "حلول على مستوى المؤسسة مع الأمان وقابلية التوسع",
        cta: "مناقشة احتياجات المؤسسة"
      },
      local_business: {
        greeting: "أهلاً العمل المحلي!",
        tagline: "شريكك التقني المحلي للنمو الرقمي",
        cta: "دعم الابتكار المحلي"
      },
      remote_work_advocate: {
        greeting: "تحياتي بطل العمل عن بُعد!",
        tagline: "مطور عن بُعد ذو خبرة بمهارات تعاون عالمية",
        cta: "استكشاف فرص العمل عن بُعد"
      },
      international_client: {
        greeting: "مرحباً شريك دولي!",
        tagline: "مطور عالمي بخبرة مشاريع متعددة الثقافات",
        cta: "التواصل عبر الحدود"
      },
      local_tech_community: {
        greeting: "أهلاً مجتمع التقنية!",
        tagline: "عضو نشط في المجتمع ومتحمس لمشاركة المعرفة",
        cta: "انضم للمحادثة"
      },
      general_visitor: {
        greeting: "مرحباً بك في صفحتي!",
        tagline: "مطور متكامل ينشئ حلول رقمية مبتكرة",
        cta: "استكشف عملي"
      },
      returning_visitor: {
        greeting: "أهلاً بعودتك!",
        tagline: "اكتشف الجديد في رحلة تطويري",
        cta: "شاهد التحديثات الأخيرة"
      },
      potential_collaborator: {
        greeting: "أهلاً متعاون مستقبلي!",
        tagline: "مساهم مفتوح المصدر جاهز للشراكة",
        cta: "ابدأ التعاون"
      }
    }
  }
};