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

export function HealthcareCard({ facility, lang, t }) {
    const timings = facility.timings || facility.operating_hours || '9:00 AM - 4:00 PM (Mon-Sat)';
    const isOpen = checkIsOpenNow(timings);
    const services = facility.services ? facility.services.split(',').map(s => s.trim()) : [];

    return (
        <div className="civic-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {facility.image_url && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', height: '160px', background: 'var(--color-slate-100)' }}>
                    <img 
                        src={facility.image_url} 
                        alt={facility.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: isOpen ? 'var(--color-emerald-50)' : 'var(--color-slate-100)', color: isOpen ? 'var(--color-emerald-700)' : 'var(--color-slate-600)', border: `1px solid ${isOpen ? 'var(--color-emerald-100)' : 'var(--color-slate-200)'}` }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOpen ? 'var(--color-emerald-600)' : 'var(--color-slate-400)' }} />
                        {isOpen ? 'Open Now (OPD Active)' : 'Closed Now (OPD 9 AM - 4 PM)'}
                    </span>
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
                <span>Source: {facility.source || 'Health Dept'}</span>
                <span>Verified: {facility.verified_on || 'Current'}</span>
            </div>
        </div>
    );
}

export default HealthcareCard;
