import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function SchemeCard({ scheme, lang, t }) {
    return (
        <div className="civic-card">
            <div>
                <div className="card-header-row">
                    <span className="badge badge-civic">{scheme.category}</span>
                    <span className="badge badge-verified">Verified</span>
                </div>
                <h3 className="card-item-title">{getLocalized(scheme, 'name', lang)}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                    {getLocalized(scheme, 'description', lang)}
                </p>
                <ul className="card-meta-list">
                    <li className="meta-row">
                        <span className="meta-label">{t.eligibility}</span>
                        <span className="meta-val">{getLocalized(scheme, 'eligibility', lang)}</span>
                    </li>
                </ul>
                <div className="card-checklist">
                    <div className="checklist-title">{t.requiredDocs}</div>
                    <div>{getLocalized(scheme, 'documents_required', lang)}</div>
                </div>
            </div>
            <div>
                {scheme.official_url && (
                    <a 
                        href={scheme.official_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline-blue"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                    >
                        {t.officialPortal} <ExternalLink size={14} style={{ marginLeft: '4px' }} aria-hidden="true" />
                    </a>
                )}
                <div className="card-verify-tag">
                    <span>{t.source} {scheme.source}</span>
                    <span>{t.verifiedOn} {scheme.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
