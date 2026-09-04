import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw, ShieldCheck, UserPlus, Key, Edit, Eye, EyeOff, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';

const ANNOUNCEMENT_CATEGORIES = [
    "Public Meeting",
    "Health Camp",
    "Welfare Drive",
    "Drinking Water & Sanitation",
    "Agriculture & Farmers",
    "Electricity & Power",
    "Education & Schools",
    "Weather & Cyclone Alert",
    "Emergency Alert",
    "Infrastructure & Road Works",
    "Revenue & Land Records",
    "Employment & Skill Camp",
    "Panchayat Notice",
    "General Notice"
];

const SCHEME_CATEGORIES = [
    "Agriculture",
    "Healthcare",
    "Social Welfare",
    "Social Security",
    "Housing",
    "Education",
    "Women & Child",
    "Rural Employment & MGNREGA",
    "Youth & Skill Development",
    "Disability & Senior Citizens",
    "Fisheries & Animal Husbandry",
    "Financial Inclusion & Loans"
];

const CONTACT_CATEGORIES = [
    "Administration",
    "Emergency",
    "Police",
    "Healthcare",
    "Panchayat",
    "Revenue",
    "Utilities",
    "Agriculture & Veterinary",
    "Education & Anganwadi",
    "Women & Child Helpline",
    "Judiciary & Legal Aid"
];

const INSTITUTION_TYPES = [
    "Primary Health Centre",
    "PHC",
    "Government School",
    "Education",
    "Anganwadi Centre",
    "Village Secretariat",
    "Panchayat Office",
    "Veterinary Clinic",
    "Rythu Bharosa Kendram (RBK)",
    "Fair Price Shop",
    "Post Office / Bank Point",
    "Community Hall"
];

const BUSINESS_CATEGORIES = [
    "Dairy & Agriculture",
    "Electrical & Repair",
    "Handloom & Textiles",
    "Transport & Logistics",
    "Agriculture & Tools",
    "Electrical & Motors",
    "Artisans & Handicrafts",
    "Grocery & Daily Needs",
    "Self-Help Group (SHG)",
    "Services & Transport",
    "Construction & Hardware",
    "Tailoring & Garments",
    "Mobile & Digital Services"
];

const defaultAnnouncement = {
    id: null,
    title: "",
    title_te: "",
    description: "",
    description_te: "",
    category: "Public Meeting",
    event_date: "",
    source: "Grama Panchayat Notice Board",
    verified_on: new Date().toISOString().slice(0, 10),
    status: "published"
};

const defaultScheme = {
    id: null,
    name: "",
    name_te: "",
    category: "Agriculture",
    description: "",
    description_te: "",
    eligibility: "",
    eligibility_te: "",
    documents: "Aadhaar, Ration Card, Bank Passbook",
    documents_te: "",
    official_url: "https://",
    source: "AP State Portal",
    verified_on: new Date().toISOString().slice(0, 10),
    status: "published"
};

const defaultContact = {
    id: null,
    name: "",
    name_te: "",
    category: "Emergency",
    designation: "",
    designation_te: "",
    phone: "",
    jurisdiction: "Andhra Pradesh",
    address: "",
    availability: "24x7 Toll-Free",
    source: "District Administration Directory",
    verified_on: new Date().toISOString().slice(0, 10),
    status: "published"
};

const defaultInstitution = {
    id: null,
    name: "",
    name_te: "",
    type: "Primary Health Centre",
    address: "",
    phone: "",
    timings: "9:00 AM - 4:00 PM",
    services: "",
    services_te: "",
    source: "Department Circular",
    verified_on: new Date().toISOString().slice(0, 10),
    status: "published"
};

