import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    icon = null,
    ariaLabel,
    id,
    className = '',
    minWidth = '180px'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Normalize options into { value, label, count }
    const normalizedOptions = options.map(opt => {
        if (typeof opt === 'string') {
            return { value: opt, label: opt };
        }
        return opt;
    });

    const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value)) || {
        value,
        label: placeholder
    };

    // Close menu when clicking outside or pressing Escape
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div 
            className={`custom-select-container ${className} ${isOpen ? 'is-open' : ''}`}
            ref={containerRef}
            style={{ minWidth }}
        >
            <button
                type="button"
                id={id}
                className="custom-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={ariaLabel || selectedOption.label}
            >
                <div className="custom-select-trigger-content">
                    {icon && <span className="custom-select-icon">{icon}</span>}
                    <span className="custom-select-trigger-text">{selectedOption.label}</span>
                </div>
                <ChevronDown 
                    size={15} 
                    className={`custom-select-chevron ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true" 
                />
            </button>

            {isOpen && (
                <div className="custom-select-menu" role="listbox">
                    <div className="custom-select-options-list">
                        {normalizedOptions.map(opt => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    <span className="custom-select-option-label">{opt.label}</span>
                                    {opt.count !== undefined && (
                                        <span className="custom-select-option-count">{opt.count}</span>
                                    )}
                                    {isSelected && (
                                        <Check size={14} className="custom-select-option-check" aria-hidden="true" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
