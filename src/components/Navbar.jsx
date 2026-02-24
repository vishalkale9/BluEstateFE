import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/">
                    <span className="fw-bold fs-4 text-primary">BluEstate</span>
                </Link>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link fw-medium px-3 text-dark" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-medium px-3 text-dark" href="/#explore">Explore Assets</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-medium px-3 text-dark" href="/#how-it-works">How it Works</a>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                        {isAuthenticated ? (
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-primary rounded-pill px-4 fw-bold dropdown-toggle shadow-sm"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-person-circle me-2"></i>
                                    {user?.username || 'Account'}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-2 mt-2">
                                    <li className="px-3 py-2 border-bottom mb-2">
                                        <div className="small fw-bold text-dark">{user?.username}</div>
                                        <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                                    </li>

                                    {user?.role === 'admin' && (
                                        <li>
                                            <Link className="dropdown-item rounded-3 py-2 mb-1" to="/admin">
                                                <i className="bi bi-speedometer2 me-2 text-primary"></i> Admin Dashboard
                                            </Link>
                                        </li>
                                    )}

                                    <li>
                                        <Link className="dropdown-item rounded-3 py-2 mb-1" to="/portfolio">
                                            <i className="bi bi-briefcase me-2 text-primary"></i> My Portfolio
                                        </Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    <li className="px-2">
                                        <ConnectWallet />
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    <li>
                                        <button onClick={logout} className="dropdown-item rounded-3 py-2 text-danger">
                                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="btn btn-primary px-4 fw-bold rounded-pill shadow-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#authModal"
                                >
                                    Login / Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
