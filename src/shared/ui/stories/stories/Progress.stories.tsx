import type { Meta, StoryObj } from '@storybook/react';
import { Progress, CircularProgress } from '../components/ui';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    showLabel: true,
  },
};

export const CustomLabel: Story = {
  args: {
    value: 45,
    showLabel: true,
    label: 'Upload Progress: 45MB / 100MB',
  },
};

export const Success: Story = {
  args: {
    value: 100,
    variant: 'success',
    showLabel: true,
  },
};

export const Warning: Story = {
  args: {
    value: 50,
    variant: 'warning',
    showLabel: true,
  },
};

export const Danger: Story = {
  args: {
    value: 20,
    variant: 'danger',
    showLabel: true,
  },
};

export const Striped: Story = {
  args: {
    value: 75,
    striped: true,
    showLabel: true,
  },
};

export const Animated: Story = {
  args: {
    value: 75,
    striped: true,
    animated: true,
    showLabel: true,
  },
};

export const CircularDefault: StoryObj = {
  render: () => <CircularProgress value={75} showLabel />,
};

export const CircularSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <CircularProgress value={25} size={60} />
      <CircularProgress value={50} size={80} />
      <CircularProgress value={75} size={100} showLabel />
      <CircularProgress value={90} size={120} showLabel />
    </div>
  ),
};

export const CircularVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <CircularProgress value={60} variant="default" showLabel />
      <CircularProgress value={100} variant="success" showLabel />
      <CircularProgress value={50} variant="warning" showLabel />
      <CircularProgress value={25} variant="danger" showLabel />
    </div>
  ),
};
