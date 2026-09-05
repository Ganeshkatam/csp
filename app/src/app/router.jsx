import React from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import SurveyLayout from '../layouts/SurveyLayout';
import AdminLayout from '../layouts/AdminLayout';

// Page components
import HomePage from '../pages/home/HomePage';
import SchemesPage from '../pages/schemes/SchemesPage';
import SchemeDetailsPage from '../pages/schemes/SchemeDetailsPage';
import ContactsPage from '../pages/contacts/ContactsPage';
import HealthcarePage from '../pages/healthcare/HealthcarePage';
import EducationPage from '../pages/education/EducationPage';
import BusinessesPage from '../pages/businesses/BusinessesPage';
import AnnouncementsPage from '../pages/announcements/AnnouncementsPage';
import AnnouncementDetailsPage from '../pages/announcements/AnnouncementDetailsPage';
import VillagePage from '../pages/village/VillagePage';
import FeedbackPage from '../pages/feedback/FeedbackPage';
import SurveyPage from '../pages/survey/SurveyPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AdminPage from '../pages/admin/AdminPage';

// Smart dispatcher for /schemes/:slug (distinguishes category from scheme slug)
function SchemeRouteDispatcher() {
    const { slug } = useParams();
    const clean = (slug || '').toLowerCase();
    
    const categoryMap = {
        'agriculture': 'Agriculture',
        'employment': 'Employment',
        'housing': 'Housing',
        'education': 'Education',
        'healthcare': 'Healthcare',
        'women-child': 'Women & Child',
        'women-and-child': 'Women & Child',
        'social-welfare': 'Social Welfare'
    };
    
    if (categoryMap[clean]) {
        return <SchemesPage initialCategory={categoryMap[clean]} />;
    }
    
    return <SchemeDetailsPage />;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'schemes', element: <SchemesPage /> },
            { path: 'schemes/:slug', element: <SchemeRouteDispatcher /> },
            { path: 'contacts', element: <ContactsPage /> },
            { path: 'contacts/:category', element: <ContactsPage /> },
            { path: 'healthcare', element: <HealthcarePage /> },
            { path: 'healthcare/:institutionId', element: <HealthcarePage /> },
            { path: 'education', element: <EducationPage /> },
            { path: 'education/:institutionId', element: <EducationPage /> },
            { path: 'businesses', element: <BusinessesPage /> },
            { path: 'businesses/:businessId', element: <BusinessesPage /> },
            { path: 'announcements', element: <AnnouncementsPage /> },
            { path: 'announcements/:announcementId', element: <AnnouncementDetailsPage /> },
            { path: 'village', element: <VillagePage /> },
            { path: 'feedback', element: <FeedbackPage /> }
        ]
    },
    {
        path: '/survey',
        element: <SurveyLayout />,
        children: [
            { index: true, element: <SurveyPage /> },
            { path: 'complete', element: <SurveyPage /> }
        ]
    },
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'dashboard/:subtab', element: <DashboardPage /> },
            { path: 'admin', element: <AdminPage /> },
            { path: 'admin/:section', element: <AdminPage /> }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
]);

export default router;
