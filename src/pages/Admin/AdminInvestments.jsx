import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { investmentService } from '../../services/apiService';

const AdminInvestments = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalShares: 0,
        uniqueInvestors: 0
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await investmentService.getAllInvestments();
            // Handling format: { success: true, count: X, data: [...] }
            const rawData = response.data?.data || [];
            setInvestments(rawData);

            // Calculate Metrics from Data
            const revenue = rawData.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
            const shares = rawData.reduce((acc, curr) => acc + (Number(curr.sharesBought) || 0), 0);
            const investors = new Set(rawData.map(inv => inv.user?._id)).size;

            setStats({
                totalRevenue: revenue,
                totalShares: shares,
                uniqueInvestors: investors
            });
        } catch (error) {
            console.error("Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Global Sales Ledger</h4>
                    <p className="text-muted small mb-0">Institutional audit of all RWA transactions.</p>
                </div>
                <button className="btn btn-white btn-sm border rounded-pill px-3 fw-semibold shadow-sm" onClick={fetchData}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Sync Data
                </button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-4 bg-primary text-white">
                            <h6 className="small text-white-50 text-uppercase fw-bold mb-2">Total Sales Volume</h6>
                            <h2 className="fw-bold mb-0">${stats.totalRevenue.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 text-center">
                            <h6 className="small text-muted text-uppercase fw-bold mb-2">Shares Distributed</h6>
                            <h2 className="fw-bold text-dark mb-0">{stats.totalShares.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 text-center">
                            <h6 className="small text-muted text-uppercase fw-bold mb-2">Active Investors</h6>
                            <h2 className="fw-bold text-dark mb-0">{stats.uniqueInvestors}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold">Recent Market Settlement</h6>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill small">
                            <i className="bi bi-shield-check me-1"></i> Atomic Transactions Verified
                        </span>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: '0.05rem' }}>
                                <th className="px-4 py-3">Investor Profile</th>
                                <th>Property Asset</th>
                                <th className="text-center">Shares</th>
                                <th className="text-center">Settlement</th>
                                <th className="text-center">Status</th>
                                <th className="text-end px-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">
                                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                    Synchronizing ledger...
                                </td></tr>
                            ) : investments.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-5 text-muted fst-italic">No investment records currently identified.</td></tr>
                            ) : (
                                investments.map((inv) => (
                                    <tr key={inv._id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '38px', height: '38px', fontSize: '0.8rem' }}>
                                                    {inv.user?.name?.substring(0, 2).toUpperCase() || 'UN'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark small">{inv.user?.name || 'Unknown User'}</div>
                                                    <div className="extra-small text-muted">{inv.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-medium text-dark small">{inv.asset?.title}</div>
                                            <div className="extra-small text-muted">ID: {inv.asset?._id?.substring(0, 8)}...</div>
                                        </td>
                                        <td className="text-center fw-bold small">{inv.sharesBought}</td>
                                        <td className="text-center">
                                            <div className="fw-bold text-success small">${Number(inv.totalAmount).toLocaleString()}</div>
                                            <div className="extra-small text-muted">Paid in Full</div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill extra-small ${inv.status === 'completed' ? 'bg-success text-white' : 'bg-warning-subtle text-warning border border-warning-subtle'}`}>
                                                {inv.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="fw-medium text-dark small">{new Date(inv.createdAt).toLocaleDateString()}</div>
                                            <div className="extra-small text-muted">{new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .extra-small { font-size: 0.72rem; }
                .bg-primary { background-color: #0d6efd !important; }
                .text-success { color: #198754 !important; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminInvestments;
