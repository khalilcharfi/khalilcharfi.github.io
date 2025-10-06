import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '../components/ui';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    spacing: 'md',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'OR',
    spacing: 'md',
  },
};

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    spacing: 'md',
  },
};

export const Dotted: Story = {
  args: {
    variant: 'dotted',
    spacing: 'md',
  },
};

export const AllVariants: StoryObj = {
  render: () => (
    <div>
      <p>Solid divider</p>
      <Divider variant="solid" />
      
      <p>Dashed divider</p>
      <Divider variant="dashed" />
      
      <p>Dotted divider</p>
      <Divider variant="dotted" />
    </div>
  ),
};

export const AllSpacing: StoryObj = {
  render: () => (
    <div>
      <p>None spacing</p>
      <Divider spacing="none" />
      <p>Small spacing</p>
      <Divider spacing="sm" />
      <p>Medium spacing</p>
      <Divider spacing="md" />
      <p>Large spacing</p>
      <Divider spacing="lg" />
      <p>End</p>
    </div>
  ),
};

export const WithLabels: StoryObj = {
  render: () => (
    <div>
      <p>Login with credentials</p>
      <Divider label="OR" spacing="lg" />
      <p>Continue with social</p>
      <Divider label="CONTINUE" spacing="lg" />
      <p>More options</p>
    </div>
  ),
};
