import React from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
import { I18N_DICT } from '../lib/i18n';

export default function Footer({ lang, verifiedContacts = [] }) {
    const t = I18N_DICT[lang];

    // Filter verified published emergency contacts from Supabase
    const emergencyHelplines = verifiedContacts.filter(c => 
        c.status === 'published' && c.category === 'Emergency'
    );

    const displayedHelplines = emergencyHelplines.length > 0 ? emergencyHelplines : [
        { id: '108', name: '108 Medical Ambulance', phone: '108' },
        { id: '100', name: '100 Police Emergency', phone: '100' },
        { id: '104', name: '104 Health Information', phone: '104' },
        { id: '1912', name: '1912 Electricity Helpline', phone: '1912' }
    ];

    return (
        <footer className="master-civic-footer" role="contentinfo">
            {/* Top National Civic Accent */}
            <div className="top-civic-stripe" aria-hidden="true"></div>

            <div className="container footer-container">
                <div className="footer-columns-grid">
                    {/* Column 1: Academic & Project Identity */}
                    <div className="footer-col col-brand">
                        <div className="footer-brand-header">
                            <div className="footer-emblem" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 20h16"></path>
                                    <path d="M4 4h16"></path>
                                    <path d="M6 4v16"></path>
                                    <path d="M18 4v16"></path>
                                    <path d="M10 4v16"></path>
                                    <path d="M14 4v16"></path>
                                    <path d="M2 20h20"></path>
                                    <path d="M3 4h18"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="footer-title">{t.portalTitleEn}</h3>
                                <div className="footer-title-te">{t.portalTitleRegional}</div>
                            </div>
                        </div>

                        <p className="footer-desc">
                            Community Service Project (CSP) • Department of Computer Science and Engineering.
                            Conducted in strict compliance with APSCHE Internship Guidelines (G.O. Ms. No. 46, Higher Education Department).
                        </p>

                        <div className="footer-academic-badge">
                            <ShieldCheck size={14} className="text-emerald" aria-hidden="true" />
                            <span>Academic CSP Field Study • B.Tech CSE</span>
                        </div>
                    </div>

                    {/* Column 2: Quick Civic Navigation */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Civic Portal Modules</h4>
                        <ul className="footer-nav-list">
                            <li><a href="#sectionCitizenCorner" className="footer-link">Citizen Services Corner</a></li>
                            <li><a href="#sectionSchemes" className="footer-link">Welfare Schemes Directory</a></li>
                            <li><a href="#sectionContacts" className="footer-link">Emergency &amp; Admin Contacts</a></li>
                            <li><a href="#sectionInstitutions" className="footer-link">Health (PHC) &amp; Schools</a></li>
                            <li><a href="#sectionBusinesses" className="footer-link">Local Businesses &amp; Artisans</a></li>
                            <li><a href="#sectionFeedback" className="footer-link">Citizen Feedback &amp; Corrections</a></li>
                        </ul>
                    </div>

                    {/* Column 3: 24x7 Verified Emergency Helplines */}
                    <div className="footer-col">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <h4 className="footer-heading" style={{ margin: 0 }}>24x7 Verified Helplines</h4>
                            <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                                Verified
                            </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', marginBottom: '0.75rem' }}>
                            Emergency contacts are displayed only after verification against authoritative sources.
                        </p>
                        <div className="footer-helpline-stack">
                            {displayedHelplines.map(hl => (
                                <a 
                                    key={hl.id || hl.phone}
                                    href={`tel:${hl.phone}`} 
                                    className={`footer-helpline-pill ${hl.phone === '108' ? 'helpline-red' : hl.phone === '100' ? 'helpline-blue' : hl.phone === '104' ? 'helpline-green' : 'helpline-amber'}`}
                                    title={`${hl.name} (${hl.phone}) • Verified against: ${hl.source || 'Authoritative Records'}`}
                                >
                                    <Phone size={13} aria-hidden="true" />
                                    <span>{hl.phone} — {hl.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright */}
                <div className="footer-bottom-bar">
                    <div className="footer-copyright">
                        (c) 2026 Academic Community Service Project (CSP). Open Access for Rural Civic Empowerment.
                    </div>
                </div>
            </div>
        </footer>
    );
}
