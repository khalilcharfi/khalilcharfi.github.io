import React, { useState } from 'react';
import {
    Button,
    IconButton,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Badge,
    DotBadge,
    Alert,
    Spinner,
    LoadingOverlay,
    Tooltip,
    Accordion,
    Divider,
    Avatar,
    AvatarGroup,
    Progress,
    CircularProgress,
    Modal,
    Tabs,
    Input,
    Textarea,
    Checkbox,
    Form,
    FormGroup,
    FormRow,
    FormSection,
    FormActions,
    Toggle,
    Dropdown,
    Menu,
    MenuItem,
    MenuDivider,
    MenuGroup
} from './index';

/**
 * Example Component Showcasing All UI Components
 * 
 * This file demonstrates how to use all the extracted UI components
 * in a real-world scenario.
 */

export const ExampleUsage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(45);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        newsletter: false,
        notifications: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Form submitted successfully!');
        }, 2000);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>UI Components Showcase</h1>
            <Divider spacing="lg" label="Interactive Components" />

            {/* Buttons Section */}
            <Card variant="default" padding="md" style={{ marginBottom: '2rem' }}>
                <CardHeader title="Buttons" subtitle="Various button variants and states" />
                <CardBody>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button variant="primary">Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="danger">Danger Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                        <Button variant="link">Link Button</Button>
                        <Button variant="primary" isLoading>Loading...</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                        
                        <Divider />
                        
                        <IconButton 
                            icon={<span>✕</span>} 
                            aria-label="Close"
                            variant="ghost"
                        />
                        <IconButton 
                            icon={<span>⚙️</span>} 
                            aria-label="Settings"
                            variant="secondary"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Cards & Badges Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Card variant="glass" padding="md" hoverable>
                    <CardHeader 
                        title="Glass Card" 
                        action={<Badge variant="success">Active</Badge>}
                    />
                    <CardBody>
                        <p>This is a glass morphism card with hover effect.</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <Badge variant="primary" rounded>Tag 1</Badge>
                            <Badge variant="secondary" rounded>Tag 2</Badge>
                            <Badge variant="info" rounded>New</Badge>
                        </div>
                    </CardBody>
                    <CardFooter align="right">
                        <Button variant="secondary" size="sm">Cancel</Button>
                        <Button variant="primary" size="sm">Save</Button>
                    </CardFooter>
                </Card>

                <Card variant="elevated" padding="md">
                    <CardHeader title="User Status" />
                    <CardBody>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <DotBadge variant="success" label="Online" pulse />
                            <DotBadge variant="warning" label="Away" />
                            <DotBadge variant="danger" label="Busy" />
                            <DotBadge variant="default" label="Offline" />
                        </div>
                    </CardBody>
                </Card>

                <Card variant="outlined" padding="md">
                    <CardHeader title="Team Members" />
                    <CardBody>
                        <AvatarGroup max={4} size="md">
                            <Avatar alt="User 1" fallback="U1" status="online" />
                            <Avatar alt="User 2" fallback="U2" status="away" />
                            <Avatar alt="User 3" fallback="U3" status="busy" />
                            <Avatar alt="User 4" fallback="U4" />
                            <Avatar alt="User 5" fallback="U5" />
                        </AvatarGroup>
                    </CardBody>
                </Card>
            </div>

            {/* Alerts Section */}
            <Alert variant="info" dismissible onDismiss={() => console.log('Dismissed')}>
                <strong>Info:</strong> This is an informational message with dismiss button.
            </Alert>
            
            <Alert variant="success">
                <strong>Success!</strong> Your changes have been saved.
            </Alert>
            
            <Alert variant="warning" title="Warning">
                Please review your information before proceeding.
            </Alert>

            <Divider spacing="lg" />

            {/* Loading & Progress Section */}
            <Card variant="default" padding="md" style={{ marginBottom: '2rem' }}>
                <CardHeader title="Loading States & Progress" />
                <CardBody>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <p>Border Spinner:</p>
                            <Spinner variant="border" size="md" />
                        </div>
                        <div>
                            <p>Dots Spinner:</p>
                            <Spinner variant="dots" size="md" />
                        </div>
                        <div>
                            <p>Pulse Spinner:</p>
                            <Spinner variant="pulse" size="md" />
                        </div>
                        <div>
                            <p>Circular Progress:</p>
                            <CircularProgress value={75} size={80} showLabel />
                        </div>
                    </div>

                    <Progress 
                        value={progress} 
                        showLabel 
                        label="Upload Progress" 
                        variant="success"
                    />
                    
                    <div style={{ marginTop: '1rem' }}>
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setProgress(Math.min(progress + 10, 100))}
                        >
                            Increase Progress
                        </Button>
                    </div>

                    <Divider spacing="md" />

                    <LoadingOverlay isLoading={isLoading} message="Processing...">
                        <div style={{ padding: '3rem', background: '#f5f5f5', borderRadius: '8px' }}>
                            <p>Content with loading overlay</p>
                            <Button variant="primary" onClick={() => setIsLoading(!isLoading)}>
                                Toggle Loading
                            </Button>
                        </div>
                    </LoadingOverlay>
                </CardBody>
            </Card>

            {/* Accordion Section */}
            <Accordion
                variant="bordered"
                items={[
                    {
                        id: '1',
                        title: 'What is this component library?',
                        content: <p>This is a comprehensive collection of reusable React components extracted from your application.</p>
                    },
                    {
                        id: '2',
                        title: 'How do I use these components?',
                        content: <p>Simply import the components you need and use them in your React application. They're fully typed with TypeScript.</p>
                    },
                    {
                        id: '3',
                        title: 'Are these components accessible?',
                        content: <p>Yes! All components follow WCAG 2.1 Level AA guidelines and include proper ARIA attributes.</p>
                    }
                ]}
                defaultOpen={['1']}
            />

            <Divider spacing="lg" label="Forms" />

            {/* Form Section */}
            <Card variant="default" padding="md">
                <CardHeader title="Contact Form" subtitle="Fill out the form below" />
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <FormSection title="Personal Information">
                            <FormRow columns={2} gap="md">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    fullWidth
                                />
                            </FormRow>

                            <Textarea
                                label="Message"
                                placeholder="Enter your message..."
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
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
                                    description="Receive email notifications for important updates"
                                    checked={formData.notifications}
                                    onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                                />
                            </FormGroup>

                            <Dropdown
                                label="Select a category"
                                options={[
                                    { value: 'general', label: 'General Inquiry' },
                                    { value: 'support', label: 'Technical Support' },
                                    { value: 'feedback', label: 'Feedback' },
                                    { value: 'other', label: 'Other' }
                                ]}
                                placeholder="Choose one..."
                            />
                        </FormSection>

                        <FormActions align="right">
                            <Button variant="secondary" type="button">Cancel</Button>
                            <Button variant="primary" type="submit" isLoading={isLoading}>
                                Submit Form
                            </Button>
                        </FormActions>
                    </Form>
                </CardBody>
            </Card>

            <Divider spacing="lg" />

            {/* Modal & Tabs Section */}
            <Card variant="default" padding="md" style={{ marginBottom: '2rem' }}>
                <CardHeader title="Modal & Tabs Example" />
                <CardBody>
                    <Tooltip content="Click to open a modal dialog" placement="top">
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            Open Modal with Tabs
                        </Button>
                    </Tooltip>
                </CardBody>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Settings"
                size="lg"
            >
                <Tabs
                    variant="pills"
                    tabs={[
                        {
                            id: 'general',
                            label: 'General',
                            content: (
                                <div style={{ padding: '1rem' }}>
                                    <h3>General Settings</h3>
                                    <p>Configure your general preferences here.</p>
                                    <Toggle label="Dark Mode" />
                                    <Toggle label="Compact View" />
                                </div>
                            )
                        },
                        {
                            id: 'account',
                            label: 'Account',
                            content: (
                                <div style={{ padding: '1rem' }}>
                                    <h3>Account Settings</h3>
                                    <Input label="Username" fullWidth />
                                    <Input label="Email" type="email" fullWidth />
                                </div>
                            )
                        },
                        {
                            id: 'notifications',
                            label: 'Notifications',
                            content: (
                                <div style={{ padding: '1rem' }}>
                                    <h3>Notification Preferences</h3>
                                    <Checkbox label="Email notifications" />
                                    <Checkbox label="Push notifications" />
                                    <Checkbox label="SMS notifications" />
                                </div>
                            )
                        }
                    ]}
                />
            </Modal>

            {/* Menu Section */}
            <Card variant="default" padding="md">
                <CardHeader title="Menu Component" />
                <CardBody>
                    <Menu variant="bordered" orientation="vertical">
                        <MenuGroup label="Account">
                            <MenuItem
                                as="button"
                                icon={<span>👤</span>}
                                label="Profile"
                                description="View and edit your profile"
                                onClick={() => alert('Profile clicked')}
                            />
                            <MenuItem
                                as="button"
                                icon={<span>⚙️</span>}
                                label="Settings"
                                onClick={() => alert('Settings clicked')}
                            />
                        </MenuGroup>
                        
                        <MenuDivider />
                        
                        <MenuGroup label="Actions">
                            <MenuItem
                                as="button"
                                icon={<span>📤</span>}
                                label="Export Data"
                                onClick={() => alert('Export clicked')}
                            />
                            <MenuItem
                                as="button"
                                icon={<span>🗑️</span>}
                                label="Delete Account"
                                onClick={() => alert('Delete clicked')}
                                active={false}
                            />
                        </MenuGroup>
                    </Menu>
                </CardBody>
            </Card>

            <Divider spacing="lg" />

            <Alert variant="success">
                🎉 All components are working! You can now use these components throughout your application.
            </Alert>
        </div>
    );
};

export default ExampleUsage;
