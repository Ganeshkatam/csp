import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Phone, Activity, ClipboardList } from 'lucide-react';

export function MobileBottomNav() {
    return (
        <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile Quick Action Bar">
            <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Home size={18} aria-hidden="true" />
                <span>Home</span>
            </NavLink>
            <NavLink to="/schemes" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <FileText size={18} aria-hidden="true" />
                <span>Schemes</span>
            </NavLink>
            <NavLink to="/contacts" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Phone size={18} aria-hidden="true" />
                <span>Contacts</span>
            </NavLink>
            <NavLink to="/healthcare" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Activity size={18} aria-hidden="true" />
                <span>Health</span>
            </NavLink>
            <NavLink to="/survey" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <ClipboardList size={18} aria-hidden="true" />
                <span>Survey</span>
            </NavLink>
        </nav>
    );
}

export default MobileBottomNav;
