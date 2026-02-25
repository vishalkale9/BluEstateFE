import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConnectWallet from './ConnectWallet';
import NotificationDropdown from './NotificationDropdown';
import DepositModal from './Financial/DepositModal';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
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
                                <Link className="nav-link fw-medium px-3 text-dark" to="/explore">Explore Assets</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-medium px-3 text-dark" to="/secondary-market">Secondary Market</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-medium px-3 text-dark" href="/#how-it-works">How it Works</a>
                            </li>
                        </ul>

                        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                            {isAuthenticated && (
                                <>
                                    <button
                                        className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm d-none d-lg-block"
                                        data-bs-toggle="modal"
                                        data-bs-target="#depositModal"
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> TOP UP
                                    </button>
                                    <NotificationDropdown />
                                </>
                            )}
                            {isAuthenticated ? (
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-primary rounded-pill px-4 fw-bold dropdown-toggle shadow-sm"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person-circle me-2"></i>
                                        {user?.name || user?.username || 'Account'}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-2 mt-2">
                                        <li className="px-3 py-2 border-bottom mb-2 bg-light">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Wallet Balance</span>
                                                <span className="small fw-bold text-primary">${user?.walletBalance?.toLocaleString() || '0'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Total Dividends</span>
                                                <span className="small fw-bold text-success">+${user?.totalEarned?.toLocaleString() || '0'}</span>
                                            </div>
                                        </li>

                                        <li className="px-3 py-2 border-bottom mb-2">
                                            <div className="small fw-bold text-dark">{user?.name || user?.username}</div>
                                            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                                        </li>

                                        {user?.role === 'admin' ? (
                                            <li>
                                                <Link className="dropdown-item rounded-3 py-2 mb-1" to="/admin">
                                                    <i className="bi bi-speedometer2 me-2 text-primary"></i> Admin Dashboard
                                                </Link>
                                            </li>
                                        ) : (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item rounded-3 py-2 mb-1" to="/portfolio">
                                                        <i className="bi bi-briefcase me-2 text-primary"></i> My Portfolio
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link className="dropdown-item rounded-3 py-2 mb-1 d-flex align-items-center justify-content-between" to="/kyc">
                                                        <span><i className="bi bi-shield-check me-2 text-primary"></i> KYC Status</span>
                                                        {user?.kycStatus === 'verified' ? (
                                                            <span className="badge bg-success-subtle text-success rounded-pill extra-small">Verified</span>
                                                        ) : user?.kycStatus === 'pending' ? (
                                                            <span className="badge bg-warning-subtle text-warning rounded-pill extra-small">Pending</span>
                                                        ) : (
                                                            <span className="badge bg-danger-subtle text-danger rounded-pill extra-small">Unverified</span>
                                                        )}
                                                    </Link>
                                                </li>
                                            </>
                                        )}

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
            <DepositModal />
        </>
    );
};

export default Navbar;
