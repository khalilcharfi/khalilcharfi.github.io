import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../components/ui';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'What is this component library?',
        content: <p>This is a comprehensive collection of reusable React components.</p>,
      },
      {
        id: '2',
        title: 'How do I use it?',
        content: <p>Import the components you need and use them in your React application.</p>,
      },
      {
        id: '3',
        title: 'Is it accessible?',
        content: <p>Yes! All components follow WCAG 2.1 Level AA guidelines.</p>,
      },
    ],
  },
};

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    items: [
      {
        id: '1',
        title: 'Account Settings',
        icon: <span>⚙️</span>,
        content: <p>Manage your account preferences and settings.</p>,
      },
      {
        id: '2',
        title: 'Privacy & Security',
        icon: <span>🔒</span>,
        content: <p>Control your privacy settings and security options.</p>,
      },
      {
        id: '3',
        title: 'Notifications',
        icon: <span>🔔</span>,
        content: <p>Customize how you receive notifications.</p>,
      },
    ],
  },
};

export const Separated: Story = {
  args: {
    variant: 'separated',
    items: [
      {
        id: '1',
        title: 'Getting Started',
        content: <p>Learn the basics of using our platform.</p>,
      },
      {
        id: '2',
        title: 'Advanced Features',
        content: <p>Explore powerful features for power users.</p>,
      },
      {
        id: '3',
        title: 'Troubleshooting',
        content: <p>Solutions to common issues.</p>,
      },
    ],
  },
};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: ['1', '2'],
    items: [
      {
        id: '1',
        title: 'Section 1 (Open by default)',
        content: <p>This section is open when the component loads.</p>,
      },
      {
        id: '2',
        title: 'Section 2 (Open by default)',
        content: <p>This section is also open when the component loads.</p>,
      },
      {
        id: '3',
        title: 'Section 3 (Closed)',
        content: <p>This section starts closed.</p>,
      },
    ],
  },
};

export const AllowMultiple: Story = {
  args: {
    allowMultiple: true,
    items: [
      {
        id: '1',
        title: 'Multiple sections can be open',
        content: <p>You can open multiple sections at once.</p>,
      },
      {
        id: '2',
        title: 'Try opening all of them',
        content: <p>All sections can be expanded simultaneously.</p>,
      },
      {
        id: '3',
        title: 'This is useful for FAQs',
        content: <p>Users can compare different sections side by side.</p>,
      },
    ],
  },
};
