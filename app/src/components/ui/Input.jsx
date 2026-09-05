import React from 'react';

export function Input({
    label,
    id,
    error,
    helperText,
    required = false,
    className = '',
    ...props
}) {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={id} className="form-label">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                id={id}
                required={required}
                className={`form-control ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <span style={{ fontSize: '0.75rem', color: 'var(--color-red-600)' }}>{error}</span>}
            {!error && helperText && <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>{helperText}</span>}
        </div>
    );
}

export default Input;
