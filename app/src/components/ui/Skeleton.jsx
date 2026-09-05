import React from 'react';

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) {
    return (
        <div
            className={`skeleton-pulse ${className}`}
            style={{
                width,
                height,
                borderRadius,
                backgroundColor: 'var(--color-slate-200)',
                animation: 'pulse 1.5s ease-in-out infinite'
            }}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="civic-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width="90px" height="24px" borderRadius="999px" />
                <Skeleton width="70px" height="24px" borderRadius="999px" />
            </div>
            <Skeleton width="65%" height="24px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="90%" height="16px" />
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-slate-100)', display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width="80px" height="14px" />
                <Skeleton width="100px" height="14px" />
            </div>
        </div>
    );
}

export default Skeleton;
