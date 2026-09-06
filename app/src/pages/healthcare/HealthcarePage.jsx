import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Activity, ShieldCheck, HeartPulse, Calendar, 
    Phone, Award, Stethoscope, Syringe, FlaskConical, Building2, Users
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { 
    healthcareService, 
    EmergencyBanner, 
    FacilityDirectory, 
    HealthcareContacts, 
    HealthcareSchemes,
    ClinicalSchedule,
    ImmunizationSchedule,
    DiagnosticServices,
    HealthAnnouncements
} from '../../features/healthcare';

export function HealthcarePage() {
    const { institutionId } = useParams();
    const { lang, t } = useAppContext();
    const [facilities, setFacilities] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [clinicalSchedules, setClinicalSchedules] = useState([]);
    const [immunizationSchedules, setImmunizationSchedules] = useState([]);
    const [diagnosticServices, setDiagnosticServices] = useState([]);
    const [healthAnnouncements, setHealthAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL');

    const isTe = lang === 'te';

    const loadHealthcare = () => {
        setLoading(true);
        setError(null);

        Promise.all([
            healthcareService.getHealthcareFacilities(),
            healthcareService.getHealthcareContacts(),
            healthcareService.getHealthcareSchemes(),
            healthcareService.getClinicalSchedules(),
            healthcareService.getImmunizationSchedules(),
            healthcareService.getDiagnosticServices(),
            healthcareService.getHealthcareAnnouncements()
        ])
            .then(([
                facilitiesData, 
                contactsData, 
                schemesData,
                clinicalData,
                immunizationData,
                diagnosticData,
                announcementsData
            ]) => {
                if (institutionId) {
                    const filtered = (facilitiesData || []).filter(f => String(f.id) === String(institutionId));
                    setFacilities(filtered.length > 0 ? filtered : facilitiesData);
                } else {
                    setFacilities(facilitiesData || []);
                }
                setContacts(contactsData || []);
                setSchemes(schemesData || []);
                setClinicalSchedules(clinicalData || []);
                setImmunizationSchedules(immunizationData || []);
                setDiagnosticServices(diagnosticData || []);
                setHealthAnnouncements(announcementsData || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading healthcare records from database:', err);
                setError(err.message || 'Failed to load healthcare records from database.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadHealthcare();
    }, [institutionId]);

    const navTabs = [
        { id: 'ALL', label_en: 'All Public Health Sections', label_te: 'అన్ని విభాగాలు' },
        { id: 'PHC', label_en: 'Primary Health Centre (PHC Hub)', label_te: 'పీహెచ్‌సీ కేంద్రం & వైద్యులు' },
        { id: 'VILLAGE', label_en: 'Village Immunization & Outreach', label_te: 'గ్రామ టీకాలు & ఆశా డెస్క్' },
        { id: 'SCHEMES', label_en: 'Aarogyasri Health Schemes', label_te: 'ఆరోగ్యశ్రీ పథకాలు' },
        { id: 'CAMPS', label_en: 'Health Camps & Notices', label_te: 'ఆరోగ్య శిబిరాలు & నోటీసులు' }
    ];

    const scrollToSection = (sectionId) => {
        setActiveTab('ALL');
        setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-verified">
                            <Activity size={12} style={{ marginRight: '3px' }} /> 
                            {isTe ? "ప్రజా ఆరోగ్య మరియు కుటుంబ సంక్షేమం" : "Public Health & Family Welfare"}
                        </span>
                        <span className="badge badge-civic">
                            {isTe ? "డెంకాడ మండల ఆరోగ్య వ్యవస్థ" : "Denkada Mandal Health Network"}
                        </span>
                        <span className="badge badge-verified" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-emerald-800)', borderColor: 'var(--color-emerald-300)' }}>
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} /> 
                            {isTe ? "లైవ్ డేటాబేస్ ద్వారా ధృవీకృతం" : "100% Live Database Verified"}
                        </span>
                    </div>
                    <h1 className="page-title">
                        {isTe ? "ఆరోగ్య సేవలు & ప్రాథమిక ఆరోగ్య కేంద్రం (PHC)" : "Healthcare & Primary Health Services"}
                    </h1>
                    <p className="page-subtitle">
                        {isTe
                            ? "మోదవలస పరిధిలోని డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) అధికారిక డాక్టర్ రోస్టర్, వ్యాక్సినేషన్ షెడ్యూల్, ఉచిత ల్యాబ్ పరీక్షలు, 24x7 అత్యవసర హెల్ప్‌లైన్లు మరియు ఆరోగ్యశ్రీ సంక్షేమ పథకాలు."
                            : "Structured rural health directory linking Denkada Primary Health Centre (PHC) doctor rosters and diagnostic laboratory to Modavalasa village immunization sessions and state welfare schemes."
                        }
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                
                {/* 1. TOP TIER: 24x7 Statutory Emergency Response Lines */}
                <EmergencyBanner lang={lang} />

                {/* 2. Interactive KPI Deck (Anchors to key pillars) */}
                <div className="health-hero-stats" style={{ marginTop: '1.5rem', marginBottom: '1.75rem' }}>
                    <div 
                        className="health-stat-card" 
                        style={{ '--stat-accent': 'var(--color-blue-600)', cursor: 'pointer' }}
                        onClick={() => scrollToSection('phc-hub')}
                        title="Click to view PHC details"
                    >
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-blue-50)', '--stat-icon-color': 'var(--color-blue-600)' }}>
                                <Building2 size={20} />
                            </div>
                            <span className="health-stat-badge">
                                {isTe ? "మండల కేంద్రం" : "PHC Hub"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {isTe ? "డెంకాడ పీహెచ్‌సీ" : "Denkada PHC"}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "మోదవలస నుండి 3.2 కి.మీ. (సోమ-శని 9 AM - 4 PM)" : "3.2 km serving Modavalasa (Mon-Sat 9 AM - 4 PM)"}
                            </div>
                        </div>
                    </div>

                    <div 
                        className="health-stat-card" 
                        style={{ '--stat-accent': 'var(--color-indigo-600)', cursor: 'pointer' }}
                        onClick={() => scrollToSection('clinical-rosters')}
                        title="Click to view Doctor Roster"
                    >
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'rgba(99, 102, 241, 0.1)', '--stat-icon-color': 'var(--color-indigo-600)' }}>
                                <Stethoscope size={20} />
                            </div>
                            <span className="health-stat-badge">
                                {isTe ? "వైద్యుల డ్యూటీ" : "Doctor Roster"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {clinicalSchedules.length > 0 ? `${clinicalSchedules.length} ${isTe ? 'రోస్టర్లు' : 'Active Shifts'}` : (isTe ? "ఓపీడీ వైద్యులు" : "OPD Clinicians")}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "సాధారణ ఓపీడీ, ఆయుష్, నర్సింగ్ & ల్యాబ్ డ్యూటీ" : "General Medicine, AYUSH, Nursing & Lab"}
                            </div>
                        </div>
                    </div>

                    <div 
                        className="health-stat-card" 
                        style={{ '--stat-accent': 'var(--color-emerald-600)', cursor: 'pointer' }}
                        onClick={() => scrollToSection('village-outreach')}
                        title="Click to view Immunization Drives"
                    >
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-emerald-50)', '--stat-icon-color': 'var(--color-emerald-600)' }}>
                                <Syringe size={20} />
                            </div>
                            <span className="health-stat-badge" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)' }}>
                                {isTe ? "గ్రామ టీకాలు" : "Village UIP"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {immunizationSchedules.length > 0 ? `${immunizationSchedules.length} ${isTe ? 'సెషన్లు' : 'Sessions'}` : (isTe ? "వ్యాక్సినేషన్" : "Vaccinations")}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "ప్రతి బుధవారం మోదవలస అంగన్‌వాడీలో" : "Every Wednesday at Modavalasa Anganwadi"}
                            </div>
                        </div>
                    </div>

                    <div 
                        className="health-stat-card" 
                        style={{ '--stat-accent': 'var(--color-teal-600)', cursor: 'pointer' }}
                        onClick={() => scrollToSection('diagnostic-lab')}
                        title="Click to view Diagnostic Tests"
                    >
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-teal-50)', '--stat-icon-color': 'var(--color-teal-700)' }}>
                                <FlaskConical size={20} />
                            </div>
                            <span className="health-stat-badge" style={{ background: 'var(--color-teal-50)', color: 'var(--color-teal-800)' }}>
                                {isTe ? "ఉచిత ల్యాబ్" : "NHM Lab"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {diagnosticServices.length > 0 ? `${diagnosticServices.length} ${isTe ? 'పరీక్షలు' : 'Lab Tests'}` : (isTe ? "ల్యాబ్ సేవలు" : "Diagnostics")}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "రక్తం, మలేరియా, షుగర్ ఉచిత పరీక్షలు" : "Blood, Glucose, Malaria & TB Testing"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Domain Hub Navigation Tabs */}
                <div className="filter-pills-bar" role="tablist" style={{ marginBottom: '2rem' }}>
                    {navTabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`filter-pill ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {isTe ? tab.label_te : tab.label_en}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    
                    {/* =========================================================================
                        PILLAR 1: THE SERVING HOSPITAL HUB — DENKADA PRIMARY HEALTH CENTRE (PHC)
                        Contains: Facility Profile + Doctor OPD Roster + Free Diagnostic Lab
                        ========================================================================= */}
                    {(activeTab === 'ALL' || activeTab === 'PHC') && (
                        <section id="phc-hub" style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-xl, 16px)', padding: '1.75rem', boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)' }}>
                            <div style={{ borderBottom: '1px solid var(--color-slate-200)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                                    <span className="badge badge-verified" style={{ background: 'var(--color-blue-50)', color: 'var(--color-blue-800)', border: '1px solid var(--color-blue-200)' }}>
                                        <Building2 size={12} style={{ marginRight: '3px' }} />
                                        {isTe ? "ప్రధాన మండల ఆసుపత్రి" : "Mandal Health Facility"}
                                    </span>
                                    <span className="badge-level-a">
                                        Level A: Local Verified Record
                                    </span>
                                </div>
                                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.35rem' }}>
                                    {isTe ? "డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) & క్లినికల్ సేవలు" : "Denkada Primary Health Centre (PHC) & Clinical Services"}
                                </h2>
                                <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', margin: 0 }}>
                                    {isTe 
                                        ? "మోదవలస ప్రజలకు సేవలు అందించే ప్రధాన ప్రభుత్వ ఆరోగ్య కేంద్రం, వైద్యుల ఓపీడీ డ్యూటీ మరియు ఉచిత డయాగ్నస్టిక్ ల్యాబ్ వివరాలు."
                                        : "The serving government health facility for Modavalasa village, housing daily medical consultations, delivery ward, and diagnostic laboratory."
                                    }
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* 1.1 Facility Profile */}
                                <FacilityDirectory
                                    facilities={facilities}
                                    loading={loading}
                                    error={error}
                                    onRetry={loadHealthcare}
                                    lang={lang}
                                    t={t}
                                />

                                {/* 1.2 Doctor Consultation & Clinical OPD Rosters (Nested directly under PHC) */}
                                <div id="clinical-rosters">
                                    <ClinicalSchedule
                                        schedules={clinicalSchedules}
                                        loading={loading}
                                        lang={lang}
                                    />
                                </div>

                                {/* 1.3 Diagnostic Laboratory Tests (Nested directly under PHC) */}
                                <div id="diagnostic-lab">
                                    <DiagnosticServices
                                        diagnostics={diagnosticServices}
                                        loading={loading}
                                        lang={lang}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* =========================================================================
                        PILLAR 2: VILLAGE GRASSROOTS HEALTHCARE — MODAVALASA OUTREACH
                        Contains: Universal Immunization Sessions + Local ANM/ASHA Helpdesks
                        ========================================================================= */}
                    {(activeTab === 'ALL' || activeTab === 'VILLAGE') && (
                        <section id="village-outreach" style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-xl, 16px)', padding: '1.75rem', boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)' }}>
                            <div style={{ borderBottom: '1px solid var(--color-slate-200)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                                    <span className="badge badge-verified" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-200)' }}>
                                        <Users size={12} style={{ marginRight: '3px' }} />
                                        {isTe ? "గ్రామీణ ఆరోగ్య సేవలు" : "Village Grassroots Outreach"}
                                    </span>
                                    <span className="badge-level-a">
                                        Modavalasa Habitation
                                    </span>
                                </div>
                                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.35rem' }}>
                                    {isTe ? "గ్రామ మాతా శిశు సంరక్షణ & ఆశా ఫీల్డ్ డెస్క్‌లు" : "Village Maternal & Child Health Outreach (Modavalasa)"}
                                </h2>
                                <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', margin: 0 }}>
                                    {isTe 
                                        ? "మోదవలస అంగన్‌వాడీ కేంద్రంలో జరిగే సార్వత్రిక క్రమబద్ధ వ్యాక్సినేషన్ మరియు స్థానిక ఆశా/ఏఎన్ఎం సహాయ కేంద్రాలు."
                                        : "Field healthcare services conducted directly inside Modavalasa village at the Government Anganwadi Centre."
                                    }
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* 2.1 Immunization Sessions */}
                                <div id="village-immunization">
                                    <ImmunizationSchedule
                                        immunizations={immunizationSchedules}
                                        loading={loading}
                                        lang={lang}
                                    />
                                </div>

                                {/* 2.2 Local Field Helpdesks */}
                                <div id="village-desks">
                                    <HealthcareContacts
                                        contacts={contacts}
                                        lang={lang}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* =========================================================================
                        PILLAR 3: GOVERNMENT HEALTHCARE WELFARE SCHEMES
                        Contains: Dr. NTR Vaidya Seva (Aarogyasri) Cashless Hospitalization
                        ========================================================================= */}
                    {(activeTab === 'ALL' || activeTab === 'SCHEMES') && (
                        <section id="health-schemes">
                            <HealthcareSchemes
                                schemes={schemes}
                                lang={lang}
                            />
                        </section>
                    )}

                    {/* =========================================================================
                        PILLAR 4: ACTIVE HEALTH CAMPS & OFFICIAL PUBLIC HEALTH NOTICES
                        Contains: NCD Screening Camps & Disease Prevention Advisories from Database
                        ========================================================================= */}
                    {(activeTab === 'ALL' || activeTab === 'CAMPS') && (
                        <section id="health-announcements">
                            <HealthAnnouncements
                                announcements={healthAnnouncements}
                                loading={loading}
                                lang={lang}
                            />
                        </section>
                    )}

                </div>

            </div>
        </div>
    );
}

export default HealthcarePage;
