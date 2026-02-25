import React, { useState } from 'react';
import { financialService } from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const DepositModal = ({ onDepositSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();

    const handleDeposit = async (e) => {
        e.preventDefault();
        const depositAmount = parseFloat(amount);

        if (!depositAmount || depositAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            const response = await financialService.deposit({ amount: depositAmount });
            toast.success(`Succesfully deposited $${depositAmount.toLocaleString()}!`);

            // Update local user state if provided by API
            if (response.data?.newBalance !== undefined) {
                setUser(prev => ({ ...prev, walletBalance: response.data.newBalance }));
            }

            // Close modal using Bootstrap instance
            const modalEl = document.getElementById('depositModal');
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();

            setAmount('');
            if (onDepositSuccess) onDepositSuccess();
        } catch (error) {
            console.error("Deposit failed", error);
            toast.error(error.response?.data?.message || "Deposit transaction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="depositModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-success text-white p-4 border-0">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-bank me-2"></i> Top Up Balance
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="alert alert-success border-0 rounded-4 small mb-4">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            Funds will be added to your <strong>Verified Asset Wallet</strong> instantly.
                        </div>

                        <form onSubmit={handleDeposit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted">Amount to Deposit (USD)</label>
                                <div className="input-group input-group-lg bg-light rounded-4 overflow-hidden border-0">
                                    <span className="input-group-text bg-transparent border-0 pe-0">
                                        <i className="bi bi-currency-dollar text-muted"></i>
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control bg-transparent border-0 fw-bold"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row g-2 mb-4">
                                {[100, 500, 1000, 5000].map(val => (
                                    <div className="col-3" key={val}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-success btn-sm w-100 rounded-pill extra-small fw-bold"
                                            onClick={() => setAmount(val.toString())}
                                        >
                                            +${val.toLocaleString()}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-success bg-opacity-10 rounded-4 mb-4 border border-success border-opacity-10">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted small fw-medium">Settlement Method</span>
                                    <span className="badge bg-white text-success border border-success-subtle rounded-pill extra-small px-3">Instant Bank Wire</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing Deposit...</>
                                ) : (
                                    'Confirm Top Up'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
                .extra-small { font-size: 0.70rem; }
            `}</style>
        </div>
    );
};

export default DepositModal;
