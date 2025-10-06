import type { Meta, StoryObj } from '@storybook/react';
import { 
  Form, 
  FormGroup, 
  FormRow, 
  FormSection, 
  FormActions,
  Input,
  Textarea,
  Checkbox,
  Toggle,
  Dropdown,
  Button
} from '../components/ui';
import { useState } from 'react';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const CompleteForm: StoryObj = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      newsletter: false,
      notifications: true,
      category: '',
    });

    return (
      <Form onSubmit={(e) => { e.preventDefault(); console.log(formData); }}>
        <FormSection title="Personal Information" description="Tell us about yourself">
          <FormRow columns={2} gap="md">
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              fullWidth
            />
          </FormRow>

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
            leftIcon={<span>📧</span>}
          />

          <Textarea
            label="Message"
            placeholder="Enter your message..."
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            fullWidth
          />
        </FormSection>

        <FormSection title="Preferences">
          <FormGroup>
            <Checkbox
              label="Subscribe to newsletter"
              description="Get weekly updates about our products"
              checked={formData.newsletter}
              onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
            />
            
            <Toggle
              label="Enable notifications"
              description="Receive email notifications"
              checked={formData.notifications}
              onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
            />
          </FormGroup>

          <Dropdown
            label="Category"
            options={[
              { value: 'general', label: 'General Inquiry' },
              { value: 'support', label: 'Technical Support' },
              { value: 'feedback', label: 'Feedback' },
            ]}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            placeholder="Choose a category..."
          />
        </FormSection>

        <FormActions align="right">
          <Button variant="secondary" type="button">Cancel</Button>
          <Button variant="primary" type="submit">Submit</Button>
        </FormActions>
      </Form>
    );
  },
};

export const SimpleInput: StoryObj = {
  render: () => (
    <Input label="Email" type="email" placeholder="you@example.com" fullWidth />
  ),
};

export const TextareaExample: StoryObj = {
  render: () => (
    <Textarea label="Description" placeholder="Enter description..." rows={6} fullWidth />
  ),
};

export const CheckboxExample: StoryObj = {
  render: () => (
    <Checkbox 
      label="I agree to the terms and conditions"
      description="By checking this box, you accept our terms"
    />
  ),
};

export const ToggleExample: StoryObj = {
  render: () => (
    <Toggle 
      label="Dark Mode"
      description="Enable dark theme"
    />
  ),
};
