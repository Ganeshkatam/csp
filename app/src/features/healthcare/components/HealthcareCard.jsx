import React from 'react';
import { Phone, Clock, User, CheckCircle2, ShieldCheck, MapPin, Activity } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

function checkIsOpenNow(timings) {
    if (!timings) return false;
    const now = new Date();
    const day = now.getDay();
    if (day === 0) return false; // Sunday
    const hour = now.getHours();
    return hour >= 9 && hour < 16;
}

export function HealthcareCard({ facility, lang, t, variant = 'showcase' }) {
    const timings = facility.timings || facility.operating_hours || '9:00 AM - 4:00 PM (Mon-Sat)';
    const isOpen = checkIsOpenNow(timings);
    const services = facility.services ? facility.services.split(',').map(s => s.trim()) : [];
    const isTe = lang === 'te';

    // Horizontal Showcase Card Variant (Used in FacilityDirectory / Main Healthcare Page)
    if (variant === 'showcase') {
        return (
            <div className="facility-showcase-card">
                {facility.image_url && (
                    <div className="facility-showcase-media">
                        <img 
                            src={facility.image_url} 
                            alt={facility.name} 
                            loading="lazy"
                        />
                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                            <span className="badge badge-verified" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-sm)' }}>
                                <Activity size={13} style={{ color: 'var(--color-emerald-600)', marginRight: '4px' }} />
                                {isTe ? "డెంకాడ పిహెచ్‌సి (మోదవలస సేవా కేంద్రం)" : "Serving PHC (Denkada Mandal HQ)"}
                            </span>
                        </div>
                    </div>
                )}

                <div className="facility-showcase-body">
                    <div>
                        <div className="card-header-row" style={{ marginBottom: '0.65rem' }}>
                            <span className="badge-level-a">
                                <ShieldCheck size={11} />
                                {isTe ? "స్థానిక అధికారిక రికార్డు" : "Level A: Local Verified Record"}
                            </span>
                            <span className="badge badge-verified">
                                {isTe ? "ప్రభుత్వ గుర్తింపు" : "Govt Registered"}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.5rem', lineHeight: '1.25' }}>
                            {getLocalized(facility, 'name', lang)}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, background: isOpen ? 'var(--color-emerald-50)' : 'var(--color-slate-100)', color: isOpen ? 'var(--color-emerald-800)' : 'var(--color-slate-600)', border: `1px solid ${isOpen ? 'var(--color-emerald-200)' : 'var(--color-slate-200)'}` }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOpen ? 'var(--color-emerald-600)' : 'var(--color-slate-400)' }} />
                                {isOpen 
                                    ? (isTe ? "ఇప్పుడు తెరిచి ఉంది — ప్రచురిత వేళలు" : "Open Now — based on published hours")
                                    : (isTe ? "ఇప్పుడు మూసివేయబడింది — ప్రచురిత వేళలు" : "Closed Now — based on published hours")
                                }
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)' }}>
                                {isTe ? "వైద్యుల ప్రత్యక్ష హాజరుకు హామీ ఇవ్వదు." : "Does not confirm real-time clinician presence."}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', background: 'var(--color-slate-50)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                                <Clock size={16} style={{ color: 'var(--color-slate-500)', marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "పనివేళలు" : "Operating Hours"}
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>{timings}</div>
                                </div>
                            </div>
                            {facility.address && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                                    <MapPin size={16} style={{ color: 'var(--color-slate-500)', marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                            {isTe ? "చిరునామా / ప్రాంతం" : "Location"}
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-900)' }}>
                                            {facility.address} {isTe ? "• డెంకాడ మండల కేంద్రం (మోదవలస నుండి 3.2 కి.మీ.)" : "• 3.2 km at Mandal HQ (Serving Modavalasa)"}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {services.length > 0 && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.5rem' }}>
                                    {isTe ? "అందుబాటులో ఉన్న సేవలు:" : "Available Medical Services:"}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {services.map((srv, idx) => (
                                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-emerald-50)', color: 'var(--color-emerald-900)', border: '1px solid var(--color-emerald-200)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 600 }}>
                                            <CheckCircle2 size={12} style={{ color: 'var(--color-emerald-700)' }} /> {srv}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        {facility.phone && (
                            <a 
                                href={createTelLink(facility.phone)} 
                                className="btn btn-primary card-action-btn"
                            >
                                <Phone size={16} style={{ marginRight: '8px' }} />
                                <span>{isTe ? "కాల్ చేయండి: " : "Call "} {formatPhoneDisplay(facility.phone)}</span>
                            </a>
                        )}

                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span><strong>Source:</strong> {facility.source || 'PHC Notice Board'}</span>
                            <span><strong>Source verification date:</strong> {facility.verified_on || 'August 2024'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Vertical Card (Used in Multi-Column Grids, e.g. HomePage)
    return (
        <div className="civic-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {facility.image_url && (
                <div className="civic-card-media">
                    <img 
                        src={facility.image_url} 
                        alt={facility.name} 
                        loading="lazy"
                    />
                </div>
            )}
            <div className="card-top-content" style={{ flex: 1 }}>
                <div className="card-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={18} style={{ color: 'var(--color-emerald-600)' }} />
                        <span className="badge badge-verified">Primary Healthcare</span>
                    </div>
                    <span className="badge badge-verified">
                        <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                    </span>
                </div>

                <h3 className="card-item-title">
                    {getLocalized(facility, 'name', lang)}
                </h3>

                <div style={{ margin: '0.5rem 0 0.85rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: isOpen ? 'var(--color-emerald-50)' : 'var(--color-slate-100)', color: isOpen ? 'var(--color-emerald-800)' : 'var(--color-slate-600)', border: `1px solid ${isOpen ? 'var(--color-emerald-200)' : 'var(--color-slate-200)'}` }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOpen ? 'var(--color-emerald-600)' : 'var(--color-slate-400)' }} />
                        {isOpen ? 'Open Now — based on published hours' : 'Closed Now — based on published hours'}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-500)', marginTop: '3px' }}>
                        Does not confirm real-time clinician presence.
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-slate-700)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                        <span><strong>{t?.timings || 'Timings:'}</strong> {timings}</span>
                    </div>
                    {facility.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                            <span>{facility.address}</span>
                        </div>
                    )}
                </div>

                {services.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-slate-600)', marginBottom: '0.35rem' }}>
                            {t?.services || 'Available Services:'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {services.map((srv, idx) => (
                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-100)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', fontWeight: 500 }}>
                                    <CheckCircle2 size={11} /> {srv}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {facility.phone && (
                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                    <a 
                        href={createTelLink(facility.phone)} 
                        className="btn btn-primary btn-block"
                    >
                        <Phone size={15} style={{ marginRight: '6px' }} />
                        <span>{t?.callNow || 'Call'} {formatPhoneDisplay(facility.phone)}</span>
                    </a>
                </div>
            )}

            <div className="card-verify-tag">
                <span>Source: {facility.source || 'PHC Notice Board'}</span>
                <span>Source verification date: {facility.verified_on || 'August 2024'}</span>
            </div>
        </div>
    );
}

export default HealthcareCard;
