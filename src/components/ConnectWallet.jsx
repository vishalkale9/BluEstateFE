import React, { useState } from 'react';
import { authService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const ConnectWallet = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        setLoading(true);
        try {
            // 1. Connect MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // 2. Fetch Nonce
            const { data: nonceData } = await authService.getNonce();
            const nonce = nonceData.nonce;

            // 3. Sign Message
            const message = `Verify your wallet ownership for BluEstate: ${nonce}`;
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, walletAddress],
            });

            // 4. Link Wallet to Backend
            await authService.linkWallet({ walletAddress, signature });

            // 5. Update Global User State
            await refreshUser();
            alert("Wallet linked successfully!");
        } catch (error) {
            console.error("Wallet linking failed", error);
            alert(error.response?.data?.message || "Failed to link wallet.");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
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
            <div className="btn-group">
                <button className="btn btn-outline-primary rounded-pill px-4 fw-bold dropdown-toggle shadow-sm" data-bs-toggle="dropdown">
                    <i className="bi bi-wallet2 me-2"></i>
                    {truncateAddress(user.walletAddress)}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4">
                    <li>
                        <button className="dropdown-item text-danger py-2" onClick={handleDisconnect} disabled={loading}>
                            <i className="bi bi-link-45deg me-2"></i> Disconnect Wallet
                        </button>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="btn btn-primary px-4 fw-bold rounded-pill shadow-sm"
            disabled={loading}
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
                <i className="bi bi-lightning-charge-fill me-2"></i>
            )}
            {loading ? "Linking..." : "Connect Wallet"}
        </button>
    );
};

export default ConnectWallet;
