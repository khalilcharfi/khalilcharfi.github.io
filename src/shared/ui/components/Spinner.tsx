import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'border' | 'dots' | 'pulse';

export interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    color?: string;
    label?: string;
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    variant = 'border',
    color,
    label = 'Loading...',
    className = ''
}) => {
    const style = color ? { color } : undefined;

    if (variant === 'border') {
        return (
            <div className={`spinner spinner-border spinner-${size} ${className}`} style={style}>
                <svg className="spinner-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" />
                </svg>
                <span className="sr-only">{label}</span>
            </div>
        );
    }

    if (variant === 'dots') {
        return (
            <div className={`spinner spinner-dots spinner-${size} ${className}`} style={style}>
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="sr-only">{label}</span>
            </div>
        );
    }

    return (
        <div className={`spinner spinner-pulse spinner-${size} ${className}`} style={style}>
            <span className="spinner-pulse-ring" />
            <span className="sr-only">{label}</span>
        </div>
    );
};

export interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    transparent?: boolean;
    children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    message = 'Loading...',
    transparent = false,
    children
}) => {
    if (!isLoading) return <>{children}</>;

    return (
        <div className="loading-overlay-container">
            {children}
            <div className={`loading-overlay ${transparent ? 'loading-overlay-transparent' : ''}`}>
                <div className="loading-overlay-content">
                    <Spinner size="lg" />
                    {message && <p className="loading-overlay-message">{message}</p>}
                </div>
            </div>
        </div>
    );
};
