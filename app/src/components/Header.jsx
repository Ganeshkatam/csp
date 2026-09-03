import React from 'react';
import { Phone } from 'lucide-react';
import { I18N_DICT } from '../lib/i18n';

export default function Header({ 
    currentView, 
    navigate, 
    activeSection, 
    scrollToSection, 
    lang, 
    setLang, 
    textZoom, 
    setTextZoom 
}) {
    const t = I18N_DICT[lang];

    const toggleLang = () => {
        setLang(prev => (prev === 'en' ? 'te' : 'en'));
    };

    return (
        <header className="clean-site-header" role="banner">
            {/* Top National Accent Line */}
            <div className="top-civic-stripe" aria-hidden="true"></div>

            {/* Micro Utility Bar: Academic Identity + Direct Helplines + Controls */}
            <div className="clean-utility-bar">
                <div className="container utility-inner">
                    <div className="utility-govt">
                        <span className="utility-flag-dot" aria-hidden="true"></span>
                        <span className="utility-govt-text">
                            {t.projectBadge}
                        </span>
                    </div>

                    <div className="utility-actions">
                        {/* Compact Helplines */}
                        <div className="utility-helplines">
                            <span className="helpline-label">24x7 Helplines:</span>
                            <a href="tel:108" className="helpline-pill helpline-red" title="Call 108 Emergency Ambulance">
                                <Phone size={11} style={{ marginRight: '3px' }} /> 108 Ambulance
                            </a>
                            <a href="tel:100" className="helpline-pill helpline-blue" title="Call 100 Police">
                                <Phone size={11} style={{ marginRight: '3px' }} /> 100 Police
                            </a>
                            <a href="tel:104" className="helpline-pill helpline-green" title="Call 104 Health Helpline">
                                <Phone size={11} style={{ marginRight: '3px' }} /> 104 Health
                            </a>
                        </div>

                        <span className="utility-divider">|</span>

                        {/* Accessibility & Language */}
                        <div className="utility-tools">
                            <button
                                type="button"
                                className={`tool-btn ${textZoom === 'normal' ? 'active' : ''}`}
                                onClick={() => setTextZoom('normal')}
                                title="Standard font size"
                            >
                                A
                            </button>
                            <button
                                type="button"
                                className={`tool-btn ${textZoom === 'large' ? 'active' : ''}`}
                                onClick={() => setTextZoom('large')}
                                title="Enlarged font size"
                            >
                                A+
                            </button>
                            <button
                                type="button"
                                className="lang-toggle-btn"
                                onClick={toggleLang}
                                title="Switch Language / భాష మార్చండి"
                            >
                                {lang === 'en' ? 'తెలుగు' : 'English'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Unified Header: Brand + Clean Nav */}
            <div className="clean-main-nav">
                <div className="container main-nav-inner">
                    {/* Brand */}
                    <div className="nav-brand" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
                        <div className="nav-emblem" aria-hidden="true">
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
                        <div className="nav-brand-text">
                            <span className="nav-brand-title">{t.portalTitleEn}</span>
                            <span className="nav-brand-sub">{t.portalSubtitle}</span>
                        </div>
                    </div>

                    {/* Clean Navigation Links with Accurate Section Triggering */}
                    <nav className="nav-menu" aria-label="Main Navigation">
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'portal' && activeSection === 'home' ? 'active' : ''}`}
                            onClick={() => scrollToSection('home')}
                        >
                            Home
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'portal' && activeSection === 'sectionCitizenCorner' ? 'active' : ''}`}
                            onClick={() => scrollToSection('sectionCitizenCorner')}
                        >
                            Citizen Corner
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'portal' && activeSection === 'sectionSchemes' ? 'active' : ''}`}
                            onClick={() => scrollToSection('sectionSchemes')}
                        >
                            Schemes
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'portal' && activeSection === 'sectionContacts' ? 'active' : ''}`}
                            onClick={() => scrollToSection('sectionContacts')}
                        >
                            Contacts
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'portal' && activeSection === 'sectionInstitutions' ? 'active' : ''}`}
                            onClick={() => scrollToSection('sectionInstitutions')}
                        >
                            Health &amp; Schools
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'portal' && activeSection === 'sectionBusinesses' ? 'active' : ''}`}
                            onClick={() => scrollToSection('sectionBusinesses')}
                        >
                            Businesses
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'survey' ? 'active' : ''}`}
                            onClick={() => navigate('survey')}
                        >
                            Survey
                        </button>
                        <button
                            type="button"
                            className={`menu-link ${currentView === 'dashboard' ? 'active' : ''}`}
                            onClick={() => navigate('dashboard')}
                        >
                            Analytics
                        </button>
                        <button
                            type="button"
                            className={`menu-link admin-btn ${currentView === 'admin' ? 'active' : ''}`}
                            onClick={() => navigate('admin')}
                        >
                            Admin
                        </button>
                    </nav>
                </div>
            </div>

            {/* Subtle Slim Announcement Bar */}
            <div className="clean-notice-strip">
                <div className="container notice-strip-inner">
                    <span className="notice-badge">Notice</span>
                    <span className="notice-text">
                        Quarterly Grama Sabha scheduled for review of drinking water quality and welfare schemes. Free NCD Health Screening Camp at PHC.
                    </span>
                </div>
            </div>
        </header>
    );
}
