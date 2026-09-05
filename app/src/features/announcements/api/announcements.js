import { supabase } from '../../../lib/supabase';

export const announcementService = {
    async getAnnouncements() {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('status', 'published')
            .order('event_date', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getAnnouncementById(id) {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    }
};

export default announcementService;
