import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you might decode the token or fetch user profile here
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        return response.data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // 1. Get Nonce
            const nonceRes = await authService.getNonce(walletAddress);
            const nonce = nonceRes.data.nonce;

            // 2. Sign Nonce
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [nonce, walletAddress],
            });

            // 3. Verify
            const verifyRes = await authService.verifySignature(walletAddress, signature);
            const { token, user } = verifyRes.data;

            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
            return verifyRes.data;

        } catch (error) {
            console.error("Wallet connection failed", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, connectWallet }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
