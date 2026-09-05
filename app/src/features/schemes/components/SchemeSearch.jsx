import React from 'react';
import { Search, X } from 'lucide-react';

export function SchemeSearch({ 
    query, 
    search, 
    onQueryChange, 
    onSearchChange, 
    onClear, 
    placeholder = "Search schemes by name, benefits, or eligibility..." 
}) {
    const val = query !== undefined ? query : (search || '');
    const handleChange = (newVal) => {
        if (onQueryChange) onQueryChange(newVal);
        if (onSearchChange) onSearchChange(newVal);
    };
    const handleClear = () => {
        if (onClear) onClear();
        else handleChange('');
    };

    return (
        <div className="search-bar-box" style={{ maxWidth: '640px', marginBottom: '1.25rem' }}>
            <Search size={18} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
            <input
                type="text"
                className="search-input"
                value={val}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search welfare schemes"
            />
            {val && (
                <button
                    type="button"
                    onClick={handleClear}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-slate-400)', cursor: 'pointer', display: 'flex' }}
                    aria-label="Clear search"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

export default SchemeSearch;
