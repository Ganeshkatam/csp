import React from 'react';
import { Phone, Siren, ShieldCheck, AlertCircle, HeartHandshake } from 'lucide-react';
import { createTelLink } from '../../../utils/phone';

const OFFICIAL_AP_HELPLINES = [
    {
        number: '108',
        label_en: 'Emergency Ambulance Service',
        label_te: 'అత్యవసర అంబులెన్స్ సర్వీస్',
        scope_en: '24x7 Toll-Free Emergency Dispatch for acute trauma, labor, and critical hospital transit',
        scope_te: 'తీవ్రమైన గాయాలు, ప్రసవ వేదన మరియు అత్యవసర ఆసుపత్రి రవాణా కోసం 24x7 టోల్-ఫ్రీ సర్వీస్',
        category_en: 'Ambulance Dispatch',
        category_te: 'అత్యవసర అంబులెన్స్',
        accentColor: 'var(--color-red-600)',
        hoverBorder: 'var(--color-red-300)',
        badgeBg: 'var(--color-red-50)',
        badgeColor: 'var(--color-red-700)'
    },
    {
        number: '104',
        label_en: 'Government Health Advisory & Guidance',
        label_te: 'ప్రభుత్వ ఆరోగ్య సమాచార & సలహా కేంద్రం',
        scope_en: '24x7 Toll-Free Medical Advisory, doctor consultation, and government health programme guidance',
        scope_te: '24x7 ఉచిత వైద్య సలహా, నిపుణుల మార్గదర్శకత్వం మరియు ఆరోగ్య పథకాల సమాచారం',
        category_en: 'Health Advisory',
        category_te: 'వైద్య సలహాలు',
        accentColor: 'var(--color-blue-600)',
        hoverBorder: 'var(--color-blue-300)',
        badgeBg: 'var(--color-blue-50)',
        badgeColor: 'var(--color-blue-700)'
    },
    {
        number: '102',
        label_en: 'Free Mother & Infant Transport (JSSK)',
        label_te: 'ఉచిత గర్భిణీ & శిశు రవాణా సేవ (జేఎస్‌ఎస్‌కే)',
        scope_en: '24x7 Free transportation for pregnant mothers, institutional deliveries, and sick neonates',
        scope_te: 'ప్రభుత్వ ఆసుపత్రులలో ప్రసవాల కోసం గర్భిణులు మరియు నవజాత శిశువుల ఉచిత రవాణా',
        category_en: 'Maternal Transport',
        category_te: 'మాతృ రవాణా',
        accentColor: 'var(--color-emerald-600)',
        hoverBorder: 'var(--color-emerald-300)',
        badgeBg: 'var(--color-emerald-50)',
        badgeColor: 'var(--color-emerald-700)'
    }
];

export function EmergencyBanner({ lang = 'en' }) {
    const isTe = lang === 'te';

    return (
        <div className="emergency-command-deck">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Siren size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--color-slate-950)' }}>
                            {isTe ? "24x7 ప్రభుత్వ అత్యవసర హెల్ప్‌లైన్లు (టోల్-ఫ్రీ)" : "24x7 Government Emergency Helplines (Toll-Free)"}
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                            {isTe ? "ఆంధ్రప్రదేశ్ ప్రభుత్వ అధికారిక అత్యవసర వైద్య రవాణా & సమాచార నంబర్లు" : "Official Government of Andhra Pradesh emergency dispatch lines for acute trauma, ambulance, and medical advisories"}
                        </span>
                    </div>
                </div>
                <span className="badge-level-b" style={{ background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                    <ShieldCheck size={12} style={{ color: 'var(--color-emerald-600)' }} />
                    {isTe ? "ప్రభుత్వ ధృవీకరించిన నంబర్లు" : "Official Government Channels"}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem', marginBottom: '1.25rem' }}>
                {OFFICIAL_AP_HELPLINES.map(h => (
                    <a
                        key={h.number}
                        href={createTelLink(h.number)}
                        className="emergency-action-card"
                        style={{
                            '--card-accent': h.accentColor,
                            '--card-hover-border': h.hoverBorder
                        }}
                        title={`Call ${h.number}`}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: h.accentColor, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                    <Phone size={20} />
                                </div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: h.badgeBg, color: h.badgeColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                    {isTe ? h.category_te : h.category_en}
                                </span>
                            </div>

                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-slate-950)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                                {h.number}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.25rem' }}>
                                {isTe ? h.label_te : h.label_en}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)', lineHeight: '1.4', marginBottom: '1rem' }}>
                                {isTe ? h.scope_te : h.scope_en}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-100)', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: h.accentColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={13} />
                                {isTe ? "కాల్ చేయడానికి నొక్కండి" : "Tap to Call Instantly"}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-slate-400)' }}>
                                Toll-Free 24x7
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.15rem', fontSize: '0.8rem', color: 'var(--color-slate-800)', display: 'flex', alignItems: 'flex-start', gap: '10px', boxShadow: 'var(--shadow-sm)' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-amber-600)' }} />
                <div>
                    <strong style={{ color: 'var(--color-slate-950)' }}>
                        {isTe ? "108 అంబులెన్స్ పిలిచేటప్పుడు చెప్పవలసిన 3 ముఖ్యమైన వివరాలు: " : "When Calling 108 Emergency Ambulance (3 Critical Steps): "}
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-700)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                            <span style={{ fontSize: '0.75rem' }}>{isTe ? "రోగి స్పృహ, శ్వాస & తీవ్రత" : "Patient vitals & consciousness"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-700)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                            <span style={{ fontSize: '0.75rem' }}>{isTe ? "గ్రామ ల్యాండ్‌మార్క్ (ఉదా. సచివాలయం)" : "Exact village landmark (Secretariat)"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-red-100)', color: 'var(--color-red-700)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</span>
                            <span style={{ fontSize: '0.75rem' }}>{isTe ? "మీ ఫోన్ లైన్ తెరిచి ఉంచండి" : "Keep phone line open for driver"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmergencyBanner;
