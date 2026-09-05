/**
 * Emergency First-Aid Guidance Reference Data
 * Sources: 
 * - National Rabies Control Programme (NRCP), MoHFW
 * - National Centre for Disease Control (NCDC) Guidelines for Rabies Prophylaxis
 * - Standard National Snakebite First-Aid Protocols
 */

export const EMERGENCY_GUIDANCE_REFERENCE = {
    source: "National Centre for Disease Control (NCDC) & National Rabies Control Programme (NRCP), MoHFW",
    reviewedOn: "September 2026",
    helplines: [
        {
            number: "108",
            label_en: "Emergency Ambulance Service",
            label_te: "అత్యవసర అంబులెన్స్ సేవ",
            scope_en: "24x7 Toll-Free Emergency Dispatch for acute trauma, snakebite, labor, and critical transport",
            scope_te: "24x7 ఉచిత అత్యవసర రవాణా సేవ (గాయాలు, పాముకాటు, ప్రసవాలు)"
        },
        {
            number: "104",
            label_en: "Government Health Information & Guidance",
            label_te: "ప్రభుత్వ ఆరోగ్య సమాచార హెల్ప్‌లైన్",
            scope_en: "24x7 Toll-Free Medical Advisory and Government Health Programme Assistance",
            scope_te: "24x7 ఉచిత వైద్య సలహాలు మరియు ఆరోగ్య పథకాల సమాచారం"
        },
        {
            number: "15400",
            label_en: "National Rabies & Snakebite Helpline",
            label_te: "జాతీయ రేబిస్ మరియు పాముకాటు హెల్ప్‌లైన్",
            scope_en: "24x7 Toll-Free National Helpline (NCDC/NRCP) active in Andhra Pradesh for animal bite and snakebite guidance",
            scope_te: "జంతువుల కాటు, రేబిస్ మరియు పాముకాటు నివారణ సలహాల కొరకు 24x7 ఉచిత జాతీయ హెల్ప్‌లైన్"
        }
    ],
    snakebite: {
        title_en: "Snakebite Emergency First Aid",
        title_te: "పాముకాటు అత్యవసర ప్రథమ చికిత్స",
        sub_en: "Evidence-based first aid protocol while arranging immediate medical transport",
        sub_te: "వైద్యశాలకు తరలించే సమయంలో పాటించవలసిన ప్రాథమిక నియమాలు",
        dos: [
            {
                en: "Keep the patient calm and completely still. Minimizing body movement significantly slows down venom dispersion through lymphatic channels.",
                te: "బాధితుడిని ప్రశాంతంగా ఉంచండి. కదలికలు తగ్గిస్తే విషం శరీరంలో వేగంగా వ్యాపించకుండా ఉంటుంది."
            },
            {
                en: "Immobilize the bitten limb using a splint or firm support, similar to managing a bone fracture. Keep the limb at or slightly below the level of the heart.",
                te: "కాటు వేసిన భాగాన్ని ఎముక విరిగినట్లుగా కదలకుండా కర్ర లేదా కట్టుతో నిశ్చలంగా ఉంచండి. గుండె కంటే తక్కువ ఎత్తులో ఉంచండి."
            },
            {
                en: "Immediately remove rings, anklets, bracelets, watches, and tight clothing from the bitten limb before local swelling develops.",
                te: "వాపు రాకముందే చేతి లేదా కాలి ఉంగరాలు, గొలుసులు, గాజులు, గట్టి దుస్తులను వెంటనే తొలగించండి."
            },
            {
                en: "Arrange emergency transport immediately. Contact 108 without delay to reach the nearest equipped medical hospital.",
                te: "వెంటనే 108 కి ఫోన్ చేసి అత్యవసర రవాణా ఏర్పాటు చేయండి. రోగిని దగ్గరలోని ప్రధాన ఆసుపత్రికి తరలించండి."
            }
        ],
        donts: [
            {
                en: "DO NOT cut, slash, or make incisions around the bite site. This causes severe hemorrhage and tissue infection.",
                te: "కాటు వేసిన చోట బ్లేడుతో కోయడం లేదా గాట్లు పెట్టడం ఎట్టి పరిస్థితుల్లోనూ చేయవద్దు."
            },
            {
                en: "DO NOT attempt to suck venom by mouth or mechanical suction devices. This is ineffective and hazardous.",
                te: "నోటితో లేదా సిరంజితో విషాన్ని పీల్చడానికి ప్రయత్నించవద్దు."
            },
            {
                en: "DO NOT tie tight arterial tourniquets, ropes, or wires. Tourniquets can cause severe tissue necrosis and limb amputation.",
                te: "రక్త ప్రసరణ ఆగిపోయేలా తాడు లేదా తీగతో గట్టిగా కట్టవద్దు. దీనివల్ల కండరాలు దెబ్బతిని అవయవం తొలగించాల్సి రావచ్చు."
            },
            {
                en: "DO NOT apply ice packs, herbal paste, chemicals, cow dung, or electrical shocks to the wound.",
                te: "గాయంపై ఐస్, ఆకుపసర్లు, రసాయనాలు లేదా పేడ పూయవద్దు."
            }
        ],
        clinicalNote_en: "Notice: The receiving medical facility will clinically assess the patient, monitor vital signs and coagulation parameters, and administer Anti-Snake Venom (ASV) as clinically indicated. Do not delay transport for native remedies.",
        clinicalNote_te: "గమనిక: ఆసుపత్రికి చేరిన తర్వాత వైద్యులు రోగి లక్షణాలను బట్టి తగిన చికిత్స మరియు యాంటీ-స్నేక్ వెనమ్ (ASV) నిర్ణయిస్తారు. నాటు వైద్యాల కోసం సమయం వృధా చేయకండి."
    },
    rabies: {
        title_en: "Animal Bite & Rabies Exposure Protocol",
        title_te: "జంతువుల కాటు & రేబిస్ నివారణ మార్గదర్శకాలు",
        sub_en: "Immediate wound washing and exposure management based on National Rabies Control Programme (NRCP) standards",
        sub_te: "జాతీయ రేబిస్ నియంత్రణ కార్యక్రమం ఆధారంగా తక్షణ ప్రథమ చికిత్స",
        steps: [
            {
                step: 1,
                title_en: "Vigorous Wound Washing (Immediate)",
                title_te: "గాయాన్ని సబ్బుతో కడగడం (తక్షణం)",
                desc_en: "Immediately wash and flush all bite wounds and scratches thoroughly under running tap water with soap for at least 15 minutes. This simple measure removes the majority of rabies viral particles from the wound.",
                desc_te: "కుక్క లేదా ఇతర జంతువు కరిచిన వెంటనే కనీసం 15 నిమిషాల పాటు ప్రవహించే నీటి కింద సబ్బుతో గాయాన్ని బాగా కడగాలి. ఇది విషక్రిములను చాలావరకు తొలగిస్తుంది."
            },
            {
                step: 2,
                title_en: "Antiseptic Application",
                title_te: "యాంటిసెప్టిక్ రాయడం",
                desc_en: "After washing, apply povidone-iodine, chlorhexidine, or alcohol to the wound if available. Do not apply irritants like chili powder, turmeric, soil, or lime.",
                desc_te: "కడిగిన తర్వాత పోవిడోన్ అయోడిన్ లేదా స్పిరిట్ రాయండి. కారం, పసుపు, సున్నం లేదా మట్టి ఎప్పుడూ రాయవద్దు."
            },
            {
                step: 3,
                title_en: "Do Not Suture Immediately",
                title_te: "కుట్లు వేయవద్దు",
                desc_en: "Bite wounds should not be bandaged tightly or sutured immediately, unless strictly required for life-threatening bleeding under medical care.",
                desc_te: "గాయానికి గట్టిగా బ్యాండేజ్ కట్టడం లేదా వెంటనే కుట్లు వేయడం నివారించాలి."
            },
            {
                step: 4,
                title_en: "Immediate Professional Assessment",
                title_te: "వెంటనే వైద్యాధికారిని సంప్రదించండి",
                desc_en: "Seek medical care promptly at the nearest healthcare facility or Primary Health Center. A qualified healthcare professional will assess the exposure category (Category I, II, or III) and prescribe the appropriate post-exposure prophylaxis (PEP) vaccination schedule and Rabies Immunoglobulin (RIG) if required.",
                desc_te: "వెంటనే సమీప ప్రాథమిక ఆరోగ్య కేంద్రానికి (PHC) లేదా ఆసుపత్రికి వెళ్లండి. వైద్యాధికారి గాయం తీవ్రతను బట్టి టీకాల షెడ్యూల్ మరియు అవసరమైతే రేబిస్ ఇమ్యునోగ్లోబులిన్ నిర్ణయిస్తారు."
            }
        ],
        clinicalNote_en: "Notice: Rabies is 100% fatal once symptoms develop, but 100% preventable with prompt wound washing and timely vaccination. Do not wait to see if the animal falls sick. Contact the 24x7 National Rabies Helpline at 15400 for guidance.",
        clinicalNote_te: "గమనిక: రేబిస్ వ్యాధి లక్షణాలు బయటపడితే ప్రాణాపాయం ఖాయం, కానీ సకాలంలో సబ్బుతో కడిగి టీకాలు వేయించుకుంటే 100% నివారించవచ్చు. జాతీయ రేబిస్ హెల్ప్‌లైన్: 15400."
    }
};
