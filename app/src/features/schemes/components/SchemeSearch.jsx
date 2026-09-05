import React from 'react';
import { Search, X } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function SchemeSearch({ 
    query, 
    search, 
    onSearchChange, 
    onQueryChange, 
    onClear, 
    placeholder = "Search schemes by name, benefits, or eligibility..." 
}) {
    const appContext = useAppContext();
    const isTe = appContext?.lang === 'te';
    const val = query !== undefined ? query : (search || '');
    
    const handleChange = (newVal) => {
        if (onQueryChange) onQueryChange(newVal);
        if (onSearchChange) onSearchChange(newVal);
    };
    
    const handleClear = () => {
        if (onClear) onClear();
        else handleChange('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className="hero-search-form" style={{ maxWidth: '680px', marginBottom: '1.25rem' }}>
            <div className="hero-search-icon-badge" aria-hidden="true">
                <Search size={18} />
            </div>
            <input
                type="text"
                className="hero-search-input"
                value={val}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search welfare schemes"
            />
            {val && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="hero-search-clear-btn"
                    aria-label="Clear search query"
                >
                    <X size={16} />
                </button>
            )}
            <button type="submit" className="hero-search-submit-btn">
                <Search size={14} />
                <span>{isTe ? "శోధించండి" : "Search"}</span>
            </button>
        </form>
    );
}

export default SchemeSearch;
