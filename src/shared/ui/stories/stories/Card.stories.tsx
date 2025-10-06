import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from '../components/ui';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'outlined', 'elevated'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hoverable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    children: (
      <>
        <CardHeader title="Card Title" subtitle="Card subtitle" />
        <CardBody>
          <p>This is the card content. It can contain any React components.</p>
        </CardBody>
        <CardFooter align="right">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Save</Button>
        </CardFooter>
      </>
    ),
  },
  parameters: {
    layout: 'padded',
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    padding: 'md',
    children: (
      <>
        <CardHeader title="Glass Morphism Card" />
        <CardBody>
          <p>A modern glass morphism effect card with blur backdrop.</p>
        </CardBody>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    hoverable: true,
    children: (
      <>
        <CardHeader 
          title="Hoverable Card" 
          action={<Badge variant="success">Active</Badge>}
        />
        <CardBody>
          <p>Hover over this card to see the elevation effect!</p>
        </CardBody>
      </>
    ),
  },
};

export const WithActionHeader: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    children: (
      <>
        <CardHeader 
          title="Project Status"
          subtitle="Last updated 2 hours ago"
          action={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge variant="primary">In Progress</Badge>
              <Badge variant="info">New</Badge>
            </div>
          }
        />
        <CardBody>
          <p>Project details and content go here.</p>
        </CardBody>
      </>
    ),
  },
};
