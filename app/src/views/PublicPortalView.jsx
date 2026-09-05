import { useState, useEffect } from 'react';
import { I18N_DICT, getLocalized } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import ServiceGrid from '../components/ServiceGrid';
import SchemeCard from '../components/SchemeCard';
import ContactCard from '../components/ContactCard';
import InstitutionCard from '../components/InstitutionCard';
import BusinessCard from '../components/BusinessCard';
import AnnouncementCard from '../components/AnnouncementCard';
import FeedbackForm from '../components/FeedbackForm';
import { Copy, ShieldCheck, HeartPulse, FileText, Phone, Store } from 'lucide-react';

export default function PublicPortalView({
    lang,
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
    const [copiedUrl, setCopiedUrl] = useState(false);

    useEffect(() => {
        loadCommunityData();
    }, []);

    // Sync active header button with page scroll position (100px clearance)
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

            const scrollPos = window.scrollY + 160;
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

    async function loadCommunityData() {
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
            console.error('Data load error:', err);
        }
    }

    // Client-side search filters
    const query = searchQuery.toLowerCase().trim();

    const filteredAnnouncements = announcements.filter(a =>
        !query ||
        (a.title && a.title.toLowerCase().includes(query)) ||
        (a.title_te && a.title_te.toLowerCase().includes(query)) ||
        (a.description && a.description.toLowerCase().includes(query))
    );

    const filteredSchemes = schemes.filter(s =>
        !query ||
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.name_te && s.name_te.toLowerCase().includes(query)) ||
        (s.category && s.category.toLowerCase().includes(query)) ||
        (s.eligibility && s.eligibility.toLowerCase().includes(query))
    );

    const filteredContacts = contacts.filter(c =>
        !query ||
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.name_te && c.name_te.toLowerCase().includes(query)) ||
        (c.designation && c.designation.toLowerCase().includes(query)) ||
        (c.phone && c.phone.includes(query))
    );

    const filteredInstitutions = institutions.filter(i =>
        !query ||
        (i.name && i.name.toLowerCase().includes(query)) ||
        (i.name_te && i.name_te.toLowerCase().includes(query)) ||
        (i.type && i.type.toLowerCase().includes(query)) ||
        (i.services && i.services.toLowerCase().includes(query))
    );

    const filteredBusinesses = businesses.filter(b =>
        !query ||
        (b.name && b.name.toLowerCase().includes(query)) ||
        (b.name_te && b.name_te.toLowerCase().includes(query)) ||
        (b.category && b.category.toLowerCase().includes(query)) ||
        (b.services && b.services.toLowerCase().includes(query))
    );

    const portalUrl = typeof window !== 'undefined' ? window.location.origin : 'https://csp-village-portal.web.app';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(portalUrl)}`;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(portalUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 3000);
    };

    return (
        <main className="container" id="mainContent">
            {/* Rich Civic Hero Banner */}
            <section className="civic-hero modern-split-hero" id="home">
                <div className="hero-grid-layout">
                    {/* Left Hero Content */}
                    <div className="hero-content-col">
                        <div className="hero-project-badge">
                            <span className="badge-dot" aria-hidden="true"></span>
                            <span>{t.projectBadge}</span>
                        </div>

                        <h1 className="hero-title">
                            {village?.name ? `${t.welcomeTo} ${village.name}` : 'Village Mitra'}
                            <span className="hero-title-suffix"> {t.portalTitleEn}</span>
                        </h1>

                        <div className="hero-regional-badge">
                            <span>{t.portalTitleRegional}</span>
                        </div>

                        <p className="hero-subtitle">
                            {village?.gram_panchayat
                                ? `${village.gram_panchayat} Gram Panchayat | ${village.mandal} Mandal | ${village.district} District`
                                : t.portalSubtitle
                            }
                        </p>

                        {/* Search Command Bar */}
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            currentFilter={currentFilter}
                            setCurrentFilter={setCurrentFilter}
                            t={t}
                        />

                        {/* Quick Feature Metric Chips */}
                        <div className="hero-feature-pills">
                            <span className="hero-feat-chip">
                                <HeartPulse size={14} className="feat-chip-icon text-emerald" aria-hidden="true" />
                                <span>PHC &amp; Healthcare</span>
                            </span>
                            <span className="hero-feat-chip">
                                <FileText size={14} className="feat-chip-icon text-blue" aria-hidden="true" />
                                <span>Welfare Checklists</span>
                            </span>
                            <span className="hero-feat-chip">
                                <Phone size={14} className="feat-chip-icon text-red" aria-hidden="true" />
                                <span>24x7 Helplines</span>
                            </span>
                            <span className="hero-feat-chip">
                                <Store size={14} className="feat-chip-icon text-amber" aria-hidden="true" />
                                <span>Local Artisans</span>
                            </span>
                        </div>
                    </div>

                    {/* Right Hero Visual Illustration Banner */}
                    <div className="hero-visual-col">
                        <div className="hero-illustration-frame">
                            <img
                                src="/images/rural_village_illustration.jpg"
                                alt="Digital Village Civic Community Landscape with Panchayat, Healthcare, and Education facilities"
                                className="hero-illustration-img"
                            />
                            <div className="hero-illustration-caption">
                                <ShieldCheck size={16} className="caption-icon" aria-hidden="true" />
                                <span>Empowering Rural Habitations Through Digital Information Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Citizen Services Quick-Access Bento Hubs */}
            {(currentFilter === 'ALL') && (
                <ServiceGrid t={t} scrollToSection={scrollToSection} />
            )}

            {/* Habitation Profile Card (Dynamically displayed when record exists in Supabase) */}
            {(currentFilter === 'ALL' && village?.name) && (
                <section className="section-block" id="sectionVillageProfile">
                    <div className="civic-card profile-spotlight-card">
                        <div className="card-header-row">
                            <span className="badge badge-civic">Community Habitation Profile</span>
                            <span className="badge badge-verified">
                                <ShieldCheck size={12} style={{ marginRight: '3px' }} aria-hidden="true" /> Verified
                            </span>
                        </div>
                        <h2 className="card-item-title">{village.name} Habitation Overview</h2>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate-700)', marginTop: '0.5rem', lineHeight: '1.65' }}>
                            {getLocalized(village, 'description', lang)}
                        </p>
                        <div className="card-verify-tag">
                            <span>Source: {village.source || 'Local Records'}</span>
                            <span>Verified: {village.verified_on || 'Current'}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Public Announcements Section */}
            {(currentFilter === 'ALL' || currentFilter === 'announcements') && (
                <section className="section-block" id="sectionAnnouncements">
                    <div className="section-head">
                        <div className="section-title-wrap">
                            <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Public Notices</span>
                            <h2 className="section-title">{t.filterAnnouncements}</h2>
                        </div>
                        <p className="section-desc">Public notices, Grama Sabha schedules, and welfare application deadlines.</p>
                    </div>
                    <div className="card-grid">
                        {filteredAnnouncements.length > 0 ? (
                            filteredAnnouncements.map(a => (
                                <AnnouncementCard key={a.id} announcement={a} lang={lang} />
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-slate-500)', gridColumn: '1 / -1' }}>No notices found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Welfare Schemes Directory */}
            {(currentFilter === 'ALL' || currentFilter === 'schemes') && (
                <section className="section-block" id="sectionSchemes">
                    <div className="section-head">
                        <div className="section-title-wrap">
                            <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Public Welfare Directory</span>
                            <h2 className="section-title">{t.schemesTitle}</h2>
                        </div>
                        <p className="section-desc">{t.schemesDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredSchemes.length > 0 ? (
                            filteredSchemes.map(s => (
                                <SchemeCard key={s.id} scheme={s} lang={lang} t={t} />
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-slate-500)', gridColumn: '1 / -1' }}>No schemes found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Important Contacts Directory */}
            {(currentFilter === 'ALL' || currentFilter === 'contacts') && (
                <section className="section-block" id="sectionContacts">
                    <div className="section-head">
                        <div className="section-title-wrap">
                            <span className="badge badge-alert" style={{ marginBottom: '6px' }}>Emergency &amp; Administration</span>
                            <h2 className="section-title">{t.contactsTitle}</h2>
                        </div>
                        <p className="section-desc">{t.contactsDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map(c => (
                                <ContactCard key={c.id} contact={c} lang={lang} t={t} />
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-slate-500)', gridColumn: '1 / -1' }}>No contacts found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Healthcare & Education Facilities */}
            {(currentFilter === 'ALL' || currentFilter === 'institutions') && (
                <section className="section-block" id="sectionInstitutions">
                    <div className="section-head">
                        <div className="section-title-wrap">
                            <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Public Institutions</span>
                            <h2 className="section-title">{t.institutionsTitle}</h2>
                        </div>
                        <p className="section-desc">{t.institutionsDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredInstitutions.length > 0 ? (
                            filteredInstitutions.map(i => (
                                <InstitutionCard key={i.id} institution={i} lang={lang} t={t} />
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-slate-500)', gridColumn: '1 / -1' }}>No healthcare or educational institutions found.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Local Businesses & Artisans Directory */}
            {(currentFilter === 'ALL' || currentFilter === 'businesses') && (
                <section className="section-block" id="sectionBusinesses">
                    <div className="section-head">
                        <div className="section-title-wrap">
                            <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Local Economy &amp; Crafts</span>
                            <h2 className="section-title">{t.businessesTitle}</h2>
                        </div>
                        <p className="section-desc">{t.businessesDesc}</p>
                    </div>
                    <div className="card-grid">
                        {filteredBusinesses.length > 0 ? (
                            filteredBusinesses.map(b => (
                                <BusinessCard key={b.id} business={b} lang={lang} t={t} />
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-slate-500)', gridColumn: '1 / -1' }}>No businesses found matching criteria.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Citizen Feedback & Correction Module */}
            <FeedbackForm villageId={village?.id} t={t} />

            {/* High-End Smartphone Access & Field Evaluation Hub */}
            <section className="section-block" id="sectionQrAccess">
                <div className="mobile-access-hub-card">
                    <div className="mobile-access-content">
                        <h2 className="mobile-hub-title">{t.qrHeading}</h2>
                        <p className="mobile-hub-desc">{t.qrDesc}</p>

                        <div className="mobile-steps-list">
                            <div className="mobile-step-item">
                                <span className="step-number-dot">1</span>
                                <span>Open the Camera app on any smartphone.</span>
                            </div>
                            <div className="mobile-step-item">
                                <span className="step-number-dot">2</span>
                                <span>Focus on the QR code to open the instant mobile portal.</span>
                            </div>
                            <div className="mobile-step-item">
                                <span className="step-number-dot">3</span>
                                <span>Browse emergency contacts, scheme checklists, and PHC hours in the field.</span>
                            </div>
                        </div>

                        <div className="mobile-action-row">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCopyUrl}
                                style={{ minHeight: '42px', padding: '0.5rem 1rem' }}
                            >
                                <Copy size={14} style={{ marginRight: '6px' }} aria-hidden="true" />
                                {copiedUrl ? 'Copied Portal URL!' : 'Copy Portal URL'}
                            </button>
                            <span className="mobile-url-tag">
                                {portalUrl}
                            </span>
                        </div>
                    </div>

                    <div className="mobile-qr-frame">
                        <div className="qr-image-wrapper">
                            <img 
                                src={qrCodeUrl} 
                                alt="Scan QR Code to open Village Mitra on Smartphone" 
                                width="200" 
                                height="200" 
                                className="qr-code-img"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
