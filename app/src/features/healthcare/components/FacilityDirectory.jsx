import React from 'react';
import { Activity, ShieldCheck, Clock, MapPin, Phone } from 'lucide-react';
import { HealthcareCard } from './HealthcareCard';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export function FacilityDirectory({ facilities, loading, error, onRetry, lang, t }) {
    const isTe = lang === 'te';

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} style={{ color: 'var(--color-emerald-600)' }} />
                        {isTe ? "ప్రాథమిక ఆరోగ్య కేంద్రం & సిబ్బంది వివరాలు" : "Primary Health Center (PHC) & Facilities"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "మోదవలస పరిధిలోని డెంకాడ పిహెచ్‌సి ప్రత్యక్ష రికార్డులు మరియు సేవల సమాచారం."
                            : "Local facility records, contact directory, and physical address for Denkada PHC serving Modavalasa."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-level-a">
                        <ShieldCheck size={11} />
                        Level A: Local Verified Record
                    </span>
                    <span className="badge-level-c">
                        <Clock size={11} />
                        Level C: Operational Schedule
                    </span>
                </div>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span><strong>Source:</strong> DMHO Vizianagaram / District Health Records &amp; Field Survey</span>
                    <span><strong>Source verification date:</strong> August 2024</span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>Note:</strong> Published operating status indicates facility hours (9:00 AM - 4:00 PM). It does not confirm real-time doctor attendance or immediate medicine availability.
                </div>
            </div>

            {loading && <LoadingState count={1} message={isTe ? "వైద్యశాల వివరాలు లోడ్ అవుతున్నాయి..." : "Loading healthcare facilities..."} />}
            {error && <ErrorState message={error} onRetry={onRetry} />}
            {!loading && !error && (!facilities || facilities.length === 0) && (
                <EmptyState
                    title={isTe ? "ఆరోగ్య కేంద్రం రికార్డులు నమోదు కాలేదు" : "No healthcare facility records currently listed"}
                    description={isTe ? "జిల్లా వైద్యాధికారి రికార్డుల నుండి ధృవీకరించబడుతోంది." : "Healthcare facility details are being verified with the District Medical Officer."}
                />
            )}
            {!loading && !error && facilities && facilities.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {facilities.map(f => (
                        <HealthcareCard key={f.id} facility={f} lang={lang} t={t} variant="showcase" />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FacilityDirectory;
