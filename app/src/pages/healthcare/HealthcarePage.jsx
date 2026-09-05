import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, HeartPulse, Clock, ShieldCheck, Phone, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { healthcareService } from '../../features/healthcare/api/healthcare';
import { HealthcareCard } from '../../features/healthcare/components/HealthcareCard';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function HealthcarePage() {
    const { institutionId } = useParams();
    const { lang, t } = useAppContext();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadHealthcare = () => {
        setLoading(true);
        setError(null);
        healthcareService.getHealthcareFacilities()
            .then(data => {
                if (institutionId) {
                    const filtered = (data || []).filter(f => String(f.id) === String(institutionId));
                    setFacilities(filtered.length > 0 ? filtered : data);
                } else {
                    setFacilities(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading healthcare:', err);
                setError(err.message || 'Failed to load healthcare facilities');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadHealthcare();
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-verified">
                            <Activity size={12} style={{ marginRight: '3px' }} /> Public Health Services
                        </span>
                        <span className="badge badge-civic">AP Health Department</span>
                    </div>
                    <h1 className="page-title">Healthcare &amp; Primary Health Center</h1>
                    <p className="page-subtitle">
                        Primary Healthcare Center (PHC) schedules, medical officer consultations, maternal &amp; child immunization drives, and emergency medical helplines.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                {/* Healthcare Guidelines Banner */}
                <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-emerald-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>General OPD Hours</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>9:00 AM - 4:00 PM</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Monday to Saturday (Excluding Public Holidays)</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-blue-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Immunization Day</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>Every Wednesday</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Free child vaccinations and maternal hemoglobin checkups</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-red-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Medical Emergency</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-red-600)' }}>Dial 108 or 104</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Toll-free 24x7 government ambulance network</div>
                    </div>
                </div>

                {loading && <LoadingState count={2} message="Loading healthcare facilities..." />}
                {error && <ErrorState message={error} onRetry={loadHealthcare} />}
                {!loading && !error && facilities.length === 0 && (
                    <EmptyState
                        title="No PHC records currently listed"
                        description="Healthcare information is being verified with the District Medical Officer."
                    />
                )}
                {!loading && !error && facilities.length > 0 && (
                    <div className="card-grid">
                        {facilities.map(f => (
                            <HealthcareCard key={f.id} facility={f} lang={lang} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HealthcarePage;
