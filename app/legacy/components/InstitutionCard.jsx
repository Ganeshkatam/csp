import React from 'react';
import { Phone, Clock, User, CheckCircle2, ShieldCheck, MapPin, Activity, GraduationCap } from 'lucide-react';
import { getLocalized, formatPhoneDisplay } from '../lib/i18n';

function checkIsOpenNow(timings) {
    if (!timings) return false;
    const now = new Date();
    const day = now.getDay();
    if (day === 0) return false; // Closed Sunday by default
    const hour = now.getHours();
    // Typical rural PHC OPD: 9:00 to 16:00
    return hour >= 9 && hour < 16;
}

export default function InstitutionCard({ institution, lang, t }) {
    const isPhc = institution.type === 'PHC' || institution.type === 'Healthcare';
    const institutionTimings = institution.timings || institution.operating_hours;
    const isOpen = checkIsOpenNow(institutionTimings);

    return (
        <div className="civic-card institution-card">
            {institution.image_url && (
                <div className="card-media-banner">
                    <img 
                        src={institution.image_url} 
                        alt={institution.name} 
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
                {/* Header: Icon + Type Badge + Verification */}
                <div className="card-header-row">
                    <div className="institution-type-header">
                        <div className={`card-type-icon ${isPhc ? 'icon-health' : 'icon-education'}`} aria-hidden="true">
                            {isPhc ? <Activity size={18} /> : <GraduationCap size={18} />}
                        </div>
                        <span className="badge badge-civic">{institution.type}</span>
                    </div>
                    {!institution.image_url && (
                        <span className="badge badge-verified">
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                        </span>
                    )}
                </div>

                {/* Institution Name */}
                <h3 className="card-item-title">{getLocalized(institution, 'name', lang)}</h3>

                {/* Operating Status Pill (Operating-Hours Derived) */}
                {isPhc && (
                    <div className="phc-status-container">
                        <div className={`phc-status-pill ${isOpen ? 'phc-status-open' : 'phc-status-closed'}`}>
                            <span className={isOpen ? 'status-dot-pulse' : 'status-dot-closed'} aria-hidden="true"></span>
                            <span className="status-pill-text">
                                {isOpen ? 'Open Now — based on listed operating hours' : 'Closed — based on listed operating hours'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Key Information Rows with Structured Icons */}
                <div className="card-info-stack">
                    <div className="info-stack-row">
                        <Clock size={15} className="info-icon" aria-hidden="true" />
                        <div className="info-stack-content">
                            <span className="info-label">{t.timings}</span>
                            <span className="info-value">{institutionTimings || 'Standard Working Hours'}</span>
                        </div>
                    </div>

                    {institution.doctor_in_charge && (
                        <div className="info-stack-row">
                            <User size={15} className="info-icon" aria-hidden="true" />
                            <div className="info-stack-content">
                                <span className="info-label">{isPhc ? 'Medical Officer / In-Charge:' : 'Headmaster / Principal:'}</span>
                                <span className="info-value">{institution.doctor_in_charge}</span>
                            </div>
                        </div>
                    )}

                    {institution.services && (
                        <div className="services-tag-group">
                            <span className="info-label" style={{ display: 'block', marginBottom: '4px' }}>{t.services}</span>
                            <div className="service-pills-list">
                                {getLocalized(institution, 'services', lang).split(',').map((srv, idx) => (
                                    <span key={idx} className="micro-service-pill">
                                        <CheckCircle2 size={11} style={{ marginRight: '4px', color: 'var(--color-emerald-600)' }} aria-hidden="true" />
                                        {srv.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action & Verification Footer */}
            <div className="card-action-footer">
                {institution.phone ? (
                    <a 
                        href={`tel:${institution.phone}`} 
                        className="btn btn-primary call-action-btn"
                        title={`Call ${institution.name}`}
                    >
                        <Phone size={15} style={{ marginRight: '8px' }} aria-hidden="true" /> 
                        <span>{t.callNow} {formatPhoneDisplay(institution.phone)}</span>
                    </a>
                ) : (
                    <div className="no-direct-phone">Direct contact available via Gram Panchayat desk</div>
                )}
                <div className="card-verify-tag">
                    <span>{t.source} {institution.source}</span>
                    <span>{t.verifiedOn} {institution.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
