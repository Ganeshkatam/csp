# Community Service Project (CSP) — Field Survey Questionnaire
## Socio-Economic & Local Information-Needs Assessment

**Assigned Habitation Details**
- Village Name: [Assigned Village Name]
- Gram Panchayat: [Assigned Gram Panchayat]
- Mandal / Taluk: [Assigned Mandal/Taluk]
- District: [Assigned District]
- State: [Assigned State]

**Survey Metadata**
- Surveyor Name / Student ID: _____________________________________________
- Date of Interview: DD / MM / YYYY
- Household / Respondent ID: HH-_____ (e.g., HH-001, HH-002)
- Location / Ward / Street: _______________________________________________

---

### Informed Consent Statement
"Good day. I am a Computer Science and Engineering student from [College Name], conducting a Community Service Project (CSP) to understand how local information regarding public services, government welfare schemes, emergency contacts, and healthcare reaches residents in [Assigned Village Name]. This survey is strictly for academic research and community improvement. Your personal identity will remain confidential. Participation is voluntary and will take approximately 10 to 12 minutes."

Consent Obtained: [ ] Yes   [ ] No (If No, conclude interview and proceed to next household)

---

### Section 1: Demographic & Household Profile

**Q1. Respondent Age Group [D1]**
- [ ] 1: 18 - 25 years
- [ ] 2: 26 - 40 years
- [ ] 3: 41 - 60 years
- [ ] 4: Above 60 years

**Q2. Gender [D2]**
- [ ] 1: Male
- [ ] 2: Female
- [ ] 3: Other / Prefer not to say

**Q3. Primary Occupation of Household Head [D3]**
- [ ] 1: Agriculture / Farming
- [ ] 2: Agricultural Laborer / Daily Wage Worker
- [ ] 3: Artisan / Tradesperson (Carpenter, Tailor, Mason, Mechanic, Weaver, etc.)
- [ ] 4: Small Business / Shopkeeper / Vendor
- [ ] 5: Salaried Employment (Private / Government)
- [ ] 6: Other (Specify: ___________________)

**Q4. Highest Education Level in the Household [D4]**
- [ ] 1: Non-literate
- [ ] 2: Primary School (Classes 1 - 5)
- [ ] 3: Secondary School (Classes 6 - 10)
- [ ] 4: Higher Secondary / Intermediate (Classes 11 - 12)
- [ ] 5: Diploma / Vocational Training
- [ ] 6: Graduate / Post-Graduate

**Q5. Total Household Members [D5]**
- Total Members: _____

---

### Section 2: Digital Infrastructure & Connectivity

**Q6. Smartphone Availability in Household [TECH1]**
- [ ] 1: Yes, at least one working smartphone
- [ ] 2: Basic feature phone only (voice/SMS)
- [ ] 3: No mobile phone in household

**Q7. Primary Internet Access Mode [TECH2]**
- [ ] 1: Mobile Data (4G / 5G SIM)
- [ ] 2: Mobile Data (2G / 3G only, frequent low-signal areas)
- [ ] 3: Home Broadband / Wi-Fi
- [ ] 4: No internet access

**Q8. Digital Comfort & Reading Literacy [TECH3]**
*Can anyone in the household independently open a website, read information, or fill a simple online form?*
- [ ] 1: Yes, independently (Youth / Adults in household)
- [ ] 2: Yes, but requires assistance from others
- [ ] 3: No, relies entirely on internet cafes, CSC centers, or third parties

---

### Section 3: Government Scheme Awareness & Access

**Q9. How does your family currently learn about new Government Welfare Schemes? [SCH1]**
*(Select primary method)*
- [ ] 1: Word of mouth (Neighbors, relatives)
- [ ] 2: Village Panchayat notices / Grama Sabha announcements
- [ ] 3: Intermediaries / Local middlemen
- [ ] 4: Common Service Centre (CSC) / Internet Cafe
- [ ] 5: Official Government Websites / Mobile Apps
- [ ] 6: Social media (WhatsApp, YouTube)

