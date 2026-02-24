import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { userService } from '../../services/apiService';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [summary, setSummary] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        pendingKYC: 0,
        admins: 0
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({ role: 'user', kycStatus: 'unverified' });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            // Expected Format: { success: true, summary: {...}, data: [...] }
            setUsers(response.data.data || []);
            setSummary(response.data.summary || {
                totalUsers: 0,
                verifiedUsers: 0,
                pendingKYC: 0,
                admins: 0
            });
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        setActionLoading(selectedUser._id);
        try {
            await userService.updateUser(selectedUser._id, editData);
            // Refresh local state
            setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, ...editData } : u));

            // Close Modal
            // @ts-ignore
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            if (modal) modal.hide();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update user");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;

        setActionLoading(id);
        try {
            await userService.deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (error) {
            alert("Failed to delete user");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified': return 'bg-success text-white';
            case 'pending': return 'bg-warning text-dark';
            case 'rejected': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                <div>
                    <h4 className="fw-bold mb-0 text-dark">Community Management</h4>
                    <p className="text-muted small mb-0">Platform-wide user lifecycle and role governance.</p>
                </div>
                <button className="btn btn-white btn-sm border rounded-pill px-4 shadow-sm fw-bold text-primary bg-white" onClick={fetchUsers}>
                    <i className="bi bi-arrow-clockwise me-1"></i> SYNC USERS
                </button>
            </div>

            {/* Platform Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 text-center p-3 h-100">
                        <p className="extra-small text-muted text-uppercase fw-bold mb-1">Total Community</p>
                        <h3 className="fw-bold text-dark mb-0">{summary.totalUsers}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 text-center p-3 h-100 border-start border-success border-4">
                        <p className="extra-small text-muted text-uppercase fw-bold mb-1 text-success">Verified Investors</p>
                        <h3 className="fw-bold text-dark mb-0">{summary.verifiedUsers}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 text-center p-3 h-100 border-start border-warning border-4">
                        <p className="extra-small text-muted text-uppercase fw-bold mb-1 text-warning">Pending KYC</p>
                        <h3 className="fw-bold text-dark mb-0">{summary.pendingKYC}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4 text-center p-3 h-100 border-start border-primary border-4">
                        <p className="extra-small text-muted text-uppercase fw-bold mb-1 text-primary">Governance Admins</p>
                        <h3 className="fw-bold text-dark mb-0">{summary.admins}</h3>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: '0.05rem' }}>
                                <th className="px-4 py-3">User Profile</th>
                                <th>Role</th>
                                <th className="text-center">KYC Status</th>
                                <th className="text-center">Registry Date</th>
                                <th className="text-end px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5">
                                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                    Synchronizing community ledger...
                                </td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted fst-italic">No users identified in current segment.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                                                    {user.name?.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark small">{user.name}</div>
                                                    <div className="extra-small text-muted text-truncate" style={{ maxWidth: '150px' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill extra-small ${user.role === 'admin' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-light text-muted border'}`}>
                                                {user.role?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill extra-small px-3 py-1 ${getStatusBadge(user.kycStatus)}`}>
                                                {user.kycStatus?.toUpperCase() || 'UNVERIFIED'}
                                            </span>
                                        </td>
                                        <td className="text-center extra-small text-muted">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                                                <button
                                                    className="btn btn-sm btn-light px-3 border-end"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#editUserModal"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setEditData({ role: user.role, kycStatus: user.kycStatus });
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square text-primary"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light px-3"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={actionLoading === user._id}
                                                >
                                                    {actionLoading === user._id ? (
                                                        <span className="spinner-border spinner-border-sm text-danger"></span>
                                                    ) : (
                                                        <i className="bi bi-trash3 text-danger"></i>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            <div className="modal fade" id="editUserModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4">
                        <div className="modal-header border-0 p-4 pb-0">
                            <h5 className="fw-bold">Promote/Override Privileges</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleUpdateUser}>
                            <div className="modal-body p-4">
                                {selectedUser && (
                                    <div className="bg-light rounded-3 p-3 mb-4 d-flex align-items-center">
                                        <i className="bi bi-person-badge fs-2 text-primary me-3"></i>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{selectedUser.name}</h6>
                                            <p className="extra-small text-muted mb-0">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase">Platform Role</label>
                                    <select
                                        className="form-select rounded-3"
                                        value={editData.role}
                                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                    >
                                        <option value="user">Investor (User)</option>
                                        <option value="admin">Platform Admin</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-uppercase">KYC Override Status</label>
                                    <select
                                        className="form-select rounded-3"
                                        value={editData.kycStatus}
                                        onChange={(e) => setEditData({ ...editData, kycStatus: e.target.value })}
                                    >
                                        <option value="unverified">Unverified</option>
                                        <option value="pending">Review Pending</option>
                                        <option value="verified">Verified Investor</option>
                                        <option value="rejected">Rejected / Blocked</option>
                                    </select>
                                    <p className="extra-small text-muted mt-2">
                                        <i className="bi bi-exclamation-circle me-1"></i>
                                        Overriding status will bypass manual document verification.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                                    disabled={actionLoading === selectedUser?._id}
                                >
                                    {actionLoading === selectedUser?._id ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : 'Save Permissions'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .extra-small { font-size: 0.72rem; }
                .bg-primary-subtle { background-color: #e7f1ff !important; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminUsers;
