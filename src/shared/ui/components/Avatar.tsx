import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';

export interface AvatarProps {
    src?: string;
    alt: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    fallback?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 'md',
    shape = 'circle',
    fallback,
    status,
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const classes = [
        'avatar',
        `avatar-${size}`,
        `avatar-${shape}`,
        status && 'avatar-with-status',
        className
    ].filter(Boolean).join(' ');

    const renderContent = () => {
        if (src && !imageError) {
            return (
                <img
                    src={src}
                    alt={alt}
                    className="avatar-image"
                    onError={() => setImageError(true)}
                />
            );
        }

        if (fallback) {
            return <span className="avatar-fallback">{fallback}</span>;
        }

        return <span className="avatar-fallback">{getInitials(alt)}</span>;
    };

    return (
        <div className={classes}>
            {renderContent()}
            {status && (
                <span
                    className={`avatar-status avatar-status-${status}`}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
};

export interface AvatarGroupProps {
    max?: number;
    size?: AvatarSize;
    shape?: AvatarShape;
    children: React.ReactElement<AvatarProps>[];
    className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    max = 5,
    size = 'md',
    shape = 'circle',
    children,
    className = ''
}) => {
    const visibleAvatars = children.slice(0, max);
    const remainingCount = children.length - max;

    return (
        <div className={`avatar-group avatar-group-${size} ${className}`}>
            {visibleAvatars.map((child, index) =>
                React.cloneElement(child, {
                    key: index,
                    size,
                    shape,
                    className: `${child.props.className || ''} avatar-group-item`
                })
            )}
            {remainingCount > 0 && (
                <div className={`avatar avatar-${size} avatar-${shape} avatar-group-more`}>
                    <span className="avatar-fallback">+{remainingCount}</span>
                </div>
            )}
        </div>
    );
};
