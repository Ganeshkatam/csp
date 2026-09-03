import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';

export default function SurveyFormView() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineCount, setOfflineCount] = useState(0);
    const [statusMsg, setStatusMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Survey Form State
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
        EDU1: 'Lack-Digital-Infrastructure',
        BIZ1: 'Local-Trade-Artisan',
        BIZ2: 'Physical-Store-Only',
        PRIO1: 'Emergency-Contacts-Health'
    });

    const [startTime] = useState(new Date().toISOString());

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
        setOfflineCount(cached.length);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
        const payload = {
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

        if (!isOnline) {
            saveOffline(payload);
            setIsSubmitting(false);
            return;
        }

        try {
            const { data: resp, error: respErr } = await supabase
                .from('survey_responses')
                .insert({
                    village_id: payload.village_id,
                    respondent_code: payload.respondent_code,
                    interviewer_name: payload.interviewer_name,
                    consent_obtained: payload.consentObtained,
                    locality_ward: payload.locality_ward,
                    started_at: payload.started_at,
                    completed_at: payload.completed_at
                })
                .select()
                .single();

            if (respErr) throw respErr;

            const answersToInsert = payload.answers.map(a => ({
                response_id: resp.id,
                question_code: a.question_code,
                answer_value: a.answer_value
            }));

            const { error: ansErr } = await supabase.from('survey_answers').insert(answersToInsert);
            if (ansErr) throw ansErr;

            setStatusMsg({ type: 'success', text: `Survey response for ${formData.respondentCode} successfully submitted to Supabase.` });
            incrementRespondentCode();
        } catch (err) {
            console.warn('Direct upload failed, storing offline:', err);
            saveOffline(payload);
        } finally {
            setIsSubmitting(false);
        }
    };

    function saveOffline(payload) {
        const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
        cached.push(payload);
        localStorage.setItem('csp_offline_surveys', JSON.stringify(cached));
        setOfflineCount(cached.length);
        setStatusMsg({ type: 'warning', text: `Saved locally. Stored offline records: ${cached.length}.` });
        incrementRespondentCode();
    }

    function incrementRespondentCode() {
        const match = formData.respondentCode.match(/(\d+)$/);
        if (match) {
            const nextNum = String(parseInt(match[1], 10) + 1).padStart(3, '0');
            setFormData(prev => ({ ...prev, respondentCode: `HH-${nextNum}` }));
        }
    }

    async function syncOfflineSurveys() {
        const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
        if (cached.length === 0) return;

        setStatusMsg({ type: 'info', text: `Syncing ${cached.length} offline records with Supabase...` });
        let synced = 0;

        for (const item of cached) {
            try {
                const { data: resp, error: respErr } = await supabase
                    .from('survey_responses')
                    .insert({
                        village_id: item.village_id,
                        respondent_code: item.respondent_code,
                        interviewer_name: item.interviewer_name,
                        consent_obtained: item.consent_obtained,
                        locality_ward: item.locality_ward,
                        started_at: item.started_at,
                        completed_at: item.completed_at
                    })
                    .select()
                    .single();

                if (respErr) throw respErr;

                const answers = item.answers.map(a => ({
                    response_id: resp.id,
                    question_code: a.question_code,
                    answer_value: a.answer_value
                }));

                await supabase.from('survey_answers').insert(answers);
                synced++;
            } catch (err) {
                console.error('Failed to sync item:', err);
            }
        }

        localStorage.removeItem('csp_offline_surveys');
        setOfflineCount(0);
        setStatusMsg({ type: 'success', text: `Successfully synced ${synced} surveys to Supabase.` });
    }

    return (
        <main className="container" style={{ paddingBottom: '3rem' }}>
            {!isOnline && (
                <div className="offline-banner" style={{ display: 'block', margin: '1rem 0' }}>
                    <WifiOff size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    Working Offline: Responses will be stored on this device and synced when connectivity is restored.
                </div>
            )}

            <div className="survey-card" style={{ marginTop: '1.5rem' }}>
                {statusMsg && (
                    <div className={`alert alert-${statusMsg.type}`}>
                        {statusMsg.text}
                    </div>
                )}

                <header className="section-header">
                    <h1 className="brand-title" style={{ fontSize: '1.5rem' }}>
                        Household Information-Needs Survey (Week 1)
                    </h1>
                    <p className="section-desc">
                        Direct field entry for Doorstep Interviews. Strictly pseudonymous data collection without direct resident PII.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                        <span className="badge">Stored Offline: {offlineCount}</span>
                        {offlineCount > 0 && isOnline && (
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={syncOfflineSurveys}
                                style={{ minHeight: '36px', padding: '0.25rem 0.75rem', fontSize: '0.8125rem' }}
                            >
                                <RefreshCw size={14} style={{ marginRight: '4px' }} /> Sync Offline Records
                            </button>
                        )}
                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* Section: Metadata */}
                    <section className="survey-section">
                        <div className="section-header">
                            <h2 className="section-title">Interview Metadata</h2>
                        </div>
                        <div className="choice-grid columns-2">
                            <div className="form-group">
                                <label className="form-label">Respondent / Household ID *</label>
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
                                    placeholder="Your Full Name" 
                                    value={formData.interviewerName}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '0.75rem' }}>
                            <label className="form-label">Locality / Ward</label>
                            <input 
                                type="text" 
                                name="localityWard"
                                className="form-control" 
                                value={formData.localityWard}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="custom-choice" style={{ marginTop: '0.75rem' }}>
                            <input 
                                type="checkbox" 
                                id="chkConsent"
                                name="consentObtained"
                                checked={formData.consentObtained}
                                onChange={handleChange}
                            />
                            <label htmlFor="chkConsent" className="choice-label">
                                Informed consent obtained verbally prior to interview commencement.
                            </label>
                        </div>
                    </section>

                    {/* Section 1: Demographics */}
                    <section className="survey-section">
                        <div className="section-header">
                            <h2 className="section-title">Section 1: Socio-Economic Profile</h2>
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

                    {/* Section 2: Digital Infrastructure */}
                    <section className="survey-section">
                        <div className="section-header">
                            <h2 className="section-title">Section 2: Digital Infrastructure (TECH1 - TECH3)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q6. Smartphone Availability [TECH1]</label>
                            <select name="TECH1" className="form-control" value={formData.TECH1} onChange={handleChange}>
                                <option value="Smartphone-Available">At least one member owns an active smartphone</option>
                                <option value="Basic-Keypad-Only">Basic keypad phone only</option>
                                <option value="No-Phone">No working phone</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Q7. Internet Connectivity Mode [TECH2]</label>
                            <select name="TECH2" className="form-control" value={formData.TECH2} onChange={handleChange}>
                                <option value="Mobile-4G-5G">Mobile Data (4G / 5G)</option>
                                <option value="Home-Broadband">Home Broadband / Wi-Fi</option>
                                <option value="No-Internet">No internet access</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Q8. Digital Literacy Comfort [TECH3]</label>
                            <select name="TECH3" className="form-control" value={formData.TECH3} onChange={handleChange}>
                                <option value="Independent">Can open websites and read independently</option>
                                <option value="Requires-Assistance">Can use with assistance from youth / family</option>
                                <option value="Relies-on-Cafes">Relies entirely on intermediaries / CSC cafes</option>
                            </select>
                        </div>
                    </section>

                    {/* Section 3: Welfare Schemes */}
                    <section className="survey-section">
                        <div className="section-header">
                            <h2 className="section-title">Section 3: Welfare Schemes & Fraud Risk (SCH1 - SCH3)</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q10. Biggest Challenge When Applying for Schemes [SCH2]</label>
                            <select name="SCH2" className="form-control" value={formData.SCH2} onChange={handleChange}>
                                <option value="Unknown-Eligibility-Docs">Not knowing eligibility rules or required documents in advance</option>
                                <option value="Repeated-Office-Visits">Visiting mandal office multiple times due to missing paperwork</option>
                                <option value="Unsure-Official-Portal">Uncertainty over whether an online scheme link is authentic</option>
                                <option value="Intermediary-Fees">Having to pay fees to intermediaries for simple information</option>
                            </select>
                        </div>
                    </section>

                    {/* Section 4: Emergency Contacts */}
                    <section className="survey-section">
                        <div className="section-header">
                            <h2 className="section-title">Section 4: Emergency Contacts (CON1)</h2>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                            Do you have the direct phone numbers of key responders saved or written down?
                        </p>
                        <div className="choice-grid columns-2">
                            <div className="form-group">
                                <label className="form-label">Primary Health Centre (PHC) / Ambulance</label>
                                <select name="CON1_PHC" className="form-control" value={formData.CON1_PHC} onChange={handleChange}>
                                    <option value="Yes">Yes, Saved</option>
                                    <option value="No">No, Do Not Have</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Electricity Lineman / Water Supply</label>
                                <select name="CON1_Lineman" className="form-control" value={formData.CON1_Lineman} onChange={handleChange}>
                                    <option value="Yes">Yes, Saved</option>
                                    <option value="No">No, Do Not Have</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting}
                        style={{ minHeight: '48px', marginTop: '1.5rem', fontSize: '1rem' }}
                    >
                        {isSubmitting ? 'Recording to Supabase...' : 'Save & Record Household Survey'}
                    </button>
                </form>
            </div>
        </main>
    );
}
