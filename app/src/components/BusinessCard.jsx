import React from 'react';
import { Phone, MapPin, ShieldCheck, User, Wrench, CheckCircle2 } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function BusinessCard({ business, lang, t }) {
    const servicesList = business.services ? business.services.split(',') : [];

    return (
        <div className="civic-card business-card">
            {business.image_url && (
                <div className="card-media-banner">
                    <img 
                        src={business.image_url} 
                        alt={business.name} 
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
                    <div className="business-type-header">
                        <div className="card-type-icon icon-business" aria-hidden="true">
                            <Wrench size={16} />
                        </div>
                        <span className="badge badge-civic">{business.category}</span>
                    </div>
                    {!business.image_url && (
                        <span className="badge badge-verified">
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                        </span>
                    )}
                </div>

                {/* Business Name */}
                <h3 className="card-item-title">{getLocalized(business, 'name', lang)}</h3>

                {/* Proprietor Chip */}
                {business.owner_name && (
                    <div className="designation-chip" style={{ marginBottom: '0.75rem' }}>
                        <User size={13} style={{ marginRight: '5px', color: 'var(--color-slate-500)' }} aria-hidden="true" />
                        <span>{t.proprietor} <strong>{business.owner_name}</strong></span>
                    </div>
                )}

                {/* Services List */}
                {servicesList.length > 0 && (
                    <div className="services-tag-group" style={{ marginBottom: '0.75rem' }}>
                        <span className="info-label" style={{ display: 'block', marginBottom: '4px' }}>{t.services}</span>
                        <div className="service-pills-list">
                            {servicesList.map((srv, idx) => (
                                <span key={idx} className="micro-service-pill">
                                    <CheckCircle2 size={11} style={{ marginRight: '4px', color: 'var(--color-blue-600)' }} aria-hidden="true" />
                                    {srv.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Location */}
                <div className="location-row">
                    <MapPin size={14} className="location-icon" aria-hidden="true" />
                    <span className="location-text">{business.address || 'Village Center'}</span>
                </div>
            </div>

            {/* Call Action & Verification */}
            <div className="card-action-footer">
                {business.phone ? (
                    <a 
                        href={`tel:${business.phone}`} 
                        className="btn btn-secondary call-action-btn"
                        title={`Call ${business.name}`}
                    >
                        <Phone size={15} style={{ marginRight: '8px' }} aria-hidden="true" /> 
                        <span>{t.callNow} {business.phone}</span>
                    </a>
                ) : (
                    <div className="no-direct-phone">Physical storefront in village market</div>
                )}

                <div className="card-verify-tag">
                    <span>{t.source} {business.source}</span>
                    <span>{t.verifiedOn} {business.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
