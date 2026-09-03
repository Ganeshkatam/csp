// ==============================================================================
// Village Information Portal — Admin Controller
// Supabase Authentication & CRUD Management for Verified Village Data
// Rules: Zero emojis, explicit verification metadata enforcement.
// ==============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    const authSection = document.getElementById('authSection');
    const adminDashboard = document.getElementById('adminDashboard');
    const authStatus = document.getElementById('authStatus');
    const loginForm = document.getElementById('loginForm');
    const btnLogout = document.getElementById('btnLogout');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const notificationDiv = document.getElementById('adminNotification');

    const client = getSupabaseClient();
    if (!client) {
        authStatus.innerHTML = '<div class="alert alert-danger">Error: Supabase client could not be initialized. Check configuration.</div>';
        return;
    }

    // Tab Switching Logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.style.display = 'block';
        });
    });

    // Check Existing Session
    const { data: { session } } = await client.auth.getSession();
    handleAuthState(session);

    client.auth.onAuthStateChange((_event, newSession) => {
        handleAuthState(newSession);
    });

    function handleAuthState(sess) {
        if (sess && sess.user) {
            authSection.style.display = 'none';
            adminDashboard.style.display = 'block';
            userEmailDisplay.textContent = sess.user.email;
            loadAllAdminData();
        } else {
            authSection.style.display = 'block';
            adminDashboard.style.display = 'none';
            userEmailDisplay.textContent = '';
        }
    }

    // Login Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authStatus.innerHTML = '<div class="alert alert-warning">Authenticating with Supabase...</div>';

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const btnLogin = document.getElementById('btnLogin');

        btnLogin.disabled = true;

        try {
            const { error } = await client.auth.signInWithPassword({ email, password });
            if (error) throw error;
            authStatus.innerHTML = '<div class="alert alert-success">Authentication successful!</div>';
        } catch (err) {
            authStatus.innerHTML = '<div class="alert alert-danger">Login failed: ' + (err.message || 'Check email and password.') + '</div>';
        } finally {
            btnLogin.disabled = false;
        }
    });

    // Logout
    btnLogout.addEventListener('click', async () => {
        await client.auth.signOut();
        notify('Signed out successfully.', 'info');
    });

    function notify(text, type) {
        const cls = type === 'error' ? 'alert-danger' : (type === 'success' ? 'alert-success' : 'alert-warning');
        notificationDiv.innerHTML = '<div class="alert ' + cls + '">' + text + '</div>';
        setTimeout(() => { notificationDiv.innerHTML = ''; }, 4000);
    }

    // ==========================================================================
    // Data Loading Functions
    // ==========================================================================
    function loadAllAdminData() {
        loadVillageProfile();
        loadAnnouncements();
        loadSchemes();
        loadContacts();
        loadInstitutions();
        loadBusinesses();
        loadFeedback();
    }

    // 1. Village Profile
    async function loadVillageProfile() {
        try {
            const { data, error } = await client
                .from('villages')
                .select('*')
                .eq('id', SUPABASE_CONFIG.defaultVillageId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                document.getElementById('vilName').value = data.name || '';
                document.getElementById('vilPanchayat').value = data.gram_panchayat || '';
                document.getElementById('vilMandal').value = data.mandal || '';
                document.getElementById('vilDistrict').value = data.district || '';
                document.getElementById('vilDesc').value = data.description || '';
                document.getElementById('vilSource').value = data.source || '';
                document.getElementById('vilVerifiedOn').value = data.verified_on || '';
            }
        } catch (err) {
            console.error('Failed to load village profile:', err);
        }
    }

    document.getElementById('formVillageProfile').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: SUPABASE_CONFIG.defaultVillageId,
            name: document.getElementById('vilName').value.trim(),
            gram_panchayat: document.getElementById('vilPanchayat').value.trim(),
            mandal: document.getElementById('vilMandal').value.trim(),
            district: document.getElementById('vilDistrict').value.trim(),
            description: document.getElementById('vilDesc').value.trim(),
            source: document.getElementById('vilSource').value.trim(),
            verified_on: document.getElementById('vilVerifiedOn').value,
            updated_at: new Date().toISOString()
        };

        const { error } = await client.from('villages').upsert(payload);
        if (error) {
            notify('Error updating profile: ' + error.message, 'error');
        } else {
            notify('Village profile successfully updated.', 'success');
        }
    });

    // 1.5 Announcements CRUD
    async function loadAnnouncements() {
        const listDiv = document.getElementById('listAnnouncements');
        if (!listDiv) return;
        try {
            const { data, error } = await client.from('announcements').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            if (!data || data.length === 0) {
                listDiv.innerHTML = '<p style="color: var(--color-text-muted);">No announcements published yet.</p>';
                return;
            }

            listDiv.innerHTML = data.map(a => `
                <div class="info-card">
                    <div class="info-card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <span class="badge">${a.category}</span>
                            <span class="badge" style="background-color: ${a.status === 'published' ? '#dcfce7' : (a.status === 'verified' ? '#fef3c7' : '#f1f5f9')}; color: ${a.status === 'published' ? '#15803d' : (a.status === 'verified' ? '#b45309' : '#475569')};">${a.status.toUpperCase()}</span>
                        </div>
                        <h4 class="info-card-title">${a.title}</h4>
                        ${a.title_te ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted);">${a.title_te}</div>` : ''}
                    </div>
                    <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">${a.description}</p>
                    ${a.event_date ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted);"><strong>Event Date:</strong> ${a.event_date}</div>` : ''}
                    <div class="verification-tag">Source: ${a.source} | Verified: ${a.verified_on}</div>
                    <div style="margin-top: 0.75rem;">
                        <button type="button" class="btn btn-secondary btn-delete-ann" data-id="${a.id}" style="min-height: 36px; padding: 0.25rem 0.75rem; font-size: 0.8125rem; color: var(--color-danger);">Delete Announcement</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-delete-ann').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this announcement?')) {
                        const { error } = await client.from('announcements').delete().eq('id', id);
                        if (error) notify('Delete failed: ' + error.message, 'error');
                        else { notify('Announcement deleted.', 'success'); loadAnnouncements(); }
                    }
                });
            });
        } catch (err) {
            listDiv.innerHTML = '<p style="color: var(--color-danger);">Failed to load announcements: ' + err.message + '</p>';
        }
    }

    const formAddAnn = document.getElementById('formAddAnnouncement');
    if (formAddAnn) {
        formAddAnn.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                village_id: SUPABASE_CONFIG.defaultVillageId,
                title: document.getElementById('annTitle').value.trim(),
                title_te: document.getElementById('annTitleTe').value.trim() || null,
                category: document.getElementById('annCategory').value,
                event_date: document.getElementById('annEventDate').value || null,
                description: document.getElementById('annDesc').value.trim(),
                description_te: document.getElementById('annDescTe').value.trim() || null,
                source: document.getElementById('annSource').value.trim(),
                verified_on: document.getElementById('annVerifiedOn').value,
                status: document.getElementById('annStatus').value
            };

            const { error } = await client.from('announcements').insert(payload);
            if (error) notify('Failed to publish announcement: ' + error.message, 'error');
            else {
                notify('Announcement published successfully.', 'success');
                formAddAnn.reset();
                loadAnnouncements();
            }
        });
    }

    // 2. Schemes CRUD
    async function loadSchemes() {
        const listDiv = document.getElementById('listSchemes');
        try {
            const { data, error } = await client.from('schemes').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            if (!data || data.length === 0) {
                listDiv.innerHTML = '<p style="color: var(--color-text-muted);">No schemes registered yet.</p>';
                return;
            }

            listDiv.innerHTML = data.map(s => `
                <div class="info-card">
                    <div class="info-card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <span class="badge">${s.category}</span>
                            <span class="badge" style="background-color: ${s.status === 'published' ? '#dcfce7' : (s.status === 'verified' ? '#fef3c7' : '#f1f5f9')}; color: ${s.status === 'published' ? '#15803d' : (s.status === 'verified' ? '#b45309' : '#475569')};">${s.status.toUpperCase()}</span>
                        </div>
                        <h4 class="info-card-title">${s.name}</h4>
                    </div>
                    <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">${s.description}</p>
                    <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
                        <strong>Documents:</strong> ${s.documents}
                    </div>
                    <div class="verification-tag">Source: ${s.source} | Verified: ${s.verified_on}</div>
                    <div style="margin-top: 0.75rem;">
                        <button type="button" class="btn btn-secondary btn-delete-scheme" data-id="${s.id}" style="min-height: 36px; padding: 0.25rem 0.75rem; font-size: 0.8125rem; color: var(--color-danger);">Delete Scheme</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-delete-scheme').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this scheme record?')) {
                        const { error } = await client.from('schemes').delete().eq('id', id);
                        if (error) notify('Delete failed: ' + error.message, 'error');
                        else { notify('Scheme deleted.', 'success'); loadSchemes(); }
                    }
                });
            });
        } catch (err) {
            listDiv.innerHTML = '<p style="color: var(--color-danger);">Failed to load schemes: ' + err.message + '</p>';
        }
    }

    document.getElementById('formAddScheme').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            village_id: SUPABASE_CONFIG.defaultVillageId,
            name: document.getElementById('schName').value.trim(),
            category: document.getElementById('schCategory').value,
            description: document.getElementById('schDesc').value.trim(),
            eligibility: document.getElementById('schElig').value.trim(),
            documents: document.getElementById('schDocs').value.trim(),
            official_url: document.getElementById('schUrl').value.trim(),
            source: document.getElementById('schSource').value.trim(),
            verified_on: document.getElementById('schVerifiedOn').value,
            status: document.getElementById('schStatus').value
        };

        const { error } = await client.from('schemes').insert(payload);
        if (error) notify('Failed to add scheme: ' + error.message, 'error');
        else {
            notify('Scheme added successfully.', 'success');
            document.getElementById('formAddScheme').reset();
            loadSchemes();
        }
    });

    // 3. Contacts CRUD
    async function loadContacts() {
        const listDiv = document.getElementById('listContacts');
        try {
            const { data, error } = await client.from('contacts').select('*').order('name');
            if (error) throw error;

            if (!data || data.length === 0) {
                listDiv.innerHTML = '<p style="color: var(--color-text-muted);">No contacts listed yet.</p>';
                return;
            }

            listDiv.innerHTML = data.map(c => `
                <div class="info-card">
                    <div class="info-card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <span class="badge ${c.category === 'Emergency' ? 'badge-emergency' : ''}">${c.category}</span>
                            <span class="badge" style="background-color: ${c.status === 'published' ? '#dcfce7' : (c.status === 'verified' ? '#fef3c7' : '#f1f5f9')}; color: ${c.status === 'published' ? '#15803d' : (c.status === 'verified' ? '#b45309' : '#475569')};">${c.status.toUpperCase()}</span>
                        </div>
                        <h4 class="info-card-title">${c.name}</h4>
                        ${c.designation ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted);">${c.designation}</div>` : ''}
                    </div>
                    <p style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary);">${c.phone}</p>
                    ${c.availability ? `<p style="font-size: 0.8125rem;">Hours: ${c.availability}</p>` : ''}
                    <div class="verification-tag">Source: ${c.source} | Verified: ${c.verified_on}</div>
                    <div style="margin-top: 0.75rem;">
                        <button type="button" class="btn btn-secondary btn-delete-contact" data-id="${c.id}" style="min-height: 36px; padding: 0.25rem 0.75rem; font-size: 0.8125rem; color: var(--color-danger);">Delete Contact</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-delete-contact').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this contact record?')) {
                        const { error } = await client.from('contacts').delete().eq('id', id);
                        if (error) notify('Delete failed: ' + error.message, 'error');
                        else { notify('Contact deleted.', 'success'); loadContacts(); }
                    }
                });
            });
        } catch (err) {
            listDiv.innerHTML = '<p style="color: var(--color-danger);">Failed to load contacts: ' + err.message + '</p>';
        }
    }

    document.getElementById('formAddContact').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            village_id: SUPABASE_CONFIG.defaultVillageId,
            name: document.getElementById('conName').value.trim(),
            designation: document.getElementById('conDesignation').value.trim(),
            category: document.getElementById('conCategory').value,
            phone: document.getElementById('conPhone').value.trim(),
            address: document.getElementById('conAddress').value.trim(),
            availability: document.getElementById('conAvailability').value.trim(),
            source: document.getElementById('conSource').value.trim(),
            verified_on: document.getElementById('conVerifiedOn').value,
            status: document.getElementById('conStatus').value
        };

        const { error } = await client.from('contacts').insert(payload);
        if (error) notify('Failed to add contact: ' + error.message, 'error');
        else {
            notify('Contact added successfully.', 'success');
            document.getElementById('formAddContact').reset();
            loadContacts();
        }
    });

    // 4. Institutions CRUD
    async function loadInstitutions() {
        const listDiv = document.getElementById('listInstitutions');
        try {
            const { data, error } = await client.from('institutions').select('*').order('name');
            if (error) throw error;

            if (!data || data.length === 0) {
                listDiv.innerHTML = '<p style="color: var(--color-text-muted);">No institutions listed yet.</p>';
                return;
            }

            listDiv.innerHTML = data.map(inst => `
                <div class="info-card">
                    <div class="info-card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <span class="badge">${inst.type}</span>
                            <span class="badge" style="background-color: ${inst.status === 'published' ? '#dcfce7' : (inst.status === 'verified' ? '#fef3c7' : '#f1f5f9')}; color: ${inst.status === 'published' ? '#15803d' : (inst.status === 'verified' ? '#b45309' : '#475569')};">${inst.status.toUpperCase()}</span>
                        </div>
                        <h4 class="info-card-title">${inst.name}</h4>
                    </div>
                    <p style="font-size: 0.875rem;"><strong>Timings:</strong> ${inst.timings}</p>
                    <p style="font-size: 0.875rem;"><strong>Services:</strong> ${inst.services}</p>
                    ${inst.phone ? `<p style="font-size: 0.875rem;"><strong>Phone:</strong> ${inst.phone}</p>` : ''}
                    <div class="verification-tag">Source: ${inst.source} | Verified: ${inst.verified_on}</div>
                    <div style="margin-top: 0.75rem;">
                        <button type="button" class="btn btn-secondary btn-delete-inst" data-id="${inst.id}" style="min-height: 36px; padding: 0.25rem 0.75rem; font-size: 0.8125rem; color: var(--color-danger);">Delete</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-delete-inst').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this institution?')) {
                        const { error } = await client.from('institutions').delete().eq('id', id);
                        if (error) notify('Delete failed: ' + error.message, 'error');
                        else { notify('Institution deleted.', 'success'); loadInstitutions(); }
                    }
                });
            });
        } catch (err) {
            listDiv.innerHTML = '<p style="color: var(--color-danger);">Failed to load institutions: ' + err.message + '</p>';
        }
    }

    document.getElementById('formAddInstitution').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            village_id: SUPABASE_CONFIG.defaultVillageId,
            name: document.getElementById('instName').value.trim(),
            type: document.getElementById('instType').value,
            address: document.getElementById('instAddress').value.trim(),
            phone: document.getElementById('instPhone').value.trim(),
            timings: document.getElementById('instTimings').value.trim(),
            services: document.getElementById('instServices').value.trim(),
            source: document.getElementById('instSource').value.trim(),
            verified_on: document.getElementById('instVerifiedOn').value,
            status: document.getElementById('instStatus').value
        };

        const { error } = await client.from('institutions').insert(payload);
        if (error) notify('Failed to add institution: ' + error.message, 'error');
        else {
            notify('Institution added successfully.', 'success');
            document.getElementById('formAddInstitution').reset();
            loadInstitutions();
        }
    });

    // 5. Businesses CRUD
    async function loadBusinesses() {
        const listDiv = document.getElementById('listBusinesses');
        try {
            const { data, error } = await client.from('businesses').select('*').order('name');
            if (error) throw error;

            if (!data || data.length === 0) {
                listDiv.innerHTML = '<p style="color: var(--color-text-muted);">No local businesses listed yet.</p>';
                return;
            }

            listDiv.innerHTML = data.map(b => `
                <div class="info-card">
                    <div class="info-card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <span class="badge">${b.category}</span>
                            <span class="badge" style="background-color: ${b.status === 'published' ? '#dcfce7' : (b.status === 'verified' ? '#fef3c7' : '#f1f5f9')}; color: ${b.status === 'published' ? '#15803d' : (b.status === 'verified' ? '#b45309' : '#475569')};">${b.status.toUpperCase()}</span>
                        </div>
                        <h4 class="info-card-title">${b.name}</h4>
                        ${b.owner_name ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted);">Proprietor: ${b.owner_name}</div>` : ''}
                    </div>
                    <p style="font-size: 0.875rem;"><strong>Services:</strong> ${b.services}</p>
                    <p style="font-size: 0.875rem;"><strong>Address:</strong> ${b.address}</p>
                    ${b.phone ? `<p style="font-size: 0.875rem;"><strong>Phone:</strong> ${b.phone}</p>` : ''}
                    <div class="verification-tag">Source: ${b.source} | Verified: ${b.verified_on}</div>
                    <div style="margin-top: 0.75rem;">
                        <button type="button" class="btn btn-secondary btn-delete-biz" data-id="${b.id}" style="min-height: 36px; padding: 0.25rem 0.75rem; font-size: 0.8125rem; color: var(--color-danger);">Delete</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-delete-biz').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this business listing?')) {
                        const { error } = await client.from('businesses').delete().eq('id', id);
                        if (error) notify('Delete failed: ' + error.message, 'error');
                        else { notify('Listing deleted.', 'success'); loadBusinesses(); }
                    }
                });
            });
        } catch (err) {
            listDiv.innerHTML = '<p style="color: var(--color-danger);">Failed to load businesses: ' + err.message + '</p>';
        }
    }

    document.getElementById('formAddBusiness').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            village_id: SUPABASE_CONFIG.defaultVillageId,
            name: document.getElementById('bizName').value.trim(),
            owner_name: document.getElementById('bizOwner').value.trim(),
            category: document.getElementById('bizCategory').value,
            services: document.getElementById('bizServices').value.trim(),
            address: document.getElementById('bizAddress').value.trim(),
            phone: document.getElementById('bizPhone').value.trim(),
            source: document.getElementById('bizSource').value.trim(),
            verified_on: document.getElementById('bizVerifiedOn').value,
            status: document.getElementById('bizStatus').value
        };

        const { error } = await client.from('businesses').insert(payload);
        if (error) notify('Failed to add listing: ' + error.message, 'error');
        else {
            notify('Local business listing added.', 'success');
            document.getElementById('formAddBusiness').reset();
            loadBusinesses();
        }
    });

    // 6. Citizen Feedback
    async function loadFeedback() {
        const listDiv = document.getElementById('listFeedback');
        try {
            const { data, error } = await client.from('citizen_feedback').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            if (!data || data.length === 0) {
                listDiv.innerHTML = '<p style="color: var(--color-text-muted);">No citizen feedback received yet.</p>';
                return;
            }

            listDiv.innerHTML = data.map(fb => `
                <div class="info-card" style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="badge">${fb.feedback_type}</span>
                        <span style="font-size: 0.75rem; color: var(--color-text-muted);">${new Date(fb.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style="margin-top: 0.5rem; font-size: 0.9375rem;">${fb.message}</p>
                    <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.25rem;">
                        Submitted by: ${fb.name || 'Anonymous'} ${fb.phone ? '(' + fb.phone + ')' : ''}
                    </div>
                    <div style="margin-top: 0.5rem; font-weight: 600; font-size: 0.8125rem;">Status: ${fb.status}</div>
                </div>
            `).join('');
        } catch (err) {
            listDiv.innerHTML = '<p style="color: var(--color-danger);">Failed to load feedback: ' + err.message + '</p>';
        }
    }
});
