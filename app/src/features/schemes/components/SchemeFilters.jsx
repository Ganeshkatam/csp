import React from 'react';
import { SCHEME_CATEGORIES } from '../api/schemes';

export function SchemeFilters({ activeCategory, currentCategory, onSelectCategory }) {
    const active = activeCategory || currentCategory || 'All';
    return (
        <div className="filter-pills-bar" role="tablist" aria-label="Filter Schemes by Department">
            {SCHEME_CATEGORIES.map(cat => (
                <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active === cat}
                    className={`filter-pill ${active === cat ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}

export default SchemeFilters;
