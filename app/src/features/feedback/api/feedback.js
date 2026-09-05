import { supabase, DEFAULT_VILLAGE_ID } from '../../../lib/supabase';
import { offlineQueue } from '../../../lib/offlineQueue';

export const feedbackService = {
    async submitFeedback(feedbackData) {
        const payload = {
            village_id: feedbackData.village_id || DEFAULT_VILLAGE_ID,
            name: feedbackData.name || 'Anonymous Resident',
            phone: feedbackData.phone || null,
            feedback_type: feedbackData.category || feedbackData.feedback_type || 'General',
            message: feedbackData.message || feedbackData.description,
            status: 'Pending'
        };

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            offlineQueue.enqueue({ type: 'feedback', data: payload });
            return { offline: true, success: true };
        }

        try {
            // Attempt citizen_feedback table first
            let res = await supabase.from('citizen_feedback').insert([payload]);
            if (res.error) {
                // Try alternate feedback table name if citizen_feedback is absent
                res = await supabase.from('feedback').insert([{
                    name: payload.name,
                    phone: payload.phone,
                    category: payload.feedback_type,
                    message: payload.message,
                    status: 'pending'
                }]);
            }

            if (res.error) {
                offlineQueue.enqueue({ type: 'feedback', data: payload });
                return { offline: true, success: true };
            }

            return { success: true };
        } catch (err) {
            offlineQueue.enqueue({ type: 'feedback', data: payload });
            return { offline: true, success: true };
        }
    },

    async getFeedbackList() {
        let { data, error } = await supabase
            .from('citizen_feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) {
            const alt = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });
            data = alt.data || [];
        }

        return data || [];
    }
};

export default feedbackService;
