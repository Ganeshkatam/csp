import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ExternalLink, CheckCircle2, UserCheck, ShieldCheck, 
    FileCheck, Layers, ArrowLeft, Building, HelpCircle, 
    AlertCircle, FileText, Check 
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { schemeService } from '../../features/schemes/api/schemes';
import { getLocalized } from '../../i18n';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function SchemeDetailsPage() {
    const { schemeSlug, schemeId } = useParams();
    const identifier = schemeSlug || schemeId;

    const { lang, t } = useAppContext();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        schemeService.getSchemeBySlugOrId(identifier)
            .then(data => {
                setScheme(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching scheme details:', err);
                setError(err.message || 'Failed to load scheme details');
                setLoading(false);
            });
    }, [identifier]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <LoadingState count={1} message="Loading comprehensive scheme record..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <ErrorState message={error} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    if (!scheme) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <EmptyState
                    title="Scheme Not Found"
                    description={`No public welfare scheme found matching "${identifier}".`}
                    action={
                        <Link to="/schemes" className="btn btn-primary btn-sm">
                            <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Return to Schemes Catalogue
                        </Link>
                    }
                />
            </div>
        );
    }

    const docStr = scheme.documents_required || scheme.documents || '';
    const docs = docStr.split(',').map(d => d.trim()).filter(Boolean);
    const portalUrl = scheme.official_url ? (scheme.official_url.startsWith('http') ? scheme.official_url : `https://${scheme.official_url}`) : null;

    return (
        <div>
            {/* Breadcrumb Header */}
            <div className="page-header" style={{ padding: '1.5rem 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginBottom: '0.75rem' }}>
                        <Link to="/" style={{ color: 'inherit' }}>Home</Link>
                        <span>/</span>
                        <Link to="/schemes" style={{ color: 'inherit' }}>Welfare Schemes</Link>
                        <span>/</span>
                        <span style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{scheme.name}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                <span className="badge badge-civic">
                                    <Layers size={12} style={{ marginRight: '3px' }} /> {scheme.category}
                                </span>
                                <span className="badge badge-verified">
                                    <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified Record
                                </span>
                            </div>
                            <h1 className="page-title" style={{ fontSize: '2.1rem' }}>
                                {getLocalized(scheme, 'name', lang)}
                            </h1>
                            {scheme.name_te && lang === 'en' && (
                                <div style={{ fontSize: '1.1rem', color: 'var(--color-slate-600)', fontWeight: 500, marginTop: '2px' }}>
                                    {scheme.name_te}
                                </div>
                            )}
                        </div>

                        <Link to="/schemes" className="btn btn-secondary btn-sm">
                            <ArrowLeft size={14} style={{ marginRight: '4px' }} /> Back to All Schemes
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Main Content Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* 1. Overview */}
                        <div className="civic-card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={18} style={{ color: 'var(--color-blue-600)' }} />
                                Scheme Overview
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-slate-700)', lineHeight: '1.7', margin: 0 }}>
                                {getLocalized(scheme, 'description', lang)}
                            </p>
                        </div>

                        {/* 2. Benefits */}
                        <div className="civic-card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={18} style={{ color: 'var(--color-emerald-600)' }} />
                                Key Benefits
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-slate-700)', lineHeight: '1.7', margin: 0 }}>
                                {scheme.benefits || scheme.description || 'Provides direct financial assistance, subsidy benefits, or institutional coverage as mandated by the government department.'}
                            </p>
                        </div>

                        {/* 3. Eligibility & Exclusions */}
                        <div className="civic-card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserCheck size={18} style={{ color: 'var(--color-blue-600)' }} />
                                Eligibility Criteria &amp; Exclusions
                            </h2>
                            <div style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-blue-800)', marginBottom: '0.35rem' }}>
                                    Eligible Beneficiaries:
                                </h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-800)', lineHeight: '1.6', margin: 0 }}>
                                    {getLocalized(scheme, 'eligibility', lang)}
                                </p>
                            </div>

                            <div style={{ background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-slate-700)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertCircle size={15} style={{ color: 'var(--color-amber-600)' }} />
                                    General Disqualifications / Exclusions:
                                </h4>
                                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-slate-600)', lineHeight: '1.6', margin: 0 }}>
                                    <li>Institutional landholders or agricultural income tax payees.</li>
                                    <li>Beneficiaries holding government employment or receiving pension exceeding statutory limits.</li>
                                    <li>Households failing Aadhaar biometric e-KYC validation.</li>
                                </ul>
                            </div>
                        </div>

                        {/* 4. Required Documents Checklist */}
                        <div className="civic-card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileCheck size={18} style={{ color: 'var(--color-emerald-600)' }} />
                                Required Documents Checklist
                            </h2>
                            {docs.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                                    {docs.map((doc, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-800)' }}>
                                            <Check size={15} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                            <span>{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)' }}>
                                    Aadhaar Card, Ration Card, and active Bank Passbook linked with Aadhaar.
                                </p>
                            )}
                        </div>

                        {/* 5. How to Apply */}
                        <div className="civic-card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <HelpCircle size={18} style={{ color: 'var(--color-indigo-600)' }} />
                                How to Apply
                            </h2>
                            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--color-slate-700)', lineHeight: '1.7', margin: 0 }}>
                                <li>Visit the local <strong>Village Secretariat (Grama Sachivalayam)</strong> or authorized MeeSeva Centre.</li>
                                <li>Submit the physical application along with self-attested photocopies of the required documents listed above.</li>
                                <li>Complete biometric e-KYC verification with the designated Village Revenue Officer (VRO) or Welfare Assistant.</li>
                                <li>Track application progress through the official state welfare portal using your Aadhaar or Application Number.</li>
                            </ol>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Official Action Box */}
                        <div className="civic-card" style={{ padding: '1.5rem', background: '#ffffff', border: '1.5px solid var(--color-blue-200)' }}>
                            <span className="badge badge-civic" style={{ marginBottom: '0.75rem' }}>Official Gateway</span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-slate-950)' }}>
                                Access Government Portal
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                                Open the authoritative government website to check registration status, download official guidelines, or submit online applications.
                            </p>

                            {portalUrl ? (
                                <a
                                    href={portalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-block"
                                >
                                    <span>Open Official Portal</span>
                                    <ExternalLink size={15} />
                                </a>
                            ) : (
                                <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-100)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                    Applications accepted in-person at Grama Sachivalayam
                                </div>
                            )}
                        </div>

                        {/* Verification & Metadata Card */}
                        <div className="civic-card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.85rem' }}>
                                Authenticity &amp; Verification
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Verification Source</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{scheme.source || 'Official Government Gazette'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Last Verified Date</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{scheme.verified_on || 'Current Academic Cycle'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Department / Ministry</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{scheme.category} Welfare Department</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Academic Protocol</div>
                                    <div style={{ color: 'var(--color-emerald-700)', fontWeight: 600 }}>APSCHE CSP Field Audit</div>
                                </div>
                            </div>
                        </div>

                        {/* Local Assistance Assistance */}
                        <div className="civic-card" style={{ padding: '1.5rem', background: 'var(--color-slate-50)' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.35rem' }}>
                                Need Assistance?
                            </h4>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', lineHeight: '1.5', marginBottom: '1rem' }}>
                                Have a question regarding this scheme or found an outdated guideline?
                            </p>
                            <Link to="/feedback" className="btn btn-secondary btn-sm btn-block">
                                Report / Ask Feedback
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SchemeDetailsPage;
