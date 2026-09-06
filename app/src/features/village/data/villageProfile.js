/**
 * Authoritative Village Profile & Baseline Data for Modavalasa
 * Provenance-Gated Dataset combining:
 * 1. Official Census of India 2011 Primary Census Abstract (PCA)
 * 2. Official Administrative Jurisdictions (ECI & Revenue Records)
 * 3. Verified Local Public Institutions
 * 4. Community Service Project (CSP) Empirical Field Survey
 *
 * Strictly adheres to zero emojis and explicit evidence classification.
 */

export const CENSUS_2011_BASELINE = {
    censusVillageCode: '583218',
    subDistrictCode: '04839', // Denkada Sub-District
    districtCode: '543',     // Vizianagaram District
    stateCode: '28',        // Andhra Pradesh
    villageName: 'Modavalasa',
    villageNameTe: 'మోదవలస',
    population: 2584,
    malePopulation: 1290,
    femalePopulation: 1294,
    households: 624,
    areaHectares: 633,
    areaAcres: 1564,
    sexRatio: 1003, // Females per 1000 Males (1,294 / 1,290)
    pin: '531162',
    postalNetwork: {
        branchPostOffice: 'Modavalasa B.O.',
        subPostOffice: 'Chittivalasa S.O.',
        headPostOffice: 'Denkada S.O. (535006) / Vizianagaram H.O.',
        postalDivision: 'Visakhapatnam Division',
        pincode: '531162',
        note: 'Postal network routing (Chittivalasa S.O. / Visakhapatnam Division) operates under PIN 531162; civil administration belongs to Denkada Mandal, Vizianagaram District.'
    },
    provenance: {
        source: 'Census of India 2011 (Village Code: 583218) & India Post Directory',
        sourceTe: 'భారత ప్రభుత్వం సెన్సస్ 2011 (గ్రామ కోడ్: 583218) మరియు ఇండియా పోస్ట్ డైరెక్టరీ',
        evidenceClass: 'Census of India 2011 & India Post',
        evidenceClassTe: 'సెన్సస్ 2011 & ఇండియా పోస్ట్ అధికారికం'
    }
};

export const ADMINISTRATIVE_JURISDICTION = {
    gramPanchayat: 'Modavalasa',
    gramPanchayatTe: 'మోదవలస',
    mandal: 'Denkada',
    mandalTe: 'డెంకాడ',
    revenueDivision: 'Vizianagaram',
    revenueDivisionTe: 'విజయనగరం',
    district: 'Vizianagaram',
    districtTe: 'విజయనగరం',
    state: 'Andhra Pradesh',
    stateTe: 'ఆంధ్రప్రదేశ్',
    assemblyConstituency: 'Nellimarla (136)',
    assemblyConstituencyTe: 'నెల్లిమర్ల (136)',
    parliamentaryConstituency: 'Vizianagaram',
    parliamentaryConstituencyTe: 'విజయనగరం',
    localOffice: 'Modavalasa Grama Sachivalayam',
    localOfficeTe: 'మోదవలస గ్రామ సచివాలయం',
    provenance: {
        evidenceClass: 'Official Administrative Record',
        evidenceClassTe: 'అధికారిక పాలనా రికార్డు',
        source: 'AP Panchayati Raj, Revenue Department & ECI Delimitation Order',
        sourceTe: 'పంచాయతీ రాజ్, రెవెన్యూ శాఖ మరియు ఈసీఐ డీలిమిటేషన్ ఉత్తర్వులు'
    }
};

export const LIVELIHOOD_PROFILE = {
    primaryOccupations: ['Agriculture', 'Handloom Weaving', 'Dairy Farming', 'Local Services'],
    primaryOccupationsTe: ['వ్యవసాయం', 'చేనేత వృత్తి', 'పాడి పరిశ్రమ', 'స్థానిక సేవలు'],
    summaryEn: 'Community-survey findings indicate a dual agrarian and artisanal economic base, characterized by paddy cultivation, traditional handloom weaving clusters, and local dairy cooperatives.',
    summaryTe: 'కమ్యూనిటీ సర్వే పరిశీలనల ప్రకారం గ్రామంలో వరి సాగు చేసే రైతులు, సాంప్రదాయ చేనేత మగ్గాలు మరియు పాడి పరిశ్రమ ప్రధాన జీవనాధారాలుగా ఉన్నాయి.',
    keyPoints: [
        {
            title: 'Agrarian Base',
            titleTe: 'వ్యవసాయ రంగం',
            desc: 'Paddy cultivation, pulses, and seasonal commercial crops.',
            descTe: 'వరి, పప్పుధాన్యాలు మరియు వాణిజ్య పంటల సాగు.'
        },
        {
            title: 'Handloom Artisan Clusters',
            titleTe: 'చేనేత వృత్తి క్లస్టర్లు',
            desc: 'Traditional handloom weaving looms and weaver self-help groups (SHGs) in BC Colony.',
            descTe: 'బీసీ కాలనీలోని సాంప్రదాయ చేనేత మగ్గాలు మరియు మహిళా స్వయం సహాయక సంఘాలు.'
        },
        {
            title: 'Rural Micro-Enterprises',
            titleTe: 'గ్రామీణ సూక్ష్మ వ్యాపారాలు',
            desc: 'Community dairy centers, motor rewinding and pump repair workshops, and local trade.',
            descTe: 'పాడి కేంద్రాలు, మోటార్ రీవైండింగ్, పంప్ రిపేర్ వర్క్‌షాప్‌లు మరియు వ్యాపారాలు.'
        }
    ],
    provenance: {
        evidenceClass: 'Community Survey Finding',
        evidenceClassTe: 'కమ్యూనిటీ సర్వే పరిశీలన',
        source: 'CSP Field Survey & Community Interviews (Aug 2024)',
        sourceTe: 'సీఎస్పీ క్షేత్రస్థాయి సర్వే మరియు స్థానిక పరిశీలనలు (ఆగస్టు 2024)'
    }
};

