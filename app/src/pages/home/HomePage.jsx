import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, FileText, Phone, Activity, GraduationCap,
    Building2, MessageSquare, ArrowRight, ShieldCheck,
    HeartPulse, Store, QrCode, Copy, Check,
    ExternalLink
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { villageService } from '../../features/village/api/village';
import { announcementService } from '../../features/announcements/api/announcements';
import { schemeService } from '../../features/schemes/api/schemes';
import { contactService } from '../../features/contacts/api/contacts';
import { healthcareService } from '../../features/healthcare/api/healthcare';
import { educationService } from '../../features/education/api/education';
import { businessService } from '../../features/businesses/api/businesses';
import { AnnouncementCard } from '../../features/announcements/components/AnnouncementCard';
import { SchemeCard } from '../../features/schemes/components/SchemeCard';
import { ContactCard } from '../../features/contacts/components/ContactCard';
import { HealthcareCard } from '../../features/healthcare/components/HealthcareCard';
import { EducationCard } from '../../features/education/components/EducationCard';
import { BusinessCard } from '../../features/businesses/components/BusinessCard';
import { FeedbackForm } from '../../features/feedback/components/FeedbackForm';
import { VillageSpotlight } from '../../features/village/components/VillageSpotlight';
import { getLocalized } from '../../i18n';

