import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../app/providers';
import { announcementService } from '../../features/announcements/api/announcements';
import { AnnouncementCard } from '../../features/announcements/components/AnnouncementCard';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function AnnouncementsPage() {
    const { lang } = useAppContext();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAnnouncements = () => {
        setLoading(true);
        setError(null);
        announcementService.getAnnouncements()
            .then(data => {
                setAnnouncements(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading notices:', err);
                setError(err.message || 'Failed to load public notices');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadAnnouncements();
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="container page-header-inner">
                    <div className="page-badge-row">
                        <span className="badge badge-alert">
                            <Bell size={12} style={{ marginRight: '3px' }} /> Public Notice Board
                        </span>
                        <span className="badge badge-verified">Grama Panchayat Verified</span>
                    </div>
                    <h1 className="page-title">Announcements &amp; Public Notices</h1>
                    <p className="page-subtitle">
                        Official Grama Sabha schedules, free healthcare and eye screening camps, welfare e-KYC biometric drives, and public civic updates.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '3rem' }}>
                {loading && <LoadingState count={3} message="Loading public notices..." />}
                {error && <ErrorState message={error} onRetry={loadAnnouncements} />}
                {!loading && !error && announcements.length === 0 && (
                    <EmptyState
                        title="No active public notices"
                        description="New announcements, health camps, and Grama Sabha notices will appear here once published."
                    />
                )}
                {!loading && !error && announcements.length > 0 && (
                    <div className="card-grid">
                        {announcements.map(a => (
                            <AnnouncementCard key={a.id} announcement={a} lang={lang} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnnouncementsPage;
