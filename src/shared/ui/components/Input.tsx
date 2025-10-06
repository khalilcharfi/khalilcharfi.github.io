import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
        const hasError = !!error;

        return (
            <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''} ${className}`}>
                {label && (
                    <label htmlFor={inputId} className="input-label">
                        {label}
                    </label>
                )}
                <div className={`input-container ${hasError ? 'input-error' : ''}`}>
                    {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`input ${leftIcon ? 'has-left-icon' : ''} ${
                            rightIcon ? 'has-right-icon' : ''
                        }`}
                        aria-invalid={hasError}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : helperText
                                ? `${inputId}-helper`
                                : undefined
                        }
                        {...props}
                    />
                    {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
                </div>
                {error && (
                    <span id={`${inputId}-error`} className="input-error-text" role="alert">
                        {error}
                    </span>
                )}
                {helperText && !error && (
                    <span id={`${inputId}-helper`} className="input-helper-text">
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = false,
            rows = 4,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 11)}`;
        const hasError = !!error;

        return (
            <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''} ${className}`}>
                {label && (
                    <label htmlFor={textareaId} className="input-label">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`textarea ${hasError ? 'textarea-error' : ''}`}
                    rows={rows}
                    aria-invalid={hasError}
                    aria-describedby={
                        error
                            ? `${textareaId}-error`
                            : helperText
                            ? `${textareaId}-helper`
                            : undefined
                    }
                    {...(props as any)}
                />
                {error && (
                    <span id={`${textareaId}-error`} className="input-error-text" role="alert">
                        {error}
                    </span>
                )}
                {helperText && !error && (
                    <span id={`${textareaId}-helper`} className="input-helper-text">
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, className = '', id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;

        return (
            <div className={`checkbox-wrapper ${className}`}>
                <input
                    ref={ref}
                    type="checkbox"
                    id={checkboxId}
                    className="checkbox-input"
                    {...props}
                />
                {(label || description) && (
                    <div className="checkbox-label-wrapper">
                        {label && (
                            <label htmlFor={checkboxId} className="checkbox-label">
                                {label}
                            </label>
                        )}
                        {description && <p className="checkbox-description">{description}</p>}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
