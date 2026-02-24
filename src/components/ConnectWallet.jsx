import React, { useState } from 'react';
import { authService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const ConnectWallet = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleConnect = async (e) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        setLoading(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            const { data: nonceData } = await authService.getNonce();
            const nonce = nonceData.nonce;

            const message = `Verify your wallet ownership for BluEstate: ${nonce}`;
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, walletAddress],
            });

            await authService.linkWallet({ walletAddress, signature });
            await refreshUser();
            alert("Wallet linked successfully!");
        } catch (error) {
            console.error("Wallet linking failed", error);
            alert(error.response?.data?.message || "Failed to link wallet.");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (e) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (!window.confirm("Are you sure you want to disconnect your wallet?")) return;

        setLoading(true);
        try {
            await authService.unlinkWallet();
            await refreshUser();
            alert("Wallet disconnected.");
        } catch (error) {
            console.error("Wallet unlinking failed", error);
        } finally {
            setLoading(false);
        }
    };

    const truncateAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    if (user?.walletAddress) {
        return (
            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border border-primary border-opacity-25 w-100">
                <div className="small fw-semibold text-primary">
                    <i className="bi bi-link-45deg me-1"></i>
                    {truncateAddress(user.walletAddress)}
                </div>
                <button
                    className="btn btn-sm btn-outline-danger border-0 p-1"
                    onClick={handleDisconnect}
                    disabled={loading}
                    title="Disconnect Wallet"
                >
                    <i className="bi bi-x-circle"></i>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="btn btn-primary btn-sm w-100 py-2 rounded-3 fw-bold shadow-sm"
            disabled={loading}
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
                <i className="bi bi-wallet2 me-2"></i>
            )}
            {loading ? "Linking..." : "Link Wallet (MetaMask)"}
        </button>
    );
};

export default ConnectWallet;
