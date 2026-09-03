import React from 'react';
import { Phone } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function ContactCard({ contact, lang, t }) {
    const isEmergency = contact.category === 'Emergency' || contact.category === 'Police';

    return (
        <div className="civic-card">
            <div>
                <div className="card-header-row">
                    <span className={`badge ${isEmergency ? 'badge-alert' : 'badge-civic'}`}>
                        {contact.category}
                    </span>
                    <span className="badge badge-verified">Verified</span>
                </div>
                <h3 className="card-item-title">{getLocalized(contact, 'name', lang)}</h3>
                <ul className="card-meta-list">
                    <li className="meta-row">
                        <span className="meta-label">Designation:</span>
                        <span className="meta-val">{getLocalized(contact, 'designation', lang)}</span>
                    </li>
                    <li className="meta-row">
                        <span className="meta-label">Location:</span>
                        <span className="meta-val">{contact.location || 'Local Jurisdiction'}</span>
                    </li>
                </ul>
            </div>
            <div>
                <a 
                    href={`tel:${contact.phone}`} 
                    className={`btn ${isEmergency ? 'btn-emergency' : 'btn-primary'}`}
                    style={{ width: '100%', marginTop: '0.75rem' }}
                >
                    <Phone size={15} style={{ marginRight: '6px' }} aria-hidden="true" /> {t.callNow} {contact.phone}
                </a>
                <div className="card-verify-tag">
                    <span>{t.source} {contact.source}</span>
                    <span>{t.verifiedOn} {contact.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
