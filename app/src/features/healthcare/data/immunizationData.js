/**
 * National Immunization Schedule (NIS) Reference Data
 * Source: Ministry of Health and Family Welfare (MoHFW), Government of India
 * Standard: Routine Immunization Guidelines for Health Workers
 * Note: JE is administered only in selected endemic districts as notified by the Government.
 */

export const IMMUNIZATION_REFERENCE = {
    source: "Ministry of Health & Family Welfare (MoHFW), Government of India",
    standard: "Universal Immunization Programme (UIP) National Schedule",
    reviewedOn: "September 2026",
    disclaimer: {
        en: "This schedule reflects standard Government of India routine immunization guidelines. It is published for public awareness and does not replace a child's official Mother and Child Protection (MCP) card or clinical guidance from an Auxiliary Nurse Midwife (ANM) or medical officer.",
        te: "ఈ టీకాల పట్టిక భారత ప్రభుత్వ సాధారణ టీకా మార్గదర్శకాలపై ఆధారపడి పౌర అవగాహన కొరకు ప్రచురించబడింది. ఇది అధికారిక తల్లి-పిల్లల సంరక్షణ (MCP) కార్డుకు లేదా ఏఎన్ఎం/వైద్యాధికారి సలహాకు ప్రత్యామ్నాయం కాదు."
    },
    milestones: [
        {
            age_en: "At Birth",
            age_te: "పుట్టిన వెంటనే",
            vaccines_en: "BCG, bOPV-0, Hepatitis B (Birth dose)",
            vaccines_te: "బిసిజి (BCG), బిఓపివి-0 (bOPV-0), హెపటైటిస్ బి (జనన మోతాదు)",
            route_en: "Intradermal, Oral, Intramuscular",
            route_te: "చర్మం లోపలికి, నోటి ద్వారా, కండరానికి",
            prevention_en: "Childhood Tuberculosis, Poliomyelitis, Hepatitis B infection",
            prevention_te: "క్షయ వ్యాధి, పోలియో, కాలేయ సంబంధిత హెపటైటిస్ బి",
            notes_en: "Administer within 24 hours of birth",
            notes_te: "జన్మించిన 24 గంటల లోపు ఇవ్వాలి"
        },
        {
            age_en: "6 Weeks",
            age_te: "6 వారాలు",
            vaccines_en: "Pentavalent-1, bOPV-1, RVV-1, fIPV-1, PCV-1",
            vaccines_te: "పెంటావాలెంట్-1, బిఓపివి-1, రోటావైరస్ (RVV-1), ఎఫ్ఐపివి-1 (fIPV-1), పిసివి-1 (PCV-1)",
            route_en: "Intramuscular, Oral, Intradermal",
            route_te: "కండరానికి, నోటి ద్వారా, చర్మం లోపలికి",
            prevention_en: "Diphtheria, Pertussis, Tetanus, Hep B, Hib, Polio, Rotavirus Diarrhea, Pneumococcal Disease",
            prevention_te: "కంఠసర్పి, కోరింత దగ్గు, ధనుర్వాతం, హెపటైటిస్ బి, హిబ్ న్యుమోనియా, పోలియో, రోటా డయేరియా, న్యుమోనియా",
            notes_en: "Primary immunization milestone 1",
            notes_te: "ప్రాథమిక రోగనిరోధక టీకా మోతాదు 1"
        },
        {
            age_en: "10 Weeks",
            age_te: "10 వారాలు",
            vaccines_en: "Pentavalent-2, bOPV-2, RVV-2",
            vaccines_te: "పెంటావాలెంట్-2, బిఓపివి-2, రోటావైరస్ (RVV-2)",
            route_en: "Intramuscular, Oral",
            route_te: "కండరానికి, నోటి ద్వారా",
            prevention_en: "Diphtheria, Pertussis, Tetanus, Hep B, Hib, Polio, Rotavirus Diarrhea",
            prevention_te: "కంఠసర్పి, కోరింత దగ్గు, ధనుర్వాతం, హెపటైటిస్ బి, హిబ్ న్యుమోనియా, పోలియో, రోటా డయేరియా",
            notes_en: "Primary immunization milestone 2",
            notes_te: "ప్రాథమిక రోగనిరోధక టీకా మోతాదు 2"
        },
        {
            age_en: "14 Weeks",
            age_te: "14 వారాలు",
            vaccines_en: "Pentavalent-3, bOPV-3, RVV-3, fIPV-2, PCV-2",
            vaccines_te: "పెంటావాలెంట్-3, బిఓపివి-3, రోటావైరస్ (RVV-3), ఎఫ్ఐపివి-2 (fIPV-2), పిసివి-2 (PCV-2)",
            route_en: "Intramuscular, Oral, Intradermal",
            route_te: "కండరానికి, నోటి ద్వారా, చర్మం లోపలికి",
            prevention_en: "Full primary coverage against 8 major preventable diseases",
            prevention_te: "8 ప్రధాన ప్రాణాంతక వ్యాధుల నుండి పూర్తి ప్రాథమిక రక్షణ",
            notes_en: "Completes primary infant series",
            notes_te: "శిశు ప్రాథమిక టీకా దశ పూర్తి"
        },
        {
            age_en: "9 - 12 Months",
            age_te: "9 నుండి 12 నెలలు",
            vaccines_en: "MR-1, PCV Booster, Vitamin A (Dose 1), JE-1*",
            vaccines_te: "ఎంఆర్-1 (MR-1), పిసివి బూస్టర్, విటమిన్ ఎ (మోతాదు 1), జేఈ-1 (JE-1)*",
            route_en: "Subcutaneous, Intramuscular, Oral",
            route_te: "చర్మం కింద, కండరానికి, నోటి ద్వారా",
            prevention_en: "Measles, Rubella, Pneumonia, Night Blindness, Japanese Encephalitis",
            prevention_te: "తట్టు (మీజిల్స్), రుబెల్లా, న్యుమోనియా, రేచీకటి, మెదడువాపు వ్యాధి",
            notes_en: "*JE-1: Where included in the National Immunization Schedule for applicable endemic districts",
            notes_te: "*జేఈ-1: ప్రభుత్వంచే గుర్తించబడిన ఎండెమిక్ ప్రాంతాలలో మాత్రమే వర్తిస్తుంది"
        },
        {
            age_en: "16 - 24 Months",
            age_te: "16 నుండి 24 నెలలు",
            vaccines_en: "MR-2, DPT Booster-1, bOPV Booster, Vitamin A (Dose 2), JE-2*",
            vaccines_te: "ఎంఆర్-2 (MR-2), డిపిటి బూస్టర్-1, బిఓపివి బూస్టర్, విటమిన్ ఎ (మోతాదు 2), జేఈ-2 (JE-2)*",
            route_en: "Subcutaneous, Intramuscular, Oral",
            route_te: "చర్మం కింద, కండరానికి, నోటి ద్వారా",
            prevention_en: "Reinforces immunity against Measles, Rubella, Diphtheria, Pertussis, Tetanus, Polio",
            prevention_te: "తట్టు, రుబెల్లా, కంఠసర్పి, ధనుర్వాతం, పోలియో వ్యాధులకు పునరుద్ధరణ రక్షణ",
            notes_en: "*JE-2: Where included in the National Immunization Schedule for applicable endemic areas",
            notes_te: "*జేఈ-2: ఎండెమిక్ ప్రాంతాలలో జేఈ-1 తీసుకున్న వారికి మాత్రమే"
        },
        {
            age_en: "5 - 6 Years",
            age_te: "5 నుండి 6 సంవత్సరాలు",
            vaccines_en: "DPT Booster-2",
            vaccines_te: "డిపిటి బూస్టర్-2 (DPT Booster-2)",
            route_en: "Intramuscular",
            route_te: "కండరానికి",
            prevention_en: "Diphtheria, Pertussis, Tetanus",
            prevention_te: "కంఠసర్పి, కోరింత దగ్గు, ధనుర్వాతం",
            notes_en: "School entry booster dose",
            notes_te: "పాఠశాలలో ప్రవేశించే వయసు బూస్టర్ మోతాదు"
        },
        {
            age_en: "10 & 16 Years",
            age_te: "10 మరియు 16 సంవత్సరాలు",
            vaccines_en: "Td (Tetanus & adult Diphtheria)",
            vaccines_te: "టిడి (Td - ధనుర్వాతం & డిఫ్తీరియా)",
            route_en: "Intramuscular",
            route_te: "కండరానికి",
            prevention_en: "Tetanus and Diphtheria booster for adolescents",
            prevention_te: "కౌమార వయసు పిల్లలకు ధనుర్వాతం, కంఠసర్పి రక్షణ",
            notes_en: "Administered in school health drives / PHC",
            notes_te: "పాఠశాల ఆరోగ్య తనిఖీలు లేదా పిహెచ్‌సిలో ఇవ్వబడుతుంది"
        },
        {
            age_en: "Pregnant Women",
            age_te: "గర్భిణీ స్త్రీలు",
            vaccines_en: "Td-1 & Td-2 (or Td Booster)",
            vaccines_te: "టిడి-1 & టిడి-2 (లేదా టిడి బూస్టర్)",
            route_en: "Intramuscular",
            route_te: "కండరానికి",
            prevention_en: "Maternal and Neonatal Tetanus protection",
            prevention_te: "తల్లి మరియు పుట్టబోయే బిడ్డకు ధనుర్వాతం రక్షణ",
            notes_en: "Td-1 early in pregnancy, Td-2 after 4 weeks. Td booster if vaccinated in past 3 years.",
            notes_te: "గర్భం ప్రారంభంలో టిడి-1, 4 వారాల తర్వాత టిడి-2. గత 3 ఏళ్లలో తీసుకుని ఉంటే ఒక బూస్టర్ చాలు."
        }
    ]
};
