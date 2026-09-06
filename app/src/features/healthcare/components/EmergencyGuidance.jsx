import React from 'react';
import { PhoneCall, AlertTriangle, Calendar, ShieldCheck, HeartPulse, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function EmergencyGuidance({ announcements = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTelugu = currentLang === 'te';

    const emergencyHotlines = [
        {
            number: '108',
            title: isTelugu ? '108 అత్యవసర అంబులెన్స్' : '108 Emergency Ambulance',
            role: isTelugu ? 'తీవ్రమైన ప్రమాదాలు, గుండె సమస్యలు, ప్రసవ అత్యవసర సేవలు (24 గంటలు ఉచితం)' : 'Critical trauma, acute cardiac episodes, obstetric emergencies (24x7 Toll-Free)',
            badge: isTelugu ? '24 గంటలు' : '24x7 Toll-Free'
        },
        {
            number: '104',
            title: isTelugu ? '104 వైద్య సలహా & డాక్టర్ హెల్ప్‌లైన్' : '104 Medical Advisory Hotline',
            role: isTelugu ? 'డాక్టర్ సంప్రదింపులు, మందుల సమాచారం, రక్తనిధి వివరాలు & ప్రాథమిక చికిత్స' : 'Doctor tele-consultations, drug info, blood bank availability, triage counseling',
            badge: isTelugu ? 'వైద్య సలహా' : 'Tele-Doctor'
        },
        {
            number: '102',
            title: isTelugu ? '102 జనని శిశు సురక్ష రవాణా' : '102 Maternal & Infant Transport',
            role: isTelugu ? 'గర్భిణులు మరియు శిశువులను ఆసుపత్రికి చేర్చే ఉచిత ప్రభుత్వ వాహన సేవ' : 'Janani Shishu Suraksha Karyakram dedicated maternal & infant ambulance service',
            badge: isTelugu ? 'మాతా శిశు' : 'Maternal Transport'
        },
        {
            number: '08922-246102',
            title: isTelugu ? 'డెంకాడ పీహెచ్‌సీ అత్యవసర డెస్క్' : 'Denkada PHC Medical Desk',
            role: isTelugu ? 'స్థానిక పీహెచ్‌సీ డ్యూటీ మెడికల్ ఆఫీసర్ & డెలివరీ వార్డు సహాయ కేంద్రం' : 'Local Primary Health Centre duty officer desk & delivery ward hotline',
            badge: isTelugu ? 'పీహెచ్‌సీ డెస్క్' : 'PHC Desk'
        }
    ];

    return (
        <section aria-labelledby="emergency-guidance-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <span className="healthcare-badge healthcare-badge-red" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                        <AlertTriangle size={13} style={{ marginRight: '0.375rem' }} />
                        {isTelugu ? 'అత్యవసర ప్రోటోకాల్ & సలహాలు' : 'Emergency Protocol & Health Advisories'}
                    </span>
                    <h2 id="emergency-guidance-heading" style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '0.25rem 0' }}>
                        {isTelugu ? 'అత్యవసర హెల్ప్‌లైన్లు & అధికారిక ఆరోగ్య సలహాలు' : 'Statutory Helplines & Live Health Advisories'}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTelugu ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం ఆమోదించిన 24 గంటల హెల్ప్‌లైన్లు మరియు పీహెచ్‌సీ నోటీసులు.' : 'Government of Andhra Pradesh statutory 24x7 response hotlines and live circulars.'}
                    </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-50)', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-200)' }}>
                    {isTelugu ? 'ఆంధ్రప్రదేశ్ ఆరోగ్య కుటుంబ సంక్షేమ శాఖ' : 'AP Health & Family Welfare Department'}
                </div>
            </div>

            {/* Emergency Hotline Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {emergencyHotlines.map((hotline, idx) => (
                    <article
                        key={idx}
                        className="healthcare-card"
                        style={{
                            borderLeft: '4px solid var(--color-red-600)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 800,
                                    color: 'var(--color-red-700)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {hotline.number}
                                </span>
                                <span className="healthcare-badge healthcare-badge-red" style={{ fontSize: '0.6875rem' }}>
                                    {hotline.badge}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-slate-900)', marginBottom: '0.25rem' }}>
                                {hotline.title}
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', margin: 0, lineHeight: 1.4 }}>
                                {hotline.role}
                            </p>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <a
                                href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: 'var(--color-red-50)',
                                    color: 'var(--color-red-700)',
                                    border: '1px solid var(--color-red-200)',
                                    borderRadius: '6px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <PhoneCall size={14} />
                                {isTelugu ? 'కాల్ చేయండి' : 'Call Now'}
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            {/* Live Health Notices / Advisories from Database */}
            {announcements && announcements.length > 0 && (
                <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-slate-200)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <HeartPulse size={18} style={{ color: 'var(--color-blue-600)' }} />
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0 }}>
                            {isTelugu ? 'పీహెచ్‌సీ ద్వారా ప్రస్తుత ఆరోగ్య హెచ్చరికలు & క్యాంపులు' : 'Current Health Advisories & Village Camps from Database'}
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {announcements.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--color-slate-50)',
                                    border: '1px solid var(--color-slate-200)',
                                    borderLeft: '3px solid var(--color-blue-600)',
                                    borderRadius: '6px',
                                    padding: '0.875rem 1rem'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>
                                        {isTelugu && item.title_te ? item.title_te : item.title}
                                    </h4>
                                    {item.event_date && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                            <Calendar size={12} />
                                            {item.event_date}
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-600)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                                    {isTelugu && item.description_te ? item.description_te : item.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem', color: 'var(--color-slate-400)' }}>
                                    <span>{item.source || 'Primary Health Centre'}</span>
                                    <span style={{ color: 'var(--color-emerald-700)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <CheckCircle size={11} />
                                        {isTelugu ? 'ధృవీకరించబడింది' : 'Verified'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default EmergencyGuidance;
