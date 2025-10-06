import React from 'react';

export interface ProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    striped?: boolean;
    animated?: boolean;
    showLabel?: boolean;
    label?: string;
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    striped = false,
    animated = false,
    showLabel = false,
    label,
    className = ''
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const classes = [
        'progress',
        `progress-${size}`,
        striped && 'progress-striped',
        animated && 'progress-animated',
        className
    ].filter(Boolean).join(' ');

    const barClasses = [
        'progress-bar',
        `progress-bar-${variant}`
    ].filter(Boolean).join(' ');

    return (
        <div className="progress-wrapper">
            {(showLabel || label) && (
                <div className="progress-label">
                    <span>{label || `${Math.round(percentage)}%`}</span>
                </div>
            )}
            <div
                className={classes}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                <div
                    className={barClasses}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showLabel?: boolean;
    label?: string;
    className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = 'default',
    showLabel = true,
    label,
    className = ''
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`circular-progress ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    className="circular-progress-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className={`circular-progress-bar circular-progress-${variant}`}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            {showLabel && (
                <div className="circular-progress-label">
                    {label || `${Math.round(percentage)}%`}
                </div>
            )}
        </div>
    );
};
