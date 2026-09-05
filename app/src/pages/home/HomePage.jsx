import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Search, FileText, Phone, Activity, GraduationCap, 
    Building2, MessageSquare, ArrowRight, ShieldCheck, 
    HeartPulse, Store, Bell, Landmark, QrCode, Copy, Check 
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { villageService } from '../../features/village/api/village';
import { announcementService } from '../../features/announcements/api/announcements';
import { AnnouncementCard } from '../../features/announcements/components/AnnouncementCard';
import { VillageSpotlight } from '../../features/village/components/VillageSpotlight';
import { getLocalized } from '../../i18n';

export function HomePage() {
    const { lang, t } = useAppContext();
    const [village, setVillage] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedUrl, setCopiedUrl] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        villageService.getVillageProfile().then(data => {
            if (data) setVillage(data);
        });
        announcementService.getAnnouncements().then(data => {
            if (data) setAnnouncements(data.slice(0, 3));
        });
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

    const portalUrl = typeof window !== 'undefined' ? window.location.origin : 'https://villagemitra.vercel.app';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portalUrl)}`;

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
                        <form onSubmit={handleSearchSubmit} className="search-bar-box" style={{ maxWidth: '580px', marginBottom: '1.25rem' }}>
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

            {/* Recent Announcements Highlight */}
            {announcements.length > 0 && (
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
                        {announcements.map(a => (
                            <AnnouncementCard key={a.id} announcement={a} lang={lang} />
                        ))}
                    </div>
                </section>
            )}

            {/* Mobile QR Code Access */}
            <section className="section-block">
                <div className="civic-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', padding: '2rem' }}>
                    <div style={{ maxWidth: '580px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-blue-50)', color: 'var(--color-blue-700)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            <QrCode size={14} />
                            <span>Mobile Phone Access</span>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-slate-950)', marginBottom: '0.5rem' }}>
                            Scan to Open on Smartphone
                        </h3>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                            Point any mobile camera at this QR code to access the live portal over cellular internet. Ideal for examiner evaluations and field surveying.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button type="button" onClick={handleCopyUrl} className="btn btn-secondary btn-sm">
                                {copiedUrl ? <Check size={14} style={{ color: 'var(--color-emerald-600)' }} /> : <Copy size={14} />}
                                <span>{copiedUrl ? 'Copied to Clipboard' : 'Copy Portal URL'}</span>
                            </button>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)', fontFamily: 'var(--font-mono)' }}>
                                {portalUrl}
                            </span>
                        </div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                        <img src={qrCodeUrl} alt="QR code to open portal" style={{ width: '160px', height: '160px', display: 'block' }} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
