import React, { useState, useEffect } from 'react';
import { secondaryService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const BuyMarketSharesModal = ({ listing, onPurchaseSuccess }) => {
    const [sharesToBuy, setSharesToBuy] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (listing) {
            setSharesToBuy(1);
        }
    }, [listing]);

    if (!listing) return null;

    const handlePurchase = async (e) => {
        e.preventDefault();

        if (sharesToBuy > listing.sharesForSale) {
            toast.error(`Only ${listing.sharesForSale} shares available.`);
            return;
        }

        setLoading(true);
        try {
            await secondaryService.buyFromMarket(listing._id, { sharesToBuy: Number(sharesToBuy) });
            toast.success(`Successfully purchased ${sharesToBuy} shares!`);

            // Close modal
            const modalElement = document.getElementById('buyMarketModal');
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();

            if (onPurchaseSuccess) onPurchaseSuccess();
        } catch (error) {
            console.error("Purchase failed", error);
            toast.error(error.response?.data?.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    const totalCost = sharesToBuy * listing.pricePerShare;

    return (
        <div className="modal fade" id="buyMarketModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-primary text-white p-4 border-0">
                        <h5 className="modal-title fw-bold">P2P Partial Fill Order</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="alert alert-info border-0 rounded-4 small mb-4">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            You are buying shares directly from <strong>{listing.seller?.name || 'Authorized Seller'}</strong>.
                        </div>

                        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-4">
                            <img
                                src={listing.asset?.images?.[0] ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${listing.asset.images[0]}` : "https://via.placeholder.com/60"}
                                className="rounded-3 me-3"
                                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                alt=""
                            />
                            <div>
                                <h6 className="fw-bold mb-1 text-dark">{listing.asset?.title}</h6>
                                <div className="d-flex gap-2">
                                    <span className="badge bg-white text-primary border border-primary-subtle extra-small rounded-pill">
                                        ${listing.pricePerShare} / Share
                                    </span>
                                    <span className="badge bg-white text-muted border extra-small rounded-pill">
                                        {listing.sharesForSale} Available
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePurchase}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase text-muted">Amount to Purchase</label>
                                <div className="input-group input-group-lg bg-light rounded-4 overflow-hidden border-0">
                                    <button
                                        type="button"
                                        className="btn btn-light border-0 px-4"
                                        onClick={() => setSharesToBuy(Math.max(1, sharesToBuy - 1))}
                                    >
                                        <i className="bi bi-dash-lg"></i>
                                    </button>
                                    <input
                                        type="number"
                                        className="form-control bg-transparent border-0 text-center fw-bold"
                                        min="1"
                                        max={listing.sharesForSale}
                                        value={sharesToBuy}
                                        onChange={(e) => setSharesToBuy(Math.min(listing.sharesForSale, Math.max(1, Number(e.target.value))))}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-light border-0 px-4"
                                        onClick={() => setSharesToBuy(Math.min(listing.sharesForSale, sharesToBuy + 1))}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-primary bg-opacity-10 rounded-4 mb-4 border border-primary border-opacity-10">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted small fw-medium">Order Total</span>
                                    <h3 className="fw-bold text-primary mb-0">${totalCost.toLocaleString()}</h3>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="extra-small text-muted">Settlement Currency</span>
                                    <span className="extra-small fw-bold text-dark">USD / Stablecoin Equivalent</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                                disabled={loading || sharesToBuy <= 0}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Confirming Order...</>
                                ) : (
                                    'Execute Partial Purchase'
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

export default BuyMarketSharesModal;
