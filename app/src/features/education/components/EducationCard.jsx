import React from 'react';
import { Phone, Clock, GraduationCap, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';

function checkIsOpenNow(timings) {
    if (!timings) return false;
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    if (day === 0) return false;

    const lower = (timings || '').toLowerCase();
    if (lower.includes('monday to friday') && day === 6) {
        return false;
    }

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;

    // Anganwadi: 8:30 AM - 1:00 PM (510 to 780 minutes)
    if (lower.includes('8:30') && (lower.includes('1:00') || lower.includes('1 pm') || lower.includes('1:00 pm'))) {
        return currentMinutes >= 510 && currentMinutes < 780;
    }

    // MPPS / School: 9:00 AM - 4:00 PM (540 to 960 minutes) or 4:30 PM (990 minutes)
    if (lower.includes('4:30')) {
        return currentMinutes >= 540 && currentMinutes < 990;
    }

    return currentMinutes >= 540 && currentMinutes < 960;
}

export function EducationCard({ institution, lang, t }) {
    const timings = institution.timings || institution.operating_hours || '9:00 AM - 4:00 PM (Mon-Fri)';
    const isOpen = checkIsOpenNow(timings);
    const facilities = institution.services ? institution.services.split(',').map(s => s.trim()) : [];
    const isTe = lang === 'te';

    return (
        <div className="civic-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {institution.image_url && (
                <div className="civic-card-media">
                    <img 
                        src={institution.image_url} 
                        alt={institution.name} 
                        loading="lazy"
                    />
                </div>
            )}
            <div className="card-top-content" style={{ flex: 1 }}>
                <div className="card-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={18} style={{ color: 'var(--color-indigo-600)' }} />
                        <span className="badge badge-civic">
                            {isTe ? "పాఠశాల & విద్య" : "School & Education"}
                        </span>
                    </div>
                    <span className="badge badge-verified">
                        <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                    </span>
                </div>

                <h3 className="card-item-title" style={{ minHeight: '3.1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getLocalized(institution, 'name', lang)}
                </h3>

                <div style={{ margin: '0.5rem 0 0.85rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: isOpen ? 'var(--color-emerald-50)' : 'var(--color-red-50)', color: isOpen ? 'var(--color-emerald-800)' : 'var(--color-red-700)', border: `1px solid ${isOpen ? 'var(--color-emerald-200)' : 'var(--color-red-200)'}` }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOpen ? 'var(--color-emerald-600)' : 'var(--color-red-500)' }} />
                        {isOpen 
                            ? (isTe ? "ఇప్పుడు తెరిచి ఉంది — ప్రచురిత వేళలు" : "Open Now — based on published hours")
                            : (isTe ? "ఇప్పుడు మూసివేయబడింది — ప్రచురిత వేళలు" : "Closed Now — based on published hours")
                        }
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-500)', marginTop: '3px' }}>
                        {isTe ? "సిబ్బంది ప్రత్యక్ష హాజరుకు హామీ ఇవ్వదు." : "Does not confirm real-time staff presence."}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-slate-700)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                        <span><strong>{t?.timings || 'Operating Hours:'}</strong> {timings}</span>
                    </div>
                    {institution.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                            <span>{institution.address}</span>
                        </div>
                    )}
                </div>

                {facilities.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-slate-600)', marginBottom: '0.35rem' }}>
                            {isTe ? "సౌకర్యాలు & కార్యక్రమాలు:" : "Facilities & Programmes:"}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {facilities.map((fac, idx) => (
                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'var(--color-indigo-50)', color: 'var(--color-indigo-800)', border: '1px solid var(--color-indigo-100)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', fontWeight: 500 }}>
                                    <CheckCircle2 size={11} /> {fac}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="card-bottom-actions" style={{ marginTop: 'auto' }}>
                {institution.phone && (
                    <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--color-slate-100)' }}>
                        <a 
                            href={createTelLink(institution.phone)} 
                            className="btn btn-primary btn-block"
                        >
                            <Phone size={15} style={{ marginRight: '6px' }} />
                            <span>{t?.callNow || 'Call'} {formatPhoneDisplay(institution.phone)}</span>
                        </a>
                    </div>
                )}

                <div className="card-verify-tag" style={{ minHeight: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--color-slate-500)', paddingTop: '0.65rem', borderTop: '1px solid var(--color-slate-100)', marginTop: '0.5rem' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }} title={institution.source || 'Education Dept'}>Source: {institution.source || 'Education Dept'}</span>
                    <span style={{ flexShrink: 0 }}>Verified: {institution.verified_on || 'Current'}</span>
                </div>
            </div>
        </div>
    );
}

export default EducationCard;
