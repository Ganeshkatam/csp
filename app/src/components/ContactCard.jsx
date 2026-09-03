import React from 'react';
import { Phone, MapPin, ShieldCheck, User, Zap, Siren, Building } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function ContactCard({ contact, lang, t }) {
    const isEmergency = contact.category === 'Emergency';
    const isPolice = contact.category === 'Police';
    const isUtility = contact.category === 'Utilities' || contact.category === 'Electricity';

    const getCategoryIcon = () => {
        if (isEmergency || isPolice) return <Siren size={18} />;
        if (isUtility) return <Zap size={18} />;
        return <Building size={18} />;
    };

    const getIconThemeClass = () => {
        if (isEmergency) return 'icon-emergency';
        if (isPolice) return 'icon-police';
        if (isUtility) return 'icon-utility';
        return 'icon-admin';
    };

    return (
        <div className={`civic-card contact-card ${isEmergency ? 'border-accent-emergency' : ''}`}>
            <div className="card-top-content">
                {/* Header: Icon + Category Badge + Verification */}
                <div className="card-header-row">
                    <div className="contact-type-header">
                        <div className={`card-type-icon ${getIconThemeClass()}`} aria-hidden="true">
                            {getCategoryIcon()}
                        </div>
                        <span className={`badge ${isEmergency ? 'badge-alert' : 'badge-civic'}`}>
                            {contact.category}
                        </span>
                    </div>
                    <span className="badge badge-verified">
                        <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                    </span>
                </div>

                {/* Name & Designation */}
                <h3 className="card-item-title">{getLocalized(contact, 'name', lang)}</h3>
                
                <div className="designation-chip">
                    <User size={13} style={{ marginRight: '5px', color: 'var(--color-slate-500)' }} aria-hidden="true" />
                    <span>{getLocalized(contact, 'designation', lang)}</span>
                </div>

                {/* Location / Jurisdiction */}
                <div className="location-row">
                    <MapPin size={14} className="location-icon" aria-hidden="true" />
                    <span className="location-text">{contact.location || 'Local Habitation Jurisdiction'}</span>
                </div>
            </div>

            {/* Action & Verification Footer */}
            <div className="card-action-footer">
                <a 
                    href={`tel:${contact.phone}`} 
                    className={`btn ${isEmergency ? 'btn-emergency' : 'btn-primary'} call-action-btn`}
                    title={`Call ${contact.name}`}
                >
                    <Phone size={15} style={{ marginRight: '8px' }} aria-hidden="true" /> 
                    <span>{t.callNow} {contact.phone}</span>
                </a>
                
                <div className="card-verify-tag">
                    <span>{t.source} {contact.source}</span>
                    <span>{t.verifiedOn} {contact.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
