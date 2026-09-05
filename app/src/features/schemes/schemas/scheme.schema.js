/**
 * Schema contract definition for verified civic government welfare programs.
 * Covers all 12 authoritative fields required for civic transparency.
 */

export const SCHEME_STATUS = {
    DRAFT: 'draft',
    VERIFIED: 'verified',
    PUBLISHED: 'published'
};

export const REQUIRED_SCHEME_FIELDS = [
    'name',
    'department',
    'category',
    'description',
    'benefits',
    'eligibility',
    'documents_required',
    'application_process',
    'official_url',
    'source',
    'verified_on',
    'status'
];

/**
 * Validates whether a scheme record fulfills the required transparency contract.
 * @param {Object} scheme 
 * @returns {{ isValid: boolean, missing: string[] }}
 */
export function validateSchemeRecord(scheme) {
    if (!scheme || typeof scheme !== 'object') {
        return { isValid: false, missing: REQUIRED_SCHEME_FIELDS };
    }

    const missing = [];
    for (const field of REQUIRED_SCHEME_FIELDS) {
        if (!scheme[field] || String(scheme[field]).trim().length === 0) {
            missing.push(field);
        }
    }

    return {
        isValid: missing.length === 0,
        missing
    };
}
