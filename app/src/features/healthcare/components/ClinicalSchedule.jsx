import React from 'react';
import { Calendar, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import { CLINICAL_SCHEDULE_REFERENCE } from '../data/clinicalScheduleData';

export function ClinicalSchedule({ lang = 'en' }) {
    const isTe = lang === 'te';
    const ref = CLINICAL_SCHEDULE_REFERENCE;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} style={{ color: 'var(--color-blue-600)' }} />
                        {isTe ? "వారపు క్లినికల్ సేవల కాలపట్టిక" : "Published Clinical Services Schedule"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రంలో వివిధ క్లినిక్‌ల ప్రచురిత పనివేళలు."
                            : "Published day-by-day clinical outpatient services and health programmes at Denkada PHC."
                        }
                    </p>
                </div>
                <span className="badge-level-a">
                    <ShieldCheck size={11} />
                    Level A: Local Verified Record
                </span>
            </div>

            {/* Provenance and Explicit Operating Status Disclaimer */}
            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span><strong>Source:</strong> {ref.source}</span>
                    <span><strong>Source verification date:</strong> {ref.sourceVerificationDate}</span>
                </div>
                <div style={{ color: 'var(--color-slate-700)', display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '0.35rem' }}>
                    <AlertTriangle size={14} style={{ color: 'var(--color-amber-600)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{isTe ? ref.disclaimer.te : ref.disclaimer.en}</span>
                </div>
            </div>

            <div className="table-responsive-wrapper">
                <table className="infra-ledger-table" aria-label="Published Clinical Services Schedule">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>{isTe ? "వారం" : "Day"}</th>
                            <th style={{ width: '18%' }}>{isTe ? "పనివేళలు" : "Published Hours"}</th>
                            <th style={{ width: '25%' }}>{isTe ? "క్లినిక్ / సేవ" : "Clinical Service"}</th>
                            <th style={{ width: '25%' }}>{isTe ? "ముఖ్య ఉద్దేశం" : "Focus & Care Scope"}</th>
                            <th style={{ width: '17%' }}>{isTe ? "బాధ్యత గల సిబ్బంది" : "Cadre / Duty Staff"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ref.weeklyRoster.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                    {isTe ? item.day_te : item.day_en}
                                </td>
                                <td>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
                                        <Clock size={12} style={{ color: 'var(--color-slate-400)' }} />
                                        {isTe ? item.timing_te : item.timing_en}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--color-blue-900)' }}>
                                        {isTe ? item.clinic_te : item.clinic_en}
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', lineHeight: '1.45' }}>
                                    {isTe ? item.focus_te : item.focus_en}
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-700)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <UserCheck size={12} style={{ color: 'var(--color-emerald-600)' }} />
                                        {isTe ? item.staff_te : item.staff_en}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClinicalSchedule;
