import React from 'react';
import { Phone, MapPin, ShieldCheck, User, Zap, Siren, Building } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

export function ContactCard({ contact, lang, t }) {
    const isEmergency = contact.category === 'Emergency';
    const isPolice = contact.category === 'Police';
    const isUtility = contact.category === 'Utilities' || contact.category === 'Electricity';

    const getCategoryIcon = () => {
        if (isEmergency || isPolice) return <Siren size={18} />;
        if (isUtility) return <Zap size={18} />;
        return <Building size={18} />;
    };

    return (
        <div className={`civic-card ${isEmergency ? 'border-accent-emergency' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-top-content" style={{ flex: 1 }}>
                <div className="card-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ color: isEmergency ? 'var(--color-red-600)' : 'var(--color-blue-600)' }}>
                            {getCategoryIcon()}
                        </div>
                        <span className={`badge ${isEmergency ? 'badge-alert' : 'badge-civic'}`}>
                            {contact.category}
                        </span>
                    </div>
                    <span className="badge badge-verified">
                        <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                    </span>
                </div>

                <h3 className="card-item-title">
                    {getLocalized(contact, 'name', lang)}
                </h3>
                
                {contact.designation && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--color-slate-100)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '0.75rem' }}>
                        <User size={13} style={{ color: 'var(--color-slate-500)' }} />
                        <span>{getLocalized(contact, 'designation', lang)}</span>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginBottom: '0.75rem' }}>
                    <MapPin size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                    <span>{contact.jurisdiction || contact.address || 'Local Habitation Jurisdiction'}</span>
                </div>

                {contact.availability && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-emerald-700)', marginBottom: '0.5rem' }}>
                        Timing: {contact.availability}
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                <a 
                    href={createTelLink(contact.phone)} 
                    className={`btn ${isEmergency ? 'btn-danger' : 'btn-primary'} btn-block`}
                    title={`Call ${contact.name}`}
                >
                    <Phone size={15} style={{ marginRight: '8px' }} /> 
                    <span>{t?.callNow || 'Call'} {formatPhoneDisplay(contact.phone)}</span>
                </a>
                
                <div className="card-verify-tag">
                    <span>Source: {contact.source || 'District Records'}</span>
                    <span>Verified: {contact.verified_on || 'Current'}</span>
                </div>
            </div>
        </div>
    );
}

export default ContactCard;
