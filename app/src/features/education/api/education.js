import { supabase } from '../../../lib/supabase';

export const educationService = {
    async getEducationInstitutions() {
        const { data, error } = await supabase
            .from('institutions')
            .select('*')
            .eq('status', 'published')
            .eq('type', 'Education')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async getInstitutionById(id) {
        const { data, error } = await supabase
            .from('institutions')
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    }
};

export default educationService;
