import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../app/providers';
import { schemeService, SCHEME_CATEGORIES } from '../../features/schemes/api/schemes';
import { SchemeCard } from '../../features/schemes/components/SchemeCard';
import { SchemeFilters } from '../../features/schemes/components/SchemeFilters';
import { SchemeSearch } from '../../features/schemes/components/SchemeSearch';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function SchemesPage({ initialCategory = 'All' }) {
    const { lang, t } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const initialQuery = searchParams.get('q') || '';
    const startCat = initialCategory !== 'All' ? initialCategory : (searchParams.get('cat') || 'All');

    const [search, setSearch] = useState(initialQuery);
    const [category, setCategory] = useState(startCat);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialCategory && initialCategory !== 'All') {
            setCategory(initialCategory);
        }
    }, [initialCategory]);

    const loadSchemes = () => {
        setLoading(true);
        setError(null);
        schemeService.getAllSchemes({ category, search })
            .then(data => {
                setSchemes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching schemes:', err);
                setError(err.message || 'Failed to load welfare schemes');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadSchemes();
    }, [category, search]);

    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        const params = new URLSearchParams(searchParams);
        if (newCat === 'All') params.delete('cat');
        else params.set('cat', newCat);
        setSearchParams(params, { replace: true });
    };

    const handleSearchChange = (newSearch) => {
        setSearch(newSearch);
        const params = new URLSearchParams(searchParams);
        if (!newSearch) params.delete('q');
        else params.set('q', newSearch);
        setSearchParams(params, { replace: true });
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">Government Welfare Programmes</span>
                        <span className="badge badge-verified">Direct .gov.in Portals</span>
                    </div>
                    <h1 className="page-title">{t?.schemesTitle || 'Government Welfare Schemes'}</h1>
                    <p className="page-subtitle">
                        {t?.schemesDesc || 'Comprehensive directory of authentic public welfare schemes with eligibility requirements, required documents checklists, and official portal links.'}
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '2.5rem' }}>
                {/* Search & Category Filter Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <SchemeSearch query={search} onQueryChange={handleSearchChange} />
                    <SchemeFilters currentCategory={category} onSelectCategory={handleCategoryChange} />
                </div>

                {/* Count Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>
                    <span>Showing <strong>{schemes.length}</strong> welfare schemes</span>
                    {(search || category !== 'All') && (
                        <button
                            type="button"
                            onClick={() => {
                                handleCategoryChange('All');
                                handleSearchChange('');
                            }}
                            className="btn btn-ghost btn-sm"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* Content Area */}
                {loading && <LoadingState count={6} message="Loading published welfare schemes..." />}
                {error && <ErrorState message={error} onRetry={loadSchemes} />}
                {!loading && !error && schemes.length === 0 && (
                    <EmptyState
                        title="No welfare schemes match your criteria"
                        description="Try searching for another keyword or selecting a different category."
                        action={
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    handleCategoryChange('All');
                                    handleSearchChange('');
                                }}
                            >
                                View All Schemes
                            </button>
                        }
                    />
                )}

                {!loading && !error && schemes.length > 0 && (
                    <div className="card-grid">
                        {schemes.map(scheme => (
                            <SchemeCard key={scheme.id} scheme={scheme} lang={lang} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SchemesPage;
