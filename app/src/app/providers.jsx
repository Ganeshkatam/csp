import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18N_DICT } from '../i18n';
import { authService } from '../lib/auth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { APP_CONFIG } from './config';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [lang, setLang] = useState(() => 
        localStorage.getItem(APP_CONFIG.storageKeys.language) || 'en'
    );
    const [textZoom, setTextZoom] = useState(() => 
        localStorage.getItem(APP_CONFIG.storageKeys.zoom) || 'normal'
    );
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const isOnline = useOnlineStatus();

    // Persist Language
    useEffect(() => {
        localStorage.setItem(APP_CONFIG.storageKeys.language, lang);
    }, [lang]);

    // Persist and apply Text Zoom
    useEffect(() => {
        localStorage.setItem(APP_CONFIG.storageKeys.zoom, textZoom);
        if (textZoom === 'large') {
            document.documentElement.style.setProperty('--base-font-size', '18px');
        } else {
            document.documentElement.style.setProperty('--base-font-size', '16px');
        }
    }, [textZoom]);

    // Check user admin role
    const verifyAdminRole = async (currentUser) => {
        if (!currentUser) {
            setIsAdmin(false);
            return;
        }
        try {
            const adminStatus = await authService.isAdmin();
            setIsAdmin(adminStatus);
        } catch {
            setIsAdmin(false);
        }
    };

    // Supabase Auth Listener
    useEffect(() => {
        authService.getSession()
            .then(session => {
                const currentUser = session?.user || null;
                setUser(currentUser);
                return verifyAdminRole(currentUser);
            })
            .catch(() => setIsAdmin(false))
            .finally(() => setSessionLoading(false));

        const { data: { subscription } } = authService.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user || null;
            setUser(currentUser);
            await verifyAdminRole(currentUser);
            setSessionLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleLang = () => {
        setLang(prev => (prev === 'en' ? 'te' : 'en'));
    };

    const value = {
        lang,
        setLang,
        toggleLang,
        t: I18N_DICT[lang] || I18N_DICT.en,
        textZoom,
        setTextZoom,
        user,
        setUser,
        isAdmin,
        sessionLoading,
        isOnline
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export default AppProvider;
