import React, { useState, useEffect } from 'react';
import { 
    Landmark, MapPin, ShieldCheck, Users, Building, 
    Droplets, Zap, BookOpen, Compass, Clock, 
    CheckCircle2, Navigation, FileText, Phone
} from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { villageService } from '../../features/village/api/village';
import { getLocalized } from '../../i18n';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';

export function VillagePage() {
    const { lang, t } = useAppContext();
    const [village, setVillage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isTe = lang === 'te';

    const loadVillage = () => {
        setLoading(true);
        setError(null);
        villageService.getVillageProfile()
            .then(data => {
                setVillage(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading village details:', err);
                setError(err.message || 'Failed to load village profile');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadVillage();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <LoadingState count={1} message={isTe ? "గ్రామ సమాచారం లోడ్ అవుతోంది..." : "Loading village habitation profile..."} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <ErrorState message={error} onRetry={loadVillage} />
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">
                            <Landmark size={12} style={{ marginRight: '3px' }} /> 
                            {isTe ? "పరిపాలనా నివాస ప్రొఫైల్" : "Administrative Habitation Profile"}
                        </span>
                        <span className="badge badge-verified">
                            {isTe ? "సెన్సస్ 2011 & పంచాయతీ ధృవీకరించబడింది" : "Census 2011 & Panchayat Verified"}
                        </span>
                    </div>
                    <h1 className="page-title">
                        {village?.name ? (isTe ? `${getLocalized(village, 'name', lang)} గ్రామ నివాస సమాచారం` : `${village.name} Habitation & Panchayat Profile`) : (isTe ? 'గ్రామ సమాచారం' : 'Village Information')}
                    </h1>
                    <p className="page-subtitle">
                        {isTe 
                            ? "కమ్యూనిటీ సర్వీస్ ప్రాజెక్ట్ (CSP) క్రింద అధికారిక సరిహద్దులు, జనాభా లెక్కలు, పౌర మౌలిక సదుపాయాలు మరియు భౌగోళిక వివరాలు."
                            : "Authoritative administrative boundaries, official Census 2011 demographics, empirical civic infrastructure status, and geographical connectivity surveyed under the Community Service Project (CSP)."
                        }
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                <div className="civic-page-layout">
                    {/* Left Column: Core Civic & Demographics Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Habitation Profile Overview */}
                        <div className="civic-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Landmark size={18} style={{ color: 'var(--color-blue-600)' }} />
                                    {isTe ? "గ్రామ నివాసం గురించి" : "About the Habitation"}
                                </h2>
                                <span className="badge badge-civic" style={{ fontSize: '0.72rem' }}>
                                    Denkada Mandal, Vizianagaram
                                </span>
                            </div>

                            <p style={{ fontSize: '0.975rem', lineHeight: '1.7', color: 'var(--color-slate-700)', marginBottom: '1.5rem' }}>
                                {getLocalized(village, 'description', lang)}
                            </p>

                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem' }}>
                                {isTe ? "పరిపాలనా అధికార పరిధి" : "Administrative Jurisdictions & Identifiers"}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', background: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "గ్రామ పంచాయతీ" : "Gram Panchayat"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                        {village?.gram_panchayat || 'Modavalasa'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "మండలం" : "Mandal / Taluk"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                        {village?.mandal || 'Denkada'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "రెవెన్యూ డివిజన్" : "Revenue Division"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                        Vizianagaram
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "జిల్లా" : "District"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                        {village?.district || 'Vizianagaram'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "శాసనసభ నియోజకవర్గం" : "Assembly Constituency"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                        Nellimarla (136)
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "లోక్‌సభ నియోజకవర్గం" : "Parliamentary Constituency"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                        Vizianagaram (03)
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "సెన్సస్ విలేజ్ కోడ్" : "Census 2011 Village Code"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)', fontFamily: 'var(--font-mono)' }}>
                                        582885
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "పోస్టల్ పిన్ కోడ్" : "Postal PIN Code"}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-slate-900)', fontFamily: 'var(--font-mono)' }}>
                                        535005
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Census 2011 Habitation Demographics */}
                        <div className="civic-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={18} style={{ color: 'var(--color-blue-600)' }} />
                                    {isTe ? "జనాభా గణాంకాలు (సెన్సస్ 2011)" : "Official Habitation Demographics"}
                                </h2>
                                <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>
                                    {isTe ? "సెన్సస్ 2011 అధికారికం" : "Census 2011 Official"}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                {isTe 
                                    ? "సమాచార మూలం: భారత ప్రభుత్వం సెన్సస్ 2011 (గ్రామ కోడ్: 582885, మోదవలస, డెంకాడ మండలం)"
                                    : "Data Source: Census of India 2011 (Village Code: 582885, Modavalasa, Denkada Mandal)"
                                }
                            </div>

                            <div className="demographics-factsheet-grid">
                                <div className="factsheet-stat-card">
                                    <span className="factsheet-stat-label">{isTe ? "మొత్తం జనాభా" : "Total Population"}</span>
                                    <span className="factsheet-stat-value">1,842</span>
                                    <span className="factsheet-stat-sub">
                                        {isTe ? "పురుషులు: 924 | స్త్రీలు: 918" : "Male: 924 | Female: 918"}
                                    </span>
                                </div>
                                <div className="factsheet-stat-card">
                                    <span className="factsheet-stat-label">{isTe ? "మొత్తం గృహాలు" : "Households"}</span>
                                    <span className="factsheet-stat-value">468</span>
                                    <span className="factsheet-stat-sub">
                                        {isTe ? "సగటు కుటుంబ సభ్యులు: 3.9" : "Avg Family Size: 3.9"}
                                    </span>
                                </div>
                                <div className="factsheet-stat-card">
                                    <span className="factsheet-stat-label">{isTe ? "అక్షరాస్యత రేటు" : "Literacy Rate"}</span>
                                    <span className="factsheet-stat-value">68.4%</span>
                                    <span className="factsheet-stat-sub">
                                        {isTe ? "పురుషులు: 76.2% | స్త్రీలు: 60.5%" : "Male: 76.2% | Female: 60.5%"}
                                    </span>
                                </div>
                                <div className="factsheet-stat-card">
                                    <span className="factsheet-stat-label">{isTe ? "భౌగోళిక వైశాల్యం" : "Total Land Area"}</span>
                                    <span className="factsheet-stat-value">342 Ha</span>
                                    <span className="factsheet-stat-sub">
                                        {isTe ? "846 ఎకరాల గ్రామీణ భూభాగం" : "846 Acres rural territory"}
                                    </span>
                                </div>
                                <div className="factsheet-stat-card">
                                    <span className="factsheet-stat-label">{isTe ? "లింగ నిష్పత్తి" : "Sex Ratio"}</span>
                                    <span className="factsheet-stat-value">993</span>
                                    <span className="factsheet-stat-sub">
                                        {isTe ? "1000 మంది పురుషులకు స్త్రీలు" : "Females per 1000 males"}
                                    </span>
                                </div>
                                <div className="factsheet-stat-card">
                                    <span className="factsheet-stat-label">{isTe ? "పనిచేసే శ్రామికులు" : "Working Workforce"}</span>
                                    <span className="factsheet-stat-value">864</span>
                                    <span className="factsheet-stat-sub">
                                        {isTe ? "వ్యవసాయం & చేనేత ప్రధాన వృత్తులు" : "Agriculture & Weaving main"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Civic Infrastructure Observational Ledger */}
                        <div className="civic-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Building size={18} style={{ color: 'var(--color-emerald-600)' }} />
                                    {isTe ? "పౌర మౌలిక సదుపాయాల స్థితి" : "Civic Infrastructure & Utilities Ledger"}
                                </h2>
                                <span className="badge badge-civic" style={{ fontSize: '0.72rem' }}>
                                    {isTe ? "ఫీల్డ్ సర్వే ఆగస్టు 2024" : "Field Surveyed Aug 2024"}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                {isTe 
                                    ? "గ్రామ పంచాయతీ రికార్డులు మరియు CSP గ్రౌండ్ సర్వే ద్వారా నమోదైన పరిశీలనలు"
                                    : "Empirical observations from CSP field surveying and Gram Panchayat utility logbooks"
                                }
                            </div>

                            <div className="table-responsive-wrapper">
                                <table className="infra-ledger-table" aria-label="Village Infrastructure Ledger">
                                    <thead>
                                        <tr>
                                            <th>{isTe ? "సేవ / సదుపాయం" : "Utility Service"}</th>
                                            <th>{isTe ? "పరిశీలించిన ప్రస్తుత స్థితి" : "Observed Field Status"}</th>
                                            <th>{isTe ? "ధృవీకరణ మూలం" : "Verification Source"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 700 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Droplets size={15} style={{ color: 'var(--color-blue-600)' }} />
                                                    <span>{isTe ? "తాగునీటి సరఫరా" : "Drinking Water Supply"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {isTe 
                                                    ? "2,000 LPH సామర్థ్యం గల RO శుద్ధి ప్లాంట్ పనిచేస్తోంది; 40,000L ఓవర్‌హెడ్ రిజర్వాయర్ ద్వారా రోజూ నీటి సరఫరా."
                                                    : "Functional RO filtration plant (2,000 LPH capacity); daily piped distribution via 40,000L overhead reservoir."
                                                }
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                                Panchayat RO Log &amp; Field Survey
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 700 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Zap size={15} style={{ color: 'var(--color-amber-600)' }} />
                                                    <span>{isTe ? "గ్రామీణ విద్యుత్ సరఫరా" : "Rural Electricity Grid"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {isTe 
                                                    ? "గృహ వినియోగానికి 24x7 3-ఫేజ్ విద్యుత్ సరఫరా; వ్యవసాయ మోటార్లకు 7 గంటల ఉచిత షెడ్యూల్ రోస్టర్."
                                                    : "24x7 3-phase domestic feeder supply (APCPDCL); 7-hour dedicated free roster for agricultural borewells."
                                                }
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                                APCPDCL Operations Desk
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 700 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Navigation size={15} style={{ color: 'var(--color-emerald-600)' }} />
                                                    <span>{isTe ? "సిమెంట్ & అంతర్గత రోడ్లు" : "Internal Concrete Roads"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {isTe 
                                                    ? "ప్రధాన నివాస వీధులలో 85% సిమెంట్ (CC) రోడ్లు పూర్తి చేయబడ్డాయి; డెంకాడకు రవాణా సౌకర్యం కలదు."
                                                    : "85% CC cement paved internal residential streets; all-weather blacktopped road connecting to Denkada."
                                                }
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                                Gram Panchayat Works Register
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 700 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <CheckCircle2 size={15} style={{ color: 'var(--color-blue-600)' }} />
                                                    <span>{isTe ? "వీధి దీపాల సౌకర్యం" : "Street Lighting Grid"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {isTe 
                                                    ? "ప్రధాన రహదారులు మరియు కూడళ్లలో 100% విద్యుత్ ఆదా చేసే LED వీధి దీపాలు అమర్చబడ్డాయి."
                                                    : "100% LED energy-efficient streetlights operational along primary thoroughfares and temple junction."
                                                }
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                                Field Survey Inspection
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 700 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Building size={15} style={{ color: 'var(--color-indigo-600)' }} />
                                                    <span>{isTe ? "పారిశుధ్యం & వ్యర్థాల నిర్వహణ" : "Sanitation & Drainage"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {isTe 
                                                    ? "క్రమబద్ధమైన బ్లీచింగ్ పౌడర్ పిచికారీతో ఓపెన్ డ్రెయిన్లు; స్వచ్ఛ ఆంధ్ర క్రింద రోజూ చెత్త సేకరణ."
                                                    : "Concrete surface storm drains with periodic lime/bleaching; daily door-to-door solid waste segregation."
                                                }
                                            </td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                                Swachh Andhra Habitation Protocol
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Grama Sachivalayam Single-Window Desk */}
                        <div className="civic-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={18} style={{ color: 'var(--color-indigo-600)' }} />
                                    {isTe ? "గ్రామ సచివాలయ పౌర సేవల డెస్క్" : "Grama Sachivalayam Single-Window Desk"}
                                </h2>
                                <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>
                                    {isTe ? "సోమ - శని: ఉదయం 10:00 - సాయంత్రం 5:00" : "Mon - Sat: 10:00 AM - 5:00 PM"}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-700)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                                {isTe 
                                    ? "మోదవలస గ్రామ సచివాలయం గ్రామస్థులకు 500+ పౌర సేవలను ఒకే చోట అందిస్తుంది. రేషన్ కార్డులు, పెన్షన్లు, కుల/ఆదాయ ధృవీకరణ పత్రాలు మరియు విద్యుత్ దరఖాస్తులను ఇక్కడ పొందవచ్చు."
                                    : "Modavalasa Grama Sachivalayam functions as the single-window administrative touchpoint for 500+ government-to-citizen services, biometric pension disbursements, welfare grievance intake, and revenue certifications."
                                }
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "సచివాలయ స్థానం" : "Physical Location"}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>
                                        Ward 2 Secretariat Complex, Modavalasa
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "ప్రజా ఫిర్యాదుల హెల్ప్‌లైన్" : "Public Grievance Helpline"}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-blue-700)' }}>
                                        Spandana Toll-Free: 1902
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                        {isTe ? "సేవలు" : "Key Services Available"}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-700)' }}>
                                        Rice Cards, Caste, Income, Adangal, e-KYC
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Geographic Accessibility & Project Attributions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        {/* Geographic Connectivity Factsheet */}
                        <div className="civic-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Compass size={16} style={{ color: 'var(--color-blue-600)' }} />
                                {isTe ? "భౌగోళిక కనెక్టివిటీ & దూరాలు" : "Geographical Connectivity"}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Denkada Mandal HQ</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>3.5 km</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Denkada RTC Bus Stop</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>3.2 km</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Primary Health Center (PHC)</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>3.8 km</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Denkada Police Station</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>4.1 km</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Vizianagaram Railway Jn</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>18.5 km</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-slate-100)' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Nearest Bank / ATM</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>Union Bank (3.5 km)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--color-slate-600)' }}>Nearest National Highway</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>NH-16 / NH-26 Corridor</span>
                                </div>
                            </div>
                        </div>

                        {/* CSP Academic Research Metadata */}
                        <div className="civic-card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.85rem' }}>
                                {isTe ? "ప్రాజెక్ట్ ధృవీకరణ వివరాలు" : "CSP Project Attributions"}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Field Verification Source</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{village?.source || 'Gram Panchayat & CSP Field Survey'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Verification Date</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{village?.verified_on || 'August 2024'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Academic Scope</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>B.Tech CSE Community Service Project</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--color-slate-500)', fontWeight: 600 }}>Data Standard</div>
                                    <div style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>Census of India 2011 + Ground Survey</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default VillagePage;

