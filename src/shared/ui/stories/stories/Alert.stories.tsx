import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../components/ui';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    dismissible: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <strong>Success!</strong> Your changes have been saved successfully.
      </>
    ),
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Please review your information before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'An error occurred while processing your request.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    dismissible: true,
    children: 'This alert can be dismissed by clicking the × button.',
    onDismiss: () => console.log('Alert dismissed'),
  },
};

export const WithCustomIcon: Story = {
  args: {
    variant: 'success',
    icon: <span style={{ fontSize: '1.5rem' }}>🎉</span>,
    children: 'Congratulations! You completed the tutorial!',
  },
};
