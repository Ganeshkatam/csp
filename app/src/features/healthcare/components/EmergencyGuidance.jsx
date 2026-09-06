import React from 'react';
import { PhoneCall, AlertTriangle, Calendar, ShieldCheck, HeartPulse, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function EmergencyGuidance({ announcements = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTe = currentLang === 'te';

    const emergencyHotlines = [
        {
            number: '108',
            title: isTe ? '108 అత్యవసర అంబులెన్స్' : '108 Emergency Ambulance',
            role: isTe ? 'తీవ్రమైన ప్రమాదాలు, గుండె సమస్యలు, ప్రసవ అత్యవసర సేవలు (24 గంటలు ఉచితం)' : 'Critical trauma, acute cardiac episodes, obstetric emergencies (24x7 Toll-Free)',
            badge: isTe ? '24 గంటలు' : '24x7 Toll-Free',
            color: 'var(--color-red-600)',
            borderColor: '#fca5a5',
            badgeBg: 'var(--color-red-50)',
            badgeColor: 'var(--color-red-800)',
            badgeBorder: '#fecdd3'
        },
        {
            number: '104',
            title: isTe ? '104 వైద్య సలహా & డాక్టర్ హెల్ప్‌లైన్' : '104 Medical Advisory Hotline',
            role: isTe ? 'డాక్టర్ సంప్రదింపులు, మందుల సమాచారం, రక్తనిధి వివరాలు & ప్రాథమిక చికిత్స' : 'Doctor tele-consultations, drug info, blood bank availability, triage counseling',
            badge: isTe ? 'వైద్య సలహా' : 'Tele-Doctor',
            color: '#2563eb',
            borderColor: '#93c5fd',
            badgeBg: '#eff6ff',
            badgeColor: '#1e40af',
            badgeBorder: '#bfdbfe'
        },
        {
            number: '102',
            title: isTe ? '102 జనని శిశు సురక్ష రవాణా' : '102 Maternal & Infant Transport',
            role: isTe ? 'గర్భిణులు మరియు శిశువులను ఆసుపత్రికి చేర్చే ఉచిత ప్రభుత్వ వాహన సేవ' : 'Janani Shishu Suraksha Karyakram dedicated maternal & infant ambulance service',
            badge: isTe ? 'మాతా శిశు' : 'Maternal Transport',
            color: '#059669',
            borderColor: '#6ee7b7',
            badgeBg: '#ecfdf5',
            badgeColor: '#065f46',
            badgeBorder: '#a7f3d0'
        },
        {
            number: '112',
            title: isTe ? '112 జాతీయ అత్యవసర సహాయ సంఖ్య' : '112 All-India Emergency Number',
            role: isTe ? 'పోలీస్, అగ్నిమాపక మరియు వైద్య అత్యవసర సేవల కోసం ఉమ్మడి హెల్ప్‌లైన్' : 'Unified emergency response support system (ERSS) connecting police, fire, and medical teams (Toll-Free)',
            badge: isTe ? 'ఉమ్మడి హెల్ప్‌లైన్' : 'Unified ERSS',
            color: '#d97706',
            borderColor: '#fcd34d',
            badgeBg: '#fffbeb',
            badgeColor: '#92400e',
            badgeBorder: '#fde68a'
        }
    ];

    return (
        <section aria-labelledby="emergency-guidance-heading">
            {/* 24x7 Emergency Command Deck */}
            <div className="emergency-command-deck">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                            <span className="badge" style={{ background: 'var(--color-red-600)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.04em' }}>
                                {isTe ? "24x7 ఎమర్జెన్సీ కమాండ్" : "24x7 Emergency Command"}
                            </span>
                            <span className="badge badge-verified" style={{ background: 'rgba(255, 255, 255, 0.95)', color: 'var(--color-red-800)', border: '1px solid #fecdd3' }}>
                                <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                                {isTe ? "అధికారిక హెల్ప్‌లైన్లు" : "Statutory Lines"}
                            </span>
                        </div>
                        <h2 id="emergency-guidance-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: 0 }}>
                            {isTe ? "అత్యవసర ప్రోటోకాల్ & హెల్ప్‌లైన్లు" : "Emergency Hotlines & Health Advisories"}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                            {isTe ? "ఆంధ్రప్రదేశ్ ప్రభుత్వం ఆమోదించిన 24 గంటల హెల్ప్‌లైన్లు మరియు పీహెచ్‌సీ నోటీసులు." : "Government of Andhra Pradesh statutory 24x7 response hotlines and live circulars."}
                        </p>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-600)', background: '#ffffff', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full, 9999px)', border: '1px solid #fecdd3', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        {isTe ? "ఆంధ్రప్రదేశ్ ఆరోగ్య కుటుంబ సంక్షేమ శాఖ" : "AP Health & Family Welfare Department"}
                    </div>
                </div>

                {/* Emergency Action Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: announcements && announcements.length > 0 ? '1.5rem' : 0 }}>
                    {emergencyHotlines.map((item, idx) => (
                        <a
                            key={idx}
                            href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                            className="emergency-action-card"
                            style={{
                                '--card-accent': item.color,
                                '--card-hover-border': item.borderColor
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: item.color, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <PhoneCall size={18} style={{ color: item.color }} />
                                        {item.number}
                                    </span>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full, 9999px)', background: item.badgeBg, color: item.badgeColor, border: `1px solid ${item.badgeBorder}` }}>
                                        {item.badge}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 800, color: 'var(--color-slate-950)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>
                                    {item.title}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)', lineHeight: '1.4' }}>
                                    {item.role}
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--color-slate-100)', fontSize: '0.78rem', fontWeight: 700, color: item.color }}>
                                <span>{isTe ? "వెంటనే డయల్ చేయండి" : "Tap to Call"}</span>
                                <span>→</span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Live Health Notices / Advisories from Database inside Command Deck */}
                {announcements && announcements.length > 0 && (
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid var(--color-slate-200)',
                        borderRadius: 'var(--radius-lg, 12px)',
                        padding: '1.25rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <HeartPulse size={18} style={{ color: 'var(--color-blue-600)' }} />
                            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0 }}>
                                {isTe ? "పీహెచ్‌సీ ద్వారా ప్రస్తుత ఆరోగ్య హెచ్చరికలు & గ్రామీణ శిబిరాలు" : "Current Health Advisories & Village Camps from Database"}
                            </h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {announcements.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        border: '1px solid var(--color-slate-200)',
                                        borderLeft: '4px solid var(--color-blue-600)',
                                        borderRadius: 'var(--radius-md, 8px)',
                                        padding: '0.875rem 1rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0 }}>
                                            {isTe && item.title_te ? item.title_te : item.title}
                                        </h4>
                                        {item.event_date && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-600)' }}>
                                                <Calendar size={13} style={{ color: 'var(--color-blue-600)' }} />
                                                {item.event_date}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-700)', margin: '0 0 0.5rem 0', lineHeight: 1.45 }}>
                                        {isTe && item.description_te ? item.description_te : item.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--color-slate-500)' }}>
                                        <span><strong>{isTe ? "మూలం: " : "Source: "}</strong>{item.source || 'Primary Health Centre'}</span>
                                        <span style={{ color: 'var(--color-emerald-700)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={12} />
                                            {isTe ? 'ధృవీకరించబడింది' : 'Verified'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default EmergencyGuidance;
