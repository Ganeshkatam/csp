import React from 'react';
import { Calendar } from 'lucide-react';
import { getLocalized } from '../lib/i18n';

export default function AnnouncementCard({ announcement, lang }) {
    return (
        <div className="civic-card announcement-card">
            {announcement.image_url && (
                <div className="card-media-banner">
                    <img 
                        src={announcement.image_url} 
                        alt={announcement.title} 
                        className="card-media-img"
                        loading="lazy"
                    />
                </div>
            )}
            <div>
                <div className="card-header-row">
                    <span className="badge badge-alert">{announcement.category || 'Public Notice'}</span>
                    {announcement.event_date && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-slate-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} aria-hidden="true" /> {announcement.event_date}
                        </span>
                    )}
                </div>
                <h3 className="card-item-title">{getLocalized(announcement, 'title', lang)}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-700)', lineHeight: '1.5' }}>
                    {getLocalized(announcement, 'description', lang)}
                </p>
            </div>
            <div className="card-verify-tag">
                <span>Source: {announcement.source || 'Public Board'}</span>
                <span>Verified: {announcement.verified_on || 'Current'}</span>
            </div>
        </div>
    );
}
