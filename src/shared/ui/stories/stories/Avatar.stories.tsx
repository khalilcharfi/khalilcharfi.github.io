import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from '../components/ui';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'rounded'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    alt: 'John Doe',
    fallback: 'JD',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://via.placeholder.com/150',
    alt: 'User Avatar',
  },
};

export const WithStatus: Story = {
  args: {
    alt: 'Online User',
    fallback: 'OU',
    status: 'online',
  },
};

export const AllSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar alt="XS" fallback="XS" size="xs" />
      <Avatar alt="SM" fallback="SM" size="sm" />
      <Avatar alt="MD" fallback="MD" size="md" />
      <Avatar alt="LG" fallback="LG" size="lg" />
      <Avatar alt="XL" fallback="XL" size="xl" />
    </div>
  ),
};

export const AllShapes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar alt="Circle" fallback="C" shape="circle" size="lg" />
      <Avatar alt="Square" fallback="S" shape="square" size="lg" />
      <Avatar alt="Rounded" fallback="R" shape="rounded" size="lg" />
    </div>
  ),
};

export const AllStatuses: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar alt="Online" fallback="ON" status="online" size="lg" />
      <Avatar alt="Away" fallback="AW" status="away" size="lg" />
      <Avatar alt="Busy" fallback="BS" status="busy" size="lg" />
      <Avatar alt="Offline" fallback="OF" status="offline" size="lg" />
    </div>
  ),
};

export const GroupExample: StoryObj = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar alt="User 1" fallback="U1" />
      <Avatar alt="User 2" fallback="U2" />
      <Avatar alt="User 3" fallback="U3" />
      <Avatar alt="User 4" fallback="U4" />
      <Avatar alt="User 5" fallback="U5" />
      <Avatar alt="User 6" fallback="U6" />
    </AvatarGroup>
  ),
};
