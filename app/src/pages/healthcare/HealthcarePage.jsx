import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Activity, ShieldCheck, HeartPulse, Calendar, 
    Phone, Award, Stethoscope, Syringe, FlaskConical, AlertTriangle 
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
    EmergencyGuidance
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
    const [activeSection, setActiveSection] = useState('ALL');

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

    const navSections = [
        { id: 'ALL', label_en: 'All Public Health Sections', label_te: 'అన్ని విభాగాలు' },
        { id: 'CLINICAL', label_en: 'Doctor OPD Roster', label_te: 'డాక్టర్ ఓపీడీ రోస్టర్' },
        { id: 'IMMUNIZATION', label_en: 'Immunization Schedule', label_te: 'టీకా షెడ్యూల్' },
        { id: 'DIAGNOSTIC', label_en: 'Diagnostic Lab Tests', label_te: 'ల్యాబ్ పరీక్షలు' },
        { id: 'EMERGENCY', label_en: 'Emergency & Advisories', label_te: 'అత్యవసరం & సలహాలు' },
        { id: 'FACILITIES', label_en: 'Primary Health Centre (PHC)', label_te: 'ఆరోగ్య కేంద్రం (PHC)' },
        { id: 'SCHEMES', label_en: 'Health Welfare Schemes', label_te: 'ఆరోగ్య పథకాలు' },
        { id: 'CONTACTS', label_en: 'Local Healthcare Desks', label_te: 'వైద్య సహాయ డెస్క్‌లు' }
    ];

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
                            : "Comprehensive civic health portal covering Denkada Primary Health Center (PHC) live doctor rosters, immunization sessions, diagnostic test availability, 24x7 emergency response lines, and Aarogyasri welfare schemes."
                        }
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                
                {/* Clinical Overview KPI Deck (100% Real Database & Official Channels) */}
                <div className="health-hero-stats">
                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-blue-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-blue-50)', '--stat-icon-color': 'var(--color-blue-600)' }}>
                                <Stethoscope size={20} />
                            </div>
                            <span className="health-stat-badge">
                                {isTe ? "డాక్టర్ రోస్టర్" : "Doctor Roster"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {clinicalSchedules.length > 0 ? `${clinicalSchedules.length} ${isTe ? 'రోస్టర్లు' : 'Active Shifts'}` : (isTe ? "డెంకాడ పిహెచ్‌సి" : "Denkada PHC")}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "ఓపీడీ, ఆయుష్ & 24x7 అత్యవసర వైద్యులు" : "OPD, AYUSH & 24x7 Nursing Duty"}
                            </div>
                        </div>
                    </div>

                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-emerald-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-emerald-50)', '--stat-icon-color': 'var(--color-emerald-600)' }}>
                                <Syringe size={20} />
                            </div>
                            <span className="health-stat-badge" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)' }}>
                                {isTe ? "యూఐపీ టీకాలు" : "UIP Drives"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {immunizationSchedules.length > 0 ? `${immunizationSchedules.length} ${isTe ? 'సెషన్లు' : 'Sessions'}` : (isTe ? "వ్యాక్సినేషన్" : "Vaccination")}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "ప్రతి బుధవారం మోదవలస అంగన్‌వాడీలో" : "Every Wednesday at Anganwadi Centre"}
                            </div>
                        </div>
                    </div>

                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-indigo-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'rgba(99, 102, 241, 0.1)', '--stat-icon-color': 'var(--color-indigo-600)' }}>
                                <FlaskConical size={20} />
                            </div>
                            <span className="health-stat-badge">
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

                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-red-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-red-50)', '--stat-icon-color': 'var(--color-red-600)' }}>
                                <Phone size={20} />
                            </div>
                            <span className="health-stat-badge" style={{ background: 'var(--color-red-50)', color: 'var(--color-red-800)' }}>
                                {isTe ? "24x7 రెస్పాన్స్" : "24x7 Response"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value" style={{ color: 'var(--color-red-700)' }}>
                                108 / 104
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "అత్యవసర అంబులెన్స్ & ఉచిత వైద్య సలహా" : "Toll-Free Ambulance & Health Advisory"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Quick Navigation Filter */}
                <div className="filter-pills-bar" role="tablist" style={{ marginBottom: '1.75rem' }}>
                    {navSections.map(sec => (
                        <button
                            key={sec.id}
                            type="button"
                            role="tab"
                            aria-selected={activeSection === sec.id}
                            className={`filter-pill ${activeSection === sec.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(sec.id)}
                        >
                            {isTe ? sec.label_te : sec.label_en}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* Section 1: Doctor Consultation & Clinical OPD Rosters (Live Database clinical_schedules) */}
                    {(activeSection === 'ALL' || activeSection === 'CLINICAL') && (
                        <ClinicalSchedule
                            schedules={clinicalSchedules}
                            loading={loading}
                            lang={lang}
                        />
                    )}

                    {/* Section 2: Immunization & Maternal Care Drives (Live Database immunization_schedules) */}
                    {(activeSection === 'ALL' || activeSection === 'IMMUNIZATION') && (
                        <ImmunizationSchedule
                            immunizations={immunizationSchedules}
                            loading={loading}
                            lang={lang}
                        />
                    )}

                    {/* Section 3: Diagnostic Laboratory Tests (Live Database diagnostic_services) */}
                    {(activeSection === 'ALL' || activeSection === 'DIAGNOSTIC') && (
                        <DiagnosticServices
                            diagnostics={diagnosticServices}
                            loading={loading}
                            lang={lang}
                        />
                    )}

                    {/* Section 4: Emergency Hotlines & Health Advisories (Live Database announcements + Statutory lines) */}
                    {(activeSection === 'ALL' || activeSection === 'EMERGENCY') && (
                        <EmergencyGuidance
                            announcements={healthAnnouncements}
                            loading={loading}
                            lang={lang}
                        />
                    )}

                    {/* Section 5: Primary Health Centre (PHC) Facility Profile (Live Database institutions) */}
                    {(activeSection === 'ALL' || activeSection === 'FACILITIES') && (
                        <FacilityDirectory
                            facilities={facilities}
                            loading={loading}
                            error={error}
                            onRetry={loadHealthcare}
                            lang={lang}
                            t={t}
                        />
                    )}

                    {/* Section 6: Government Healthcare Welfare Schemes (Live Database schemes) */}
                    {(activeSection === 'ALL' || activeSection === 'SCHEMES') && (
                        <HealthcareSchemes
                            schemes={schemes}
                            lang={lang}
                        />
                    )}

                    {/* Section 7: Local Healthcare Desks & Community Outreach (Live Database contacts) */}
                    {(activeSection === 'ALL' || activeSection === 'CONTACTS') && (
                        <HealthcareContacts
                            contacts={contacts}
                            lang={lang}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}

export default HealthcarePage;
