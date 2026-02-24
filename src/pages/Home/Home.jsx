import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Footer from '../../components/Footer';
import WhyChooseUs from '../../components/WhyChooseUs';
import FAQ from '../../components/FAQ';
import InvestModal from '../../components/InvestModal';
import { assetService } from '../../services/apiService';

const Home = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const staticProperties = [
        {
            _id: 'static-1',
            title: "Prime Burj Khalifa Office",
            location: "Dubai, UAE",
            price: 5000000,
            yieldPercentage: 12.5,
            irr: 15.8,
            progress: 75,
            totalShares: 5000,
            availableShares: 2500,
            tokenPrice: 1000,
            propertyType: "Office",
            listingType: "Fractional",
            occupancyStatus: "Rented",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            _id: 'static-2',
            title: "London City Apartments",
            location: "London, UK",
            price: 2400000,
            yieldPercentage: 6.2,
            irr: 8.5,
            progress: 40,
            totalShares: 2400,
            availableShares: 1440,
            tokenPrice: 1000,
            propertyType: "Residential",
            listingType: "Fractional",
            occupancyStatus: "Vacant",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            _id: 'static-3',
            title: "Miami Beach Luxury Villa",
            location: "Miami, Florida",
            price: 3600000,
            yieldPercentage: 11.4,
            irr: 13.2,
            progress: 92,
            totalShares: 3600,
            availableShares: 288,
            tokenPrice: 1000,
            propertyType: "Healthcare",
            listingType: "Direct Purchase",
            occupancyStatus: "Rented",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await assetService.getAllAssets({ isFeatured: true });
                const rawData = response.data;
                // Handle both array and { success, data } formats
                const assetArray = Array.isArray(rawData) ? rawData : (rawData?.data || rawData?.assets || []);

                const fetchedAssets = assetArray.map(asset => {
                    // Construction for Image URLs as per User Guide
                    const imageUrl = asset.images && asset.images.length > 0
                        ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${asset.images[0]}`
                        : null;

                    // Standardizing fields
                    return {
                        ...asset,
                        image: imageUrl,
                        progress: Math.round(((asset.totalShares - asset.availableShares) / asset.totalShares) * 100) || 0
                    };
                });

                if (fetchedAssets.length > 0) {
                    setAssets(fetchedAssets);
                } else {
                    setAssets(staticProperties);
                }
            } catch (error) {
                console.error("Failed to fetch assets", error);
                setAssets(staticProperties);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, []);

    return (
        <div className="home-page bg-light min-vh-100">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section bg-white py-5 mb-5 border-bottom">
                <div className="container py-lg-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h1 className="display-4 fw-bold text-dark mb-4 lh-tight">
                                Unlock the Future of <span className="text-primary italic">Real Estate</span>
                            </h1>
                            <p className="lead text-muted mb-5 fs-5">
                                Invest in premium global properties starting from just $100.
                                Professional real world asset tokenization for institutional and retail investors.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                                    Start Investing
                                </button>
                                <button className="btn btn-outline-dark btn-lg px-5 py-3 rounded-pill fw-bold">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6 ps-lg-5">
                            <img
                                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Modern Real Estate"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Property Grid Section */}
            <section className="py-5" id="explore">
                <div className="container">
                    <div className="mb-5 text-center">
                        <h2 className="fw-bold text-dark display-6 mb-2">Editor's Picks</h2>
                        <p className="text-muted">Explore our most popular real-world asset opportunities.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {assets.map(property => (
                                <div className="col-lg-4 col-md-6" key={property._id || property.id}>
                                    <PropertyCard
                                        id={property._id || property.id}
                                        title={property.title || property.name}
                                        location={property.location}
                                        price={property.price}
                                        yieldPercentage={property.yieldPercentage || property.yield}
                                        progress={property.progress || property.funding_progress}
                                        tokenPrice={property.tokenPrice}
                                        availableShares={property.availableShares}
                                        totalShares={property.totalShares}
                                        image={property.image}
                                        irr={property.irr}
                                        listingType={property.listingType}
                                        occupancyStatus={property.occupancyStatus}
                                        onInvest={(asset) => setSelectedAsset(asset)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <WhyChooseUs />

            {/* FAQ Section */}
            <FAQ />

            <Footer />

            <InvestModal
                asset={selectedAsset}
                onPurchaseSuccess={() => {
                    // Refresh data or show notification
                    console.log("Purchase successful");
                }}
            />
        </div>
    );
};

export default Home;
