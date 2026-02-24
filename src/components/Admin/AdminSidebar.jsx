import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
        { path: '/admin/inventory', icon: 'bi-building', label: 'Assets' },
        { path: '/admin/sales', icon: 'bi-cart-check', label: 'Investments' },
        { path: '/admin/kyc', icon: 'bi-shield-lock', label: 'Identity Review' },
        { path: '/admin/users', icon: 'bi-people', label: 'Users' },
    ];

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end vh-100 sticky-top shadow-sm" style={{ width: '260px' }}>
            <div className="d-flex align-items-center mb-4 me-md-auto text-dark text-decoration-none px-2">
                <span className="fs-4 fw-bold text-primary">BluEstate</span>
                <span className="ms-2 badge bg-light text-primary border fw-normal small">Admin</span>
            </div>

            <ul className="nav nav-pills flex-column mb-auto">
                {navItems.map((item) => (
                    <li key={item.path} className="nav-item mb-1">
                        <NavLink
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-2 transition-all ${isActive ? 'active bg-primary text-white shadow-sm' : 'text-secondary bg-transparent'
                                }`
                            }
                        >
                            <i className={`bi ${item.icon} fs-5`}></i>
                            <span className="fw-medium">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="mt-auto border-top pt-3 px-2">
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2 border" style={{ width: '38px', height: '38px' }}>
                        <i className="bi bi-person text-secondary"></i>
                    </div>
                    <div className="overflow-hidden">
                        <div className="fw-bold text-dark text-truncate small">{user?.username || 'Administrator'}</div>
                        <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>{user?.email}</div>
                    </div>
                </div>
                <button onClick={logout} className="btn btn-outline-danger btn-sm w-100 rounded-pill fw-bold">
                    <i className="bi bi-box-arrow-right me-2"></i> Log Out
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
