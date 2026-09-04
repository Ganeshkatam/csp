/**
 * Canonical Question Codes, Machine Tokens, and Display Dictionaries
 * for the 21 Logical-Question / 24 Answer-Control CSP Survey.
 * 
 * Values are machine tokens stored in the database.
 * Labels are written in clear, general English for easy reading.
 */

export const SURVEY_CANONICAL_OPTIONS = {
    D1: [
        { value: '18-25', label: '18 to 25 years' },
        { value: '26-40', label: '26 to 40 years' },
        { value: '41-60', label: '41 to 60 years' },
        { value: 'Above-60', label: 'Above 60 years' }
    ],
    D2: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other / Prefer not to say' }
    ],
    D3: [
        { value: 'Agriculture', label: 'Farming / Agriculture' },
        { value: 'Agricultural-Labor', label: 'Farm Labor / Daily Wage Work' },
        { value: 'Artisan-Trades', label: 'Local Trades (Weaver, Carpenter, Tailor)' },
        { value: 'Small-Business', label: 'Shopkeeper / Small Business / Vendor' },
        { value: 'Salaried-Service', label: 'Salaried Job (Private or Government)' },
        { value: 'Other', label: 'Other Work' }
    ],
    D4: [
        { value: 'Non-literate', label: 'No formal schooling' },
        { value: 'Primary', label: 'Primary School (Class 1 to 5)' },
        { value: 'Secondary', label: 'High School (Class 6 to 10)' },
        { value: 'Higher-Secondary', label: 'Intermediate / 12th Class' },
        { value: 'Graduate-Diploma', label: 'Degree / Diploma / Higher' }
    ],
    D6: [
        { value: 'White-BPL-Card', label: 'White Ration Card (Rice Card / BPL)' },
        { value: 'Pink-APL-Card', label: 'Pink Ration Card (APL)' },
        { value: 'No-Card', label: 'No Ration Card' }
    ],
    TECH1: [
        { value: 'Smartphone-Available', label: 'Yes, have a smartphone' },
        { value: 'Basic-Phone-Only', label: 'Basic keypad phone only' },
        { value: 'No-Phone', label: 'No phone in the house' }
    ],
    TECH2: [
        { value: 'Mobile-Data-4G-5G', label: 'Mobile data (4G / 5G)' },
        { value: 'Broadband-WiFi', label: 'Home Wi-Fi / Broadband' },
        { value: 'Intermittent-2G-3G', label: 'Slow or weak mobile signal (2G / 3G)' },
        { value: 'No-Internet', label: 'No internet access at home' }
    ],
    TECH3: [
        { value: 'Independent', label: 'Can use websites and read online on my own' },
        { value: 'Needs-Assistance', label: 'Need help from family or youth to read online' },
        { value: 'Relies-on-Cafes', label: 'Go to internet centers or CSC for online work' }
    ],
    SCH1: [
        { value: 'Panchayat-Notices', label: 'Panchayat notice board and announcements' },
        { value: 'Word-of-Mouth', label: 'Neighbors and friends' },
        { value: 'CSC-Cafe', label: 'Internet center (CSC) / Net cafe' },
        { value: 'Official-Web', label: 'Official government websites' },
        { value: 'Social-Media', label: 'Social media (WhatsApp, YouTube)' }
    ],
    SCH2: [
        { value: 'Unknown-Eligibility-Docs', label: 'Do not know required papers or rules in advance' },
        { value: 'Repeated-Office-Visits', label: 'Having to visit offices multiple times for missing papers' },
        { value: 'Unsure-Official-Link', label: 'Not sure if an online website link is real' },
        { value: 'Intermediary-Fees', label: 'Having to pay money to middlemen for information' },
        { value: 'No-Hurdle', label: 'No difficulty faced' }
    ],
    SCH3: [
        { value: 'Frequently-Confused', label: 'Often confused by private or unofficial websites' },
        { value: 'Sometimes-Unsure', label: 'Sometimes unsure if a link is genuine' },
        { value: 'Easily-Distinguish', label: 'Can easily tell official government (.gov.in) websites' },
        { value: 'Do-Not-Use', label: 'Do not use online government websites' }
    ],
    SCH4_OPTIONS: [
        { value: 'PM-KISAN', label: 'PM-KISAN / Rythu Bharosa' },
        { value: 'Pension-Kanuka', label: 'YSR Pension Kanuka (Old Age / Widow / Disability)' },
        { value: 'Amma-Vodi', label: 'Amma Vodi / Vidya Deevena' },
        { value: 'Aarogyasri', label: 'Dr. YSR Aarogyasri Health Scheme' },
        { value: 'None', label: 'None of these schemes' }
    ],
    CON1_SUBCODES: [
        { code: 'CON1_Panchayat', label: 'Panchayat Secretary or Sarpanch' },
        { code: 'CON1_PHC', label: 'Clinic (PHC) Doctor or Ambulance' },
        { code: 'CON1_Police', label: 'Local Police Station' },
        { code: 'CON1_Lineman', label: 'Electricity Lineman or Water Operator' }
    ],
    CON2: [
        { value: 'Ask-Neighbors', label: 'Ask neighbors or friends' },
        { value: 'Visit-Panchayat', label: 'Visit Panchayat office in person' },
        { value: 'Saved-In-Phone', label: 'Already have numbers saved in mobile phone' },
        { value: 'Struggle-To-Find', label: 'Hard to find the right number quickly' }
    ],
    HLTH1: [
        { value: 'Visited-PHC-No-Doctor', label: 'Went to the clinic when urgent, but doctor was not there' },
        { value: 'No-Way-To-Check', label: 'No way to check doctor timings in advance' },
        { value: 'Regular-Satisfactory', label: 'Clinic is open and doctor is available when needed' }
    ],
    EDU1: [
        { value: 'Easily-Accessible', label: 'School and Anganwadi details are easy to get' },
        { value: 'Scattered-Requires-Visits', label: 'Hard to find details without visiting in person' },
        { value: 'No-School-Children', label: 'No school-age children in the house' }
    ],
    INFRA1: [
        { value: 'Panchayat-RO-Plant', label: 'Panchayat RO Drinking Water Plant' },
        { value: 'Borewell-Tap', label: 'Direct Borewell or Tap Water' },
        { value: 'Private-Tanker-Can', label: 'Private Water Cans or Tankers' }
    ],
    BIZ1: [
        { value: 'Personal-Contacts', label: 'Ask neighbors or personal contacts' },
        { value: 'Market-Inquiry', label: 'Ask around at village shops' },
        { value: 'Struggle-To-Find', label: 'Hard to find skilled workers nearby' }
    ],
    BIZ2: [
        { value: 'Very-Helpful', label: 'Very helpful to find local repairers and shops' },
        { value: 'Somewhat-Helpful', label: 'Somewhat helpful' },
        { value: 'Not-Necessary', label: 'Not needed' }
    ],
    PRIO1: [
        { value: 'Emergency-Contacts', label: 'Emergency phone numbers and clinic contacts' },
        { value: 'Welfare-Checklists', label: 'Government schemes list and required documents' },
        { value: 'PHC-Timings', label: 'Doctor timings at the primary health centre' },
        { value: 'Business-Directory', label: 'Phone numbers of local repairers and shops' },
        { value: 'Panchayat-Notices', label: 'Panchayat announcements and meeting updates' },
        { value: 'School-Anganwadi', label: 'School and Anganwadi timings and updates' }
    ]
};
