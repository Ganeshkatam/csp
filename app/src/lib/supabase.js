import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://mjpuyirbwaznnomzifyv.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcHV5aXJid2F6bm5vbXppZnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTQ1MzQsImV4cCI6MjEwMzk5MDUzNH0.0bNQqeKwzPqmFzRlfZmRsCtFjWmbpYYwkH1VREbJpes';
export const DEFAULT_VILLAGE_ID = '00000000-0000-0000-0000-000000000001';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
