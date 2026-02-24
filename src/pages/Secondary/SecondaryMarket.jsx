import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { secondaryService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import BuyMarketSharesModal from '../../components/Secondary/BuyMarketSharesModal';

const SecondaryMarket = () => {
    const { isAuthenticated, user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState(null);
    const [buyingId, setBuyingId] = useState(null);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const response = await secondaryService.getMarketListings();
            setListings(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch secondary listings", error);
            toast.error("Could not load marketplace data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    useEffect(() => {
        if (selectedListing) {
            const modalEl = document.getElementById('buyMarketModal');
            if (modalEl) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
                modalEl.addEventListener('hidden.bs.modal', () => {
                    setSelectedListing(null);
                }, { once: true });
            }
        }
    }, [selectedListing]);


    const handleCancel = async (listingId) => {
        if (!window.confirm("Are you sure you want to remove this listing?")) return;
        try {
            await secondaryService.cancelListing(listingId);
            toast.success("Listing cancelled successfully");
            fetchListings();
        } catch (error) {
            console.error("Cancel failed", error);
            toast.error(error.response?.data?.message || "Could not cancel listing");
        }
    };

    const calculateProfit = (original, current) => {
        if (!original || !current) return 0;
        return ((current - original) / original * 100).toFixed(1);
    };

    return (
        <div className="secondary-market bg-light min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Trading Hub <span className="badge bg-primary-subtle text-primary fs-6 fw-bold ms-2 px-3 py-2 rounded-pill">P2P Marketplace</span></h2>
                        <p className="text-muted mb-0">Buy and sell shares directly with other global investors.</p>
                    </div>

                    <div className="mt-3 mt-md-0 d-flex gap-3">
                        <div className="p-3 bg-white rounded-4 shadow-sm border d-flex align-items-center">
                            <i className="bi bi-graph-up-arrow text-success fs-4 me-3"></i>
                            <div>
                                <p className="extra-small text-muted fw-bold text-uppercase mb-0">Total Volume</p>
                                <p className="fw-bold mb-0 text-dark">$1.2M+</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed text-muted">
                        <i className="bi bi-arrow-repeat display-1 opacity-25"></i>
                        <h4 className="mt-4 fw-bold text-dark">No Active Listings</h4>
                        <p>Be the first to list your shares in the secondary market!</p>
                        <a href="/portfolio" className="btn btn-outline-primary rounded-pill px-4 fw-bold mt-2">Go to Portfolio</a>
                    </div>
                ) : (
                    <div className="row g-4">
                        {listings.map(listing => {
                            const profit = calculateProfit(listing.asset?.tokenPrice, listing.pricePerShare);
                            const isSeller = listing.seller?._id === user?.id;

                            return (
                                <div className="col-lg-4 col-md-6" key={listing._id}>
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 secondary-listing-card transition-all">
                                        <div className="position-relative">
                                            <img
                                                src={listing.asset?.images?.[0] ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${listing.asset.images[0]}` : "https://via.placeholder.com/400x250"}
                                                alt={listing.asset?.title}
                                                className="img-fluid w-100"
                                                style={{ height: '220px', objectFit: 'cover' }}
                                            />
                                            <div className="position-absolute top-0 end-0 m-3">
                                                <span className={`badge ${profit >= 0 ? 'bg-success' : 'bg-danger'} shadow-sm px-3 py-2 rounded-pill fw-bold`}>
                                                    {profit >= 0 ? '+' : ''}{profit}% Profit
                                                </span>
                                            </div>
                                            <div className="position-absolute bottom-0 start-0 m-3">
                                                <div className="d-flex align-items-center bg-white bg-opacity-90 px-3 py-1 rounded-pill shadow-sm">
                                                    <div className="bg-primary text-white rounded-circle p-1 extra-small me-2">
                                                        <i className="bi bi-person"></i>
                                                    </div>
                                                    <span className="extra-small fw-bold text-dark">{listing.seller?.name || 'Authorized Seller'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body p-4">
                                            <h5 className="fw-bold text-dark truncate mb-1">{listing.asset?.title}</h5>
                                            <p className="text-muted extra-small mb-4"><i className="bi bi-geo-alt me-1"></i>{listing.asset?.location}</p>

                                            <div className="row g-2 mb-4">
                                                <div className="col-6">
                                                    <div className="p-3 bg-light rounded-4 text-center h-100">
                                                        <p className="extra-small text-muted fw-bold text-uppercase mb-1">Available</p>
                                                        <h5 className="fw-bold text-dark mb-0">{listing.sharesForSale} <span className="small fw-normal">Units</span></h5>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-center h-100 border border-primary border-opacity-10">
                                                        <p className="extra-small text-primary fw-bold text-uppercase mb-1">Price / Unit</p>
                                                        <h5 className="fw-bold text-primary mb-0">${listing.pricePerShare}</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                                                <div>
                                                    <p className="extra-small text-muted mb-0">Original Price</p>
                                                    <p className="fw-bold text-dark small mb-0">${listing.asset?.tokenPrice || 100}</p>
                                                </div>
                                                <div className="text-end">
                                                    <p className="extra-small text-muted mb-0">Total Value</p>
                                                    <p className="fw-bold text-primary small mb-0">${(listing.sharesForSale * listing.pricePerShare).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <button
                                                className={`btn w-100 py-3 rounded-pill fw-bold shadow-sm ${isSeller ? 'btn-outline-danger' : 'btn-primary'}`}
                                                onClick={() => isSeller ? handleCancel(listing._id) : setSelectedListing(listing)}
                                            >
                                                {isSeller ? (
                                                    'Cancel My Listing'
                                                ) : (
                                                    'Buy Shares'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
            <BuyMarketSharesModal
                listing={selectedListing}
                onPurchaseSuccess={fetchListings}
            />

            <style>{`
                .secondary-listing-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important;
                }
                .truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default SecondaryMarket;
