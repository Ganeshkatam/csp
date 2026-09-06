import React, { useState } from 'react';
import { HeartPulse, ShieldCheck, Info, FileText, LayoutGrid, Table, Shield, Syringe, CheckCircle2 } from 'lucide-react';
import { IMMUNIZATION_REFERENCE } from '../data/immunizationData';

function getLifecycleStage(ageEn, isTe) {
    if (ageEn === 'At Birth') {
        return { label: isTe ? "నవజాత శిశువు" : "Newborn", bg: 'var(--color-blue-50)', color: 'var(--color-blue-700)', border: 'var(--color-blue-200)' };
    }
    if (['6 Weeks', '10 Weeks', '14 Weeks', '9 - 12 Months'].includes(ageEn)) {
        return { label: isTe ? "శిశు సంరక్షణ (0-1 సం.)" : "Infancy (0-1 Yr)", bg: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: 'var(--color-emerald-200)' };
    }
    if (['16 - 24 Months', '5 - 6 Years'].includes(ageEn)) {
        return { label: isTe ? "బాల్యం" : "Early Childhood", bg: 'var(--color-purple-50)', color: 'var(--color-purple-800)', border: 'var(--color-purple-200)' };
    }
    if (ageEn === '10 & 16 Years') {
        return { label: isTe ? "కౌమార దశ" : "Adolescence", bg: 'var(--color-indigo-50)', color: 'var(--color-indigo-800)', border: 'var(--color-indigo-200)' };
    }
    return { label: isTe ? "మాతృ సంరక్షణ" : "Maternal Health", bg: 'var(--color-rose-50)', color: 'var(--color-rose-800)', border: 'var(--color-rose-200)' };
}

