// Design Tokens - Main Export
export { colors, getColor, getGradient, getShadow, getGlow, cssVariables as colorCSSVariables } from './colors';
export { typography, getFontFamily, getTextStyle, getResponsiveFontSize, typographyCSSVariables } from './typography';
export { spacing, getSpacing, getResponsiveSpacing, getSpacingScale, spacingCSSVariables } from './spacing';
export { animations, getAnimation, createKeyframes, getTransition, animationCSSVariables } from './animations';

// Combined CSS Variables
export const designSystemCSSVariables = {
  ...colorCSSVariables,
  ...typographyCSSVariables,
  ...spacingCSSVariables,
  ...animationCSSVariables,
} as const;

// Design System Configuration
export const designSystem = {
  colors,
  typography,
  spacing,
  animations,
  cssVariables: designSystemCSSVariables,
} as const;

export default designSystem;
