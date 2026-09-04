import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, MapPin, Info, Users, ShieldCheck, HeartPulse, Building2, PhoneCall, Check } from 'lucide-react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';
import CustomSelect from '../components/CustomSelect';
import { SURVEY_CANONICAL_OPTIONS } from '../lib/surveyConstants';

export default function SurveyFormView() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineCount, setOfflineCount] = useState(0);
    const [statusMsg, setStatusMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Verified Localities loaded dynamically from database
    const [localityOptions, setLocalityOptions] = useState([]);
    const [loadingLocalities, setLoadingLocalities] = useState(true);

    // Complete 21 Logical-Question / 24 Answer-Control State
    const [formData, setFormData] = useState({
        // Metadata
        respondentCode: 'HH-016',
        interviewerName: '',
        localityWard: '',
        customLocality: '',
        consentObtained: true,

        // 01. Demographics (6 controls)
        D1: '26-40',
        D2: 'Female',
        D3: 'Agriculture',
        D4: 'Secondary',
        D5: '4',
        D6: 'White-BPL-Card',

        // 02. Digital Connectivity (3 controls)
        TECH1: 'Smartphone-Available',
        TECH2: 'Mobile-Data-4G-5G',
        TECH3: 'Independent',

        // 03. Welfare Schemes (4 controls)
        SCH1: 'Panchayat-Notices',
        SCH2: 'Unknown-Eligibility-Docs',
        SCH3: 'Frequently-Confused',
        SCH4: ['PM-KISAN'], // Multi-select array

        // 04. Emergency Directory (5 controls)
        CON1_Panchayat: 'No',
        CON1_PHC: 'No',
        CON1_Police: 'No',
        CON1_Lineman: 'No',
        CON2: 'Ask-Neighbors',

        // 05. Healthcare & Education (3 controls)
        HLTH1: 'Visited-PHC-No-Doctor',
        EDU1: 'Easily-Accessible',
        INFRA1: 'Panchayat-RO-Plant',

        // 06. Local Livelihoods & Business Directory (2 controls)
        BIZ1: 'Personal-Contacts',
        BIZ2: 'Very-Helpful',

        // 07. Information Priorities (1 control)
        PRIO1: 'Emergency-Contacts',

        // Qualitative Observations
        notes: ''
    });

    const [startTime] = useState(new Date().toISOString());

    const surveyModules = [
        { id: 1, name: 'Demographics' },
        { id: 2, name: 'Digital' },
        { id: 3, name: 'Welfare' },
        { id: 4, name: 'Emergency' },
        { id: 5, name: 'Health & Infra' },
        { id: 6, name: 'Livelihoods' },
        { id: 7, name: 'Priorities' }
    ];

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        loadVerifiedLocalities();
        updateOfflineCount();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Query verified localities from village_localities table
    async function loadVerifiedLocalities() {
        setLoadingLocalities(true);
        try {
            const { data, error } = await supabase
                .from('village_localities')
                .select('locality_name')
                .eq('village_id', DEFAULT_VILLAGE_ID)
                .eq('status', 'Active')
                .order('locality_name', { ascending: true });

            if (error) throw error;

            const opts = (data || []).map(row => ({
                value: row.locality_name,
                label: row.locality_name
            }));

            opts.push({ value: 'OTHER', label: 'Other / Specify New Locality' });
            setLocalityOptions(opts);

            if (opts.length > 0 && !formData.localityWard) {
                setFormData(prev => ({ ...prev, localityWard: opts[0].value }));
            }
        } catch (err) {
            console.warn('Failed to load verified localities, using fallback catalog:', err);
            const fallbackOpts = [
                { value: 'East Weavers Colony', label: 'East Weavers Colony' },
                { value: 'Central Bazaar', label: 'Central Bazaar' },
                { value: 'North Ward', label: 'North Ward' },
                { value: 'Harijanawada', label: 'Harijanawada' },
                { value: 'Main Road', label: 'Main Road' },
                { value: 'OTHER', label: 'Other / Specify New Locality' }
            ];
            setLocalityOptions(fallbackOpts);
            if (!formData.localityWard) {
                setFormData(prev => ({ ...prev, localityWard: fallbackOpts[0].value }));
            }
        } finally {
            setLoadingLocalities(false);
        }
    }

    const updateOfflineCount = () => {
        try {
            const cached = JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
            setOfflineCount(cached.length);
        } catch (e) {
            setOfflineCount(0);
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Multi-select handler for SCH4 with mutual exclusivity for 'None'
    const handleSCH4Toggle = (schemeToken) => {
        setFormData(prev => {
            const current = prev.SCH4 || [];
            if (schemeToken === 'None') {
                // If None is checked, uncheck all others
                return { ...prev, SCH4: current.includes('None') ? [] : ['None'] };
            }

            // If a specific scheme is toggled, ensure 'None' is removed
            let updated = current.filter(item => item !== 'None');
            if (updated.includes(schemeToken)) {
                updated = updated.filter(item => item !== schemeToken);
            } else {
                updated.push(schemeToken);
            }

            return { ...prev, SCH4: updated };
        });
    };

    // Generate client UUID for database-enforced idempotency
    const generateClientUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.interviewerName.trim()) {
            setStatusMsg({ type: 'error', text: 'Please enter surveyor name / student ID.' });
            return;
        }

        const finalLocality = formData.localityWard === 'OTHER' 
            ? (formData.customLocality.trim() || 'General Habitation') 
            : formData.localityWard;

        if (!finalLocality) {
            setStatusMsg({ type: 'error', text: 'Please select or enter the locality / ward.' });
            return;
        }

        setIsSubmitting(true);
        setStatusMsg(null);

        const completedTime = new Date().toISOString();
        const clientUuid = generateClientUuid();

        // Assemble normalized answer rows (Option A for SCH4)
        const answerRows = [
            // 01. Demographics
            { question_code: 'D1', answer_value: formData.D1 },
            { question_code: 'D2', answer_value: formData.D2 },
            { question_code: 'D3', answer_value: formData.D3 },
            { question_code: 'D4', answer_value: formData.D4 },
            { question_code: 'D5', answer_value: String(formData.D5) },
            { question_code: 'D6', answer_value: formData.D6 },

            // 02. Digital Connectivity
            { question_code: 'TECH1', answer_value: formData.TECH1 },
            { question_code: 'TECH2', answer_value: formData.TECH2 },
            { question_code: 'TECH3', answer_value: formData.TECH3 },

            // 03. Welfare Schemes
            { question_code: 'SCH1', answer_value: formData.SCH1 },
            { question_code: 'SCH2', answer_value: formData.SCH2 },
            { question_code: 'SCH3', answer_value: formData.SCH3 },

            // 04. Emergency Directory (4 discrete CON1 sub-codes + CON2)
            { question_code: 'CON1_Panchayat', answer_value: formData.CON1_Panchayat },
            { question_code: 'CON1_PHC', answer_value: formData.CON1_PHC },
            { question_code: 'CON1_Police', answer_value: formData.CON1_Police },
            { question_code: 'CON1_Lineman', answer_value: formData.CON1_Lineman },
            { question_code: 'CON2', answer_value: formData.CON2 },

            // 05. Healthcare & Education
            { question_code: 'HLTH1', answer_value: formData.HLTH1 },
            { question_code: 'EDU1', answer_value: formData.EDU1 },
            { question_code: 'INFRA1', answer_value: formData.INFRA1 },

            // 06. Local Livelihoods & Business Directory
            { question_code: 'BIZ1', answer_value: formData.BIZ1 },
            { question_code: 'BIZ2', answer_value: formData.BIZ2 },

            // 07. Information Priorities
            { question_code: 'PRIO1', answer_value: formData.PRIO1 }
        ];

        // Multi-select SCH4: Add a discrete normalized row per entitlement
        if (formData.SCH4 && formData.SCH4.length > 0) {
            formData.SCH4.forEach(scheme => {
                answerRows.push({ question_code: 'SCH4', answer_value: scheme });
            });
        } else {
            answerRows.push({ question_code: 'SCH4', answer_value: 'None' });
        }

        const payload = {
            survey_client_uuid: clientUuid,
            village_id: DEFAULT_VILLAGE_ID,
            respondent_code: formData.respondentCode.trim(),
            interviewer_name: formData.interviewerName.trim(),
            locality_ward: finalLocality,
            consent_obtained: formData.consentObtained,
            notes: formData.notes.trim() || null,
            started_at: startTime,
            completed_at: completedTime,
            answers: answerRows
        };

        // If offline: save into local idempotent queue
        if (!navigator.onLine) {
            saveToOfflineQueue(payload);
            setIsSubmitting(false);
            return;
        }

        // If online: upload to Supabase with database-enforced idempotency
        try {
            await uploadSingleSurvey(payload);
            setStatusMsg({ 
                type: 'success', 
                text: `Household Survey (${payload.respondent_code}) successfully synchronized to database (${payload.answers.length} verified answer records).` 
            });
            resetForm();
        } catch (err) {
            console.warn('Online upload failed. Queuing locally:', err);
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
        
        // 1. Check if record with survey_client_uuid already exists (idempotency guard)
        if (responseHeader.survey_client_uuid) {
            const { data: existing } = await supabase
                .from('survey_responses')
                .select('id')
                .eq('survey_client_uuid', responseHeader.survey_client_uuid)
                .maybeSingle();

            if (existing) {
                // Record already successfully ingested
                return;
            }
        }

        // 2. Insert survey response header
        const { data: headerData, error: headerErr } = await supabase
            .from('survey_responses')
            .insert(responseHeader)
            .select('id')
            .single();

        if (headerErr) throw headerErr;

        // 3. Insert normalized answer rows
        const rowsToInsert = answers.map(a => ({
            response_id: headerData.id,
            question_code: a.question_code,
            answer_value: a.answer_value
        }));

        const { error: answersErr } = await supabase
            .from('survey_answers')
            .insert(rowsToInsert);

        if (answersErr) throw answersErr;
    };

    const syncOfflineSurveys = async () => {
        if (!navigator.onLine) {
            setStatusMsg({ type: 'warning', text: 'Cannot synchronize: device is offline.' });
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
                    remaining.push(item);
                }
            }

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
                    text: `Synchronized ${successCount} records. ${remaining.length} records remain pending.` 
                });
            }
        } catch (e) {
            setStatusMsg({ type: 'error', text: 'Synchronization process encountered an error.' });
        } finally {
            setIsSyncing(false);
        }
    };

    const resetForm = () => {
        // Auto-increment respondent code for next survey
        setFormData(prev => {
            const currentNum = parseInt((prev.respondentCode.match(/\d+/) || [15])[0], 10);
            const nextCode = `HH-${String(currentNum + 1).padStart(3, '0')}`;
            return {
                ...prev,
                respondentCode: nextCode,
                customLocality: '',
                SCH4: ['PM-KISAN'],
                notes: ''
            };
        });
    };

    return (
        <main className="survey-form-container" style={{ padding: '2rem 1rem', maxWidth: '960px', margin: '0 auto' }}>
            <div className="survey-form-card" style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-subtle)' }}>
                {/* Header Section */}
                <header className="survey-form-header" style={{ borderBottom: '1px solid var(--color-slate-200)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-civic">Academic CSP Field Survey</span>
                            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-slate-900)', marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
                                Community Information Needs & Socio-Economic Assessment
                            </h1>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', marginTop: '0.25rem', maxWidth: '640px', lineHeight: 1.45 }}>
                                Standardized 21 logical-question field questionnaire (24 individual controls) evaluating socio-economic status, digital connectivity, and public service information friction.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className={`ledger-badge ${isOnline ? 'badge-green' : 'badge-amber'}`} style={{ padding: '0.35rem 0.75rem' }}>
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

                {/* Top Module Tracker */}
                <div className="survey-progress-card" style={{ marginBottom: '2rem', padding: '0.75rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-slate-200)' }}>
                    <div className="survey-progress-track" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {surveyModules.map(m => (
                            <div key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', background: '#ffffff', border: '1px solid var(--color-slate-200)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
                                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-slate-900)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700 }}>{m.id}</span>
                                <span>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {statusMsg && (
                    <div className={`alert alert-${statusMsg.type}`} role="status" style={{ marginBottom: '1.5rem' }}>
                        {statusMsg.type === 'success' && <CheckCircle2 size={18} aria-hidden="true" />}
                        {statusMsg.type === 'warning' && <AlertCircle size={18} aria-hidden="true" />}
                        {statusMsg.type === 'error' && <AlertCircle size={18} aria-hidden="true" />}
                        <span>{statusMsg.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Metadata & Consent Section */}
                    <section className="section-block" style={{ marginTop: '0.5rem', padding: '1.25rem', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-lg)', background: 'var(--color-slate-50)', marginBottom: '1.5rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Identification & Consent</span>
                            <h2 className="section-title" style={{ fontSize: '1.15rem', marginTop: '0.25rem' }}>Interview Metadata & Spatial Habitation</h2>
                        </div>
                        <div className="choice-grid columns-3" style={{ gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Household ID Code *</label>
                                <input 
                                    type="text" 
                                    name="respondentCode"
                                    className="form-control" 
                                    value={formData.respondentCode}
                                    onChange={handleInputChange}
                                    placeholder="e.g. HH-016"
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
                                    onChange={handleInputChange}
                                    placeholder="Ganesh Katam / Roll No"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Locality / Ward (Verified) *</label>
                                <CustomSelect 
                                    value={formData.localityWard}
                                    onChange={(val) => handleFieldChange('localityWard', val)}
                                    options={localityOptions}
                                    placeholder="Select Locality..."
                                    minWidth="100%"
                                    ariaLabel="Locality / Ward"
                                />
                            </div>
                        </div>

                        {formData.localityWard === 'OTHER' && (
                            <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                <label className="form-label">Specify Habitation / Street Name *</label>
                                <input 
                                    type="text" 
                                    name="customLocality"
                                    className="form-control" 
                                    value={formData.customLocality}
                                    onChange={handleInputChange}
                                    placeholder="Enter new street or locality name..."
                                    required 
                                />
                            </div>
                        )}

                        <div className="form-group" style={{ marginTop: '0.75rem' }}>
                            <label className="choice-card" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    name="consentObtained"
                                    checked={formData.consentObtained}
                                    onChange={handleInputChange}
                                />
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-800)', fontWeight: 500 }}>
                                    I confirm that informed verbal consent was obtained from the adult respondent (Strict academic privacy; Zero PII collected).
                                </span>
                            </label>
                        </div>
                    </section>

                    {/* Module 1: Demographics (6 controls) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 1</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Demographics & Household Profile</h2>
                        </div>
                        <div className="choice-grid columns-2" style={{ gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Q1. Respondent Age Group [D1]</label>
                                <CustomSelect 
                                    value={formData.D1}
                                    onChange={(val) => handleFieldChange('D1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.D1}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q2. Respondent Gender [D2]</label>
                                <CustomSelect 
                                    value={formData.D2}
                                    onChange={(val) => handleFieldChange('D2', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.D2}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q3. Primary Occupation of Household Head [D3]</label>
                                <CustomSelect 
                                    value={formData.D3}
                                    onChange={(val) => handleFieldChange('D3', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.D3}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q4. Highest Education Level in Household [D4]</label>
                                <CustomSelect 
                                    value={formData.D4}
                                    onChange={(val) => handleFieldChange('D4', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.D4}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q5. Total Household Members [D5] (Whole Persons)</label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="15"
                                    name="D5"
                                    className="form-control"
                                    value={formData.D5}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', marginTop: '0.35rem' }}>
                                    Living in same residential unit. Integer only.
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q6. Food Security / Ration Card Status [D6]</label>
                                <CustomSelect 
                                    value={formData.D6}
                                    onChange={(val) => handleFieldChange('D6', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.D6}
                                    minWidth="100%"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Module 2: Digital Connectivity (3 controls) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 2</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Digital Infrastructure & Connectivity</h2>
                        </div>
                        <div className="choice-grid columns-3" style={{ gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Q7. Smartphone Availability [TECH1]</label>
                                <CustomSelect 
                                    value={formData.TECH1}
                                    onChange={(val) => handleFieldChange('TECH1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.TECH1}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q8. Internet Connectivity Mode [TECH2]</label>
                                <CustomSelect 
                                    value={formData.TECH2}
                                    onChange={(val) => handleFieldChange('TECH2', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.TECH2}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q9. Digital Literacy Independence [TECH3]</label>
                                <CustomSelect 
                                    value={formData.TECH3}
                                    onChange={(val) => handleFieldChange('TECH3', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.TECH3}
                                    minWidth="100%"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Module 3: Welfare Schemes (4 controls) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 3</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Welfare Scheme Access & Documentation</h2>
                        </div>
                        <div className="choice-grid columns-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Q10. Scheme Discovery Channel [SCH1]</label>
                                <CustomSelect 
                                    value={formData.SCH1}
                                    onChange={(val) => handleFieldChange('SCH1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.SCH1}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q11. Main Application Barrier [SCH2]</label>
                                <CustomSelect 
                                    value={formData.SCH2}
                                    onChange={(val) => handleFieldChange('SCH2', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.SCH2}
                                    minWidth="100%"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label">Q12. Official Portal Authenticity Perception [SCH3]</label>
                            <CustomSelect 
                                value={formData.SCH3}
                                onChange={(val) => handleFieldChange('SCH3', val)}
                                options={SURVEY_CANONICAL_OPTIONS.SCH3}
                                minWidth="100%"
                            />
                        </div>

                        {/* Q13: Multi-Select SCH4 */}
                        <div className="form-group" style={{ background: 'var(--color-slate-50)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-slate-200)' }}>
                            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                                Q13. Active Welfare Entitlements Enrolled [SCH4] (Multi-Select)
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', marginTop: '0.5rem' }}>
                                {SURVEY_CANONICAL_OPTIONS.SCH4_OPTIONS.map(opt => {
                                    const isChecked = (formData.SCH4 || []).includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSCH4Toggle(opt.value)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: 'var(--radius-md)',
                                                border: `1px solid ${isChecked ? 'var(--color-blue-600)' : 'var(--color-slate-200)'}`,
                                                background: isChecked ? 'var(--color-blue-50)' : '#ffffff',
                                                color: isChecked ? 'var(--color-blue-800)' : 'var(--color-slate-800)',
                                                fontSize: '0.8125rem',
                                                fontWeight: isChecked ? 600 : 500,
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span>{opt.label}</span>
                                            {isChecked && <Check size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} aria-hidden="true" />}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', marginTop: '0.5rem' }}>
                                Selecting 'None' automatically clears and disables specific scheme selections. Normalized as discrete database rows.
                            </div>
                        </div>
                    </section>

                    {/* Module 4: Emergency Contacts (5 controls: 4 CON1 + 1 CON2) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 4</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Emergency Directory & Helplines (CON1 & CON2)</h2>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label" style={{ marginBottom: '0.65rem' }}>
                                Q14. Direct Contact Numbers Stored or Written Down? [CON1_Panchayat, CON1_PHC, CON1_Police, CON1_Lineman]
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                                {SURVEY_CANONICAL_OPTIONS.CON1_SUBCODES.map(sub => {
                                    const isSaved = formData[sub.code] === 'Yes';
                                    return (
                                        <div key={sub.code} style={{ padding: '0.75rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.5rem' }}>
                                                {sub.label}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFieldChange(sub.code, 'Yes')}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.35rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: `1px solid ${isSaved ? 'var(--color-emerald-600)' : 'var(--color-slate-200)'}`,
                                                        background: isSaved ? 'var(--color-emerald-50)' : '#ffffff',
                                                        color: isSaved ? 'var(--color-emerald-800)' : 'var(--color-slate-700)',
                                                        fontWeight: isSaved ? 700 : 500,
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Yes, Saved
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFieldChange(sub.code, 'No')}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.35rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: `1px solid ${!isSaved ? 'var(--color-red-600)' : 'var(--color-slate-200)'}`,
                                                        background: !isSaved ? 'var(--color-red-50)' : '#ffffff',
                                                        color: !isSaved ? 'var(--color-red-800)' : 'var(--color-slate-700)',
                                                        fontWeight: !isSaved ? 700 : 500,
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    No / Not Saved
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Q15. Urgent Emergency Number Retrieval Mode [CON2]</label>
                            <CustomSelect 
                                value={formData.CON2}
                                onChange={(val) => handleFieldChange('CON2', val)}
                                options={SURVEY_CANONICAL_OPTIONS.CON2}
                                minWidth="100%"
                            />
                        </div>
                    </section>

                    {/* Module 5: Healthcare & Education (3 controls) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 5</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Healthcare, Education & Infrastructure</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Q16. Primary Health Centre (PHC) Facility Experience [HLTH1]</label>
                                <CustomSelect 
                                    value={formData.HLTH1}
                                    onChange={(val) => handleFieldChange('HLTH1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.HLTH1}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q17. School & Anganwadi Information Accessibility [EDU1]</label>
                                <CustomSelect 
                                    value={formData.EDU1}
                                    onChange={(val) => handleFieldChange('EDU1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.EDU1}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q18. Primary Household Drinking Water Supply Source [INFRA1]</label>
                                <CustomSelect 
                                    value={formData.INFRA1}
                                    onChange={(val) => handleFieldChange('INFRA1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.INFRA1}
                                    minWidth="100%"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Module 6: Local Livelihoods & Business Directory (2 controls) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 6</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Local Trades & Artisan Directory Demand</h2>
                        </div>
                        <div className="choice-grid columns-2" style={{ gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Q19. Access Mode for Local Tradespeople [BIZ1]</label>
                                <CustomSelect 
                                    value={formData.BIZ1}
                                    onChange={(val) => handleFieldChange('BIZ1', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.BIZ1}
                                    minWidth="100%"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Q20. Value of Verified Directory [BIZ2]</label>
                                <CustomSelect 
                                    value={formData.BIZ2}
                                    onChange={(val) => handleFieldChange('BIZ2', val)}
                                    options={SURVEY_CANONICAL_OPTIONS.BIZ2}
                                    minWidth="100%"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Module 7: Citizen Information Priorities (1 control) */}
                    <section className="section-block" style={{ marginBottom: '2rem' }}>
                        <div className="section-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Module 7</span>
                            <h2 className="section-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Citizen Information Priorities</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Q21. Single Most Important Information Priority [PRIO1]</label>
                            <CustomSelect 
                                value={formData.PRIO1}
                                onChange={(val) => handleFieldChange('PRIO1', val)}
                                options={SURVEY_CANONICAL_OPTIONS.PRIO1}
                                minWidth="100%"
                            />
                        </div>
                    </section>

                    {/* Qualitative Observations Section (survey_responses.notes) */}
                    <section className="section-block" style={{ marginBottom: '2rem', padding: '1.25rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="section-head" style={{ marginBottom: '0.75rem' }}>
                            <span className="badge badge-civic" style={{ fontSize: '0.7rem' }}>Interviewer Observations</span>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-slate-900)', marginTop: '0.25rem' }}>
                                Qualitative Field Remarks & Specific Information Gaps
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-600)', marginTop: '0.15rem' }}>
                                Document citizen anecdotes, unlisted scheme queries, or PHC timings confusion. Stored in response notes (excluded from mathematical percentages).
                            </p>
                        </div>
                        <div className="form-group">
                            <textarea
                                name="notes"
                                className="form-control"
                                rows="3"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="e.g. Household head reported visiting mandal office twice for caste certificate renewal; requested direct WhatsApp alert for PHC camp dates."
                            />
                        </div>
                    </section>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                        style={{ minHeight: '48px', width: '100%', fontSize: '1rem', fontWeight: 700 }}
                    >
                        {isSubmitting ? 'Recording & Verifying Survey...' : 'Save & Record Validated Household Survey'}
                    </button>
                </form>
            </div>
        </main>
    );
}
