import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <span className="fw-bold fs-4 text-primary">BluEstate</span>
                </a>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <a className="nav-link fw-medium px-3 text-dark" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-medium px-3 text-dark" href="/explore">Explore Assets</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-medium px-3 text-dark" href="/how-it-works">How it Works</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-medium px-3 text-dark" href="/about">About Us</a>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                        <button className="btn btn-outline-primary px-4 fw-semibold rounded-pill">Login</button>
                        <button className="btn btn-primary px-4 fw-semibold rounded-pill shadow-sm">Connect Wallet</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
