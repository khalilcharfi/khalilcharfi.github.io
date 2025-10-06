import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuItem, MenuDivider, MenuGroup } from '../components/ui';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Vertical: StoryObj = {
  render: () => (
    <Menu variant="bordered" orientation="vertical">
      <MenuItem
        as="button"
        icon={<span>👤</span>}
        label="Profile"
        onClick={() => console.log('Profile clicked')}
      />
      <MenuItem
        as="button"
        icon={<span>⚙️</span>}
        label="Settings"
        onClick={() => console.log('Settings clicked')}
      />
      <MenuItem
        as="button"
        icon={<span>🔔</span>}
        label="Notifications"
        onClick={() => console.log('Notifications clicked')}
      />
      <MenuDivider />
      <MenuItem
        as="button"
        icon={<span>🚪</span>}
        label="Logout"
        onClick={() => console.log('Logout clicked')}
      />
    </Menu>
  ),
};

export const WithGroups: StoryObj = {
  render: () => (
    <Menu variant="bordered">
      <MenuGroup label="Account">
        <MenuItem
          as="button"
          icon={<span>👤</span>}
          label="Profile"
          description="View and edit your profile"
          onClick={() => console.log('Profile')}
        />
        <MenuItem
          as="button"
          icon={<span>⚙️</span>}
          label="Settings"
          description="Manage account settings"
          onClick={() => console.log('Settings')}
        />
      </MenuGroup>
      
      <MenuDivider />
      
      <MenuGroup label="Actions">
        <MenuItem
          as="button"
          icon={<span>📤</span>}
          label="Export Data"
          onClick={() => console.log('Export')}
        />
        <MenuItem
          as="button"
          icon={<span>🗑️</span>}
          label="Delete Account"
          onClick={() => console.log('Delete')}
        />
      </MenuGroup>
    </Menu>
  ),
};

export const AsLinks: StoryObj = {
  render: () => (
    <Menu variant="bordered">
      <MenuItem
        as="link"
        href="/home"
        icon={<span>🏠</span>}
        label="Home"
      />
      <MenuItem
        as="link"
        href="/about"
        icon={<span>ℹ️</span>}
        label="About"
      />
      <MenuItem
        as="link"
        href="/contact"
        icon={<span>📧</span>}
        label="Contact"
        active
      />
    </Menu>
  ),
};

export const Horizontal: StoryObj = {
  render: () => (
    <Menu orientation="horizontal">
      <MenuItem as="button" label="Home" onClick={() => console.log('Home')} />
      <MenuItem as="button" label="About" onClick={() => console.log('About')} />
      <MenuItem as="button" label="Services" onClick={() => console.log('Services')} />
      <MenuItem as="button" label="Contact" onClick={() => console.log('Contact')} />
    </Menu>
  ),
};
