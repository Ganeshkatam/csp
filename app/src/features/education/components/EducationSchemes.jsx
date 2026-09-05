import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, BookOpen } from 'lucide-react';

export function EducationSchemes({ lang }) {
    const isTe = lang === 'te';

    const schemes = [
        {
            title: "Talliki Vandanam Scheme",
            titleTe: "తల్లికి వందనం పథకం",
            subtitle: "Annual financial assistance to eligible mothers ensuring school enrollment & minimum 75% attendance.",
            subtitleTe: "పాఠశాల నమోదు మరియు కనీసం 75% హాజరు ఉన్న అర్హులైన తల్లులకు వార్షిక ఆర్థిక సహాయం.",
            slug: "talliki-vandanam-scheme-(formerly-jagananna-amma-vodi)",
            tag: "School Attendance"
        },
        {
            title: "Post-Matric Fee Reimbursement (Vidya Deevena)",
            titleTe: "పోస్ట్-మెట్రిక్ ఫీజు రీయింబర్స్‌మెంట్ (విద్యా దీవెన)",
            subtitle: "Full tuition fee reimbursement and hostel maintenance support for eligible college students.",
            subtitleTe: "అర్హులైన కళాశాల విద్యార్థులకు పూర్తి ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు వసతి మద్దతు.",
            slug: "post-matric-fee-reimbursement-(jagananna-vidya-deevena-&-vasathi-deevena)",
            tag: "Higher Education"
        },
        {
            title: "Jagananna Vidya Kanuka (Student Kits)",
            titleTe: "జగనన్న విద్యా కానుక (స్టూడెంట్ కిట్స్)",
            subtitle: "Free educational kits containing uniforms, bilingual textbooks, notebooks, school bag, and shoes.",
            subtitleTe: "యూనిఫాంలు, ద్విభాషా పాఠ్యపుస్తకాలు, నోట్‌బుక్స్, స్కూల్ బ్యాగ్ మరియు బూట్లతో కూడిన ఉచిత కిట్.",
            slug: "category/education",
            tag: "Student Welfare Kit"
        }
    ];

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={20} style={{ color: 'var(--color-indigo-600)' }} />
                        {isTe ? "విద్యా సంక్షేమ పథకాలు & ప్రయోజనాలు" : "Education Benefits & Welfare Schemes"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "పాఠశాల మరియు ఉన్నత విద్యార్థుల కోసం అధికారిక సంక్షేమ పథకాలు. సమగ్ర వివరాలు మరియు అర్హత ప్రమాణాల కోసం పథకాల విభాగాన్ని చూడండి."
                            : "Official educational welfare schemes. Contextual linkages into the canonical schemes registry."
                        }
                    </p>
                </div>
                <div>
                    <Link to="/schemes/category/education" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        {isTe ? "అన్ని విద్యా పథకాలు చూడండి" : "View All Education Schemes"}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {schemes.map((s, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>
                                    {s.tag}
                                </span>
                            </div>
                            <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                {isTe ? s.titleTe : s.title}
                            </h3>
                            <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'var(--color-slate-600)', lineHeight: '1.45' }}>
                                {isTe ? s.subtitleTe : s.subtitle}
                            </p>
                        </div>
                        <div>
                            <Link 
                                to={`/schemes/${s.slug}`}
                                className="btn btn-outline btn-block"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', padding: '0.45rem 0.75rem', textDecoration: 'none' }}
                            >
                                <span>{isTe ? "పూర్తి వివరాలు చూడండి" : "View Scheme Details"}</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EducationSchemes;
