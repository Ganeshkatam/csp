import React, { useState, useEffect } from 'react';
import { Landmark, MapPin, ShieldCheck, Users, Building, Droplets, Zap, BookOpen } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { villageService } from '../../features/village/api/village';
import { getLocalized } from '../../i18n';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';

export function VillagePage() {
    const { lang } = useAppContext();
    const [village, setVillage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadVillage = () => {
        setLoading(true);
        setError(null);
        villageService.getVillageProfile()
            .then(data => {
                setVillage(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading village details:', err);
                setError(err.message || 'Failed to load village profile');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadVillage();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <LoadingState count={1} message="Loading village habitation profile..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <ErrorState message={error} onRetry={loadVillage} />
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">
                            <Landmark size={12} style={{ marginRight: '3px' }} /> Administrative Habitation Profile
                        </span>
                        <span className="badge badge-verified">Census &amp; Panchayat Verified</span>
                    </div>
                    <h1 className="page-title">{village?.name ? `${village.name} Village` : 'Village Information'}</h1>
                    <p className="page-subtitle">
                        Administrative boundaries, geographical profile, civic infrastructure, and socio-economic characteristics under the Community Service Project (CSP).
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Habitation Profile Overview */}
                        <div className="civic-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem' }}>
                                About the Habitation
                            </h2>
                            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-slate-700)', marginBottom: '1.5rem' }}>
                                {getLocalized(village, 'description', lang)}
                            </p>

                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem' }}>
                                Administrative Hierarchy
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>Gram Panchayat</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>{village?.gram_panchayat || '--'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>Mandal / Taluk</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>{village?.mandal || '--'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>District</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>{village?.district || '--'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>State</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>{village?.state || 'Andhra Pradesh'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Civic Infrastructure Grid */}
                        <div className="civic-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1.25rem' }}>
                                Civic Facilities &amp; Utilities
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '12px', padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                    <Droplets size={22} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)' }}>Drinking Water</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', marginTop: '2px' }}>Panchayat RO filtration and overhead reservoir distribution.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                    <Zap size={22} style={{ color: 'var(--color-amber-600)', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)' }}>Electricity Supply</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', marginTop: '2px' }}>APCPDCL rural feeder network with lineman coverage.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                    <BookOpen size={22} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)' }}>Primary Education</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', marginTop: '2px' }}>Government Mandal Parishad School with mid-day meals.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                    <Building size={22} style={{ color: 'var(--color-indigo-600)', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-slate-900)' }}>Grama Sachivalayam</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', marginTop: '2px' }}>Village Secretariat building providing MeeSeva and citizen welfare services.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="civic-card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.85rem' }}>
                                CSP Survey Metadata
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Field Verification Source</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{village?.source || 'Gram Panchayat & Field Survey'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Verified Date</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{village?.verified_on || 'Current'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Academic Scope</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>B.Tech CSE Community Service Project</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VillagePage;
