import React from 'react';
import { GraduationCap, ShieldCheck, MapPin, Phone, Clock, BookOpen, Baby } from 'lucide-react';
import { getLocalized } from '../../../i18n';
import { formatPhoneDisplay, createTelLink } from '../../../utils/phone';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export function EducationDirectory({ institutions, loading, error, onRetry, lang, t }) {
    const isTe = lang === 'te';

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-slate-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GraduationCap size={22} style={{ color: 'var(--color-indigo-600)' }} />
                        {isTe ? "గ్రామ పాఠశాలలు & అంగన్‌వాడీ కేంద్రాలు" : "Village Schools & Anganwadi Centers"}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', margin: '0.25rem 0 0' }}>
                        {isTe 
                            ? "మోదవలస పరిధిలోని ప్రాథమిక పాఠశాల, అంగన్‌వాడీ కేంద్రం మరియు ఉన్నత పాఠశాల అనుసంధాన వివరాలు."
                            : "Public educational facilities, Anganwadi preschool centers, and secondary school feeder linkage serving Modavalasa."
                        }
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge-level-a">
                        <ShieldCheck size={11} />
                        Level A: Local Verified Record
                    </span>
                    <span className="badge-level-c">
                        <Clock size={11} />
                        Level C: Published Timetable
                    </span>
                </div>
            </div>

            <div className="provenance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span><strong>Source:</strong> Mandal Educational Office (MEO) Denkada &amp; Local School Registers</span>
                    <span><strong>Source verification date:</strong> August 2024</span>
                </div>
                <div style={{ marginTop: '0.35rem', color: 'var(--color-slate-600)' }}>
                    <strong>Published School Timetable:</strong> Based on the published school schedule (9:00 AM - 4:30 PM). This does not confirm individual teacher attendance or same-day local holiday declarations. School holidays and closures can be affected by district or state orders. Anganwadi operating arrangements may vary; contact the centre to confirm current service schedules.
                </div>
            </div>

            {loading && <LoadingState count={2} message={isTe ? "విద్యా సంస్థల వివరాలు లోడ్ అవుతున్నాయి..." : "Loading educational institutions..."} />}
            {error && <ErrorState message={error} onRetry={onRetry} />}
            
            {!loading && !error && (!institutions || institutions.length === 0) && (
                <EmptyState
                    title={isTe ? "పాఠశాల రికార్డులు నమోదు కాలేదు" : "No educational institution records found"}
                    description={isTe ? "మండల విద్యాధికారి రికార్డుల నుండి ధృవీకరించబడుతోంది." : "Institutional listings are being verified with the Mandal Educational Officer."}
                />
            )}

            {!loading && !error && institutions && institutions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {institutions.map(inst => {
                        const isAnganwadi = (inst.name || '').toLowerCase().includes('anganwadi');
                        const defaultHours = isAnganwadi ? '9:00 AM - 1:00 PM (Center activities)' : '9:00 AM - 4:30 PM (Mon-Sat)';
                        const timings = inst.timings || inst.operating_hours || defaultHours;
                        const services = inst.services ? inst.services.split(',').map(s => s.trim()) : [];

                        return (
                            <div key={inst.id} className="facility-showcase-card">
                                {inst.image_url && (
                                    <div className="facility-showcase-media">
                                        <img 
                                            src={inst.image_url} 
                                            alt={inst.name} 
                                            loading="lazy"
                                        />
                                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                                            <span className="badge badge-verified" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', boxShadow: 'var(--shadow-sm)' }}>
                                                {isAnganwadi ? <Baby size={13} style={{ color: 'var(--color-pink-600)', marginRight: '4px' }} /> : <BookOpen size={13} style={{ color: 'var(--color-indigo-600)', marginRight: '4px' }} />}
                                                {isAnganwadi ? (isTe ? "అంగన్‌వాడీ కేంద్రం" : "Anganwadi ECCE") : (isTe ? "ప్రాథమిక పాఠశాల" : "Primary School")}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="facility-showcase-body">
                                    <div>
                                        <div className="card-header-row" style={{ marginBottom: '0.65rem' }}>
                                            <span className="badge-level-a">
                                                <ShieldCheck size={11} />
                                                {isTe ? "స్థానిక అధికారిక రికార్డు" : "Level A: Local Verified Record"}
                                            </span>
                                            <span className="badge badge-verified">
                                                {isTe ? "ప్రభుత్వ గుర్తింపు" : "Govt of AP Recognized"}
                                            </span>
                                        </div>

                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0 0 0.5rem', lineHeight: '1.25' }}>
                                            {getLocalized(inst, 'name', lang)}
                                        </h3>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', background: 'var(--color-slate-50)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)', marginBottom: '1.15rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                                                <Clock size={16} style={{ color: 'var(--color-slate-500)', marginTop: '2px', flexShrink: 0 }} />
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                                        {isTe ? "ప్రచురిత పనివేళలు" : "Published Schedule"}
                                                    </div>
                                                    <div style={{ fontWeight: 700, color: 'var(--color-slate-900)' }}>{timings}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', marginTop: '2px' }}>
                                                        {isAnganwadi 
                                                            ? (isTe ? "కేంద్రం ప్రకారం మారవచ్చు" : "Arrangements may vary locally")
                                                            : (isTe ? "ఉపాధ్యాయుల హాజరుకు హామీ ఇవ్వదు" : "Does not confirm staff attendance")
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {inst.address && (
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                                                    <MapPin size={16} style={{ color: 'var(--color-slate-500)', marginTop: '2px', flexShrink: 0 }} />
                                                    <div>
                                                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
                                                            {isTe ? "చిరునామా / ప్రాంతం" : "Location"}
                                                        </div>
                                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-900)' }}>{inst.address}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {services.length > 0 && (
                                            <div style={{ marginBottom: '1.15rem' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-500)', marginBottom: '0.45rem' }}>
                                                    {isTe ? "సదుపాయాలు & కార్యక్రమాలు:" : "Key Facilities & Services:"}
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                    {services.map((srv, idx) => (
                                                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-indigo-50)', color: 'var(--color-indigo-900)', border: '1px solid var(--color-indigo-200)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 600 }}>
                                                            {srv}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                        {inst.phone && (
                                            <a 
                                                href={createTelLink(inst.phone)} 
                                                className="btn btn-primary card-action-btn"
                                            >
                                                <Phone size={16} style={{ marginRight: '8px' }} />
                                                <span>{isTe ? "కాల్ చేయండి: " : "Call Office Desk: "} {formatPhoneDisplay(inst.phone)}</span>
                                            </a>
                                        )}

                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span><strong>Source:</strong> {inst.source || 'MEO Denkada Records'}</span>
                                            <span><strong>Source verification date:</strong> {inst.verified_on || 'August 2024'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Secondary Education Feeder Linkage Info */}
                    <div style={{ background: '#ffffff', border: '1px dashed var(--color-slate-300)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                                <span className="badge badge-civic">Secondary School Feeder Linkage</span>
                                <span className="badge-level-a">Level A</span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                                {isTe ? "జిల్లా పరిషత్ ఉన్నత పాఠశాల (ZPHS), డెంకాడ" : "Zilla Parishad High School (ZPHS), Denkada"}
                            </h4>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--color-slate-600)' }}>
                                {isTe 
                                    ? "మోదవలస ప్రాథమిక పాఠశాల (తరగతులు 1-5) పూర్తిచేసిన విద్యార్థులకు 6 నుండి 10వ తరగతి వరకు అధికారిక ఫీడర్ పాఠశాల. దూరం: డెంకాడ-మోదవలస ఆర్టీసీ రోడ్డు మార్గంలో 3.2 కి.మీ. (ఆధారం: క్షేత్రస్థాయి సర్వే రోడ్డు దూరం & గ్రామ పంచాయతీ దూరం లెడ్జర్)."
                                    : "Official government feeder school for Modavalasa students graduating from Class 5 to Classes 6 through 10. Distance: 3.2 km along RTC bus route (Source/Methodology: Field survey transit odometer & Gram Panchayat road matrix)."
                                }
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', display: 'block' }}>MEO Denkada Feeder Zone</span>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-indigo-700)' }}>AP Board (SSC) Regular</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EducationDirectory;
