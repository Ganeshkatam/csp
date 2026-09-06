import React from 'react';
import { HeartPulse, Calendar, CheckCircle, ShieldCheck, AlertCircle, MapPin } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function HealthAnnouncements({ announcements = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTe = currentLang === 'te';

    if (loading) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
                    {isTe ? 'ఆరోగ్య ప్రకటనలు లోడ్ అవుతున్నాయి...' : 'Loading health announcements....'}
                </div>
            </div>
        );
    }

    if (!announcements || announcements.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="health-announcements-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                        <span className="badge badge-verified" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-blue-800)', border: '1px solid var(--color-blue-200)' }}>
                            <HeartPulse size={12} style={{ marginRight: '3px' }} />
                            {isTe ? "ప్రజా ఆరోగ్య ప్రకటనలు" : "Public Health Notices"}
                        </span>
                        <span className="badge-level-a">
                            Level A: Local Circulars
                        </span>
                    </div>
                    <h2 id="health-announcements-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: 0 }}>
                        {isTe ? "పీహెచ్‌సీ ఆరోగ్య శిబిరాలు & తాజా హెచ్చరికలు" : "Active Health Camps & Public Health Bulletins"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe
                            ? "డెంకాడ మండల పరిధిలోని ప్రజల కోసం జిల్లా వైద్యాధికారి మరియు పీహెచ్‌సీ ద్వారా జారీ చేయబడిన తాజా ప్రకటనలు."
                            : "Official health advisories, seasonal disease warnings, and village screening camps published by DMHO Vizianagaram."
                        }
                    </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-50)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full, 9999px)', border: '1px solid var(--color-slate-200)' }}>
                    {isTe ? "లైవ్ నోటీసులు" : "Live Circulars"}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {announcements.map((item) => {
                    const isCamp = item.category?.toLowerCase().includes('camp');
                    const accentColor = isCamp ? 'var(--color-emerald-600)' : 'var(--color-blue-600)';
                    const badgeBg = isCamp ? 'var(--color-emerald-50)' : 'var(--color-blue-50)';
                    const badgeColor = isCamp ? 'var(--color-emerald-800)' : 'var(--color-blue-800)';
                    const badgeBorder = isCamp ? 'var(--color-emerald-200)' : 'var(--color-blue-200)';

                    return (
                        <article
                            key={item.id}
                            className="diagnostic-card-elevated"
                            style={{
                                borderTop: `4px solid ${accentColor}`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        padding: '0.2rem 0.55rem',
                                        borderRadius: 'var(--radius-full, 9999px)',
                                        background: badgeBg,
                                        color: badgeColor,
                                        border: `1px solid ${badgeBorder}`
                                    }}>
                                        {item.category || (isTe ? "ఆరోగ్య ప్రకటన" : "Health Notice")}
                                    </span>

                                    {item.event_date && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-600)' }}>
                                            <Calendar size={13} style={{ color: accentColor }} />
                                            {item.event_date}
                                        </span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                                    {isTe && item.title_te ? item.title_te : item.title}
                                </h3>

                                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-700)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                                    {isTe && item.description_te ? item.description_te : item.description}
                                </p>
                            </div>

                            <div style={{
                                paddingTop: '0.75rem',
                                borderTop: '1px solid var(--color-slate-100)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.72rem',
                                color: 'var(--color-slate-500)'
                            }}>
                                <span><strong>{isTe ? "మూలం: " : "Source: "}</strong>{item.source || 'PHC Circular'}</span>
                                <span style={{ color: 'var(--color-emerald-700)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={12} />
                                    {isTe ? "ధృవీకరించబడింది" : "Verified"}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default HealthAnnouncements;
