import React from 'react';
import { Syringe, Calendar, Clock, MapPin, Users, CheckCircle, ShieldCheck, Baby } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function ImmunizationSchedule({ immunizations = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTelugu = currentLang === 'te';

    if (loading) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
                    {isTelugu ? 'టీకా షెడ్యూల్ సమాచారం లోడ్ అవుతోంది...' : 'Loading verified immunization schedule from database...'}
                </div>
            </div>
        );
    }

    if (!immunizations || immunizations.length === 0) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <Baby size={32} style={{ color: 'var(--color-slate-400)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.25rem' }}>
                    {isTelugu ? 'ప్రస్తుత టీకా షెడ్యూల్ అందుబాటులో లేదు' : 'No Active Immunization Drives Published'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                    {isTelugu ? 'ఐసీడీఎస్ / పీహెచ్‌సీ ద్వారా సెషన్లు నవీకరించబడినప్పుడు ఇక్కడ కనిపిస్తాయి.' : 'Immunization schedules will appear here once updated in the village database.'}
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="immunization-schedule-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <span className="healthcare-badge healthcare-badge-blue" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                        <ShieldCheck size={13} style={{ marginRight: '0.375rem' }} />
                        {isTelugu ? 'యూనివర్సల్ ఇమ్యునైజేషన్ ప్రోగ్రామ్ (UIP)' : 'Universal Immunization Programme (UIP)'}
                    </span>
                    <h2 id="immunization-schedule-heading" style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '0.25rem 0' }}>
                        {isTelugu ? 'మాతా శిశు సంరక్షణ & టీకా షెడ్యూల్' : 'Maternal & Child Immunization Schedule'}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTelugu ? 'మోదవలస అంగన్‌వాడీ కేంద్రం మరియు పీహెచ్‌సీలో జరిగే అధికారిక వ్యాక్సినేషన్ సెషన్లు.' : 'Official vaccination sessions conducted at Modavalasa Anganwadi Centre and Denkada PHC.'}
                    </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-50)', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-200)' }}>
                    {isTelugu ? 'మూలం: ఐసీడీఎస్ డెంకాడ / డీఎంహెచ్ఓ విజయనగరం' : 'Source: ICDS Denkada & DMHO Vizianagaram'}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {immunizations.map((item) => {
                    const vaccineList = item.vaccines_administered ? item.vaccines_administered.split(',').map(v => v.trim()) : [];

                    return (
                        <article
                            key={item.id}
                            className="healthcare-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderTop: '3px solid var(--color-emerald-600)',
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
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: 'var(--color-emerald-700)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Syringe size={18} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>
                                                {isTelugu && item.session_name_te ? item.session_name_te : item.session_name}
                                            </h3>
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)' }}>
                                                {isTelugu && item.frequency_or_date_te ? item.frequency_or_date_te : item.frequency_or_date}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="healthcare-badge healthcare-badge-green" style={{ fontSize: '0.6875rem' }}>
                                        {isTelugu ? 'ఉచిత సేవ' : 'Free / NHM'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                        <Clock size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                        <span>
                                            <strong>{isTelugu ? 'సమయం:' : 'Timings:'}</strong> {isTelugu && item.timings_te ? item.timings_te : item.timings}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                        <MapPin size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                        <span>
                                            <strong>{isTelugu ? 'వేదిక:' : 'Venue:'}</strong> {isTelugu && item.venue_te ? item.venue_te : item.venue}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                        <Users size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                        <span>
                                            <strong>{isTelugu ? 'లబ్ధిదారులు:' : 'Target:'}</strong> {isTelugu && item.target_cohort_te ? item.target_cohort_te : item.target_cohort}
                                        </span>
                                    </div>
                                </div>

                                {vaccineList.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '0.375rem' }}>
                                            {isTelugu ? 'అందించే టీకాలు & సప్లిమెంట్లు:' : 'Vaccines Administered:'}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                            {vaccineList.map((vac, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        fontSize: '0.6875rem',
                                                        padding: '0.25rem 0.5rem',
                                                        background: 'var(--color-emerald-50)',
                                                        color: 'var(--color-emerald-800)',
                                                        border: '1px solid var(--color-emerald-200)',
                                                        borderRadius: '4px',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {vac}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.supervising_worker && (
                                    <div style={{
                                        background: 'var(--color-slate-50)',
                                        borderRadius: '6px',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-slate-600)',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <strong>{isTelugu ? 'పర్యవేక్షణ: ' : 'Supervising Staff: '}</strong>
                                        {isTelugu && item.supervising_worker_te ? item.supervising_worker_te : item.supervising_worker}
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
                                <span>{isTelugu ? 'యూఐపీ మార్గదర్శకాలు' : 'Universal Immunization Guidelines'}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-emerald-700)' }}>
                                    <CheckCircle size={11} />
                                    {isTelugu ? 'ధృవీకరించబడింది' : 'Verified'}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default ImmunizationSchedule;
