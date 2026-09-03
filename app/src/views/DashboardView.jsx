import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DashboardView() {
    const [responses, setResponses] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        setErrorMsg(null);
        try {
            const [rRes, aRes] = await Promise.all([
                supabase.from('survey_responses').select('*').order('created_at', { ascending: true }),
                supabase.from('survey_answers').select('*')
            ]);

            if (rRes.error) throw rRes.error;
            if (aRes.error) throw aRes.error;

            setResponses(rRes.data || []);
            setAnswers(aRes.data || []);
        } catch (err) {
            console.error('Error fetching survey data:', err);
            setErrorMsg(err.message || 'Failed to connect to database.');
        } finally {
            setLoading(false);
        }
    }

    const total = responses.length;

    // Aggregate answers by question code
    const answersByCode = {};
    answers.forEach(a => {
        if (!answersByCode[a.question_code]) {
            answersByCode[a.question_code] = [];
        }
        answersByCode[a.question_code].push(a.answer_value);
    });

    // 1. Smartphone Penetration (TECH1)
    const tech1Arr = answersByCode['TECH1'] || [];
    const smartCount = tech1Arr.filter(v => v === 'Smartphone-Available').length;
    const smartPct = total > 0 ? Math.round((smartCount / total) * 100) : 0;

    // 2. Scheme Document Hurdles (SCH2)
    const sch2Arr = answersByCode['SCH2'] || [];
    const docHurdleCount = sch2Arr.filter(v => v === 'Unknown-Eligibility-Docs' || v === 'Repeated-Office-Visits').length;
    const docHurdlePct = total > 0 ? Math.round((docHurdleCount / total) * 100) : 0;

    // 3. Emergency Contact Deficit (CON1_PHC)
    const phcArr = answersByCode['CON1_PHC'] || [];
    const hasPhc = phcArr.filter(v => v === 'Yes').length;
    const noPhcCount = total - hasPhc;
    const noPhcPct = total > 0 ? Math.round((noPhcCount / total) * 100) : 0;

    // CSV Export Engine
    const exportCSV = () => {
        if (responses.length === 0) {
            alert('No survey records found to export. Complete surveys via the Field Survey tab first.');
            return;
        }

        const headers = ['Response ID', 'Household Code', 'Surveyor', 'Ward', 'Started At', 'Completed At', 'Question Code', 'Answer'];
        const rows = [];

        responses.forEach(r => {
            const respAnswers = answers.filter(a => a.response_id === r.id);
            respAnswers.forEach(a => {
                rows.push([
                    r.id,
                    `"${r.respondent_code}"`,
                    `"${r.interviewer_name}"`,
                    `"${r.locality_ward || ''}"`,
                    r.started_at,
                    r.completed_at,
                    a.question_code,
                    `"${a.answer_value}"`
                ]);
            });
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `csp_survey_responses_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className="container" id="dashboardMain" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <span className="badge badge-civic">Academic CSP Analytics</span>
                    <h1 className="hero-title" style={{ fontSize: '1.75rem', marginTop: '0.35rem' }}>
                        Interactive CSP Survey Analytics Dashboard
                    </h1>
                    <p className="section-desc">
                        Empirical socio-economic metrics and problem-traceability indicators aggregated live from field survey responses.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={loadData}
                        disabled={loading}
                        style={{ minHeight: '44px', padding: '0.5rem 1rem' }}
                    >
                        <RefreshCw size={15} style={{ marginRight: '6px' }} aria-hidden="true" /> Refresh Data
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={exportCSV}
                        style={{ minHeight: '44px', padding: '0.5rem 1rem' }}
                    >
                        <Download size={15} style={{ marginRight: '6px' }} aria-hidden="true" /> Export Dataset (CSV)
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="alert alert-danger" role="alert">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Live KPI Stat Cards */}
            <div className="kpi-grid">
                <div className="kpi-stat-card">
                    <div className="kpi-stat-header">
                        <span className="kpi-stat-label">Sample Size (N)</span>
                    </div>
                    <div className="kpi-stat-val">{total}</div>
                    <div className="kpi-stat-sub">Validated Household Interviews</div>
                </div>

                <div className="kpi-stat-card">
                    <div className="kpi-stat-header">
                        <span className="kpi-stat-label">Smartphone Access</span>
                    </div>
                    <div className="kpi-stat-val">{total > 0 ? `${smartPct}%` : '0%'}</div>
                    <div className="kpi-stat-sub">
                        {total > 0 ? `${smartCount} of ${total} surveyed households` : 'Awaiting survey records'}
                    </div>
                </div>

                <div className="kpi-stat-card">
                    <div className="kpi-stat-header">
                        <span className="kpi-stat-label">Scheme Document Hurdles</span>
                    </div>
                    <div className="kpi-stat-val">{total > 0 ? `${docHurdlePct}%` : '0%'}</div>
                    <div className="kpi-stat-sub">
                        {total > 0 ? `${docHurdleCount} of ${total} face paperwork barriers` : 'Awaiting survey records'}
                    </div>
                </div>

                <div className="kpi-stat-card">
                    <div className="kpi-stat-header">
                        <span className="kpi-stat-label">Emergency Contact Void</span>
                    </div>
                    <div className="kpi-stat-val">{total > 0 ? `${noPhcPct}%` : '0%'}</div>
                    <div className="kpi-stat-sub">
                        {total > 0 ? `${noPhcCount} of ${total} lack local emergency numbers` : 'Awaiting survey records'}
                    </div>
                </div>
            </div>

            {total === 0 && (
                <div className="alert alert-warning" style={{ marginBottom: '2rem' }}>
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>
                        Database currently contains 0 field survey responses. Complete surveys via the <strong>Field Survey</strong> tab to dynamically generate empirical percentages. Figures will update live upon data entry.
                    </span>
                </div>
            )}

            {/* Academic Problem Traceability Matrix */}
            <div className="traceability-table-card">
                <div className="section-head">
                    <h2 className="section-title">
                        <span>CSP Problem Traceability Matrix</span>
                    </h2>
                    <p className="section-desc">
                        Direct mapping between survey-identified community challenges and portal technical interventions.
                    </p>
                </div>

                <table className="traceability-table">
                    <thead>
                        <tr>
                            <th>Identified Information Gap</th>
                            <th>Survey Indicator</th>
                            <th>Derived Requirement</th>
                            <th>Portal Technical Intervention</th>
                            <th>Validation Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Lack of awareness regarding welfare scheme eligibility and documents</td>
                            <td>SCH2 (Document Hurdles)</td>
                            <td>Centralized document checklist & eligibility guidelines</td>
                            <td>Welfare Schemes Module with structured checklists & direct links</td>
                            <td>Community awareness campaign & citizen feedback</td>
                        </tr>
                        <tr>
                            <td>Absence of saved contact numbers for local emergency services</td>
                            <td>CON1 (Emergency Contacts)</td>
                            <td>Direct-calling directory for local responders</td>
                            <td>Verified Contacts Directory with one-tap tel: protocol</td>
                            <td>Smartphone dial testing during field evaluations</td>
                        </tr>
                        <tr>
                            <td>Uncertainty regarding PHC doctor availability and OPD timings</td>
                            <td>HLTH1 (Healthcare Experience)</td>
                            <td>Clear schedule visibility and operating-hours status</td>
                            <td>PHC Module with operating-hours-based status indicator</td>
                            <td>Verification against PHC notice board schedules</td>
                        </tr>
                        <tr>
                            <td>Low digital visibility for village artisans, tradespeople, and SHGs</td>
                            <td>BIZ1 (Local Services)</td>
                            <td>Community business and artisan directory</td>
                            <td>Local Business & SHG Directory with direct contact access</td>
                            <td>Confirmation with local enterprise proprietors</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
}
