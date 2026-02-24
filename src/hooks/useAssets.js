import { useState, useEffect } from 'react';
import { assetService } from '../services/apiService';

export const useAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const response = await assetService.getAllAssets();
            setAssets(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch assets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return { assets, loading, error, refreshAssets: fetchAssets };
};
