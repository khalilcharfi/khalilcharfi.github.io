// Design Tokens - Typography System
export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'sans-serif'
    ],
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace'
    ],
    display: [
      'Inter',
      'system-ui',
      'sans-serif'
    ],
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text Styles
  textStyles: {
    // Display Styles
    display: {
      '2xl': {
        fontSize: '4.5rem',
        lineHeight: '1',
        fontWeight: '800',
        letterSpacing: '-0.025em',
      },
      xl: {
        fontSize: '3.75rem',
        lineHeight: '1',
        fontWeight: '800',
        letterSpacing: '-0.025em',
      },
      lg: {
        fontSize: '3rem',
        lineHeight: '1.1',
        fontWeight: '700',
        letterSpacing: '-0.025em',
      },
      md: {
        fontSize: '2.25rem',
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '-0.025em',
      },
      sm: {
        fontSize: '1.875rem',
        lineHeight: '1.3',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
    },
    
    // Heading Styles
    heading: {
      h1: {
        fontSize: '2.25rem',
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '-0.025em',
      },
      h2: {
        fontSize: '1.875rem',
        lineHeight: '1.3',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      h3: {
        fontSize: '1.5rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      h4: {
        fontSize: '1.25rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      h5: {
        fontSize: '1.125rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      h6: {
        fontSize: '1rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
    },
    
    // Body Text Styles
    body: {
      large: {
        fontSize: '1.125rem',
        lineHeight: '1.6',
        fontWeight: '400',
      },
      base: {
        fontSize: '1rem',
        lineHeight: '1.5',
        fontWeight: '400',
      },
      small: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        fontWeight: '400',
      },
    },
    
    // Label Styles
    label: {
      large: {
        fontSize: '0.875rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
      base: {
        fontSize: '0.75rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
      small: {
        fontSize: '0.625rem',
        lineHeight: '1.4',
        fontWeight: '600',
        letterSpacing: '0.05em',
      },
    },
    
    // Caption Styles
    caption: {
      large: {
        fontSize: '0.875rem',
        lineHeight: '1.4',
        fontWeight: '400',
        opacity: '0.8',
      },
      base: {
        fontSize: '0.75rem',
        lineHeight: '1.4',
        fontWeight: '400',
        opacity: '0.8',
      },
      small: {
        fontSize: '0.625rem',
        lineHeight: '1.4',
        fontWeight: '400',
        opacity: '0.8',
      },
    },
  },
  
  // Portfolio-Specific Typography
  portfolio: {
    hero: {
      title: {
        fontSize: '4rem',
        lineHeight: '1.1',
        fontWeight: '800',
        letterSpacing: '-0.05em',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      subtitle: {
        fontSize: '1.5rem',
        lineHeight: '1.4',
        fontWeight: '400',
        letterSpacing: '-0.025em',
        opacity: '0.9',
      },
    },
    section: {
      title: {
        fontSize: '2.5rem',
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '-0.025em',
      },
      subtitle: {
        fontSize: '1.25rem',
        lineHeight: '1.4',
        fontWeight: '500',
        letterSpacing: '-0.025em',
        opacity: '0.8',
      },
    },
    card: {
      title: {
        fontSize: '1.25rem',
        lineHeight: '1.3',
        fontWeight: '600',
        letterSpacing: '-0.025em',
      },
      description: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        fontWeight: '400',
        opacity: '0.8',
      },
    },
    button: {
      large: {
        fontSize: '1rem',
        lineHeight: '1.5',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
      base: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
      small: {
        fontSize: '0.75rem',
        lineHeight: '1.5',
        fontWeight: '600',
        letterSpacing: '0.025em',
      },
    },
    code: {
      inline: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        fontWeight: '400',
        fontFamily: 'JetBrains Mono, monospace',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '0.125rem 0.25rem',
        borderRadius: '0.25rem',
      },
      block: {
        fontSize: '0.875rem',
        lineHeight: '1.6',
        fontWeight: '400',
        fontFamily: 'JetBrains Mono, monospace',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '1rem',
        borderRadius: '0.5rem',
        overflow: 'auto',
      },
    },
  },
} as const;

// Typography utility functions
export const getFontFamily = (family: keyof typeof typography.fontFamily): string => {
  return typography.fontFamily[family].join(', ');
};

export const getTextStyle = (style: string): any => {
  const [category, variant] = style.split('.');
  return typography.textStyles[category as keyof typeof typography.textStyles]?.[variant];
};

export const getResponsiveFontSize = (
  mobile: string,
  tablet: string,
  desktop: string
): string => {
  return `clamp(${mobile}, ${tablet}, ${desktop})`;
};

// CSS Custom Properties for Typography
export const typographyCSSVariables = {
  '--font-family-sans': getFontFamily('sans'),
  '--font-family-mono': getFontFamily('mono'),
  '--font-family-display': getFontFamily('display'),
  '--font-size-xs': typography.fontSize.xs,
  '--font-size-sm': typography.fontSize.sm,
  '--font-size-base': typography.fontSize.base,
  '--font-size-lg': typography.fontSize.lg,
  '--font-size-xl': typography.fontSize.xl,
  '--font-size-2xl': typography.fontSize['2xl'],
  '--font-size-3xl': typography.fontSize['3xl'],
  '--font-size-4xl': typography.fontSize['4xl'],
  '--font-size-5xl': typography.fontSize['5xl'],
  '--font-size-6xl': typography.fontSize['6xl'],
  '--font-size-7xl': typography.fontSize['7xl'],
  '--font-size-8xl': typography.fontSize['8xl'],
  '--font-size-9xl': typography.fontSize['9xl'],
} as const;

export default typography;
