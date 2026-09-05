import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../app/providers';
import { LoadingState } from '../feedback/LoadingState';

/**
 * Client-side Route Guard for Administrative and Protected Views.
 * Note: This provides UX access control on the frontend.
 * The authoritative security boundary is enforced at the data layer
 * via Supabase Authentication and PostgreSQL Row Level Security (RLS) policies.
 */
export function ProtectedRoute({ children }) {
    const { user, sessionLoading } = useAppContext();
    const location = useLocation();

    if (sessionLoading) {
        return (
            <div className="container" style={{ padding: '4rem 0' }}>
                <LoadingState count={2} message="Verifying authentication session..." />
            </div>
        );
    }

    if (!user) {
        // Redirect to admin login screen, saving current location for redirect back
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
