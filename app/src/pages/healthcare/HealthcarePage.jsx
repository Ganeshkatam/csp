import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Activity, ShieldCheck, HeartPulse, Calendar, 
    Phone, Award, PhoneCall 
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { 
    healthcareService, 
    EmergencyBanner, 
    FacilityDirectory, 
    HealthcareContacts, 
    HealthcareSchemes 
} from '../../features/healthcare';

export function HealthcarePage() {
    const { institutionId } = useParams();
    const { lang, t } = useAppContext();
    const [facilities, setFacilities] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [schemes, setSchemes] = useState([]);
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
            healthcareService.getHealthcareSchemes()
        ])
            .then(([facilitiesData, contactsData, schemesData]) => {
                if (institutionId) {
                    const filtered = (facilitiesData || []).filter(f => String(f.id) === String(institutionId));
                    setFacilities(filtered.length > 0 ? filtered : facilitiesData);
                } else {
                    setFacilities(facilitiesData || []);
                }
                setContacts(contactsData || []);
                setSchemes(schemesData || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading healthcare records:', err);
                setError(err.message || 'Failed to load healthcare records from database.');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadHealthcare();
    }, [institutionId]);

    const navSections = [
        { id: 'ALL', label_en: 'All Public Health Sections', label_te: 'అన్ని విభాగాలు' },
        { id: 'EMERGENCY', label_en: 'Emergency Helplines', label_te: 'అత్యవసర హెల్ప్‌లైన్లు' },
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
                    </div>
                    <h1 className="page-title">
                        {isTe ? "ఆరోగ్య సేవలు & ప్రాథమిక ఆరోగ్య కేంద్రం (PHC)" : "Healthcare & Primary Health Services"}
                    </h1>
                    <p className="page-subtitle">
                        {isTe
                            ? "మోదవలస పరిధిలోని డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) అధికారిక వివరాలు, 24x7 అత్యవసర అంబులెన్స్ హెల్ప్‌లైన్లు, ప్రభుత్వ ఆరోగ్యశ్రీ సంక్షేమ పథకాలు మరియు స్థానిక వైద్య సహాయ కేంద్రాలు."
                            : "Comprehensive civic health portal covering Denkada Primary Health Center (PHC) verified records, official 24x7 emergency medical response lines, Dr. NTR Vaidya Seva (Aarogyasri) healthcare welfare schemes, and local community health desks."
                        }
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                
                {/* Clinical Overview KPI Deck (100% Real Database & Official Channels) */}
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
                                {isTe ? "పనివేళలు" : "OPD Hours"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {isTe ? "సోమ - శని" : "Mon - Sat"}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "ఉదయం 9:00 నుండి సాయంత్రం 4:00 వరకు ఓపిడి" : "9:00 AM - 4:00 PM Published Timings"}
                            </div>
                        </div>
                    </div>

                    <div className="health-stat-card" style={{ '--stat-accent': 'var(--color-teal-600)' }}>
                        <div className="health-stat-header">
                            <div className="health-stat-icon-wrap" style={{ '--stat-icon-bg': 'var(--color-teal-50)', '--stat-icon-color': 'var(--color-teal-700)' }}>
                                <Award size={20} />
                            </div>
                            <span className="health-stat-badge" style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)' }}>
                                {isTe ? "రూ. 25 లక్షలు" : "Rs. 25 Lakhs"}
                            </span>
                        </div>
                        <div>
                            <div className="health-stat-value">
                                {isTe ? "ఆరోగ్యశ్రీ పథకం" : "Aarogyasri"}
                            </div>
                            <div className="health-stat-label">
                                {isTe ? "డా. ఎన్టీఆర్ వైద్య సేవ నగదు రహిత చికిత్స" : "Free Cashless Inpatient Hospital Coverage"}
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

                {/* Section 2: PHC & Healthcare Facilities (Live Supabase Database Records) */}
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

                {/* Section 3: Government Healthcare Welfare Schemes (Live Supabase Schemes Table) */}
                {(activeSection === 'ALL' || activeSection === 'SCHEMES') && (
                    <HealthcareSchemes
                        schemes={schemes}
                        lang={lang}
                    />
                )}

                {/* Section 4: Local Healthcare Desks & Community Outreach (Live Supabase Contacts Table) */}
                {(activeSection === 'ALL' || activeSection === 'CONTACTS') && (
                    <HealthcareContacts
                        contacts={contacts}
                        lang={lang}
                    />
                )}

            </div>
        </div>
    );
}

export default HealthcarePage;
