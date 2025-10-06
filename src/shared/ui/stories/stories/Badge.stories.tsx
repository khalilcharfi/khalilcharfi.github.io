import type { Meta, StoryObj } from '@storybook/react';
import { Badge, DotBadge } from '../components/ui';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

export const Rounded: Story = {
  args: {
    variant: 'primary',
    rounded: true,
    children: 'Rounded Badge',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'success',
    icon: <span>✓</span>,
    children: 'Completed',
  },
};

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// Dot Badge Stories
export const DotBadgeOnline: StoryObj = {
  render: () => <DotBadge variant="success" label="Online" pulse />,
};

export const DotBadgeAway: StoryObj = {
  render: () => <DotBadge variant="warning" label="Away" />,
};

export const DotBadgeOffline: StoryObj = {
  render: () => <DotBadge variant="default" label="Offline" />,
};
