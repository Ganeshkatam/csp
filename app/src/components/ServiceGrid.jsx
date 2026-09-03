import React from 'react';
import { FileText, Phone, Activity, GraduationCap, Building2, MessageSquare, ArrowRight } from 'lucide-react';

export default function ServiceGrid({ t, scrollToSection }) {
    const hubs = [
        {
            id: 'sectionSchemes',
            title: t.hubSchemesTitle,
            desc: t.hubSchemesDesc,
            icon: <FileText size={22} />,
            theme: 'hub-theme-blue',
            actionText: 'Browse Schemes'
        },
        {
            id: 'sectionContacts',
            title: t.hubContactsTitle,
            desc: t.hubContactsDesc,
            icon: <Phone size={22} />,
            theme: 'hub-theme-red',
            actionText: 'Emergency Directory'
        },
        {
            id: 'sectionInstitutions',
            title: t.hubHealthTitle,
            desc: t.hubHealthDesc,
            icon: <Activity size={22} />,
            theme: 'hub-theme-emerald',
            actionText: 'Healthcare Timings'
        },
        {
            id: 'sectionInstitutions',
            title: t.hubSchoolsTitle,
            desc: t.hubSchoolsDesc,
            icon: <GraduationCap size={22} />,
            theme: 'hub-theme-indigo',
            actionText: 'School Facilities'
        },
        {
            id: 'sectionBusinesses',
            title: t.hubBizTitle,
            desc: t.hubBizDesc,
            icon: <Building2 size={22} />,
            theme: 'hub-theme-amber',
            actionText: 'Artisans & Shops'
        },
        {
            id: 'sectionFeedback',
            title: t.hubFeedbackTitle,
            desc: t.hubFeedbackDesc,
            icon: <MessageSquare size={22} />,
            theme: 'hub-theme-slate',
            actionText: 'Submit Correction'
        }
    ];

    return (
        <section className="section-block" id="sectionCitizenCorner">
            <div className="section-head">
                <div className="section-title-wrap">
                    <span className="badge badge-civic" style={{ marginBottom: '6px' }}>Citizen Services Corner</span>
                    <h2 className="section-title">
                        <span>{t.citizenCornerTitle}</span>
                        <span className="section-title-sub">{t.citizenCornerSub}</span>
                    </h2>
                </div>
                <p className="section-desc">{t.citizenCornerDesc}</p>
            </div>

            <div className="bento-service-grid">
                {hubs.map((hub, idx) => (
                    <a 
                        key={idx}
                        href={`#${hub.id}`} 
                        onClick={(e) => { 
                            e.preventDefault(); 
                            if (scrollToSection) scrollToSection(hub.id); 
                        }} 
                        className={`bento-hub-card ${hub.theme}`}
                    >
                        <div className="bento-hub-header">
                            <div className="bento-icon-box" aria-hidden="true">
                                {hub.icon}
                            </div>
                        </div>

                        <div className="bento-hub-body">
                            <h3 className="bento-hub-title">{hub.title}</h3>
                            <p className="bento-hub-desc">{hub.desc}</p>
                        </div>

                        <div className="bento-hub-footer">
                            <span className="bento-action-label">{hub.actionText}</span>
                            <ArrowRight size={14} className="bento-action-arrow" aria-hidden="true" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
