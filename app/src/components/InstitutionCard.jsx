import React from 'react';
import { Phone } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

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
    const isOpen = checkIsOpenNow(institution.operating_hours);

    return (
        <div className="civic-card">
            <div>
                <div className="card-header-row">
                    <span className="badge badge-civic">{institution.type}</span>
                    <span className="badge badge-verified">Verified</span>
                </div>
                <h3 className="card-item-title">{getLocalized(institution, 'name', lang)}</h3>

                {isPhc && (
                    <div className="phc-status-container">
                        <span className={`phc-status-pill ${isOpen ? 'phc-status-open' : 'phc-status-closed'}`}>
                            <span className={isOpen ? 'status-dot-pulse' : 'status-dot-closed'} aria-hidden="true"></span>
                            {isOpen ? 'Open Now — based on listed operating hours' : 'Closed — based on listed operating hours'}
                        </span>
                    </div>
                )}

                <ul className="card-meta-list">
                    <li className="meta-row">
                        <span className="meta-label">{t.timings}</span>
                        <span className="meta-val">{institution.operating_hours || 'Standard Hours'}</span>
                    </li>
                    {institution.doctor_in_charge && (
                        <li className="meta-row">
                            <span className="meta-label">In-Charge:</span>
                            <span className="meta-val">{institution.doctor_in_charge}</span>
                        </li>
                    )}
                    {institution.services && (
                        <li className="meta-row">
                            <span className="meta-label">{t.services}</span>
                            <span className="meta-val">{getLocalized(institution, 'services', lang)}</span>
                        </li>
                    )}
                </ul>
            </div>
            <div>
                {institution.phone && (
                    <a 
                        href={`tel:${institution.phone}`} 
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                    >
                        <Phone size={15} style={{ marginRight: '6px' }} aria-hidden="true" /> {t.callNow} {institution.phone}
                    </a>
                )}
                <div className="card-verify-tag">
                    <span>{t.source} {institution.source}</span>
                    <span>{t.verifiedOn} {institution.verified_on}</span>
                </div>
            </div>
        </div>
    );
}
