import React, { ReactNode } from 'react';

export interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    variant?: 'solid' | 'dashed' | 'dotted';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    label?: string | ReactNode;
    className?: string;
}

export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    variant = 'solid',
    spacing = 'md',
    label,
    className = ''
}) => {
    const classes = [
        'divider',
        `divider-${orientation}`,
        `divider-${variant}`,
        `divider-spacing-${spacing}`,
        label && 'divider-with-label',
        className
    ].filter(Boolean).join(' ');

    if (label) {
        return (
            <div className={classes} role="separator">
                <span className="divider-label">{label}</span>
            </div>
        );
    }

    return <hr className={classes} role="separator" />;
};
