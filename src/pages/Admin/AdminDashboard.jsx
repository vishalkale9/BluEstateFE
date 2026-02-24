import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import CreateAssetForm from '../../components/Admin/CreateAssetForm';
import { assetService, investmentService } from '../../services/apiService';

const AdminDashboard = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssets: 0,
        totalValue: 0,
        totalShares: 0,
        totalAvailable: 0
    });

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            // Fetch Assets
            const assetRes = await assetService.getAllAssets();
            const assetData = Array.isArray(assetRes.data) ? assetRes.data : (assetRes.data?.data || assetRes.data?.assets || []);
            setAssets(assetData);

            // Calculate Stats
            const totalVal = assetData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
            const totalSh = assetData.reduce((acc, curr) => acc + (Number(curr.totalShares) || 0), 0);
            const totalAvail = assetData.reduce((acc, curr) => acc + (Number(curr.availableShares) || 0), 0);

            setStats({
                totalAssets: assetData.length,
                totalValue: totalVal,
                totalShares: totalSh,
                totalAvailable: totalAvail
            });

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const [editingAsset, setEditingAsset] = useState(null);

    const handleEdit = (asset) => {
        setEditingAsset(asset);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await assetService.deleteAsset(id);
            fetchData();
        } catch (error) {
            alert("Delete failed");
        }
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Platform Overview</h4>
                    <p className="text-muted small mb-0">Real-time status of properties and investments.</p>
                </div>
                <button
                    className="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#createAssetModal"
                    onClick={() => setEditingAsset(null)}
                >
                    <i className="bi bi-plus-lg me-1"></i> Add Property
                </button>
            </div>

            {/* Showcase Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 bg-primary text-white text-center">
                        <div className="card-body py-4">
                            <h6 className="text-white-50 small mb-1 text-uppercase fw-bold">Total Assets</h6>
                            <h2 className="fw-bold mb-0">{stats.totalAssets}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 text-center">
                        <div className="card-body py-4">
                            <h6 className="text-secondary small mb-1 text-uppercase fw-bold">Portfolio AUM</h6>
                            <h2 className="fw-bold mb-0">${(stats.totalValue / 1000000).toFixed(1)}M</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 text-center">
                        <div className="card-body py-4">
                            <h6 className="text-secondary small mb-1 text-uppercase fw-bold">Available Shares</h6>
                            <h2 className="fw-bold mb-0">{stats.totalAvailable?.toLocaleString() || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-sm rounded-3 h-100">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fw-bold">Active Inventory Management</h6>
                            <span className="badge bg-light text-muted fw-normal">{assets.length} Total Properties</span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr className="small text-muted text-uppercase">
                                        <th className="px-4">Asset Details</th>
                                        <th>Valuation</th>
                                        <th className="text-center">Target IRR</th>
                                        <th className="text-center">Occupancy</th>
                                        <th className="text-center">Available Shares</th>
                                        <th className="text-center">Market Status</th>
                                        <th className="text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-5">Loading global inventory...</td></tr>
                                    ) : assets.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-5 text-muted">No properties synchronized.</td></tr>
                                    ) : (
                                        assets.map(asset => {
                                            const imageUrl = asset.images && asset.images.length > 0
                                                ? `${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/${asset.images[0]}`
                                                : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";

                                            return (
                                                <tr key={asset._id}>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-3">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={asset.title}
                                                                    className="rounded-3 shadow-sm border"
                                                                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark small">{asset.title}</div>
                                                                <div className="text-muted extra-small">{asset.location}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="small fw-medium">${Number(asset.price).toLocaleString()}</td>
                                                    <td className="text-center">
                                                        <span className="badge bg-primary text-white rounded-pill extra-small">
                                                            {asset.irr || 'N/A'}%
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-white text-muted border rounded-pill extra-small">
                                                            {asset.occupancyStatus || 'Vacant'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="fw-bold small text-dark">{asset.availableShares} / {asset.totalShares}</div>
                                                        <div className="extra-small text-muted">Units Left</div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge rounded-pill extra-small ${asset.availableShares > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                            {asset.availableShares > 0 ? 'Active' : 'Sold Out'}
                                                        </span>
                                                    </td>
                                                    <td className="text-end px-4">
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm btn-light border" data-bs-toggle="modal" data-bs-target="#createAssetModal" onClick={() => handleEdit(asset)}>
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-light border text-danger" onClick={() => handleDelete(asset._id)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Configuration Modal */}
            <div className="modal fade" id="createAssetModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-3">
                        <div className="modal-header border-bottom py-3">
                            <h5 className="modal-title fw-bold">Configure RWA Listing</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <CreateAssetForm
                                initialData={editingAsset}
                                onAssetCreated={() => {
                                    fetchData();
                                    const modal = window.bootstrap.Modal.getInstance(document.getElementById('createAssetModal'));
                                    if (modal) modal.hide();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminDashboard;
