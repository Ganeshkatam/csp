import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw, ShieldCheck, UserPlus, Key } from 'lucide-react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';

export default function AdminConsoleView() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    // Password Change on First Login
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(null);

    // Admin User Provisioning
    const [adminUsers, setAdminUsers] = useState([]);
    const [newAccountEmail, setNewAccountEmail] = useState('');
    const [newAccountTempPassword, setNewAccountTempPassword] = useState('');
    const [createAccountLoading, setCreateAccountLoading] = useState(false);
    const [createAccountError, setCreateAccountError] = useState(null);

    // Voluntary Password Update
    const [selfNewPassword, setSelfNewPassword] = useState('');
    const [selfConfirmPassword, setSelfConfirmPassword] = useState('');
    const [selfPasswordLoading, setSelfPasswordLoading] = useState(false);
    const [selfPasswordError, setSelfPasswordError] = useState(null);

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

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ 
                email: email.trim(), 
                password: password 
            });
            if (error) throw error;
            setUser(data.user);
        } catch (err) {
            setAuthError(err.message || 'Login failed. Please check your credentials.');
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

            loadAdminUsers();
        } catch (err) {
            console.error('Failed to load admin data:', err);
        }
    }

    async function loadAdminUsers() {
        try {
            const { data, error } = await supabase.rpc('get_admin_users');
            if (!error && data) {
                setAdminUsers(data);
            }
        } catch (err) {
            console.error('Failed to load admin users:', err);
        }
    }

    // First-Time Mandatory Password Change
    const handleFirstTimePasswordChange = async (e) => {
        e.preventDefault();
        setChangePasswordError(null);

        if (newPassword.length < 6) {
            setChangePasswordError('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setChangePasswordError('New password and confirmation do not match.');
            return;
        }

        setChangePasswordLoading(true);
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
                data: {
                    must_change_password: false,
                    password_changed_at: new Date().toISOString()
                }
            });
            if (error) throw error;

            setUser(data.user);
            notify('Your personal password has been successfully established.');
            setNewPassword('');
            setConfirmPassword('');
            loadAllData();
        } catch (err) {
            setChangePasswordError(err.message || 'Failed to update password. Please choose a different password.');
        } finally {
            setChangePasswordLoading(false);
        }
    };

    // Admin Provisions a New User with Temporary Password
    const handleCreateAdminUser = async (e) => {
        e.preventDefault();
        setCreateAccountLoading(true);
        setCreateAccountError(null);
        try {
            if (newAccountTempPassword.length < 6) {
                throw new Error('Temporary password must be at least 6 characters.');
            }
            const { data, error } = await supabase.rpc('create_admin_user', {
                new_email: newAccountEmail.trim(),
                temp_password: newAccountTempPassword
            });
            if (error) throw error;
            notify(`Account created for ${newAccountEmail}. User must change this password on first login.`);
            setNewAccountEmail('');
            setNewAccountTempPassword('');
            loadAdminUsers();
        } catch (err) {
            setCreateAccountError(err.message || 'Failed to create user account.');
        } finally {
            setCreateAccountLoading(false);
        }
    };

    // Voluntary Password Update
    const handleVoluntaryPasswordChange = async (e) => {
        e.preventDefault();
        setSelfPasswordError(null);

        if (selfNewPassword.length < 6) {
            setSelfPasswordError('Password must be at least 6 characters long.');
            return;
        }

        if (selfNewPassword !== selfConfirmPassword) {
            setSelfPasswordError('Passwords do not match.');
            return;
        }

        setSelfPasswordLoading(true);
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: selfNewPassword,
                data: {
                    must_change_password: false,
                    password_changed_at: new Date().toISOString()
                }
            });
            if (error) throw error;

            setUser(data.user);
            notify('Your password has been updated successfully.');
            setSelfNewPassword('');
            setSelfConfirmPassword('');
        } catch (err) {
            setSelfPasswordError(err.message || 'Failed to update password.');
        } finally {
            setSelfPasswordLoading(false);
        }
    };

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

    const mustChangePassword = !!user?.user_metadata?.must_change_password;

    if (!user) {
        return (
            <main className="container" style={{ padding: '3rem 1rem' }}>
                <div className="survey-card" style={{ maxWidth: '440px', margin: '0 auto' }}>
                    <div className="section-header" style={{ textAlign: 'center' }}>
                        <Lock size={36} style={{ color: 'var(--color-gov-navy)', margin: '0 auto 0.5rem' }} />
                        <h1 className="brand-title" style={{ fontSize: '1.5rem' }}>Student / Admin Console</h1>
                        <p className="section-desc">
                            Sign in with your verified administrator credentials to manage village information.
                        </p>
                    </div>

                    {authError && <div className="alert alert-danger">{authError}</div>}

                    <form onSubmit={handleLogin}>
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
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            disabled={authLoading}
                            style={{ minHeight: '44px', marginTop: '1rem' }}
                        >
                            {authLoading ? 'Authenticating...' : 'Sign In to Admin Console'}
                        </button>
                    </form>
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                        Administrator credentials are provisioned directly in the backend. Contact the project supervisor for access.
                    </div>
                </div>
            </main>
        );
    }

    // Force Password Change on First-Time Login
    if (user && mustChangePassword) {
        return (
            <main className="container" style={{ padding: '3rem 1rem' }}>
                <div className="survey-card" style={{ maxWidth: '460px', margin: '0 auto' }}>
                    <div className="section-header" style={{ textAlign: 'center' }}>
                        <ShieldCheck size={40} style={{ color: 'var(--color-amber-600)', margin: '0 auto 0.5rem' }} />
                        <h1 className="brand-title" style={{ fontSize: '1.5rem' }}>First-Time Sign In: Set Password</h1>
                        <p className="section-desc">
                            Your account was provisioned with a temporary password. You must set a new private password before accessing the console.
                        </p>
                    </div>

                    {changePasswordError && <div className="alert alert-danger">{changePasswordError}</div>}

                    <form onSubmit={handleFirstTimePasswordChange}>
                        <div className="form-group">
                            <label className="form-label">Account Email</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={user.email} 
                                disabled 
                                style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Private Password *</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                required 
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password *</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                required 
                                minLength={6}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            disabled={changePasswordLoading}
                            style={{ minHeight: '44px', marginTop: '1rem' }}
                        >
                            {changePasswordLoading ? 'Saving New Password...' : 'Save New Password & Enter Console'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary btn-block"
                            onClick={handleLogout}
                            style={{ minHeight: '40px', marginTop: '0.5rem' }}
                        >
                            Sign Out
                        </button>
                    </form>
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
                    { key: 'feedback', label: `Citizen Feedback (${feedback.length})` },
                    { key: 'accounts', label: `Admin Accounts (${adminUsers.length})` }
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

            {/* Tab: Admin Accounts & Password Management */}
            {activeTab === 'accounts' && (
                <div className="survey-card">
                    <h2 className="section-title">Administrator & Surveyor Accounts</h2>
                    <p className="section-desc">
                        Create authorized accounts with temporary passwords. Users must set their private password upon signing in for the first time.
                    </p>

                    {/* Provision New Account Form */}
                    <div className="info-card" style={{ marginTop: '1.25rem', marginBottom: '1.75rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)' }}>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserPlus size={18} /> Provision New Account
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            Assign a temporary initial password. The system will force the user to change it to their own private password before granting access.
                        </p>

                        {createAccountError && <div className="alert alert-danger">{createAccountError}</div>}

                        <form onSubmit={handleCreateAdminUser}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={newAccountEmail}
                                        onChange={(e) => setNewAccountEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Temporary Initial Password *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={newAccountTempPassword}
                                        onChange={(e) => setNewAccountTempPassword(e.target.value)}
                                        placeholder="e.g. TempPass2026!"
                                        required 
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={createAccountLoading}
                                style={{ marginTop: '0.5rem' }}
                            >
                                {createAccountLoading ? 'Provisioning Account...' : 'Provision Account with Temporary Password'}
                            </button>
                        </form>
                    </div>

                    {/* Authorized Accounts List */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Authorized System Accounts</h3>
                    <div className="table-responsive-wrapper" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                        <table className="ledger-table" style={{ width: '100%', minWidth: '580px' }}>
                            <thead>
                                <tr>
                                    <th>Email Address</th>
                                    <th>Password Status</th>
                                    <th>Created Date</th>
                                    <th>Last Sign In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminUsers.length > 0 ? (
                                    adminUsers.map(u => (
                                        <tr key={u.id}>
                                            <td>
                                                <strong>{u.email}</strong>
                                                {u.email === user.email && (
                                                    <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: 'var(--color-blue-700)', fontWeight: 600 }}>(You)</span>
                                                )}
                                            </td>
                                            <td>
                                                {u.must_change_password ? (
                                                    <span className="badge-amber" style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        Must Change Password on First Login
                                                    </span>
                                                ) : (
                                                    <span className="badge-green" style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        Active (Password Changed)
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                                {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : 'Never signed in'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No accounts loaded.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Update Current User Password */}
                    <div className="info-card" style={{ background: '#ffffff', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Key size={18} /> Change Your Personal Password
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            Update your password for signed-in account {user.email}.
                        </p>

                        {selfPasswordError && <div className="alert alert-danger">{selfPasswordError}</div>}

                        <form onSubmit={handleVoluntaryPasswordChange}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">New Password *</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={selfNewPassword}
                                        onChange={(e) => setSelfNewPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        required 
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm New Password *</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={selfConfirmPassword}
                                        onChange={(e) => setSelfConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        required 
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-secondary"
                                disabled={selfPasswordLoading}
                                style={{ marginTop: '0.5rem' }}
                            >
                                {selfPasswordLoading ? 'Updating Password...' : 'Update My Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
