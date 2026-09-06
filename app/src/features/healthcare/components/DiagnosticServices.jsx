import React, { useState, useMemo } from 'react';
import { FlaskConical, Search, Clock, CheckCircle, ShieldCheck, FileText, Check, CheckCircle2, Activity } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function DiagnosticServices({ diagnostics = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTe = currentLang === 'te';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const categories = useMemo(() => {
        const set = new Set();
        diagnostics.forEach(d => {
            if (d.category) set.add(d.category);
        });
        return ['ALL', ...Array.from(set)];
    }, [diagnostics]);

    const filteredDiagnostics = useMemo(() => {
        return diagnostics.filter(item => {
            const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                (item.test_name && item.test_name.toLowerCase().includes(q)) ||
                (item.test_name_te && item.test_name_te.toLowerCase().includes(q)) ||
                (item.category && item.category.toLowerCase().includes(q)) ||
                (item.sample_type && item.sample_type.toLowerCase().includes(q));
            return matchesCategory && matchesSearch;
        });
    }, [diagnostics, selectedCategory, searchQuery]);

    if (loading) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
                    {isTe ? 'డయాగ్నస్టిక్ సేవల సమాచారం లోడ్ అవుతోంది...' : 'Loading verified diagnostic services from database...'}
                </div>
            </div>
        );
    }

    if (!diagnostics || diagnostics.length === 0) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <FlaskConical size={32} style={{ color: 'var(--color-slate-400)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.25rem' }}>
                    {isTe ? 'ప్రస్తుత ల్యాబ్ పరీక్షల సమాచారం అందుబాటులో లేదు' : 'No Diagnostic Services Published'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                    {isTe ? 'పీహెచ్‌సీ ల్యాబ్ పరీక్షల జాబితా నవీకరించబడినప్పుడు ఇక్కడ కనిపిస్తుంది.' : 'Laboratory services will appear here once updated in the village database.'}
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="diagnostic-services-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                        <span className="badge badge-verified" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-indigo-800)', border: '1px solid var(--color-indigo-200)' }}>
                            <Activity size={12} style={{ marginRight: '3px' }} />
                            {isTe ? "పీహెచ్‌సీ క్లినికల్ లేబొరేటరీ" : "PHC Clinical Diagnostic Laboratory"}
                        </span>
                        <span className="badge-level-a">
                            Level A: Local Facility Tag
                        </span>
                    </div>
                    <h2 id="diagnostic-services-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0.25rem 0' }}>
                        {isTe ? "అందుబాటులో ఉన్న ఉచిత ల్యాబ్ పరీక్షలు" : "Available Diagnostic & Pathology Tests"}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTe ? "జాతీయ ఆరోగ్య మిషన్ (NHM) కింద డెంకాడ పీహెచ్‌సీలో రోగులకు ఉచితంగా నిర్వహించే అధికారిక పరీక్షలు." : "Official diagnostic investigations conducted free of cost under the National Health Mission at Denkada PHC."}
                    </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-50)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full, 9999px)', border: '1px solid var(--color-slate-200)' }}>
                    {isTe ? "మూలం: డెంకాడ పీహెచ్‌సీ ల్యాబ్ గైడ్‌లైన్స్" : "Source: Denkada PHC Laboratory Guidelines"}
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
                background: '#ffffff',
                border: '1px solid var(--color-slate-200)',
                borderRadius: 'var(--radius-lg, 12px)',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.04)'
            }}>
                <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)' }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isTe ? 'పరీక్ష పేరు లేదా వర్గం వెతకండి (ఉదా: రక్తం, షుగర్, మలేరియా)...' : 'Search test name (e.g., Blood, Sugar, Malaria)...'}
                        style={{
                            width: '100%',
                            padding: '0.55rem 0.85rem 0.55rem 2.4rem',
                            fontSize: '0.875rem',
                            border: '1.5px solid var(--color-slate-200)',
                            borderRadius: 'var(--radius-md, 8px)',
                            outline: 'none',
                            transition: 'border-color 0.15s ease',
                            background: '#f8fafc'
                        }}
                    />
                </div>

                {categories.length > 2 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            >
                                {cat === 'ALL' ? (isTe ? 'అన్ని పరీక్షలు' : 'All Tests') : cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Diagnostic Test Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
                {filteredDiagnostics.map((item, idx) => {
                    const isMalariaOrSpot = item.category?.toLowerCase().includes('vector') || item.turnaround_time?.toLowerCase().includes('immediate') || item.turnaround_time?.toLowerCase().includes('minutes');
                    const accentColor = isMalariaOrSpot ? 'var(--color-emerald-500)' : 'var(--color-indigo-500)';

                    return (
                        <div
                            key={item.id}
                            className="diagnostic-card-elevated"
                            style={{
                                borderLeft: `4px solid ${accentColor}`
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-slate-500)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                        <FlaskConical size={14} style={{ color: accentColor }} />
                                        {item.category}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '0.2rem 0.55rem',
                                            borderRadius: 'var(--radius-full, 9999px)',
                                            background: 'var(--color-emerald-50)',
                                            color: 'var(--color-emerald-800)',
                                            border: '1px solid var(--color-emerald-200)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <CheckCircle2 size={12} />
                                        {isTe ? "ఉచితం / NHM" : "Free / NHM"}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.4rem', lineHeight: '1.3' }}>
                                    {isTe && item.test_name_te ? item.test_name_te : item.test_name}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.85rem', fontSize: '0.8125rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                        <Clock size={13} style={{ color: accentColor, flexShrink: 0 }} />
                                        <span><strong>{isTe ? "ఫలిత సమయం:" : "Turnaround:"}</strong> {isTe && item.turnaround_time_te ? item.turnaround_time_te : item.turnaround_time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                        <FileText size={13} style={{ color: accentColor, flexShrink: 0 }} />
                                        <span><strong>{isTe ? "నమూనా రకం:" : "Sample:"}</strong> {isTe && item.sample_type_te ? item.sample_type_te : item.sample_type}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-slate-700)' }}>
                                        <Check size={13} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                        <span><strong>{isTe ? "లభ్యత:" : "Timing:"}</strong> {isTe && item.availability_te ? item.availability_te : item.availability}</span>
                                    </div>
                                </div>

                                {(item.prerequisites || item.prerequisites_te) && (
                                    <div style={{
                                        background: 'var(--color-slate-50)',
                                        borderRadius: 'var(--radius-sm, 6px)',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-slate-600)',
                                        marginBottom: '0.75rem',
                                        lineHeight: 1.45,
                                        border: '1px solid var(--color-slate-200)'
                                    }}>
                                        <strong>{isTe ? "ముందస్తు సూచన: " : "Prerequisite: "}</strong>
                                        {isTe && item.prerequisites_te ? item.prerequisites_te : item.prerequisites}
                                    </div>
                                )}
                            </div>

                            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-100)', fontSize: '0.72rem', color: 'var(--color-slate-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{item.source || 'Denkada PHC Laboratory'}</span>
                                <span style={{ color: 'var(--color-emerald-700)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={12} />
                                    {isTe ? "ప్రామాణికం" : "Standard"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default DiagnosticServices;
