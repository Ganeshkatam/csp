/**
 * PM POSHAN National Nutritional Norms & Standards
 * Epistemic Level: B (National Statutory Standard)
 * Source: Ministry of Education, Government of India (PM POSHAN Guidelines)
 * Review Date: September 2026
 */

export const midDayMealStandards = {
    provenance: {
        level: "Level B: National Statutory Standard",
        authority: "Ministry of Education, Government of India",
        program: "Pradhan Mantri Poshan Shakti Nirman (PM POSHAN)",
        basis: "Schedule II, National Food Security Act (NFSA), 2013",
        reviewedDate: "September 2026",
        disclaimer: "These norms represent statutory minimum nutritional quantities mandated across all Government and Government-aided schools nationwide."
    },
    standards: [
        {
            stage: "Primary Stage (Classes 1 to 5)",
            stageTe: "ప్రాథమిక స్థాయి (తరగతులు 1 నుండి 5)",
            calories: "450 kcal",
            protein: "12 grams",
            components: [
                { item: "Food Grains (Rice / Wheat)", itemTe: "ఆహార ధాన్యాలు (బియ్యం)", quantity: "100 grams" },
                { item: "Pulses (Dal)", itemTe: "పప్పు ధాన్యాలు", quantity: "20 grams" },
                { item: "Vegetables", itemTe: "కూరగాయలు", quantity: "50 grams" },
                { item: "Oil & Fat", itemTe: "నూనె మరియు కొవ్వు", quantity: "5 grams" }
            ]
        },
        {
            stage: "Upper Primary Stage (Classes 6 to 8)",
            stageTe: "ప్రాథమికోన్నత స్థాయి (తరగతులు 6 నుండి 8)",
            calories: "700 kcal",
            protein: "20 grams",
            components: [
                { item: "Food Grains (Rice / Wheat)", itemTe: "ఆహార ధాన్యాలు (బియ్యం)", quantity: "150 grams" },
                { item: "Pulses (Dal)", itemTe: "పప్పు ధాన్యాలు", quantity: "30 grams" },
                { item: "Vegetables", itemTe: "కూరగాయలు", quantity: "75 grams" },
                { item: "Oil & Fat", itemTe: "నూనె మరియు కొవ్వు", quantity: "7.5 grams" }
            ]
        }
    ]
};

export default midDayMealStandards;
