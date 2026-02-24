import React from 'react';
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Footer from '../../components/Footer';

const Home = () => {
    const dummyProperties = [
        {
            id: 1,
            title: "Miami Beach Professional Suites",
            location: "Miami, Florida",
            price: 1250000,
            yieldPercentage: 8.5,
            progress: 75,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "London City Apartments",
            location: "London, UK",
            price: 2400000,
            yieldPercentage: 6.2,
            progress: 40,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Dubai Marina Residentials",
            location: "Dubai, UAE",
            price: 3600000,
            yieldPercentage: 11.4,
            progress: 92,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="home-page bg-light min-vh-100">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section bg-white py-5 mb-5 border-bottom">
                <div className="container py-lg-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h1 className="display-3 fw-bold text-dark mb-4 lh-tight">
                                Unlock the Future of <span className="text-primary italic">Real Estate</span>
                            </h1>
                            <p className="lead text-muted mb-5 fs-4">
                                Invest in premium global properties starting from just $100.
                                Powered by blockchain for ultimate security and transparency.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                                    Start Investing
                                </button>
                                <button className="btn btn-outline-dark btn-lg px-5 py-3 rounded-pill fw-bold">
                                    Learn More
                                </button>
                            </div>

                            <div className="row mt-5 pt-4 border-top">
                                <div className="col-4">
                                    <h4 className="fw-bold text-primary mb-0">$50M+</h4>
                                    <p className="text-muted small">Assets Managed</p>
                                </div>
                                <div className="col-4 border-start">
                                    <h4 className="fw-bold text-primary mb-0">12K+</h4>
                                    <p className="text-muted small">Global Investors</p>
                                </div>
                                <div className="col-4 border-start">
                                    <h4 className="fw-bold text-primary mb-0">9.4%</h4>
                                    <p className="text-muted small">Avg. Annual Yield</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 ps-lg-5">
                            <div className="position-relative">
                                <img
                                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Modern Real Estate"
                                    className="img-fluid rounded-4 shadow-2xl"
                                />
                                <div className="position-absolute bottom-0 start-0 m-4 bg-white p-3 rounded-3 shadow-lg border-start border-primary border-4 w-50 d-none d-md-block">
                                    <p className="fw-bold mb-0 text-dark small">Recent Investment</p>
                                    <p className="text-primary fw-bold mb-0">$12,450.00</p>
                                    <p className="text-muted x-small mb-0">2 minutes ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <div className="container mb-5">
                <div className="bg-white rounded-pill shadow-sm py-4 px-5">
                    <div className="row align-items-center text-center">
                        <div className="col text-muted fw-bold small text-uppercase ls-wide">Trusted By:</div>
                        <div className="col h4 mb-0 fw-bold text-muted op-5">FORBES</div>
                        <div className="col h4 mb-0 fw-bold text-muted op-5">COINDESK</div>
                        <div className="col h4 mb-0 fw-bold text-muted op-5">TECHCRUNCH</div>
                        <div className="col h4 mb-0 fw-bold text-muted op-5">BLOOMBERG</div>
                    </div>
                </div>
            </div>

            {/* Property Grid */}
            <section className="py-5">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-5">
                        <div>
                            <h2 className="fw-bold text-dark display-6 mb-2">Editor's Picks</h2>
                            <p className="text-muted mb-0">Explore our most popular real-world asset opportunities.</p>
                        </div>
                        <a href="/explore" className="btn btn-link text-primary fw-semibold text-decoration-none">
                            View All Properties <i className="bi bi-arrow-right ms-2"></i>
                        </a>
                    </div>

                    <div className="row g-4">
                        {dummyProperties.map(property => (
                            <div className="col-lg-4 col-md-6" key={property.id}>
                                <PropertyCard {...property} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-5 bg-white mt-5">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="fw-bold display-6 mb-3">The Smart Way to Own Property</h2>
                            <p className="text-muted lead">We've removed the barriers to real estate investing through tokenization.</p>
                        </div>
                    </div>

                    <div className="row g-5">
                        <div className="col-md-4 text-center">
                            <div className="icon-box mb-4 mx-auto bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-shield-check fs-2"></i>
                            </div>
                            <h4 className="fw-bold mb-3">SEC Compliant</h4>
                            <p className="text-muted small">We work within legal frameworks to ensure your investments are protected and regulated.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="icon-box mb-4 mx-auto bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-graph-up-arrow fs-2"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Passive Income</h4>
                            <p className="text-muted small">Earn rental income distributions directly to your wallet every month automatically.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="icon-box mb-4 mx-auto bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-lightning-charge fs-2"></i>
                            </div>
                            <h4 className="fw-bold mb-3">High Liquidity</h4>
                            <p className="text-muted small">Unlike physical property, you can sell your tokens in the secondary market at any time.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
