import React from 'react';
import { smoothScrollTo } from '../../utils/navigation';

interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, onClick }) => (
    <li>
        <a
            href={`#${href}`}
            className={isActive ? 'active' : ''}
            onClick={(e) => {
                e.preventDefault();
                onClick();
                smoothScrollTo(href);
            }}
            aria-current={isActive ? 'page' : undefined}
        >
            {label}
        </a>
    </li>
);

