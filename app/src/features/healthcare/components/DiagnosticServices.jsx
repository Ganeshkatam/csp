import React, { useState, useMemo } from 'react';
import { FlaskConical, Search, Clock, CheckCircle, ShieldCheck, FileText, Check, Filter } from 'lucide-react';
import { useAppContext } from '../../../app/providers';

export function DiagnosticServices({ diagnostics = [], loading = false, lang }) {
    const appContext = useAppContext();
    const currentLang = lang || appContext?.lang || 'en';
    const isTelugu = currentLang === 'te';
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
                    {isTelugu ? 'డయాగ్నస్టిక్ సేవల సమాచారం లోడ్ అవుతోంది...' : 'Loading verified diagnostic services from database...'}
                </div>
            </div>
        );
    }

    if (!diagnostics || diagnostics.length === 0) {
        return (
            <div className="healthcare-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <FlaskConical size={32} style={{ color: 'var(--color-slate-400)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '0.25rem' }}>
                    {isTelugu ? 'ప్రస్తుత ల్యాబ్ పరీక్షల సమాచారం అందుబాటులో లేదు' : 'No Diagnostic Services Published'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
                    {isTelugu ? 'పీహెచ్‌సీ ల్యాబ్ పరీక్షల జాబితా నవీకరించబడినప్పుడు ఇక్కడ కనిపిస్తుంది.' : 'Laboratory services will appear here once updated in the village database.'}
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="diagnostic-services-heading">
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div>
                    <span className="healthcare-badge healthcare-badge-blue" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                        <ShieldCheck size={13} style={{ marginRight: '0.375rem' }} />
                        {isTelugu ? 'పీహెచ్‌సీ క్లినికల్ లేబొరేటరీ' : 'PHC Clinical Diagnostic Laboratory'}
                    </span>
                    <h2 id="diagnostic-services-heading" style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '0.25rem 0' }}>
                        {isTelugu ? 'అందుబాటులో ఉన్న ఉచిత ల్యాబ్ పరీక్షలు' : 'Available Diagnostic & Pathology Tests'}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', margin: 0 }}>
                        {isTelugu ? 'జాతీయ ఆరోగ్య మిషన్ (NHM) కింద డెంకాడ పీహెచ్‌సీలో రోగులకు ఉచితంగా నిర్వహించే అధికారిక పరీక్షలు.' : 'Official diagnostic investigations conducted free of cost under the National Health Mission at Denkada PHC.'}
                    </p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', background: 'var(--color-slate-50)', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-slate-200)' }}>
                    {isTelugu ? 'మూలం: డెంకాడ పీహెచ్‌సీ ల్యాబ్ గైడ్‌లైన్స్' : 'Source: Denkada PHC Laboratory Guidelines'}
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
                background: '#ffffff',
                border: '1px solid var(--color-slate-200)',
                borderRadius: '8px',
                padding: '0.875rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)' }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isTelugu ? 'పరీక్ష పేరు లేదా వర్గం వెతకండి...' : 'Search test name (e.g., Blood, Sugar, Malaria)...'}
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                            fontSize: '0.875rem',
                            border: '1px solid var(--color-slate-300)',
                            borderRadius: '6px',
                            outline: 'none',
                            transition: 'border-color 0.15s ease'
                        }}
                    />
                </div>

                {categories.length > 2 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    padding: '0.375rem 0.625rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    border: selectedCategory === cat ? '1px solid var(--color-blue-600)' : '1px solid var(--color-slate-200)',
                                    background: selectedCategory === cat ? 'var(--color-blue-50)' : '#ffffff',
                                    color: selectedCategory === cat ? 'var(--color-blue-700)' : 'var(--color-slate-600)',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {cat === 'ALL' ? (isTelugu ? 'అన్ని పరీక్షలు' : 'All Tests') : cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Diagnostic Test Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {filteredDiagnostics.map((item) => (
                    <article
                        key={item.id}
                        className="healthcare-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderTop: '3px solid var(--color-indigo-600)',
                            position: 'relative'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--color-indigo-600)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FlaskConical size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-slate-900)', margin: 0 }}>
                                            {isTelugu && item.test_name_te ? item.test_name_te : item.test_name}
                                        </h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <span className="healthcare-badge healthcare-badge-green" style={{ fontSize: '0.6875rem' }}>
                                    {isTelugu ? 'ఉచితం' : 'Free / NHM'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                    <Clock size={14} style={{ color: 'var(--color-indigo-600)', flexShrink: 0 }} />
                                    <span>
                                        <strong>{isTelugu ? 'ఫలితం వచ్చే సమయం:' : 'Turnaround:'}</strong> {isTelugu && item.turnaround_time_te ? item.turnaround_time_te : item.turnaround_time}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                    <FileText size={14} style={{ color: 'var(--color-indigo-600)', flexShrink: 0 }} />
                                    <span>
                                        <strong>{isTelugu ? 'నమూనా రకం:' : 'Sample:'}</strong> {isTelugu && item.sample_type_te ? item.sample_type_te : item.sample_type}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-slate-700)' }}>
                                    <Check size={14} style={{ color: 'var(--color-emerald-600)', flexShrink: 0 }} />
                                    <span>
                                        <strong>{isTelugu ? 'లభ్యత:' : 'Timing:'}</strong> {isTelugu && item.availability_te ? item.availability_te : item.availability}
                                    </span>
                                </div>
                            </div>

                            {(item.prerequisites || item.prerequisites_te) && (
                                <div style={{
                                    background: 'var(--color-slate-50)',
                                    borderRadius: '6px',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-slate-600)',
                                    marginBottom: '0.75rem',
                                    lineHeight: 1.4
                                }}>
                                    <strong>{isTelugu ? 'సూచన: ' : 'Prerequisite: '}</strong>
                                    {isTelugu && item.prerequisites_te ? item.prerequisites_te : item.prerequisites}
                                </div>
                            )}
                        </div>

                        <div style={{
                            paddingTop: '0.625rem',
                            borderTop: '1px solid var(--color-slate-100)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.6875rem',
                            color: 'var(--color-slate-400)'
                        }}>
                            <span>{item.source || 'Denkada PHC Laboratory'}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-emerald-700)' }}>
                                <CheckCircle size={11} />
                                {isTelugu ? 'ల్యాబ్ ప్రామాణికం' : 'Standard Lab'}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default DiagnosticServices;
