import React from 'react';
import { AnimatedBackground, type AnimatedBackgroundProps, type ColorScheme, type ParticleConfig } from './AnimatedBackground';

export type ParticleBackgroundPreset = 'cosmic' | 'ocean' | 'forest' | 'sunset' | 'aurora' | 'minimal';

export interface ParticleBackgroundProps extends Omit<AnimatedBackgroundProps, 'colorScheme' | 'particleConfig'> {
  preset?: ParticleBackgroundPreset;
  theme?: 'light' | 'dark';
}

const presets: Record<ParticleBackgroundPreset, { light: ColorScheme; dark: ColorScheme; config: ParticleConfig }> = {
  cosmic: {
    light: {
      baseColor: '#5B21B6',
      highlightColor: '#7C3AED',
      attractColor: '#DC2626',
      repelColor: '#EA580C',
      accentColor: '#6366F1',
      secondaryColor: '#059669',
      tertiaryColor: '#0891B2',
      backgroundColor: '#F3F4F6'
    },
    dark: {
      baseColor: '#5B21B6',
      highlightColor: '#7C3AED',
      attractColor: '#DC2626',
      repelColor: '#EA580C',
      accentColor: '#6366F1',
      secondaryColor: '#059669',
      tertiaryColor: '#0891B2',
      backgroundColor: '#0D1117'
    },
    config: {
      count: 5000,
      particleSize: { min: 0.028, max: 0.055 },
      animationSpeed: { base: 0.15, max: 0.3 },
      noiseIntensity: 1.2,
      interactionRadius: 6.5,
      bloomIntensity: 0.5,
      opacity: 0.75,
      colorVariation: 0.8,
      waveAmplitude: 3.5,
      spiralTightness: 0.8
    }
  },
  ocean: {
    light: {
      baseColor: '#0891B2',
      highlightColor: '#06B6D4',
      attractColor: '#0284C7',
      repelColor: '#0EA5E9',
      accentColor: '#3B82F6',
      secondaryColor: '#6366F1',
      tertiaryColor: '#8B5CF6',
      backgroundColor: '#F0F9FF'
    },
    dark: {
      baseColor: '#0891B2',
      highlightColor: '#06B6D4',
      attractColor: '#0284C7',
      repelColor: '#0EA5E9',
      accentColor: '#3B82F6',
      secondaryColor: '#6366F1',
      tertiaryColor: '#8B5CF6',
      backgroundColor: '#0C1821'
    },
    config: {
      count: 4000,
      particleSize: { min: 0.025, max: 0.05 },
      animationSpeed: { base: 0.1, max: 0.25 },
      noiseIntensity: 1.5,
      interactionRadius: 7.0,
      bloomIntensity: 0.6,
      opacity: 0.7,
      colorVariation: 0.9,
      waveAmplitude: 4.0,
      spiralTightness: 0.6
    }
  },
  forest: {
    light: {
      baseColor: '#059669',
      highlightColor: '#10B981',
      attractColor: '#84CC16',
      repelColor: '#22C55E',
      accentColor: '#16A34A',
      secondaryColor: '#15803D',
      tertiaryColor: '#65A30D',
      backgroundColor: '#F0FDF4'
    },
    dark: {
      baseColor: '#059669',
      highlightColor: '#10B981',
      attractColor: '#84CC16',
      repelColor: '#22C55E',
      accentColor: '#16A34A',
      secondaryColor: '#15803D',
      tertiaryColor: '#65A30D',
      backgroundColor: '#0A1F14'
    },
    config: {
      count: 3500,
      particleSize: { min: 0.03, max: 0.06 },
      animationSpeed: { base: 0.08, max: 0.2 },
      noiseIntensity: 1.0,
      interactionRadius: 5.5,
      bloomIntensity: 0.4,
      opacity: 0.8,
      colorVariation: 0.7,
      waveAmplitude: 2.5,
      spiralTightness: 1.0
    }
  },
  sunset: {
    light: {
      baseColor: '#F97316',
      highlightColor: '#FB923C',
      attractColor: '#F59E0B',
      repelColor: '#FBBF24',
      accentColor: '#EF4444',
      secondaryColor: '#EC4899',
      tertiaryColor: '#F472B6',
      backgroundColor: '#FFF7ED'
    },
    dark: {
      baseColor: '#F97316',
      highlightColor: '#FB923C',
      attractColor: '#F59E0B',
      repelColor: '#FBBF24',
      accentColor: '#EF4444',
      secondaryColor: '#EC4899',
      tertiaryColor: '#F472B6',
      backgroundColor: '#1C0F0A'
    },
    config: {
      count: 4500,
      particleSize: { min: 0.032, max: 0.065 },
      animationSpeed: { base: 0.12, max: 0.28 },
      noiseIntensity: 1.3,
      interactionRadius: 6.0,
      bloomIntensity: 0.7,
      opacity: 0.85,
      colorVariation: 1.0,
      waveAmplitude: 3.0,
      spiralTightness: 0.7
    }
  },
  aurora: {
    light: {
      baseColor: '#8B5CF6',
      highlightColor: '#A78BFA',
      attractColor: '#C084FC',
      repelColor: '#E9D5FF',
      accentColor: '#06B6D4',
      secondaryColor: '#10B981',
      tertiaryColor: '#F472B6',
      backgroundColor: '#FAF5FF'
    },
    dark: {
      baseColor: '#8B5CF6',
      highlightColor: '#A78BFA',
      attractColor: '#C084FC',
      repelColor: '#E9D5FF',
      accentColor: '#06B6D4',
      secondaryColor: '#10B981',
      tertiaryColor: '#F472B6',
      backgroundColor: '#0F0A1A'
    },
    config: {
      count: 6000,
      particleSize: { min: 0.025, max: 0.05 },
      animationSpeed: { base: 0.18, max: 0.35 },
      noiseIntensity: 1.4,
      interactionRadius: 7.5,
      bloomIntensity: 0.8,
      opacity: 0.7,
      colorVariation: 1.2,
      waveAmplitude: 4.5,
      spiralTightness: 0.5
    }
  },
  minimal: {
    light: {
      baseColor: '#6B7280',
      highlightColor: '#9CA3AF',
      attractColor: '#4B5563',
      repelColor: '#374151',
      accentColor: '#1F2937',
      secondaryColor: '#111827',
      tertiaryColor: '#6B7280',
      backgroundColor: '#FFFFFF'
    },
    dark: {
      baseColor: '#6B7280',
      highlightColor: '#9CA3AF',
      attractColor: '#4B5563',
      repelColor: '#374151',
      accentColor: '#D1D5DB',
      secondaryColor: '#E5E7EB',
      tertiaryColor: '#9CA3AF',
      backgroundColor: '#000000'
    },
    config: {
      count: 2000,
      particleSize: { min: 0.02, max: 0.04 },
      animationSpeed: { base: 0.05, max: 0.15 },
      noiseIntensity: 0.8,
      interactionRadius: 4.0,
      bloomIntensity: 0.2,
      opacity: 0.6,
      colorVariation: 0.3,
      waveAmplitude: 1.5,
      spiralTightness: 1.2
    }
  }
};

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  preset = 'cosmic',
  theme,
  ...props
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
      return;
    }

    const checkTheme = () => {
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(htmlTheme === 'light' ? 'light' : 'dark');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, [theme]);

  const presetConfig = presets[preset];
  const colorScheme = currentTheme === 'light' ? presetConfig.light : presetConfig.dark;

  return (
    <AnimatedBackground
      colorScheme={colorScheme}
      particleConfig={presetConfig.config}
      {...props}
    />
  );
};

export default ParticleBackground;
