import React from 'react';
import { CardSkeleton } from '../ui/Skeleton';

export function LoadingState({ count = 3, message = 'Loading verified village information...' }) {
    return (
        <div style={{ width: '100%' }}>
            {message && (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)', marginBottom: '1rem', fontStyle: 'italic' }}>
                    {message}
                </div>
            )}
            <div className="card-grid">
                {Array.from({ length: count }).map((_, idx) => (
                    <CardSkeleton key={idx} />
                ))}
            </div>
        </div>
    );
}

export default LoadingState;
