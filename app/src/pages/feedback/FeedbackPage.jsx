import React from 'react';
import { MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { FeedbackForm } from '../../features/feedback/components/FeedbackForm';

export function FeedbackPage() {
    const { t } = useAppContext();

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">
                            <MessageSquare size={12} style={{ marginRight: '3px' }} /> Citizen Redressal &amp; Feedback
                        </span>
                        <span className="badge badge-verified">Direct Administrative Review</span>
                    </div>
                    <h1 className="page-title">{t?.feedbackTitle || 'Citizen Feedback & Correction Desk'}</h1>
                    <p className="page-subtitle">
                        Help ensure village records stay accurate. Request telephone corrections, report modified hospital OPD hours, or suggest local business and artisan listings.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    <div>
                        <FeedbackForm t={t} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="civic-card" style={{ padding: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={18} style={{ color: 'var(--color-emerald-600)' }} />
                                Resolution Process
                            </h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: 'var(--color-slate-700)' }}>
                                <li style={{ display: 'flex', gap: '10px' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--color-blue-600)', flexShrink: 0, marginTop: '2px' }} />
                                    <span><strong>1. Field Logging:</strong> Submissions are logged immediately in the secure database. If offline, submissions are saved locally and synced automatically.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '10px' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--color-blue-600)', flexShrink: 0, marginTop: '2px' }} />
                                    <span><strong>2. Verification:</strong> The administrative team verifies requested updates against Gram Panchayat records or direct phone consultation.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '10px' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--color-blue-600)', flexShrink: 0, marginTop: '2px' }} />
                                    <span><strong>3. Public Update:</strong> Verified corrections are published live on the portal to benefit all village residents.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;
