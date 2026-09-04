import React from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
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
