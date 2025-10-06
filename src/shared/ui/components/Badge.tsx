import React, { ReactNode, HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    rounded?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'md',
    rounded = false,
    icon,
    children,
    className = '',
    ...props
}) => {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        rounded && 'badge-rounded',
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {icon && <span className="badge-icon">{icon}</span>}
            <span className="badge-content">{children}</span>
        </span>
    );
};

export interface DotBadgeProps extends Omit<BadgeProps, 'children'> {
    label?: string;
    pulse?: boolean;
}

export const DotBadge: React.FC<DotBadgeProps> = ({
    variant = 'default',
    size = 'md',
    label,
    pulse = false,
    className = '',
    ...props
}) => {
    const classes = [
        'badge-dot',
        `badge-dot-${variant}`,
        `badge-dot-${size}`,
        pulse && 'badge-dot-pulse',
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={`badge-dot-wrapper ${className}`} {...props}>
            <span className={classes} />
            {label && <span className="badge-dot-label">{label}</span>}
        </span>
    );
};
