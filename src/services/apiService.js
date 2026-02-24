import api from '../utils/api';

export const authService = {
    // Traditional Web2 Auth
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),

    // Web3 Auth
    getNonce: (walletAddress) => api.get(`/auth/nonce/${walletAddress}`),
    verifySignature: (walletAddress, signature) =>
        api.post('/auth/verify', { walletAddress, signature }),

    logout: () => {
        localStorage.removeItem('token');
    }
};

export const assetService = {
    getAllAssets: () => api.get('/assets'),
    getAssetById: (id) => api.get(`/assets/${id}`),
    createAsset: (assetData) => {
        // Note: assetData should be FormData for image uploads
        return api.post('/assets', assetData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
