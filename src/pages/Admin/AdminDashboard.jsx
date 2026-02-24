import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CreateAssetForm from '../../components/Admin/CreateAssetForm';
import { assetService } from '../../services/apiService';

const AdminDashboard = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssets: 0,
        totalValue: 0,
        totalShares: 0
    });

    const fetchAssets = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await assetService.getAllAssets();
            const rawData = response.data;
            const data = Array.isArray(rawData) ? rawData : (rawData?.data || rawData?.assets || []);

            setAssets(data);

            const totalVal = data.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
            const totalSh = data.reduce((acc, curr) => acc + (Number(curr.totalShares) || 0), 0);

            setStats({
                totalAssets: data.length,
                totalValue: totalVal,
                totalShares: totalSh
            });
        } catch (error) {
            console.error("Failed to fetch assets for admin", error);
            setAssets([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const [editingAsset, setEditingAsset] = useState(null);

    const handleEdit = (asset) => {
        setEditingAsset(asset);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this asset?")) return;
        try {
            await assetService.deleteAsset(id);
            alert("Asset deleted successfully!");
            fetchAssets();
        } catch (error) {
            console.error("Delete failed", error);
            alert(error.response?.data?.message || "Failed to delete asset.");
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Asset Control Center</h2>
                        <p className="text-muted mb-0">Manage and monitor all platform listings</p>
                    </div>
                    <button
                        className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#createAssetModal"
                        onClick={() => setEditingAsset(null)}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Add New Asset
                    </button>
                </div>

                {/* Stats Row */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                            <h6 className="text-muted small text-uppercase fw-bold">Total Assets</h6>
                            <h3 className="fw-bold text-primary mb-0">{stats.totalAssets}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                            <h6 className="text-muted small text-uppercase fw-bold">Market Value</h6>
                            <h3 className="fw-bold text-primary mb-0">${stats.totalValue.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                            <h6 className="text-muted small text-uppercase fw-bold">Total Shares</h6>
                            <h3 className="fw-bold text-primary mb-0">{stats.totalShares.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Asset Management Table */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white py-3 border-0">
                        <h5 className="mb-0 fw-bold">Existing Assets</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-uppercase">
                                <tr>
                                    <th className="px-4 py-3">Property</th>
                                    <th className="py-3">Category / Location</th>
                                    <th className="py-3 text-center">Value / APR</th>
                                    <th className="py-3 text-center">Availability</th>
                                    <th className="py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                                            Loading assets...
                                        </td>
                                    </tr>
                                ) : assets.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted italic">
                                            No assets found. Start by adding your first listing!
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map((asset) => (
                                        <tr key={asset._id}>
                                            <td className="px-4">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={asset.images && asset.images[0] ? `http://localhost:5000/uploads/${asset.images[0]}` : "https://via.placeholder.com/40"}
                                                        className="rounded-2 me-3"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        alt=""
                                                    />
                                                    <div>
                                                        <div className="fw-bold text-dark">{asset.title}</div>
                                                        <div className="small text-muted">ID: {asset._id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">{asset.category || 'Residential'}</div>
                                                <div className="small text-muted">{asset.location}</div>
                                            </td>
                                            <td className="text-center">
                                                <div className="fw-bold text-primary">${Number(asset.price).toLocaleString()}</div>
                                                <div className="small text-success">{asset.apr || asset.yieldPercentage || 0}% APR</div>
                                            </td>
                                            <td className="text-center">
                                                <div className="small fw-bold">{asset.availableShares} / {asset.totalShares}</div>
                                                <div className="progress mx-auto" style={{ height: '4px', width: '80px' }}>
                                                    <div className="progress-bar bg-success" style={{ width: `${(asset.availableShares / asset.totalShares) * 100}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 small">Active</span>
                                            </td>
                                            <td className="px-4 text-end">
                                                <button
                                                    className="btn btn-sm btn-light rounded-circle me-2"
                                                    title="Edit"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#createAssetModal"
                                                    onClick={() => handleEdit(asset)}
                                                >
                                                    <i className="bi bi-pencil-square text-primary"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light rounded-circle"
                                                    onClick={() => handleDelete(asset._id)}
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash3 text-danger"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Creating/Editing Asset */}
            <div className="modal fade" id="createAssetModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header border-0 pb-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <CreateAssetForm
                                initialData={editingAsset}
                                onAssetCreated={() => {
                                    fetchAssets();
                                    const modalElement = document.getElementById('createAssetModal');
                                    // @ts-ignore
                                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                                    if (modal) modal.hide();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
