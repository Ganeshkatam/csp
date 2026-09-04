import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';

export default function SurveyFormView() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineCount, setOfflineCount] = useState(0);
    const [statusMsg, setStatusMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Survey Form State (Complete 7-Module Questionnaire)
    const [formData, setFormData] = useState({
        respondentCode: 'HH-001',
        interviewerName: '',
        localityWard: 'North Ward',
        consentObtained: true,
        D1: 'Self-Employed-Agriculture',
        D2: '5-6',
        D3: 'Primary-UpperPrimary',
        D4: 'Below-1-Lakh',
        D5: 'Pucca',
        TECH1: 'Smartphone-Available',
        TECH2: 'Mobile-4G-5G',
        TECH3: 'Independent',
        SCH1: 'Panchayat-Notices',
        SCH2: 'Unknown-Eligibility-Docs',
        SCH3: 'Frequently-Confused',
        CON1_Panchayat: 'No',
        CON1_PHC: 'No',
        CON1_Police: 'No',
        CON1_Lineman: 'No',
        CON2: 'Ask-Neighbors',
        HLTH1: 'Visited-PHC-No-Doctor',
        EDU1: 'Standard-Enrollment',
        BIZ1: 'Local-Trade-Artisan',
        BIZ2: 'Physical-Store-Only',
        PRIO1: 'Emergency-Contacts-Health'
    });

    const [startTime] = useState(new Date().toISOString());

    const surveyModules = [
        { id: 1, name: 'Demographics' },
        { id: 2, name: 'Digital Connectivity' },
        { id: 3, name: 'Welfare Schemes' },
        { id: 4, name: 'Emergency Contacts' },
        { id: 5, name: 'Healthcare & Education' },
        { id: 6, name: 'Business Visibility' },
        { id: 7, name: 'Information Priorities' }
    ];

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        updateOfflineCount();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const updateOfflineCount = () => {
        try {
            const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
            setOfflineCount(cached.length);
        } catch (e) {
            setOfflineCount(0);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Idempotent client-side UUID generator
    const generateClientUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'survey_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.interviewerName.trim()) {
            setStatusMsg({ type: 'error', text: 'Please enter surveyor name / student ID.' });
            return;
        }

        setIsSubmitting(true);
        setStatusMsg(null);

        const completedTime = new Date().toISOString();
        const clientUuid = generateClientUuid();

        const payload = {
            survey_client_uuid: clientUuid,
            village_id: DEFAULT_VILLAGE_ID,
            respondent_code: formData.respondentCode.trim(),
            interviewer_name: formData.interviewerName.trim(),
            consent_obtained: formData.consentObtained,
            locality_ward: formData.localityWard,
            started_at: startTime,
            completed_at: completedTime,
            answers: [
                { question_code: 'D1', answer_value: formData.D1 },
                { question_code: 'D2', answer_value: formData.D2 },
                { question_code: 'D3', answer_value: formData.D3 },
                { question_code: 'D4', answer_value: formData.D4 },
                { question_code: 'D5', answer_value: formData.D5 },
                { question_code: 'TECH1', answer_value: formData.TECH1 },
                { question_code: 'TECH2', answer_value: formData.TECH2 },
                { question_code: 'TECH3', answer_value: formData.TECH3 },
                { question_code: 'SCH1', answer_value: formData.SCH1 },
                { question_code: 'SCH2', answer_value: formData.SCH2 },
                { question_code: 'SCH3', answer_value: formData.SCH3 },
                { question_code: 'CON1_Panchayat', answer_value: formData.CON1_Panchayat },
                { question_code: 'CON1_PHC', answer_value: formData.CON1_PHC },
                { question_code: 'CON1_Police', answer_value: formData.CON1_Police },
                { question_code: 'CON1_Lineman', answer_value: formData.CON1_Lineman },
                { question_code: 'CON2', answer_value: formData.CON2 },
                { question_code: 'HLTH1', answer_value: formData.HLTH1 },
                { question_code: 'EDU1', answer_value: formData.EDU1 },
                { question_code: 'BIZ1', answer_value: formData.BIZ1 },
                { question_code: 'BIZ2', answer_value: formData.BIZ2 },
                { question_code: 'PRIO1', answer_value: formData.PRIO1 }
            ]
        };

        // If offline: save into local idempotent queue
        if (!navigator.onLine) {
            saveToOfflineQueue(payload);
            setIsSubmitting(false);
            return;
        }

        // If online: upload to Supabase
        try {
            await uploadSingleSurvey(payload);
            setStatusMsg({ 
                type: 'success', 
                text: `Household Survey (${payload.respondent_code}) successfully synchronized to database.` 
            });
            resetForm();
        } catch (err) {
            console.warn('Online insert failed. Queuing locally:', err);
            saveToOfflineQueue(payload);
            setStatusMsg({ 
                type: 'warning', 
                text: 'Connection disrupted. Survey securely cached locally in pending synchronization queue.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveToOfflineQueue = (payload) => {
        try {
            const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
            // Deduplicate by survey_client_uuid
            const exists = cached.some(item => item.survey_client_uuid === payload.survey_client_uuid);
            if (!exists) {
                cached.push(payload);
                localStorage.setItem('csp_offline_surveys', JSON.stringify(cached));
            }
            updateOfflineCount();
            setStatusMsg({ 
                type: 'warning', 
                text: `Offline Mode: Survey cached locally (${payload.respondent_code}). Pending synchronization.` 
            });
            resetForm();
        } catch (e) {
            console.error('Storage error:', e);
            setStatusMsg({ type: 'error', text: 'Local storage unavailable.' });
        }
    };

    const uploadSingleSurvey = async (payload) => {
        const { answers, ...responseHeader } = payload;
        
        // 1. Insert header
        const { data: headerData, error: headerErr } = await supabase
            .from('survey_responses')
            .insert(responseHeader)
            .select('id')
            .single();

        if (headerErr) throw headerErr;

        // 2. Insert normalized answers linked to header id
        const answerRows = answers.map(a => ({
            response_id: headerData.id,
            question_code: a.question_code,
            answer_value: a.answer_value
        }));

        const { error: answersErr } = await supabase
            .from('survey_answers')
            .insert(answerRows);

        if (answersErr) throw answersErr;
    };

    // Sync Offline Surveys (Acknowledgment-before-deletion protocol)
    const syncOfflineSurveys = async () => {
        if (!navigator.onLine) {
            setStatusMsg({ type: 'warning', text: 'Cannot synchronize: device is still offline.' });
            return;
        }

        setIsSyncing(true);
        try {
            const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
            if (cached.length === 0) {
                setStatusMsg({ type: 'success', text: 'No pending records to synchronize.' });
                setIsSyncing(false);
                return;
            }

            const remaining = [];
            let successCount = 0;

            for (const item of cached) {
                try {
                    await uploadSingleSurvey(item);
                    successCount++;
                } catch (err) {
                    console.error('Failed to sync item:', item.respondent_code, err);
                    remaining.push(item); // Keep unacknowledged record in queue
                }
            }

            // Only remove successfully acknowledged items from local storage
            localStorage.setItem('csp_offline_surveys', JSON.stringify(remaining));
            updateOfflineCount();

            if (remaining.length === 0) {
                setStatusMsg({ 
                    type: 'success', 
                    text: `All ${successCount} offline survey records verified and synchronized to database.` 
                });
            } else {
                setStatusMsg({ 
                    type: 'warning', 
                    text: `${successCount} records synced; ${remaining.length} pending synchronization.` 
                });
            }
        } catch (err) {
            console.error('Sync error:', err);
            setStatusMsg({ type: 'error', text: 'Synchronization process encountered an error.' });
        } finally {
            setIsSyncing(false);
        }
    };

    const resetForm = () => {
        const nextId = parseInt(formData.respondentCode.replace('HH-', ''), 10) + 1;
        setFormData(prev => ({
            ...prev,
            respondentCode: `HH-${String(nextId).padStart(3, '0')}`,
            consentObtained: true
        }));
    };

    return (
        <main className="container" id="surveyMain" style={{ paddingTop: '2rem' }}>
            <div className="survey-card full-width-survey">
                <header style={{ borderBottom: '1px solid var(--color-slate-200)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                            <span className="badge badge-civic">Academic CSP Field Instrument</span>
                            <h1 className="hero-title" style={{ fontSize: '1.5rem', marginTop: '0.35rem' }}>
                                Household Information-Needs Survey
                            </h1>
                            <p className="section-desc">
                                4-Week CSP Field Study Questionnaire (Strictly Pseudonymous; No PII Collected).
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={`badge ${isOnline ? 'badge-verified' : 'badge-alert'}`}>
                                {isOnline ? <Wifi size={13} aria-hidden="true" /> : <WifiOff size={13} aria-hidden="true" />}
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                            {offlineCount > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={syncOfflineSurveys}
                                    disabled={isSyncing}
                                    style={{ minHeight: '36px', padding: '0.25rem 0.75rem', fontSize: '0.8125rem' }}
                                >
                                    <RefreshCw size={14} style={{ marginRight: '4px' }} aria-hidden="true" />
                                    {isSyncing ? 'Syncing...' : `Pending Sync (${offlineCount})`}
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Top 7-Module Progress Tracker */}
                <div className="survey-progress-card">
                    <div className="survey-progress-track">
                        {surveyModules.map(m => (
                            <div key={m.id} className="step-node active">
                                <span className="step-badge">{m.id}</span>
                                <span>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {statusMsg && (
                    <div className={`alert alert-${statusMsg.type}`} role="status">
                        {statusMsg.type === 'success' && <CheckCircle2 size={18} aria-hidden="true" />}
                        {statusMsg.type === 'warning' && <AlertCircle size={18} aria-hidden="true" />}
                        {statusMsg.type === 'error' && <AlertCircle size={18} aria-hidden="true" />}
                        <span>{statusMsg.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Metadata & Consent */}
                    <section className="section-block" style={{ marginTop: '1.5rem' }}>
                        <div className="section-head">
                            <h2 className="section-title">Interview Metadata & Consent</h2>
                        </div>
                        <div className="choice-grid columns-2">
                            <div className="form-group">
                                <label className="form-label">Household ID Code *</label>
                                <input 
                                    type="text" 
                                    name="respondentCode"
                                    className="form-control" 
                                    value={formData.respondentCode}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Surveyor Name / Student ID *</label>
                                <input 
                                    type="text" 
                                    name="interviewerName"
                                    className="form-control" 
                                    value={formData.interviewerName}
                                    onChange={handleChange}
                                    placeholder="Your Name / Roll No"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="choice-card">
                                <input 
                                    type="checkbox" 
                                    name="consentObtained"
                                    checked={formData.consentObtained}
                                    onChange={handleChange}
                                />
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-slate-800)' }}>
                                    I confirm that informed verbal consent was obtained from the adult respondent.
                                </span>
                            </label>
                        </div>
                    </section>

                    {/* Module 1: Demographics */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 1: Demographics & Household Profile</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q1. Primary Household Occupation [D1]</label>
                            <select name="D1" className="form-control" value={formData.D1} onChange={handleChange}>
                                <option value="Self-Employed-Agriculture">Agriculture / Farming (Self-employed)</option>
                                <option value="Agricultural-Labor">Agricultural / Daily Wage Labor</option>
                                <option value="Artisan-Trade">Artisan / Weaver / Local Trade</option>
                                <option value="Salaried-Service">Salaried Employment / Service</option>
                                <option value="Small-Business-Retail">Small Business / Kirana Shop</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q2. Household Size [D2]</label>
                            <select name="D2" className="form-control" value={formData.D2} onChange={handleChange}>
                                <option value="1-2">1 to 2 members</option>
                                <option value="3-4">3 to 4 members</option>
                                <option value="5-6">5 to 6 members</option>
                                <option value="More-than-6">More than 6 members</option>
                            </select>
                        </div>
                    </section>

                    {/* Module 2: Digital Connectivity */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 2: Digital Connectivity (TECH1 - TECH3)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q3. Smartphone Availability [TECH1]</label>
                            <select name="TECH1" className="form-control" value={formData.TECH1} onChange={handleChange}>
                                <option value="Smartphone-Available">At least one member owns an active smartphone</option>
                                <option value="Basic-Keypad-Only">Basic keypad phone only</option>
                                <option value="No-Phone">No working phone in household</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q4. Internet Connectivity Mode [TECH2]</label>
                            <select name="TECH2" className="form-control" value={formData.TECH2} onChange={handleChange}>
                                <option value="Mobile-4G-5G">Mobile Cellular Data (4G / 5G)</option>
                                <option value="Home-Broadband">Home Broadband / Wi-Fi</option>
                                <option value="No-Internet">No internet access</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q5. Digital Literacy Comfort [TECH3]</label>
                            <select name="TECH3" className="form-control" value={formData.TECH3} onChange={handleChange}>
                                <option value="Independent">Can open websites and read independently</option>
                                <option value="Requires-Assistance">Can use with assistance from family / youth</option>
                                <option value="Relies-on-Cafes">Relies entirely on intermediaries / CSC cafes</option>
                            </select>
                        </div>
                    </section>

                    {/* Module 3: Welfare Schemes */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 3: Welfare Scheme Access & Documentation (SCH1 - SCH3)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q6. Biggest Challenge When Applying for Welfare Schemes [SCH2]</label>
                            <select name="SCH2" className="form-control" value={formData.SCH2} onChange={handleChange}>
                                <option value="Unknown-Eligibility-Docs">Not knowing eligibility rules or required documents in advance</option>
                                <option value="Repeated-Office-Visits">Visiting mandal office multiple times due to missing paperwork</option>
                                <option value="Unsure-Official-Portal">Uncertainty over whether an online scheme link is authentic</option>
                                <option value="Intermediary-Fees">Having to pay fees to intermediaries for simple information</option>
                            </select>
                        </div>
                    </section>

                    {/* Module 4: Emergency Contacts */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 4: Emergency Contacts & Helplines (CON1 - CON2)</h2>
                        </div>
                        <div className="choice-grid columns-2">
                            <div className="form-group">
                                <label className="form-label">Primary Health Centre (PHC) / Ambulance [CON1]</label>
                                <select name="CON1_PHC" className="form-control" value={formData.CON1_PHC} onChange={handleChange}>
                                    <option value="Yes">Yes, Saved on Phone / Paper</option>
                                    <option value="No">No, Do Not Have</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Electricity Lineman / Water Supply [CON1]</label>
                                <select name="CON1_Lineman" className="form-control" value={formData.CON1_Lineman} onChange={handleChange}>
                                    <option value="Yes">Yes, Saved on Phone / Paper</option>
                                    <option value="No">No, Do Not Have</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Module 5: Healthcare & Education */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 5: Healthcare & Education Access (HLTH1, EDU1)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q7. PHC Facility Experience [HLTH1]</label>
                            <select name="HLTH1" className="form-control" value={formData.HLTH1} onChange={handleChange}>
                                <option value="Visited-PHC-No-Doctor">Visited PHC during urgent need but doctor was absent/closed</option>
                                <option value="Unaware-OPD-Timings">Uncertain about OPD hours and maternal immunization dates</option>
                                <option value="Regular-Satisfactory">Regularly utilizes PHC services with satisfactory experience</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q8. Government School Awareness [EDU1]</label>
                            <select name="EDU1" className="form-control" value={formData.EDU1} onChange={handleChange}>
                                <option value="Standard-Enrollment">Enrolled in village Mandal Parishad / ZP school</option>
                                <option value="Private-School">Sent to private school outside village due to information gap</option>
                                <option value="No-School-Going-Children">No school-going children in household</option>
                            </select>
                        </div>
                    </section>

                    {/* Module 6: Business Visibility */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 6: Local Business & Artisan Visibility (BIZ1, BIZ2)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q9. Need for Local Tradespeople Directory [BIZ1]</label>
                            <select name="BIZ1" className="form-control" value={formData.BIZ1} onChange={handleChange}>
                                <option value="Local-Trade-Artisan">Frequently need contact for electrician, plumber, or repairer</option>
                                <option value="Know-Everyone">Personally know all local tradespeople; directory optional</option>
                                <option value="Rarely-Needed">Rarely require local repair or artisan services</option>
                            </select>
                        </div>
                    </section>

                    {/* Module 7: Citizen Information Priorities */}
                    <section className="section-block">
                        <div className="section-head">
                            <h2 className="section-title">Module 7: Citizen Information Priorities (PRIO1)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q10. Single Most Important Information Priority [PRIO1]</label>
                            <select name="PRIO1" className="form-control" value={formData.PRIO1} onChange={handleChange}>
                                <option value="Emergency-Contacts-Health">24x7 Verified Emergency and Health Contacts</option>
                                <option value="Welfare-Checklists">Welfare Scheme Eligibility & Document Checklists</option>
                                <option value="School-Anganwadi">School Timings and Mid-Day Meal Information</option>
                                <option value="Local-Business-Directory">Local Tradespeople and SHG Products Directory</option>
                            </select>
                        </div>
                    </section>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                        style={{ minHeight: '48px', width: '100%', marginTop: '2rem', fontSize: '1rem' }}
                    >
                        {isSubmitting ? 'Recording Survey...' : 'Save & Record Household Survey'}
                    </button>
                </form>
            </div>
        </main>
    );
}
