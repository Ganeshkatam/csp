import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';

export default function AdminConsoleView() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [activeTab, setActiveTab] = useState('profile');
    const [notification, setNotification] = useState(null);

    // Module Data States
    const [village, setVillage] = useState({
        name: "",
        gram_panchayat: "",
        mandal: "",
        district: "",
        state: "",
        description: "",
        source: "",
        verified_on: new Date().toISOString().slice(0, 10)
    });

    const [announcements, setAnnouncements] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [feedback, setFeedback] = useState([]);

    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            if (session?.user) loadAllData();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session?.user) loadAllData();
        });

        return () => subscription.unsubscribe();
    }, []);

    const notify = (msg, type = 'success') => {
        setNotification({ text: msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError(null);
        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({ 
                    email: email.trim(), 
                    password: password 
                });
                if (error) throw error;
                
                if (data?.session) {
                    setUser(data.session.user);
                    notify('Admin account registered and signed in.');
                } else {
                    const loginRes = await supabase.auth.signInWithPassword({
                        email: email.trim(),
                        password: password
                    });
                    if (loginRes.error) throw loginRes.error;
                    setUser(loginRes.data.user);
                    notify('Admin account registered and signed in.');
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ 
                    email: email.trim(), 
                    password: password 
                });
                if (error) throw error;
                setUser(data.user);
            }
        } catch (err) {
            setAuthError(err.message || (isSignUp ? 'Registration failed.' : 'Login failed.'));
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    async function loadAllData() {
        try {
            const [vRes, aRes, sRes, cRes, iRes, bRes, fRes] = await Promise.all([
                supabase.from('villages').select('*').limit(1),
                supabase.from('announcements').select('*').order('created_at', { ascending: false }),
                supabase.from('schemes').select('*').order('created_at', { ascending: false }),
                supabase.from('contacts').select('*').order('created_at', { ascending: false }),
                supabase.from('institutions').select('*').order('created_at', { ascending: false }),
                supabase.from('businesses').select('*').order('created_at', { ascending: false }),
                supabase.from('citizen_feedback').select('*').order('created_at', { ascending: false })
            ]);

            if (vRes.data && vRes.data.length > 0) setVillage(vRes.data[0]);
            if (aRes.data) setAnnouncements(aRes.data);
            if (sRes.data) setSchemes(sRes.data);
            if (cRes.data) setContacts(cRes.data);
            if (iRes.data) setInstitutions(iRes.data);
            if (bRes.data) setBusinesses(bRes.data);
            if (fRes.data) setFeedback(fRes.data);
        } catch (err) {
            console.error('Failed to load admin data:', err);
        }
    }

    // Save Village Profile
    const handleSaveVillage = async (e) => {
        e.preventDefault();
        const payload = {
            id: village.id || DEFAULT_VILLAGE_ID,
            name: village.name.trim(),
            gram_panchayat: village.gram_panchayat.trim(),
            mandal: village.mandal.trim(),
            district: village.district.trim(),
            state: village.state.trim(),
            description: village.description.trim(),
            source: village.source.trim(),
            verified_on: village.verified_on
        };

        const { error } = await supabase.from('villages').upsert(payload);
        if (error) notify('Error: ' + error.message, 'danger');
        else notify('Village profile successfully updated.');
    };

    // Delete item helper
    const deleteItem = async (table, id, callback) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) notify('Delete failed: ' + error.message, 'danger');
        else {
            notify('Record deleted.');
            callback();
        }
    };

    if (!user) {
        return (
            <main className="container" style={{ padding: '3rem 1rem' }}>
                <div className="survey-card" style={{ maxWidth: '440px', margin: '0 auto' }}>
                    <div className="section-header" style={{ textAlign: 'center' }}>
                        <Lock size={36} style={{ color: 'var(--color-gov-navy)', margin: '0 auto 0.5rem' }} />
                        <h1 className="brand-title" style={{ fontSize: '1.5rem' }}>Student / Admin Console</h1>
                        <p className="section-desc">
                            {isSignUp 
                                ? 'Create an admin account to obtain write access for village records.' 
                                : 'Sign in with your verified credentials to manage village information.'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', borderBottom: '1px solid var(--color-slate-200)', marginBottom: '1.25rem' }}>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(false); setAuthError(null); }}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                border: 'none',
                                background: 'none',
                                borderBottom: !isSignUp ? '2px solid var(--color-blue-600)' : '2px solid transparent',
                                fontWeight: !isSignUp ? 700 : 500,
                                color: !isSignUp ? 'var(--color-blue-700)' : 'var(--color-slate-500)',
                                cursor: 'pointer'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(true); setAuthError(null); }}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                border: 'none',
                                background: 'none',
                                borderBottom: isSignUp ? '2px solid var(--color-blue-600)' : '2px solid transparent',
                                fontWeight: isSignUp ? 700 : 500,
                                color: isSignUp ? 'var(--color-blue-700)' : 'var(--color-slate-500)',
                                cursor: 'pointer'
                            }}
                        >
                            Register Account
                        </button>
                    </div>

                    {authError && <div className="alert alert-danger">{authError}</div>}

                    <form onSubmit={handleAuth}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required 
                                minLength={6}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            disabled={authLoading}
                            style={{ minHeight: '44px', marginTop: '1rem' }}
                        >
                            {authLoading 
                                ? (isSignUp ? 'Creating Account...' : 'Authenticating...') 
                                : (isSignUp ? 'Register Admin Account' : 'Sign In to Admin Console')}
                        </button>
                    </form>
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                        {isSignUp 
                            ? 'New accounts are registered directly into Supabase Auth with immediate write permissions.' 
                            : 'Forgot credentials? You can switch to Register Account to set up an authorized login.'}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', margin: '1.5rem 0' }}>
                <div>
                    <h1 className="brand-title" style={{ fontSize: '1.75rem' }}>Village Information Management Console</h1>
                    <p className="section-desc">Logged in as: <strong>{user.email}</strong></p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                    <LogOut size={14} style={{ marginRight: '6px' }} /> Sign Out
                </button>
            </div>

            {notification && (
                <div className={`alert alert-${notification.type === 'danger' ? 'danger' : 'success'}`}>
                    {notification.text}
                </div>
            )}

            {/* Admin Tab Navigation */}
            <div className="admin-tabs-bar" style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--color-border)', marginBottom: '1.5rem' }}>
                {[
                    { key: 'profile', label: 'Village Profile' },
                    { key: 'announcements', label: 'Announcements' },
                    { key: 'schemes', label: 'Welfare Schemes' },
                    { key: 'contacts', label: 'Contacts' },
                    { key: 'institutions', label: 'Health & Schools' },
                    { key: 'businesses', label: 'Local Businesses' },
                    { key: 'feedback', label: `Citizen Feedback (${feedback.length})` }
                ].map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`filter-pill ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab: Profile */}
            {activeTab === 'profile' && (
                <div className="survey-card">
                    <h2 className="section-title">Habitation Details & Administration</h2>
                    <p className="section-desc">Configure the geographic and administrative profile of your assigned village for the CSP study.</p>
                    <form onSubmit={handleSaveVillage} style={{ marginTop: '1rem' }}>
                        <div className="choice-grid columns-2">
                            <div className="form-group">
                                <label className="form-label">Village / Habitation Name *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={village.name}
                                    onChange={(e) => setVillage({ ...village, name: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gram Panchayat *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={village.gram_panchayat}
                                    onChange={(e) => setVillage({ ...village, gram_panchayat: e.target.value })}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="choice-grid columns-3">
                            <div className="form-group">
                                <label className="form-label">Mandal / Taluk *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={village.mandal}
                                    onChange={(e) => setVillage({ ...village, mandal: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">District *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={village.district}
                                    onChange={(e) => setVillage({ ...village, district: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">State *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={village.state}
                                    onChange={(e) => setVillage({ ...village, state: e.target.value })}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Habitation Overview & Description</label>
                            <textarea 
                                className="form-control" 
                                rows="3"
                                value={village.description}
                                onChange={(e) => setVillage({ ...village, description: e.target.value })}
                            />
                        </div>

                        <div className="choice-grid columns-2">
                            <div className="form-group">
                                <label className="form-label">Verification Source *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={village.source}
                                    onChange={(e) => setVillage({ ...village, source: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Verified Date *</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={village.verified_on}
                                    onChange={(e) => setVillage({ ...village, verified_on: e.target.value })}
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Update Village Profile
                        </button>
                    </form>
                </div>
            )}

            {/* Tab: Citizen Feedback */}
            {activeTab === 'feedback' && (
                <div className="survey-card">
                    <h2 className="section-title">Citizen Feedback & Correction Inquiries</h2>
                    <p className="section-desc">Public submissions requesting information updates or reporting errors.</p>
                    <div style={{ marginTop: '1rem' }}>
                        {feedback.length > 0 ? (
                            feedback.map(f => (
                                <div key={f.id} className="info-card" style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="badge badge-civic">{f.feedback_type}</span>
                                        <span className="badge" style={{ background: f.status === 'Resolved' ? '#dcfce7' : '#fef3c7', color: f.status === 'Resolved' ? '#15803d' : '#b45309' }}>
                                            {f.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>{f.message}</p>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        Submitted by: {f.name} ({f.phone || 'No phone'}) | Date: {new Date(f.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)' }}>No feedback submissions recorded yet.</p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
