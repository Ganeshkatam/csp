// ==============================================================================
// Digital Village Information Portal — Core Application Controller
// Architecture: Vanilla JS + Supabase Client + Client-Side Search + i18n
// Principles: High trust, strict verification metadata, offline resilience
// ==============================================================================

(function () {
    'use strict';

    const client = getSupabaseClient();

    // Application State
    let currentVillage = null;
    let allAnnouncements = [];
    let allSchemes = [];
    let allContacts = [];
    let allInstitutions = [];
    let allBusinesses = [];

    let currentFilter = 'ALL';
    let searchQuery = '';

    // Baseline Fallback Data (Realistic Model Andhra Pradesh Habitation)
    const baselineVillage = {
        name: "Kothapalli",
        gram_panchayat: "Kothapalli",
        mandal: "Chandragiri",
        district: "Tirupati",
        state: "Andhra Pradesh",
        description: "Official village habitation profile verified through field investigation and local Gram Panchayat records.",
        source: "Gram Panchayat Records",
        verified_on: "2026-09-01"
    };

    const baselineAnnouncements = [
        {
            id: "a1",
            title: "Gram Panchayat General Body Meeting (Grama Sabha)",
            title_te: "గ్రామ పంచాయతీ సాధారణ సభ (గ్రామసభ)",
            description: "Quarterly Grama Sabha to review village drinking water quality, seasonal crop insurance enrollment, and developmental work approvals.",
            description_te: "తాగునీటి నాణ్యత, పంటల బీమా నమోదు మరియు అభివృద్ధి పనుల సమీక్ష కొరకు త్రైమాసిక గ్రామసభ నిర్వహించబడును.",
            event_date: "2026-09-15",
            category: "Grama Sabha",
            source: "Panchayat Secretary Notice Board",
            verified_on: "2026-09-01",
            status: "published"
        },
        {
            id: "a2",
            title: "Free Non-Communicable Disease (NCD) Health Screening Camp",
            title_te: "ఉచిత రక్తపోటు మరియు మధుమేహ పరీక్షా శిబిరం",
            description: "Mobile medical unit visiting Primary Health Centre to conduct free blood pressure, diabetes screening, and distribute basic medications for senior citizens.",
            description_te: "ప్రాథమిక ఆరోగ్య కేంద్రంలో ఉచిత రక్తపోటు, షుగర్ పరీక్షలు మరియు వృద్ధులకు ఉచిత ఔషధాల పంపిణీ శిబిరం.",
            event_date: "2026-09-20",
            category: "Health Camp",
            source: "PHC Medical Officer Notice",
            verified_on: "2026-09-01",
            status: "published"
        }
    ];

    const baselineContacts = [
        { id: "c1", name: "Gram Panchayat Office", name_te: "గ్రామ పంచాయతీ కార్యాలయం", designation: "Sarpanch / Administration", designation_te: "సర్పంచ్ / పరిపాలన", category: "Administration", phone: "+91-9876543210", availability: "10:00 AM - 05:00 PM (Mon-Sat)", source: "Panchayat Notice Board", verified_on: "2026-09-01" },
        { id: "c2", name: "Primary Health Centre (PHC)", name_te: "ప్రాథమిక ఆరోగ్య కేంద్రం", designation: "Medical Officer / Staff Nurse", designation_te: "వైద్యాధికారి / సిబ్బంది", category: "Healthcare", phone: "+91-9876543211", availability: "09:00 AM - 04:00 PM (Emergency 24x7)", source: "PHC Display Board", verified_on: "2026-09-01" },
        { id: "c3", name: "Electricity Lineman", name_te: "విద్యుత్ లైన్మెన్", designation: "APCPDCL Distribution", designation_te: "విద్యుత్ పంపిణీ సిబ్బంది", category: "Utilities", phone: "+91-9876543212", availability: "06:00 AM - 10:00 PM (Breakdowns 24x7)", source: "Substation Roster", verified_on: "2026-09-01" }
    ];

    const baselineInstitutions = [
        {
            id: "i1",
            name: "Government Primary Health Centre (PHC)",
            name_te: "ప్రభుత్వ ప్రాథమిక ఆరోగ్య కేంద్రం",
            type: "Primary Health Centre",
            address: "Near Panchayat Office, Main Road",
            phone: "+91-9876543211",
            timings: "09:00 AM - 04:00 PM (Mon-Sat)",
            services: "Outpatient Diagnosis, Maternal Immunization, First Aid, Diagnostic Lab",
            services_te: "ఓపీ సేవలు, గర్భిణీ టీకాలు, ప్రథమ చికిత్స, ప్రాథమిక ల్యాబ్ పరీక్షలు",
            source: "Medical Officer Direct Confirmation",
            verified_on: "2026-09-01"
        },
        {
            id: "i2",
            name: "Mandal Parishad Primary School (MPPS)",
            name_te: "మండల పరిషత్ ప్రాథమిక పాఠశాల",
            type: "Primary School",
            address: "School Veedhi, North Ward",
            phone: "+91-9876543213",
            timings: "09:00 AM - 03:30 PM (Mon-Fri)",
            services: "Classes 1 to 5, Mid-Day Meal Programme, Free Textbooks, Drinking Water Facility",
            services_te: "1 నుండి 5 తరగతులు, మధ్యాహ్న భోజన పథకం, ఉచిత పాఠ్యపుస్తకాలు",
            source: "Headmaster Verification",
            verified_on: "2026-09-01"
        }
    ];

    const baselineSchemes = [
        {
            id: "s1",
            name: "PM-Kisan Samman Nidhi",
            name_te: "పీఎం కిసాన్ సమ్మాన్ నిధి",
            category: "Agriculture",
            description: "Financial benefit of Rs. 6,000 per year in three equal installments to all landholding farmer families.",
            description_te: "భూమిగల రైతు కుటుంబాలకు సంవత్సరానికి రూ. 6,000 ఆర్థిక సాయం మూడు విడతల్లో నేరుగా ఖాతాలో జమ.",
            eligibility: "Small and marginal farmers with cultivable land in official land revenue records.",
            eligibility_te: "అధికారిక రెవెన్యూ రికార్డుల్లో సాగుభూమి ఉన్న సన్నకారు రైతులు.",
            documents: "Aadhaar Card, Land Revenue Passbook (1B/Pattadar), Active Bank Passbook",
            documents_te: "ఆధార్ కార్డు, పట్టాదారు పాస్ పుస్తకం (1B), బ్యాంక్ పాస్ పుస్తకం",
            official_url: "https://pmkisan.gov.in",
            source: "Agriculture Officer & PM-Kisan Portal",
            verified_on: "2026-09-01"
        },
        {
            id: "s2",
            name: "Ayushman Bharat PM-JAY",
            name_te: "ఆయుష్మాన్ భారత్ పీఎం-జేవై",
            category: "Health",
            description: "Health insurance cover of up to Rs. 5,00,000 per family per year for secondary and tertiary hospitalization.",
            description_te: "ద్వితీయ మరియు తృతీయ స్థాయి ఆసుపత్రి చికిత్సల కొరకు కుటుంబానికి సంవత్సరానికి రూ. 5,00,000 వరకు ఉచిత ఆరోగ్య బీమా.",
            eligibility: "Deprived rural families identified through socio-economic caste survey criteria.",
            eligibility_te: "సామాజిక-ఆర్థిక సర్వే ప్రమాణాల ప్రకారం అర్హత కలిగిన గ్రామీణ కుటుంబాలు.",
            documents: "Aadhaar Card, Rice Card / Ration Card, Mobile Number linked to Aadhaar",
            documents_te: "ఆధార్ కార్డు, రేషన్ కార్డు, ఆధార్‌తో లింక్ అయిన మొబైల్ నంబర్",
            official_url: "https://pmjay.gov.in",
            source: "National Health Authority Portal",
            verified_on: "2026-09-01"
        }
    ];

    const baselineBusinesses = [
        {
            id: "b1",
            name: "Sri Sai Electrical & Motor Rewinding",
            name_te: "శ్రీ సాయి ఎలక్ట్రికల్ & మోటార్ వైండింగ్",
            owner_name: "T. Ramesh",
            category: "Electrician",
            services: "Borewell motor repairs, domestic wiring, agricultural pump maintenance",
            services_te: "బోర్‌వెల్ మోటార్ మరమ్మతులు, గృహ వైరింగ్, వ్యవసాయ మోటార్ నిర్వహణ",
            address: "Bazaar Center",
            phone: "+91-9876543214",
            source: "Proprietor Direct Interview with Consent",
            verified_on: "2026-09-01"
        },
        {
            id: "b2",
            name: "Pragathi Mahila SHG Handlooms",
            name_te: "ప్రగతి మహిళా స్వయం సహాయక సంఘం",
            owner_name: "K. Bhavani",
            category: "SHG",
            services: "Traditional cotton weaving, tailoring, school uniform stitching",
            services_te: "చేనేత కాటన్ వస్త్రాలు, టైలరింగ్ మరియు పాఠశాల యూనిఫాం తయారీ",
            address: "Weavers Colony",
            phone: "+91-9876543215",
            source: "Village Organization (VO) Meeting Records",
            verified_on: "2026-09-01"
        }
    ];

    // Load Data from Supabase (Strictly published records only)
    async function loadPortalData() {
        if (client && navigator.onLine) {
            try {
                const [vRes, aRes, cRes, iRes, sRes, bRes] = await Promise.all([
                    client.from('villages').select('*').limit(1),
                    client.from('announcements').select('*').eq('status', 'published').order('event_date', { ascending: true }),
                    client.from('contacts').select('*').eq('status', 'published').order('name'),
                    client.from('institutions').select('*').eq('status', 'published').order('name'),
                    client.from('schemes').select('*').eq('status', 'published').order('name'),
                    client.from('businesses').select('*').eq('status', 'published').order('name')
                ]);

                currentVillage = (vRes.data && vRes.data.length > 0) ? vRes.data[0] : baselineVillage;
                allAnnouncements = (aRes.data && aRes.data.length > 0) ? aRes.data : baselineAnnouncements;
                allContacts = (cRes.data && cRes.data.length > 0) ? cRes.data : baselineContacts;
                allInstitutions = (iRes.data && iRes.data.length > 0) ? iRes.data : baselineInstitutions;
                allSchemes = (sRes.data && sRes.data.length > 0) ? sRes.data : baselineSchemes;
                allBusinesses = (bRes.data && bRes.data.length > 0) ? bRes.data : baselineBusinesses;

                // Cache in localStorage for offline performance
                const cacheBundle = {
                    village: currentVillage,
                    announcements: allAnnouncements,
                    contacts: allContacts,
                    institutions: allInstitutions,
                    schemes: allSchemes,
                    businesses: allBusinesses,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('csp_portal_cache_v2', JSON.stringify(cacheBundle));
            } catch (err) {
                console.warn('Supabase fetch failed, reading from local cache:', err);
                loadFromCache();
            }
        } else {
            loadFromCache();
        }

        renderAll();
    }

    function loadFromCache() {
        const cached = localStorage.getItem('csp_portal_cache_v2');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                currentVillage = parsed.village || baselineVillage;
                allAnnouncements = parsed.announcements || baselineAnnouncements;
                allContacts = parsed.contacts || baselineContacts;
                allInstitutions = parsed.institutions || baselineInstitutions;
                allSchemes = parsed.schemes || baselineSchemes;
                allBusinesses = parsed.businesses || baselineBusinesses;
                return;
            } catch (e) {
                console.error('Failed to parse cache:', e);
            }
        }
        currentVillage = baselineVillage;
        allAnnouncements = baselineAnnouncements;
        allContacts = baselineContacts;
        allInstitutions = baselineInstitutions;
        allSchemes = baselineSchemes;
        allBusinesses = baselineBusinesses;
    }

    // Operating Hours Calculation ("Open Now" / "Closed Now" with explicit disclaimer)
    function calculateOpenStatus(timingString) {
        if (!timingString) return null;
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 is Sunday

        // Check for Sunday
        if (currentDay === 0 && !timingString.toLowerCase().includes('sun')) {
            return false;
        }

        // Standard government OPD: 09:00 AM to 04:00 PM (9 to 16)
        if (timingString.includes('09:00') && (timingString.includes('04:00') || timingString.includes('03:30'))) {
            return currentHour >= 9 && currentHour < 16;
        }
        if (timingString.includes('10:00') && timingString.includes('05:00')) {
            return currentHour >= 10 && currentHour < 17;
        }

        return null;
    }

    // Search Matching
    function matchesSearch(item, searchTerms) {
        if (!searchTerms || searchTerms.length === 0) return true;
        const searchCorpus = Object.values(item)
            .filter(v => typeof v === 'string')
            .join(' ')
            .toLowerCase();

        return searchTerms.every(term => searchCorpus.includes(term));
    }

    // Render Functions
    function renderVillageProfile() {
        if (!currentVillage) return;
        const vilName = document.getElementById('displayVillageName');
        const vilHierarchy = document.getElementById('displayVillageHierarchy');
        const vilDesc = document.getElementById('displayVillageDesc');
        const vilVerif = document.getElementById('displayVillageVerification');
        const headerVil = document.getElementById('displayHeaderVillage');
        const headerHier = document.getElementById('displayHeaderHierarchy');

        const nameStr = currentVillage.name;
        const gpStr = currentVillage.gram_panchayat;
        const mandalStr = currentVillage.mandal;
        const distStr = currentVillage.district;

        const profName = document.getElementById('displayProfileName');

        if (vilName) vilName.textContent = `Welcome to ${nameStr} Digital Village Portal`;
        if (vilHierarchy) {
            vilHierarchy.textContent = `${gpStr} Gram Panchayat | ${mandalStr} Mandal | ${distStr} District, ${currentVillage.state || 'Andhra Pradesh'}`;
        }
        if (profName) profName.textContent = `${nameStr} Habitation Master Profile`;
        if (vilDesc) vilDesc.textContent = getLocalized(currentVillage, 'description');
        if (vilVerif) {
            vilVerif.innerHTML = `<span>${t('source')} ${currentVillage.source}</span><span>${t('verifiedOn')} ${currentVillage.verified_on}</span>`;
        }
        if (headerVil) {
            headerVil.textContent = `${nameStr.toUpperCase()} DIGITAL VILLAGE INFORMATION PORTAL`;
        }
        if (headerHier) {
            headerHier.textContent = `${gpStr} Gram Panchayat, ${mandalStr} Mandal`;
        }
    }

    function renderAnnouncements() {
        const container = document.getElementById('containerAnnouncements');
        if (!container) return;

        if (currentFilter !== 'ALL' && currentFilter !== 'announcements') {
            document.getElementById('sectionAnnouncements').style.display = 'none';
            return;
        }
        document.getElementById('sectionAnnouncements').style.display = 'block';

        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const filtered = allAnnouncements.filter(a => matchesSearch(a, terms));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="civic-card" style="grid-column: 1 / -1;">
                    <p style="color: var(--color-text-muted);">${t('noAnnouncements')}</p>
                </div>`;
            return;
        }

        container.innerHTML = filtered.map(a => `
            <div class="civic-card">
                <div>
                    <div class="card-header-row">
                        <span class="badge badge-civic">${a.category || 'Notice'}</span>
                        ${a.event_date ? `<span class="badge" style="background:#e2e8f0; color:#334155;">${t('eventDate')} ${a.event_date}</span>` : ''}
                    </div>
                    <h3 class="card-item-title">${getLocalized(a, 'title')}</h3>
                    <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 0.5rem; line-height: 1.5;">
                        ${getLocalized(a, 'description')}
                    </p>
                </div>
                <div class="card-verify-tag">
                    <span>${t('source')} ${a.source}</span>
                    <span>${t('verifiedOn')} ${a.verified_on}</span>
                </div>
            </div>
        `).join('');
    }

    function renderContacts() {
        const container = document.getElementById('containerContacts');
        if (!container) return;

        if (currentFilter !== 'ALL' && currentFilter !== 'contacts') {
            document.getElementById('sectionContacts').style.display = 'none';
            return;
        }
        document.getElementById('sectionContacts').style.display = 'block';

        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const filtered = allContacts.filter(c => matchesSearch(c, terms));

        if (filtered.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-muted); grid-column: 1 / -1;">No contacts found matching search.</p>`;
            return;
        }

        container.innerHTML = filtered.map(c => `
            <div class="civic-card">
                <div>
                    <div class="card-header-row">
                        <span class="badge ${c.category === 'Emergency' ? 'badge-closed' : 'badge-civic'}">${c.category}</span>
                    </div>
                    <h3 class="card-item-title">${getLocalized(c, 'name')}</h3>
                    ${c.designation ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.2rem;">${getLocalized(c, 'designation')}</div>` : ''}
                    
                    <ul class="card-meta-list">
                        ${c.availability ? `<li class="meta-row"><span class="meta-label">${t('timings')}</span><span class="meta-val">${c.availability}</span></li>` : ''}
                        ${c.address ? `<li class="meta-row"><span class="meta-label">Location:</span><span class="meta-val">${c.address}</span></li>` : ''}
                    </ul>
                </div>
                <div>
                    <a href="tel:${c.phone}" class="btn btn-call-card" aria-label="Call ${c.name}">
                        ${t('callButton')} ${c.phone}
                    </a>
                    <div class="card-verify-tag">
                        <span>${t('source')} ${c.source}</span>
                        <span>${t('verifiedOn')} ${c.verified_on}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderInstitutions() {
        const container = document.getElementById('containerInstitutions');
        if (!container) return;

        if (currentFilter !== 'ALL' && currentFilter !== 'institutions') {
            document.getElementById('sectionInstitutions').style.display = 'none';
            return;
        }
        document.getElementById('sectionInstitutions').style.display = 'block';

        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const filtered = allInstitutions.filter(i => matchesSearch(i, terms));

        if (filtered.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-muted); grid-column: 1 / -1;">${t('noInstitutions')}</p>`;
            return;
        }

        container.innerHTML = filtered.map(inst => {
            const openStatus = calculateOpenStatus(inst.timings);
            return `
            <div class="civic-card">
                <div>
                    <div class="card-header-row">
                        <span class="badge badge-civic">${inst.type}</span>
                        ${openStatus !== null ? `
                            <span class="badge ${openStatus ? 'badge-open' : 'badge-closed'}" title="${t('hoursDisclaimer')}">
                                ${openStatus ? t('openNow') : t('closedNow')}*
                            </span>
                        ` : ''}
                    </div>
                    <h3 class="card-item-title">${getLocalized(inst, 'name')}</h3>
                    <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.25rem;">${inst.address}</div>

                    <ul class="card-meta-list">
                        <li class="meta-row">
                            <span class="meta-label">${t('timings')}</span>
                            <span class="meta-val">${inst.timings}</span>
                            ${openStatus !== null ? `<span style="font-size: 0.6875rem; color: var(--color-text-muted); font-style: italic;">*${t('hoursDisclaimer')}</span>` : ''}
                        </li>
                        <li class="meta-row">
                            <span class="meta-label">${t('services')}</span>
                            <span class="meta-val">${getLocalized(inst, 'services')}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    ${inst.phone ? `
                        <a href="tel:${inst.phone}" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
                            ${t('callButton')} ${inst.phone}
                        </a>
                    ` : ''}
                    <div class="card-verify-tag">
                        <span>${t('source')} ${inst.source}</span>
                        <span>${t('verifiedOn')} ${inst.verified_on}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    function renderSchemes() {
        const container = document.getElementById('containerSchemes');
        if (!container) return;

        if (currentFilter !== 'ALL' && currentFilter !== 'schemes') {
            document.getElementById('sectionSchemes').style.display = 'none';
            return;
        }
        document.getElementById('sectionSchemes').style.display = 'block';

        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const filtered = allSchemes.filter(s => matchesSearch(s, terms));

        if (filtered.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-muted); grid-column: 1 / -1;">${t('noSchemes')}</p>`;
            return;
        }

        container.innerHTML = filtered.map(s => `
            <div class="civic-card">
                <div>
                    <div class="card-header-row">
                        <span class="badge badge-civic">${s.category}</span>
                        <span class="badge badge-verified">${t('verifiedBadge')}</span>
                    </div>
                    <h3 class="card-item-title">${getLocalized(s, 'name')}</h3>
                    <p style="font-size: 0.875rem; color: var(--color-text-main); margin-top: 0.5rem; line-height: 1.5;">
                        ${getLocalized(s, 'description')}
                    </p>

                    <ul class="card-meta-list">
                        <li class="meta-row">
                            <span class="meta-label">${t('eligibility')}</span>
                            <span class="meta-val">${getLocalized(s, 'eligibility')}</span>
                        </li>
                        <li class="meta-row">
                            <span class="meta-label">${t('requiredDocs')}</span>
                            <span class="meta-val">${getLocalized(s, 'documents')}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    ${s.official_url ? `
                        <a href="${s.official_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
                            ${t('officialPortal')}
                        </a>
                    ` : ''}
                    <div class="card-verify-tag">
                        <span>${t('source')} ${s.source}</span>
                        <span>${t('verifiedOn')} ${s.verified_on}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderBusinesses() {
        const container = document.getElementById('containerBusinesses');
        if (!container) return;

        if (currentFilter !== 'ALL' && currentFilter !== 'businesses') {
            document.getElementById('sectionBusinesses').style.display = 'none';
            return;
        }
        document.getElementById('sectionBusinesses').style.display = 'block';

        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const filtered = allBusinesses.filter(b => matchesSearch(b, terms));

        if (filtered.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-muted); grid-column: 1 / -1;">${t('noBusinesses')}</p>`;
            return;
        }

        container.innerHTML = filtered.map(b => `
            <div class="civic-card">
                <div>
                    <div class="card-header-row">
                        <span class="badge badge-civic">${b.category}</span>
                    </div>
                    <h3 class="card-item-title">${getLocalized(b, 'name')}</h3>
                    ${b.owner_name ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.2rem;">${t('proprietor')} ${b.owner_name}</div>` : ''}

                    <ul class="card-meta-list">
                        <li class="meta-row">
                            <span class="meta-label">${t('servicesOffered')}</span>
                            <span class="meta-val">${getLocalized(b, 'services')}</span>
                        </li>
                        <li class="meta-row">
                            <span class="meta-label">Location:</span>
                            <span class="meta-val">${b.address}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    ${b.phone ? `
                        <a href="tel:${b.phone}" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
                            ${t('callButton')} ${b.phone}
                        </a>
                    ` : ''}
                    <div class="card-verify-tag">
                        <span>${t('source')} ${b.source}</span>
                        <span>${t('verifiedOn')} ${b.verified_on}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderAll() {
        renderVillageProfile();
        renderAnnouncements();
        renderContacts();
        renderInstitutions();
        renderSchemes();
        renderBusinesses();
    }

    // Search and Filter Setup
    function setupSearchAndFilters() {
        const searchInput = document.getElementById('globalSearchInput');
        const clearBtn = document.getElementById('btnClearSearch');
        const filterPills = document.querySelectorAll('.filter-pill');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderAll();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                renderAll();
            });
        }

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilter = pill.getAttribute('data-filter');
                renderAll();
            });
        });
    }

    // Text Zoom Controls (Accessibility)
    function setupTextZoom() {
        const btnZoomSmall = document.getElementById('btnZoomSmall');
        const btnZoomLarge = document.getElementById('btnZoomLarge');

        if (btnZoomSmall) {
            btnZoomSmall.addEventListener('click', () => {
                document.documentElement.style.setProperty('--base-font-size', '16px');
                localStorage.setItem('csp_font_size', '16px');
            });
        }

        if (btnZoomLarge) {
            btnZoomLarge.addEventListener('click', () => {
                document.documentElement.style.setProperty('--base-font-size', '18px');
                localStorage.setItem('csp_font_size', '18px');
            });
        }

        const savedSize = localStorage.getItem('csp_font_size');
        if (savedSize) {
            document.documentElement.style.setProperty('--base-font-size', savedSize);
        }
    }

    // Dynamic QR Code pointing to current deployed URL
    function setupQrCode() {
        const qrImg = document.getElementById('qrImage');
        const urlDisplay = document.getElementById('displayCurrentUrl');
        if (qrImg && urlDisplay) {
            const currentUrl = window.location.href.split('#')[0];
            urlDisplay.textContent = currentUrl;
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
        }
    }

    // Feedback Form Submission
    function setupFeedbackForm() {
        const form = document.getElementById('formCitizenFeedback');
        const alertBox = document.getElementById('feedbackAlert');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btnSubmitFeedback');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const payload = {
                village_id: SUPABASE_CONFIG.defaultVillageId,
                name: document.getElementById('fbName').value.trim() || 'Anonymous Resident',
                phone: document.getElementById('fbPhone').value.trim() || null,
                feedback_type: document.getElementById('fbType').value,
                message: document.getElementById('fbMessage').value.trim(),
                status: 'Pending'
            };

            try {
                if (!client) throw new Error('Supabase client unavailable');
                const { error } = await client.from('citizen_feedback').insert(payload);
                if (error) throw error;

                alertBox.style.display = 'block';
                alertBox.className = 'badge badge-open';
                alertBox.style.padding = '0.75rem 1rem';
                alertBox.style.width = '100%';
                alertBox.textContent = t('feedbackSuccess');
                form.reset();
            } catch (err) {
                alertBox.style.display = 'block';
                alertBox.className = 'badge badge-closed';
                alertBox.style.padding = '0.75rem 1rem';
                alertBox.style.width = '100%';
                alertBox.textContent = t('feedbackError') + ' (' + err.message + ')';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = t('btnSubmitFeedback');
            }
        });
    }

    // Re-render when language changes
    document.addEventListener('languageChanged', () => {
        renderAll();
    });

    // Bootstrapping
    document.addEventListener('DOMContentLoaded', () => {
        setupSearchAndFilters();
        setupTextZoom();
        setupQrCode();
        setupFeedbackForm();
        loadPortalData();
    });

})();
