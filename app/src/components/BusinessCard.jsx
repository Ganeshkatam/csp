import React from 'react';
import { Phone } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function BusinessCard({ business, lang, t }) {
    return (
        <div className="civic-card">
            <div>
                <div className="card-header-row">
                    <span className="badge badge-civic">{business.category}</span>
                    <span className="badge badge-verified">Verified</span>
                </div>
                <h3 className="card-item-title">{getLocalized(business, 'name', lang)}</h3>
                {business.owner_name && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginBottom: '0.5rem' }}>
                        {t.proprietor} {business.owner_name}
                    </div>
                )}
                <ul className="card-meta-list">
                    <li className="meta-row">
                        <span className="meta-label">{t.services}</span>
                        <span className="meta-val">{getLocalized(business, 'services', lang)}</span>
                    </li>
                    <li className="meta-row">
                        <span className="meta-label">Location:</span>
                        <span className="meta-val">{business.address || 'Village Center'}</span>
                    </li>
                </ul>
            </div>
            <div>
                {business.phone && (
                    <a 
                        href={`tel:${business.phone}`} 
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                    >
                        <Phone size={15} style={{ marginRight: '6px' }} aria-hidden="true" /> {t.callNow} {business.phone}
                    </a>
                )}
                <div className="card-verify-tag">
                    <span>{t.source} {business.source}</span>
                    <span>{t.verifiedOn} {business.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
