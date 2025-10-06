import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '../components/ui';
import { useState } from 'react';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ width: '300px' }}>
        <Dropdown
          label="Select a fruit"
          options={[
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'orange', label: 'Orange' },
            { value: 'grape', label: 'Grape' },
          ]}
          value={value}
          onChange={setValue}
          placeholder="Choose a fruit..."
        />
        {value && <p style={{ marginTop: '1rem' }}>Selected: {value}</p>}
      </div>
    );
  },
};

export const WithIcons: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ width: '300px' }}>
        <Dropdown
          label="Select a category"
          options={[
            { value: 'general', label: 'General Inquiry', icon: <span>💬</span> },
            { value: 'support', label: 'Technical Support', icon: <span>🛠️</span> },
            { value: 'feedback', label: 'Feedback', icon: <span>💡</span> },
            { value: 'bug', label: 'Bug Report', icon: <span>🐛</span> },
          ]}
          value={value}
          onChange={setValue}
          placeholder="Choose a category..."
        />
      </div>
    );
  },
};

export const WithDisabledOption: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ width: '300px' }}>
        <Dropdown
          label="Select a plan"
          options={[
            { value: 'free', label: 'Free Plan' },
            { value: 'pro', label: 'Pro Plan' },
            { value: 'enterprise', label: 'Enterprise Plan', disabled: true },
          ]}
          value={value}
          onChange={setValue}
          placeholder="Choose a plan..."
        />
      </div>
    );
  },
};

export const Disabled: StoryObj = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Dropdown
        label="Disabled dropdown"
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ]}
        disabled
        placeholder="Cannot be opened..."
      />
    </div>
  ),
};
