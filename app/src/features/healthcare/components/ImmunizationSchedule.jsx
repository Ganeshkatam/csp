import React, { useState } from 'react';
import { Syringe, Calendar, Clock, MapPin, Users, CheckCircle, ShieldCheck, Baby, LayoutGrid, Table, CheckCircle2, Info } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function ImmunizationSchedule({ immunizations = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTe = currentLang === 'te';
    const [viewMode, setViewMode] = useState('cards');

    if (loading) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
                    {isTe ? 'టీకా షెడ్యూల్ సమాచారం లోడ్ అవుతోంది...' : 'Loading verified immunization schedule from database...'}
                </div>
            </div>
        );
    }

    if (!immunizations || immunizations.length === 0) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <Baby size={32} style={{ color: 'var(--color-slate-400)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.25rem' }}>
                    {isTe ? 'ప్రస్తుత టీకా షెడ్యూల్ అందుబాటులో లేదు' : 'No Active Immunization Drives Published'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                    {isTe ? 'ఐసీడీఎస్ / పీహెచ్‌సీ ద్వారా సెషన్లు నవీకరించబడినప్పుడు ఇక్కడ కనిపిస్తాయి.' : 'Immunization schedules will appear here once updated in the village database.'}
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="immunization-schedule-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                        <span className="badge badge-verified" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-300)' }}>
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} />
                            {isTe ? "యూనివర్సల్ ఇమ్యునైజేషన్ ప్రోగ్రామ్ (UIP)" : "Universal Immunization Programme (UIP)"}
                        </span>
                        <span className="badge-level-a">
                            Level A: Local Verified Record
                        </span>
                    </div>
                    <h2 id="immunization-schedule-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: '0.25rem 0' }}>
                        {isTe ? "మాతా శిశు సంరక్షణ & టీకా షెడ్యూల్" : "Maternal & Child Immunization Schedule"}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTe ? "మోదవలస అంగన్‌వాడీ కేంద్రం మరియు డెంకాడ పీహెచ్‌సీలో జరిగే అధికారిక వ్యాక్సినేషన్ సెషన్లు." : "Official vaccination sessions conducted at Modavalasa Anganwadi Centre and Denkada PHC."}
                    </p>
                </div>

                {/* View Switcher */}
                <div style={{ display: 'flex', gap: '4px', background: 'var(--color-slate-100)', padding: '3px', borderRadius: 'var(--radius-md, 8px)' }}>
                    <button
                        type="button"
                        onClick={() => setViewMode('cards')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '0.35rem 0.75rem',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: viewMode === 'cards' ? '#ffffff' : 'transparent',
                            color: viewMode === 'cards' ? 'var(--color-slate-900)' : 'var(--color-slate-600)',
                            boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <LayoutGrid size={14} />
                        {isTe ? "కార్డులు" : "Cards"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '0.35rem 0.75rem',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: viewMode === 'table' ? '#ffffff' : 'transparent',
                            color: viewMode === 'table' ? 'var(--color-slate-900)' : 'var(--color-slate-600)',
                            boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Table size={14} />
                        {isTe ? "పట్టిక" : "Table"}
                    </button>
                </div>
            </div>

            {/* Cards View */}
            {viewMode === 'cards' && (
                <div className="milestone-card-grid">
                    {immunizations.map((item) => {
                        const vaccineList = item.vaccines_administered ? item.vaccines_administered.split(',').map(v => v.trim()) : [];

                        return (
                            <div key={item.id} className="milestone-card">
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full, 9999px)', background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-200)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                            {isTe ? "ఉచిత జాతీయ కార్యక్రమం" : "Free UIP Drive"}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={13} style={{ color: 'var(--color-slate-400)' }} />
                                            {isTe && item.timings_te ? item.timings_te : item.timings}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.5rem', lineHeight: '1.3' }}>
                                        {isTe && item.session_name_te ? item.session_name_te : item.session_name}
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                            <Calendar size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                            <span><strong>{isTe ? "షెడ్యూల్:" : "Schedule:"}</strong> {isTe && item.frequency_or_date_te ? item.frequency_or_date_te : item.frequency_or_date}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                            <MapPin size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                            <span><strong>{isTe ? "వేదిక:" : "Venue:"}</strong> {isTe && item.venue_te ? item.venue_te : item.venue}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                            <Users size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                            <span><strong>{isTe ? "లబ్ధిదారులు:" : "Target:"}</strong> {isTe && item.target_cohort_te ? item.target_cohort_te : item.target_cohort}</span>
                                        </div>
                                    </div>

                                    {vaccineList.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.4rem' }}>
                                                {isTe ? "అందించే టీకాలు & సప్లిమెంట్లు:" : "Prescribed Vaccines & Supplements:"}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                {vaccineList.map((v, vIdx) => (
                                                    <span key={vIdx} className="vaccine-chip">
                                                        <CheckCircle2 size={12} style={{ color: 'var(--color-emerald-700)' }} />
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {item.supervising_worker && (
                                        <div style={{ marginBottom: '1rem', background: 'var(--color-slate-50)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md, 8px)', border: '1px solid var(--color-slate-200)', fontSize: '0.78rem', color: 'var(--color-slate-700)' }}>
                                            <strong>{isTe ? "పర్యవేక్షణ సిబ్బంది: " : "Supervising Staff: "}</strong>
                                            {isTe && item.supervising_worker_te ? item.supervising_worker_te : item.supervising_worker}
                                        </div>
                                    )}
                                </div>

                                <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--color-slate-100)', fontSize: '0.72rem', color: 'var(--color-slate-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{item.source || 'DMHO Vizianagaram UIP Schedule'}</span>
                                    <span style={{ color: 'var(--color-emerald-700)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle size={12} />
                                        {isTe ? "ధృవీకరించబడింది" : "Verified"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="table-responsive-wrapper" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--color-slate-200)', boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.04)', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <table className="infra-ledger-table" aria-label="National Routine Immunization Schedule">
                        <thead>
                            <tr>
                                <th style={{ width: '22%' }}>{isTe ? "కార్యక్రమం" : "Session / Drive"}</th>
                                <th style={{ width: '18%' }}>{isTe ? "షెడ్యూల్ & సమయం" : "Schedule & Timings"}</th>
                                <th style={{ width: '22%' }}>{isTe ? "వేదిక" : "Venue"}</th>
                                <th style={{ width: '23%' }}>{isTe ? "టీకాలు" : "Vaccines Administered"}</th>
                                <th style={{ width: '15%' }}>{isTe ? "లబ్ధిదారులు" : "Target Cohort"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {immunizations.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                        {isTe && item.session_name_te ? item.session_name_te : item.session_name}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--color-slate-900)', fontSize: '0.85rem' }}>
                                            {isTe && item.frequency_or_date_te ? item.frequency_or_date_te : item.frequency_or_date}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                            {isTe && item.timings_te ? item.timings_te : item.timings}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate-700)' }}>
                                        {isTe && item.venue_te ? item.venue_te : item.venue}
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: 'var(--color-emerald-900)', fontSize: '0.8125rem' }}>
                                            {item.vaccines_administered}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)' }}>
                                        {isTe && item.target_cohort_te ? item.target_cohort_te : item.target_cohort}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default ImmunizationSchedule;
