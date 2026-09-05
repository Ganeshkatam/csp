import React from 'react';
import { useParams } from 'react-router-dom';
import AdminConsoleView from '../../views/AdminConsoleView';

export function AdminPage() {
    const { section } = useParams();
    
    const sectionMap = {
        'village': 'profile',
        'schemes': 'schemes',
        'contacts': 'contacts',
        'healthcare': 'institutions',
        'education': 'institutions',
        'businesses': 'businesses',
        'announcements': 'announcements',
        'feedback': 'feedback',
        'users': 'users'
    };
    
    const mappedTab = (section && sectionMap[section.toLowerCase()]) || 'profile';

    return (
        <div style={{ padding: '1rem 0 3rem' }}>
            <AdminConsoleView initialTab={mappedTab} key={section || 'profile'} />
        </div>
    );
}

export default AdminPage;
