import React from 'react';
import { CONTACT_CATEGORIES } from '../api/contacts';

export function ContactFilters({ currentCategory, onSelectCategory }) {
    return (
        <div className="filter-pills-bar" role="tablist" aria-label="Filter Contacts by Department">
            {CONTACT_CATEGORIES.map(cat => (
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

export default ContactFilters;
