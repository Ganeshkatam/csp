import React from 'react';
import { Phone, Clock, GraduationCap, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

export function EducationCard({ institution, lang, t }) {
    const timings = institution.timings || institution.operating_hours || '9:00 AM - 4:30 PM (Mon-Sat)';
    const facilities = institution.services ? institution.services.split(',').map(s => s.trim()) : [];

    return (
        <div className="civic-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {institution.image_url && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', height: '160px', background: 'var(--color-slate-100)' }}>
                    <img 
                        src={institution.image_url} 
                        alt={institution.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                    />
                </div>
            )}
            <div className="card-top-content" style={{ flex: 1 }}>
                <div className="card-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={18} style={{ color: 'var(--color-indigo-600)' }} />
                        <span className="badge badge-civic">School &amp; Education</span>
                    </div>
                    <span className="badge badge-verified">
                        <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                    </span>
                </div>

                <h3 className="card-item-title">
                    {getLocalized(institution, 'name', lang)}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8125rem', color: 'var(--color-slate-700)', margin: '0.85rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                        <span><strong>{t?.timings || 'Timings:'}</strong> {timings}</span>
                    </div>
                    {institution.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                            <span>{institution.address}</span>
                        </div>
                    )}
                </div>

                {facilities.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-slate-600)', marginBottom: '0.35rem' }}>
                            Facilities &amp; Programmes:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {facilities.map((fac, idx) => (
                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-indigo-50)', color: 'var(--color-indigo-800)', border: '1px solid var(--color-indigo-100)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', fontWeight: 500 }}>
                                    <CheckCircle2 size={11} /> {fac}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {institution.phone && (
                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                    <a 
                        href={createTelLink(institution.phone)} 
                        className="btn btn-secondary btn-block"
                    >
                        <Phone size={15} style={{ marginRight: '6px' }} />
                        <span>{t?.callNow || 'Call'} {formatPhoneDisplay(institution.phone)}</span>
                    </a>
                </div>
            )}

            <div className="card-verify-tag">
                <span>Source: {institution.source || 'Education Dept'}</span>
                <span>Verified: {institution.verified_on || 'Current'}</span>
            </div>
        </div>
    );
}

export default EducationCard;
