import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Search, X, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { businessService, BUSINESS_CATEGORIES } from '../../features/businesses/api/businesses';
import { BusinessCard } from '../../features/businesses/components/BusinessCard';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function BusinessesPage() {
    const { businessId } = useParams();
    const { lang, t } = useAppContext();
    const [businesses, setBusinesses] = useState([]);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBusinesses = () => {
        setLoading(true);
        setError(null);
        businessService.getBusinesses({ category, search })
            .then(data => {
                if (businessId) {
                    const filtered = (data || []).filter(b => String(b.id) === String(businessId));
                    setBusinesses(filtered.length > 0 ? filtered : data);
                } else {
                    setBusinesses(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading businesses:', err);
                setError(err.message || 'Failed to load local businesses');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadBusinesses();
    }, [category, search]);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-warning">
                            <Store size={12} style={{ marginRight: '3px' }} /> Rural Commerce &amp; Artisans
                        </span>
                        <span className="badge badge-verified">CSP Ground Surveyed</span>
                    </div>
                    <h1 className="page-title">{t?.businessesTitle || 'Local Businesses & Artisans'}</h1>
                    <p className="page-subtitle">
                        {t?.businessesDesc || 'Verified local economy directory supporting village handloom weavers, dairy farmers, motor repair electricians, transport operators, and women\'s Self-Help Groups (SHGs).'}
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <form onSubmit={(e) => e.preventDefault()} className="hero-search-form" style={{ maxWidth: '680px', marginBottom: '0.75rem' }}>
                        <div className="hero-search-icon-badge" aria-hidden="true">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            className="hero-search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={lang === 'te' ? "వృత్తులు, వ్యాపారాలు, మరమ్మతులు శోధించండి..." : "Search artisans, businesses, dairy, repairs..."}
                            aria-label="Search businesses"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="hero-search-clear-btn"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <button type="submit" className="hero-search-submit-btn">
                            <Search size={14} />
                            <span>{lang === 'te' ? "శోధించండి" : "Search"}</span>
                        </button>
                    </form>

                    <div className="filter-pills-bar" role="tablist">
                        {BUSINESS_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={category === cat}
                                className={`filter-pill ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>
                    <span>Showing <strong>{businesses.length}</strong> local enterprises &amp; artisan clusters</span>
                    {(search || category !== 'All') && (
                        <button
                            type="button"
                            onClick={() => {
                                setCategory('All');
                                setSearch('');
                            }}
                            className="btn btn-ghost btn-sm"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* Content Area */}
                {loading && <LoadingState count={4} message="Loading local business directory..." />}
                {error && <ErrorState message={error} onRetry={loadBusinesses} />}
                {!loading && !error && businesses.length === 0 && (
                    <EmptyState
                        title="No enterprises found"
                        description="Try searching for another service, owner name, or selecting All categories."
                    />
                )}
                {!loading && !error && businesses.length > 0 && (
                    <div className="card-grid">
                        {businesses.map(b => (
                            <BusinessCard key={b.id} business={b} lang={lang} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusinessesPage;
