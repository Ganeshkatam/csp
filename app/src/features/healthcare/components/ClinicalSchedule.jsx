import React, { useState } from 'react';
import { Stethoscope, Clock, Calendar, MapPin, CheckCircle, ShieldCheck, Activity, LayoutGrid, Table, UserCheck } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function ClinicalSchedule({ schedules = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTe = currentLang === 'te';
    const [viewMode, setViewMode] = useState('cards');

    const todayIndex = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[todayIndex];

    if (loading) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
                    {isTe ? 'క్లినికల్ రోస్టర్ సమాచారం లోడ్ అవుతోంది...' : 'Loading verified doctor consultation roster from database...'}
                </div>
            </div>
        );
    }

    if (!schedules || schedules.length === 0) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <Activity size={32} style={{ color: 'var(--color-slate-400)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.25rem' }}>
                    {isTe ? 'ప్రస్తుత రోస్టర్ సమాచారం అందుబాటులో లేదు' : 'No Active Clinical Rosters Published'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                    {isTe ? 'డెంకాడ పీహెచ్‌సీ ద్వారా రోస్టర్ నవీకరించబడినప్పుడు ఇక్కడ కనిపిస్తుంది.' : 'Clinical schedules will appear here once updated in the village database.'}
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="clinical-schedule-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                        <span className="badge badge-verified" style={{ background: 'var(--color-blue-50)', color: 'var(--color-blue-800)', border: '1px solid var(--color-blue-200)' }}>
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} />
                            {isTe ? "ప్రత్యక్ష డాక్టర్ డ్యూటీ రోస్టర్" : "Live Doctor Consultation Roster"}
                        </span>
                        <span className="badge-level-a">
                            Level A: Local Verified Record
                        </span>
                    </div>
                    <h2 id="clinical-schedule-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: '0.25rem 0' }}>
                        {isTe ? "డెంకాడ పీహెచ్‌సీ ఓపీడీ సంప్రదింపుల సమయాలు" : "PHC Outpatient Department (OPD) Consultations"}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTe ? "మోదవలస ప్రజల కోసం డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం వైద్యుల అధికారిక డ్యూటీ వివరాలు." : "Official duty roster for medical officers and clinical staff at Denkada Primary Health Centre."}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {schedules.map((item) => (
                        <div
                            key={item.id}
                            className="diagnostic-card-elevated"
                            style={{
                                borderTop: '3px solid var(--color-blue-600)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: 'var(--radius-md, 8px)',
                                            background: 'rgba(37, 99, 235, 0.1)',
                                            color: 'var(--color-blue-700)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Stethoscope size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: 0, lineHeight: 1.25 }}>
                                                {isTe && item.doctor_role_te ? item.doctor_role_te : item.doctor_role}
                                            </h3>
                                            {item.doctor_name && (
                                                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)', fontWeight: 500 }}>
                                                    {item.doctor_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: 'var(--radius-full, 9999px)',
                                        background: 'var(--color-emerald-50)',
                                        color: 'var(--color-emerald-800)',
                                        border: '1px solid var(--color-emerald-200)'
                                    }}>
                                        {isTe ? 'యాక్టివ్' : 'Active'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                        <Calendar size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                        <span><strong>{isTe ? "పనిదినాలు:" : "Days:"}</strong> {isTe && item.days_active_te ? item.days_active_te : item.days_active}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                        <Clock size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                        <span><strong>{isTe ? "సమయం:" : "Hours:"}</strong> {isTe && item.timings_te ? item.timings_te : item.timings}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                        <MapPin size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                        <span><strong>{isTe ? "గది / విభాగం:" : "Room:"}</strong> {isTe && item.room_or_desk_te ? item.room_or_desk_te : item.room_or_desk}</span>
                                    </div>
                                </div>

                                {(item.services_offered || item.services_offered_te) && (
                                    <div style={{
                                        background: 'var(--color-slate-50)',
                                        borderRadius: 'var(--radius-md, 8px)',
                                        padding: '0.65rem 0.85rem',
                                        fontSize: '0.78rem',
                                        color: 'var(--color-slate-600)',
                                        marginBottom: '0.75rem',
                                        lineHeight: 1.45,
                                        border: '1px solid var(--color-slate-200)'
                                    }}>
                                        <strong>{isTe ? 'అందించే సేవలు: ' : 'Services: '}</strong>
                                        {isTe && item.services_offered_te ? item.services_offered_te : item.services_offered}
                                    </div>
                                )}
                            </div>

                            <div style={{
                                paddingTop: '0.65rem',
                                borderTop: '1px solid var(--color-slate-100)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.72rem',
                                color: 'var(--color-slate-500)'
                            }}>
                                <span>{item.facility_name}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-emerald-700)', fontWeight: 700 }}>
                                    <CheckCircle size={12} />
                                    {isTe ? 'ధృవీకరించబడింది' : 'Verified'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="table-responsive-wrapper" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--color-slate-200)', boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.04)', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <table className="infra-ledger-table" aria-label="Published Clinical Services Schedule">
                        <thead>
                            <tr>
                                <th style={{ width: '22%' }}>{isTe ? "వైద్య విభాగం" : "Doctor Role / Specialization"}</th>
                                <th style={{ width: '20%' }}>{isTe ? "పనిదినాలు" : "Active Days"}</th>
                                <th style={{ width: '18%' }}>{isTe ? "పనివేళలు" : "Consultation Timings"}</th>
                                <th style={{ width: '22%' }}>{isTe ? "గది / విభాగం" : "Room / Desk"}</th>
                                <th style={{ width: '18%' }}>{isTe ? "సేవలు" : "Services Offered"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                        <div>{isTe && item.doctor_role_te ? item.doctor_role_te : item.doctor_role}</div>
                                        {item.doctor_name && (
                                            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-slate-500)' }}>
                                                {item.doctor_name}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600, color: 'var(--color-slate-800)' }}>
                                            {isTe && item.days_active_te ? item.days_active_te : item.days_active}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-slate-700)', background: 'var(--color-slate-100)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                            <Clock size={12} style={{ color: 'var(--color-blue-600)' }} />
                                            {isTe && item.timings_te ? item.timings_te : item.timings}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate-700)' }}>
                                        {isTe && item.room_or_desk_te ? item.room_or_desk_te : item.room_or_desk}
                                    </td>
                                    <td style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)', lineHeight: '1.4' }}>
                                        {isTe && item.services_offered_te ? item.services_offered_te : item.services_offered}
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

export default ClinicalSchedule;
