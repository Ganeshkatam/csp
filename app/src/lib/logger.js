const isDev = import.meta.env.DEV;

export const logger = {
    info: (...args) => {
        if (isDev) console.log('[INFO]', ...args);
    },
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },
    error: (...args) => {
        console.error('[ERROR]', ...args);
    }
};

export default logger;
