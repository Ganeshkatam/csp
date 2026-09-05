import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Dialog({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '520px'
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3000,
                padding: '1rem',
                animation: 'fadeIn 0.2s ease'
            }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    width: '100%',
                    maxWidth,
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid var(--color-border)'
                    }}
                >
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-slate-400)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: 'var(--radius-xs)',
                            display: 'flex'
                        }}
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div style={{ padding: '1.5rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Dialog;
