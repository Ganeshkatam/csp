import React from 'react';
import { Home, FileText, Phone, Activity, BarChart3, ClipboardList, Lock, Menu } from 'lucide-react';
import { I18N_DICT } from '../lib/i18n';

export default function MobileBottomNav({
    currentView,
    navigate,
    activeSection,
    scrollToSection,
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    lang
}) {
    const t = I18N_DICT[lang];
    const isAcademicWorkflow = user || currentView === 'survey' || currentView === 'dashboard' || currentView === 'admin';

    return (
        <nav 
            className="mobile-bottom-nav" 
            role="navigation" 
            aria-label="Mobile Quick Action Bar"
        >
            {isAcademicWorkflow ? (
                <>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'portal' ? 'active' : ''}`}
                        onClick={() => navigate('portal')}
                        aria-label="Navigate to Village Portal Home"
                    >
                        <Home size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Home</span>
                    </button>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'survey' ? 'active' : ''}`}
                        onClick={() => navigate('survey')}
                        aria-label="Navigate to Field Survey Form"
                    >
                        <ClipboardList size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Survey</span>
                    </button>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('dashboard')}
                        aria-label="Navigate to Survey Analytics Dashboard"
                    >
                        <BarChart3 size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Analytics</span>
                    </button>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'admin' ? 'active' : ''}`}
                        onClick={() => navigate('admin')}
                        aria-label="Navigate to Admin Management Console"
                    >
                        <Lock size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Admin</span>
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'portal' && activeSection === 'home' ? 'active' : ''}`}
                        onClick={() => scrollToSection('home')}
                        aria-label="Scroll to Portal Home"
                    >
                        <Home size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Home</span>
                    </button>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'portal' && activeSection === 'sectionSchemes' ? 'active' : ''}`}
                        onClick={() => scrollToSection('sectionSchemes')}
                        aria-label="Scroll to Welfare Schemes"
                    >
                        <FileText size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Schemes</span>
                    </button>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'portal' && activeSection === 'sectionContacts' ? 'active' : ''}`}
                        onClick={() => scrollToSection('sectionContacts')}
                        aria-label="Scroll to Emergency and Civic Contacts"
                    >
                        <Phone size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Contacts</span>
                    </button>
                    <button
                        type="button"
                        className={`bottom-nav-item ${currentView === 'portal' && activeSection === 'sectionInstitutions' ? 'active' : ''}`}
                        onClick={() => scrollToSection('sectionInstitutions')}
                        aria-label="Scroll to Healthcare and Education"
                    >
                        <Activity size={20} aria-hidden="true" />
                        <span className="bottom-nav-label">Health</span>
                    </button>
                </>
            )}

            <button
                type="button"
                className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(prev => !prev)}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Full Navigation Menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
            >
                <Menu size={20} aria-hidden="true" />
                <span className="bottom-nav-label">Menu</span>
            </button>
        </nav>
    );
}
