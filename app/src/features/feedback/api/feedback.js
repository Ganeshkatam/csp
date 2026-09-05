import { supabase, DEFAULT_VILLAGE_ID } from '../../../lib/supabase';
import { offlineQueue } from '../../../lib/offlineQueue';

export const feedbackService = {
    async submitFeedback(feedbackData) {
        const currentYear = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const refId = `VM-FB-${currentYear}-${randNum}`;

        const payload = {
            village_id: feedbackData.village_id || DEFAULT_VILLAGE_ID,
            reference_id: refId,
            name: feedbackData.name || 'Anonymous Resident',
            phone: feedbackData.phone || null,
            feedback_type: feedbackData.category || feedbackData.feedback_type || 'General',
            message: feedbackData.message || feedbackData.description,
            status: 'Pending'
        };

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            offlineQueue.enqueue({ type: 'feedback', data: payload });
            return { offline: true, success: true, reference_id: refId };
        }

        try {
            const res = await supabase.from('citizen_feedback').insert([payload]);

            if (res.error) {
                console.warn('Citizen feedback insertion note, queuing offline:', res.error);
                offlineQueue.enqueue({ type: 'feedback', data: payload });
                return { offline: true, success: true, reference_id: refId };
            }

            return { success: true, reference_id: refId };
        } catch (err) {
            console.warn('Network error during feedback submit, queuing offline:', err);
            offlineQueue.enqueue({ type: 'feedback', data: payload });
            return { offline: true, success: true, reference_id: refId };
        }
    },

    /**
     * Privacy-preserving public lookup of feedback / grievance status.
     * Invokes secure database function that returns strictly status metadata.
     * Contains zero PII (no citizen name, phone, or raw message).
     */
    async checkFeedbackStatus(referenceId) {
        if (!referenceId || typeof referenceId !== 'string') {
            throw new Error('Please enter a valid Reference ID.');
        }

        const { data, error } = await supabase.rpc('check_feedback_status', {
            p_reference_id: referenceId.trim()
        });

        if (error) throw error;
        return data;
    },

    async getFeedbackList() {
        let { data, error } = await supabase
            .from('citizen_feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) {
            data = [];
        }

        return data || [];
    }
};

export default feedbackService;
