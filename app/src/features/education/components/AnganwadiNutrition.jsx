import React from 'react';
import { Baby, ShieldCheck, HeartPulse, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { anganwadiNutritionData } from '../data/anganwadiNutritionData';

export function AnganwadiNutrition({ lang }) {
    const isTe = lang === 'te';
    const { provenance, operatingNotice, growthMonitoringService, beneficiaryGroups } = anganwadiNutritionData;

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Baby size={22} style={{ color: 'var(--color-pink-600)' }} />
                        {isTe ? "అంగన్‌వాడీ ప్రారంభ శిశు సంరక్షణ & పోషకాహార సేవలు" : "Anganwadi Early Childhood Care & Nutrition Services"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "సమగ్ర శిశు అభివృద్ధి సేవలు (ICDS) మరియు మిషన్ పోషణ్ 2.0 కింద చిన్నారులు మరియు తల్లులకు ప్రభుత్వ సంరక్షణ సేవలు."
                            : "Integrated Child Development Services (ICDS) & Mission Poshan 2.0 framework for early childhood development and maternal nutrition support."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-level-b">
                        <ShieldCheck size={11} />
                        Level B: Government Service Framework
                    </span>
                </div>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span><strong>Source:</strong> {provenance.authority} ({provenance.program})</span>
                    <span><strong>Reference reviewed:</strong> {provenance.reviewedDate}</span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>Operating Notice:</strong> {isTe ? operatingNotice.te : operatingNotice.en}
                </div>
            </div>

            {/* Growth Monitoring Explanation (Non-diagnostic Public Service) */}
            <div style={{ background: 'var(--color-emerald-50)', border: '1px solid var(--color-emerald-200)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <HeartPulse size={22} style={{ color: 'var(--color-emerald-700)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-emerald-950)' }}>
                        {isTe ? growthMonitoringService.titleTe : growthMonitoringService.title}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: 'var(--color-emerald-900)', lineHeight: '1.45' }}>
                        {isTe ? growthMonitoringService.descriptionTe : growthMonitoringService.description}
                    </p>
                </div>
            </div>

            {/* Beneficiary Groups Framework */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {beneficiaryGroups.map(group => (
                    <div key={group.id} style={{ background: '#ffffff', border: '1px solid var(--color-slate-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                            <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>ICDS Framework</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                            {isTe ? group.groupTe : group.group}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-slate-600)', lineHeight: '1.5', flex: 1 }}>
                            {isTe ? group.serviceDescriptionTe : group.serviceDescription}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnganwadiNutrition;
