import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, Button } from '../components/ui';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Top: StoryObj = {
  render: () => (
    <Tooltip content="This is a tooltip on top" placement="top">
      <Button>Hover me (Top)</Button>
    </Tooltip>
  ),
};

export const Bottom: StoryObj = {
  render: () => (
    <Tooltip content="This is a tooltip on bottom" placement="bottom">
      <Button>Hover me (Bottom)</Button>
    </Tooltip>
  ),
};

export const Left: StoryObj = {
  render: () => (
    <Tooltip content="This is a tooltip on left" placement="left">
      <Button>Hover me (Left)</Button>
    </Tooltip>
  ),
};

export const Right: StoryObj = {
  render: () => (
    <Tooltip content="This is a tooltip on right" placement="right">
      <Button>Hover me (Right)</Button>
    </Tooltip>
  ),
};

export const AllPlacements: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', padding: '4rem' }}>
      <Tooltip content="Top placement" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom placement" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left placement" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right placement" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: StoryObj = {
  render: () => (
    <Tooltip content="This is a very long tooltip content that will wrap to multiple lines when it exceeds the maximum width. It demonstrates how the tooltip handles longer text content.">
      <Button>Hover for long tooltip</Button>
    </Tooltip>
  ),
};
