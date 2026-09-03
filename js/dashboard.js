// ==============================================================================
// Village Information Portal — Survey Dashboard Controller
// Fetches real responses from Supabase, calculates empirical statistics,
// and exports formatted CSV data for CSP documentation.
// Rules: Zero emojis, empirical data only.
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const btnRefresh = document.getElementById('btnRefresh');
    const btnExportCSV = document.getElementById('btnExportCSV');
    const btnCopyReportText = document.getElementById('btnCopyReportText');
    const reportTextContainer = document.getElementById('reportTextContainer');
    const reportTextOutput = document.getElementById('reportTextOutput');
    const statusDiv = document.getElementById('dashboardStatus');
    const emptyNotice = document.getElementById('emptyStateNotice');

    let cachedResponses = [];
    let cachedAnswers = [];

    async function loadDashboardData() {
        statusDiv.innerHTML = '<div class="alert alert-warning">Connecting to Supabase and aggregating real survey responses...</div>';
        const client = getSupabaseClient();
        if (!client) {
            statusDiv.innerHTML = '<div class="alert alert-danger">Error: Supabase client could not be initialized. Verify configuration.</div>';
            return;
        }

        try {
            // Fetch responses
            const { data: responses, error: respError } = await client
                .from('survey_responses')
                .select('*')
                .order('created_at', { ascending: true });

            if (respError) throw respError;

            // Fetch answers
            const { data: answers, error: ansError } = await client
                .from('survey_answers')
                .select('*');

            if (ansError) throw ansError;

            cachedResponses = responses || [];
            cachedAnswers = answers || [];

            statusDiv.innerHTML = '';
            renderMetrics(cachedResponses, cachedAnswers);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            statusDiv.innerHTML = '<div class="alert alert-danger">Failed to retrieve survey data from Supabase: ' + (err.message || err) + '</div>';
        }
    }

    function renderMetrics(responses, answers) {
        const total = responses.length;
        document.getElementById('statTotalHouseholds').textContent = total;

        if (total === 0) {
            emptyNotice.style.display = 'block';
            document.getElementById('statSmartphonePct').textContent = '0%';
            document.getElementById('statSmartphoneCount').textContent = '0 / 0 households';
            document.getElementById('statSchemeDocGap').textContent = '0%';
            document.getElementById('statSchemeDocCount').textContent = '0 / 0 households';
            document.getElementById('statContactDeficit').textContent = '0%';
            document.getElementById('statContactCount').textContent = '0 / 0 households';

            const emptyMsg = '<p style="color: var(--color-text-muted); font-size: 0.875rem;">Awaiting completed field survey responses from Week 1.</p>';
            document.getElementById('metricTechBreakdown').innerHTML = emptyMsg;
            document.getElementById('metricSchemeBreakdown').innerHTML = emptyMsg;
            document.getElementById('metricContactBreakdown').innerHTML = emptyMsg;
            document.getElementById('metricHealthEduBreakdown').innerHTML = emptyMsg;
            document.getElementById('metricBizBreakdown').innerHTML = emptyMsg;
            document.getElementById('metricPriorityBreakdown').innerHTML = emptyMsg;
            return;
        }

        emptyNotice.style.display = 'none';

        // Index answers by question_code
        const answersByCode = {};
        answers.forEach(a => {
            if (!answersByCode[a.question_code]) {
                answersByCode[a.question_code] = [];
            }
            answersByCode[a.question_code].push(a.answer_value);
        });

        // 1. Smartphone Penetration (TECH1)
        const tech1Answers = answersByCode['TECH1'] || [];
        const smartCount = tech1Answers.filter(v => v === 'Smartphone-Available').length;
        const smartPct = Math.round((smartCount / total) * 100);
        document.getElementById('statSmartphonePct').textContent = smartPct + '%';
        document.getElementById('statSmartphoneCount').textContent = smartCount + ' / ' + total + ' households';

        // 2. Scheme Document Hurdles (SCH2)
        const sch2Answers = answersByCode['SCH2'] || [];
        const docGapCount = sch2Answers.filter(v => v === 'Unknown-Eligibility-Docs' || v === 'Repeated-Office-Visits').length;
        const docGapPct = Math.round((docGapCount / total) * 100);
        document.getElementById('statSchemeDocGap').textContent = docGapPct + '%';
        document.getElementById('statSchemeDocCount').textContent = docGapCount + ' / ' + total + ' face document hurdles';

        // 3. Emergency Contact Deficit (CON1_PHC)
        const phcAnswers = answersByCode['CON1_PHC'] || [];
        const hasPhcCount = phcAnswers.filter(v => v === 'Yes').length;
        const noPhcCount = total - hasPhcCount;
        const noPhcPct = Math.round((noPhcCount / total) * 100);
        document.getElementById('statContactDeficit').textContent = noPhcPct + '%';
        document.getElementById('statContactCount').textContent = noPhcCount + ' / ' + total + ' lack verified PHC number';

        // Render Cards Detail HTML
        renderTechDetails(answersByCode, total);
        renderSchemeDetails(answersByCode, total);
        renderContactDetails(answersByCode, total);
        renderHealthEduDetails(answersByCode, total);
        renderBizDetails(answersByCode, total);
        renderPriorityDetails(answersByCode, total);
    }

    function countOccurrences(arr) {
        const counts = {};
        arr.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
        return counts;
    }

    function formatList(counts) {
        const questionTotal = Object.values(counts).reduce((sum, val) => sum + val, 0);
        if (questionTotal === 0) {
            return '<p style="color: var(--color-text-muted); font-size: 0.8125rem;">No responses for this question.</p>';
        }

        let html = '<ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.375rem;">';
        for (const [key, count] of Object.entries(counts)) {
            const pct = Math.round((count / questionTotal) * 100);
            html += '<li style="display: flex; justify-content: space-between; border-bottom: 1px dotted #e2e8f0; padding-bottom: 0.25rem;">'
                + '<span>' + formatKeyLabel(key) + '</span>'
                + '<strong>' + count + ' / ' + questionTotal + ' (' + pct + '%)</strong></li>';
        }
        html += '</ul>';
        return html;
    }

    function formatKeyLabel(k) {
        return k.replace(/[-_]/g, ' ');
    }

    function renderTechDetails(byCode, total) {
        const el = document.getElementById('metricTechBreakdown');
        const tech1 = countOccurrences(byCode['TECH1'] || []);
        const tech2 = countOccurrences(byCode['TECH2'] || []);
        const tech3 = countOccurrences(byCode['TECH3'] || []);

        el.innerHTML = '<div><strong>Primary Connection (TECH2):</strong>' + formatList(tech2, total) + '</div>'
            + '<div style="margin-top: 0.5rem;"><strong>Digital Literacy (TECH3):</strong>' + formatList(tech3, total) + '</div>';
    }

    function renderSchemeDetails(byCode, total) {
        const el = document.getElementById('metricSchemeBreakdown');
        const sch1 = countOccurrences(byCode['SCH1'] || []);
        const sch3 = countOccurrences(byCode['SCH3'] || []);

        el.innerHTML = '<div><strong>Information Source (SCH1):</strong>' + formatList(sch1, total) + '</div>'
            + '<div style="margin-top: 0.5rem;"><strong>Domain Confusion (SCH3):</strong>' + formatList(sch3, total) + '</div>';
    }

    function renderContactDetails(byCode, total) {
        const el = document.getElementById('metricContactBreakdown');
        const con1P = (byCode['CON1_Panchayat'] || []).filter(v => v === 'Yes').length;
        const con1PH = (byCode['CON1_PHC'] || []).filter(v => v === 'Yes').length;
        const con1Pol = (byCode['CON1_Police'] || []).filter(v => v === 'Yes').length;
        const con1L = (byCode['CON1_Lineman'] || []).filter(v => v === 'Yes').length;
        const con2 = countOccurrences(byCode['CON2'] || []);

        el.innerHTML = '<div><strong>Has Contact Saved (CON1):</strong>'
            + '<ul style="list-style: none; padding-left: 0; margin-top: 0.25rem;">'
            + '<li style="display: flex; justify-content: space-between;"><span>Panchayat Official:</span><strong>' + con1P + ' / ' + total + '</strong></li>'
            + '<li style="display: flex; justify-content: space-between;"><span>PHC / Ambulance:</span><strong>' + con1PH + ' / ' + total + '</strong></li>'
            + '<li style="display: flex; justify-content: space-between;"><span>Police Station:</span><strong>' + con1Pol + ' / ' + total + '</strong></li>'
            + '<li style="display: flex; justify-content: space-between;"><span>Electricity Lineman:</span><strong>' + con1L + ' / ' + total + '</strong></li>'
            + '</ul></div>'
            + '<div style="margin-top: 0.5rem;"><strong>Emergency Lookup Method (CON2):</strong>' + formatList(con2, total) + '</div>';
    }

    function renderHealthEduDetails(byCode, total) {
        const el = document.getElementById('metricHealthEduBreakdown');
        const hlth = countOccurrences(byCode['HLTH1'] || []);
        const edu = countOccurrences(byCode['EDU1'] || []);

        el.innerHTML = '<div><strong>PHC Doctor Access (HLTH1):</strong>' + formatList(hlth, total) + '</div>'
            + '<div style="margin-top: 0.5rem;"><strong>School Info Access (EDU1):</strong>' + formatList(edu, total) + '</div>';
    }

    function renderBizDetails(byCode, total) {
        const el = document.getElementById('metricBizBreakdown');
        const biz1 = countOccurrences(byCode['BIZ1'] || []);
        const biz2 = countOccurrences(byCode['BIZ2'] || []);

        el.innerHTML = '<div><strong>Finding Local Trades (BIZ1):</strong>' + formatList(biz1, total) + '</div>'
            + '<div style="margin-top: 0.5rem;"><strong>Directory Demand (BIZ2):</strong>' + formatList(biz2, total) + '</div>';
    }

    function renderPriorityDetails(byCode, total) {
        const el = document.getElementById('metricPriorityBreakdown');
        const prio = countOccurrences(byCode['PRIO1'] || []);
        el.innerHTML = '<div><strong>Top Ranked Needs (PRIO1):</strong>' + formatList(prio, total) + '</div>';
    }

    // CSV Export Handler
    btnExportCSV.addEventListener('click', () => {
        if (cachedResponses.length === 0) {
            alert('No responses available to export.');
            return;
        }

        // Build mapping response_id -> { question_code: answer_value }
        const map = {};
        cachedAnswers.forEach(a => {
            if (!map[a.response_id]) map[a.response_id] = {};
            map[a.response_id][a.question_code] = a.answer_value;
        });

        const headers = [
            'Respondent_ID', 'Date_Collected', 'Interviewer', 'Ward_Street',
            'D1_Age', 'D2_Gender', 'D3_Occupation', 'D4_Education', 'D5_HH_Size',
            'TECH1_Smartphone', 'TECH2_Internet', 'TECH3_Literacy',
            'SCH1_Source', 'SCH2_Challenge', 'SCH3_Domain_Conf',
            'CON1_Panchayat', 'CON1_PHC', 'CON1_Police', 'CON1_Lineman', 'CON2_Emergency_Find',
            'HLTH1_PHC_Access', 'EDU1_School_Access',
            'BIZ1_Find_Trades', 'BIZ2_Directory_Demand', 'PRIO1_Top_Rank'
        ];

        let csvContent = headers.join(',') + '\n';

        cachedResponses.forEach(r => {
            const ans = map[r.id] || {};
            const row = [
                escapeCsv(r.respondent_code),
                escapeCsv(r.created_at ? r.created_at.split('T')[0] : ''),
                escapeCsv(r.interviewer_name),
                escapeCsv(r.ward_street || ''),
                escapeCsv(ans['D1'] || ''),
                escapeCsv(ans['D2'] || ''),
                escapeCsv(ans['D3'] || ''),
                escapeCsv(ans['D4'] || ''),
                escapeCsv(ans['D5'] || ''),
                escapeCsv(ans['TECH1'] || ''),
                escapeCsv(ans['TECH2'] || ''),
                escapeCsv(ans['TECH3'] || ''),
                escapeCsv(ans['SCH1'] || ''),
                escapeCsv(ans['SCH2'] || ''),
                escapeCsv(ans['SCH3'] || ''),
                escapeCsv(ans['CON1_Panchayat'] || 'No'),
                escapeCsv(ans['CON1_PHC'] || 'No'),
                escapeCsv(ans['CON1_Police'] || 'No'),
                escapeCsv(ans['CON1_Lineman'] || 'No'),
                escapeCsv(ans['CON2'] || ''),
                escapeCsv(ans['HLTH1'] || ''),
                escapeCsv(ans['EDU1'] || ''),
                escapeCsv(ans['BIZ1'] || ''),
                escapeCsv(ans['BIZ2'] || ''),
                escapeCsv(ans['PRIO1'] || '')
            ];
            csvContent += row.join(',') + '\n';
        });

        // Trigger file download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'csp_field_survey_responses_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function escapeCsv(val) {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return '"' + str + '"';
    }

    // Copy Report Text Handler
    btnCopyReportText.addEventListener('click', () => {
        const total = cachedResponses.length;
        if (total === 0) {
            alert('Collect survey data before generating report findings.');
            return;
        }

        const byCode = {};
        cachedAnswers.forEach(a => {
            if (!byCode[a.question_code]) byCode[a.question_code] = [];
            byCode[a.question_code].push(a.answer_value);
        });

        const smartCount = (byCode['TECH1'] || []).filter(v => v === 'Smartphone-Available').length;
        const smartPct = Math.round((smartCount / total) * 100);

        const docGapCount = (byCode['SCH2'] || []).filter(v => v === 'Unknown-Eligibility-Docs' || v === 'Repeated-Office-Visits').length;
        const docGapPct = Math.round((docGapCount / total) * 100);

        const noPhcCount = total - (byCode['CON1_PHC'] || []).filter(v => v === 'Yes').length;
        const noPhcPct = Math.round((noPhcCount / total) * 100);

        const bizDemandCount = (byCode['BIZ2'] || []).filter(v => v === 'Very-Helpful').length;
        const bizDemandPct = Math.round((bizDemandCount / total) * 100);

        const markdownText = '### Empirical Survey Findings Summary (Sample N = ' + total + ' Households)\n\n'
            + '1. **Digital Connectivity**: ' + smartCount + ' out of ' + total + ' surveyed households (' + smartPct + '%) have access to at least one working smartphone, confirming the feasibility of a mobile web portal for local information delivery.\n'
            + '2. **Welfare Scheme Hurdles**: ' + docGapCount + ' households (' + docGapPct + '%) reported major difficulties in applying for government welfare programs due to lack of upfront eligibility clarity and missing document checklists.\n'
            + '3. **Emergency Contact Void**: ' + noPhcCount + ' households (' + noPhcPct + '%) do not possess verified direct phone numbers for the Primary Health Centre or emergency ambulance.\n'
            + '4. **Local Business Directory Demand**: ' + bizDemandCount + ' households (' + bizDemandPct + '%) strongly endorsed the establishment of a verified village trades and artisan directory.\n\n'
            + '*Source: Primary CSP Household Survey conducted in [Assigned Village Name], aggregated live via Supabase.*';

        reportTextOutput.value = markdownText;
        reportTextContainer.style.display = 'block';
        reportTextOutput.select();
        navigator.clipboard.writeText(markdownText);
        alert('Survey findings copied to clipboard! Ready to paste into CSP Final Report.');
    });

    btnRefresh.addEventListener('click', loadDashboardData);

    // Initial Load
    loadDashboardData();
});
