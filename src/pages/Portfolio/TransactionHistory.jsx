import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { financialService } from '../../services/apiService';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await financialService.getStatement();
            setTransactions(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch transaction history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatHash = (hash) => {
        if (!hash) return "INTERNAL_LEDGER";
        return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Fallback for simple feedback if toast is not available:
        alert("Hash copied to clipboard!");
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case 'Primary_Purchase':
            case 'Investment':
                return { badge: 'bg-primary-subtle text-primary', icon: 'bi-building', label: 'Primary Purchase' };
            case 'Secondary_Purchase':
            case 'p2p_buy':
                return { badge: 'bg-purple-subtle text-purple', icon: 'bi-cart-plus', label: 'Secondary Purchase' };
            case 'Secondary_Sale':
            case 'p2p_sell':
                return { badge: 'bg-success-subtle text-success', icon: 'bi-cash-coin', label: 'Secondary Sale' };
            case 'Rent_Yield':
                return { badge: 'bg-success-subtle text-success', icon: 'bi-gift', label: 'Rent Yield' };
            case 'Deposit':
                return { badge: 'bg-info-subtle text-info', icon: 'bi-wallet2', label: 'Wallet Deposit' };
            default:
                return { badge: 'bg-secondary-subtle text-secondary', icon: 'bi-arrow-left-right', label: type.replace('_', ' ') };
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="mb-5">
                    <h2 className="fw-bold text-dark mb-1">Financial Statement</h2>
                    <p className="text-muted">An institutional-grade ledger of all capital movements and RWA settlements.</p>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-white border-bottom">
                                <tr>
                                    <th className="px-4 py-3 small fw-bold text-uppercase text-muted">Transaction Details</th>
                                    <th className="px-4 py-3 small fw-bold text-uppercase text-muted">Type</th>
                                    <th className="px-4 py-3 small fw-bold text-uppercase text-muted">Settlement Date</th>
                                    <th className="px-4 py-3 small fw-bold text-uppercase text-muted text-end">Amount (USD)</th>
                                    <th className="px-4 py-3 small fw-bold text-uppercase text-muted text-end">Audit Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No cleared transactions in history.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => {
                                        const style = getTypeStyle(tx.type);
                                        return (
                                            <tr key={tx._id}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className={`p-2 rounded-3 me-3 ${style.badge} border`}>
                                                            <i className={`bi ${style.icon}`}></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{tx.asset?.title || tx.assetTitle || 'System Settlement'}</div>
                                                            <div className="small text-muted">{tx.shares || 0} Units</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge ${style.badge} rounded-pill px-3 py-1 fw-bold extra-small`}>
                                                        {style.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted small">
                                                    {new Date(tx.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </td>
                                                <td className={`px-4 py-3 text-end fw-bold ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <div className="d-flex align-items-center justify-content-end gap-2">
                                                        <code className="extra-small text-primary bg-primary bg-opacity-10 px-2 py-1 rounded cursor-pointer" title={tx.transactionHash}>
                                                            {formatHash(tx.transactionHash)}
                                                        </code>
                                                        {tx.transactionHash && (
                                                            <i
                                                                className="bi bi-copy text-muted cursor-pointer hover-primary"
                                                                onClick={() => copyToClipboard(tx.transactionHash)}
                                                                title="Copy Hash"
                                                            ></i>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded-4 border border-dashed text-center">
                    <i className="bi bi-shield-check text-success fs-3 mb-2 d-inline-block"></i>
                    <p className="small text-muted mb-0">Full audit logs are immutable. Contact support for certified Web3 settlement receipts.</p>
                </div>
            </div>

            <Footer />
            <style>{`
                .extra-small { font-size: 0.7rem; }
                .text-purple { color: #6f42c1; }
                .bg-purple-subtle { background-color: rgba(111, 66, 193, 0.1); }
                .cursor-pointer { cursor: pointer; }
                .hover-primary:hover { color: var(--bs-primary) !important; }
            `}</style>
        </div>
    );
};

export default TransactionHistory;
