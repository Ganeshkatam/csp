import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, FileText, Phone, Activity, GraduationCap,
    Building2, MessageSquare, ArrowRight, ShieldCheck,
    HeartPulse, Store, Calendar, CheckCircle2,
    Landmark, X
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { villageService } from '../../features/village/api/village';
import { announcementService } from '../../features/announcements/api/announcements';
import { schemeService } from '../../features/schemes/api/schemes';
import { contactService } from '../../features/contacts/api/contacts';
import { healthcareService } from '../../features/healthcare/api/healthcare';
import { educationService } from '../../features/education/api/education';
import { businessService } from '../../features/businesses/api/businesses';
import { SchemeCard } from '../../features/schemes/components/SchemeCard';
import { ContactCard } from '../../features/contacts/components/ContactCard';
import { HealthcareCard } from '../../features/healthcare/components/HealthcareCard';
import { EducationCard } from '../../features/education/components/EducationCard';
import { BusinessCard } from '../../features/businesses/components/BusinessCard';
import { getLocalized } from '../../i18n';
import { createTelLink } from '../../utils/phone';

export function HomePage() {
    const { lang, t } = useAppContext();
    const isTe = lang === 'te';
    const [pageData, setPageData] = useState({
        village: null,
        announcements: [],
        schemes: [],
        contacts: [],
        healthcare: [],
        education: [],
        businesses: []
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeExplorerTab, setActiveExplorerTab] = useState('schemes'); // 'schemes' | 'contacts' | 'facilities' | 'businesses'
    const navigate = useNavigate();

    const { village, announcements, schemes, contacts, healthcare, education, businesses } = pageData;

    useEffect(() => {
        let isMounted = true;

        Promise.allSettled([
            villageService.getVillageProfile(),
            announcementService.getAnnouncements(),
            schemeService.getAllSchemes(),
            contactService.getContacts(),
            healthcareService.getHealthcareFacilities(),
            educationService.getEducationInstitutions(),
            businessService.getBusinesses()
        ]).then(([vRes, aRes, sRes, cRes, hRes, eRes, bRes]) => {
            if (!isMounted) return;
            setPageData({
                village: vRes.status === 'fulfilled' && vRes.value ? vRes.value : null,
                announcements: aRes.status === 'fulfilled' && Array.isArray(aRes.value) ? aRes.value.slice(0, 3) : [],
                schemes: sRes.status === 'fulfilled' && Array.isArray(sRes.value) ? sRes.value.slice(0, 4) : [],
                contacts: cRes.status === 'fulfilled' && Array.isArray(cRes.value) ? cRes.value.slice(0, 4) : [],
                healthcare: hRes.status === 'fulfilled' && Array.isArray(hRes.value) ? hRes.value.slice(0, 2) : [],
                education: eRes.status === 'fulfilled' && Array.isArray(eRes.value) ? eRes.value.slice(0, 2) : [],
                businesses: bRes.status === 'fulfilled' && Array.isArray(bRes.value) ? bRes.value.slice(0, 4) : []
            });
            setLoading(false);
        }).catch(err => {
            console.error('Home data load error:', err);
            if (isMounted) setLoading(false);
        });

        return () => { isMounted = false; };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const hubs = [
        {
            to: '/schemes',
            title: t?.hubSchemesTitle || 'Government Welfare Schemes',
            desc: t?.hubSchemesDesc || 'Check eligibility criteria, required documents checklists, and direct official portal links.',
            icon: <FileText size={22} />,
            theme: 'hub-theme-blue',
            actionText: 'Browse Schemes'
        },
        {
            to: '/contacts',
            title: t?.hubContactsTitle || 'Emergency & Admin Contacts',
            desc: t?.hubContactsDesc || 'Direct verified phone numbers for Panchayat, Police, Medical Staff, and Linemen.',
            icon: <Phone size={22} />,
            theme: 'hub-theme-red',
            actionText: 'Emergency Directory'
        },
        {
            to: '/healthcare',
            title: t?.hubHealthTitle || 'Primary Health Centre (PHC)',
            desc: t?.hubHealthDesc || 'Doctor OPD timings, maternal immunization schedule, and operating hours indicator.',
            icon: <Activity size={22} />,
            theme: 'hub-theme-emerald',
            actionText: 'Healthcare Timings'
        },
        {
            to: '/education',
            title: t?.hubSchoolsTitle || 'Education & Anganwadi',
            desc: t?.hubSchoolsDesc || 'Mandal Parishad School, student capacity, mid-day meals, and Headmaster details.',
            icon: <GraduationCap size={22} />,
            theme: 'hub-theme-indigo',
            actionText: 'School Facilities'
        },
        {
            to: '/businesses',
            title: t?.hubBizTitle || 'Local Businesses & SHGs',
            desc: t?.hubBizDesc || 'Artisans, motor rewinding electricians, mechanics, and women\'s self-help groups.',
            icon: <Building2 size={22} />,
            theme: 'hub-theme-amber',
            actionText: 'Artisans & Shops'
        },
        {
            to: '/feedback',
            title: t?.hubFeedbackTitle || 'Citizen Feedback Desk',
            desc: t?.hubFeedbackDesc || 'Request information updates, report outdated numbers, or suggest new listings.',
            icon: <MessageSquare size={22} />,
            theme: 'hub-theme-slate',
            actionText: 'Submit Correction'
        }
    ];

    const infraObservations = [
        { service: 'Drinking Water', observation: 'Functional RO filtration plant & overhead reservoir', source: 'CSP Field Survey & Panchayat', date: 'Aug 2024' },
        { service: 'Rural Electricity', observation: '24x7 domestic grid supply; agricultural feeder on scheduled roster', source: 'APCPDCL Rural Feeder Log', date: 'Aug 2024' },
        { service: 'Concrete Roads', observation: 'Internal CC roads completed; main approach road under maintenance', source: 'Gram Panchayat Records', date: 'Aug 2024' },
        { service: 'Streetlights', observation: 'LED street fixtures installed across primary habitation lanes', source: 'Field Survey Observation', date: 'Aug 2024' },
        { service: 'Sanitation', observation: 'Surface drainage with periodic sanitation; waste collection active', source: 'Swachh Habitation Log', date: 'Aug 2024' }
    ];

    return (
        <div className="container">
            {/* Civic Hero */}
            <section className="civic-hero modern-split-hero">
                <div className="hero-grid-layout">
                    <div className="hero-content-col">
                        <div className="hero-project-badge">
                            <span className="badge-dot" aria-hidden="true"></span>
                            <span>{t?.projectBadge || 'Academic CSP Initiative • B.Tech CSE'}</span>
                        </div>

                        <h1 className="hero-title">
                            {village?.name ? `${t?.welcomeTo || 'Welcome to'} ${getLocalized(village, 'name', lang)}` : 'Village Mitra'}
                            <span className="hero-title-suffix"> {t?.portalTitleEn || 'Portal'}</span>
                        </h1>

                        <div className="hero-regional-badge">
                            <span>{t?.portalTitleRegional || 'గ్రామ మిత్ర'}</span>
                        </div>

                        <p className="hero-subtitle">
                            {village?.gram_panchayat
                                ? `${village.gram_panchayat} Gram Panchayat • ${village.mandal} Mandal • ${village.district} District • ${village.state || 'Andhra Pradesh'}`
                                : (t?.portalSubtitle || 'Village Information Gateway • Academic CSP Initiative')
                            }
                        </p>

                        {/* Global Unified Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="hero-search-form">
                            <div className="hero-search-icon-badge" aria-hidden="true">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                className="hero-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t?.searchPlaceholder || 'Search schemes, contacts, doctors, schools...'}
                                aria-label="Global search query"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="hero-search-clear-btn"
                                    aria-label="Clear search query"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <button type="submit" className="hero-search-submit-btn">
                                <Search size={14} />
                                <span>{isTe ? "శోధించండి" : "Search"}</span>
                            </button>
                        </form>

                        {/* Fast Navigation Shortcut Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <Link to="/schemes" className="badge badge-civic" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <FileText size={14} style={{ marginRight: '4px' }} /> Welfare Schemes
                            </Link>
                            <Link to="/contacts" className="badge badge-alert" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <Phone size={14} style={{ marginRight: '4px' }} /> Verified Contacts
                            </Link>
                            <Link to="/healthcare" className="badge badge-verified" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <HeartPulse size={14} style={{ marginRight: '4px' }} /> PHC Healthcare
                            </Link>
                            <Link to="/businesses" className="badge badge-warning" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <Store size={14} style={{ marginRight: '4px' }} /> Local Artisans
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual-col">
                        <div className="hero-illustration-frame">
                            <img
                                src="/images/rural_village_illustration.jpg"
                                alt="Digital Village Civic Community Landscape"
                                className="hero-illustration-img"
                            />
                            <div className="hero-illustration-caption">
                                <div className="hero-caption-left">
                                    <div className="hero-caption-icon">
                                        <ShieldCheck size={17} />
                                    </div>
                                    <div className="hero-caption-text">
                                        <span className="hero-caption-title">
                                            {isTe ? "అధికారిక గ్రామీణ సమాచార వేదిక" : "Authoritative Rural Information Gateway"}
                                        </span>
                                        <span className="hero-caption-sub">
                                            {isTe ? "మోదవలస గ్రామ సచివాలయం • డెంకాడ" : "Modavalasa Gram Panchayat • Denkada"}
                                        </span>
                                    </div>
                                </div>
                                <span className="hero-caption-tag">
                                    <span className="hero-caption-dot" aria-hidden="true"></span>
                                    <span>{isTe ? "ధృవీకరించబడింది" : "Verified"}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Important Information & Verified Notices */}
            {(loading || announcements.length > 0) && (
                <section className="section-block" style={{ marginTop: '1.5rem' }}>
                    <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={18} style={{ color: 'var(--color-blue-600)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-slate-900)' }}>
                                    Important Notices &amp; Announcements
                                </h3>
                                <span className="badge badge-verified" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                                    Grama Panchayat Verified
                                </span>
                            </div>
                            <Link to="/announcements" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
                                <span>View All Notices</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="civic-card skeleton-card" style={{ height: '90px' }}></div>
                                ))
                            ) : (
                                announcements.map(a => (
                                    <Link
                                        key={a.id}
                                        to={`/announcements/${a.id}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            padding: '0.85rem 1rem',
                                            background: 'var(--color-slate-50)',
                                            border: '1px solid var(--color-slate-200)',
                                            borderRadius: 'var(--radius-md)',
                                            textDecoration: 'none',
                                            transition: 'transform 0.15s ease, border-color 0.15s ease'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                                <span className="badge badge-alert" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                                                    {a.category || 'Public Notice'}
                                                </span>
                                                {a.event_date && (
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', fontWeight: 600 }}>
                                                        {new Date(a.event_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '0 0 0.25rem', lineHeight: '1.3' }}>
                                                {getLocalized(a, 'title', lang)}
                                            </h4>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-blue-600)', marginTop: '0.5rem' }}>
                                            <span>Read details</span>
                                            <ArrowRight size={12} />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* 4. Core Public Services Directory (6 Bento Hubs) */}
            <section className="section-block">
                <div className="section-head">
                    <div className="section-title-wrap">
                        <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Public Services Gateway</span>
                        <h2 className="section-title">
                            {t?.citizenCornerTitle || 'Citizen Services Hub'}
                        </h2>
                    </div>
                    <p className="section-desc">
                        Direct, verified access to essential village services, welfare schemes, public facilities, and administrative contacts.
                    </p>
                </div>

                <div className="bento-service-grid">
                    {hubs.map((hub, idx) => (
                        <Link key={idx} to={hub.to} className={`bento-hub-card ${hub.theme}`}>
                            <div className="bento-hub-header">
                                <div className="bento-icon-box" aria-hidden="true">
                                    {hub.icon}
                                </div>
                            </div>
                            <div className="bento-hub-body">
                                <h3 className="bento-hub-title">{hub.title}</h3>
                                <p className="bento-hub-desc">{hub.desc}</p>
                            </div>
                            <div className="bento-hub-footer">
                                <span className="bento-action-label">{hub.actionText}</span>
                                <ArrowRight size={14} aria-hidden="true" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 5. Curated Village Data Explorer (Interactive Tabbed Representation) */}
            <section className="section-block">
                <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="badge badge-verified" style={{ marginBottom: '6px' }}>Verified Directory</span>
                        <h2 className="section-title">Explore Village Records &amp; Services</h2>
                        <p className="section-desc">Curated entries verified against official government notifications and field survey findings.</p>
                    </div>
                </div>

                {/* Tab Navigation Controls */}
                <div className="civic-explorer-tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeExplorerTab === 'schemes'}
                        className={`civic-explorer-tab ${activeExplorerTab === 'schemes' ? 'active' : ''}`}
                        onClick={() => setActiveExplorerTab('schemes')}
                    >
                        <FileText size={16} />
                        <span>Welfare Schemes</span>
                        <span className="civic-explorer-tab-badge">{schemes.length}</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeExplorerTab === 'contacts'}
                        className={`civic-explorer-tab ${activeExplorerTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => setActiveExplorerTab('contacts')}
                    >
                        <Phone size={16} />
                        <span>Administration &amp; Contacts</span>
                        <span className="civic-explorer-tab-badge">{contacts.length}</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeExplorerTab === 'facilities'}
                        className={`civic-explorer-tab ${activeExplorerTab === 'facilities' ? 'active' : ''}`}
                        onClick={() => setActiveExplorerTab('facilities')}
                    >
                        <Activity size={16} />
                        <span>Healthcare &amp; Schools</span>
                        <span className="civic-explorer-tab-badge">{healthcare.length + education.length}</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeExplorerTab === 'businesses'}
                        className={`civic-explorer-tab ${activeExplorerTab === 'businesses' ? 'active' : ''}`}
                        onClick={() => setActiveExplorerTab('businesses')}
                    >
                        <Store size={16} />
                        <span>Artisans &amp; Local Economy</span>
                        <span className="civic-explorer-tab-badge">{businesses.length}</span>
                    </button>
                </div>

                {/* Tab Content Display Area */}
                <div>
                    {activeExplorerTab === 'schemes' && (
                        <div>
                            <div className="card-grid">
                                {schemes.map(s => (
                                    <SchemeCard key={s.id} scheme={s} lang={lang} t={t} />
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <Link to="/schemes" className="btn btn-secondary btn-sm">
                                    <span>Browse All Verified Schemes ({schemes.length})</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeExplorerTab === 'contacts' && (
                        <div>
                            <div className="card-grid">
                                {contacts.map(c => (
                                    <ContactCard key={c.id} contact={c} lang={lang} t={t} />
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <Link to="/contacts" className="btn btn-secondary btn-sm">
                                    <span>View Complete Contact Directory</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeExplorerTab === 'facilities' && (
                        <div>
                            <div className="card-grid">
                                {healthcare.map(f => (
                                    <HealthcareCard key={f.id} facility={f} lang={lang} t={t} variant="vertical" />
                                ))}
                                {education.map(inst => (
                                    <EducationCard key={inst.id} institution={inst} lang={lang} t={t} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                <Link to="/healthcare" className="btn btn-secondary btn-sm">
                                    <span>PHC Operating Schedule</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <Link to="/education" className="btn btn-secondary btn-sm">
                                    <span>School Facilities &amp; Mid-Day Meals</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeExplorerTab === 'businesses' && (
                        <div>
                            <div className="card-grid">
                                {businesses.map(b => (
                                    <BusinessCard key={b.id} business={b} lang={lang} t={t} />
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <Link to="/businesses" className="btn btn-secondary btn-sm">
                                    <span>View All Village Artisans &amp; Shops</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 6. Habitation Demographics & Infrastructure Status */}
            <section className="section-block">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                    {/* Left: Census 2011 Demographics */}
                    <div className="civic-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                            <Landmark size={18} style={{ color: 'var(--color-blue-600)' }} />
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0 }}>
                                Habitation Demographics
                            </h3>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            Data Source: Census 2011 (Village Code: 582885, Modavalasa)
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                            Official administrative baseline figures under Denkada Mandal, Vizianagaram District.
                        </p>

                        <div className="demographics-factsheet-grid">
                            <div className="factsheet-stat-card">
                                <span className="factsheet-stat-label">Total Population</span>
                                <span className="factsheet-stat-value">1,842</span>
                                <span className="factsheet-stat-sub">Census 2011 official</span>
                            </div>
                            <div className="factsheet-stat-card">
                                <span className="factsheet-stat-label">Households</span>
                                <span className="factsheet-stat-value">468</span>
                                <span className="factsheet-stat-sub">Census 2011 official</span>
                            </div>
                            <div className="factsheet-stat-card">
                                <span className="factsheet-stat-label">Literacy Rate</span>
                                <span className="factsheet-stat-value">68.4%</span>
                                <span className="factsheet-stat-sub">Census 2011 official</span>
                            </div>
                            <div className="factsheet-stat-card">
                                <span className="factsheet-stat-label">Geographic Area</span>
                                <span className="factsheet-stat-value">342 Ha</span>
                                <span className="factsheet-stat-sub">Total village territory</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-200)', fontSize: '0.72rem', color: 'var(--color-slate-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Unsurveyed metrics: <em>Not yet verified</em></span>
                            <Link to="/village" style={{ fontWeight: 600, color: 'var(--color-blue-600)' }}>Full Profile &rarr;</Link>
                        </div>
                    </div>

                    {/* Right: Infrastructure Observation Status Matrix */}
                    <div className="civic-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                            <CheckCircle2 size={18} style={{ color: 'var(--color-emerald-600)' }} />
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0 }}>
                                Civic Infrastructure Status
                            </h3>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            CSP Ground Survey Observations (Verified Aug 2024)
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                            Verifiable field assessments across key public utilities serving Modavalasa habitation.
                        </p>

                        <table className="infra-ledger-table" aria-label="Infrastructure status table">
                            <thead>
                                <tr>
                                    <th>Utility</th>
                                    <th>Observed Status</th>
                                    <th>Verification Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                {infraObservations.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: 700 }}>{item.service}</td>
                                        <td>{item.observation}</td>
                                        <td style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>{item.source}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 7. Citizen Feedback & Verification Desk Callout */}
            <section className="section-block" style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ maxWidth: '640px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, color: '#93c5fd', marginBottom: '0.75rem' }}>
                            <MessageSquare size={14} />
                            <span>Community Feedback Desk • Transparent Redressal</span>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                            Keep Village Records Accurate &amp; Verified
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                            Report outdated telephone numbers, modified clinic timings, or suggest local business and artisan listings. Track your submission status securely using your unique Reference ID.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link to="/feedback" className="btn btn-primary" style={{ background: 'var(--color-blue-600)', color: '#ffffff', fontWeight: 700, border: 'none' }}>
                            <span>Submit Record Update</span>
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
