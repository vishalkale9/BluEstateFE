import React from 'react';
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import Footer from '../../components/Footer';

const Home = () => {
    const displayProperties = [
        {
            id: 1,
            name: "Miami Beach Professional Suites",
            location: "Miami, Florida",
            price: 1250000,
            yield: 8.5,
            funding_progress: 75,
            image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "London City Apartments",
            location: "London, UK",
            price: 2400000,
            yield: 6.2,
            funding_progress: 40,
            image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Dubai Marina Residentials",
            location: "Dubai, UAE",
            price: 3600000,
            yield: 11.4,
            funding_progress: 92,
            image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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

            {/* Property Grid */}
            <section className="py-5" id="explore">
                <div className="container">
                    <div className="mb-5 text-center">
                        <h2 className="fw-bold text-dark display-6 mb-2">Editor's Picks</h2>
                        <p className="text-muted">Explore our most popular real-world asset opportunities.</p>
                    </div>

                    <div className="row g-4">
                        {displayProperties.map(property => (
                            <div className="col-lg-4 col-md-6" key={property.id}>
                                <PropertyCard
                                    title={property.name}
                                    location={property.location}
                                    price={property.price}
                                    yieldPercentage={property.yield}
                                    progress={property.funding_progress}
                                    image={property.image_url}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-5 bg-white mt-5" id="how-it-works">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="fw-bold display-6 mb-3">The Smart Way to Own Property</h2>
                            <p className="text-muted lead">Barrier-free real estate investing through tokenization technology.</p>
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4 text-center">
                            <div className="p-4 rounded-4 bg-light h-100">
                                <i className="bi bi-shield-check fs-1 text-primary mb-3 d-block"></i>
                                <h4 className="fw-bold">Regulated</h4>
                                <p className="text-muted small mb-0">Compliant with global financial standards and security protocols.</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="p-4 rounded-4 bg-light h-100">
                                <i className="bi bi-graph-up-arrow fs-1 text-primary mb-3 d-block"></i>
                                <h4 className="fw-bold">Passive Yield</h4>
                                <p className="text-muted small mb-0">Earn rental distributions directly to your account every month.</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="p-4 rounded-4 bg-light h-100">
                                <i className="bi bi-lightning-charge fs-1 text-primary mb-3 d-block"></i>
                                <h4 className="fw-bold">Liquid Assets</h4>
                                <p className="text-muted small mb-0">Buy and sell property tokens instantly on our secondary market.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
