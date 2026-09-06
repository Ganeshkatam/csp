import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Activity, ShieldCheck, HeartPulse, Calendar, 
    AlertTriangle, Phone, FileText, CheckCircle2 
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { 
    healthcareService, 
    EmergencyBanner, 
    FacilityDirectory, 
    ClinicalSchedule, 
    ImmunizationSchedule, 
    DiagnosticServices, 
    EmergencyGuidance 
} from '../../features/healthcare';

export function HealthcarePage() {
    const { institutionId } = useParams();
    const { lang, t } = useAppContext();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('ALL');

    const isTe = lang === 'te';

    const loadHealthcare = () => {
        setLoading(true);
        setError(null);
        healthcareService.getHealthcareFacilities()
            .then(data => {
                if (institutionId) {
                    const filtered = (data || []).filter(f => String(f.id) === String(institutionId));
                    setFacilities(filtered.length > 0 ? filtered : data);
                } else {
                    setFacilities(data || []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading healthcare facilities:', err);
                setError(err.message || 'Failed to load healthcare facilities from database.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadHealthcare();
    }, [institutionId]);

    const navSections = [
        { id: 'ALL', label_en: 'All Public Health Sections', label_te: 'అన్ని విభాగాలు' },
        { id: 'EMERGENCY', label_en: 'Emergency Helplines', label_te: 'అత్యవసర హెల్ప్‌లైన్లు' },
        { id: 'FACILITIES', label_en: 'PHC & Staff Directory', label_te: 'ఆరోగ్య కేంద్రం & సిబ్బంది' },
        { id: 'SCHEDULE', label_en: 'Weekly OPD Schedule', label_te: 'వారపు ఓపిడి వివరాలు' },
        { id: 'IMMUNIZATION', label_en: 'Routine Immunization (UIP)', label_te: 'సాధారణ టీకాలు (UIP)' },
        { id: 'DIAGNOSTICS', label_en: 'Diagnostics & Screening', label_te: 'నిర్ధారణ & స్క్రీనింగ్' },
        { id: 'FIRST_AID', label_en: 'First-Aid Protocols', label_te: 'ప్రథమ చికిత్స మార్గదర్శకాలు' }
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
                    </div>
                    <h1 className="page-title">
                        {isTe ? "ఆరోగ్య సేవలు & ప్రాథమిక ఆరోగ్య కేంద్రం (PHC)" : "Healthcare & Primary Health Services"}
                    </h1>
                    <p className="page-subtitle">
                        {isTe
                            ? "మోదవలస పరిధిలోని డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) ప్రచురిత ఓపిడి వేళలు, జాతీయ టీకాల పట్టిక, ప్రభుత్వ ల్యాబ్ పరీక్షలు మరియు 24x7 అత్యవసర ప్రథమ చికిత్స మార్గదర్శకాలు."
                            : "Comprehensive civic health portal covering Denkada Primary Health Center (PHC) facilities, published clinical OPD timetables, the National Immunization Schedule, diagnostic screening availability, and evidence-based emergency first-aid protocols."
                        }
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                
                {/* Clinical Overview KPI Deck */}
                <div className="health-hero-stats">
                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-emerald-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-emerald-50)', '--stat-icon-color': 'var(--color-emerald-600)' }}>
                                <Activity size={20} />
                            </div>
                            <span className="health-stat-badge">
                                {isTe ? "ప్రాథమిక కేంద్రం" : "Primary Center"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {isTe ? "డెంకాడ పిహెచ్‌సి" : "Denkada PHC"}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "మోదవలస నుండి 3.2 కి.మీ. దూరంలో మండల కేంద్రం" : "3.2 km at Mandal HQ serving Modavalasa"}
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

                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-blue-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-blue-50)', '--stat-icon-color': 'var(--color-blue-600)' }}>
                                <Calendar size={20} />
                            </div>
                            <span className="health-stat-badge">
                                {isTe ? "వారపు ఓపిడి" : "Weekly OPD"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {isTe ? "సోమ - శని (6 రోజులు)" : "Mon - Sat (6 Days)"}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "ఉదయం 9:00 నుండి సాయంత్రం 4:00 వరకు ఓపిడి" : "9:00 AM - 4:00 PM Active Outpatient Care"}
                            </div>
                        </div>
                    </div>

                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-teal-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-teal-50)', '--stat-icon-color': 'var(--color-teal-700)' }}>
                                <HeartPulse size={20} />
                            </div>
                            <span className="health-stat-badge" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)' }}>
                                {isTe ? "100% ఉచితం" : "100% Free Coverage"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {isTe ? "10 జీవన దశలు" : "10 Life Milestones"}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "జాతీయ సార్వత్రిక రోగనిరోధక టీకాలు (UIP)" : "Universal Immunization Programme Roster"}
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

                {/* Section 1: 24x7 Emergency Response Helplines */}
                {(activeSection === 'ALL' || activeSection === 'EMERGENCY') && (
                    <EmergencyBanner lang={lang} />
                )}

                {/* Section 2: PHC & Healthcare Facilities (Level A: Live Supabase Records) */}
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

                {/* Section 3: Published Clinical Services Schedule (Level A: Local Notice Board) */}
                {(activeSection === 'ALL' || activeSection === 'SCHEDULE') && (
                    <ClinicalSchedule lang={lang} />
                )}

                {/* Section 4: National Routine Immunization Schedule (Level B: MoHFW UIP Standard) */}
                {(activeSection === 'ALL' || activeSection === 'IMMUNIZATION') && (
                    <ImmunizationSchedule lang={lang} />
                )}

                {/* Section 5: Selected Diagnostic & Screening Services (Level B Standards + Level A Facility Status) */}
                {(activeSection === 'ALL' || activeSection === 'DIAGNOSTICS') && (
                    <DiagnosticServices lang={lang} />
                )}

                {/* Section 6: Emergency First-Aid Protocols (Level B: NCDC/NRCP Standards) */}
                {(activeSection === 'ALL' || activeSection === 'FIRST_AID') && (
                    <EmergencyGuidance lang={lang} />
                )}

            </div>
        </div>
    );
}

export default HealthcarePage;

