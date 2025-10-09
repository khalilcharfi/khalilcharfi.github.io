// Design Tokens - Brand Colors
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d7fe',
    300: '#a5b8fd',
    400: '#8192fc',
    500: '#667eea', // Main brand color
    600: '#5a67d8',
    700: '#4c51bf',
    800: '#434190',
    900: '#3c366b',
  },
  
  // Secondary Brand Colors
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#764ba2', // Main secondary color
    600: '#d946ef',
    700: '#c026d3',
    800: '#a21caf',
    900: '#86198f',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  
  // Dark Theme Colors
  dark: {
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
  },
  
  // Semantic Colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  
  // Portfolio-Specific Colors
  portfolio: {
    background: {
      primary: '#1a1a1a',
      secondary: '#2a2a2a',
      tertiary: '#3a3a3a',
      card: '#1e1e1e',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      tertiary: '#999999',
      muted: '#666666',
      inverse: '#000000',
    },
    accent: {
      gradient: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      glow: 'rgba(102, 126, 234, 0.3)',
      highlight: 'rgba(102, 126, 234, 0.1)',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      accent: 'rgba(102, 126, 234, 0.3)',
    },
  },
  
  // Status Colors
  status: {
    online: '#22c55e',
    offline: '#ef4444',
    away: '#f59e0b',
    busy: '#8b5cf6',
  },
  
  // Project Category Colors
  project: {
    web: '#3b82f6',
    mobile: '#10b981',
    desktop: '#8b5cf6',
    ai: '#f59e0b',
    devops: '#ef4444',
    other: '#6b7280',
  },
  
  // Skill Category Colors
  skill: {
    frontend: '#3b82f6',
    backend: '#10b981',
    mobile: '#8b5cf6',
    database: '#f59e0b',
    devops: '#ef4444',
    cloud: '#06b6d4',
    tools: '#6b7280',
    languages: '#84cc16',
    'soft-skills': '#ec4899',
  },
} as const;

// Color utility functions
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = colors;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`);
      return '#000000';
    }
  }
  
  return value;
};

export const getGradient = (from: string, to: string, direction: string = '45deg'): string => {
  return `linear-gradient(${direction}, ${from} 0%, ${to} 100%)`;
};

export const getShadow = (color: string, opacity: number = 0.3): string => {
  return `0 4px 15px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export const getGlow = (color: string, intensity: number = 1): string => {
  return `0 0 ${20 * intensity}px ${color}`;
};

// CSS Custom Properties
export const cssVariables = {
  '--color-primary': colors.primary[500],
  '--color-secondary': colors.secondary[500],
  '--color-background': colors.portfolio.background.primary,
  '--color-text': colors.portfolio.text.primary,
  '--color-text-secondary': colors.portfolio.text.secondary,
  '--color-accent-gradient': colors.portfolio.accent.gradient,
  '--color-border': colors.portfolio.border.primary,
  '--color-card': colors.portfolio.background.card,
  '--color-overlay': colors.portfolio.background.overlay,
} as const;

export default colors;
