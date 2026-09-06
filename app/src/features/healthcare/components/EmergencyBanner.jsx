import React from 'react';
import { Phone, Siren, ShieldCheck, AlertCircle } from 'lucide-react';
import { createTelLink } from '../../../utils/phone';
import { EMERGENCY_GUIDANCE_REFERENCE } from '../data/emergencyGuidanceData';

export function EmergencyBanner({ lang = 'en' }) {
    const isTe = lang === 'te';
    const helplines = EMERGENCY_GUIDANCE_REFERENCE.helplines;

    return (
        <div className="emergency-command-deck">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Siren size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--color-slate-950)' }}>
                            {isTe ? "24x7 ప్రభుత్వ అత్యవసర హెల్ప్‌లైన్లు (టోల్-ఫ్రీ)" : "24x7 Government Emergency Helplines (Toll-Free)"}
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                            {isTe ? "తక్షణ స్పందన కోసం నేరుగా సంప్రదించండి" : "Direct civic dispatch lines for acute trauma, ambulance, and medical advisories"}
                        </span>
                    </div>
                </div>
                <span className="badge-level-b" style={{ background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                    <ShieldCheck size={12} style={{ color: 'var(--color-emerald-600)' }} />
                    {isTe ? "ప్రభుత్వ ధృవీకరించిన నంబర్లు" : "Government Verified Channels"}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem', marginBottom: '1.25rem' }}>
                {helplines.map(h => {
                    const is108 = h.number === '108';
                    const is104 = h.number === '104';
                    const accentColor = is108 ? 'var(--color-red-600)' : is104 ? 'var(--color-blue-600)' : 'var(--color-amber-600)';
                    const hoverBorder = is108 ? 'var(--color-red-300)' : is104 ? 'var(--color-blue-300)' : 'var(--color-amber-300)';
                    const badgeBg = is108 ? 'var(--color-red-50)' : is104 ? 'var(--color-blue-50)' : 'var(--color-amber-50)';
                    const badgeColor = is108 ? 'var(--color-red-700)' : is104 ? 'var(--color-blue-700)' : 'var(--color-amber-800)';

                    return (
                        <a
                            key={h.number}
                            href={createTelLink(h.number)}
                            className="emergency-action-card"
                            style={{
                                '--card-accent': accentColor,
                                '--card-hover-border': hoverBorder
                            }}
                            title={`Call ${h.number}`}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: accentColor, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                        <Phone size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: badgeBg, color: badgeColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                        {is108 ? (isTe ? "అత్యవసర అంబులెన్స్" : "Ambulance Dispatch") : is104 ? (isTe ? "వైద్య సలహాలు" : "Health Advisory") : (isTe ? "పాముకాటు / రేబిస్" : "Snakebite & Rabies")}
                                    </span>
                                </div>

                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-slate-950)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                                    {h.number}
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.25rem' }}>
                                    {isTe ? h.label_te : h.label_en}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)', lineHeight: '1.4', marginBottom: '1rem' }}>
                                    {isTe ? h.scope_te : h.scope_en}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-100)', marginTop: 'auto' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: accentColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <Phone size={13} />
                                    {isTe ? "కాల్ చేయడానికి నొక్కండి" : "Tap to Call Instantly"}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-slate-400)' }}>
                                    Toll-Free 24x7
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.15rem', fontSize: '0.8rem', color: 'var(--color-slate-800)', display: 'flex', alignItems: 'flex-start', gap: '10px', boxShadow: 'var(--shadow-sm)' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-amber-600)' }} />
                <div>
                    <strong style={{ color: 'var(--color-slate-950)' }}>
                        {isTe ? "108 అంబులెన్స్ పిలిచేటప్పుడు చెప్పవలసిన 3 ముఖ్యమైన వివరాలు: " : "When Calling 108 Emergency Ambulance (3 Critical Steps): "}
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-700)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                            <span style={{ fontSize: '0.75rem' }}>{isTe ? "రోగి స్పృహ, శ్వాస & తీవ్రత" : "Patient vitals & consciousness"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-700)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                            <span style={{ fontSize: '0.75rem' }}>{isTe ? "గ్రామ ల్యాండ్‌మార్క్ (ఉదా. సచివాలయం)" : "Exact village landmark (Secretariat)"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-700)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</span>
                            <span style={{ fontSize: '0.75rem' }}>{isTe ? "మీ ఫోన్ లైన్ తెరిచి ఉంచండి" : "Keep phone line open for driver"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmergencyBanner;
