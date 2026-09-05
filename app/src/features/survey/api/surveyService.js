import { supabase as defaultSupabase } from '../../../lib/supabase.js';

export const OFFLINE_SURVEY_STORAGE_KEY = 'csp_offline_surveys';

/**
 * Uploads a validated survey payload to Supabase with database-enforced idempotency.
 * 
 * 1. Checks if a record with survey_client_uuid already exists (idempotency guard).
 * 2. Inserts header record into survey_responses.
 * 3. Inserts normalized answer rows into survey_answers.
 * 
 * @param {Object} payload
 * @param {Object} [client] - Supabase client instance (defaults to app singleton)
 * @returns {Promise<{ id: string, alreadyExists: boolean, answersCount: number }>}
 */
export async function uploadSurveyPayload(payload, client = defaultSupabase) {
    if (!payload) throw new Error('Survey payload is missing.');
    const { answers, ...responseHeader } = payload;

    // 1. Assign deterministic client UUID for the response header if not already set
    const responseId = responseHeader.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));

    const payloadHeader = {
        ...responseHeader,
        id: responseId
    };

    // 2. Insert survey response header without .select() (write-only intake)
    const { error: headerErr } = await client
        .from('survey_responses')
        .insert(payloadHeader);

    if (headerErr) {
        // Postgres unique constraint violation on survey_responses_client_uuid_uidx (code 23505)
        if (headerErr.code === '23505') {
            return { id: responseId, alreadyExists: true, answersCount: 0 };
        }
        throw headerErr;
    }

    // 3. Insert normalized answer rows without .select() (write-only intake)
    if (answers && answers.length > 0) {
        const rowsToInsert = answers.map(a => ({
            response_id: responseId,
            question_code: a.question_code,
            answer_value: a.answer_value
        }));

        const { error: answersErr } = await client
            .from('survey_answers')
            .insert(rowsToInsert);

        if (answersErr) {
            throw answersErr;
        }

        return { id: responseId, alreadyExists: false, answersCount: rowsToInsert.length };
    }

    return { id: responseId, alreadyExists: false, answersCount: 0 };
}

/**
 * Retrieves the list of cached offline surveys from storage.
 * 
 * @param {string} [storageKey]
 * @param {Storage} [storageObj]
 * @returns {Array} Array of queued survey payloads
 */
export function getOfflineSurveys(storageKey = OFFLINE_SURVEY_STORAGE_KEY, storageObj = (typeof localStorage !== 'undefined' ? localStorage : null)) {
    if (!storageObj) return [];
    try {
        const raw = storageObj.getItem(storageKey);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * Enqueues a survey payload into the offline cache.
 * Avoids duplicate insertion if survey_client_uuid already exists in queue.
 * 
 * @param {Object} payload
 * @param {string} [storageKey]
 * @param {Storage} [storageObj]
 * @returns {number} Updated queue length
 */
export function enqueueOfflineSurvey(payload, storageKey = OFFLINE_SURVEY_STORAGE_KEY, storageObj = (typeof localStorage !== 'undefined' ? localStorage : null)) {
    if (!storageObj) throw new Error('Local storage is unavailable.');
    const queue = getOfflineSurveys(storageKey, storageObj);
    const exists = queue.some(item => item.survey_client_uuid && item.survey_client_uuid === payload.survey_client_uuid);
    if (!exists) {
        queue.push(payload);
        storageObj.setItem(storageKey, JSON.stringify(queue));
    }
    return queue.length;
}

/**
 * Synchronizes queued offline surveys to Supabase.
 * Retains records that fail synchronization in the queue; removes acknowledged records.
 * 
 * @param {string} [storageKey]
 * @param {Object} [client]
 * @param {Storage} [storageObj]
 * @returns {Promise<{ successCount: number, remainingCount: number, errors: Array }>}
 */
export async function syncOfflineSurveys(storageKey = OFFLINE_SURVEY_STORAGE_KEY, client = defaultSupabase, storageObj = (typeof localStorage !== 'undefined' ? localStorage : null)) {
    if (!storageObj) throw new Error('Local storage is unavailable.');
    const queue = getOfflineSurveys(storageKey, storageObj);
    if (queue.length === 0) {
        return { successCount: 0, remainingCount: 0, errors: [] };
    }

    const remaining = [];
    const errors = [];
    let successCount = 0;

    for (const item of queue) {
        try {
            await uploadSurveyPayload(item, client);
            successCount++;
        } catch (err) {
            errors.push({ respondent_code: item.respondent_code, error: err });
            remaining.push(item);
        }
    }

    storageObj.setItem(storageKey, JSON.stringify(remaining));
    return { successCount, remainingCount: remaining.length, errors };
}

/**
 * Fetches secure, database-calculated aggregated survey analytics.
 * Anonymous clients receive high-level distributions with zero access to raw household rows,
 * respondent codes, interviewer names, or timestamps.
 * 
 * @param {string} [filterWard] - Optional ward to filter by (or 'ALL')
 * @param {Object} [client] - Supabase client instance
 * @returns {Promise<{ total_responses: number, question_distributions: Object, locality_distribution: Object }>}
 */
export async function getSurveyAnalyticsSummary(filterWard = 'ALL', client = defaultSupabase) {
    const { data, error } = await client.rpc('get_survey_analytics_summary', {
        filter_ward: filterWard
    });
    if (error) throw error;
    return data;
}
