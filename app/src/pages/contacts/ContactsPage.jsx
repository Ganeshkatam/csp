import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Siren, Search, X } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { contactService } from '../../features/contacts/api/contacts';
import { ContactCard } from '../../features/contacts/components/ContactCard';
import { ContactFilters } from '../../features/contacts/components/ContactFilters';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { createTelLink } from '../../utils/phone';

export function ContactsPage() {
    const { category: paramCategory } = useParams();
    const { lang, t } = useAppContext();
    const [contacts, setContacts] = useState([]);
    const [category, setCategory] = useState(() => {
        if (!paramCategory) return 'All';
        const catMap = {
            'emergency': 'Emergency',
            'administration': 'Administration',
            'panchayat': 'Administration',
            'healthcare': 'Healthcare',
            'health': 'Healthcare',
            'police': 'Police',
            'utilities': 'Utilities',
            'electricity': 'Utilities',
            'other': 'Other Services',
            'services': 'Other Services'
        };
        return catMap[paramCategory.toLowerCase()] || 'All';
    });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (paramCategory) {
            const catMap = {
                'emergency': 'Emergency',
                'administration': 'Administration',
                'panchayat': 'Administration',
                'healthcare': 'Healthcare',
                'health': 'Healthcare',
                'police': 'Police',
                'utilities': 'Utilities',
                'electricity': 'Utilities',
                'other': 'Other Services',
                'services': 'Other Services'
            };
            const mapped = catMap[paramCategory.toLowerCase()];
            if (mapped) setCategory(mapped);
        }
    }, [paramCategory]);

    const loadContacts = () => {
        setLoading(true);
        setError(null);
        contactService.getContacts({ category, search })
            .then(data => {
                setContacts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading contacts:', err);
                setError(err.message || 'Failed to load contacts');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadContacts();
    }, [category, search]);

    const emergencyHelplines = [
        { code: '108', title: 'Ambulance Emergency', dept: 'Health Dept', color: 'var(--color-red-600)' },
        { code: '100', title: 'Police Emergency', dept: 'AP Police', color: 'var(--color-blue-600)' },
        { code: '104', title: 'Medical Helpline', dept: 'Govt Health Info', color: 'var(--color-emerald-600)' },
        { code: '1912', title: 'Electricity Helpline', dept: 'APCPDCL Lines', color: 'var(--color-amber-600)' }
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-alert">Emergency &amp; Administration</span>
                        <span className="badge badge-verified">Direct Dial Enabled</span>
                    </div>
                    <h1 className="page-title">{t?.contactsTitle || 'Important Contacts Directory'}</h1>
                    <p className="page-subtitle">
                        {t?.contactsDesc || 'Authoritative telephone directory for village administration, emergency responders, and civic services. Verified against official government records.'}
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                {/* 24x7 Emergency Helplines Banner */}
                <div style={{ background: '#ffffff', border: '1.5px solid var(--color-red-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <Siren size={20} style={{ color: 'var(--color-red-600)' }} />
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-slate-900)' }}>
                            24x7 National &amp; State Emergency Helplines (Toll-Free)
                        </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {emergencyHelplines.map(item => (
                            <a
                                key={item.code}
                                href={createTelLink(item.code)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '0.85rem 1rem',
                                    background: 'var(--color-slate-50)',
                                    border: '1px solid var(--color-slate-200)',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: item.color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-slate-950)', lineHeight: 1.1 }}>
                                        {item.code}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
                                        {item.title}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-400)' }}>
                                        {item.dept}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div className="search-bar-box" style={{ maxWidth: '640px' }}>
                        <Search size={18} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                        <input
                            type="text"
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search contacts by name, designation, phone, or department..."
                            aria-label="Search contacts"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                style={{ background: 'transparent', border: 'none', color: 'var(--color-slate-400)', cursor: 'pointer', display: 'flex' }}
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <ContactFilters currentCategory={category} onSelectCategory={setCategory} />
                </div>

                {/* Count Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>
                    <span>Showing <strong>{contacts.length}</strong> official contacts</span>
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
                {loading && <LoadingState count={6} message="Loading official directory..." />}
                {error && <ErrorState message={error} onRetry={loadContacts} />}
                {!loading && !error && contacts.length === 0 && (
                    <EmptyState
                        title="No contacts found"
                        description="Try searching for another official title, name, or selecting All categories."
                    />
                )}
                {!loading && !error && contacts.length > 0 && (
                    <div className="card-grid">
                        {contacts.map(c => (
                            <ContactCard key={c.id} contact={c} lang={lang} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContactsPage;