export function HomePage() {
    const { lang, t } = useAppContext();
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
    const [copiedUrl, setCopiedUrl] = useState(false);
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

    const LIVE_PORTAL_URL = 'https://villagemitra.vercel.app';
    const isLocalhost = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.')
    );
    // On localhost or local networks, target the live production deployment so phone cameras can connect over cellular data:
    const portalUrl = isLocalhost ? LIVE_PORTAL_URL : (window.location.origin || LIVE_PORTAL_URL);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(LIVE_PORTAL_URL)}`;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(portalUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
    };

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
                                ? `${village.gram_panchayat} Gram Panchayat | ${village.mandal} Mandal | ${village.district} District`
                                : (t?.portalSubtitle || 'Village Information Gateway • Academic CSP Initiative')
                            }
                        </p>

                        {/* Global Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="search-bar-box" style={{ maxWidth: '680px', marginBottom: '1.25rem' }}>
                            <Search size={18} style={{ color: 'var(--color-slate-400)', flexShrink: 0 }} />
                            <input
                                type="text"
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t?.searchPlaceholder || 'Search schemes, contacts, doctors, schools...'}
                                aria-label="Global search query"
                            />
                            <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                                Search
                            </button>
                        </form>

                        {/* Feature Metric Pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <Link to="/healthcare" className="badge badge-verified" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <HeartPulse size={14} style={{ marginRight: '4px' }} /> PHC Healthcare
                            </Link>
                            <Link to="/schemes" className="badge badge-civic" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <FileText size={14} style={{ marginRight: '4px' }} /> Welfare Schemes
                            </Link>
                            <Link to="/contacts" className="badge badge-alert" style={{ textDecoration: 'none', padding: '0.35rem 0.65rem' }}>
                                <Phone size={14} style={{ marginRight: '4px' }} /> 24x7 Helplines
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
                                <ShieldCheck size={16} style={{ color: 'var(--color-emerald-600)' }} />
                                <span>Empowering Rural Habitations Through Verified Digital Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Habitation Profile Spotlight */}
            {village && <VillageSpotlight village={village} lang={lang} />}

            {/* Core Services Bento Grid */}
            <section className="section-block">
                <div className="section-head">
                    <div className="section-title-wrap">
                        <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Public Services</span>
                        <h2 className="section-title">
                            {t?.citizenCornerTitle || 'Citizen Services Hub'}
                        </h2>
                    </div>
                    <p className="section-desc">
                        Direct, verified access to essential village services, government welfare schemes, and emergency administration.
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

            {/* 1. Recent Announcements Highlight */}
            {(loading || announcements.length > 0) && (
                <section className="section-block">
                    <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-alert" style={{ marginBottom: '6px' }}>Notice Board</span>
                            <h2 className="section-title">Important Announcements</h2>
                            <p className="section-desc">Grama Sabha schedules, welfare application drives, and public notices.</p>
                        </div>
                        <Link to="/announcements" className="btn btn-secondary btn-sm">
                            <span>View All Notices</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="card-grid">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="civic-card skeleton-card"></div>
                            ))
                        ) : (
                            announcements.map(a => (
                                <AnnouncementCard key={a.id} announcement={a} lang={lang} />
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* 2. Popular Welfare Schemes Section */}
            {(loading || schemes.length > 0) && (
                <section className="section-block">
                    <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Direct Benefit Transfers</span>
                            <h2 className="section-title">Government Welfare Schemes</h2>
                            <p className="section-desc">Verified entitlement schemes with eligibility guidelines, document checklists, and direct official portals.</p>
                        </div>
                        <Link to="/schemes" className="btn btn-secondary btn-sm">
                            <span>View All Schemes</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="card-grid">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="civic-card skeleton-card"></div>
                            ))
                        ) : (
                            schemes.map(s => (
                                <SchemeCard key={s.id} scheme={s} lang={lang} t={t} />
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* 3. Emergency & Administrative Contacts Section */}
            {(loading || contacts.length > 0) && (
                <section className="section-block">
                    <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-alert" style={{ marginBottom: '6px' }}>Emergency &amp; Administration</span>
                            <h2 className="section-title">Verified Village Contacts</h2>
                            <p className="section-desc">Direct verified phone numbers for Panchayat Administration, Revenue, Police, and 24x7 Helplines.</p>
                        </div>
                        <Link to="/contacts" className="btn btn-secondary btn-sm">
                            <span>View Full Directory</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="card-grid">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="civic-card skeleton-card"></div>
                            ))
                        ) : (
                            contacts.map(c => (
                                <ContactCard key={c.id} contact={c} lang={lang} t={t} />
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* 4. Public Institutions (Healthcare & Education) */}
            {(loading || healthcare.length > 0 || education.length > 0) && (
                <section className="section-block">
                    <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-verified" style={{ marginBottom: '6px' }}>Public Facilities</span>
                            <h2 className="section-title">Primary Healthcare &amp; Public Schools</h2>
                            <p className="section-desc">Operating hours, doctor OPD schedules, and school facilities serving Modavalasa village.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Link to="/healthcare" className="btn btn-secondary btn-sm">
                                <span>All Healthcare</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link to="/education" className="btn btn-secondary btn-sm">
                                <span>All Schools</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="card-grid">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="civic-card skeleton-card"></div>
                            ))
                        ) : (
                            <>
                                {healthcare.map(f => (
                                    <HealthcareCard key={f.id} facility={f} lang={lang} t={t} />
                                ))}
                                {education.map(inst => (
                                    <EducationCard key={inst.id} institution={inst} lang={lang} t={t} />
                                ))}
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* 5. Local Artisans & Businesses Section */}
            {(loading || businesses.length > 0) && (
                <section className="section-block">
                    <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-warning" style={{ marginBottom: '6px' }}>Rural Economy</span>
                            <h2 className="section-title">Local Artisans &amp; Businesses</h2>
                            <p className="section-desc">Handloom weavers, dairy centers, electrical rewinding services, and women's self-help groups.</p>
                        </div>
                        <Link to="/businesses" className="btn btn-secondary btn-sm">
                            <span>View All Artisans &amp; Shops</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="card-grid">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="civic-card skeleton-card"></div>
                            ))
                        ) : (
                            businesses.map(b => (
                                <BusinessCard key={b.id} business={b} lang={lang} t={t} />
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* 6. Citizen Feedback & Grievance Desk Section */}
            <section className="section-block">
                <div className="section-head" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Citizen Engagement</span>
                        <h2 className="section-title">Citizen Feedback &amp; Grievance Desk</h2>
                        <p className="section-desc">Report outdated contact numbers, request new welfare listings, or submit village grievances directly to the CSP research team.</p>
                    </div>
                    <Link to="/feedback" className="btn btn-secondary btn-sm">
                        <span>Dedicated Feedback Page</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                    <FeedbackForm villageId={village?.id} t={t} />
                </div>
            </section>

            {/* 7. Mobile QR Code Access */}
            <section className="section-block">
                <div className="portal-qr-card">
                    <div className="portal-qr-content">
                        {/* <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-blue-50)', color: 'var(--color-blue-700)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid var(--color-blue-200)' }}>
                            <QrCode size={14} />
                            <span>Mobile Phone Access • Live Cellular Link</span>
                        </div> */}
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-slate-950)', marginBottom: '0.5rem' }}>
                            Scan to Open on Smartphone
                        </h3>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                            Point any mobile camera at this QR code to access the live portal over cellular internet. Ideal for examiner evaluations, field surveying, and citizen onboarding on iOS and Android devices.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button type="button" onClick={handleCopyUrl} className="btn btn-secondary btn-sm" aria-label="Copy portal URL">
                                {copiedUrl ? <Check size={14} style={{ color: 'var(--color-emerald-600)' }} /> : <Copy size={14} />}
                                <span>{copiedUrl ? 'Copied to Clipboard' : 'Copy Live Portal URL'}</span>
                            </button>
                            <a
                                href={portalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.8125rem',
                                    color: 'var(--color-blue-600)',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 600,
                                    textDecoration: 'underline'
                                }}
                            >
                                <span>{portalUrl}</span>
                                <ExternalLink size={13} />
                            </a>
                        </div>
                    </div>
                    <div className="portal-qr-frame">
                        <img
                            src={qrCodeUrl}
                            alt="QR code to open live portal on mobile"
                            width="140"
                            height="140"
                        />
                        <span className="portal-qr-caption">Scan with Camera</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
