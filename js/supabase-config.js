// ==============================================================================
// Supabase Configuration
// Target Project: Configured via environment variables
// ==============================================================================

const SUPABASE_CONFIG = {
    url: window.SUPABASE_URL || (window.ENV && window.ENV.SUPABASE_URL) || "",
    anonKey: window.SUPABASE_ANON_KEY || (window.ENV && window.ENV.SUPABASE_ANON_KEY) || "",
    defaultVillageId: window.DEFAULT_VILLAGE_ID || (window.ENV && window.ENV.DEFAULT_VILLAGE_ID) || "00000000-0000-0000-0000-000000000001"
};

// Initialize Supabase Client
let supabaseClient = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        if (typeof supabase === 'undefined') {
            console.error('Supabase library not loaded. Please include supabase-js script.');
            return null;
        }
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
    return supabaseClient;
}
