// Design Tokens - Spacing System
export const spacing = {
  // Base spacing scale (8px base unit)
  scale: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    9: '2.25rem',   // 36px
    10: '2.5rem',   // 40px
    11: '2.75rem',  // 44px
    12: '3rem',     // 48px
    14: '3.5rem',   // 56px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    28: '7rem',     // 112px
    32: '8rem',     // 128px
    36: '9rem',     // 144px
    40: '10rem',    // 160px
    44: '11rem',    // 176px
    48: '12rem',    // 192px
    52: '13rem',    // 208px
    56: '14rem',    // 224px
    60: '15rem',    // 240px
    64: '16rem',    // 256px
    72: '18rem',    // 288px
    80: '20rem',    // 320px
    96: '24rem',    // 384px
  },
  
  // Semantic spacing
  semantic: {
    // Component spacing
    component: {
      padding: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      margin: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      gap: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
    },
    
    // Layout spacing
    layout: {
      section: {
        padding: '4rem 0',
        margin: '0',
      },
      container: {
        padding: '0 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
      },
      grid: {
        gap: '2rem',
      },
    },
    
    // Content spacing
    content: {
      paragraph: {
        marginBottom: '1rem',
      },
      heading: {
        marginTop: '2rem',
        marginBottom: '1rem',
      },
      list: {
        marginBottom: '1rem',
        paddingLeft: '1.5rem',
      },
    },
  },
  
  // Portfolio-specific spacing
  portfolio: {
    // Hero section
    hero: {
      padding: '6rem 0 4rem',
      margin: '0',
      gap: '2rem',
    },
    
    // Section spacing
    section: {
      padding: '4rem 0',
      margin: '0',
      gap: '2rem',
    },
    
    // Card spacing
    card: {
      padding: '1.5rem',
      margin: '0 0 2rem',
      gap: '1rem',
    },
    
    // Navigation spacing
    nav: {
      padding: '1rem 0',
      margin: '0',
      gap: '2rem',
    },
    
    // Button spacing
    button: {
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
      margin: '0.5rem',
      gap: '0.5rem',
    },
    
    // Form spacing
    form: {
      field: {
        marginBottom: '1.5rem',
      },
      group: {
        gap: '1rem',
        marginBottom: '2rem',
      },
    },
    
    // Grid spacing
    grid: {
      gap: '2rem',
      itemGap: '1rem',
    },
  },
  
  // Responsive spacing
  responsive: {
    mobile: {
      section: '2rem 0',
      container: '0 1rem',
      card: '1rem',
      button: '0.5rem 1rem',
    },
    tablet: {
      section: '3rem 0',
      container: '0 2rem',
      card: '1.25rem',
      button: '0.75rem 1.5rem',
    },
    desktop: {
      section: '4rem 0',
      container: '0 2rem',
      card: '1.5rem',
      button: '1rem 2rem',
    },
  },
} as const;

// Spacing utility functions
export const getSpacing = (key: string): string => {
  const keys = key.split('.');
  let value: any = spacing;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Spacing key "${key}" not found`);
      return '0';
    }
  }
  
  return value;
};

export const getResponsiveSpacing = (
  mobile: string,
  tablet: string,
  desktop: string
): string => {
  return `clamp(${mobile}, ${tablet}, ${desktop})`;
};

export const getSpacingScale = (multiplier: number): string => {
  const baseUnit = 0.25; // 4px
  return `${baseUnit * multiplier}rem`;
};

// CSS Custom Properties for Spacing
export const spacingCSSVariables = {
  '--spacing-0': spacing.scale[0],
  '--spacing-1': spacing.scale[1],
  '--spacing-2': spacing.scale[2],
  '--spacing-3': spacing.scale[3],
  '--spacing-4': spacing.scale[4],
  '--spacing-5': spacing.scale[5],
  '--spacing-6': spacing.scale[6],
  '--spacing-8': spacing.scale[8],
  '--spacing-10': spacing.scale[10],
  '--spacing-12': spacing.scale[12],
  '--spacing-16': spacing.scale[16],
  '--spacing-20': spacing.scale[20],
  '--spacing-24': spacing.scale[24],
  '--spacing-32': spacing.scale[32],
  '--spacing-40': spacing.scale[40],
  '--spacing-48': spacing.scale[48],
  '--spacing-56': spacing.scale[56],
  '--spacing-64': spacing.scale[64],
  '--spacing-72': spacing.scale[72],
  '--spacing-80': spacing.scale[80],
  '--spacing-96': spacing.scale[96],
} as const;

export default spacing;
