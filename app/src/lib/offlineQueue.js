const STORAGE_KEY = 'csp_offline_queue_v1';

export const offlineQueue = {
    getQueue() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    enqueue(item) {
        const queue = this.getQueue();
        const payload = {
            ...item,
            id: item.id || `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            enqueuedAt: new Date().toISOString()
        };
        queue.push(payload);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        } catch (err) {
            console.error('Failed to save offline item:', err);
        }
        return payload;
    },

    dequeue(id) {
        const queue = this.getQueue().filter(item => item.id !== id);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        } catch (err) {
            console.error('Failed to update offline queue:', err);
        }
    },

    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.error('Failed to clear offline queue:', err);
        }
    }
};

export default offlineQueue;
