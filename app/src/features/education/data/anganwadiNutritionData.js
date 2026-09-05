/**
 * Anganwadi Early Childhood Care & Nutrition Services (ICDS / WDCW AP)
 * Epistemic Level: B (State-Wide Government Framework)
 * Source: Department of Women Development & Child Welfare, Government of Andhra Pradesh
 * Scheme Framework: Integrated Child Development Services (ICDS) / Mission Poshan 2.0
 * Review Date: September 2026
 */

export const anganwadiNutritionData = {
    provenance: {
        level: "Level B: State Government Service Framework",
        authority: "Department of Women Development & Child Welfare, Government of Andhra Pradesh",
        program: "Integrated Child Development Services (ICDS) / Mission Saksham Anganwadi & Poshan 2.0",
        reviewedDate: "September 2026",
        disclaimer: "Prescribed government framework for early childhood development and nutrition support. Local operating arrangements, distribution schedules, and session timings may vary; contact the local Anganwadi Centre to confirm current arrangements."
    },
    operatingNotice: {
        en: "Anganwadi operating arrangements may vary; contact the centre for the current schedule.",
        te: "అంగన్‌వాడీ నిర్వహణ వేళలు కేంద్రం ప్రకారం మారవచ్చు; ప్రస్తుత సమయాల కోసం స్థానిక కేంద్రాన్ని సంప్రదించండి."
    },
    growthMonitoringService: {
        title: "Growth Monitoring & Development Tracking",
        titleTe: "ఎదుగుదల పర్యవేక్షణ & అభివృద్ధి నమోదు",
        description: "Anganwadi services include routine monitoring of children's growth and development (weight and height tracking per Poshan Tracker guidelines) and referral to the Primary Health Centre when health or nutritional concerns are identified.",
        descriptionTe: "అంగన్‌వాడీ సేవలలో భాగంగా చిన్నారుల ఎత్తు మరియు బరువును పోషణ్ ట్రాకర్ మార్గదర్శకాల ప్రకారం క్రమంతప్పకుండా నమోదు చేస్తారు. పోషకాహార లేదా ఆరోగ్య లోపాలు గమనించినప్పుడు సమీప ప్రాథమిక ఆరోగ్య కేంద్రానికి (PHC) రెఫర్ చేస్తారు."
    },
    beneficiaryGroups: [
        {
            id: "infants-toddlers",
            group: "Children (6 Months to 3 Years)",
            groupTe: "చిన్నారులు (6 నెలల నుండి 3 సంవత్సరాలు)",
            serviceDescription: "Supplementary nutrition support (Take-Home Ration / Balamrutham per state distribution guidelines), growth tracking, and immunization monitoring in coordination with the village ANM and ASHA worker.",
            serviceDescriptionTe: "రాష్ట్ర పంపిణీ నిబంధనల ప్రకారం ఇంటికి ఇచ్చే అనుబంధ పోషకాహారం (బాలామృతం), ఎదుగుదల నమోదు, మరియు ఏఎన్ఎం/ఆశా సమన్వయంతో వ్యాక్సినేషన్ పర్యవేక్షణ."
        },
        {
            id: "preschool",
            group: "Children (3 Years to 6 Years)",
            groupTe: "చిన్నారులు (3 సంవత్సరాల నుండి 6 సంవత్సరాలు)",
            serviceDescription: "Non-formal early childhood care and pre-school education (language, cognitive play, socialization), daily hot cooked meal served at the centre, and routine health checkups.",
            serviceDescriptionTe: "పూర్వ ప్రాథమిక విద్య (పాటలు, అక్షరాలు, సంఖ్యలు, మానసిక వికాసం), కేంద్రంలో రోజూ అందించే వేడి మధ్యాహ్న భోజనం, మరియు సాధారణ ఆరోగ్య పరీక్షలు."
        },
        {
            id: "maternal",
            group: "Pregnant Women & Lactating Mothers",
            groupTe: "గర్భిణీ స్త్రీలు మరియు బాలింతలు",
            serviceDescription: "Supplementary nutrition provision under state maternal health programmes, iron-folic acid supplementation, counseling on infant and young child feeding, and antenatal health checkup linkage.",
            serviceDescriptionTe: "రాష్ట్ర మాతా శిశు సంక్షేమ పథకాల క్రింద అనుబంధ పోషకాహారం, ఐరన్-ఫోలిక్ యాసిడ్ మాత్రలు, శిశు సంరక్షణ కౌన్సిలింగ్, మరియు ప్రసవపూర్వ ఆరోగ్య పరీక్షల అనుసంధానం."
        }
    ]
};

export default anganwadiNutritionData;
