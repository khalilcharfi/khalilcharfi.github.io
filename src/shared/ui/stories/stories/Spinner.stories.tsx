import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, LoadingOverlay, Button } from '../components/ui';
import { useState } from 'react';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['border', 'dots', 'pulse'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Border: Story = {
  args: {
    variant: 'border',
    size: 'md',
  },
};

export const Dots: Story = {
  args: {
    variant: 'dots',
    size: 'md',
  },
};

export const Pulse: Story = {
  args: {
    variant: 'pulse',
    size: 'md',
  },
};

export const AllSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Spinner variant="border" size="lg" />
      <Spinner variant="dots" size="lg" />
      <Spinner variant="pulse" size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    variant: 'border',
    size: 'lg',
    color: '#667eea',
  },
};

export const LoadingOverlayExample: StoryObj = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    
    return (
      <div style={{ width: '400px' }}>
        <LoadingOverlay isLoading={isLoading} message="Loading data...">
          <div style={{ 
            padding: '3rem', 
            background: '#f5f5f5', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Content Area</h3>
            <p>This content will be overlaid when loading.</p>
            <Button onClick={() => setIsLoading(!isLoading)}>
              {isLoading ? 'Stop Loading' : 'Start Loading'}
            </Button>
          </div>
        </LoadingOverlay>
      </div>
    );
  },
};
