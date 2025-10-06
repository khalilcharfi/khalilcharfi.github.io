import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface DropdownOption {
    value: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    disabled = false,
    className = '',
    'aria-label': ariaLabel
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        if (onChange) {
            onChange(optionValue);
        }
        setIsOpen(false);
    };

    return (
        <div className={`dropdown-wrapper ${className}`}>
            {label && <label className="dropdown-label">{label}</label>}
            <div ref={dropdownRef} className="dropdown">
                <button
                    type="button"
                    className={`dropdown-toggle ${isOpen ? 'open' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    aria-label={ariaLabel || label}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    {selectedOption ? (
                        <span className="dropdown-selected">
                            {selectedOption.icon && (
                                <span className="dropdown-icon">{selectedOption.icon}</span>
                            )}
                            <span>{selectedOption.label}</span>
                        </span>
                    ) : (
                        <span className="dropdown-placeholder">{placeholder}</span>
                    )}
                    <svg
                        className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
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
                {isOpen && (
                    <ul className="dropdown-menu" role="listbox">
                        {options.map(option => (
                            <li key={option.value} role="option" aria-selected={value === option.value}>
                                <button
                                    type="button"
                                    className={`dropdown-option ${value === option.value ? 'active' : ''} ${
                                        option.disabled ? 'disabled' : ''
                                    }`}
                                    onClick={() => !option.disabled && handleSelect(option.value)}
                                    disabled={option.disabled}
                                >
                                    {option.icon && (
                                        <span className="dropdown-icon">{option.icon}</span>
                                    )}
                                    <span>{option.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
