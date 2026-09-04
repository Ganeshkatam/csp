import React from 'react';
import { ExternalLink, CheckCircle2, UserCheck, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function SchemeCard({ scheme, lang, t }) {
    // Parse required documents into clean chips
    const docStr = scheme.documents_required || scheme.documents || '';
    const docs = docStr.split(',').map(d => d.trim()).filter(Boolean);

    return (
        <div className="civic-card scheme-card">
            {scheme.image_url && (
                <div className="card-media-banner">
                    <img 
                        src={scheme.image_url} 
                        alt={scheme.name} 
                        className="card-media-img"
                        loading="lazy"
                    />
                    <div className="card-media-badge-overlay">
                        <span className="badge badge-verified">
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                        </span>
                    </div>
                </div>
            )}
            <div className="card-top-content">
                {/* Header: Category Badge + Verification */}
                <div className="card-header-row">
                    <div className="scheme-category-badge">
                        <Layers size={13} style={{ marginRight: '4px' }} aria-hidden="true" />
                        <span>{scheme.category}</span>
                    </div>
                    {!scheme.image_url && (
                        <span className="badge badge-verified">
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                        </span>
                    )}
                </div>

                {/* Scheme Title */}
                <h3 className="card-item-title">{getLocalized(scheme, 'name', lang)}</h3>

                {/* Scheme Summary */}
                <p className="scheme-desc-text">
                    {getLocalized(scheme, 'description', lang)}
                </p>

                {/* Eligibility Block */}
                <div className="eligibility-highlight-box">
                    <div className="eligibility-title">
                        <UserCheck size={14} style={{ marginRight: '5px', color: 'var(--color-blue-600)' }} aria-hidden="true" />
                        <span>{t.eligibility}</span>
                    </div>
                    <p className="eligibility-text">
                        {getLocalized(scheme, 'eligibility', lang)}
                    </p>
                </div>

                {/* Required Documents Checklist Chips */}
                {docs.length > 0 && (
                    <div className="documents-checklist-block">
                        <div className="docs-checklist-header">
                            <FileCheck size={14} style={{ marginRight: '5px', color: 'var(--color-emerald-600)' }} aria-hidden="true" />
                            <span>{t.requiredDocs}</span>
                        </div>
                        <div className="docs-chips-grid">
                            {docs.map((doc, idx) => (
                                <span key={idx} className="doc-chip-item">
                                    <CheckCircle2 size={12} className="doc-check-icon" aria-hidden="true" />
                                    <span>{doc.trim()}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Outbound Link & Verification Footer */}
            <div className="card-action-footer">
                {scheme.official_url && (
                    <a 
                        href={scheme.official_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-scheme-portal scheme-action-btn"
                        title={`Open official portal for ${scheme.name}`}
                    >
                        <span className="scheme-btn-label">{t.officialPortal}</span>
                        {scheme.official_url.includes('.gov.in') && (
                            <span className="scheme-gov-pill">.gov.in</span>
                        )}
                        <ExternalLink size={15} className="scheme-btn-icon" aria-hidden="true" />
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
