import React, { useState, useEffect } from 'react';
import { 
    Search, X, FileText, Phone, Activity, GraduationCap, Building2, 
    MessageSquare, ExternalLink, Clock, CheckCircle2, AlertCircle, QrCode
} from 'lucide-react';
import { I18N_DICT, getLocalized } from '../lib/i18n';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';

export default function PublicPortalView({ 
    lang, 
    navigate,
    currentFilter = 'ALL',
    setCurrentFilter,
    searchQuery = '',
    setSearchQuery,
    setActiveSection,
    scrollToSection
}) {
    const t = I18N_DICT[lang];

    const [village, setVillage] = useState(null);

    const [announcements, setAnnouncements] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [businesses, setBusinesses] = useState([]);

    // Feedback state
    const [fbName, setFbName] = useState('');
    const [fbPhone, setFbPhone] = useState('');
    const [fbType, setFbType] = useState('Correction');
    const [fbMessage, setFbMessage] = useState('');
    const [fbStatus, setFbStatus] = useState(null); // 'submitting' | 'success' | 'error'

    useEffect(() => {
        loadPublishedData();
    }, []);

    // Keep active header button in sync with page scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                { id: 'sectionQrAccess', name: 'sectionQrAccess' },
                { id: 'sectionFeedback', name: 'sectionFeedback' },
                { id: 'sectionBusinesses', name: 'sectionBusinesses' },
                { id: 'sectionInstitutions', name: 'sectionInstitutions' },
                { id: 'sectionContacts', name: 'sectionContacts' },
                { id: 'sectionSchemes', name: 'sectionSchemes' },
                { id: 'sectionCitizenCorner', name: 'sectionCitizenCorner' }
            ];

            const scrollPos = window.scrollY + 140;
            if (window.scrollY < 250) {
                if (setActiveSection) setActiveSection('home');
                return;
            }

            for (const sec of sections) {
                const el = document.getElementById(sec.id);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        if (setActiveSection) setActiveSection(sec.id);
                        return;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [setActiveSection]);

    async function loadPublishedData() {
        try {
            const [vRes, aRes, sRes, cRes, iRes, bRes] = await Promise.all([
                supabase.from('villages').select('*').limit(1),
                supabase.from('announcements').select('*').eq('status', 'published').order('event_date', { ascending: true }),
                supabase.from('schemes').select('*').eq('status', 'published').order('name'),
                supabase.from('contacts').select('*').eq('status', 'published').order('name'),
                supabase.from('institutions').select('*').eq('status', 'published').order('name'),
                supabase.from('businesses').select('*').eq('status', 'published').order('name')
            ]);

            if (vRes.data && vRes.data.length > 0) setVillage(vRes.data[0]);
            if (aRes.data && aRes.data.length > 0) setAnnouncements(aRes.data);
            if (sRes.data && sRes.data.length > 0) setSchemes(sRes.data);
            if (cRes.data && cRes.data.length > 0) setContacts(cRes.data);
            if (iRes.data && iRes.data.length > 0) setInstitutions(iRes.data);
            if (bRes.data && bRes.data.length > 0) setBusinesses(bRes.data);
        } catch (err) {
            console.warn('Supabase fetch failed, relying on baseline data:', err);
        }
    }

    // Operating hours check for PHC
    function calculateOpenStatus(timings) {
        if (!timings) return null;
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        if (day === 0 && !timings.toLowerCase().includes('sun')) return false;
        if (timings.includes('09:00') && (timings.includes('04:00') || timings.includes('03:30'))) {
            return hour >= 9 && hour < 16;
        }
        if (timings.includes('10:00') && timings.includes('05:00')) {
            return hour >= 10 && hour < 17;
        }
        return null;
    }

    // Feedback Submission
    async function handleFeedbackSubmit(e) {
        e.preventDefault();
        setFbStatus('submitting');
        try {
            const { error } = await supabase.from('citizen_feedback').insert({
                village_id: village?.id || DEFAULT_VILLAGE_ID,
                name: fbName.trim() || 'Anonymous Resident',
                phone: fbPhone.trim() || null,
                feedback_type: fbType,
                message: fbMessage.trim(),
                status: 'Pending'
            });
            if (error) throw error;
            setFbStatus('success');
            setFbName('');
            setFbPhone('');
            setFbMessage('');
        } catch (err) {
            console.error('Feedback error:', err);
            setFbStatus('error');
        }
    }

    // Search filter helper
    function matchesQuery(item) {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(q));
    }

    const filteredAnnouncements = announcements.filter(matchesQuery);
    const filteredSchemes = schemes.filter(matchesQuery);
    const filteredContacts = contacts.filter(matchesQuery);
    const filteredInstitutions = institutions.filter(matchesQuery);
    const filteredBusinesses = businesses.filter(matchesQuery);

    const currentUrl = typeof window !== 'undefined' 
        ? (window.location.origin + window.location.pathname).replace(/\.html.*$/, '')
        : 'https://village-portal.gov.in';

    return (
        <main className="container" id="mainContent">
            {/* Civic Hero Banner & Search (Modeled after PM-Kisan & MyBharat) */}
            <section className="civic-hero" aria-label="Village Portal Banner">
                <div className="hero-image-wrapper">
                    <img 
                        src="/images/rural_village_illustration.jpg" 
                        alt="Illustrative representation of a rural village landscape" 
                        className="hero-graphic"
                    />
                    <div className="hero-ethical-caption">
                        Illustrative representation of a rural village landscape. Verified under Academic CSP Protocol.
                    </div>
                </div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        {village?.name ? `${t.welcomeTo} ${village.name} ${t.portalTitleEn}` : t.portalTitleEn}
                    </h1>
                    <p className="hero-subtitle">
                        {village?.gram_panchayat 
                            ? `${village.gram_panchayat} Gram Panchayat | ${village.mandal} Mandal | ${village.district} District`
                            : t.portalSubtitle
                        }
                    </p>

                    {/* Prominent Citizen Search Bar */}
                    <div className="search-module" role="search">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={20} />
                            <input 
                                type="search"
                                className="search-input"
                                placeholder={t.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search village schemes, contacts, and services"
                            />
                            {searchQuery && (
                                <button 
                                    type="button" 
                                    className="btn-search-clear" 
                                    onClick={() => setSearchQuery('')}
                                >
                                    {t.clearBtn}
                                </button>
                            )}
                        </div>

                        {/* Category Filter Pills */}
                        <div className="filter-pills-bar" role="tablist">
                            {[
                                { key: 'ALL', label: t.filterAll },
                                { key: 'announcements', label: t.filterAnnouncements },
                                { key: 'schemes', label: t.filterSchemes },
                                { key: 'contacts', label: t.filterContacts },
                                { key: 'institutions', label: t.filterInstitutions },
                                { key: 'businesses', label: t.filterBusinesses }
                            ].map(pill => (
                                <button
                                    key={pill.key}
                                    type="button"
                                    className={`filter-pill ${currentFilter === pill.key ? 'active' : ''}`}
                                    onClick={() => setCurrentFilter(pill.key)}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Citizen Services Corner (Modeled after PM-Kisan Farmer Corner) */}
            {(currentFilter === 'ALL') && (
                <section className="section-block" id="sectionCitizenCorner">
                    <div className="section-head">
                        <h2 className="section-title">
                            <span>{t.citizenCornerTitle}</span>
                            <span className="section-title-sub">{t.citizenCornerSub}</span>
                        </h2>
                        <p className="section-desc">{t.citizenCornerDesc}</p>
                    </div>

                    <div className="citizen-corner-grid">
                        <a href="#sectionSchemes" onClick={(e) => { e.preventDefault(); if (scrollToSection) scrollToSection('sectionSchemes'); }} className="service-hub-card">
                            <div className="hub-icon-box">
                                <FileText size={24} />
                            </div>
                            <div className="hub-text">
                                <h3 className="hub-title">{t.hubSchemesTitle}</h3>
                                <p className="hub-desc">{t.hubSchemesDesc}</p>
                            </div>
                        </a>

                        <a href="#sectionContacts" onClick={(e) => { e.preventDefault(); if (scrollToSection) scrollToSection('sectionContacts'); }} className="service-hub-card">
                            <div className="hub-icon-box hub-icon-emergency">
                                <Phone size={24} />
                            </div>
                            <div className="hub-text">
                                <h3 className="hub-title">{t.hubContactsTitle}</h3>
                                <p className="hub-desc">{t.hubContactsDesc}</p>
                            </div>
                        </a>

                        <a href="#sectionInstitutions" onClick={(e) => { e.preventDefault(); if (scrollToSection) scrollToSection('sectionInstitutions'); }} className="service-hub-card">
                            <div className="hub-icon-box hub-icon-health">
                                <Activity size={24} />
                            </div>
                            <div className="hub-text">
                                <h3 className="hub-title">{t.hubHealthTitle}</h3>
                                <p className="hub-desc">{t.hubHealthDesc}</p>
                            </div>
                        </a>

                        <a href="#sectionInstitutions" onClick={(e) => { e.preventDefault(); if (scrollToSection) scrollToSection('sectionInstitutions'); }} className="service-hub-card">
                            <div className="hub-icon-box">
                                <GraduationCap size={24} />
                            </div>
                            <div className="hub-text">
                                <h3 className="hub-title">{t.hubSchoolsTitle}</h3>
                                <p className="hub-desc">{t.hubSchoolsDesc}</p>
                            </div>
                        </a>

                        <a href="#sectionBusinesses" onClick={(e) => { e.preventDefault(); if (scrollToSection) scrollToSection('sectionBusinesses'); }} className="service-hub-card">
                            <div className="hub-icon-box">
                                <Building2 size={24} />
                            </div>
                            <div className="hub-text">
                                <h3 className="hub-title">{t.hubBizTitle}</h3>
                                <p className="hub-desc">{t.hubBizDesc}</p>
                            </div>
                        </a>

                        <a href="#sectionFeedback" onClick={(e) => { e.preventDefault(); if (scrollToSection) scrollToSection('sectionFeedback'); }} className="service-hub-card">
                            <div className="hub-icon-box">
                                <MessageSquare size={24} />
                            </div>
                            <div className="hub-text">
                                <h3 className="hub-title">{t.hubFeedbackTitle}</h3>
                                <p className="hub-desc">{t.hubFeedbackDesc}</p>
                            </div>
                        </a>
                    </div>
                </section>
            )}

            {/* Habitation Profile (Rendered when configured in database) */}
            {(currentFilter === 'ALL' && village?.name) && (
                <section className="section-block" id="sectionVillageProfile">
                    <div className="civic-card" style={{ borderLeft: '4px solid var(--color-gov-navy)' }}>
                        <div className="card-header-row">
                            <span className="badge badge-civic">Habitation Profile</span>
                            <span className="badge badge-verified">Verified</span>
                        </div>
                        <h2 className="card-item-title">{village.name} Habitation Master Profile</h2>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                            {getLocalized(village, 'description', lang)}
                        </p>
                        <div className="card-verify-tag">
                            <span>Source: {village.source || 'Local Records'}</span>
                            <span>Verified: {village.verified_on || 'N/A'}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Announcements */}
            {(currentFilter === 'ALL' || currentFilter === 'announcements') && (
                <section className="section-block" id="sectionAnnouncements">
                    <div className="section-head">
                        <h2 className="section-title">{t.filterAnnouncements}</h2>
                        <p className="section-desc">Public notices, Grama Sabha schedules, and welfare application deadlines.</p>
                    </div>
                    <div className="card-grid">
                        {filteredAnnouncements.length > 0 ? (
                            filteredAnnouncements.map(a => (
                                <div key={a.id} className="civic-card">
                                    <div>
                                        <div className="card-header-row">
                                            <span className="badge badge-civic">{a.category || 'Notice'}</span>
                                            {a.event_date && (
                                                <span className="badge" style={{ background: '#e2e8f0', color: '#334155' }}>
                                                    Date: {a.event_date}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="card-item-title">{getLocalized(a, 'title', lang)}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                                            {getLocalized(a, 'description', lang)}
                                        </p>
                                    </div>
                                    <div className="card-verify-tag">
                                        <span>Source: {a.source}</span>
                                        <span>Verified: {a.verified_on}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', gridColumn: '1 / -1' }}>No notices published matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Welfare Schemes */}
            {(currentFilter === 'ALL' || currentFilter === 'schemes') && (
                <section className="section-block" id="sectionSchemes">
                    <div className="section-head">
                        <h2 className="section-title">{t.schemesTitle}</h2>
                        <p className="section-desc">{t.schemesDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredSchemes.length > 0 ? (
                            filteredSchemes.map(s => (
                                <div key={s.id} className="civic-card">
                                    <div>
                                        <div className="card-header-row">
                                            <span className="badge badge-civic">{s.category}</span>
                                            <span className="badge badge-verified">Verified</span>
                                        </div>
                                        <h3 className="card-item-title">{getLocalized(s, 'name', lang)}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                                            {getLocalized(s, 'description', lang)}
                                        </p>
                                        <ul className="card-meta-list">
                                            <li className="meta-row">
                                                <span className="meta-label">{t.eligibility}</span>
                                                <span className="meta-val">{getLocalized(s, 'eligibility', lang)}</span>
                                            </li>
                                            <li className="meta-row">
                                                <span className="meta-label">{t.requiredDocs}</span>
                                                <span className="meta-val">{getLocalized(s, 'documents', lang)}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        {s.official_url && (
                                            <a 
                                                href={s.official_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn btn-secondary" 
                                                style={{ width: '100%', marginTop: '0.5rem' }}
                                            >
                                                {t.officialPortal} <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                                            </a>
                                        )}
                                        <div className="card-verify-tag">
                                            <span>Source: {s.source}</span>
                                            <span>Verified: {s.verified_on}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', gridColumn: '1 / -1' }}>No welfare schemes found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Emergency & Administration Contacts */}
            {(currentFilter === 'ALL' || currentFilter === 'contacts') && (
                <section className="section-block" id="sectionContacts">
                    <div className="section-head">
                        <h2 className="section-title">{t.contactsTitle}</h2>
                        <p className="section-desc">{t.contactsDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map(c => (
                                <div key={c.id} className="civic-card">
                                    <div>
                                        <div className="card-header-row">
                                            <span className={`badge ${c.category === 'Emergency' ? 'badge-closed' : 'badge-civic'}`}>
                                                {c.category}
                                            </span>
                                        </div>
                                        <h3 className="card-item-title">{getLocalized(c, 'name', lang)}</h3>
                                        {c.designation && (
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                                                {getLocalized(c, 'designation', lang)}
                                            </div>
                                        )}
                                        <ul className="card-meta-list">
                                            {c.availability && (
                                                <li className="meta-row">
                                                    <span className="meta-label">{t.timings}</span>
                                                    <span className="meta-val">{c.availability}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <a href={`tel:${c.phone}`} className="btn btn-call-card" aria-label={`Call ${c.name}`}>
                                            <Phone size={16} style={{ marginRight: '6px' }} /> {t.callNow} {c.phone}
                                        </a>
                                        <div className="card-verify-tag">
                                            <span>Source: {c.source}</span>
                                            <span>Verified: {c.verified_on}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', gridColumn: '1 / -1' }}>No contacts found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Education & Healthcare Facilities */}
            {(currentFilter === 'ALL' || currentFilter === 'institutions') && (
                <section className="section-block" id="sectionInstitutions">
                    <div className="section-head">
                        <h2 className="section-title">{t.institutionsTitle}</h2>
                        <p className="section-desc">{t.institutionsDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredInstitutions.length > 0 ? (
                            filteredInstitutions.map(inst => {
                                const openStatus = calculateOpenStatus(inst.timings);
                                return (
                                    <div key={inst.id} className="civic-card">
                                        <div>
                                            <div className="card-header-row">
                                                <span className="badge badge-civic">{inst.type}</span>
                                                {openStatus !== null && (
                                                    <span 
                                                        className={`badge ${openStatus ? 'badge-open' : 'badge-closed'}`}
                                                        title={t.hoursDisclaimer}
                                                    >
                                                        {openStatus ? t.openNow : t.closedNow}*
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="card-item-title">{getLocalized(inst, 'name', lang)}</h3>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                {inst.address}
                                            </div>
                                            <ul className="card-meta-list">
                                                <li className="meta-row">
                                                    <span className="meta-label">{t.timings}</span>
                                                    <span className="meta-val">{inst.timings}</span>
                                                    {openStatus !== null && (
                                                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                            *{t.hoursDisclaimer}
                                                        </span>
                                                    )}
                                                </li>
                                                <li className="meta-row">
                                                    <span className="meta-label">{t.services}</span>
                                                    <span className="meta-val">{getLocalized(inst, 'services', lang)}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            {inst.phone && (
                                                <a href={`tel:${inst.phone}`} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                                    <Phone size={14} style={{ marginRight: '6px' }} /> {t.callNow} {inst.phone}
                                                </a>
                                            )}
                                            <div className="card-verify-tag">
                                                <span>Source: {inst.source}</span>
                                                <span>Verified: {inst.verified_on}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', gridColumn: '1 / -1' }}>No institutions found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Local Businesses & SHGs */}
            {(currentFilter === 'ALL' || currentFilter === 'businesses') && (
                <section className="section-block" id="sectionBusinesses">
                    <div className="section-head">
                        <h2 className="section-title">{t.businessesTitle}</h2>
                        <p className="section-desc">{t.businessesDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredBusinesses.length > 0 ? (
                            filteredBusinesses.map(b => (
                                <div key={b.id} className="civic-card">
                                    <div>
                                        <div className="card-header-row">
                                            <span className="badge badge-civic">{b.category}</span>
                                        </div>
                                        <h3 className="card-item-title">{getLocalized(b, 'name', lang)}</h3>
                                        {b.owner_name && (
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                                                {t.proprietor} {b.owner_name}
                                            </div>
                                        )}
                                        <ul className="card-meta-list">
                                            <li className="meta-row">
                                                <span className="meta-label">{t.services}</span>
                                                <span className="meta-val">{getLocalized(b, 'services', lang)}</span>
                                            </li>
                                            <li className="meta-row">
                                                <span className="meta-label">Location:</span>
                                                <span className="meta-val">{b.address}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        {b.phone && (
                                            <a href={`tel:${b.phone}`} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                                <Phone size={14} style={{ marginRight: '6px' }} /> {t.callNow} {b.phone}
                                            </a>
                                        )}
                                        <div className="card-verify-tag">
                                            <span>Source: {b.source}</span>
                                            <span>Verified: {b.verified_on}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', gridColumn: '1 / -1' }}>No businesses found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Citizen Feedback Desk */}
            <section className="section-block" id="sectionFeedback">
                <div className="section-head">
                    <h2 className="section-title">{t.feedbackTitle}</h2>
                    <p className="section-desc">{t.feedbackDesc}</p>
                </div>
                <div className="civic-card">
                    {fbStatus === 'success' && (
                        <div className="alert alert-success">
                            {t.feedbackSuccess}
                        </div>
                    )}
                    {fbStatus === 'error' && (
                        <div className="alert alert-danger">
                            {t.feedbackError}
                        </div>
                    )}
                    <form onSubmit={handleFeedbackSubmit}>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">{t.yourName}</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={fbName}
                                    onChange={(e) => setFbName(e.target.value)}
                                    placeholder="Resident Name" 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t.yourPhone}</label>
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    value={fbPhone}
                                    onChange={(e) => setFbPhone(e.target.value)}
                                    placeholder="+91 98765 43210" 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t.feedbackCategory}</label>
                            <select 
                                className="form-control"
                                value={fbType}
                                onChange={(e) => setFbType(e.target.value)}
                                required
                            >
                                <option value="Correction">Phone Number / Information Correction</option>
                                <option value="New Listing Request">Request New Business / Artisan Listing</option>
                                <option value="Scheme Inquiry">Scheme Information Inquiry</option>
                                <option value="General">General Village Suggestion</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t.description}</label>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                value={fbMessage}
                                onChange={(e) => setFbMessage(e.target.value)}
                                placeholder="Please specify the business/institution name, correct contact number, or details..."
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={fbStatus === 'submitting'}
                            style={{ minHeight: '48px', padding: '0.75rem 1.5rem' }}
                        >
                            {fbStatus === 'submitting' ? 'Submitting to Supabase...' : t.submitBtn}
                        </button>
                    </form>
                </div>
            </section>

            {/* Dynamic Mobile QR Code Access */}
            <section className="section-block" id="sectionQrAccess">
                <div className="civic-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 className="card-item-title">{t.qrHeading}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0.5rem auto 1rem' }}>
                        {t.qrDesc}
                    </p>
                    <div className="qr-container">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`} 
                            alt="QR code to access this live portal" 
                            width="180" 
                            height="180"
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                            {currentUrl}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
