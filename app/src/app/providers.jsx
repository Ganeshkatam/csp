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

    // Supabase Auth Listener
    useEffect(() => {
        authService.getSession()
            .then(session => {
                setUser(session?.user || null);
                setSessionLoading(false);
            })
            .catch(() => setSessionLoading(false));

        const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
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
