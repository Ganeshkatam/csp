import React from 'react';

export function Badge({ children, variant = 'civic', icon = null, className = '', ...props }) {
    return (
        <span className={`badge badge-${variant} ${className}`} {...props}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
}

export default Badge;
