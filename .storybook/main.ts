import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    "../src/shared/ui/stories/**/*.mdx",
    "../src/shared/ui/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: ["@storybook/addon-a11y", '@storybook/addon-docs'],

  framework: {
    name: "@storybook/react-vite",
    options: {}
  },

  core: {
    disableTelemetry: true,
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': '/src',
          '@/features': '/src/features',
          '@/shared': '/src/shared',
        },
        dedupe: ['react', 'react-dom', 'react/jsx-runtime']
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime'],
        force: true
      }
    });
  }
};

export default config;