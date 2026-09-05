import React from 'react';
import { Phone, ShieldCheck, MapPin, Clock, HelpCircle, PhoneCall } from 'lucide-react';
import { educationContactsData } from '../data/educationContactsData';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

export function EducationContacts({ lang }) {
    const isTe = lang === 'te';
    const { provenance, contacts } = educationContactsData;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PhoneCall size={20} style={{ color: 'var(--color-indigo-600)' }} />
                        {isTe ? "విద్యా విభాగ అధికారిక కార్యాలయ & సహాయ కేంద్రాలు" : "Official Education Desks & Support Helplines"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "డెంకాడ మండల పరిధిలోని విద్యాధికారి, పాఠశాల కార్యాలయం మరియు రాష్ట్రస్థాయి విద్యార్థి సహాయ కేంద్రాల అధికారిక ఫోన్ నంబర్లు."
                            : "Verified administrative office desks, school offices, and toll-free state helplines for Modavalasa / Denkada."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-level-a">
                        <ShieldCheck size={11} />
                        Level A: Official Public Directory
                    </span>
                </div>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span><strong>Source:</strong> {provenance.source}</span>
                    <span><strong>Verified:</strong> {provenance.verifiedDate}</span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>Note:</strong> {isTe 
                        ? "కార్యాలయ పనివేళల్లో (ఉదయం 9:30 - సాయంత్రం 5:00) డెస్క్ ఫోన్ లైన్లు పనిచేస్తాయి. విద్యార్థి హెల్ప్‌లైన్ 14417 మరియు చైల్డ్‌లైన్ 1098 నిరంతరం అందుబాటులో ఉంటాయి."
                        : provenance.disclaimer
                    }
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {contacts.map(c => (
                    <div key={c.id} style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <span className="badge badge-civic" style={{ fontSize: '0.72rem' }}>
                                    {c.jurisdiction}
                                </span>
                                <span className="badge-level-a" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                                    {c.status === 'published' ? 'Verified' : c.status}
                                </span>
                            </div>

                            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                {isTe ? c.titleTe : c.title}
                            </h3>

                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: 'var(--color-slate-600)', lineHeight: '1.4' }}>
                                {isTe ? c.roleTe : c.role}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--color-slate-600)', marginBottom: '1rem', background: 'var(--color-slate-50)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-xs)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={13} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                                    <span><strong>{isTe ? "సమయం:" : "Timings:"}</strong> {isTe ? c.availabilityTe : c.availability}</span>
                                </div>
                                {c.address && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={13} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                                        <span><strong>{isTe ? "చిరునామా:" : "Office:"}</strong> {isTe ? c.addressTe : c.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <a 
                                href={createTelLink(c.phone)}
                                className="btn btn-primary btn-block"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}
                            >
                                <Phone size={15} />
                                <span>{isTe ? "కాల్ చేయండి: " : "Call Desk: "} {formatPhoneDisplay(c.phone)}</span>
                            </a>
                            <div style={{ fontSize: '0.68rem', color: 'var(--color-slate-400)', textAlign: 'center', marginTop: '0.4rem' }}>
                                Source: {c.source} ({c.verified_on})
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EducationContacts;
