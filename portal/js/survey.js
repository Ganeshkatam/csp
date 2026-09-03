// ==============================================================================
// Village Information Portal — Field Survey Controller
// Architecture: Supabase Client + LocalStorage Offline Synchronization
// Zero emojis, strict validation, automatic respondent ID increment
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const statusMsg = document.getElementById('statusMessage');
    const offlineBanner = document.getElementById('offlineBanner');
    const offlineCounterBadge = document.getElementById('offlineCounterBadge');
    const btnSyncOffline = document.getElementById('btnSyncOffline');

    let interviewStartTime = new Date().toISOString();
    form.addEventListener('focusin', () => {
        if (!interviewStartTime) {
            interviewStartTime = new Date().toISOString();
        }
    }, { once: true });

    // Network connectivity monitoring
    function updateOnlineStatus() {
        if (!navigator.onLine) {
            offlineBanner.style.display = 'block';
        } else {
            offlineBanner.style.display = 'none';
        }
        updateOfflineUI();
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Offline storage helpers
    function getOfflineSurveys() {
        try {
            return JSON.parse(localStorage.getItem('csp_offline_surveys') || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveOfflineSurveys(surveys) {
        localStorage.setItem('csp_offline_surveys', JSON.stringify(surveys));
        updateOfflineUI();
    }

    function updateOfflineUI() {
        const offlineItems = getOfflineSurveys();
        offlineCounterBadge.textContent = 'Stored Offline: ' + offlineItems.length;
        if (offlineItems.length > 0 && navigator.onLine) {
            btnSyncOffline.style.display = 'inline-flex';
            btnSyncOffline.textContent = 'Sync ' + offlineItems.length + ' Offline Records';
        } else {
            btnSyncOffline.style.display = 'none';
        }
    }

    // Auto-fill surveyor name if remembered
    const savedSurveyor = localStorage.getItem('csp_surveyor_name');
    if (savedSurveyor) {
        const interviewerInput = document.getElementById('interviewerName');
        if (interviewerInput && !interviewerInput.value) {
            interviewerInput.value = savedSurveyor;
        }
    }

    // Auto-increment respondent code helper
    function getNextRespondentCode(currentCode) {
        const match = currentCode.match(/^([A-Za-z]+-?)(\d+)$/);
        if (match) {
            const prefix = match[1];
            const num = parseInt(match[2], 10) + 1;
            const padded = String(num).padStart(match[2].length, '0');
            return prefix + padded;
        }
        return '';
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusMsg.innerHTML = '';

        const respondentCode = document.getElementById('respondentCode').value.trim();
        const interviewerName = document.getElementById('interviewerName').value.trim();
        const wardStreet = document.getElementById('wardStreet').value.trim();
        const consentObtained = document.getElementById('consentObtained').checked;
        const notes = document.getElementById('notes').value.trim();

        if (!consentObtained) {
            showStatus('Error: Respondent consent is required before proceeding with the survey.', 'danger');
            return;
        }

        if (!respondentCode || !interviewerName) {
            showStatus('Error: Respondent ID and Surveyor Name are mandatory fields.', 'danger');
            return;
        }

        // Cache surveyor name for subsequent entries
        localStorage.setItem('csp_surveyor_name', interviewerName);

        // Collect answers
        const formData = new FormData(form);
        const requiredCodes = ['D1', 'D2', 'D3', 'D4', 'TECH1', 'TECH2', 'TECH3', 'SCH1', 'SCH2', 'SCH3', 'CON2', 'HLTH1', 'EDU1', 'BIZ1', 'BIZ2', 'PRIO1'];

        for (const code of requiredCodes) {
            if (!formData.get(code)) {
                showStatus('Incomplete Survey: Please ensure all required questions (including ' + code + ') are answered.', 'warning');
                return;
            }
        }

        const answers = [
            { code: 'D1', val: formData.get('D1') },
            { code: 'D2', val: formData.get('D2') },
            { code: 'D3', val: formData.get('D3') },
            { code: 'D4', val: formData.get('D4') },
            { code: 'D5', val: formData.get('D5') || '1' },
            { code: 'TECH1', val: formData.get('TECH1') },
            { code: 'TECH2', val: formData.get('TECH2') },
            { code: 'TECH3', val: formData.get('TECH3') },
            { code: 'SCH1', val: formData.get('SCH1') },
            { code: 'SCH2', val: formData.get('SCH2') },
            { code: 'SCH3', val: formData.get('SCH3') },
            { code: 'CON1_Panchayat', val: formData.get('CON1_Panchayat') ? 'Yes' : 'No' },
            { code: 'CON1_PHC', val: formData.get('CON1_PHC') ? 'Yes' : 'No' },
            { code: 'CON1_Police', val: formData.get('CON1_Police') ? 'Yes' : 'No' },
            { code: 'CON1_Lineman', val: formData.get('CON1_Lineman') ? 'Yes' : 'No' },
            { code: 'CON2', val: formData.get('CON2') },
            { code: 'HLTH1', val: formData.get('HLTH1') },
            { code: 'EDU1', val: formData.get('EDU1') },
            { code: 'BIZ1', val: formData.get('BIZ1') },
            { code: 'BIZ2', val: formData.get('BIZ2') },
            { code: 'PRIO1', val: formData.get('PRIO1') }
        ];

        const completedTime = new Date().toISOString();
        const payload = {
            respondent_code: respondentCode,
            interviewer_name: interviewerName,
            locality_ward: wardStreet,
            consent_obtained: consentObtained,
            started_at: interviewStartTime,
            completed_at: completedTime,
            notes: notes,
            answers: answers,
            timestamp: completedTime
        };

        const submitBtn = document.getElementById('btnSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving Response...';

        try {
            if (!navigator.onLine) {
                storeOffline(payload);
                handleSaveSuccess(respondentCode, true);
            } else {
                const client = getSupabaseClient();
                if (!client) {
                    throw new Error('Supabase client unavailable');
                }

                // Insert response record
                const { data: respData, error: respError } = await client
                    .from('survey_responses')
                    .insert({
                        village_id: SUPABASE_CONFIG.defaultVillageId,
                        respondent_code: respondentCode,
                        interviewer_name: interviewerName,
                        locality_ward: wardStreet,
                        consent_obtained: consentObtained,
                        started_at: interviewStartTime,
                        completed_at: completedTime
                    })
                    .select('id')
                    .single();

                if (respError) {
                    throw respError;
                }

                // Insert normalized answer rows
                const answerRows = answers.map(a => ({
                    response_id: respData.id,
                    question_code: a.code,
                    answer_value: a.val,
                    notes: a.code === 'PRIO1' ? notes : null
                }));

                const { error: ansError } = await client
                    .from('survey_answers')
                    .insert(answerRows);

                if (ansError) {
                    throw ansError;
                }

                handleSaveSuccess(respondentCode, false);
            }
        } catch (err) {
            console.warn('Network or database save failed, storing offline:', err);
            storeOffline(payload);
            handleSaveSuccess(respondentCode, true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Survey Response';
        }
    });

    function storeOffline(payload) {
        const offlineItems = getOfflineSurveys();
        offlineItems.push(payload);
        saveOfflineSurveys(offlineItems);
    }

    function handleSaveSuccess(savedCode, isOffline) {
        const nextCode = getNextRespondentCode(savedCode);
        const statusType = isOffline ? 'warning' : 'success';
        const msg = isOffline
            ? 'Household ' + savedCode + ' saved locally on this device (offline mode). It will sync once internet connection is restored.'
            : 'Household ' + savedCode + ' successfully recorded in database.';

        showStatus(msg, statusType);

        // Reset form inputs except surveyor name
        form.reset();
        document.getElementById('consentObtained').checked = true;
        const interviewerInput = document.getElementById('interviewerName');
        const savedSurveyor = localStorage.getItem('csp_surveyor_name');
        if (savedSurveyor) interviewerInput.value = savedSurveyor;

        if (nextCode) {
            document.getElementById('respondentCode').value = nextCode;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sync Offline Records
    btnSyncOffline.addEventListener('click', async () => {
        const offlineItems = getOfflineSurveys();
        if (offlineItems.length === 0) return;

        btnSyncOffline.disabled = true;
        btnSyncOffline.textContent = 'Syncing...';

        const client = getSupabaseClient();
        if (!client) {
            showStatus('Error: Supabase client not initialized.', 'danger');
            btnSyncOffline.disabled = false;
            return;
        }

        let syncedCount = 0;
        const failedItems = [];

        for (const item of offlineItems) {
            try {
                const { data: respData, error: respError } = await client
                    .from('survey_responses')
                    .insert({
                        village_id: SUPABASE_CONFIG.defaultVillageId,
                        respondent_code: item.respondent_code,
                        interviewer_name: item.interviewer_name,
                        locality_ward: item.locality_ward || item.ward_street,
                        consent_obtained: item.consent_obtained,
                        started_at: item.started_at || item.timestamp,
                        completed_at: item.completed_at || item.timestamp,
                        created_at: item.timestamp
                    })
                    .select('id')
                    .single();

                if (respError) throw respError;

                const answerRows = item.answers.map(a => ({
                    response_id: respData.id,
                    question_code: a.code,
                    answer_value: a.val,
                    notes: a.code === 'PRIO1' ? item.notes : null
                }));

                const { error: ansError } = await client
                    .from('survey_answers')
                    .insert(answerRows);

                if (ansError) throw ansError;

                syncedCount++;
            } catch (err) {
                console.error('Failed to sync item:', item.respondent_code, err);
                failedItems.push(item);
            }
        }

        saveOfflineSurveys(failedItems);
        btnSyncOffline.disabled = false;

        if (syncedCount > 0) {
            showStatus('Successfully synced ' + syncedCount + ' offline records to Supabase database.', 'success');
        }
        if (failedItems.length > 0) {
            showStatus(failedItems.length + ' records failed to sync and remain stored locally.', 'warning');
        }
    });

    function showStatus(text, type) {
        statusMsg.innerHTML = '<div class="alert alert-' + type + '">' + text + '</div>';
    }
});
