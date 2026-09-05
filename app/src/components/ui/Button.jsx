import React from 'react';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    ...props
}) {
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const variantClass = `btn-${variant}`;

    return (
        <button
            type={type}
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className="btn-spinner" aria-hidden="true">
                    ...
                </span>
            )}
            {children}
        </button>
    );
}

export default Button;
