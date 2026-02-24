import React, { useState } from 'react';
import { secondaryService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const ListSharesModal = ({ asset, availableShares, onListingSuccess }) => {
    const [shares, setShares] = useState(1);
    const [price, setPrice] = useState(asset?.tokenPrice || 100);
    const [loading, setLoading] = useState(false);

    if (!asset) return null;

    const handleList = async (e) => {
        e.preventDefault();
        if (shares > availableShares) {
            toast.error(`You only own ${availableShares} shares.`);
            return;
        }

        setLoading(true);
        try {
            await secondaryService.listShares({
                assetId: asset._id,
                shares: Number(shares),
                pricePerShare: Number(price)
            });
            toast.success("Shares listed successfully on marketplace!");

            // Close modal using bootstrap
            const modalElement = document.getElementById('listSharesModal');
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();

            if (onListingSuccess) onListingSuccess();
        } catch (error) {
            console.error("Listing failed", error);
            toast.error(error.response?.data?.message || "Could not list shares");
        } finally {
            setLoading(false);
        }
    };

    const originalPrice = asset.tokenPrice || 100;
    const profit = (((Number(price) - originalPrice) / originalPrice) * 100).toFixed(1);

    return (
        <div className="modal fade" id="listSharesModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-dark text-white p-4 border-0">
                        <h5 className="modal-title fw-bold">Secondary Market Listing</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                            <img
                                src={asset.images?.[0] ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${asset.images[0]}` : "https://via.placeholder.com/60"}
                                className="rounded-2 me-3"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                alt=""
                            />
                            <div>
                                <h6 className="fw-bold mb-0 text-dark">{asset.title}</h6>
                                <p className="text-muted small mb-0">{availableShares} Shares Owned</p>
                            </div>
                        </div>

                        <form onSubmit={handleList}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted">Shares to Sell</label>
                                <input
                                    type="number"
                                    className="form-control form-control-lg bg-light border-0 fw-bold"
                                    min="1"
                                    max={availableShares}
                                    value={shares}
                                    onChange={(e) => setShares(e.target.value)}
                                    required
                                />
                                <div className="form-text extra-small">You can list up to {availableShares} units.</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted">Asking Price (Per Share)</label>
                                <div className="input-group input-group-lg bg-light rounded-3 overflow-hidden">
                                    <span className="input-group-text bg-transparent border-0">$</span>
                                    <input
                                        type="number"
                                        className="form-control bg-transparent border-0 fw-bold"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-between mt-2 px-1">
                                    <span className="extra-small text-muted">Original Price: ${originalPrice}</span>
                                    <span className={`extra-small fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {profit >= 0 ? '+' : ''}{profit}% Margin
                                    </span>
                                </div>
                            </div>

                            <div className="bg-primary bg-opacity-10 p-4 rounded-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted small fw-medium">Est. Payout upon Sale</span>
                                    <h4 className="fw-bold text-primary mb-0">${(shares * price).toLocaleString()}</h4>
                                </div>
                                <p className="extra-small text-muted mb-0">Platform handles escrow and secure title transfer.</p>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                                disabled={loading || shares <= 0}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Creating Listing...</>
                                ) : (
                                    'Initialize Market Listing'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
                .extra-small { font-size: 0.7rem; }
            `}</style>
        </div>
    );
};

export default ListSharesModal;
