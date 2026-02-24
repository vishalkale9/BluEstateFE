import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ListSharesModal from '../../components/Secondary/ListSharesModal';
import { investmentService } from '../../services/apiService';

const Portfolio = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedToSell, setSelectedToSell] = useState(null);

    const fetchPortfolio = async () => {
        setLoading(true);
        try {
            const response = await investmentService.getPortfolio();
            // Expected Format: { success: true, count: X, summary: { totalInvested, totalShares }, data: [...] }
            setPortfolioData(response.data);
        } catch (error) {
            console.error("Failed to fetch portfolio", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    useEffect(() => {
        if (selectedToSell) {
            const modalEl = document.getElementById('listSharesModal');
            if (modalEl) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
                modalEl.addEventListener('hidden.bs.modal', () => {
                    setSelectedToSell(null);
                }, { once: true });
            }
        }
    }, [selectedToSell]);

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-column">
                <Navbar />
                <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading Ledger...</span>
                        </div>
                        <p className="text-muted fw-bold">Synchronizing Portfolio Data...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const summary = portfolioData?.summary || { totalInvested: 0, totalShares: 0 };
    const investments = portfolioData?.data || [];

    // Monthly Yield Calculation based on APR
    const totalEstMonthly = investments.reduce((acc, inv) => {
        const principal = inv.totalAmount || 0;
        const apr = inv.asset?.apr || 0;
        return acc + ((principal * (apr / 100)) / 12);
    }, 0);

    return (
        <div className="min-vh-100 bg-light">
            <Navbar />

            {/* Dashboard Header */}
            <div className="bg-white border-bottom shadow-sm">
                <div className="container py-4 py-lg-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-7 text-center text-lg-start">
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3 fw-bold small">
                                <i className="bi bi-shield-check me-1"></i> SECURE ASSET LEDGER
                            </span>
                            <h1 className="display-5 fw-bold text-dark mb-2">Investment Portfolio</h1>
                            <p className="text-muted lead mb-0">Transparent tracking of your institutional-grade property shares.</p>
                        </div>
                        <div className="col-lg-5">
                            <div className="row g-3">
                                <div className="col-md-6 col-6">
                                    <div className="card border-0 bg-dark text-white rounded-4 p-3 p-lg-4 shadow-lg h-100">
                                        <p className="extra-small opacity-75 mb-1 text-uppercase fw-bold">Total Capital</p>
                                        <h3 className="fw-bold mb-0">${summary.totalInvested.toLocaleString()}</h3>
                                    </div>
                                </div>
                                <div className="col-md-6 col-6">
                                    <div className="card border-0 bg-primary text-white rounded-4 p-3 p-lg-4 shadow-lg h-100">
                                        <p className="extra-small opacity-75 mb-1 text-uppercase fw-bold">Est. Monthly</p>
                                        <h3 className="fw-bold mb-0">+${totalEstMonthly.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4 mb-5">
                    {/* Secondary Metrics (Sticky for Desktop) */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white sticky-lg-top" style={{ top: '2rem', zIndex: 10 }}>
                            <h6 className="fw-bold mb-4 border-bottom pb-2">Portfolio Health</h6>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between small text-muted mb-2">
                                    <span className="fw-bold">Total Units</span>
                                    <span className="text-dark fw-bold">{summary.totalShares} Shares</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="d-flex justify-content-between small text-muted mb-2">
                                    <span className="fw-bold">Active Listings</span>
                                    <span className="text-dark fw-bold">{investments.length} Assets</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-info" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div className="alert alert-primary bg-primary bg-opacity-10 border-0 rounded-4 px-3 py-2 mb-0">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                <span className="extra-small fw-bold">Yields are normalized at month-end.</span>
                            </div>
                        </div>
                    </div>

                    {/* Asset Showcase */}
                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                            <h5 className="fw-bold text-dark mb-0">My Real Estate Holdings</h5>
                            <button className="btn btn-white btn-sm border rounded-pill px-3 shadow-sm bg-white fw-bold text-primary" onClick={fetchPortfolio}>
                                <i className="bi bi-arrow-clockwise me-1"></i> SYNC
                            </button>
                        </div>

                        {investments.length === 0 ? (
                            <div className="card border-0 shadow-sm rounded-5 py-5 px-4 text-center bg-white">
                                <div className="mb-4">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center shadow-inner" style={{ width: '100px', height: '100px' }}>
                                        <i className="bi bi-building-add display-4 text-muted"></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold text-dark">Portfolio Empty</h3>
                                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>Start building your wealth by investing in fractionalized premium real-world assets today.</p>
                                <a href="/#explore" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-lg">Explore Properties</a>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {investments.map((inv) => {
                                    const assetImage = inv.asset?.images?.[0]
                                        ? `${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/${inv.asset.images[0]}`
                                        : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

                                    const monthlyIncome = ((inv.totalAmount * (inv.asset?.apr || 0) / 100) / 12);

                                    return (
                                        <div key={inv._id} className="col-md-6 col-lg-4">
                                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 portfolio-item bg-white border">
                                                <div className="position-relative">
                                                    <img
                                                        src={assetImage}
                                                        className="w-100"
                                                        style={{ height: '140px', objectFit: 'cover' }}
                                                        alt={inv.asset?.title}
                                                    />
                                                    <div className="position-absolute top-0 end-0 m-2">
                                                        <span className="badge bg-white text-primary rounded-pill shadow-sm small fw-bold px-2 py-1">
                                                            {inv.asset?.apr}% APR
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="card-body p-3 d-flex flex-column">
                                                    <h6 className="fw-bold text-dark mb-1 text-truncate">{inv.asset?.title}</h6>
                                                    <p className="extra-small text-muted mb-2 text-truncate">
                                                        <i className="bi bi-geo-alt-fill text-primary me-1"></i>{inv.asset?.location}
                                                    </p>

                                                    <div className="bg-light rounded-3 p-2 mb-3">
                                                        <div className="row g-0 align-items-center">
                                                            <div className="col-6 border-end text-center">
                                                                <p className="extra-small text-muted mb-0 fw-bold">SHARES</p>
                                                                <p className="fw-bold text-dark mb-0 small">{inv.sharesBought}</p>
                                                            </div>
                                                            <div className="col-6 text-center">
                                                                <p className="extra-small text-muted mb-0 fw-bold">VALUE</p>
                                                                <p className="fw-bold text-primary mb-0 small">${inv.totalAmount.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <span className="extra-small text-muted fw-bold">EST. INCOME</span>
                                                            <span className="extra-small text-success fw-bold">+${monthlyIncome.toFixed(2)}/mo</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center gap-2 border-top pt-2 mt-2">
                                                            <button
                                                                className="btn btn-primary btn-sm rounded-pill flex-grow-1 extra-small fw-bold py-2"
                                                                onClick={() => setSelectedToSell(inv)}
                                                            >
                                                                SELL ON MARKET
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
            <ListSharesModal
                asset={selectedToSell?.asset}
                availableShares={selectedToSell?.sharesBought}
                onListingSuccess={fetchPortfolio}
            />
            <style>{`
                .extra-small { font-size: 0.7rem; letter-spacing: 0.05rem; }
                .portfolio-item { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(0,0,0,0.05) !important; }
                .portfolio-item:hover { transform: translateY(-5px); shadow: 0 1rem 3rem rgba(0,0,0,0.175) !important; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
                @media (max-width: 768px) {
                    .portfolio-item img { min-height: 220px !important; }
                }
            `}</style>
        </div>
    );
};

export default Portfolio;
