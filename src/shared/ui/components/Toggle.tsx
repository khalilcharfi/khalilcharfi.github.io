import React, { InputHTMLAttributes } from 'react';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
    disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
    label,
    description,
    disabled = false,
    className = '',
    id,
    ...props
}) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`toggle-wrapper ${disabled ? 'toggle-disabled' : ''} ${className}`}>
            {(label || description) && (
                <div className="toggle-label-wrapper">
                    {label && (
                        <label htmlFor={toggleId} className="toggle-label">
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="toggle-description">{description}</p>
                    )}
                </div>
            )}
            <div className={`toggle ${disabled ? 'disabled' : ''}`}>
                <input
                    type="checkbox"
                    id={toggleId}
                    className="toggle-input"
                    disabled={disabled}
                    {...props}
                />
                <span className="toggle-slider"></span>
            </div>
        </div>
    );
};

export const ToggleSwitch: React.FC<Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>> = ({
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`toggle ${disabled ? 'disabled' : ''} ${className}`}>
            <input
                type="checkbox"
                className="toggle-input"
                disabled={disabled}
                {...props}
            />
            <span className="toggle-slider"></span>
        </div>
    );
};
