import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InvestModal from '../../components/InvestModal';
import { assetService } from '../../services/apiService';

const PropertyDetails = () => {
    const { id } = useParams();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedAssetForModal, setSelectedAssetForModal] = useState(null);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const response = await assetService.getAssetById(id);
                // Handle both wrapped { data: { ... } } and direct response
                const data = response.data?.data || response.data;

                if (!data || (!data.title && !data._id)) {
                    setAsset(null);
                    return;
                }

                // Formulate Intelligence data
                const formatted = {
                    ...data,
                    mainImage: data.images && data.images.length > 0
                        ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${data.images[0]}`
                        : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
                    gallery: data.images?.map(img => `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${img}`) || [],
                    progress: Math.round(((data.totalShares - data.availableShares) / data.totalShares) * 100) || 0,
                    landmarks: Array.isArray(data.nearbyLandmarks) ? data.nearbyLandmarks : (data.nearbyLandmarks?.split(',').map(s => s.trim()) || []),
                    highlights: Array.isArray(data.projectHighlights) ? data.projectHighlights : (data.projectHighlights?.split(',').map(s => s.trim()) || []),
                    amenitiesList: Array.isArray(data.amenities) ? data.amenities : (data.amenities?.split(',').map(s => s.trim()) || [])
                };
                setAsset(formatted);
            } catch (error) {
                console.error("Failed to fetch asset", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAsset();
    }, [id]);

    useEffect(() => {
        if (selectedAssetForModal) {
            const modalEl = document.getElementById('investModal');
            if (modalEl) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
                modalEl.addEventListener('hidden.bs.modal', () => {
                    setSelectedAssetForModal(null);
                }, { once: true });
            }
        }
    }, [selectedAssetForModal]);

    if (loading) return (
        <div className="min-vh-100 bg-light">
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        </div>
    );

    if (!asset) return (
        <div className="min-vh-100 bg-light">
            <Navbar />
            <div className="container py-5 text-center">
                <h3>Asset not found</h3>
                <Link to="/explore" className="btn btn-primary mt-3">Back to Marketplace</Link>
            </div>
        </div>
    );

    return (
        <div className="property-details-page bg-light min-vh-100">
            <Navbar />

            {/* Breadcrumb & Header */}
            <div className="container py-4">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/explore" className="text-decoration-none">Marketplace</Link></li>
                        <li className="breadcrumb-item active">{asset.category}</li>
                        <li className="breadcrumb-item active" aria-current="page">{asset.title}</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    {/* Left: Content Area */}
                    <div className="col-lg-8">
                        {/* Main Image Gallery */}
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <div className="position-relative">
                                <img
                                    src={asset.mainImage}
                                    alt={asset.title}
                                    className="img-fluid w-100"
                                    style={{ height: '500px', objectFit: 'cover' }}
                                />
                                <div className="position-absolute top-0 start-0 m-4 d-flex gap-2">
                                    <span className="badge bg-primary px-3 py-2 rounded-pill shadow">{asset.listingType}</span>
                                    <span className="badge bg-white text-dark px-3 py-2 rounded-pill shadow">
                                        <i className="bi bi-circle-fill text-success me-2 extra-small"></i> {asset.occupancyStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Property Tabs */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <ul className="nav nav-pills gap-2 mb-4">
                                {['Overview', 'Intelligence', 'Documents', 'Location'].map(tab => (
                                    <li className="nav-item" key={tab}>
                                        <button
                                            className={`nav-link rounded-pill px-4 fw-bold ${activeTab === tab ? 'active bg-primary' : 'bg-light text-muted'}`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="tab-content pt-2">
                                {activeTab === 'Overview' && (
                                    <div className="animate__animated animate__fadeIn">
                                        <h4 className="fw-bold mb-3">About the Project</h4>
                                        <p className="text-muted leading-relaxed mb-4">{asset.description}</p>

                                        <h5 className="fw-bold mb-3">Amenities</h5>
                                        <div className="row g-3 mb-4">
                                            {asset.amenitiesList?.map((amenity, idx) => (
                                                <div className="col-md-4" key={idx}>
                                                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                                        <i className="bi bi-check2-circle text-primary me-2"></i>
                                                        <span className="small fw-medium text-dark">{amenity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <h5 className="fw-bold mb-3">Key Highlights</h5>
                                        <div className="row g-3">
                                            {asset.highlights.map((h, idx) => (
                                                <div className="col-md-6" key={idx}>
                                                    <div className="card bg-primary bg-opacity-10 border-0 rounded-4 p-3 h-100">
                                                        <p className="small fw-bold text-primary mb-0">{h}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Intelligence' && (
                                    <div className="animate__animated animate__fadeIn">
                                        <div className="row g-4 mb-4">
                                            <div className="col-md-6">
                                                <div className="card border-0 bg-light rounded-4 p-4 h-100">
                                                    <h6 className="fw-bold text-muted text-uppercase small mb-3">Proximity Landmarks</h6>
                                                    <div className="d-flex flex-column gap-3">
                                                        {asset.landmarks.map((l, idx) => (
                                                            <div key={idx} className="d-flex align-items-center">
                                                                <div className="bg-white rounded-circle p-2 shadow-sm me-3">
                                                                    <i className="bi bi-geo-alt text-primary"></i>
                                                                </div>
                                                                <span className="fw-medium text-dark">{l}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100">
                                                    <h6 className="fw-bold text-white-50 text-uppercase small mb-3">Investment Growth</h6>
                                                    <div className="mb-4">
                                                        <h2 className="fw-bold text-primary mb-1">{asset.marketGrowth || '7.5%'}</h2>
                                                        <p className="small text-white-50">Annual Appreciation Forecast</p>
                                                    </div>
                                                    <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10">
                                                        <p className="extra-small mb-0">Market growth data based on local municipal and historical reports.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Documents' && (
                                    <div className="animate__animated animate__fadeIn py-4">
                                        <div className="row g-3">
                                            {['Valuation Report', 'Title Deed (Smart Contract)', 'Tokenization Plan', 'Legal Disclosure'].map((doc, idx) => (
                                                <div className="col-md-6" key={idx}>
                                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 hover-shadow transition-all">
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-file-earmark-pdf-fill text-danger fs-4 me-3"></i>
                                                            <span className="fw-bold small">{doc}</span>
                                                        </div>
                                                        <button className="btn btn-sm btn-light border rounded-pill">Download</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Location' && (
                                    <div className="animate__animated animate__fadeIn">
                                        <div className="card border-0 overflow-hidden rounded-4 shadow-sm" style={{ height: '400px' }}>
                                            <iframe
                                                title="Location Map"
                                                src={asset.mapUrl || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115531.06584227183!2d55.1950965!3d25.1932375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae`}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen=""
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                        <div className="mt-3 p-3 bg-white border border-dashed rounded-4 d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-compass text-primary fs-4 me-3"></i>
                                                <div>
                                                    <p className="fw-bold mb-0 small">Coordinates</p>
                                                    <p className="text-muted extra-small mb-0">{asset.lat}, {asset.lng}</p>
                                                </div>
                                            </div>
                                            <a href={asset.mapUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-pill px-4">Open in Maps</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Investment Widget */}
                    <div className="col-lg-4">
                        <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <div className="card border-0 shadow-lg rounded-4 p-4 mb-4">
                                <h5 className="fw-bold mb-4">Asset Performance</h5>

                                <div className="row g-2 mb-4">
                                    <div className="col-6">
                                        <div className="p-3 bg-primary bg-opacity-10 border-0 rounded-4 text-center">
                                            <p className="extra-small text-muted fw-bold text-uppercase mb-1">APR</p>
                                            <h4 className="fw-bold text-primary mb-0">{asset.apr}%</h4>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 bg-dark text-white border-0 rounded-4 text-center">
                                            <p className="extra-small text-white-50 fw-bold text-uppercase mb-1">IRR</p>
                                            <h4 className="fw-bold text-primary mb-0">{asset.irr}%</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Funding Progress</span>
                                        <span className="fw-bold small">{asset.progress}%</span>
                                    </div>
                                    <div className="progress rounded-pill mb-2" style={{ height: '10px' }}>
                                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${asset.progress}%` }}></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="extra-small text-muted">Goal reached in 12 days</span>
                                        <span className="extra-small fw-bold text-primary">{asset.availableShares} Units Left</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-light rounded-4 mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Share Price</span>
                                        <span className="fw-bold text-dark">${asset.tokenPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Minimum Investment</span>
                                        <span className="fw-bold text-dark">$100</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between mt-2">
                                        <span className="text-dark fw-bold">Total Valuation</span>
                                        <span className="fw-bold text-primary">${asset.price?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                                    onClick={() => setSelectedAssetForModal(asset)}
                                    disabled={asset.availableShares <= 0}
                                >
                                    {asset.availableShares <= 0 ? 'Sold Out' : (asset.listingType === 'Direct Purchase' ? 'Buy Full Ownership' : 'Invest Now')}
                                </button>

                                <p className="text-center text-muted extra-small mt-3 mb-0">
                                    <i className="bi bi-shield-lock me-1"></i>
                                    Institutional-grade security verified
                                </p>
                            </div>

                            {/* Property Info Card */}
                            <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
                                <h6 className="fw-bold mb-3">Asset Basics</h6>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Type</span>
                                        <span className="fw-medium small text-dark">{asset.propertyType}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Area</span>
                                        <span className="fw-medium small text-dark">{asset.area} sq.ft</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Year Built</span>
                                        <span className="fw-medium small text-dark">{asset.yearBuilt}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Category</span>
                                        <span className="fw-medium small text-dark">{asset.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <InvestModal asset={selectedAssetForModal} onPurchaseSuccess={() => window.location.reload()} />

            <style>{`
                .extra-small { font-size: 0.7rem; }
                .leading-relaxed { line-height: 1.8; }
                .hover-shadow:hover { 
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.1) !important;
                    transform: translateY(-2px);
                }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default PropertyDetails;
