import React from 'react';
import { getLocalized } from '../../../i18n';

export function AnnouncementTicker({ announcements = [], lang = 'en' }) {
    const list = announcements && announcements.length > 0 
        ? announcements 
        : [
            {
                id: 'def-1',
                title: lang === 'te' ? 'త్రైమాసిక గ్రామసభ' : 'Quarterly Grama Sabha',
                description: lang === 'te' ? 'తాగునీటి నాణ్యత మరియు సంక్షేమ పథకాల సమీక్ష కొరకు గ్రామసభ నిర్వహించబడును.' : 'Scheduled for review of drinking water quality and welfare schemes.',
            },
            {
                id: 'def-2',
                title: lang === 'te' ? 'ఉచిత ఆరోగ్య శిబిరం' : 'Free Health Camp',
                description: lang === 'te' ? 'పీహెచ్‌సీలో ఉచిత అసంక్రమిత వ్యాధుల (NCD) పరీక్షా శిబిరం.' : 'Free NCD Health Screening Camp at PHC with doctor consultation.',
            }
        ];

    const renderList = (keyPrefix) => (
        list.map((item, idx) => (
            <span key={`${keyPrefix}-${item.id || idx}`} className="ticker-announcement">
                <strong className="ticker-title">
                    {getLocalized(item, 'title', lang)}
                </strong>
                <span className="ticker-desc">
                    {': '}
                    {getLocalized(item, 'description', lang)}
                </span>
                <span className="notice-bullet" aria-hidden="true">•</span>
            </span>
        ))
    );

    return (
        <div className="clean-ticker-bar" role="region" aria-label="Public Notices Ribbon">
            <div className="container ticker-inner">
                <span className="ticker-badge">NOTICE</span>
                <div className="ticker-marquee-window">
                    <div className="ticker-track">
                        {renderList('track-1')}
                        {renderList('track-2')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementTicker;
