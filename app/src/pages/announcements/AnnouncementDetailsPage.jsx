import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ShieldCheck, Bell } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { announcementService } from '../../features/announcements/api/announcements';
import { getLocalized } from '../../i18n';
import { formatHumanDisplay } from '../../utils/dates';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function AnnouncementDetailsPage() {
    const { announcementId } = useParams();
    const { lang } = useAppContext();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        announcementService.getAnnouncementById(announcementId)
            .then(data => {
                setAnnouncement(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load announcement');
                setLoading(false);
            });
    }, [announcementId]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <LoadingState count={1} message="Loading announcement details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <ErrorState message={error} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="container" style={{ padding: '3rem 0' }}>
                <EmptyState
                    title="Announcement Not Found"
                    description={`No announcement found for ID ${announcementId}.`}
                    action={
                        <Link to="/announcements" className="btn btn-primary btn-sm">
                            <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Return to Announcements
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <div className="page-header" style={{ padding: '1.5rem 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginBottom: '0.75rem' }}>
                        <Link to="/" style={{ color: 'inherit' }}>Home</Link>
                        <span>/</span>
                        <Link to="/announcements" style={{ color: 'inherit' }}>Announcements</Link>
                        <span>/</span>
                        <span style={{ color: 'var(--color-slate-900)', fontWeight: 600 }}>{announcement.title}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge badge-alert" style={{ marginBottom: '0.4rem' }}>
                                <Bell size={12} style={{ marginRight: '3px' }} /> {announcement.category || 'Public Notice'}
                            </span>
                            <h1 className="page-title" style={{ fontSize: '2rem' }}>
                                {getLocalized(announcement, 'title', lang)}
                            </h1>
                        </div>

                        <Link to="/announcements" className="btn btn-secondary btn-sm">
                            <ArrowLeft size={14} style={{ marginRight: '4px' }} /> Back to All Notices
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3.5rem' }}>
                <div className="civic-card" style={{ maxWidth: '820px', padding: '2rem' }}>
                    {announcement.image_url && (
                        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', maxHeight: '360px' }}>
                            <img src={announcement.image_url} alt={announcement.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                    )}

                    {announcement.event_date && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-slate-100)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-slate-800)', marginBottom: '1.25rem' }}>
                            <Calendar size={15} style={{ color: 'var(--color-blue-600)' }} />
                            <span>Event Date: {formatHumanDisplay(announcement.event_date)}</span>
                        </div>
                    )}

                    <p style={{ fontSize: '1.05rem', lineHeight: '1.75', color: 'var(--color-slate-800)', marginBottom: '2rem' }}>
                        {getLocalized(announcement, 'description', lang)}
                    </p>

                    <div className="card-verify-tag">
                        <span>Verified Source: {announcement.source || 'Grama Panchayat'}</span>
                        <span>Verified Date: {announcement.verified_on || 'Current'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementDetailsPage;
