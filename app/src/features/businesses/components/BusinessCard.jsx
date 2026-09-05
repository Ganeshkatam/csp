import React from 'react';
import { Phone, MapPin, ShieldCheck, User, Wrench, CheckCircle2 } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

export function BusinessCard({ business, lang, t }) {
    const servicesList = business.services ? business.services.split(',').map(s => s.trim()) : [];

    return (
        <div className="civic-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {business.image_url && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', height: '160px', background: 'var(--color-slate-100)' }}>
                    <img 
                        src={business.image_url} 
                        alt={business.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                    />
                </div>
            )}
            <div className="card-top-content" style={{ flex: 1 }}>
                <div className="card-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Wrench size={16} style={{ color: 'var(--color-amber-600)' }} />
                        <span className="badge badge-warning">{business.category}</span>
                    </div>
                    <span className="badge badge-verified">
                        <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                    </span>
                </div>

                <h3 className="card-item-title">
                    {getLocalized(business, 'name', lang)}
                </h3>

                {business.owner_name && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--color-slate-600)', margin: '0.4rem 0 0.75rem' }}>
                        <User size={13} style={{ color: 'var(--color-slate-400)' }} />
                        <span>Proprietor: <strong>{business.owner_name}</strong></span>
                    </div>
                )}

                {servicesList.length > 0 && (
                    <div style={{ marginBottom: '0.85rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>
                            {t?.services || 'Available Services:'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {servicesList.map((srv, idx) => (
                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-slate-100)', color: 'var(--color-slate-700)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', fontWeight: 500 }}>
                                    <CheckCircle2 size={11} style={{ color: 'var(--color-blue-600)' }} /> {srv}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginTop: 'auto', marginBottom: '0.5rem' }}>
                    <MapPin size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                    <span>{business.address || 'Village Center'}</span>
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                {business.phone ? (
                    <a 
                        href={createTelLink(business.phone)} 
                        className="btn btn-primary btn-block"
                        title={`Call ${business.name}`}
                    >
                        <Phone size={15} style={{ marginRight: '6px' }} /> 
                        <span>{t?.callNow || 'Call'} {formatPhoneDisplay(business.phone)}</span>
                    </a>
                ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-500)', textAlign: 'center', padding: '0.4rem 0' }}>
                        Physical storefront in village market
                    </div>
                )}

                <div className="card-verify-tag">
                    <span>Source: {business.source || 'Local Survey'}</span>
                    <span>Verified: {business.verified_on || 'Current'}</span>
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;