**Q10. What is your biggest challenge when applying for a Government Scheme? [SCH2]**
- [ ] 1: Not knowing eligibility rules or required documents in advance
- [ ] 2: Visiting mandal/taluk office multiple times due to missing paperwork
- [ ] 3: Uncertainty over whether an online link or portal is official and genuine
- [ ] 4: Having to pay fees to intermediaries for simple information
- [ ] 5: No significant challenge faced

**Q11. Have you ever faced difficulty identifying whether a website or link is an official government portal (.gov.in / .nic.in)? [SCH3]**
- [ ] 1: Yes, frequently confused by private/unofficial websites
- [ ] 2: Sometimes unsure
- [ ] 3: No, I can distinguish official portals easily
- [ ] 4: Do not use government websites

---

### Section 4: Emergency & Village Administrative Contacts

**Q12. Do you currently have the direct phone numbers of key village officials and emergency responders stored or written down? [CON1]**
*(Database note: Evaluated as 4 discrete binary metrics in the relational schema: `CON1_Panchayat`, `CON1_PHC`, `CON1_Police`, `CON1_Lineman`. This normalizes the 18 parent interview questions into 21 database question records).*
- Panchayat Secretary / Sarpanch [`CON1_Panchayat`]: [ ] Yes [ ] No
- Primary Health Centre (PHC) / Ambulance [`CON1_PHC`]: [ ] Yes [ ] No
- Local Police Station / Outpost [`CON1_Police`]: [ ] Yes [ ] No
- Village Electricity Lineman / Water Supply Operator [`CON1_Lineman`]: [ ] Yes [ ] No

**Q13. How do you find an emergency contact number when needed urgently? [CON2]**
- [ ] 1: Ask neighbors or friends
- [ ] 2: Visit the Panchayat office or physical board in person
- [ ] 3: Already have numbers saved in mobile phone
- [ ] 4: Struggle to find the verified number quickly

---

### Section 5: Healthcare & Education Transparency

**Q14. How do you find out about doctor availability, OPD hours, or immunization days at the local PHC? [HLTH1]**
- [ ] 1: Visit the PHC in person (risk finding doctor unavailable)
- [ ] 2: Contact ASHA worker / ANM directly
- [ ] 3: Official announcements / notice board
- [ ] 4: No reliable way to check beforehand

**Q15. Do you find it difficult to obtain verified contact numbers or admission/facility information for local schools and Anganwadis? [EDU1]**
- [ ] 1: Yes, information is scattered and requires in-person visits
- [ ] 2: No, information is easily accessible
- [ ] 3: Not applicable (No school-age children)

---

### Section 6: Local Livelihoods & Small Business Directory

**Q16. When you need local services (e.g., electrician, plumber, tailor, tractor repair, mason, artisan), how do you find them? [BIZ1]**
- [ ] 1: Rely only on personal contacts / same-ward acquaintances
- [ ] 2: Ask around the village market
- [ ] 3: Often struggle to find available skilled persons nearby

**Q17. Would a verified, free phone directory of village businesses, artisans, and Self-Help Groups (SHGs) be helpful? [BIZ2]**
- [ ] 1: Yes, very helpful for customers and local service providers
- [ ] 2: Somewhat helpful
- [ ] 3: Not necessary

---

### Section 7: Citizen Information Priorities

**Q18. Rank the top 3 types of information you would most like to have accessible in one simple, mobile-friendly village portal: [PRIO1]**
*(Assign ranks 1, 2, 3 where 1 is highest priority)*
- [ ] Verified Emergency & Village Official Contacts
- [ ] Government Welfare Schemes (Eligibility, Required Documents, Official Links)
- [ ] Primary Health Centre (PHC) Timings & Immunization Rosters
- [ ] Local School & Anganwadi Details
- [ ] Local Business, Artisan, and SHG Directory
- [ ] Gram Panchayat Notices & Public Announcements

---

### Interviewer Verification
- Respondent's General Remarks / Specific Information Gaps Mentioned:
  _________________________________________________________________________
  _________________________________________________________________________
- Interview Completed Successfully: [ ] Yes   [ ] Incomplete
- Signature of Surveyor: _______________________
