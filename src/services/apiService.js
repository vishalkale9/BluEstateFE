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
    getAllAssets: (params) => api.get('/assets', { params }),
    getAssetById: (id) => api.get(`/assets/${id}`),
    createAsset: (assetData) => api.post('/assets', assetData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateAsset: (id, assetData) => api.put(`/assets/${id}`, assetData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteAsset: (id) => api.delete(`/assets/${id}`),
};

export const investmentService = {
    buyAsset: (buyData) => api.post('/investments/buy', buyData),
    getPortfolio: () => api.get('/investments/portfolio'),
    getAllInvestments: () => api.get('/investments/all'), // Admin Only
};

export const kycService = {
    submitKYC: (formData) => api.post('/kyc/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getPendingKYC: () => api.get('/kyc/list'), // Admin Only
    verifyKYC: (userId, data) => api.put(`/kyc/verify/${userId}`, data), // Admin Only
};

export const userService = {
    getAllUsers: () => api.get('/users'),
    getUserById: (id) => api.get(`/users/${id}`),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export const secondaryService = {
    getMarketListings: () => api.get('/secondary/market'),
    listShares: (data) => api.post('/secondary/list', data),
    buyFromMarket: (listingId, data) => api.post(`/secondary/buy/${listingId}`, data),
    cancelListing: (listingId) => api.delete(`/secondary/cancel/${listingId}`),
};
