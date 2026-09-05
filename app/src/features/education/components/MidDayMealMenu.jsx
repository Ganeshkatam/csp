import React, { useState } from 'react';
import { Utensils, ShieldCheck, Info, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { midDayMealStandards } from '../data/midDayMealStandards';
import { midDayMealMenuData } from '../data/midDayMealMenuData';

export function MidDayMealMenu({ lang }) {
    const isTe = lang === 'te';
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'standards'

    const { provenance: menuProv, weeklySchedule } = midDayMealMenuData;
    const { provenance: stdProv, standards } = midDayMealStandards;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Utensils size={20} style={{ color: 'var(--color-amber-600)' }} />
                        {isTe ? "పీఎం పోషణ్ — పాఠశాల మధ్యాహ్న భోజన పథకం" : "PM POSHAN — School Meal Programme"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "ఆంధ్రప్రదేశ్ అమలు / స్థానికంగా వాడే పేరు: జగనన్న గోరుముద్ద. చట్టబద్ధమైన పోషకాహార ప్రమాణాలు మరియు ప్రచురిత రాష్ట్ర వారపు మెనూ."
                            : "Andhra Pradesh implementation / locally used programme name: Jagananna Gorumudha. Statutory nutritional norms & published state weekly menu reference."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-level-b">
                        <ShieldCheck size={11} />
                        Level B: Government Reference Standard
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid var(--color-slate-200)', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`btn btn-sm ${activeTab === 'menu' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                >
                    {isTe ? "రాష్ట్ర ప్రచురిత వారపు మెనూ" : "Published Weekly Menu Reference"}
                </button>
                <button
                    onClick={() => setActiveTab('standards')}
                    className={`btn btn-sm ${activeTab === 'standards' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                >
                    {isTe ? "పీఎం పోషణ్ జాతీయ ప్రమాణాలు" : "PM POSHAN Nutrition Standards"}
                </button>
            </div>

            {/* Content: Weekly Menu Reference */}
            {activeTab === 'menu' && (
                <div>
                    <div className="provenance-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span><strong>Source:</strong> {menuProv.authority} ({menuProv.programTitle})</span>
                            <span><strong>Reference reviewed:</strong> {menuProv.reviewedDate}</span>
                        </div>
                        <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                            <strong>Notice:</strong> {isTe 
                                ? "ప్రచురితమైన సూచిక మెనూ. స్థానిక సేకరణ, కాలానుగుణ కూరగాయల లభ్యత మరియు పాఠశాల నిర్వహణ కమిటీ (SMC) ఏర్పాట్ల ప్రకారం రోజువారీ వంటకాల్లో మార్పులు ఉండవచ్చు."
                                : menuProv.disclaimer
                            }
                        </div>
                    </div>

                    <div className="table-responsive-wrapper">
                        <table className="civic-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '130px' }}>{isTe ? "వారం" : "Day"}</th>
                                    <th>{isTe ? "ప్రధాన వంటకం" : "Main Meal"}</th>
                                    <th>{isTe ? "అనుబంధ పోషకాహారం (గుడ్డు / చిక్కీ)" : "Nutritional Supplements (Egg / Chikki)"}</th>
                                    <th style={{ width: '130px', textAlign: 'center' }}>{isTe ? "సప్లిమెంట్ హోదా" : "Supplement"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weeklySchedule.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                            {isTe ? row.dayTe : row.day}
                                        </td>
                                        <td style={{ color: 'var(--color-slate-800)', fontWeight: 600 }}>
                                            {isTe ? row.dishTe : row.dish}
                                        </td>
                                        <td style={{ color: 'var(--color-slate-700)', fontSize: '0.85rem' }}>
                                            {isTe ? row.supplementTe : row.supplement}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', gap: '4px', justifyContent: 'center' }}>
                                                {row.hasEgg && (
                                                    <span style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem', fontWeight: 700, borderRadius: 'var(--radius-xs)', background: 'var(--color-amber-50)', color: 'var(--color-amber-800)', border: '1px solid var(--color-amber-200)' }}>
                                                        Egg
                                                    </span>
                                                )}
                                                {row.hasChikki && (
                                                    <span style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem', fontWeight: 700, borderRadius: 'var(--radius-xs)', background: 'var(--color-emerald-50)', color: 'var(--color-emerald-800)', border: '1px solid var(--color-emerald-200)' }}>
                                                        Chikki
                                                    </span>
                                                )}
                                                {!row.hasEgg && !row.hasChikki && (
                                                    <span style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: 'var(--radius-xs)', background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                                                        Standard
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Content: PM POSHAN National Nutrition Standards */}
            {activeTab === 'standards' && (
                <div>
                    <div className="provenance-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span><strong>Source:</strong> {stdProv.authority} ({stdProv.program})</span>
                            <span><strong>Statutory Basis:</strong> {stdProv.basis}</span>
                        </div>
                        <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                            <strong>Statutory Mandate:</strong> {isTe 
                                ? "జాతీయ ఆహార భద్రతా చట్టం (NFSA), 2013 షెడ్యూల్ II ప్రకారం దేశవ్యాప్తంగా అన్ని ప్రభుత్వ పాఠశాలల్లో ప్రతి విద్యార్థికి అందించాల్సిన కనీస చట్టబద్ధ పోషకాహార ప్రమాణాలు."
                                : stdProv.disclaimer
                            }
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {standards.map((std, idx) => (
                            <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-slate-100)', paddingBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-indigo-900)' }}>
                                        {isTe ? std.stageTe : std.stage}
                                    </h3>
                                    <span className="badge badge-civic" style={{ fontSize: '0.72rem' }}>
                                        NFSA 2013 Norm
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'var(--color-slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-500)' }}>
                                            {isTe ? "కేలరీలు (శక్తి)" : "Energy Norm"}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                            {std.calories}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-500)' }}>
                                            {isTe ? "ప్రోటీన్ (మాంసకృత్తులు)" : "Protein Norm"}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                            {std.protein}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-500)', marginBottom: '0.4rem' }}>
                                    {isTe ? "రోజువారీ పరిమాణాలు (ప్రతి విద్యార్థికి):" : "Mandatory Daily Gram Quantities:"}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {std.components.map((comp, cIdx) => (
                                        <div key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.35rem 0.5rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-xs)' }}>
                                            <span style={{ color: 'var(--color-slate-700)', fontWeight: 500 }}>
                                                {isTe ? comp.itemTe : comp.item}
                                            </span>
                                            <span style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                                {comp.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MidDayMealMenu;
