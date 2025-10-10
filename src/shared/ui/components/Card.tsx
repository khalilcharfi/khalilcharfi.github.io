import React, { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    clickable?: boolean;
    children: ReactNode;
}

export const Card: React.FC = React.memo(({<CardProps> = ({
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    children,
    className = '',
    ...props
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hoverable && 'card-hoverable',
        clickable && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export const CardHeader: React.FC = React.memo(({<CardHeaderProps> = ({
    title,
    subtitle,
    action,
    className = ''
}) => {
    return (
        <div className={`card-header ${className}`}>
            <div className="card-header-text">
                <h3 className="card-title">{title}</h3>
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
            {action && <div className="card-header-action">{action}</div>}
        </div>
    );
};

export interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

export const CardBody: React.FC = React.memo(({<CardBodyProps> = ({ children, className = '' }) => {
    return <div className={`card-body ${className}`}>{children}</div>;
};

export interface CardFooterProps {
    children: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'space-between';
}

export const CardFooter: React.FC = React.memo(({<CardFooterProps> = ({
    children,
    className = '',
    align = 'right'
}) => {
    return <div className={`card-footer card-footer-${align} ${className}`}>{children}</div>;
};
