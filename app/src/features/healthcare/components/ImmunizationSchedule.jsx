import React from 'react';
import { HeartPulse, ShieldCheck, Info, FileText } from 'lucide-react';
import { IMMUNIZATION_REFERENCE } from '../data/immunizationData';

export function ImmunizationSchedule({ lang = 'en' }) {
    const isTe = lang === 'te';
    const ref = IMMUNIZATION_REFERENCE;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
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
                <span className="badge-level-b">
                    <ShieldCheck size={11} />
                    Level B: Government Standard Reference
                </span>
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

            <div className="table-responsive-wrapper">
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
                        {ref.milestones.map((m, idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                    {isTe ? m.age_te : m.age_en}
                                </td>
                                <td>
                                    <span style={{ fontWeight: 700, color: 'var(--color-emerald-900)', fontSize: '0.85rem' }}>
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
