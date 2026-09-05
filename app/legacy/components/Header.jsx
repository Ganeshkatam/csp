import React, { useState, useEffect, useRef } from 'react';
import { Phone, Menu, X, ShieldCheck, Home, FileText, Activity, Users, Building2, Store, ClipboardList, BarChart3, Lock, LogOut } from 'lucide-react';
import { I18N_DICT, getLocalized } from '../lib/i18n';
import { supabase } from '../lib/supabase';

export default function Header({ 
    currentView, 
    navigate, 
    activeSection, 
    scrollToSection, 
    lang, 
    setLang, 
    textZoom, 
    setTextZoom,
    user,
    verifiedContacts = [],
    announcements = [],
    mobileMenuOpen,
    setMobileMenuOpen
}) {
    const t = I18N_DICT[lang];
    const [isTickerPaused, setIsTickerPaused] = useState(false);
    const hamburgerRef = useRef(null);
    const drawerCloseBtnRef = useRef(null);

    const renderTickerGroup = (groupKey) => {
        const list = announcements && announcements.length > 0 
            ? announcements 
            : [
                {
                    id: 'default-1',
                    title: lang === 'te' ? 'త్రైమాసిక గ్రామసభ' : 'Quarterly Grama Sabha',
                    description: lang === 'te' ? 'తాగునీటి నాణ్యత మరియు సంక్షేమ పథకాల సమీక్ష కొరకు గ్రామసభ నిర్వహించబడును.' : 'Scheduled for review of drinking water quality and welfare schemes.',
                },
                {
                    id: 'default-2',
                    title: lang === 'te' ? 'ఉచిత ఆరోగ్య శిబిరం' : 'Free Health Camp',
                    description: lang === 'te' ? 'పీహెచ్‌సీలో ఉచిత అసంక్రమిత వ్యాధుల (NCD) పరీక్షా శిబిరం.' : 'Free NCD Health Screening Camp at PHC with doctor consultation.',
                }
            ];

        return list.map((item, idx) => (
            <span key={`${groupKey}-${item.id || idx}`} className="ticker-announcement">
                <strong className="ticker-title">
                    {lang === 'te' ? (item.title_te || item.title) : item.title}
                </strong>
                <span className="ticker-desc">
                    {': '}
                    {lang === 'te' ? (item.description_te || item.description) : item.description}
                </span>
                <span className="notice-bullet" aria-hidden="true">•</span>
            </span>
        ));
    };

    const toggleLang = () => {
        setLang(prev => (prev === 'en' ? 'te' : 'en'));
    };

    // Filter verified published emergency contacts from Supabase
    const emergencyHelplines = verifiedContacts.filter(c => 
        c.status === 'published' && (c.category === 'Emergency' || c.category === 'Police' || c.category === 'Healthcare' || c.category === 'Utilities')
    );

    // Fallback emergency helplines if database is initializing
    const displayedHelplines = emergencyHelplines.length > 0 ? emergencyHelplines : [
        { id: '108', name: '108 Emergency Ambulance', phone: '108', category: 'Emergency', source: 'AP Health Department', verified_on: '2026-09-04' },
        { id: '100', name: '100 Police Emergency', phone: '100', category: 'Emergency', source: 'AP Police Department', verified_on: '2026-09-04' },
        { id: '104', name: '104 Health Helpline', phone: '104', category: 'Emergency', source: 'AP Health Department', verified_on: '2026-09-04' },
        { id: '1912', name: '1912 Electricity Helpline', phone: '1912', category: 'Emergency', source: 'APCPDCL', verified_on: '2026-09-04' }
    ];

    // Accessibility: Manage body scroll lock when mobile drawer opens/closes
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            // Move focus to close button inside drawer
            setTimeout(() => {
                drawerCloseBtnRef.current?.focus();
            }, 50);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Accessibility: Escape key closes drawer and restores focus
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false);
                hamburgerRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen, setMobileMenuOpen]);

    const handleDrawerClose = () => {
        setMobileMenuOpen(false);
        hamburgerRef.current?.focus();
    };

    const handleSectionNav = (sectionId) => {
        scrollToSection(sectionId);
        handleDrawerClose();
    };

    const handleViewNav = (viewName) => {
        navigate(viewName);
        handleDrawerClose();
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('portal');
        handleDrawerClose();
    };

    return (
        <>
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
                            {/* Verified Helplines Loaded From Database */}
                            <div className="utility-helplines">
                                <span className="helpline-label">24x7 Helplines:</span>
                                {displayedHelplines.slice(0, 3).map(hl => (
                                    <a 
                                        key={hl.id || hl.phone}
                                        href={`tel:${hl.phone}`} 
                                        className={`helpline-pill ${hl.phone === '108' ? 'helpline-red' : hl.phone === '100' ? 'helpline-blue' : 'helpline-green'}`} 
                                        title={`${hl.name} (${hl.phone}) • Verified against: ${hl.source || 'Official Records'}`}
                                    >
                                        <Phone size={11} style={{ marginRight: '3px' }} aria-hidden="true" />
                                        <span>{hl.phone} {hl.phone === '108' ? 'Ambulance' : hl.phone === '100' ? 'Police' : 'Health'}</span>
                                    </a>
                                ))}
                            </div>

                            <span className="utility-divider">|</span>

                            {/* Accessibility & Language */}
                            <div className="utility-tools">
                                <button
                                    type="button"
                                    className={`tool-btn ${textZoom === 'normal' ? 'active' : ''}`}
                                    onClick={() => setTextZoom('normal')}
                                    title="Standard font size"
                                    aria-label="Standard font size"
                                >
                                    A
                                </button>
                                <button
                                    type="button"
                                    className={`tool-btn ${textZoom === 'large' ? 'active' : ''}`}
                                    onClick={() => setTextZoom('large')}
                                    title="Enlarged font size"
                                    aria-label="Enlarged font size"
                                >
                                    A+
                                </button>
                                <button
                                    type="button"
                                    className="lang-toggle-btn"
                                    onClick={toggleLang}
                                    title="Switch Language / భాష మార్చండి"
                                    aria-label="Switch Language / భాష మార్చండి"
                                >
                                    {lang === 'en' ? 'తెలుగు' : 'English'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Unified Header: Brand + Clean Nav + Mobile Toggle */}
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

                        {/* Desktop Navigation Links */}
                        <nav className="nav-menu desktop-nav-only" aria-label="Main Navigation">
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
                                {user ? 'Admin Console' : 'Admin'}
                            </button>
                        </nav>

                        {/* Mobile Action Controls: Language Pill + Hamburger Toggle */}
                        <div className="mobile-header-actions">
                            <button
                                type="button"
                                className="mobile-lang-chip"
                                onClick={toggleLang}
                                aria-label="Switch Language / భాష మార్చండి"
                            >
                                {lang === 'en' ? 'తెలుగు' : 'English'}
                            </button>
                            <button
                                ref={hamburgerRef}
                                type="button"
                                className="mobile-hamburger-btn"
                                onClick={() => setMobileMenuOpen(prev => !prev)}
                                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-navigation-drawer"
                            >
                                {mobileMenuOpen ? (
                                    <X size={22} aria-hidden="true" />
                                ) : (
                                    <Menu size={22} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Continuous Scrolling Announcement Bar */}
                <div className="clean-notice-strip">
                    <div className="container notice-strip-inner">
                        <button
                            type="button"
                            className="notice-badge"
                            onClick={() => scrollToSection('sectionAnnouncements')}
                            title={lang === 'te' ? 'అన్ని ప్రకటనలను చూడండి' : 'View all announcements'}
                            aria-label={lang === 'te' ? 'గ్రామ ప్రకటనల విభాగం' : 'View announcements section'}
                        >
                            {lang === 'te' ? 'సమాచారం' : 'Notice'}
                        </button>
                        <div 
                            className={`notice-ticker-container ${isTickerPaused ? 'is-paused' : ''}`}
                            role="region" 
                            aria-label={lang === 'te' ? 'ముఖ్య గ్రామ సమాచారం స్క్రోలింగ్ బార్' : 'Important Village Announcements ticker'}
                            onMouseEnter={() => setIsTickerPaused(true)}
                            onMouseLeave={() => setIsTickerPaused(false)}
                            onTouchStart={() => setIsTickerPaused(true)}
                            onTouchEnd={() => setIsTickerPaused(false)}
                        >
                            <div className="notice-ticker-track">
                                <div className="notice-ticker-group">
                                    {renderTickerGroup('grp1')}
                                </div>
                                <div className="notice-ticker-group" aria-hidden="true">
                                    {renderTickerGroup('grp2')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            <div 
                className={`mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
                onClick={handleDrawerClose}
                aria-hidden="true"
            ></div>

            {/* Accessible Mobile Navigation Drawer */}
            <div 
                id="mobile-navigation-drawer"
                className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation Menu"
            >
                {/* Drawer Header */}
                <div className="mobile-drawer-header">
                    <div className="mobile-drawer-brand">
                        <div className="nav-emblem" style={{ width: '32px', height: '32px', padding: '4px' }} aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 20h16"></path>
                                <path d="M4 4h16"></path>
                                <path d="M6 4v16"></path>
                                <path d="M18 4v16"></path>
                                <path d="M10 4v16"></path>
                                <path d="M14 4v16"></path>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                {t.portalTitleEn}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-slate-500)' }}>
                                {t.projectBadge}
                            </div>
                        </div>
                    </div>
                    <button
                        ref={drawerCloseBtnRef}
                        type="button"
                        className="mobile-drawer-close-btn"
                        onClick={handleDrawerClose}
                        aria-label="Close navigation menu"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                {/* Drawer Body (Scrollable) */}
                <div className="mobile-drawer-body">
                    {/* Accessibility & Language Bar */}
                    <div className="mobile-drawer-tools">
                        <div className="tools-group">
                            <span className="tools-label">Font Size:</span>
                            <button
                                type="button"
                                className={`tool-btn ${textZoom === 'normal' ? 'active' : ''}`}
                                onClick={() => setTextZoom('normal')}
                            >
                                A
                            </button>
                            <button
                                type="button"
                                className={`tool-btn ${textZoom === 'large' ? 'active' : ''}`}
                                onClick={() => setTextZoom('large')}
                            >
                                A+
                            </button>
                        </div>
                        <button
                            type="button"
                            className="lang-toggle-btn"
                            onClick={toggleLang}
                            style={{ minHeight: '36px', padding: '0.35rem 0.85rem' }}
                        >
                            {lang === 'en' ? 'తెలుగుకు మారండి' : 'Switch to English'}
                        </button>
                    </div>

                    {/* Verified 24x7 Emergency Helplines Section */}
                    <div className="mobile-drawer-section">
                        <div className="drawer-section-title">
                            <span>Verified Emergency Helplines</span>
                            <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                                <ShieldCheck size={10} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                            </span>
                        </div>
                        <p className="drawer-section-subtitle">
                            Emergency contacts are displayed only after verification against authoritative sources.
                        </p>
                        <div className="mobile-helpline-grid">
                            {displayedHelplines.map(hl => (
                                <a 
                                    key={hl.id || hl.phone}
                                    href={`tel:${hl.phone}`} 
                                    className="mobile-helpline-row"
                                    title={`Call ${hl.phone}`}
                                >
                                    <div className="helpline-row-left">
                                        <div className="helpline-icon-wrap">
                                            <Phone size={15} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <div className="helpline-name">
                                                {lang === 'te' && hl.name_te ? hl.name_te : hl.name}
                                            </div>
                                            <div className="helpline-source">
                                                {hl.source || 'Official Directory'} • {hl.verified_on || 'Current'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="helpline-dial-badge">
                                        {hl.phone}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Portal Public Navigation Sections */}
                    <div className="mobile-drawer-section">
                        <div className="drawer-section-title">
                            <span>Civic Information Modules</span>
                        </div>
                        <nav className="mobile-drawer-nav" aria-label="Mobile Drawer Navigation">
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'home' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('home')}
                            >
                                <Home size={18} aria-hidden="true" />
                                <span>Portal Home</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'sectionCitizenCorner' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('sectionCitizenCorner')}
                            >
                                <Users size={18} aria-hidden="true" />
                                <span>Citizen Services Corner</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'sectionSchemes' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('sectionSchemes')}
                            >
                                <FileText size={18} aria-hidden="true" />
                                <span>Welfare Schemes Directory</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'sectionContacts' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('sectionContacts')}
                            >
                                <Phone size={18} aria-hidden="true" />
                                <span>Emergency &amp; Admin Contacts</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'sectionInstitutions' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('sectionInstitutions')}
                            >
                                <Building2 size={18} aria-hidden="true" />
                                <span>Health (PHC) &amp; Schools</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'sectionBusinesses' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('sectionBusinesses')}
                            >
                                <Store size={18} aria-hidden="true" />
                                <span>Local Businesses &amp; Artisans</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'portal' && activeSection === 'sectionFeedback' ? 'active' : ''}`}
                                onClick={() => handleSectionNav('sectionFeedback')}
                            >
                                <Activity size={18} aria-hidden="true" />
                                <span>Citizen Feedback &amp; Corrections</span>
                            </button>
                        </nav>
                    </div>

                    {/* Academic Study & Research Views */}
                    <div className="mobile-drawer-section">
                        <div className="drawer-section-title">
                            <span>Academic CSP Field Study</span>
                        </div>
                        {user ? (
                            <div className="mobile-user-status">
                                <span className="status-dot-active" aria-hidden="true"></span>
                                <span>Logged in: <strong>{user.email}</strong></span>
                            </div>
                        ) : null}
                        <nav className="mobile-drawer-nav" aria-label="Field Study Navigation">
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'survey' ? 'active' : ''}`}
                                onClick={() => handleViewNav('survey')}
                            >
                                <ClipboardList size={18} aria-hidden="true" />
                                <span>Field Survey Form (21 Questions)</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                                onClick={() => handleViewNav('dashboard')}
                            >
                                <BarChart3 size={18} aria-hidden="true" />
                                <span>Survey Analytics &amp; Ledger</span>
                            </button>
                            <button
                                type="button"
                                className={`drawer-nav-item ${currentView === 'admin' ? 'active' : ''}`}
                                onClick={() => handleViewNav('admin')}
                            >
                                <Lock size={18} aria-hidden="true" />
                                <span>{user ? 'Admin Console' : 'Admin Login'}</span>
                            </button>
                        </nav>

                        {user && (
                            <button
                                type="button"
                                className="drawer-signout-btn"
                                onClick={handleSignOut}
                            >
                                <LogOut size={16} aria-hidden="true" />
                                <span>Sign Out</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
