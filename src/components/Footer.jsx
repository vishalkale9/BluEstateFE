import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-5">
            <div className="container text-center text-md-start">
                <div className="row">
                    <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-4">
                        <h5 className="text-uppercase fw-bold mb-4 text-primary">BluEstate</h5>
                        <p className="text-muted small">
                            Tokenizing real estate for everyone. We provide secondary market
                            liquidity for the most stable asset class in the world.
                        </p>
                    </div>

                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Quick Links</h6>
                        <p><a href="#!" className="text-muted text-decoration-none small">Explore</a></p>
                        <p><a href="#!" className="text-muted text-decoration-none small">My Portfolio</a></p>
                        <p><a href="#!" className="text-muted text-decoration-none small">Marketplace</a></p>
                    </div>

                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Legal</h6>
                        <p><a href="#!" className="text-muted text-decoration-none small">Terms of Use</a></p>
                        <p><a href="#!" className="text-muted text-decoration-none small">Privacy Policy</a></p>
                        <p><a href="#!" className="text-muted text-decoration-none small">Security</a></p>
                    </div>

                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                        <p className="text-muted small"><i className="bi bi-geo-alt me-2"></i> New York, NY 10012, US</p>
                        <p className="text-muted small"><i className="bi bi-envelope me-2"></i> contact@bluestate.com</p>
                        <p className="text-muted small"><i className="bi bi-telephone me-2"></i> + 01 234 567 88</p>
                    </div>
                </div>
            </div>

            <hr className="bg-secondary" />

            <div className="container text-center">
                <p className="text-muted small mb-0 fs-7">
                    © {new Date().getFullYear()} BluEstate. All Rights Reserved. Built with ❤️ for the Web3 community.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
