/**
 * Selected Diagnostic & Screening Services Reference Data
 * Standards Reference: Indian Public Health Standards (IPHS) / National Health Mission
 * Facility-specific availability: Tagged individually based on Denkada PHC field observations & notice board records
 */

export const DIAGNOSTIC_SERVICES_REFERENCE = {
    standardSource: "Indian Public Health Standards (IPHS) & National Health Mission (NHM)",
    facilitySource: "PHC Denkada Notice Board & Field Verification (Aug 2024)",
    reviewedOn: "September 2026",
    disclaimer: {
        en: "This catalog reflects standard public-health diagnostic services. On-site availability at Denkada PHC is tagged individually based on verified field records. For items marked 'Verify Locally', please confirm reagent and technician availability with the PHC duty desk before visiting.",
        te: "ఈ జాబితా ప్రాథమిక ఆరోగ్య కేంద్రాలలో అందుబాటులో ఉండే నిర్ధారణ పరీక్షల ప్రమాణాలను చూపుతుంది. డెంకాడ పిహెచ్‌సిలో అందుబాటును పరిశీలించి నమోదు చేసాము. 'స్థానికంగా నిర్ధారించుకోండి' అని ఉన్న పరీక్షలకు వెళ్లే ముందు ల్యాబ్ సిబ్బందిని సంప్రదించండి."
    },
    services: [
        {
            id: "bp",
            name_en: "Blood Pressure Measurement",
            name_te: "రక్తపోటు (బీపీ) పరీక్ష",
            category: "Screening",
            method_en: "Sphygmomanometer / Validated Digital Monitor",
            method_te: "డిజిటల్ మానిటర్ / బిపి యంత్రం",
            purpose_en: "Detection of hypertension and cardiovascular risk",
            purpose_te: "అధిక రక్తపోటు, గుండె సంబంధిత ముప్పు గుర్తింపు",
            facilityStatus: "AVAILABLE",
            facilityStatusText_en: "Available at PHC",
            facilityStatusText_te: "పిహెచ్‌సిలో అందుబాటులో ఉంది",
            sourceTag: "PHC Facility Record"
        },
        {
            id: "hb",
            name_en: "Hemoglobin (Hb%) Estimation",
            name_te: "రక్తహీనత (హీమోగ్లోబిన్) పరీక్ష",
            category: "Laboratory",
            method_en: "Sahli's Hemoglobinometer / Digital Hemocue",
            method_te: "డిజిటల్ హీమోక్యూ / పద్ధతి",
            purpose_en: "Diagnosis of anemia in pregnant women, children, and adults",
            purpose_te: "గర్భిణీ స్త్రీలు, పిల్లలలో రక్తహీనత నిర్ధారణ",
            facilityStatus: "AVAILABLE",
            facilityStatusText_en: "Available at PHC",
            facilityStatusText_te: "పిహెచ్‌సిలో అందుబాటులో ఉంది",
            sourceTag: "PHC Facility Record"
        },
        {
            id: "rbs",
            name_en: "Random Blood Sugar (RBS)",
            name_te: "రక్తంలో చక్కెర (షుగర్) పరీక్ష",
            category: "Laboratory",
            method_en: "Glucometer with test strips",
            method_te: "గ్లూకోమీటర్ స్ట్రిప్స్ ద్వారా",
            purpose_en: "Diabetes mellitus screening and immediate glycemic monitoring",
            purpose_te: "మధుమేహం (డయాబెటిస్) తక్షణ స్క్రీనింగ్",
            facilityStatus: "AVAILABLE",
            facilityStatusText_en: "Available at PHC",
            facilityStatusText_te: "పిహెచ్‌సిలో అందుబాటులో ఉంది",
            sourceTag: "PHC Facility Record"
        },
        {
            id: "urine",
            name_en: "Urine Albumin & Sugar",
            name_te: "మూత్ర పరీక్ష (అల్బుమిన్ & షుగర్)",
            category: "Laboratory",
            method_en: "Multi-parameter dry reagent dipsticks",
            method_te: "డిప్‌స్టిక్ రీజెంట్ పరీక్ష",
            purpose_en: "Detection of proteinuria, pre-eclampsia in ANC, and kidney stress",
            purpose_te: "మూత్రంలో ప్రోటీన్, గర్భధారణ సమస్యలు, మూత్రపిండాల ఒత్తిడి గుర్తింపు",
            facilityStatus: "AVAILABLE",
            facilityStatusText_en: "Available at PHC",
            facilityStatusText_te: "పిహెచ్‌సిలో అందుబాటులో ఉంది",
            sourceTag: "PHC Facility Record"
        },
        {
            id: "upt",
            name_en: "Pregnancy Detection Test (UPT)",
            name_te: "గర్భధారణ నిర్ధారణ పరీక్ష (UPT)",
            category: "Laboratory",
            method_en: "Rapid hCG urine test card (Nishchay kit)",
            method_te: "నిశ్చయ్ ర్యాపిడ్ కిట్ కార్డు",
            purpose_en: "Early confirmation of pregnancy for timely antenatal registration",
            purpose_te: "సకాలంలో ప్రసవపూర్వ సంరక్షణ (ANC) కొరకు గర్భధారణ నిర్ధారణ",
            facilityStatus: "AVAILABLE",
            facilityStatusText_en: "Available at PHC",
            facilityStatusText_te: "పిహెచ్‌సిలో అందుబాటులో ఉంది",
            sourceTag: "PHC Facility Record"
        },
        {
            id: "malaria",
            name_en: "Malaria Rapid Diagnostic Test (RDT)",
            name_te: "మలేరియా ర్యాపిడ్ టెస్ట్ (RDT)",
            category: "Laboratory",
            method_en: "Antigen-based rapid test cassette / blood smear",
            method_te: "యాంటిజెన్ ర్యాపిడ్ కిట్ / రక్త నమూనా",
            purpose_en: "Rapid differentiation of P. falciparum and P. vivax in febrile cases",
            purpose_te: "జ్వరం వచ్చినప్పుడు మలేరియా పరాన్నజీవి గుర్తింపు",
            facilityStatus: "VERIFY_LOCALLY",
            facilityStatusText_en: "Verify Locally at PHC Desk",
            facilityStatusText_te: "ల్యాబ్ వద్ద స్టాక్ నిర్ధారించుకోండి",
            sourceTag: "Subject to Kit Stock"
        },
        {
            id: "dengue",
            name_en: "Dengue NS1 / IgM Rapid Screening",
            name_te: "డెంగ్యూ ప్రాథమిక స్క్రీనింగ్",
            category: "Laboratory",
            method_en: "Immuno-chromatographic card test / CHC referral",
            method_te: "ర్యాపిడ్ కార్డ్ / సిహెచ్‌సి లింకేజ్",
            purpose_en: "Early screening for suspected dengue viral infection",
            purpose_te: "తీవ్ర జ్వరం ఉన్నప్పుడు డెంగ్యూ లక్షణాల తనిఖీ",
            facilityStatus: "VERIFY_LOCALLY",
            facilityStatusText_en: "Verify Locally at PHC / CHC",
            facilityStatusText_te: "పిహెచ్‌సి / సిహెచ్‌సి వద్ద నిర్ధారించుకోండి",
            sourceTag: "Subject to Seasonal Protocol"
        },
        {
            id: "hiv",
            name_en: "HIV Screening & Counselling Linkage",
            name_te: "హెచ్ఐవి స్క్రీనింగ్ & కౌన్సెలింగ్ లింకేజ్",
            category: "Laboratory",
            method_en: "Rapid whole blood test with ICTC referral",
            method_te: "ర్యాపిడ్ రక్త పరీక్ష / ICTC లింక్",
            purpose_en: "Voluntary confidential screening and prevention of parent-to-child transmission",
            purpose_te: "రహస్య స్క్రీనింగ్ మరియు తల్లి నుండి బిడ్డకు సంక్రమణ నివారణ",
            facilityStatus: "LINKAGE",
            facilityStatusText_en: "ICTC Linkage / Verify Locally",
            facilityStatusText_te: "ఐసిటిసి లింకేజ్ / స్థానికంగా నిర్ధారించుకోండి",
            sourceTag: "ICTC Protocol"
        },
        {
            id: "tb_sputum",
            name_en: "Sputum Collection for Tuberculosis (TB)",
            name_te: "క్షయ వ్యాధి (టిబి) కఫం నమూనా సేకరణ",
            category: "Laboratory",
            method_en: "AFB microscopy collection / CBNAAT referral to District TB Center",
            method_te: "కఫం సేకరణ / జిల్లా టిబి కేంద్రానికి లింకేజ్",
            purpose_en: "Diagnosis of pulmonary tuberculosis under National TB Elimination Programme",
            purpose_te: "జాతీయ క్షయ నిర్మూలన పథకం కింద టిబి నిర్ధారణ",
            facilityStatus: "LINKAGE",
            facilityStatusText_en: "Sample Collection / Linkage to DMC",
            facilityStatusText_te: "నమూనా సేకరణ / DMC లింకేజ్",
            sourceTag: "NTEP Referral"
        },
        {
            id: "blood_group",
            name_en: "Blood Grouping & Rh Typing",
            name_te: "రక్త గ్రూప్ మరియు Rh పరీక్ష",
            category: "Laboratory",
            method_en: "Slide agglutination with Anti-A, Anti-B, Anti-D antisera",
            method_te: "స్లైడ్ అగ్లూటినేషన్ పద్ధతి",
            purpose_en: "Emergency obstetric preparedness and blood compatibility record",
            purpose_te: "అత్యవసర ప్రసవ సన్నద్ధత కొరకు రక్త గ్రూప్ నమోదు",
            facilityStatus: "VERIFY_LOCALLY",
            facilityStatusText_en: "Verify Locally at PHC",
            facilityStatusText_te: "రీజెంట్ అందుబాటు నిర్ధారించుకోండి",
            sourceTag: "Reagent Dependent"
        },
        {
            id: "vision",
            name_en: "Visual Acuity Screening",
            name_te: "ప్రాథమిక దృష్టి పరీక్ష",
            category: "Screening",
            method_en: "Snellen chart / E-chart at 6-meter distance",
            method_te: "స్నెల్లెన్ చార్ట్ ద్వారా పరీక్ష",
            purpose_en: "Refractive error detection and cataract referral for seniors and school children",
            purpose_te: "దృష్టి లోపాలు, శుక్లాలు (కంటి సమస్యలు) ప్రాథమిక గుర్తింపు",
            facilityStatus: "AVAILABLE",
            facilityStatusText_en: "Periodic School & Camp Screening",
            facilityStatusText_te: "పాఠశాల & శిబిరాల సమయంలో లభ్యం",
            sourceTag: "Camp & Routine Schedule"
        }
    ]
};
