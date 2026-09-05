import React from 'react';
import { SCHEME_CATEGORIES } from '../api/schemes';

export function SchemeFilters({ currentCategory, onSelectCategory }) {
    return (
        <div className="filter-pills-bar" role="tablist" aria-label="Filter Schemes by Department">
            {SCHEME_CATEGORIES.map(cat => (
                <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={currentCategory === cat}
                    className={`filter-pill ${currentCategory === cat ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}

export default SchemeFilters;
