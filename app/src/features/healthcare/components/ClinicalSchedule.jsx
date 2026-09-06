import React from 'react';
import { Calendar, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import { CLINICAL_SCHEDULE_REFERENCE } from '../data/clinicalScheduleData';

export function ClinicalSchedule({ lang = 'en' }) {
    const isTe = lang === 'te';
    const ref = CLINICAL_SCHEDULE_REFERENCE;

    const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNamesEn[new Date().getDay()];

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

            <div className="table-responsive-wrapper" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-slate-200)', boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.04)', overflow: 'hidden' }}>
                <table className="infra-ledger-table" aria-label="Published Clinical Services Schedule">
                    <thead>
                        <tr>
                            <th style={{ width: '18%' }}>{isTe ? "వారం" : "Day"}</th>
                            <th style={{ width: '18%' }}>{isTe ? "పనివేళలు" : "Published Hours"}</th>
                            <th style={{ width: '25%' }}>{isTe ? "క్లినిక్ / సేవ" : "Clinical Service"}</th>
                            <th style={{ width: '24%' }}>{isTe ? "ముఖ్య ఉద్దేశం" : "Focus & Care Scope"}</th>
                            <th style={{ width: '15%' }}>{isTe ? "బాధ్యత గల సిబ్బంది" : "Cadre / Duty Staff"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ref.weeklyRoster.map((item, idx) => {
                            const isToday = item.day_en.toLowerCase() === todayName.toLowerCase();
                            const isWednesday = item.day_en === 'Wednesday';
                            const isSunday = item.day_en === 'Sunday';

                            return (
                                <tr key={idx} className={isToday ? "opd-today-row" : ""}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 800, color: isToday ? 'var(--color-blue-700)' : 'var(--color-slate-950)' }}>
                                                {isTe ? item.day_te : item.day_en}
                                            </span>
                                            {isToday && (
                                                <span className="opd-today-badge">
                                                    {isTe ? "ఈరోజు" : "Today"}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: isSunday ? 'var(--color-red-700)' : 'var(--color-slate-700)', background: isSunday ? 'var(--color-red-50)' : 'var(--color-slate-100)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                            <Clock size={12} style={{ color: isSunday ? 'var(--color-red-600)' : 'var(--color-slate-500)' }} />
                                            {isTe ? item.timing_te : item.timing_en}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: isSunday ? 'var(--color-red-800)' : isWednesday ? 'var(--color-emerald-800)' : 'var(--color-blue-900)' }}>
                                            {isTe ? item.clinic_te : item.clinic_en}
                                        </div>
                                        {isWednesday && (
                                            <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-emerald-700)', background: 'var(--color-emerald-50)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-emerald-200)' }}>
                                                {isTe ? "జాతీయ సాధారణ టీకాల దినం" : "Universal Immunization Day"}
                                            </span>
                                        )}
                                        {isSunday && (
                                            <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-red-700)', background: 'var(--color-red-50)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-red-200)' }}>
                                                {isTe ? "24x7 ఆన్-కాల్ ఎమర్జెన్సీ మాత్రమే" : "24x7 On-Call Emergency Only"}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', lineHeight: '1.45' }}>
                                        {isTe ? item.focus_te : item.focus_en}
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-800)', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--color-slate-50)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-slate-200)' }}>
                                            <UserCheck size={12} style={{ color: 'var(--color-emerald-600)' }} />
                                            {isTe ? item.staff_te : item.staff_en}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClinicalSchedule;
