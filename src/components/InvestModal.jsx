import React, { useState } from 'react';
import { investmentService } from '../services/apiService';

const InvestModal = ({ asset, onPurchaseSuccess }) => {
    const [shares, setShares] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!asset) return null;

    const tokenPrice = asset.tokenPrice || 100;
    const totalCost = shares * tokenPrice;

    const handlePurchase = async () => {
        if (Number(shares) <= 0) {
            setError('Please enter a valid number of shares.');
            return;
        }
        if (Number(shares) > asset.availableShares) {
            setError(`Only ${asset.availableShares} shares available.`);
            return;
        }
        setLoading(true);
        setError('');
        try {
            await investmentService.buyAsset({
                assetId: asset._id,
                shares: Number(shares)
            });
            setSuccess(true);
            if (onPurchaseSuccess) onPurchaseSuccess();

            // Auto close success message after 2 seconds
            setTimeout(() => {
                setSuccess(false);
                setShares(1);
                // Close modal using bootstrap
                const modalElement = document.getElementById('investModal');
                // @ts-ignore
                const modal = window.bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }, 2000);

        } catch (err) {
            console.error("Investment failed", err);
            setError(err.response?.data?.message || 'Transaction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="investModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-primary text-white p-4 border-0">
                        <h5 className="modal-title fw-bold">Secure Asset Purchase</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        {success ? (
                            <div className="text-center py-4">
                                <div className="text-success mb-3">
                                    <i className="bi bi-check-circle-fill display-1"></i>
                                </div>
                                <h4 className="fw-bold">Investment Confirmed!</h4>
                                <p className="text-muted">Your transaction was successful. The shares have been added to your portfolio.</p>
                            </div>
                        ) : (
                            <>
                                <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                                    <img
                                        src={asset.image || "https://via.placeholder.com/60"}
                                        className="rounded-2 me-3"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        alt=""
                                    />
                                    <div>
                                        <h6 className="fw-bold mb-0 text-dark">{asset.title}</h6>
                                        <p className="text-muted small mb-0">{asset.location}</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger py-2 small mb-4" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-end mb-2">
                                        <label className="form-label small fw-bold text-uppercase mb-0" style={{ letterSpacing: '0.05rem' }}>Number of Shares</label>
                                        <span className="badge bg-light text-muted fw-normal border">
                                            {asset.availableShares} shares left
                                        </span>
                                    </div>
                                    <div className="input-group input-group-lg border rounded-3 overflow-hidden">
                                        <button
                                            className="btn btn-light border-0 px-4"
                                            type="button"
                                            onClick={() => setShares(Math.max(1, shares - 1))}
                                        >-</button>
                                        <input
                                            type="number"
                                            className="form-control border-0 text-center fw-bold bg-white"
                                            value={shares}
                                            onChange={(e) => setShares(Math.min(asset.availableShares, Math.max(1, e.target.value)))}
                                            min="1"
                                            max={asset.availableShares}
                                        />
                                        <button
                                            className="btn btn-light border-0 px-4"
                                            type="button"
                                            onClick={() => setShares(Math.min(asset.availableShares, Number(shares) + 1))}
                                        >+</button>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2 px-1">
                                        <span className="text-muted small">Price per share</span>
                                        <span className="fw-bold small">${tokenPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary bg-opacity-10 rounded-4 mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="text-muted fw-medium">Order Total</span>
                                        <h4 className="fw-bold text-primary mb-0">${totalCost.toLocaleString()}</h4>
                                    </div>
                                    <p className="text-muted x-small mb-0">Platform fees and gas are currently included.</p>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                                    onClick={handlePurchase}
                                    disabled={loading || asset.availableShares <= 0}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Processing Transaction...</>
                                    ) : asset.availableShares <= 0 ? (
                                        'Asset Sold Out'
                                    ) : (
                                        'Confirm and Invest'
                                    )}
                                </button>

                                <p className="text-center text-muted x-small mt-3 mb-0">
                                    <i className="bi bi-shield-lock me-1"></i>
                                    Institutional-grade security via atomic transaction logic.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestModal;
