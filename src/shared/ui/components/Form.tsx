import React, { FormHTMLAttributes, ReactNode } from 'react';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit, className = '', ...props }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (onSubmit) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <form className={`form ${className}`} onSubmit={handleSubmit} {...props}>
            {children}
        </form>
    );
};

export interface FormGroupProps {
    children: ReactNode;
    className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
    return <div className={`form-group ${className}`}>{children}</div>;
};

export interface FormRowProps {
    children: ReactNode;
    className?: string;
    columns?: number;
    gap?: 'sm' | 'md' | 'lg';
}

export const FormRow: React.FC<FormRowProps> = ({
    children,
    className = '',
    columns,
    gap = 'md'
}) => {
    const style = columns
        ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }
        : undefined;

    return (
        <div className={`form-row form-row-gap-${gap} ${className}`} style={style}>
            {children}
        </div>
    );
};

export interface FormSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    description,
    children,
    className = ''
}) => {
    return (
        <div className={`form-section ${className}`}>
            {(title || description) && (
                <div className="form-section-header">
                    {title && <h3 className="form-section-title">{title}</h3>}
                    {description && <p className="form-section-description">{description}</p>}
                </div>
            )}
            <div className="form-section-content">{children}</div>
        </div>
    );
};

export interface FormActionsProps {
    children: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'space-between';
}

export const FormActions: React.FC<FormActionsProps> = ({
    children,
    className = '',
    align = 'right'
}) => {
    return <div className={`form-actions form-actions-${align} ${className}`}>{children}</div>;
};
