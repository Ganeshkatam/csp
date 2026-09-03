import React from 'react';
import { Phone, ShieldCheck, Database, ExternalLink, HeartPulse, FileText, CheckCircle2 } from 'lucide-react';
import { I18N_DICT } from '../lib/i18n';

export default function Footer({ lang }) {
    const t = I18N_DICT[lang];

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

                    {/* Column 3: 24x7 Emergency Helplines */}
                    <div className="footer-col">
                        <h4 className="footer-heading">24x7 Emergency Helplines</h4>
                        <div className="footer-helpline-stack">
                            <a href="tel:108" className="footer-helpline-pill helpline-red">
                                <Phone size={13} aria-hidden="true" />
                                <span>108 — Medical Ambulance</span>
                            </a>
                            <a href="tel:100" className="footer-helpline-pill helpline-blue">
                                <Phone size={13} aria-hidden="true" />
                                <span>100 — Police Emergency</span>
                            </a>
                            <a href="tel:104" className="footer-helpline-pill helpline-green">
                                <Phone size={13} aria-hidden="true" />
                                <span>104 — Health Information</span>
                            </a>
                            <a href="tel:181" className="footer-helpline-pill helpline-slate">
                                <Phone size={13} aria-hidden="true" />
                                <span>181 — Women Helpline</span>
                            </a>
                            <a href="tel:1912" className="footer-helpline-pill helpline-amber">
                                <Phone size={13} aria-hidden="true" />
                                <span>1912 — Electricity Lineman</span>
                            </a>
                        </div>
                    </div>

                    {/* Column 4: Data Security & Governance */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Academic Governance</h4>
                        <div className="footer-security-card">
                            <div className="sec-item">
                                <Database size={15} className="text-blue" aria-hidden="true" />
                                <div>
                                    <div className="sec-title">Supabase Cloud PostgreSQL</div>
                                    <div className="sec-sub">Row Level Security (RLS) Protected</div>
                                </div>
                            </div>
                            <div className="sec-item">
                                <ShieldCheck size={15} className="text-emerald" aria-hidden="true" />
                                <div>
                                    <div className="sec-title">Privacy Assured</div>
                                    <div className="sec-sub">Pseudonymous Data; Zero PII</div>
                                </div>
                            </div>
                            <div className="sec-item">
                                <CheckCircle2 size={15} className="text-amber" aria-hidden="true" />
                                <div>
                                    <div className="sec-title">Field Verified</div>
                                    <div className="sec-sub">Doorstep Community Interviews</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright, Open Source, and GitHub */}
                <div className="footer-bottom-bar">
                    <div className="footer-copyright">
                        (c) 2026 Academic Community Service Project (CSP). Open Access for Rural Civic Empowerment.
                    </div>
                    <div className="footer-meta-links">
                        <a 
                            href="https://github.com/Ganeshkatam/csp" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="footer-repo-link"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            <span>GitHub: Ganeshkatam/csp</span>
                            <ExternalLink size={11} style={{ marginLeft: '4px' }} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