export const INSTITUTIONAL_FACILITIES = {
    phc: {
        name: 'Denkada Primary Health Centre (PHC)',
        nameTe: 'డెంకాడ ప్రాథమిక ఆరోగ్య కేంద్రం (PHC)',
        role: 'Serving Primary Health Centre providing outpatient consultations, diagnostic services, and emergency support.',
        roleTe: 'ఓపీడీ వైద్య పరీక్షలు, రక్త పరీక్షలు మరియు అత్యవసర సేవలు అందించే సేవా కేంద్రం.'
    },
    outreach: {
        name: 'Community Health Outreach',
        nameTe: 'గ్రామ ఆరోగ్య సేవలు',
        role: 'Preventive health outreach by ANM, ASHA workers, and Anganwadi team, covering immunization and NCD screening.',
        roleTe: 'ఏఎన్ఎం, ఆశా కార్యకర్తలు మరియు అంగన్‌వాడీ ద్వారా టీకాలు మరియు ఆరోగ్య స్క్రీనింగ్ సేవలు.'
    },
    schools: {
        name: 'MPPS Modavalasa & Anganwadi',
        nameTe: 'ఎంపీపీఎస్ మోదవలస & అంగన్‌వాడీ',
        role: 'Mandal Parishad Primary School providing elementary education and mid-day meals; Anganwadi for early childhood nutrition.',
        roleTe: 'మధ్యాహ్న భోజనంతో ప్రాథమిక విద్య అందించే ఎంపీపీఎస్ పాఠశాల మరియు పౌష్టికాహారం అందించే అంగన్‌వాడీ.'
    },
    provenance: {
        evidenceClass: 'Verified Local Institution',
        evidenceClassTe: 'ధృవీకరించబడిన స్థానిక సంస్థ',
        source: 'District Administration & Health Department Directory',
        sourceTe: 'జిల్లా పరిపాలన మరియు వైద్య ఆరోగ్య శాఖ డైరెక్టరీ'
    }
};

export const CIVIC_INFRASTRUCTURE = {
    drinkingWater: {
        title: 'Drinking Water Supply',
        titleTe: 'తాగునీటి సరఫరా',
        desc: 'RO water purification plant and overhead reservoir observed during CSP field survey.',
        descTe: 'ఆర్వో శుద్ధి ప్లాంట్ మరియు ఓవర్‌హెడ్ రిజర్వాయర్ సౌకర్యం (సర్వేలో పరిశీలించబడింది).'
    },
    electricity: {
        title: 'Rural Electricity Grid (APEPDCL)',
        titleTe: 'గ్రామీణ విద్యుత్ సరఫరా (APEPDCL)',
        desc: 'Electrification grid operated under APEPDCL (Vizianagaram Circle) with scheduled power rosters for agriculture and 24x7 toll-free breakdown helpline 1912.',
        descTe: 'ఏపీఈపీడీసీఎల్ (విజయనగరం సర్కిల్) పరిధిలోని విద్యుత్ సరఫరా, వ్యవసాయ షెడ్యూల్డ్ రోస్టర్ మరియు 24 గంటల టోల్ ఫ్రీ హెల్ప్‌లైన్ 1912.'
    },
    internalRoads: {
        title: 'Internal Residential Roads',
        titleTe: 'అంతర్గత రహదారులు',
        desc: 'Internal cement concrete (CC) residential roadways connecting habitation lanes.',
        descTe: 'నివాస వీధులను కలిపే అంతర్గత సిమెంట్ కాంక్రీట్ (CC) రహదారులు.'
    },
    connectivity: {
        title: 'Regional Road Connectivity',
        titleTe: 'ప్రాంతీయ రహదారి అనుసంధానం',
        desc: 'Connected by all-weather roads to Denkada Mandal headquarters and Vizianagaram.',
        descTe: 'డెంకాడ మండల కేంద్రం మరియు విజయనగరం పట్టణానికి అన్ని కాలాల్లో ప్రయాణించదగిన పక్కా రహదారి అనుసంధానం.'
    },
    provenance: {
        evidenceClass: 'CSP Field Survey Observation',
        evidenceClassTe: 'సీఎస్పీ క్షేత్రస్థాయి పరిశీలన',
        source: 'CSP Ground Survey Log (Aug 2024)',
        sourceTe: 'సీఎస్పీ క్షేత్ర పరిశీలనల రికార్డు (ఆగస్టు 2024)'
    }
};

export const PROVENANCE_DISCLAIMER = {
    en: 'Source: Census of India 2011 (Village Code: 583218) and verified local civic records. Census statistics are reported for the Census village unit; community-survey findings are identified separately. Last verified: September 2026.',
    te: 'సమాచార మూలం: భారత ప్రభుత్వం సెన్సస్ 2011 (గ్రామ కోడ్: 583218) మరియు ధృవీకరించిన స్థానిక పాలనా రికార్డులు. సెన్సస్ గణాంకాలు అధికారిక గ్రామ యూనిట్ పరంగా ఉన్నాయి; కమ్యూనిటీ సర్వే మరియు క్షేత్ర పరిశీలనలు విడిగా గుర్తించబడ్డాయి. చివరి ధృవీకరణ: సెప్టెంబర్ 2026.'
};
