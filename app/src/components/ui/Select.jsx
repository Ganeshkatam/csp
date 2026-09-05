import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    required = false,
    className = ''
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formattedOptions = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    if (value && !formattedOptions.some(opt => opt.value === value)) {
        formattedOptions.unshift({ value, label: value });
    }

    const currentOption = formattedOptions.find(opt => opt.value === value);
    const displayLabel = currentOption ? currentOption.label : (value || placeholder);

    return (
        <div className={`form-group ${className}`} ref={dropdownRef} style={{ position: 'relative' }}>
            {label && (
                <label className="form-label">
                    {label} {required && <span>*</span>}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="form-control"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayLabel}
                </span>
                <ChevronDown
                    size={16}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.15s ease',
                        flexShrink: 0
                    }}
                />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 1100,
                        background: '#ffffff',
                        border: '1px solid var(--color-slate-200)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-xl)',
                        padding: '4px',
                        maxHeight: '220px',
                        overflowY: 'auto'
                    }}
                >
                    {formattedOptions.map(opt => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    background: isSelected ? 'var(--color-blue-50)' : 'transparent',
                                    color: isSelected ? 'var(--color-blue-700)' : 'var(--color-slate-800)',
                                    fontWeight: isSelected ? 600 : 400
                                }}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} style={{ color: 'var(--color-blue-600)' }} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Select;
