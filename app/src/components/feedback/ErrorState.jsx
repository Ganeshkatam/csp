import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function ErrorState({
    title = 'Failed to load content',
    message = 'An unexpected error occurred while communicating with the village database.',
    onRetry = null
}) {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                margin: '1.5rem 0'
            }}
        >
            <div
                style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#fee2e2',
                    color: 'var(--color-red-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <AlertTriangle size={22} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-red-800)' }}>
                {title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-red-700)', maxWidth: '440px', margin: 0 }}>
                {message}
            </p>
            {onRetry && (
                <Button
                    variant="danger"
                    size="sm"
                    onClick={onRetry}
                    style={{ marginTop: '0.5rem' }}
                >
                    <RefreshCw size={14} style={{ marginRight: '4px' }} /> Retry
                </Button>
            )}
        </div>
    );
}

export default ErrorState;
