import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle2, UserCheck, ShieldCheck, FileCheck, Layers, ArrowRight } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { generateSlug } from '../api/schemes';

function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

export function SchemeCard({ scheme, lang, t }) {
    const docStr = scheme.documents_required || scheme.documents || '';
    const docs = docStr.split(',').map(d => d.trim()).filter(Boolean);
    const portalUrl = sanitizeUrl(scheme.official_url);
    const schemeSlug = generateSlug(scheme.name);

    return (
        <div className="civic-card scheme-card" style={{ display: 'flex', flexDirection: 'column' }}>
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
            <div className="card-top-content" style={{ flex: 1 }}>
                <div className="card-header-row">
                    <div className="badge badge-civic">
                        <Layers size={13} style={{ marginRight: '4px' }} aria-hidden="true" />
                        <span>{scheme.category}</span>
                    </div>
                    {!scheme.image_url && (
                        <span className="badge badge-verified">
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                        </span>
                    )}
                </div>

                <h3 className="card-item-title">
                    <Link to={`/schemes/${schemeSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {getLocalized(scheme, 'name', lang)}
                    </Link>
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', marginBottom: '1rem', lineHeight: '1.55' }}>
                    {getLocalized(scheme, 'description', lang)}
                </p>

                {scheme.eligibility && (
                    <div style={{ background: 'var(--color-slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-slate-200)', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-blue-700)', marginBottom: '0.25rem' }}>
                            <UserCheck size={14} />
                            <span>{t?.eligibility || 'Eligibility:'}</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-700)', margin: 0, lineHeight: '1.4' }}>
                            {getLocalized(scheme, 'eligibility', lang)}
                        </p>
                    </div>
                )}

                {docs.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-emerald-700)', marginBottom: '0.35rem' }}>
                            <FileCheck size={14} />
                            <span>{t?.requiredDocs || 'Required Documents:'}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {docs.slice(0, 4).map((doc, idx) => (
                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-100)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', fontWeight: 500 }}>
                                    <CheckCircle2 size={11} /> {doc}
                                </span>
                            ))}
                            {docs.length > 4 && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', alignSelf: 'center' }}>
                                    +{docs.length - 4} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                <Link
                    to={`/schemes/${schemeSlug}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                >
                    <span>Details</span>
                    <ArrowRight size={13} />
                </Link>
                {scheme.official_url && (
                    <a 
                        href={portalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        title={`Open official portal for ${scheme.name}`}
                    >
                        <span>Portal</span>
                        <ExternalLink size={13} />
                    </a>
                )}
            </div>
            <div className="card-verify-tag">
                <span>Source: {scheme.source || 'State Portal'}</span>
                <span>Verified: {scheme.verified_on || 'Current'}</span>
            </div>
        </div>
    );
}

export default SchemeCard;
