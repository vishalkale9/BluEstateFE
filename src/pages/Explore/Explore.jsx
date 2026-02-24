import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import InvestModal from '../../components/InvestModal';
import { assetService } from '../../services/apiService';

const Explore = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                const params = filter !== 'All' ? { category: filter } : {};
                const response = await assetService.getAllAssets(params);
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);

                const formatted = data.map(asset => ({
                    ...asset,
                    image: asset.images && asset.images.length > 0
                        ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${asset.images[0]}`
                        : null,
                    progress: Math.round(((asset.totalShares - asset.availableShares) / asset.totalShares) * 100) || 0
                }));
                setAssets(formatted);
            } catch (error) {
                console.error("Failed to fetch assets", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [filter]);

    const categories = ['All', 'Residential', 'Commercial', 'Villas', 'Industrial', 'Land'];

    return (
        <div className="explore-page bg-light min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Global Marketplace</h2>
                        <p className="text-muted mb-0">Discover institutional-grade tokenized real estate.</p>
                    </div>

                    <div className="mt-3 mt-md-0">
                        <div className="d-flex gap-2 overflow-auto pb-2" style={{ maxWidth: '100vw' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`btn btn-sm rounded-pill px-4 fw-bold ${filter === cat ? 'btn-primary' : 'btn-white border'}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : assets.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                        <i className="bi bi-search display-1 text-muted opacity-25"></i>
                        <h4 className="mt-4 fw-bold">No Assets Found</h4>
                        <p className="text-muted">Try adjusting your filters or check back later.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {assets.map(asset => (
                            <div className="col-lg-4 col-md-6" key={asset._id}>
                                <PropertyCard
                                    id={asset._id}
                                    title={asset.title}
                                    location={asset.location}
                                    price={asset.price}
                                    yieldPercentage={asset.apr}
                                    progress={asset.progress}
                                    tokenPrice={asset.tokenPrice}
                                    availableShares={asset.availableShares}
                                    totalShares={asset.totalShares}
                                    image={asset.image}
                                    irr={asset.irr}
                                    listingType={asset.listingType}
                                    occupancyStatus={asset.occupancyStatus}
                                    onInvest={(a) => setSelectedAsset(a)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            <InvestModal
                asset={selectedAsset}
                onPurchaseSuccess={() => {
                    // Refresh current view
                    setFilter(filter);
                }}
            />
        </div>
    );
};

export default Explore;
