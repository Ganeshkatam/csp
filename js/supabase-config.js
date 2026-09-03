// ==============================================================================
// Supabase Configuration
// Target Project: https://mjpuyirbwaznnomzifyv.supabase.co
// ==============================================================================

const SUPABASE_CONFIG = {
    url: "https://mjpuyirbwaznnomzifyv.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcHV5aXJid2F6bm5vbXppZnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTQ1MzQsImV4cCI6MjEwMzk5MDUzNH0.0bNQqeKwzPqmFzRlfZmRsCtFjWmbpYYwkH1VREbJpes",
    defaultVillageId: "00000000-0000-0000-0000-000000000001"
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
