import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, SimpleTabs } from '../components/ui';
import { useState } from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs
      tabs={[
        {
          id: 'tab1',
          label: 'Overview',
          content: (
            <div style={{ padding: '1rem' }}>
              <h3>Overview Tab</h3>
              <p>This is the overview content.</p>
            </div>
          ),
        },
        {
          id: 'tab2',
          label: 'Details',
          content: (
            <div style={{ padding: '1rem' }}>
              <h3>Details Tab</h3>
              <p>This is the details content.</p>
            </div>
          ),
        },
        {
          id: 'tab3',
          label: 'Settings',
          content: (
            <div style={{ padding: '1rem' }}>
              <h3>Settings Tab</h3>
              <p>This is the settings content.</p>
            </div>
          ),
        },
      ]}
    />
  ),
};

export const Pills: StoryObj = {
  render: () => (
    <Tabs
      variant="pills"
      tabs={[
        {
          id: 'tab1',
          label: 'Profile',
          icon: <span>👤</span>,
          content: <div style={{ padding: '1rem' }}>Profile content</div>,
        },
        {
          id: 'tab2',
          label: 'Messages',
          icon: <span>📧</span>,
          content: <div style={{ padding: '1rem' }}>Messages content</div>,
        },
        {
          id: 'tab3',
          label: 'Notifications',
          icon: <span>🔔</span>,
          content: <div style={{ padding: '1rem' }}>Notifications content</div>,
        },
      ]}
    />
  ),
};

export const Underline: StoryObj = {
  render: () => (
    <Tabs
      variant="underline"
      tabs={[
        { id: 'tab1', label: 'Home', content: <div style={{ padding: '1rem' }}>Home</div> },
        { id: 'tab2', label: 'About', content: <div style={{ padding: '1rem' }}>About</div> },
        { id: 'tab3', label: 'Contact', content: <div style={{ padding: '1rem' }}>Contact</div> },
      ]}
    />
  ),
};

export const Controlled: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    return (
      <div>
        <p>Active tab: <strong>{activeTab}</strong></p>
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'tab1', label: 'Tab 1', content: <div style={{ padding: '1rem' }}>Content 1</div> },
            { id: 'tab2', label: 'Tab 2', content: <div style={{ padding: '1rem' }}>Content 2</div> },
            { id: 'tab3', label: 'Tab 3', content: <div style={{ padding: '1rem' }}>Content 3</div> },
          ]}
        />
      </div>
    );
  },
};
