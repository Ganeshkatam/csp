import React from 'react';
import { FileText, Phone, Activity, GraduationCap, Building2, MessageSquare } from 'lucide-react';

export default function ServiceGrid({ t, scrollToSection }) {
    const hubs = [
        {
            id: 'sectionSchemes',
            title: t.hubSchemesTitle,
            desc: t.hubSchemesDesc,
            icon: <FileText size={24} />,
            iconClass: ''
        },
        {
            id: 'sectionContacts',
            title: t.hubContactsTitle,
            desc: t.hubContactsDesc,
            icon: <Phone size={24} />,
            iconClass: 'hub-icon-emergency'
        },
        {
            id: 'sectionInstitutions',
            title: t.hubHealthTitle,
            desc: t.hubHealthDesc,
            icon: <Activity size={24} />,
            iconClass: 'hub-icon-health'
        },
        {
            id: 'sectionInstitutions',
            title: t.hubSchoolsTitle,
            desc: t.hubSchoolsDesc,
            icon: <GraduationCap size={24} />,
            iconClass: ''
        },
        {
            id: 'sectionBusinesses',
            title: t.hubBizTitle,
            desc: t.hubBizDesc,
            icon: <Building2 size={24} />,
            iconClass: ''
        },
        {
            id: 'sectionFeedback',
            title: t.hubFeedbackTitle,
            desc: t.hubFeedbackDesc,
            icon: <MessageSquare size={24} />,
            iconClass: ''
        }
    ];

    return (
        <section className="section-block" id="sectionCitizenCorner">
            <div className="section-head">
                <h2 className="section-title">
                    <span>{t.citizenCornerTitle}</span>
                    <span className="section-title-sub">{t.citizenCornerSub}</span>
                </h2>
                <p className="section-desc">{t.citizenCornerDesc}</p>
            </div>

            <div className="citizen-corner-grid">
                {hubs.map((hub, idx) => (
                    <a 
                        key={idx}
                        href={`#${hub.id}`} 
                        onClick={(e) => { 
                            e.preventDefault(); 
                            if (scrollToSection) scrollToSection(hub.id); 
                        }} 
                        className="service-hub-card"
                    >
                        <div className={`hub-icon-box ${hub.iconClass}`} aria-hidden="true">
                            {hub.icon}
                        </div>
                        <div className="hub-text">
                            <h3 className="hub-title">{hub.title}</h3>
                            <p className="hub-desc">{hub.desc}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
