import React from 'react';
import { PhoneCall, ShieldCheck, Phone, MapPin, Clock, UserCheck } from 'lucide-react';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

export function HealthcareContacts({ contacts = [], lang = 'en' }) {
    const isTe = lang === 'te';

    if (!contacts || contacts.length === 0) return null;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PhoneCall size={20} style={{ color: 'var(--color-emerald-600)' }} />
                        {isTe ? "స్థానిక ఆరోగ్య డెస్క్‌లు & సేవా విభాగం" : "Local Healthcare Desks & Outreach Staff"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "మోదవలస గ్రామ పరిధిలోని డెంకాడ పిహెచ్‌సి వైద్యాధికారి మరియు ఆశా/ఏఎన్ఎం మాతా-శిశు సంరక్షణ అధికారిక ఫోన్ నంబర్లు."
                            : "Verified administrative medical desk and maternal-child community outreach desks for Modavalasa / Denkada."
                        }
                    </p>
                </div>
                <span className="badge-level-a">
                    <ShieldCheck size={11} />
                    Level A: Official Public Directory
                </span>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span><strong>Source:</strong> District Medical &amp; Health Office (DMHO) Vizianagaram</span>
                    <span><strong>Verified:</strong> 2026-08-30</span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>Note:</strong> {isTe 
                        ? "వైద్య కార్యాలయ పనివేళల్లో (ఉదయం 9:00 - సాయంత్రం 4:00) డెస్క్ ఫోన్ లైన్లు అందుబాటులో ఉంటాయి. అత్యవసర పరిస్థితుల్లో 108 లేదా 104 కాల్ చేయండి."
                        : "Desk phone lines operate during official OPD facility hours. For acute medical trauma, dial 108 or 104 immediately."
                    }
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {contacts.map(c => (
                    <div 
                        key={c.id} 
                        style={{ 
                            background: '#ffffff', 
                            border: '1px solid var(--color-slate-200)', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '1.35rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between', 
                            boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.04)',
                            transition: 'all 0.2s ease',
                            borderTop: '3px solid var(--color-emerald-600)'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                <span className="badge badge-civic" style={{ fontSize: '0.72rem' }}>
                                    {c.jurisdiction || 'Denkada Mandal'}
                                </span>
                                <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                                    <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                                    {isTe ? "ధృవీకరించబడింది" : "Verified Desk"}
                                </span>
                            </div>

                            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-slate-950)' }}>
                                {isTe ? (c.name_te || c.name) : c.name}
                            </h3>

                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald-800)', background: 'var(--color-emerald-50)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-xs)', marginBottom: '0.85rem' }}>
                                <UserCheck size={13} />
                                <span>{isTe ? (c.designation_te || c.designation) : c.designation}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--color-slate-600)', marginBottom: '1.15rem' }}>
                                {c.address && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                        <MapPin size={14} style={{ color: 'var(--color-slate-400)', marginTop: '2px', flexShrink: 0 }} />
                                        <span>{c.address}</span>
                                    </div>
                                )}
                                {c.availability && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                                        <span><strong>{isTe ? "పనివేళలు: " : "Timings: "}</strong>{c.availability}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {c.phone && (
                            <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                                <a 
                                    href={createTelLink(c.phone)} 
                                    className="btn btn-primary btn-block"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                    <Phone size={15} />
                                    <span>{isTe ? "కాల్ చేయండి: " : "Call Desk: "} {formatPhoneDisplay(c.phone)}</span>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HealthcareContacts;
