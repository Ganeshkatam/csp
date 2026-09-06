import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, ShieldCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';

export function HealthcareSchemes({ schemes = [], lang = 'en' }) {
    const isTe = lang === 'te';

    if (!schemes || schemes.length === 0) return null;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={20} style={{ color: 'var(--color-blue-600)' }} />
                        {isTe ? "ప్రభుత్వ ఆరోగ్య సంక్షేమ పథకాలు" : "Government Healthcare Welfare Schemes"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "మోదవలస గ్రామ ప్రజల కోసం డా. ఎన్టీఆర్ వైద్య సేవ (ఆరోగ్యశ్రీ) నగదు రహిత చికిత్స ప్రయోజనాలు మరియు అర్హత వివరాలు."
                            : "Flagship cashless healthcare programs providing free secondary and tertiary hospital treatment for eligible families."
                        }
                    </p>
                </div>
                <div>
                    <Link to="/schemes/category/healthcare" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        {isTe ? "అన్ని ఆరోగ్య పథకాలు చూడండి" : "View Healthcare Schemes"}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span><strong>Source:</strong> Dr. NTR Vaidya Seva Trust, Government of Andhra Pradesh (.gov.in)</span>
                    <span><strong>Verified:</strong> 2026-09-06</span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>Note:</strong> {isTe 
                        ? "తెల్ల రేషన్ కార్డు (రైస్ కార్డు) ఉన్న ప్రతి కుటుంబం నెట్‌వర్క్ ఆసుపత్రులలో ఆరోగ్య మిత్ర వద్ద ఉచితంగా నగదు రహిత చికిత్స పొందవచ్చు."
                        : "Eligible BPL Rice Card holders receive 100% cashless hospitalization across all empanelled network hospitals through dedicated Aarogya Mithra desks."
                    }
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {schemes.map(s => {
                    const title = isTe ? (s.name_te || s.name) : s.name;
                    const desc = isTe ? (s.description_te || s.description) : s.description;
                    const elig = isTe ? (s.eligibility_te || s.eligibility) : s.eligibility;
                    const benefits = s.benefits || '';

                    return (
                        <div 
                            key={s.id} 
                            style={{ 
                                background: '#ffffff', 
                                border: '1px solid var(--color-slate-200)', 
                                borderRadius: 'var(--radius-xl, 16px)', 
                                padding: '1.5rem', 
                                boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)',
                                borderLeft: '5px solid var(--color-blue-600)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                                        <span className="badge badge-verified">
                                            <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                                            {isTe ? "రాష్ట్ర స్థాయి అధికారిక పథకం" : "State Government Flagship"}
                                        </span>
                                        <span className="badge badge-civic" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-200)' }}>
                                            {isTe ? "రూ. 25 లక్షల వరకు ఉచితం" : "Coverage up to Rs. 25 Lakhs"}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.4rem', lineHeight: '1.25' }}>
                                        {title}
                                    </h3>
                                </div>

                                {s.official_url && (
                                    <a 
                                        href={s.official_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-secondary btn-sm"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
                                    >
                                        <span>{isTe ? "అధికారిక పోర్టల్" : "Official Portal"}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                )}
                            </div>

                            <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-700)', lineHeight: '1.55', marginBottom: '1.15rem' }}>
                                {desc}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: 'var(--color-slate-50)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)', marginBottom: '1.25rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>
                                        {isTe ? "అర్హత ప్రమాణాలు:" : "Eligibility Criteria:"}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-800)', lineHeight: '1.45', fontWeight: 500 }}>
                                        {elig}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>
                                        {isTe ? "ప్రయోజనాలు & కవరేజ్:" : "Core Benefits:"}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-slate-800)', lineHeight: '1.45', fontWeight: 500 }}>
                                        {benefits || (isTe ? "3,257 శస్త్రచికిత్సలు, పరీక్షలు మరియు మందులు ఉచితం." : "Full coverage for 3,257 secondary and tertiary procedures, tests, and post-discharge medicines.")}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-100)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                    <strong>{isTe ? "దరఖాస్తు విధానం: " : "Application: "}</strong>
                                    {isTe ? "నెట్‌వర్క్ ఆసుపత్రిలోని ఆరోగ్య మిత్ర కౌంటర్ వద్ద రేషన్ కార్డు సమర్పించండి." : "Approach Aarogya Mithra counter at any empanelled hospital with Rice Card."}
                                </div>

                                <Link 
                                    to="/schemes" 
                                    className="btn btn-primary btn-sm"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <span>{isTe ? "మరిన్ని వివరాలు చూడండి" : "View Scheme Details"}</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HealthcareSchemes;
