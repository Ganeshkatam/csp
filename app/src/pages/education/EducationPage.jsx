import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { educationService } from '../../features/education/api/education';
import { EducationCard } from '../../features/education/components/EducationCard';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function EducationPage() {
    const { institutionId } = useParams();
    const { lang, t } = useAppContext();
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadEducation = () => {
        setLoading(true);
        setError(null);
        educationService.getEducationInstitutions()
            .then(data => {
                if (institutionId) {
                    const filtered = (data || []).filter(inst => String(inst.id) === String(institutionId));
                    setInstitutions(filtered.length > 0 ? filtered : data);
                } else {
                    setInstitutions(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading education:', err);
                setError(err.message || 'Failed to load education institutions');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadEducation();
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">
                            <GraduationCap size={12} style={{ marginRight: '3px' }} /> Public Education
                        </span>
                        <span className="badge badge-verified">Department of School Education</span>
                    </div>
                    <h1 className="page-title">Schools &amp; Anganwadi Centers</h1>
                    <p className="page-subtitle">
                        Mandal Parishad Primary Schools (MPPS), Zilla Parishad High Schools, Anganwadi early childhood education centers, mid-day meal programmes, and Headmaster contacts.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                {/* Highlights Banner */}
                <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-indigo-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>School Timings</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>9:00 AM - 4:30 PM</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Monday to Saturday with regular attendance tracking</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-emerald-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Mid-Day Meals (Jagananna Gorumudha)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>Provided Daily</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Nutritious hot meals, boiled eggs, and chikkis for enrolled students</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-blue-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Anganwadi Nutrition</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>Ages 0 - 6 Years</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Supplementary nutrition and pre-school non-formal education</div>
                    </div>
                </div>

                {loading && <LoadingState count={3} message="Loading educational institutions..." />}
                {error && <ErrorState message={error} onRetry={loadEducation} />}
                {!loading && !error && institutions.length === 0 && (
                    <EmptyState
                        title="No school records found"
                        description="School and Anganwadi listings are being verified with the Mandal Educational Officer."
                    />
                )}
                {!loading && !error && institutions.length > 0 && (
                    <div className="card-grid">
                        {institutions.map(i => (
                            <EducationCard key={i.id} institution={i} lang={lang} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EducationPage;
