import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import PublicPortalView from './views/PublicPortalView';
import SurveyFormView from './views/SurveyFormView';
import DashboardView from './views/DashboardView';
import AdminConsoleView from './views/AdminConsoleView';
import { supabase } from './lib/supabase';

function getViewFromPath(pathname) {
    const clean = pathname.replace(/\/+$/, '').toLowerCase();
    if (clean === '/survey') return 'survey';
    if (clean === '/dashboard') return 'dashboard';
    if (clean === '/admin') return 'admin';
    return 'portal';
}

function getPathFromView(view) {
    if (view === 'survey') return '/survey';
    if (view === 'dashboard') return '/dashboard';
    if (view === 'admin') return '/admin';
    return '/';
}

export default function App() {
    const [currentView, setCurrentView] = useState(() => getViewFromPath(window.location.pathname));
    const [lang, setLang] = useState(() => localStorage.getItem('csp_app_lang') || 'en');
    const [textZoom, setTextZoom] = useState(() => localStorage.getItem('csp_app_zoom') || 'normal');

    // Section & Filter State
    const [currentFilter, setCurrentFilter] = useState('ALL');
    const [activeSection, setActiveSection] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');

    // Mobile Navigation & Authentication State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [verifiedContacts, setVerifiedContacts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    // Monitor Auth State and Load Verified Contacts and Announcements from Supabase
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        // Load authoritative contacts published in Supabase
        supabase.from('contacts')
            .select('*')
            .eq('status', 'published')
            .order('name')
            .then(({ data, error }) => {
                if (!error && data) {
                    setVerifiedContacts(data);
                }
            });

        // Load published announcements from Supabase
        supabase.from('announcements')
            .select('*')
            .eq('status', 'published')
            .order('event_date', { ascending: true })
            .then(({ data, error }) => {
                if (!error && data) {
                    setAnnouncements(data);
                }
            });

        return () => subscription.unsubscribe();
    }, []);

    // Clean SPA routing navigation
    const navigate = (view) => {
        const targetPath = getPathFromView(view);
        if (window.location.pathname !== targetPath) {
            window.history.pushState(null, '', targetPath);
        }
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Smooth section scrolling with header offset & filter reset
    const scrollToSection = (sectionId) => {
        if (currentView !== 'portal') {
            const targetPath = getPathFromView('portal');
            if (window.location.pathname !== targetPath) {
                window.history.pushState(null, '', targetPath);
            }
            setCurrentView('portal');
        }

        setCurrentFilter('ALL');
        setActiveSection(sectionId);

        setTimeout(() => {
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    // Handle browser Back / Forward buttons
    useEffect(() => {
        const handlePopState = () => {
            setCurrentView(getViewFromPath(window.location.pathname));
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Ensure initial URL is clean and reset scroll position to top
    useEffect(() => {
        window.scrollTo(0, 0);
        const currentPath = window.location.pathname;
        if (currentPath.includes('.html')) {
            const cleanPath = getPathFromView(getViewFromPath(currentPath));
            window.history.replaceState(null, '', cleanPath);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('csp_app_lang', lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('csp_app_zoom', textZoom);
        if (textZoom === 'large') {
            document.documentElement.style.setProperty('--base-font-size', '18px');
        } else {
            document.documentElement.style.setProperty('--base-font-size', '16px');
        }
    }, [textZoom]);

    return (
        <div className="app-root">
            <Header 
                currentView={currentView}
                navigate={navigate}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
                lang={lang}
                setLang={setLang}
                textZoom={textZoom}
                setTextZoom={setTextZoom}
                user={user}
                verifiedContacts={verifiedContacts}
                announcements={announcements}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {currentView === 'portal' && (
                <PublicPortalView 
                    lang={lang} 
                    navigate={navigate}
                    currentFilter={currentFilter}
                    setCurrentFilter={setCurrentFilter}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setActiveSection={setActiveSection}
                    scrollToSection={scrollToSection}
                />
            )}
            {currentView === 'survey' && <SurveyFormView />}
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'admin' && <AdminConsoleView />}

            <Footer lang={lang} verifiedContacts={verifiedContacts} />

            {/* Mobile Bottom Quick Action Bar */}
            <MobileBottomNav 
                currentView={currentView}
                navigate={navigate}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
                user={user}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                lang={lang}
            />
        </div>
    );
}
