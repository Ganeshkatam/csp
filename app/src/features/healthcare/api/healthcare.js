import { supabase } from '../../../lib/supabase';

export const healthcareService = {
    async getHealthcareFacilities() {
        const { data, error } = await supabase
            .from('institutions')
            .select('*')
            .eq('status', 'published')
            .eq('type', 'PHC')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getHealthcareContacts() {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('status', 'published')
            .eq('category', 'Healthcare')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getHealthcareSchemes() {
        const { data, error } = await supabase
            .from('schemes')
            .select('*')
            .eq('status', 'published')
            .eq('category', 'Healthcare')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getHealthcareAnnouncements() {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('status', 'published')
            .eq('category', 'Healthcare')
            .order('event_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getFacilityById(id) {
        const { data, error } = await supabase
            .from('institutions')
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    }
};

export default healthcareService;
