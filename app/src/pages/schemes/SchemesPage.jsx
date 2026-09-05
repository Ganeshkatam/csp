import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../app/providers';
import { 
    schemeService, 
    SCHEME_CATEGORIES, 
    SchemeCard, 
    SchemeFilters, 
    SchemeSearch 
} from '../../features/schemes';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

const CATEGORY_SLUG_MAP = {
    'agriculture': 'Agriculture',
    'employment': 'Employment',
    'housing': 'Housing',
    'education': 'Education',
    'healthcare': 'Healthcare',
    'women-child': 'Women & Child',
    'women-and-child': 'Women & Child',
    'social-welfare': 'Social Welfare'
};

export function SchemesPage() {
    const { category: paramCategory } = useParams();
    const { lang, t } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const initialQuery = searchParams.get('q') || '';
    const mappedParamCat = paramCategory ? (CATEGORY_SLUG_MAP[paramCategory.toLowerCase()] || paramCategory) : null;
    const initialCategory = mappedParamCat || searchParams.get('cat') || 'All';

    const [search, setSearch] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mappedParamCat) {
            setCategory(mappedParamCat);
        }
    }, [mappedParamCat]);

    const loadSchemes = () => {
        setLoading(true);
        setError(null);
        schemeService.getAllSchemes({ category, search })
            .then(data => {
                setSchemes(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching schemes:', err);
                setError(err.message || 'Failed to load welfare schemes from database.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadSchemes();
    }, [category, search]);

    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        if (newCat === 'All') {
            navigate('/schemes', { replace: true });
        } else {
            const slug = newCat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
            navigate(`/schemes/category/${slug}`, { replace: true });
        }
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
                        <span className="badge badge-civic">Direct Benefit Transfers &amp; Entitlements</span>
                        <span className="badge badge-verified">State &amp; Central Portals</span>
                    </div>
                    <h1 className="page-title">{t?.schemesTitle || 'Government Welfare Schemes'}</h1>
                    <p className="page-subtitle">
                        {t?.schemesDesc || 'Comprehensive repository of verified welfare schemes for agriculture, healthcare, housing, and social security. Transparent eligibility, document checklists, and application processes.'}
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                {/* Search & Filter Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                    <SchemeSearch
                        search={search}
                        onSearchChange={handleSearchChange}
                        onClear={() => handleSearchChange('')}
                        placeholder={t?.searchSchemesPlaceholder || 'Search schemes by name, eligibility, documents, or department...'}
                    />

                    <SchemeFilters
                        categories={SCHEME_CATEGORIES}
                        activeCategory={category}
                        onSelectCategory={handleCategoryChange}
                    />
                </div>

                {/* Results State */}
                {loading && (
                    <LoadingState count={6} message="Loading welfare scheme records..." />
                )}

                {error && (
                    <ErrorState
                        message={error}
                        onRetry={loadSchemes}
                    />
                )}

                {!loading && !error && schemes.length === 0 && (
                    <EmptyState
                        title={search ? 'No matching schemes found' : 'No schemes listed in this category'}
                        description={
                            search 
                                ? `No verified welfare programs match "${search}". Try adjusting your keywords or clearing the category filter.`
                                : 'No schemes currently published in this category. Check back soon for official updates.'
                        }
                        action={
                            (search || category !== 'All') && (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setSearch('');
                                        handleCategoryChange('All');
                                    }}
                                >
                                    Reset Filters
                                </button>
                            )
                        }
                    />
                )}

                {!loading && !error && schemes.length > 0 && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                            <span>Showing <strong>{schemes.length}</strong> verified {schemes.length === 1 ? 'programme' : 'programmes'}</span>
                            {category !== 'All' && <span>Filtered by: <strong>{category}</strong></span>}
                        </div>
                        <div className="portal-grid">
                            {schemes.map(scheme => (
                                <SchemeCard
                                    key={scheme.id}
                                    scheme={scheme}
                                    lang={lang}
                                    t={t}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SchemesPage;
