import React, { ReactNode, useState } from 'react';

export interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
}

export interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
    variant?: 'default' | 'bordered' | 'separated';
    className?: string;
    onChange?: (openIds: string[]) => void;
}

export const Accordion: React.FC<AccordionProps> = ({
    items,
    allowMultiple = false,
    defaultOpen = [],
    variant = 'default',
    className = '',
    onChange
}) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
        let newOpenItems: string[];

        if (allowMultiple) {
            newOpenItems = openItems.includes(id)
                ? openItems.filter(itemId => itemId !== id)
                : [...openItems, id];
        } else {
            newOpenItems = openItems.includes(id) ? [] : [id];
        }

        setOpenItems(newOpenItems);
        if (onChange) {
            onChange(newOpenItems);
        }
    };

    return (
        <div className={`accordion accordion-${variant} ${className}`}>
            {items.map(item => {
                const isOpen = openItems.includes(item.id);
                return (
                    <div
                        key={item.id}
                        className={`accordion-item ${isOpen ? 'open' : ''} ${
                            item.disabled ? 'disabled' : ''
                        }`}
                    >
                        <button
                            className="accordion-header"
                            onClick={() => !item.disabled && toggleItem(item.id)}
                            aria-expanded={isOpen}
                            aria-controls={`accordion-content-${item.id}`}
                            id={`accordion-header-${item.id}`}
                            disabled={item.disabled}
                            type="button"
                        >
                            {item.icon && (
                                <span className="accordion-icon">{item.icon}</span>
                            )}
                            <span className="accordion-title">{item.title}</span>
                            <svg
                                className={`accordion-chevron ${isOpen ? 'open' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <div
                            id={`accordion-content-${item.id}`}
                            className="accordion-content"
                            role="region"
                            aria-labelledby={`accordion-header-${item.id}`}
                            hidden={!isOpen}
                        >
                            <div className="accordion-body">{item.content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
