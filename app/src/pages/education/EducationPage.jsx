import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, ShieldCheck, Utensils, Baby, Award, PhoneCall, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { 
    educationService,
    EducationDirectory,
    MidDayMealMenu,
    AnganwadiNutrition,
    EducationSchemes,
    EducationContacts
} from '../../features/education';

export function EducationPage() {
    const { institutionId } = useParams();
    const { lang, t } = useAppContext();
    const isTe = lang === 'te';

    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadEducation = () => {
        setLoading(true);
        setError(null);
        educationService.getEducationInstitutions()
            .then(data => {
                if (institutionId) {
                    const filtered = (data || []).filter(inst => String(inst.id) === String(institutionId));
                    setInstitutions(filtered.length > 0 ? filtered : data);
                } else {
                    setInstitutions(data || []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading education:', err);
                setError(err.message || 'Failed to load educational institutions');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadEducation();
    }, [institutionId]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-civic">
                            <GraduationCap size={12} style={{ marginRight: '3px' }} /> 
                            {isTe ? "ప్రజా విద్య & అంగన్‌వాడీ సేవలు" : "Public Education & Anganwadi Portal"}
                        </span>
                        <span className="badge badge-verified">
                            {isTe ? "పాఠశాల విద్యా శాఖ, ఆంధ్రప్రదేశ్" : "Department of School Education AP"}
                        </span>
                    </div>

                    <h1 className="page-title">
                        {isTe 
                            ? "మోదవలస పాఠశాలలు & అంగన్‌వాడీ పోర్టల్"
                            : "Schools, Anganwadi & Student Welfare Portal"
                        }
                    </h1>

                    <p className="page-subtitle">
                        {isTe
                            ? "మోదవలస గ్రామ పరిధిలోని మండల పరిషత్ ప్రాథమిక పాఠశాల, అంగన్‌వాడీ ప్రారంభ శిశు సంరక్షణ, పీఎం పోషణ్ మధ్యాహ్న భోజన ప్రచురిత సూచిక, విద్యా పథకాలు మరియు అధికారిక కార్యాలయ సంప్రదింపులు."
                            : "Authoritative directory of Mandal Parishad Primary School (MPPS), Anganwadi early childhood education, PM POSHAN nutritional standards, state school meal schedule reference, and official administrative desks for Modavalasa Village."
                        }
                    </p>

                    {/* Section Jump Nav Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.25rem' }}>
                        <button 
                            onClick={() => scrollToSection('sec-schools')}
                            className="badge badge-civic"
                            style={{ cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                        >
                            <GraduationCap size={13} style={{ color: 'var(--color-indigo-600)' }} />
                            {isTe ? "పాఠశాలలు & అంగన్‌వాడీ" : "Schools & Anganwadi"}
                        </button>
                        <button 
                            onClick={() => scrollToSection('sec-meals')}
                            className="badge badge-civic"
                            style={{ cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                        >
                            <Utensils size={13} style={{ color: 'var(--color-amber-600)' }} />
                            {isTe ? "మధ్యాహ్న భోజన మెనూ" : "PM POSHAN School Meal"}
                        </button>
                        <button 
                            onClick={() => scrollToSection('sec-anganwadi')}
                            className="badge badge-civic"
                            style={{ cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                        >
                            <Baby size={13} style={{ color: 'var(--color-pink-600)' }} />
                            {isTe ? "అంగన్‌వాడీ పోషకాహారం" : "Anganwadi Services"}
                        </button>
                        <button 
                            onClick={() => scrollToSection('sec-schemes')}
                            className="badge badge-civic"
                            style={{ cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                        >
                            <Award size={13} style={{ color: 'var(--color-blue-600)' }} />
                            {isTe ? "విద్యా పథకాలు" : "Education Schemes"}
                        </button>
                        <button 
                            onClick={() => scrollToSection('sec-contacts')}
                            className="badge badge-civic"
                            style={{ cursor: 'pointer', border: '1px solid var(--color-border)', background: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                        >
                            <PhoneCall size={13} style={{ color: 'var(--color-emerald-600)' }} />
                            {isTe ? "అధికారిక సంప్రదింపులు" : "Official Contacts"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '2rem' }}>
                {/* 1. Schools & Anganwadi Directory */}
                <div id="sec-schools">
                    <EducationDirectory 
                        institutions={institutions}
                        loading={loading}
                        error={error}
                        onRetry={loadEducation}
                        lang={lang}
                        t={t}
                    />
                </div>

                {/* 2. PM POSHAN School Meal Programme (Standards & AP Menu Reference) */}
                <div id="sec-meals">
                    <MidDayMealMenu lang={lang} />
                </div>

                {/* 3. Anganwadi Services & Nutrition Framework */}
                <div id="sec-anganwadi">
                    <AnganwadiNutrition lang={lang} />
                </div>

                {/* 4. Education Schemes Linkages */}
                <div id="sec-schemes">
                    <EducationSchemes lang={lang} />
                </div>

                {/* 5. Official Education Contacts */}
                <div id="sec-contacts">
                    <EducationContacts lang={lang} />
                </div>
            </div>
        </div>
    );
}

export default EducationPage;
