import { supabase, DEFAULT_VILLAGE_ID } from '../../../lib/supabase';

export const villageService = {
    async getVillageProfile() {
        const { data, error } = await supabase
            .from('villages')
            .select('*')
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    },

    async updateVillageProfile(profile) {
        const payload = {
            name: profile.name,
            name_te: profile.name_te,
            gram_panchayat: profile.gram_panchayat,
            mandal: profile.mandal,
            district: profile.district,
            state: profile.state,
            description: profile.description,
            description_te: profile.description_te,
            source: profile.source,
            verified_on: profile.verified_on
        };

        const { data: existing } = await supabase.from('villages').select('id').limit(1);
        
        let error;
        if (existing && existing.length > 0) {
            const res = await supabase.from('villages').update(payload).eq('id', existing[0].id);
            error = res.error;
        } else {
            const res = await supabase.from('villages').insert([{ id: DEFAULT_VILLAGE_ID, ...payload }]);
            error = res.error;
        }

        if (error) throw error;
        return true;
    }
};

export default villageService;
