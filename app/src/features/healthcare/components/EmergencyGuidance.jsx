import React from 'react';
import { AlertTriangle, ShieldCheck, Check, X, Phone, AlertCircle, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { createTelLink } from '../../../utils/phone';
import { EMERGENCY_GUIDANCE_REFERENCE } from '../data/emergencyGuidanceData';

export function EmergencyGuidance({ lang = 'en' }) {
    const isTe = lang === 'te';
    const ref = EMERGENCY_GUIDANCE_REFERENCE;

    const stepColors = [
        { border: 'var(--color-blue-200)', bg: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', numBg: 'var(--color-blue-600)' },
        { border: 'var(--color-emerald-200)', bg: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', numBg: 'var(--color-emerald-600)' },
        { border: 'var(--color-amber-200)', bg: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', numBg: 'var(--color-amber-600)' },
        { border: 'var(--color-indigo-200)', bg: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)', numBg: 'var(--color-indigo-600)' }
    ];

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={20} style={{ color: 'var(--color-amber-600)' }} />
                        {isTe ? "అత్యవసర ప్రథమ చికిత్స మార్గదర్శకాలు" : "Emergency First-Aid Protocols"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "పాముకాటు మరియు కుక్క కాటు (రేబిస్) ప్రమాదాలలో ఆసుపత్రికి వెళ్లే లోపు పాటించవలసిన ప్రాథమిక నియమాలు."
                            : "Evidence-based first-aid procedures for snakebite emergencies and animal bite rabies exposures based on NCDC standards."
                        }
                    </p>
                </div>
                <span className="badge-level-b">
                    <ShieldCheck size={11} />
                    Level B: NCDC/NRCP Standards
                </span>
            </div>

            {/* Provenance Box & First-Aid Disclaimer */}
            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span><strong>Government reference:</strong> {ref.source}</span>
                    <span><strong>Reference reviewed:</strong> {ref.reviewedOn}</span>
                </div>
                <div style={{ color: 'var(--color-slate-700)', display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '0.35rem' }}>
                    <AlertCircle size={14} style={{ color: 'var(--color-amber-600)', flexShrink: 0, marginTop: '2px' }} />
                    <span>
                        {isTe
                            ? "ఈ మార్గదర్శకాలు ప్రజల అవగాహన మరియు తక్షణ ప్రథమ చికిత్స కొరకు మాత్రమే. ఇది వైద్యుని అత్యవసర పరీక్ష మరియు చికిత్సకు ప్రత్యామ్నాయం కాదు. ఎట్టి పరిస్థితుల్లోనూ ఆసుపత్రికి వెళ్లడం ఆలస్యం చేయవద్దు."
                            : "Notice: This section provides general first-aid guidance based on official national public health guidelines. It is not a substitute for immediate professional emergency medical evaluation, ambulance transport, and clinical care."
                        }
                    </span>
                </div>
            </div>

            {/* Protocol 1: Snakebite Emergency Protocol */}
            <div className="civic-card" style={{ padding: '1.75rem', marginBottom: '1.75rem', borderTop: '4px solid var(--color-red-600)', boxShadow: '0 4px 16px -2px rgba(225, 29, 72, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-red-50)', color: 'var(--color-red-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: 0 }}>
                            {isTe ? ref.snakebite.title_te : ref.snakebite.title_en}
                        </h3>
                    </div>
                    <a
                        href={createTelLink('108')}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-red-600)', borderColor: 'var(--color-red-600)' }}
                    >
                        <Phone size={13} />
                        {isTe ? "108 అంబులెన్స్ పిలవండి" : "Call 108 Emergency"}
                    </a>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem' }}>
                    {isTe ? ref.snakebite.sub_te : ref.snakebite.sub_en}
                </p>

                <div className="first-aid-grid">
                    {/* Do's */}
                    <div className="first-aid-do-card" style={{ boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-emerald-950)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-emerald-200)' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-emerald-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Check size={14} />
                            </div>
                            {isTe ? "చేయవలసినవి (DOs)" : "Recommended First-Aid (DOs)"}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-emerald-950)' }}>
                            {ref.snakebite.dos.map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--color-emerald-600)', fontWeight: 900, marginTop: '1px' }}>✓</span>
                                    <span style={{ lineHeight: '1.45' }}>{isTe ? item.te : item.en}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Don'ts */}
                    <div className="first-aid-dont-card" style={{ boxShadow: '0 2px 8px rgba(225, 29, 72, 0.06)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-red-950)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-red-200)' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-red-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={14} />
                            </div>
                            {isTe ? "చేయకూడనివి (DON'Ts)" : "Harmful Practices (DON'Ts)"}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-red-950)' }}>
                            {ref.snakebite.donts.map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--color-red-600)', fontWeight: 900, marginTop: '1px' }}>✕</span>
                                    <span style={{ lineHeight: '1.45' }}>{isTe ? item.te : item.en}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={{ background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.15rem', fontSize: '0.78rem', color: 'var(--color-slate-700)', marginTop: '1.25rem' }}>
                    <strong>{isTe ? "వైద్య చికిత్స స్పష్టీకరణ: " : "Clinical Protocol Scope: "}</strong>
                    {isTe ? ref.snakebite.clinicalNote_te : ref.snakebite.clinicalNote_en}
                </div>
            </div>

            {/* Protocol 2: Animal Bite & Rabies Exposure */}
            <div className="civic-card" style={{ padding: '1.75rem', borderTop: '4px solid var(--color-blue-600)', boxShadow: '0 4px 16px -2px rgba(37, 99, 235, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-blue-50)', color: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: 0 }}>
                            {isTe ? ref.rabies.title_te : ref.rabies.title_en}
                        </h3>
                    </div>
                    <a
                        href={createTelLink('15400')}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Phone size={13} />
                        {isTe ? "15400 రేబిస్ హెల్ప్‌లైన్" : "Call 15400 Rabies Helpline"}
                    </a>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem' }}>
                    {isTe ? ref.rabies.sub_te : ref.rabies.sub_en}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.15rem', marginBottom: '1.25rem' }}>
                    {ref.rabies.steps.map((s, sIdx) => {
                        const styleConfig = stepColors[sIdx % stepColors.length];
                        return (
                            <div 
                                key={s.step} 
                                style={{ 
                                    background: styleConfig.bg, 
                                    border: `1.5px solid ${styleConfig.border}`, 
                                    borderRadius: 'var(--radius-lg)', 
                                    padding: '1.15rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.65rem' }}>
                                        <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: styleConfig.numBg, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                                            {s.step}
                                        </span>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: 0 }}>
                                            {isTe ? s.title_te : s.title_en}
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-700)', margin: 0, lineHeight: '1.5', fontWeight: 500 }}>
                                        {isTe ? s.desc_te : s.desc_en}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.15rem', fontSize: '0.8rem', color: '#78350f', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
                    <div>
                        <strong>{isTe ? "రేబిస్ వ్యాధి తీవ్రత: " : "Critical Rabies Awareness: "}</strong>
                        {isTe ? ref.rabies.clinicalNote_te : ref.rabies.clinicalNote_en}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmergencyGuidance;
