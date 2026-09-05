import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ 
    searchQuery, 
    setSearchQuery, 
    currentFilter, 
    setCurrentFilter, 
    t 
}) {
    const filterOptions = [
        { key: 'ALL', label: t.filterAll },
        { key: 'announcements', label: t.filterAnnouncements },
        { key: 'schemes', label: t.filterSchemes },
        { key: 'contacts', label: t.filterContacts },
        { key: 'institutions', label: t.filterInstitutions },
        { key: 'businesses', label: t.filterBusinesses }
    ];

    return (
        <div className="search-module" role="search">
            <div className="search-input-wrapper">
                <Search className="search-icon" size={20} aria-hidden="true" />
                <input 
                    type="search"
                    className="search-input"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search village schemes, contacts, and public facilities"
                />
                {searchQuery && (
                    <button 
                        type="button"
                        className="btn-search-clear"
                        onClick={() => setSearchQuery('')}
                    >
                        {t.clearBtn}
                    </button>
                )}
            </div>

            <div className="filter-pills-bar" role="tablist" aria-label="Category Filters">
                {filterOptions.map(f => (
                    <button
                        key={f.key}
                        type="button"
                        role="tab"
                        aria-selected={currentFilter === f.key}
                        className={`filter-pill ${currentFilter === f.key ? 'active' : ''}`}
                        onClick={() => setCurrentFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
