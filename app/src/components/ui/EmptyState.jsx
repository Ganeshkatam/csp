import React from 'react';
import { Search } from 'lucide-react';

export function EmptyState({
    title = 'No records found',
    description = 'Try adjusting your search criteria or filters.',
    icon = null,
    action = null
}) {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                background: '#ffffff',
                border: '1px dashed var(--color-slate-300)',
                borderRadius: 'var(--radius-lg)',
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--color-slate-100)',
                    color: 'var(--color-slate-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icon || <Search size={22} />}
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--color-slate-800)' }}>
                {title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)', maxWidth: '420px', margin: 0 }}>
                {description}
            </p>
            {action && (
                <div style={{ marginTop: '0.5rem' }}>
                    {action}
                </div>
            )}
        </div>
    );
}

export default EmptyState;
