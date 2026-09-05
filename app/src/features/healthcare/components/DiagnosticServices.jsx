import React, { useState } from 'react';
import { Activity, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, Filter } from 'lucide-react';
import { DIAGNOSTIC_SERVICES_REFERENCE } from '../data/diagnosticData';

export function DiagnosticServices({ lang = 'en' }) {
    const isTe = lang === 'te';
    const ref = DIAGNOSTIC_SERVICES_REFERENCE;
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    const filteredServices = categoryFilter === 'ALL'
        ? ref.services
        : ref.services.filter(s => s.category === categoryFilter);

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} style={{ color: 'var(--color-indigo-600)' }} />
                        {isTe ? "ఎంపిక చేసిన నిర్ధారణ మరియు స్క్రీనింగ్ సేవలు" : "Selected Diagnostic & Screening Services"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "ప్రభుత్వ ప్రజా ఆరోగ్య ప్రమాణాల (IPHS) ప్రకారం పరీక్షల జాబితా మరియు డెంకాడ పిహెచ్‌సిలో అందుబాటు స్థితి."
                            : "Standard public-health diagnostic catalog with individual on-site availability status for Denkada PHC."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-level-b">
                        <ShieldCheck size={11} />
                        Level B: IPHS Standards
                    </span>
                    <span className="badge-level-a">
                        Level A: Local Facility Tag
                    </span>
                </div>
            </div>

            {/* Provenance Box */}
            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span><strong>Standards reference:</strong> {ref.standardSource}</span>
                    <span><strong>Facility verification:</strong> {ref.facilitySource}</span>
                </div>
                <div style={{ color: 'var(--color-slate-700)', marginTop: '0.35rem' }}>
                    {isTe ? ref.disclaimer.te : ref.disclaimer.en}
                </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                    type="button"
                    className={`filter-pill ${categoryFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('ALL')}
                >
                    {isTe ? "అన్ని సేవలు" : "All Services"} ({ref.services.length})
                </button>
                <button
                    type="button"
                    className={`filter-pill ${categoryFilter === 'Laboratory' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('Laboratory')}
                >
                    {isTe ? "ప్రయోగశాల పరీక్షలు" : "Laboratory Tests"}
                </button>
                <button
                    type="button"
                    className={`filter-pill ${categoryFilter === 'Screening' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('Screening')}
                >
                    {isTe ? "క్లినికల్ స్క్రీనింగ్" : "Clinical Screening"}
                </button>
            </div>

            {/* Diagnostic Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {filteredServices.map(srv => {
                    const isAvailable = srv.facilityStatus === 'AVAILABLE';
                    const isLinkage = srv.facilityStatus === 'LINKAGE';

                    return (
                        <div 
                            key={srv.id} 
                            className="civic-card"
                            style={{ 
                                padding: '1.25rem', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                borderLeft: `4px solid ${isAvailable ? 'var(--color-emerald-500)' : isLinkage ? 'var(--color-blue-500)' : 'var(--color-amber-500)'}`
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-500)' }}>
                                        {srv.category}
                                    </span>
                                    <span 
                                        style={{ 
                                            fontSize: '0.7rem', 
                                            fontWeight: 700, 
                                            padding: '0.15rem 0.5rem', 
                                            borderRadius: 'var(--radius-full)',
                                            background: isAvailable ? 'var(--color-emerald-50)' : isLinkage ? 'var(--color-blue-50)' : 'var(--color-amber-50)',
                                            color: isAvailable ? 'var(--color-emerald-800)' : isLinkage ? 'var(--color-blue-800)' : 'var(--color-amber-800)',
                                            border: `1px solid ${isAvailable ? 'var(--color-emerald-200)' : isLinkage ? 'var(--color-blue-200)' : 'var(--color-amber-200)'}`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '3px'
                                        }}
                                    >
                                        {isAvailable ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                                        {isTe ? srv.facilityStatusText_te : srv.facilityStatusText_en}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-slate-950)', margin: '0 0 0.35rem' }}>
                                    {isTe ? srv.name_te : srv.name_en}
                                </h3>

                                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-600)', marginBottom: '0.65rem' }}>
                                    {isTe ? srv.purpose_te : srv.purpose_en}
                                </div>
                            </div>

                            <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--color-slate-100)', fontSize: '0.72rem', color: 'var(--color-slate-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{isTe ? srv.method_te : srv.method_en}</span>
                                <span style={{ fontWeight: 600 }}>{srv.sourceTag}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DiagnosticServices;
