import React, { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

interface BaseMenuItemProps {
    icon?: ReactNode;
    label: string;
    description?: string;
    disabled?: boolean;
    active?: boolean;
    className?: string;
}

export interface MenuItemLinkProps extends BaseMenuItemProps, AnchorHTMLAttributes<HTMLAnchorElement> {
    as?: 'link';
    href: string;
}

export interface MenuItemButtonProps extends BaseMenuItemProps, ButtonHTMLAttributes<HTMLButtonElement> {
    as?: 'button';
}

export type MenuItemProps = MenuItemLinkProps | MenuItemButtonProps;

export const MenuItem: React.FC<MenuItemProps> = (props) => {
    const {
        icon,
        label,
        description,
        disabled = false,
        active = false,
        className = '',
        ...restProps
    } = props;

    const baseClasses = `menu-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`;

    const content = (
        <>
            {icon && <span className="menu-item-icon">{icon}</span>}
            <div className="menu-item-content">
                <span className="menu-item-label">{label}</span>
                {description && <span className="menu-item-description">{description}</span>}
            </div>
        </>
    );

    if (props.as === 'link' || 'href' in props) {
        const { as, ...linkProps } = props as MenuItemLinkProps;
        return (
            <a
                className={baseClasses}
                aria-current={active ? 'page' : undefined}
                aria-disabled={disabled}
                {...linkProps}
            >
                {content}
            </a>
        );
    }

    const { as, ...buttonProps } = props as MenuItemButtonProps;
    return (
        <button
            type="button"
            className={baseClasses}
            disabled={disabled}
            aria-current={active ? 'page' : undefined}
            {...buttonProps}
        >
            {content}
        </button>
    );
};

export interface MenuProps {
    children: ReactNode;
    className?: string;
    orientation?: 'vertical' | 'horizontal';
    variant?: 'default' | 'compact' | 'bordered';
}

export const Menu: React.FC<MenuProps> = ({
    children,
    className = '',
    orientation = 'vertical',
    variant = 'default'
}) => {
    return (
        <div
            className={`menu menu-${orientation} menu-${variant} ${className}`}
            role="menu"
        >
            {children}
        </div>
    );
};

export const MenuDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
    return <div className={`menu-divider ${className}`} role="separator" />;
};

export interface MenuGroupProps {
    label?: string;
    children: ReactNode;
    className?: string;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ label, children, className = '' }) => {
    return (
        <div className={`menu-group ${className}`} role="group" aria-label={label}>
            {label && <div className="menu-group-label">{label}</div>}
            <div className="menu-group-items">{children}</div>
        </div>
    );
};
