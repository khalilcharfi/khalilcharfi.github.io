// Design Tokens - Animation System
export const animations = {
  // Duration
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom easing curves
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // Portfolio-specific easing
    portfolio: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    hover: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slide: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Animation presets
  presets: {
    // Fade animations
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
      duration: '300ms',
      easing: 'ease-out',
    },
    fadeOut: {
      from: { opacity: '1' },
      to: { opacity: '0' },
      duration: '200ms',
      easing: 'ease-in',
    },
    fadeInUp: {
      from: { opacity: '0', transform: 'translateY(20px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    fadeInDown: {
      from: { opacity: '0', transform: 'translateY(-20px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    fadeInLeft: {
      from: { opacity: '0', transform: 'translateX(-20px)' },
      to: { opacity: '1', transform: 'translateX(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    fadeInRight: {
      from: { opacity: '0', transform: 'translateX(20px)' },
      to: { opacity: '1', transform: 'translateX(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    
    // Scale animations
    scaleIn: {
      from: { transform: 'scale(0.9)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
      duration: '300ms',
      easing: 'ease-out',
    },
    scaleOut: {
      from: { transform: 'scale(1)', opacity: '1' },
      to: { transform: 'scale(0.9)', opacity: '0' },
      duration: '200ms',
      easing: 'ease-in',
    },
    scaleUp: {
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(1.05)' },
      duration: '200ms',
      easing: 'ease-out',
    },
    
    // Slide animations
    slideInUp: {
      from: { transform: 'translateY(100%)' },
      to: { transform: 'translateY(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    slideInDown: {
      from: { transform: 'translateY(-100%)' },
      to: { transform: 'translateY(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    slideInLeft: {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    slideInRight: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
      duration: '400ms',
      easing: 'ease-out',
    },
    
    // Rotate animations
    rotateIn: {
      from: { transform: 'rotate(-180deg)', opacity: '0' },
      to: { transform: 'rotate(0deg)', opacity: '1' },
      duration: '500ms',
      easing: 'ease-out',
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
      duration: '1000ms',
      easing: 'linear',
    },
    
    // Bounce animations
    bounce: {
      from: { transform: 'translateY(0)' },
      to: { transform: 'translateY(-10px)' },
      duration: '200ms',
      easing: 'ease-out',
    },
    bounceIn: {
      from: { transform: 'scale(0.3)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
      duration: '600ms',
      easing: 'bounce',
    },
    
    // Pulse animations
    pulse: {
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(1.05)' },
      duration: '1000ms',
      easing: 'ease-in-out',
    },
    heartbeat: {
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(1.1)' },
      duration: '500ms',
      easing: 'ease-in-out',
    },
  },
  
  // Portfolio-specific animations
  portfolio: {
    // Hero animations
    hero: {
      title: {
        from: { opacity: '0', transform: 'translateY(30px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
        duration: '800ms',
        easing: 'ease-out',
        delay: '200ms',
      },
      subtitle: {
        from: { opacity: '0', transform: 'translateY(20px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
        duration: '600ms',
        easing: 'ease-out',
        delay: '400ms',
      },
      cta: {
        from: { opacity: '0', transform: 'translateY(20px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
        duration: '500ms',
        easing: 'ease-out',
        delay: '600ms',
      },
    },
    
    // Card animations
    card: {
      hover: {
        from: { transform: 'translateY(0) scale(1)' },
        to: { transform: 'translateY(-4px) scale(1.02)' },
        duration: '300ms',
        easing: 'ease-out',
      },
      enter: {
        from: { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
        to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        duration: '400ms',
        easing: 'ease-out',
      },
    },
    
    // Navigation animations
    nav: {
      slideIn: {
        from: { transform: 'translateX(100%)' },
        to: { transform: 'translateX(0)' },
        duration: '300ms',
        easing: 'ease-out',
      },
      slideOut: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(100%)' },
        duration: '250ms',
        easing: 'ease-in',
      },
      itemHover: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(4px)' },
        duration: '200ms',
        easing: 'ease-out',
      },
    },
    
    // Button animations
    button: {
      hover: {
        from: { transform: 'translateY(0)' },
        to: { transform: 'translateY(-2px)' },
        duration: '200ms',
        easing: 'ease-out',
      },
      click: {
        from: { transform: 'scale(1)' },
        to: { transform: 'scale(0.95)' },
        duration: '100ms',
        easing: 'ease-in',
      },
      ripple: {
        from: { transform: 'scale(0)', opacity: '0.6' },
        to: { transform: 'scale(4)', opacity: '0' },
        duration: '600ms',
        easing: 'ease-out',
      },
    },
    
    // Loading animations
    loading: {
      spinner: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
        duration: '1000ms',
        easing: 'linear',
      },
      dots: {
        from: { opacity: '0.4' },
        to: { opacity: '1' },
        duration: '600ms',
        easing: 'ease-in-out',
      },
      skeleton: {
        from: { backgroundPosition: '-200px 0' },
        to: { backgroundPosition: 'calc(200px + 100%) 0' },
        duration: '1500ms',
        easing: 'ease-in-out',
      },
    },
    
    // Scroll animations
    scroll: {
      fadeInOnScroll: {
        from: { opacity: '0', transform: 'translateY(30px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
        duration: '600ms',
        easing: 'ease-out',
      },
      slideInOnScroll: {
        from: { transform: 'translateX(-50px)', opacity: '0' },
        to: { transform: 'translateX(0)', opacity: '1' },
        duration: '500ms',
        easing: 'ease-out',
      },
    },
  },
  
  // Transition presets
  transitions: {
    // Common transitions
    all: 'all 300ms ease-out',
    opacity: 'opacity 300ms ease-out',
    transform: 'transform 300ms ease-out',
    color: 'color 300ms ease-out',
    backgroundColor: 'background-color 300ms ease-out',
    borderColor: 'border-color 300ms ease-out',
    boxShadow: 'box-shadow 300ms ease-out',
    
    // Portfolio transitions
    cardHover: 'transform 300ms ease-out, box-shadow 300ms ease-out',
    buttonHover: 'transform 200ms ease-out, background-color 200ms ease-out',
    navSlide: 'transform 300ms ease-out',
    fadeIn: 'opacity 400ms ease-out, transform 400ms ease-out',
  },
} as const;

// Animation utility functions
export const getAnimation = (preset: string): any => {
  const keys = preset.split('.');
  let value: any = animations;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Animation preset "${preset}" not found`);
      return {};
    }
  }
  
  return value;
};

export const createKeyframes = (animation: any): string => {
  if (!animation.from || !animation.to) {
    return '';
  }
  
  return `
    @keyframes ${animation.name || 'custom'} {
      from {
        ${Object.entries(animation.from).map(([key, value]) => 
          `${key}: ${value};`
        ).join('\n        ')}
      }
      to {
        ${Object.entries(animation.to).map(([key, value]) => 
          `${key}: ${value};`
        ).join('\n        ')}
      }
    }
  `;
};

export const getTransition = (property: string): string => {
  return animations.transitions[property as keyof typeof animations.transitions] || 'all 300ms ease-out';
};

// CSS Custom Properties for Animations
export const animationCSSVariables = {
  '--duration-instant': animations.duration.instant,
  '--duration-fast': animations.duration.fast,
  '--duration-normal': animations.duration.normal,
  '--duration-slow': animations.duration.slow,
  '--duration-slower': animations.duration.slower,
  '--duration-slowest': animations.duration.slowest,
  '--easing-linear': animations.easing.linear,
  '--easing-ease': animations.easing.ease,
  '--easing-ease-in': animations.easing.easeIn,
  '--easing-ease-out': animations.easing.easeOut,
  '--easing-ease-in-out': animations.easing.easeInOut,
  '--easing-smooth': animations.easing.smooth,
  '--easing-bounce': animations.easing.bounce,
  '--easing-elastic': animations.easing.elastic,
  '--easing-portfolio': animations.easing.portfolio,
  '--easing-hover': animations.easing.hover,
  '--easing-slide': animations.easing.slide,
} as const;

export default animations;
