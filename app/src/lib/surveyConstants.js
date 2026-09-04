/**
 * Canonical Question Codes, Machine Tokens, and Display Dictionaries
 * for the 21 Logical-Question / 24 Answer-Control CSP Survey Architecture.
 * 
 * Storage Rule:
 * Store canonical machine tokens only (e.g. 'PM-KISAN', 'White-BPL-Card').
 * Never store UI display labels as database answer values.
 */

export const SURVEY_CANONICAL_OPTIONS = {
    D1: [
        { value: '18-25', label: '18 - 25 years' },
        { value: '26-40', label: '26 - 40 years' },
        { value: '41-60', label: '41 - 60 years' },
        { value: 'Above-60', label: 'Above 60 years' }
    ],
    D2: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other / Prefer not to say' }
    ],
    D3: [
        { value: 'Agriculture', label: 'Agriculture / Farming' },
        { value: 'Agricultural-Labor', label: 'Agricultural Labor / Daily Wage Worker' },
        { value: 'Artisan-Trades', label: 'Artisan / Tradesperson (Weaver, Carpenter, Tailor)' },
        { value: 'Small-Business', label: 'Small Business / Shopkeeper / Vendor' },
        { value: 'Salaried-Service', label: 'Salaried Employment (Private / Government)' },
        { value: 'Other', label: 'Other Livelihood' }
    ],
    D4: [
        { value: 'Non-literate', label: 'Non-literate' },
        { value: 'Primary', label: 'Primary School (Classes 1 - 5)' },
        { value: 'Secondary', label: 'Secondary School (Classes 6 - 10)' },
        { value: 'Higher-Secondary', label: 'Higher Secondary / Intermediate (Classes 11 - 12)' },
        { value: 'Graduate-Diploma', label: 'Diploma / Vocational / Graduate' }
    ],
    D6: [
        { value: 'White-BPL-Card', label: 'White Ration Card (Rice Card / BPL)' },
        { value: 'Pink-APL-Card', label: 'Pink Ration Card (APL)' },
        { value: 'No-Card', label: 'No Ration Card' }
    ],
    TECH1: [
        { value: 'Smartphone-Available', label: 'Smartphone Available (At least one active touchscreen)' },
        { value: 'Basic-Phone-Only', label: 'Basic Keypad Phone Only (Voice/SMS)' },
        { value: 'No-Phone', label: 'No Working Phone in Household' }
    ],
    TECH2: [
        { value: 'Mobile-Data-4G-5G', label: 'Mobile Cellular Data (4G / 5G SIM)' },
        { value: 'Broadband-WiFi', label: 'Home Broadband / Fiber Wi-Fi' },
        { value: 'Intermittent-2G-3G', label: 'Intermittent / Slow 2G-3G Signal' },
        { value: 'No-Internet', label: 'No Internet Access' }
    ],
    TECH3: [
        { value: 'Independent', label: 'Independent (Can open websites and read without help)' },
        { value: 'Needs-Assistance', label: 'Needs Assistance (Relies on family / youth)' },
        { value: 'Relies-on-Cafes', label: 'Relies on Intermediaries / CSC Centers' }
    ],
    SCH1: [
        { value: 'Panchayat-Notices', label: 'Village Panchayat Notices & Grama Sabha' },
        { value: 'Word-of-Mouth', label: 'Word of mouth (Neighbors, relatives)' },
        { value: 'CSC-Cafe', label: 'Common Service Centre (CSC) / Internet Cafe' },
        { value: 'Official-Web', label: 'Official Government Portals (.gov.in)' },
        { value: 'Social-Media', label: 'Social Media (WhatsApp, YouTube)' }
    ],
    SCH2: [
        { value: 'Unknown-Eligibility-Docs', label: 'Not knowing eligibility rules or required documents in advance' },
        { value: 'Repeated-Office-Visits', label: 'Visiting mandal office multiple times due to missing paperwork' },
        { value: 'Unsure-Official-Link', label: 'Uncertainty over whether an online link is authentic' },
        { value: 'Intermediary-Fees', label: 'Having to pay fees to intermediaries for basic information' },
        { value: 'No-Hurdle', label: 'No significant challenge faced' }
    ],
    SCH3: [
        { value: 'Frequently-Confused', label: 'Frequently confused by private / unofficial websites' },
        { value: 'Sometimes-Unsure', label: 'Sometimes unsure if link is authentic' },
        { value: 'Easily-Distinguish', label: 'Can distinguish official .gov.in portals easily' },
        { value: 'Do-Not-Use', label: 'Do not use online government portals' }
    ],
    SCH4_OPTIONS: [
        { value: 'PM-KISAN', label: 'PM-KISAN / Rythu Bharosa' },
        { value: 'Pension-Kanuka', label: 'YSR Pension Kanuka (Old Age/Widow/Disability)' },
        { value: 'Amma-Vodi', label: 'Jagananna Amma Vodi / Vidya Deevena' },
        { value: 'Aarogyasri', label: 'Dr. YSR Aarogyasri Health Scheme' },
        { value: 'None', label: 'No Active Scheme Entitlements' }
    ],
    CON1_SUBCODES: [
        { code: 'CON1_Panchayat', label: 'Panchayat Secretary / Sarpanch' },
        { code: 'CON1_PHC', label: 'Primary Health Centre (PHC) / Ambulance' },
        { code: 'CON1_Police', label: 'Local Police Station / Beat Officer' },
        { code: 'CON1_Lineman', label: 'Electricity Lineman / Water Supply' }
    ],
    CON2: [
        { value: 'Ask-Neighbors', label: 'Ask neighbors or friends' },
        { value: 'Visit-Panchayat', label: 'Visit Panchayat office / physical board in person' },
        { value: 'Saved-In-Phone', label: 'Already have numbers saved in mobile phone' },
        { value: 'Struggle-To-Find', label: 'Struggle to find the verified number quickly' }
    ],
    HLTH1: [
        { value: 'Visited-PHC-No-Doctor', label: 'Visited PHC during urgent need but doctor was absent/closed' },
        { value: 'No-Way-To-Check', label: 'No reliable way to check doctor OPD timings in advance' },
        { value: 'Regular-Satisfactory', label: 'Regularly utilizes PHC services with satisfactory experience' }
    ],
    EDU1: [
        { value: 'Easily-Accessible', label: 'School and Anganwadi information easily accessible' },
        { value: 'Scattered-Requires-Visits', label: 'Information is scattered and requires in-person visits' },
        { value: 'No-School-Children', label: 'No school-age children in household' }
    ],
    INFRA1: [
        { value: 'Panchayat-RO-Plant', label: 'Gram Panchayat Community RO Water Plant' },
        { value: 'Borewell-Tap', label: 'Direct Borewell / Municipal Tap Supply' },
        { value: 'Private-Tanker-Can', label: 'Private Commercial Tanker / Bubble Cans' }
    ],
    BIZ1: [
        { value: 'Personal-Contacts', label: 'Rely only on personal contacts / same-ward acquaintances' },
        { value: 'Market-Inquiry', label: 'Ask around the village market / shops' },
        { value: 'Struggle-To-Find', label: 'Often struggle to find available skilled tradespeople nearby' }
    ],
    BIZ2: [
        { value: 'Very-Helpful', label: 'Very helpful for finding local repairers and supporting SHGs' },
        { value: 'Somewhat-Helpful', label: 'Somewhat helpful' },
        { value: 'Not-Necessary', label: 'Not necessary' }
    ],
    PRIO1: [
        { value: 'Emergency-Contacts', label: '24x7 Verified Emergency & Clinic Contacts' },
        { value: 'Welfare-Checklists', label: 'Government Welfare Scheme Eligibility & Document Checklists' },
        { value: 'PHC-Timings', label: 'Primary Health Centre (PHC) OPD Timings & Immunization Rosters' },
        { value: 'Business-Directory', label: 'Local Tradespeople & Artisan Phone Directory' },
        { value: 'Panchayat-Notices', label: 'Gram Panchayat Notices & Meeting Resolutions' },
        { value: 'School-Anganwadi', label: 'Local School & Anganwadi Timings & Schemes' }
    ]
};
