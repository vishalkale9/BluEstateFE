import api from '../utils/api';

export const authService = {
    // Web2 Auth
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me'),

    // Web3 Linking Logic
    getNonce: () => api.get('/auth/nonce'),
    linkWallet: (walletData) => api.post('/auth/link-wallet', walletData),
    unlinkWallet: () => api.delete('/auth/unlink-wallet'),
};

export const assetService = {
    getAllAssets: () => api.get('/assets'),
    getAssetById: (id) => api.get(`/assets/${id}`),
};
