import React from 'react';

export function Card({ children, className = '', ...props }) {
    return (
        <div className={`civic-card ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`card-header-row ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '', ...props }) {
    return (
        <h3 className={`card-item-title ${className}`} {...props}>
            {children}
        </h3>
    );
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`card-verify-tag ${className}`} {...props}>
            {children}
        </div>
    );
}

export default Card;
