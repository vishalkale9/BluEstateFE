import React from 'react';
import AdminSidebar from '../components/Admin/AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-grow-1">
                <header className="bg-white border-bottom px-4 py-3">
                    <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                        <h5 className="mb-0 fw-bold">Admin Panel</h5>
                        <div className="d-flex align-items-center gap-3">
                            <span className="small text-muted"><i className="bi bi-clock me-1"></i> System Online</span>
                            <div className="vr border-start h-100 mx-1"></div>
                            <i className="bi bi-bell text-secondary" style={{ cursor: 'pointer' }}></i>
                        </div>
                    </div>
                </header>

                <main className="p-4">
                    <div className="container-fluid p-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