export function ImmunizationSchedule({ lang = 'en' }) {
    const isTe = lang === 'te';
    const ref = IMMUNIZATION_REFERENCE;
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
    const [stageFilter, setStageFilter] = useState('ALL');

    const filteredMilestones = ref.milestones.filter(m => {
        if (stageFilter === 'ALL') return true;
        if (stageFilter === 'INFANTS') {
            return ['At Birth', '6 Weeks', '10 Weeks', '14 Weeks', '9 - 12 Months'].includes(m.age_en);
        }
        if (stageFilter === 'CHILDREN') {
            return ['16 - 24 Months', '5 - 6 Years', '10 & 16 Years'].includes(m.age_en);
        }
        if (stageFilter === 'MATERNAL') {
            return m.age_en === 'Pregnant Women';
        }
        return true;
    });

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HeartPulse size={20} style={{ color: 'var(--color-emerald-600)' }} />
                        {isTe ? "జాతీయ సాధారణ రోగనిరోధక టీకాల పట్టిక" : "National Routine Immunization Schedule"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "భారత ప్రభుత్వ సార్వత్రిక టీకా కార్యక్రమం (UIP) ప్రకారం శిశువులు మరియు తల్లులకు ఇచ్చే టీకాలు."
                            : "Standard Universal Immunization Programme (UIP) age milestones and vaccine coverage for infants, children, and pregnant women."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-level-b">
                        <ShieldCheck size={11} />
                        Level B: Government Standard Reference
                    </span>
                    <div style={{ display: 'flex', background: 'var(--color-slate-100)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
                        <button
                            type="button"
                            onClick={() => setViewMode('cards')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '0.25rem 0.55rem',
                                border: 'none',
                                background: viewMode === 'cards' ? '#ffffff' : 'transparent',
                                color: viewMode === 'cards' ? 'var(--color-slate-950)' : 'var(--color-slate-600)',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                boxShadow: viewMode === 'cards' ? 'var(--shadow-sm)' : 'none'
                            }}
                            title="Cards View"
                        >
                            <LayoutGrid size={13} />
                            <span>{isTe ? "కార్డులు" : "Cards"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '0.25rem 0.55rem',
                                border: 'none',
                                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                                color: viewMode === 'table' ? 'var(--color-slate-950)' : 'var(--color-slate-600)',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
                            }}
                            title="Table View"
                        >
                            <Table size={13} />
                            <span>{isTe ? "పట్టిక" : "Table"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Provenance Box & MCP Disclaimer */}
            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span><strong>Government reference:</strong> {ref.source}</span>
                    <span><strong>Reference reviewed:</strong> {ref.reviewedOn}</span>
                </div>
                <div style={{ color: 'var(--color-slate-700)', display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '0.35rem' }}>
                    <Info size={14} style={{ color: 'var(--color-blue-600)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{isTe ? ref.disclaimer.te : ref.disclaimer.en}</span>
                </div>
            </div>

            {/* Lifecycle Stage Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <button
                    type="button"
                    className={`filter-pill ${stageFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setStageFilter('ALL')}
                >
                    {isTe ? "అన్ని దశలు" : "All Milestones"} ({ref.milestones.length})
                </button>
                <button
                    type="button"
                    className={`filter-pill ${stageFilter === 'INFANTS' ? 'active' : ''}`}
                    onClick={() => setStageFilter('INFANTS')}
                >
                    {isTe ? "శిశువులు (0-1 సం.)" : "Infants (0-1 Yr)"}
                </button>
                <button
                    type="button"
                    className={`filter-pill ${stageFilter === 'CHILDREN' ? 'active' : ''}`}
                    onClick={() => setStageFilter('CHILDREN')}
                >
                    {isTe ? "పిల్లలు & కౌమారులు (1-16 సం.)" : "Children & Teens (1-16 Yrs)"}
                </button>
                <button
                    type="button"
                    className={`filter-pill ${stageFilter === 'MATERNAL' ? 'active' : ''}`}
                    onClick={() => setStageFilter('MATERNAL')}
                >
                    {isTe ? "గర్భిణీ తల్లులు" : "Maternal Care"}
                </button>
            </div>

            {/* Milestone Cards View */}
            {viewMode === 'cards' && (
                <div className="milestone-card-grid">
                    {filteredMilestones.map((m, idx) => {
                        const stage = getLifecycleStage(m.age_en, isTe);
                        const vaccineList = (isTe ? m.vaccines_te : m.vaccines_en).split(',').map(v => v.trim());

                        return (
                            <div key={idx} className="milestone-card">
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: stage.bg, color: stage.color, border: `1px solid ${stage.border}`, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                            {stage.label}
                                        </span>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Syringe size={12} style={{ color: 'var(--color-slate-400)' }} />
                                            {isTe ? m.route_te : m.route_en}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.75rem', lineHeight: '1.2' }}>
                                        {isTe ? m.age_te : m.age_en}
                                    </h3>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.4rem' }}>
                                            {isTe ? "సిఫార్సు చేసిన టీకాలు:" : "Prescribed Vaccines:"}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {vaccineList.map((v, vIdx) => (
                                                <span key={vIdx} className="vaccine-chip">
                                                    <CheckCircle2 size={12} style={{ color: 'var(--color-emerald-700)' }} />
                                                    {v}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem', background: 'var(--color-slate-50)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Shield size={12} style={{ color: 'var(--color-blue-600)' }} />
                                            {isTe ? "వ్యాధి నివారణ రక్షణ:" : "Target Disease Protection:"}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-800)', lineHeight: '1.45', fontWeight: 500 }}>
                                            {isTe ? m.prevention_te : m.prevention_en}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--color-slate-100)', fontSize: '0.72rem', color: 'var(--color-slate-500)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Info size={12} style={{ flexShrink: 0, color: 'var(--color-slate-400)' }} />
                                    <span>{isTe ? m.notes_te : m.notes_en}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detailed Table View */}
            {viewMode === 'table' && (
                <div className="table-responsive-wrapper" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-slate-200)', boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.04)', overflow: 'hidden' }}>
                    <table className="infra-ledger-table" aria-label="National Routine Immunization Schedule">
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>{isTe ? "వయస్సు" : "Age Milestone"}</th>
                                <th style={{ width: '28%' }}>{isTe ? "టీకాలు" : "Prescribed Vaccines"}</th>
                                <th style={{ width: '17%' }}>{isTe ? "ఇచ్చే పద్ధతి" : "Route"}</th>
                                <th style={{ width: '25%' }}>{isTe ? "నివారించే వ్యాధులు" : "Target Disease Protection"}</th>
                                <th style={{ width: '15%' }}>{isTe ? "గమనికలు" : "Guideline Notes"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMilestones.map((m, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                        {isTe ? m.age_te : m.age_en}
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 800, color: 'var(--color-emerald-900)', fontSize: '0.85rem' }}>
                                            {isTe ? m.vaccines_te : m.vaccines_en}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.78rem', color: 'var(--color-slate-600)' }}>
                                        {isTe ? m.route_te : m.route_en}
                                    </td>
                                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-slate-700)', lineHeight: '1.45' }}>
                                        {isTe ? m.prevention_te : m.prevention_en}
                                    </td>
                                    <td style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', lineHeight: '1.4' }}>
                                        {isTe ? m.notes_te : m.notes_en}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-slate-500)' }}>
                <FileText size={14} style={{ flexShrink: 0 }} />
                <span>
                    {isTe 
                        ? "*జేఈ (జపనీస్ ఎన్సెఫాలిటిస్) టీకా కేంద్ర ప్రభుత్వం నోటిఫై చేసిన స్థానిక ఎండెమిక్ జిల్లాలలో మాత్రమే వర్తిస్తుంది."
                        : "*JE (Japanese Encephalitis) vaccine is administered only where included in the National Immunization Schedule for designated endemic areas."
                    }
                </span>
            </div>
        </div>
    );
}

export default ImmunizationSchedule;