const defaultBusiness = {
    id: null,
    name: "",
    name_te: "",
    owner_name: "",
    category: "Agriculture & Tools",
    services: "",
    services_te: "",
    address: "",
    phone: "",
    source: "Local Market Survey",
    verified_on: new Date().toISOString().slice(0, 10),
    status: "published"
};

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

    // Form States for CRUD
    const [announcementForm, setAnnouncementForm] = useState(defaultAnnouncement);
    const [schemeForm, setSchemeForm] = useState(defaultScheme);
    const [contactForm, setContactForm] = useState(defaultContact);
    const [institutionForm, setInstitutionForm] = useState(defaultInstitution);
    const [businessForm, setBusinessForm] = useState(defaultBusiness);

    // Collapsible Form Toggles (Collapsed by default so ledgers are visible immediately)
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
    const [showSchemeForm, setShowSchemeForm] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showInstitutionForm, setShowInstitutionForm] = useState(false);
    const [showBusinessForm, setShowBusinessForm] = useState(false);

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

    // Reload Helpers for CRUD
    async function reloadAnnouncements() {
        const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
    }
    async function reloadSchemes() {
        const { data } = await supabase.from('schemes').select('*').order('created_at', { ascending: false });
        if (data) setSchemes(data);
    }
    async function reloadContacts() {
        const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        if (data) setContacts(data);
    }
    async function reloadInstitutions() {
        const { data } = await supabase.from('institutions').select('*').order('created_at', { ascending: false });
        if (data) setInstitutions(data);
    }
    async function reloadBusinesses() {
        const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
        if (data) setBusinesses(data);
    }

    // Toggle Status Helper
    const handleToggleStatus = async (table, item, reloadFn) => {
        const nextStatus = item.status === 'published' ? 'draft' : 'published';
        const { error } = await supabase.from(table).update({ status: nextStatus }).eq('id', item.id);
        if (error) notify('Status update failed: ' + error.message, 'danger');
        else {
            notify(`Status updated to ${nextStatus}.`);
            reloadFn();
        }
    };

    // Save Handlers for the 5 Modules
    const handleSaveAnnouncement = async (e) => {
        e.preventDefault();
        const payload = {
            village_id: village.id || DEFAULT_VILLAGE_ID,
            title: announcementForm.title.trim(),
            title_te: announcementForm.title_te ? announcementForm.title_te.trim() : null,
            description: announcementForm.description.trim(),
            description_te: announcementForm.description_te ? announcementForm.description_te.trim() : null,
            category: announcementForm.category,
            event_date: announcementForm.event_date || null,
            source: announcementForm.source.trim(),
            verified_on: announcementForm.verified_on,
            status: announcementForm.status
        };
        if (announcementForm.id) payload.id = announcementForm.id;

        const { error } = await supabase.from('announcements').upsert(payload);
        if (error) notify('Error: ' + error.message, 'danger');
        else {
            notify(announcementForm.id ? 'Announcement updated.' : 'Announcement added.');
            setAnnouncementForm(defaultAnnouncement);
            setShowAnnouncementForm(false);
            reloadAnnouncements();
        }
    };

    const handleSaveScheme = async (e) => {
        e.preventDefault();
        const payload = {
            village_id: village.id || DEFAULT_VILLAGE_ID,
            name: schemeForm.name.trim(),
            name_te: schemeForm.name_te ? schemeForm.name_te.trim() : null,
            category: schemeForm.category,
            description: schemeForm.description.trim(),
            description_te: schemeForm.description_te ? schemeForm.description_te.trim() : null,
            eligibility: schemeForm.eligibility.trim(),
            eligibility_te: schemeForm.eligibility_te ? schemeForm.eligibility_te.trim() : null,
            documents: schemeForm.documents.trim(),
            documents_te: schemeForm.documents_te ? schemeForm.documents_te.trim() : null,
            official_url: schemeForm.official_url.trim(),
            source: schemeForm.source.trim(),
            verified_on: schemeForm.verified_on,
            status: schemeForm.status
        };
        if (schemeForm.id) payload.id = schemeForm.id;

        const { error } = await supabase.from('schemes').upsert(payload);
        if (error) notify('Error: ' + error.message, 'danger');
        else {
            notify(schemeForm.id ? 'Scheme updated.' : 'Scheme added.');
            setSchemeForm(defaultScheme);
            setShowSchemeForm(false);
            reloadSchemes();
        }
    };

    const handleSaveContact = async (e) => {
        e.preventDefault();
        const payload = {
            village_id: village.id || DEFAULT_VILLAGE_ID,
            name: contactForm.name.trim(),
            name_te: contactForm.name_te ? contactForm.name_te.trim() : null,
            category: contactForm.category,
            designation: contactForm.designation ? contactForm.designation.trim() : null,
            designation_te: contactForm.designation_te ? contactForm.designation_te.trim() : null,
            phone: contactForm.phone.trim(),
            jurisdiction: contactForm.jurisdiction ? contactForm.jurisdiction.trim() : null,
            address: contactForm.address ? contactForm.address.trim() : null,
            availability: contactForm.availability ? contactForm.availability.trim() : null,
            source: contactForm.source.trim(),
            verified_on: contactForm.verified_on,
            status: contactForm.status
        };
        if (contactForm.id) payload.id = contactForm.id;

        const { error } = await supabase.from('contacts').upsert(payload);
        if (error) notify('Error: ' + error.message, 'danger');
        else {
            notify(contactForm.id ? 'Contact updated.' : 'Contact added.');
            setContactForm(defaultContact);
            setShowContactForm(false);
            reloadContacts();
        }
    };

    const handleSaveInstitution = async (e) => {
        e.preventDefault();
        const payload = {
            village_id: village.id || DEFAULT_VILLAGE_ID,
            name: institutionForm.name.trim(),
            name_te: institutionForm.name_te ? institutionForm.name_te.trim() : null,
            type: institutionForm.type,
            address: institutionForm.address.trim(),
            phone: institutionForm.phone ? institutionForm.phone.trim() : null,
            timings: institutionForm.timings ? institutionForm.timings.trim() : null,
            services: institutionForm.services ? institutionForm.services.trim() : null,
            services_te: institutionForm.services_te ? institutionForm.services_te.trim() : null,
            source: institutionForm.source.trim(),
            verified_on: institutionForm.verified_on,
            status: institutionForm.status
        };
        if (institutionForm.id) payload.id = institutionForm.id;

        const { error } = await supabase.from('institutions').upsert(payload);
        if (error) notify('Error: ' + error.message, 'danger');
        else {
            notify(institutionForm.id ? 'Institution updated.' : 'Institution added.');
            setInstitutionForm(defaultInstitution);
            setShowInstitutionForm(false);
            reloadInstitutions();
        }
    };

    const handleSaveBusiness = async (e) => {
        e.preventDefault();
        const payload = {
            village_id: village.id || DEFAULT_VILLAGE_ID,
            name: businessForm.name.trim(),
            name_te: businessForm.name_te ? businessForm.name_te.trim() : null,
            owner_name: businessForm.owner_name ? businessForm.owner_name.trim() : null,
            category: businessForm.category,
            services: businessForm.services.trim(),
            services_te: businessForm.services_te ? businessForm.services_te.trim() : null,
            address: businessForm.address.trim(),
            phone: businessForm.phone ? businessForm.phone.trim() : null,
            source: businessForm.source.trim(),
            verified_on: businessForm.verified_on,
            status: businessForm.status
        };
        if (businessForm.id) payload.id = businessForm.id;

        const { error } = await supabase.from('businesses').upsert(payload);
        if (error) notify('Error: ' + error.message, 'danger');
        else {
            notify(businessForm.id ? 'Business updated.' : 'Business added.');
            setBusinessForm(defaultBusiness);
            setShowBusinessForm(false);
            reloadBusinesses();
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
                    { key: 'announcements', label: `Announcements (${announcements.length})` },
                    { key: 'schemes', label: `Welfare Schemes (${schemes.length})` },
                    { key: 'contacts', label: `Contacts (${contacts.length})` },
                    { key: 'institutions', label: `Health & Schools (${institutions.length})` },
                    { key: 'businesses', label: `Local Businesses (${businesses.length})` },
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

            {/* Tab: Announcements */}
            {activeTab === 'announcements' && (
                <div className="survey-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 className="section-title" style={{ margin: 0 }}>Announcements & Ticker Notices</h2>
                            <p className="section-desc" style={{ margin: '4px 0 0' }}>Manage announcements displayed across the live ticker and the citizen community notice board.</p>
                        </div>
                        <button 
                            type="button" 
                            className={showAnnouncementForm ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                            onClick={() => {
                                if (showAnnouncementForm && announcementForm.id) {
                                    setAnnouncementForm(defaultAnnouncement);
                                }
                                setShowAnnouncementForm(!showAnnouncementForm);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            {showAnnouncementForm ? (
                                <><ChevronUp size={15} /> Hide Form</>
                            ) : (
                                <><Plus size={15} /> Add New Announcement</>
                            )}
                        </button>
                    </div>

                    {/* Announcement Form Card */}
                    {showAnnouncementForm && (
                        <div className="info-card" style={{ marginTop: '0.75rem', marginBottom: '1.75rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                                        {announcementForm.id ? 'Edit Announcement' : 'Add New Announcement'}
                                    </h3>
                                    <span className="badge" style={{ background: announcementForm.id ? '#e0f2fe' : '#f1f5f9', color: announcementForm.id ? '#0369a1' : '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {announcementForm.id ? `Editing ID #${announcementForm.id}` : 'New Entry'}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    onClick={() => {
                                        setAnnouncementForm(defaultAnnouncement);
                                        setShowAnnouncementForm(false);
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <ChevronUp size={14} /> Hide Form
                                </button>
                            </div>

                        <form onSubmit={handleSaveAnnouncement}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Announcement Title (English) *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={announcementForm.title}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                        placeholder="e.g. Free Health Screening Camp"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Announcement Title (Telugu)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={announcementForm.title_te}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title_te: e.target.value })}
                                        placeholder="ఉచిత ఆరోగ్య పరీక్షా శిబిరం"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select 
                                        className="form-control"
                                        value={announcementForm.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__CUSTOM__') {
                                                const custom = window.prompt('Enter custom announcement category:');
                                                if (custom && custom.trim()) {
                                                    setAnnouncementForm({ ...announcementForm, category: custom.trim() });
                                                }
                                            } else {
                                                setAnnouncementForm({ ...announcementForm, category: e.target.value });
                                            }
                                        }}
                                    >
                                        {ANNOUNCEMENT_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        {!ANNOUNCEMENT_CATEGORIES.includes(announcementForm.category) && announcementForm.category && (
                                            <option value={announcementForm.category}>{announcementForm.category}</option>
                                        )}
                                        <option value="__CUSTOM__">+ Enter Custom Category...</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Event Date</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={announcementForm.event_date || ""}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, event_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description (English) *</label>
                                <textarea 
                                    className="form-control" 
                                    rows="2"
                                    value={announcementForm.description}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                                    placeholder="Detailed overview of the announcement..."
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description (Telugu)</label>
                                <textarea 
                                    className="form-control" 
                                    rows="2"
                                    value={announcementForm.description_te}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, description_te: e.target.value })}
                                    placeholder="ప్రకటన వివరాలు..."
                                />
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Verification Source *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={announcementForm.source}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, source: e.target.value })}
                                        placeholder="Grama Panchayat Notice Board"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Verified Date *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={announcementForm.verified_on}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, verified_on: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select 
                                        className="form-control"
                                        value={announcementForm.status}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, status: e.target.value })}
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                {announcementForm.id ? 'Save Changes' : 'Publish Announcement'}
                            </button>
                        </form>
                    </div>
                    )}

                    {/* Announcements Ledger */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Published & Draft Announcements</h3>
                    <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="ledger-table" style={{ width: '100%', minWidth: '650px' }}>
                            <thead>
                                <tr>
                                    <th>Title & Category</th>
                                    <th>Event Date</th>
                                    <th>Source</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.length > 0 ? (
                                    announcements.map(a => (
                                        <tr key={a.id}>
                                            <td>
                                                <strong>{a.title}</strong>
                                                {a.title_te && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.title_te}</div>}
                                                <span className="badge" style={{ fontSize: '0.7rem', marginTop: '4px', background: '#f1f5f9', color: '#334155' }}>{a.category}</span>
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>{a.event_date || 'Ongoing'}</td>
                                            <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{a.source}</td>
                                            <td>
                                                <span className={a.status === 'published' ? 'badge-green' : 'badge-amber'} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {a.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title={a.status === 'published' ? 'Unpublish to Draft' : 'Publish'}
                                                    onClick={() => handleToggleStatus('announcements', a, reloadAnnouncements)}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    {a.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Edit Record"
                                                    onClick={() => { 
                                                        setAnnouncementForm(a); 
                                                        setShowAnnouncementForm(true); 
                                                        window.scrollTo({ top: 280, behavior: 'smooth' }); 
                                                    }}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Delete Record"
                                                    onClick={() => deleteItem('announcements', a.id, reloadAnnouncements)}
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No announcements created yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab: Welfare Schemes */}
            {activeTab === 'schemes' && (
                <div className="survey-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 className="section-title" style={{ margin: 0 }}>Government Welfare Schemes</h2>
                            <p className="section-desc" style={{ margin: '4px 0 0' }}>Manage welfare programs, eligibility rules, document checklists, and application links.</p>
                        </div>
                        <button 
                            type="button" 
                            className={showSchemeForm ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                            onClick={() => {
                                if (showSchemeForm && schemeForm.id) {
                                    setSchemeForm(defaultScheme);
                                }
                                setShowSchemeForm(!showSchemeForm);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            {showSchemeForm ? (
                                <><ChevronUp size={15} /> Hide Form</>
                            ) : (
                                <><Plus size={15} /> Add New Welfare Scheme</>
                            )}
                        </button>
                    </div>

                    {/* Scheme Form Card */}
                    {showSchemeForm && (
                        <div className="info-card" style={{ marginTop: '0.75rem', marginBottom: '1.75rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                                        {schemeForm.id ? 'Edit Scheme' : 'Add New Welfare Scheme'}
                                    </h3>
                                    <span className="badge" style={{ background: schemeForm.id ? '#e0f2fe' : '#f1f5f9', color: schemeForm.id ? '#0369a1' : '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {schemeForm.id ? `Editing ID #${schemeForm.id}` : 'New Entry'}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    onClick={() => {
                                        setSchemeForm(defaultScheme);
                                        setShowSchemeForm(false);
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <ChevronUp size={14} /> Hide Form
                                </button>
                            </div>

                        <form onSubmit={handleSaveScheme}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Scheme Name (English) *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={schemeForm.name}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                                        placeholder="e.g. PM-KISAN Samman Nidhi"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Scheme Name (Telugu)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={schemeForm.name_te}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, name_te: e.target.value })}
                                        placeholder="పీఎం కిసాన్ సంక్షేమ పథకం"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select 
                                        className="form-control"
                                        value={schemeForm.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__CUSTOM__') {
                                                const custom = window.prompt('Enter custom scheme category:');
                                                if (custom && custom.trim()) {
                                                    setSchemeForm({ ...schemeForm, category: custom.trim() });
                                                }
                                            } else {
                                                setSchemeForm({ ...schemeForm, category: e.target.value });
                                            }
                                        }}
                                    >
                                        {SCHEME_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        {!SCHEME_CATEGORIES.includes(schemeForm.category) && schemeForm.category && (
                                            <option value={schemeForm.category}>{schemeForm.category}</option>
                                        )}
                                        <option value="__CUSTOM__">+ Enter Custom Category...</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Official Portal URL *</label>
                                    <input 
                                        type="url" 
                                        className="form-control" 
                                        value={schemeForm.official_url}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, official_url: e.target.value })}
                                        placeholder="https://pmkisan.gov.in"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Benefits Description *</label>
                                <textarea 
                                    className="form-control" 
                                    rows="2"
                                    value={schemeForm.description}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                                    placeholder="e.g. Financial benefit of Rs. 6,000 per year in three equal installments..."
                                    required 
                                />
                            </div>

                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Eligibility Criteria *</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="2"
                                        value={schemeForm.eligibility}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                                        placeholder="Small and marginal landholder farmer families..."
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Required Documents *</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="2"
                                        value={schemeForm.documents}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, documents: e.target.value })}
                                        placeholder="Aadhaar Card, Land records passbook, Bank account..."
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Verification Source *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={schemeForm.source}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, source: e.target.value })}
                                        placeholder="Agriculture Extension Officer"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Verified Date *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={schemeForm.verified_on}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, verified_on: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select 
                                        className="form-control"
                                        value={schemeForm.status}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, status: e.target.value })}
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                {schemeForm.id ? 'Save Changes' : 'Add Welfare Scheme'}
                            </button>
                        </form>
                    </div>
                    )}

                    {/* Schemes Ledger */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Cataloged Welfare Schemes</h3>
                    <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="ledger-table" style={{ width: '100%', minWidth: '650px' }}>
                            <thead>
                                <tr>
                                    <th>Scheme Name</th>
                                    <th>Category</th>
                                    <th>Official Link</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schemes.length > 0 ? (
                                    schemes.map(s => (
                                        <tr key={s.id}>
                                            <td>
                                                <strong>{s.name}</strong>
                                                {s.name_te && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.name_te}</div>}
                                            </td>
                                            <td>
                                                <span className="badge" style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1' }}>{s.category}</span>
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>
                                                <a href={s.official_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-blue-700)', textDecoration: 'underline' }}>
                                                    Portal Link
                                                </a>
                                            </td>
                                            <td>
                                                <span className={s.status === 'published' ? 'badge-green' : 'badge-amber'} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {s.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title={s.status === 'published' ? 'Unpublish to Draft' : 'Publish'}
                                                    onClick={() => handleToggleStatus('schemes', s, reloadSchemes)}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    {s.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Edit Record"
                                                    onClick={() => { 
                                                        setSchemeForm(s); 
                                                        setShowSchemeForm(true); 
                                                        window.scrollTo({ top: 280, behavior: 'smooth' }); 
                                                    }}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Delete Record"
                                                    onClick={() => deleteItem('schemes', s.id, reloadSchemes)}
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No schemes cataloged yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab: Emergency & Civic Contacts */}
            {activeTab === 'contacts' && (
                <div className="survey-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 className="section-title" style={{ margin: 0 }}>Emergency & Civic Contacts</h2>
                            <p className="section-desc" style={{ margin: '4px 0 0' }}>Manage verified helpline numbers and administrative officers with one-tap dialing.</p>
                        </div>
                        <button 
                            type="button" 
                            className={showContactForm ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                            onClick={() => {
                                if (showContactForm && contactForm.id) {
                                    setContactForm(defaultContact);
                                }
                                setShowContactForm(!showContactForm);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            {showContactForm ? (
                                <><ChevronUp size={15} /> Hide Form</>
                            ) : (
                                <><Plus size={15} /> Add New Contact</>
                            )}
                        </button>
                    </div>

                    {/* Contact Form Card */}
                    {showContactForm && (
                        <div className="info-card" style={{ marginTop: '0.75rem', marginBottom: '1.75rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                                        {contactForm.id ? 'Edit Contact' : 'Add New Contact'}
                                    </h3>
                                    <span className="badge" style={{ background: contactForm.id ? '#e0f2fe' : '#f1f5f9', color: contactForm.id ? '#0369a1' : '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {contactForm.id ? `Editing ID #${contactForm.id}` : 'New Entry'}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    onClick={() => {
                                        setContactForm(defaultContact);
                                        setShowContactForm(false);
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <ChevronUp size={14} /> Hide Form
                                </button>
                            </div>

                        <form onSubmit={handleSaveContact}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Contact / Office Name (English) *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                        placeholder="e.g. 108 Emergency Ambulance"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact / Office Name (Telugu)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={contactForm.name_te}
                                        onChange={(e) => setContactForm({ ...contactForm, name_te: e.target.value })}
                                        placeholder="108 అత్యవసర అంబులెన్స్"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select 
                                        className="form-control"
                                        value={contactForm.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__CUSTOM__') {
                                                const custom = window.prompt('Enter custom contact category:');
                                                if (custom && custom.trim()) {
                                                    setContactForm({ ...contactForm, category: custom.trim() });
                                                }
                                            } else {
                                                setContactForm({ ...contactForm, category: e.target.value });
                                            }
                                        }}
                                    >
                                        {CONTACT_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        {!CONTACT_CATEGORIES.includes(contactForm.category) && contactForm.category && (
                                            <option value={contactForm.category}>{contactForm.category}</option>
                                        )}
                                        <option value="__CUSTOM__">+ Enter Custom Category...</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        value={contactForm.phone}
                                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                        placeholder="108 or 10-digit mobile"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Designation</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={contactForm.designation}
                                        onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                                        placeholder="e.g. Village Secretary"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Jurisdiction</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={contactForm.jurisdiction}
                                        onChange={(e) => setContactForm({ ...contactForm, jurisdiction: e.target.value })}
                                        placeholder="Andhra Pradesh or Grama Panchayat"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Operating Availability</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={contactForm.availability}
                                        onChange={(e) => setContactForm({ ...contactForm, availability: e.target.value })}
                                        placeholder="24x7 Toll-Free or 9 AM - 5 PM"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Verification Source *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={contactForm.source}
                                        onChange={(e) => setContactForm({ ...contactForm, source: e.target.value })}
                                        placeholder="District Administration Portal"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Verified Date *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={contactForm.verified_on}
                                        onChange={(e) => setContactForm({ ...contactForm, verified_on: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select 
                                        className="form-control"
                                        value={contactForm.status}
                                        onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })}
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                {contactForm.id ? 'Save Changes' : 'Add Contact Record'}
                            </button>
                        </form>
                    </div>
                    )}

                    {/* Contacts Ledger */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Verified Civic & Emergency Directory</h3>
                    <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="ledger-table" style={{ width: '100%', minWidth: '650px' }}>
                            <thead>
                                <tr>
                                    <th>Name & Category</th>
                                    <th>Phone</th>
                                    <th>Jurisdiction & Availability</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length > 0 ? (
                                    contacts.map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <strong>{c.name}</strong>
                                                {c.designation && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.designation}</div>}
                                                <span className="badge" style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#991b1b', marginTop: '3px' }}>{c.category}</span>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                <a href={`tel:${c.phone}`} style={{ color: 'var(--color-blue-700)' }}>{c.phone}</a>
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>
                                                <div>{c.jurisdiction || 'State'}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{c.availability}</div>
                                            </td>
                                            <td>
                                                <span className={c.status === 'published' ? 'badge-green' : 'badge-amber'} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {c.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title={c.status === 'published' ? 'Unpublish to Draft' : 'Publish'}
                                                    onClick={() => handleToggleStatus('contacts', c, reloadContacts)}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    {c.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Edit Record"
                                                    onClick={() => { 
                                                        setContactForm(c); 
                                                        setShowContactForm(true); 
                                                        window.scrollTo({ top: 280, behavior: 'smooth' }); 
                                                    }}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Delete Record"
                                                    onClick={() => deleteItem('contacts', c.id, reloadContacts)}
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No contacts listed yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab: Institutions (Health & Schools) */}
            {activeTab === 'institutions' && (
                <div className="survey-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 className="section-title" style={{ margin: 0 }}>Healthcare & Education Institutions</h2>
                            <p className="section-desc" style={{ margin: '4px 0 0' }}>Manage public institutions including Primary Health Centre, Schools, and Anganwadis.</p>
                        </div>
                        <button 
                            type="button" 
                            className={showInstitutionForm ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                            onClick={() => {
                                if (showInstitutionForm && institutionForm.id) {
                                    setInstitutionForm(defaultInstitution);
                                }
                                setShowInstitutionForm(!showInstitutionForm);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            {showInstitutionForm ? (
                                <><ChevronUp size={15} /> Hide Form</>
                            ) : (
                                <><Plus size={15} /> Add New Institution</>
                            )}
                        </button>
                    </div>

                    {/* Institution Form Card */}
                    {showInstitutionForm && (
                        <div className="info-card" style={{ marginTop: '0.75rem', marginBottom: '1.75rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                                        {institutionForm.id ? 'Edit Institution' : 'Add New Public Institution'}
                                    </h3>
                                    <span className="badge" style={{ background: institutionForm.id ? '#e0f2fe' : '#f1f5f9', color: institutionForm.id ? '#0369a1' : '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {institutionForm.id ? `Editing ID #${institutionForm.id}` : 'New Entry'}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    onClick={() => {
                                        setInstitutionForm(defaultInstitution);
                                        setShowInstitutionForm(false);
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <ChevronUp size={14} /> Hide Form
                                </button>
                            </div>

                        <form onSubmit={handleSaveInstitution}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Institution Name (English) *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={institutionForm.name}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, name: e.target.value })}
                                        placeholder="e.g. Primary Health Centre (PHC)"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Institution Name (Telugu)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={institutionForm.name_te}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, name_te: e.target.value })}
                                        placeholder="ప్రాథమిక ఆరోగ్య కేంద్రం"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Facility Type *</label>
                                    <select 
                                        className="form-control"
                                        value={institutionForm.type}
                                        onChange={(e) => {
                                            if (e.target.value === '__CUSTOM__') {
                                                const custom = window.prompt('Enter custom institution facility type:');
                                                if (custom && custom.trim()) {
                                                    setInstitutionForm({ ...institutionForm, type: custom.trim() });
                                                }
                                            } else {
                                                setInstitutionForm({ ...institutionForm, type: e.target.value });
                                            }
                                        }}
                                    >
                                        {INSTITUTION_TYPES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                        {!INSTITUTION_TYPES.includes(institutionForm.type) && institutionForm.type && (
                                            <option value={institutionForm.type}>{institutionForm.type}</option>
                                        )}
                                        <option value="__CUSTOM__">+ Enter Custom Facility Type...</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        value={institutionForm.phone}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, phone: e.target.value })}
                                        placeholder="Contact phone"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Timings / Working Hours</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={institutionForm.timings}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, timings: e.target.value })}
                                        placeholder="9:00 AM - 4:00 PM"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Address / Location *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={institutionForm.address}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, address: e.target.value })}
                                        placeholder="Main Road, Near Panchayat Office"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Services Provided</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={institutionForm.services}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, services: e.target.value })}
                                        placeholder="OPD, Immunization, Diagnostic checks"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Verification Source *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={institutionForm.source}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, source: e.target.value })}
                                        placeholder="Medical Officer Verification"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Verified Date *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={institutionForm.verified_on}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, verified_on: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select 
                                        className="form-control"
                                        value={institutionForm.status}
                                        onChange={(e) => setInstitutionForm({ ...institutionForm, status: e.target.value })}
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                {institutionForm.id ? 'Save Changes' : 'Add Institution'}
                            </button>
                        </form>
                    </div>
                    )}

                    {/* Institutions Ledger */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Cataloged Public Facilities</h3>
                    <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="ledger-table" style={{ width: '100%', minWidth: '650px' }}>
                            <thead>
                                <tr>
                                    <th>Institution & Type</th>
                                    <th>Address</th>
                                    <th>Timings & Phone</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {institutions.length > 0 ? (
                                    institutions.map(inst => (
                                        <tr key={inst.id}>
                                            <td>
                                                <strong>{inst.name}</strong>
                                                {inst.name_te && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inst.name_te}</div>}
                                                <span className="badge" style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', marginTop: '3px' }}>{inst.type}</span>
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>{inst.address}</td>
                                            <td style={{ fontSize: '0.8125rem' }}>
                                                <div>{inst.timings || 'Regular Hours'}</div>
                                                {inst.phone && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ph: {inst.phone}</div>}
                                            </td>
                                            <td>
                                                <span className={inst.status === 'published' ? 'badge-green' : 'badge-amber'} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {inst.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title={inst.status === 'published' ? 'Unpublish to Draft' : 'Publish'}
                                                    onClick={() => handleToggleStatus('institutions', inst, reloadInstitutions)}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    {inst.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Edit Record"
                                                    onClick={() => { 
                                                        setInstitutionForm(inst); 
                                                        setShowInstitutionForm(true); 
                                                        window.scrollTo({ top: 280, behavior: 'smooth' }); 
                                                    }}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Delete Record"
                                                    onClick={() => deleteItem('institutions', inst.id, reloadInstitutions)}
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No institutions registered yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab: Local Businesses & SHGs */}
            {activeTab === 'businesses' && (
                <div className="survey-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 className="section-title" style={{ margin: 0 }}>Local Businesses & Self-Help Groups</h2>
                            <p className="section-desc" style={{ margin: '4px 0 0' }}>Manage rural enterprises, agricultural tools, electricians, artisans, and women's self-help groups.</p>
                        </div>
                        <button 
                            type="button" 
                            className={showBusinessForm ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}
                            onClick={() => {
                                if (showBusinessForm && businessForm.id) {
                                    setBusinessForm(defaultBusiness);
                                }
                                setShowBusinessForm(!showBusinessForm);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            {showBusinessForm ? (
                                <><ChevronUp size={15} /> Hide Form</>
                            ) : (
                                <><Plus size={15} /> Add New Business</>
                            )}
                        </button>
                    </div>

                    {/* Business Form Card */}
                    {showBusinessForm && (
                        <div className="info-card" style={{ marginTop: '0.75rem', marginBottom: '1.75rem', background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-200)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                                        {businessForm.id ? 'Edit Business' : 'Add New Business / Enterprise'}
                                    </h3>
                                    <span className="badge" style={{ background: businessForm.id ? '#e0f2fe' : '#f1f5f9', color: businessForm.id ? '#0369a1' : '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {businessForm.id ? `Editing ID #${businessForm.id}` : 'New Entry'}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    onClick={() => {
                                        setBusinessForm(defaultBusiness);
                                        setShowBusinessForm(false);
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <ChevronUp size={14} /> Hide Form
                                </button>
                            </div>

                        <form onSubmit={handleSaveBusiness}>
                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Enterprise Name (English) *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={businessForm.name}
                                        onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                                        placeholder="e.g. Sri Lakshmi Motor Rewinding Works"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Enterprise Name (Telugu)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={businessForm.name_te}
                                        onChange={(e) => setBusinessForm({ ...businessForm, name_te: e.target.value })}
                                        placeholder="శ్రీ లక్ష్మి మోటార్ రివైండింగ్ వర్క్స్"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select 
                                        className="form-control"
                                        value={businessForm.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__CUSTOM__') {
                                                const custom = window.prompt('Enter custom business category:');
                                                if (custom && custom.trim()) {
                                                    setBusinessForm({ ...businessForm, category: custom.trim() });
                                                }
                                            } else {
                                                setBusinessForm({ ...businessForm, category: e.target.value });
                                            }
                                        }}
                                    >
                                        {BUSINESS_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        {!BUSINESS_CATEGORIES.includes(businessForm.category) && businessForm.category && (
                                            <option value={businessForm.category}>{businessForm.category}</option>
                                        )}
                                        <option value="__CUSTOM__">+ Enter Custom Category...</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Proprietor / Contact Person</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={businessForm.owner_name}
                                        onChange={(e) => setBusinessForm({ ...businessForm, owner_name: e.target.value })}
                                        placeholder="Owner name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact Phone</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        value={businessForm.phone}
                                        onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                                        placeholder="10-digit mobile number"
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-2">
                                <div className="form-group">
                                    <label className="form-label">Services / Products Offered *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={businessForm.services}
                                        onChange={(e) => setBusinessForm({ ...businessForm, services: e.target.value })}
                                        placeholder="Submersible pump repair, agricultural motor rewinding..."
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Shop Address / Landmark *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={businessForm.address}
                                        onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                                        placeholder="Main Bazaar Road, Opp. Bus Stop"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="choice-grid columns-3">
                                <div className="form-group">
                                    <label className="form-label">Verification Source *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={businessForm.source}
                                        onChange={(e) => setBusinessForm({ ...businessForm, source: e.target.value })}
                                        placeholder="Field Survey Ground Verification"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Verified Date *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={businessForm.verified_on}
                                        onChange={(e) => setBusinessForm({ ...businessForm, verified_on: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select 
                                        className="form-control"
                                        value={businessForm.status}
                                        onChange={(e) => setBusinessForm({ ...businessForm, status: e.target.value })}
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                {businessForm.id ? 'Save Changes' : 'Add Business Record'}
                            </button>
                        </form>
                    </div>
                    )}

                    {/* Businesses Ledger */}
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Cataloged Local Enterprises</h3>
                    <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="ledger-table" style={{ width: '100%', minWidth: '650px' }}>
                            <thead>
                                <tr>
                                    <th>Enterprise & Category</th>
                                    <th>Owner & Phone</th>
                                    <th>Services Offered</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {businesses.length > 0 ? (
                                    businesses.map(b => (
                                        <tr key={b.id}>
                                            <td>
                                                <strong>{b.name}</strong>
                                                {b.name_te && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.name_te}</div>}
                                                <span className="badge" style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#b45309', marginTop: '3px' }}>{b.category}</span>
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>
                                                <div>{b.owner_name || 'Proprietor'}</div>
                                                {b.phone && <a href={`tel:${b.phone}`} style={{ color: 'var(--color-blue-700)' }}>{b.phone}</a>}
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>{b.services}</td>
                                            <td>
                                                <span className={b.status === 'published' ? 'badge-green' : 'badge-amber'} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {b.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title={b.status === 'published' ? 'Unpublish to Draft' : 'Publish'}
                                                    onClick={() => handleToggleStatus('businesses', b, reloadBusinesses)}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    {b.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Edit Record"
                                                    onClick={() => { 
                                                        setBusinessForm(b); 
                                                        setShowBusinessForm(true); 
                                                        window.scrollTo({ top: 280, behavior: 'smooth' }); 
                                                    }}
                                                    style={{ marginRight: '6px' }}
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-sm"
                                                    title="Delete Record"
                                                    onClick={() => deleteItem('businesses', b.id, reloadBusinesses)}
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No local businesses registered yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
