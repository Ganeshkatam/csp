import React from 'react';
import { Phone, Siren, ShieldCheck, AlertCircle } from 'lucide-react';
import { createTelLink } from '../../../utils/phone';
import { EMERGENCY_GUIDANCE_REFERENCE } from '../data/emergencyGuidanceData';

export function EmergencyBanner({ lang = 'en' }) {
    const isTe = lang === 'te';
    const helplines = EMERGENCY_GUIDANCE_REFERENCE.helplines;

    return (
        <div style={{ background: '#ffffff', border: '1.5px solid var(--color-red-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Siren size={20} style={{ color: 'var(--color-red-600)' }} />
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-slate-900)' }}>
                        {isTe ? "24x7 ప్రభుత్వ అత్యవసర హెల్ప్‌లైన్లు (టోల్-ఫ్రీ)" : "24x7 Government Emergency Helplines (Toll-Free)"}
                    </h2>
                </div>
                <span className="badge-level-b">
                    <ShieldCheck size={11} />
                    {isTe ? "ప్రభుత్వ ధృవీకరించిన నంబర్లు" : "Government Verified Channels"}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                {helplines.map(h => (
                    <a
                        key={h.number}
                        href={createTelLink(h.number)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.9rem 1.15rem',
                            background: 'var(--color-slate-50)',
                            border: '1px solid var(--color-slate-200)',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease'
                        }}
                        title={`Call ${h.number}`}
                    >
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: h.number === '108' ? 'var(--color-red-600)' : h.number === '104' ? 'var(--color-blue-600)' : 'var(--color-amber-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                            <Phone size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-950)', lineHeight: 1.1 }}>
                                {h.number}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-slate-800)' }}>
                                {isTe ? h.label_te : h.label_en}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', marginTop: '2px' }}>
                                {isTe ? h.scope_te : h.scope_en}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <div style={{ background: 'var(--color-red-50)', border: '1px solid var(--color-red-100)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.78rem', color: 'var(--color-red-900)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-red-600)' }} />
                <div>
                    <strong>{isTe ? "108 అంబులెన్స్ పిలిచేటప్పుడు చెప్పవలసిన వివరాలు: " : "When Calling 108 Emergency Ambulance: "}</strong>
                    {isTe
                        ? "రోగి ప్రస్తుత పరిస్థితి (స్పృహ, శ్వాస, రక్తస్రావం), గ్రామ ప్రధాన ల్యాండ్‌మార్క్ (ఉదా. మోదవలస సచివాలయం వద్ద), మరియు మీ ఫోన్ నంబర్ స్పష్టంగా తెలియజేయండి."
                        : "State the patient's condition (consciousness, breathing status, severe bleeding), exact village location landmark (e.g. Near Modavalasa Secretariat), and keep your phone line open for the dispatcher."
                    }
                </div>
            </div>
        </div>
    );
}

export default EmergencyBanner;
