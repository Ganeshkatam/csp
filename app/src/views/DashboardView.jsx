import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Download, FileText, AlertCircle } from 'lucide-react';
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
            console.error('Error fetching dashboard:', err);
            setErrorMsg(err.message || 'Failed to connect to Supabase.');
        } finally {
            setLoading(false);
        }
    }

    const total = responses.length;

    // Index answers by code
    const answersByCode = {};
    answers.forEach(a => {
        if (!answersByCode[a.question_code]) {
            answersByCode[a.question_code] = [];
        }
        answersByCode[a.question_code].push(a.answer_value);
    });

    // 1. Smartphone Penetration
    const tech1Arr = answersByCode['TECH1'] || [];
    const smartCount = tech1Arr.filter(v => v === 'Smartphone-Available').length;
    const smartPct = total > 0 ? Math.round((smartCount / total) * 100) : 0;

    // 2. Scheme Document Hurdles
    const sch2Arr = answersByCode['SCH2'] || [];
    const docHurdleCount = sch2Arr.filter(v => v === 'Unknown-Eligibility-Docs' || v === 'Repeated-Office-Visits').length;
    const docHurdlePct = total > 0 ? Math.round((docHurdleCount / total) * 100) : 0;

    // 3. Emergency Contact Deficit
    const phcArr = answersByCode['CON1_PHC'] || [];
    const hasPhc = phcArr.filter(v => v === 'Yes').length;
    const noPhcCount = total - hasPhc;
    const noPhcPct = total > 0 ? Math.round((noPhcCount / total) * 100) : 0;

    // CSV Export
    const exportCSV = () => {
        if (responses.length === 0) {
            alert('No survey responses recorded yet to export.');
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
        <main className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', margin: '1.5rem 0' }}>
                <div>
                    <h1 className="brand-title" style={{ fontSize: '1.75rem' }}>Community Survey Dashboard</h1>
                    <p className="section-desc">Empirical socio-economic and information-needs metrics aggregated live from Supabase database.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={loadData}
                        disabled={loading}
                        style={{ minHeight: '40px', padding: '0.5rem 1rem' }}
                    >
                        <RefreshCw size={14} style={{ marginRight: '6px' }} /> Refresh Live Data
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={exportCSV}
                        style={{ minHeight: '40px', padding: '0.5rem 1rem' }}
                    >
                        <Download size={14} style={{ marginRight: '6px' }} /> Export to CSV
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="alert alert-danger">
                    <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    {errorMsg}
                </div>
            )}

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-num">{total}</div>
                    <div className="stat-label">Total Households Surveyed</div>
                    <div className="stat-sub">Sample size (N) in Supabase</div>
                </div>
                <div className="stat-card">
                    <div className="stat-num">{smartPct}%</div>
                    <div className="stat-label">Smartphone Availability</div>
                    <div className="stat-sub">{smartCount} / {total} households</div>
                </div>
                <div className="stat-card">
                    <div className="stat-num">{docHurdlePct}%</div>
                    <div className="stat-label">Scheme Document Hurdles</div>
                    <div className="stat-sub">{docHurdleCount} / {total} face document hurdles</div>
                </div>
                <div className="stat-card">
                    <div className="stat-num">{noPhcPct}%</div>
                    <div className="stat-label">Emergency Contact Void</div>
                    <div className="stat-sub">{noPhcCount} / {total} lack verified PHC number</div>
                </div>
            </div>

            {total === 0 && (
                <div className="alert alert-warning" style={{ margin: '1.5rem 0' }}>
                    No survey records found in the database yet. Conduct interviews via the <strong>Field Survey</strong> tab to populate live metrics.
                </div>
            )}

            {/* Detail Cards */}
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                <div className="info-card">
                    <div className="info-card-header">
                        <span className="badge badge-civic">Connectivity & Devices</span>
                        <h2 className="info-card-title">Digital Infrastructure (TECH1 - TECH3)</h2>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {total > 0 ? (
                            `Smartphone penetration: ${smartPct}%. High reliance on mobile 4G data networks for online services.`
                        ) : (
                            'Awaiting survey responses from Week 1 field collection.'
                        )}
                    </p>
                    <div className="verification-tag">Derived Requirement: Low-bandwidth, mobile-first design</div>
                </div>

                <div className="info-card">
                    <div className="info-card-header">
                        <span className="badge badge-civic">Public Welfare</span>
                        <h2 className="info-card-title">Welfare Schemes & Fraud Risk (SCH1 - SCH3)</h2>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {total > 0 ? (
                            `${docHurdlePct}% of families face hurdles due to missing document checklists and fear of unofficial links.`
                        ) : (
                            'Awaiting survey responses from Week 1 field collection.'
                        )}
                    </p>
                    <div className="verification-tag">Derived Requirement: Verified scheme checklists & official links</div>
                </div>

                <div className="info-card">
                    <div className="info-card-header">
                        <span className="badge badge-civic">Public Health</span>
                        <h2 className="info-card-title">Emergency & Civic Contacts (CON1 - CON2)</h2>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {total > 0 ? (
                            `${noPhcPct}% lack saved contact details for the local Primary Health Centre or emergency ambulance.`
                        ) : (
                            'Awaiting survey responses from Week 1 field collection.'
                        )}
                    </p>
                    <div className="verification-tag">Derived Requirement: Verified one-tap emergency directory</div>
                </div>
            </div>
        </main>
    );
}
