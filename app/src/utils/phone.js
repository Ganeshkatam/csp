/**
 * Formats an Indian phone number for clean human-readable display.
 * Examples:
 *   "08772277100" -> "0877-227-7100"
 *   "9989001122"  -> "99890-01122"
 *   "108"         -> "108"
 *   "1912"        -> "1912"
 */
export function formatPhoneDisplay(phone) {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');

    // Emergency & toll-free short codes (3-5 digits): return as-is
    if (digits.length <= 5) return phone;

    // 11-digit landline with STD code
    if (digits.length === 11 && digits.startsWith('0')) {
        return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    // 10-digit standard Indian mobile
    if (digits.length === 10) {
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }

    return phone;
}

export function createTelLink(phone) {
    if (!phone) return '#';
    const clean = phone.replace(/[^0-9+]/g, '');
    return `tel:${clean}`;
}
