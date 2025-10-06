import React, { ReactNode, useState } from 'react';

export interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    content: ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
    variant?: 'default' | 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultTab,
    activeTab: controlledActiveTab,
    onTabChange,
    className = '',
    variant = 'default'
}) => {
    const [internalActiveTab, setInternalActiveTab] = useState(
        defaultTab || tabs[0]?.id || ''
    );

    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

    const handleTabClick = (tabId: string) => {
        const tab = tabs.find(t => t.id === tabId);
        if (tab?.disabled) return;

        if (controlledActiveTab === undefined) {
            setInternalActiveTab(tabId);
        }
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className={`tabs tabs-${variant} ${className}`}>
            <div className="tabs-list" role="tablist" aria-label="Content sections">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''} ${
                            tab.disabled ? 'disabled' : ''
                        }`}
                        onClick={() => handleTabClick(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        id={`${tab.id}-tab`}
                        type="button"
                        disabled={tab.disabled}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="tabs-content">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
                        role="tabpanel"
                        id={`${tab.id}-panel`}
                        aria-labelledby={`${tab.id}-tab`}
                        hidden={activeTab !== tab.id}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export interface SimpleTabsProps {
    tabs: Omit<Tab, 'content'>[];
    defaultTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
    variant?: 'default' | 'pills' | 'underline';
    children: ReactNode;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({
    tabs,
    defaultTab,
    activeTab: controlledActiveTab,
    onTabChange,
    className = '',
    variant = 'default',
    children
}) => {
    const [internalActiveTab, setInternalActiveTab] = useState(
        defaultTab || tabs[0]?.id || ''
    );

    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

    const handleTabClick = (tabId: string) => {
        const tab = tabs.find(t => t.id === tabId);
        if (tab?.disabled) return;

        if (controlledActiveTab === undefined) {
            setInternalActiveTab(tabId);
        }
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    return (
        <div className={`tabs tabs-${variant} ${className}`}>
            <div className="tabs-list" role="tablist" aria-label="Content sections">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''} ${
                            tab.disabled ? 'disabled' : ''
                        }`}
                        onClick={() => handleTabClick(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        id={`${tab.id}-tab`}
                        type="button"
                        disabled={tab.disabled}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="tabs-content">{children}</div>
        </div>
    );
};
