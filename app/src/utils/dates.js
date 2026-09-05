const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function padZero(num) {
    return String(num).padStart(2, '0');
}

export function parseDateString(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return { year: y, month: m, day: d };
}

export function formatToISO(year, month, day) {
    return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

export function formatHumanDisplay(dateStr) {
    const parsed = parseDateString(dateStr);
    if (!parsed) return dateStr || '';
    const monthShort = MONTH_NAMES[parsed.month]?.slice(0, 3) || '';
    return `${padZero(parsed.day)} ${monthShort} ${parsed.year}`;
}

export function getTodayISO() {
    const today = new Date();
    return formatToISO(today.getFullYear(), today.getMonth(), today.getDate());
}
