import React from 'react';
import { Stethoscope, Clock, Calendar, MapPin, CheckCircle, ShieldCheck, Activity } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function ClinicalSchedule({ schedules = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTelugu = currentLang === 'te';

    if (loading) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
                    {isTelugu ? 'క్లినికల్ రోస్టర్ సమాచారం లోడ్ అవుతోంది...' : 'Loading verified doctor consultation roster from database...'}
                </div>
            </div>
        );
    }

    if (!schedules || schedules.length === 0) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <Activity size={32} style={{ color: 'var(--color-slate-400)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.25rem' }}>
                    {isTelugu ? 'ప్రస్తుత రోస్టర్ సమాచారం అందుబాటులో లేదు' : 'No Active Clinical Rosters Published'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                    {isTelugu ? 'డెంకాడ పీహెచ్‌సీ ద్వారా రోస్టర్ నవీకరించబడినప్పుడు ఇక్కడ కనిపిస్తుంది.' : 'Clinical schedules will appear here once updated in the village database.'}
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="clinical-schedule-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <span className="healthcare-badge healthcare-badge-blue" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                        <ShieldCheck size={13} style={{ marginRight: '0.375rem' }} />
                        {isTelugu ? 'ప్రత్యక్ష డాక్టర్ డ్యూటీ రోస్టర్' : 'Live Doctor Consultation Roster'}
                    </span>
                    <h2 id="clinical-schedule-heading" style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '0.25rem 0' }}>
                        {isTelugu ? 'డెంకాడ పీహెచ్‌సీ ఓపీడీ సంప్రదింపుల సమయాలు' : 'PHC Outpatient Department (OPD) Consultations'}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTelugu ? 'మోదవలస ప్రజల కోసం డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం వైద్యుల డ్యూటీ వివరాలు.' : 'Official duty roster for medical officers and clinical staff at Denkada Primary Health Centre.'}
                    </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-50)', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-200)' }}>
                    {isTelugu ? 'మూలం: డెంకాడ పీహెచ్‌సీ / డీఎంహెచ్ఓ విజయనగరం' : 'Source: DMHO Vizianagaram / Denkada PHC Roster'}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {schedules.map((item) => (
                    <article
                        key={item.id}
                        className="healthcare-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderTop: '3px solid var(--color-blue-600)',
                            position: 'relative'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        background: 'rgba(37, 99, 235, 0.1)',
                                        color: 'var(--color-blue-700)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Stethoscope size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>
                                            {isTelugu && item.doctor_role_te ? item.doctor_role_te : item.doctor_role}
                                        </h3>
                                        {item.doctor_name && (
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)' }}>
                                                {item.doctor_name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="healthcare-badge healthcare-badge-green" style={{ fontSize: '0.6875rem' }}>
                                    {isTelugu ? 'యాక్టివ్' : 'Active'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                    <Calendar size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                    <span>
                                        <strong>{isTelugu ? 'పనిదినాలు:' : 'Days:'}</strong> {isTelugu && item.days_active_te ? item.days_active_te : item.days_active}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                    <Clock size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                    <span>
                                        <strong>{isTelugu ? 'సమయం:' : 'Hours:'}</strong> {isTelugu && item.timings_te ? item.timings_te : item.timings}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                    <MapPin size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
                                    <span>
                                        <strong>{isTelugu ? 'గది / విభాగం:' : 'Room:'}</strong> {isTelugu && item.room_or_desk_te ? item.room_or_desk_te : item.room_or_desk}
                                    </span>
                                </div>
                            </div>

                            {(item.services_offered || item.services_offered_te) && (
                                <div style={{
                                    background: 'var(--color-slate-50)',
                                    borderRadius: '6px',
                                    padding: '0.625rem 0.75rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-slate-600)',
                                    marginBottom: '0.75rem',
                                    lineHeight: 1.4
                                }}>
                                    <strong>{isTelugu ? 'అందించే సేవలు: ' : 'Services: '}</strong>
                                    {isTelugu && item.services_offered_te ? item.services_offered_te : item.services_offered}
                                </div>
                            )}
                        </div>

                        <div style={{
                            paddingTop: '0.625rem',
                            borderTop: '1px solid var(--color-slate-100)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.6875rem',
                            color: 'var(--color-slate-400)'
                        }}>
                            <span>{item.facility_name}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-emerald-700)' }}>
                                <CheckCircle size={11} />
                                {isTelugu ? 'ధృవీకరించబడింది' : 'Verified'}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ClinicalSchedule;
