import { useState, useEffect, useCallback } from 'react';
import { schemeService } from '../api/schemes';

export function useSchemes({ category = 'All', search = '' } = {}) {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await schemeService.getAllSchemes({ category, search });
            setSchemes(data || []);
        } catch (err) {
            console.error('Failed to load welfare schemes:', err);
            setError(err.message || 'Unable to load welfare schemes from database.');
        } finally {
            setLoading(false);
        }
    }, [category, search]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        schemes,
        loading,
        error,
        refetch: loadData
    };
}

export default useSchemes;
