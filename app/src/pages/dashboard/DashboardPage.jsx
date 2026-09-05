import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardView from '../../views/DashboardView';

export function DashboardPage() {
    const { subtab } = useParams();
    
    let mappedTab = 'ALL';
    if (subtab) {
        const lower = subtab.toLowerCase();
        if (lower === 'survey') mappedTab = 'TECH';
        else if (lower === 'findings') mappedTab = 'DEMO';
        else if (lower === 'traceability') mappedTab = 'SCHEMES';
        else if (lower === 'emergency') mappedTab = 'EMERGENCY';
        else if (lower === 'health') mappedTab = 'HEALTH';
        else if (lower === 'ledger') mappedTab = 'LEDGER';
        else if (['tech', 'schemes', 'demo'].includes(lower)) mappedTab = lower.toUpperCase();
    }

    return (
        <div style={{ padding: '1rem 0 3rem' }}>
            <DashboardView initialTab={mappedTab} key={subtab || 'all'} />
        </div>
    );
}

export default DashboardPage;
