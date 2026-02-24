import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { kycService } from '../../services/apiService';

const AdminKYC = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchPending = async () => {
        setLoading(true);
        try {
            const response = await kycService.getPendingKYC();
            setPendingRequests(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch kyc requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleVerify = async (userId, status, reason = '') => {
        setActionLoading(userId);
        try {
            await kycService.verifyKYC(userId, { status, reason });
            setPendingRequests(prev => prev.filter(req => req._id !== userId));
            // Close modal if rejection was open
            if (reason) {
                // @ts-ignore
                const modal = window.bootstrap.Modal.getInstance(document.getElementById('rejectionModal'));
                if (modal) modal.hide();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const imageUrl = (path) => `${import.meta.env.VITE_IMAGE_BASE_URL.replace('/api', '')}/uploads/${path}`;

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                <div>
                    <h4 className="fw-bold mb-0 text-dark">KYC Verification Inbox</h4>
                    <p className="text-muted small mb-0">Review identity documents to maintain platform integrity.</p>
                </div>
                <button className="btn btn-white btn-sm border rounded-pill px-4 shadow-sm fw-bold text-primary bg-white" onClick={fetchPending}>
                    <i className="bi bi-arrow-clockwise me-1"></i> REFRESH
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: '0.05rem' }}>
                                <th className="px-4 py-3">Investor</th>
                                <th>Legal Name</th>
                                <th className="text-center">Doc Type</th>
                                <th className="text-center">Verification Asset</th>
                                <th className="text-end px-4">Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5">
                                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                    Synchronizing KYC inbox...
                                </td></tr>
                            ) : pendingRequests.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted fst-italic">No pending identity reviews. Clear sky!</td></tr>
                            ) : (
                                pendingRequests.map((req) => (
                                    <tr key={req._id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                                                    {req.name?.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark small">{req.name}</div>
                                                    <div className="extra-small text-muted">{req.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-medium text-dark small">{req.kycDetails?.fullName || 'N/A'}</div>
                                            <div className="extra-small text-muted">Born: {req.kycDetails?.dob ? new Date(req.kycDetails.dob).toLocaleDateString() : 'N/A'}</div>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-light text-muted border px-2 py-1 small rounded-pill">
                                                {req.kycDetails?.documentType?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <a
                                                href={imageUrl(req.kycDetails?.documentPhoto)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                            >
                                                <i className="bi bi-file-earmark-image me-1"></i> VIEW ID
                                            </a>
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                                                <button
                                                    className="btn btn-sm btn-success px-3"
                                                    onClick={() => handleVerify(req._id, 'verified')}
                                                    disabled={actionLoading === req._id}
                                                >
                                                    {actionLoading === req._id ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-check-lg"></i>}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger px-3"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#rejectionModal"
                                                    onClick={() => {
                                                        setSelectedRequest(req);
                                                        setRejectionReason('');
                                                    }}
                                                    disabled={actionLoading === req._id}
                                                >
                                                    <i className="bi bi-x-lg"></i>
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

            {/* Rejection Modal */}
            <div className="modal fade" id="rejectionModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4">
                        <div className="modal-header border-0 p-4 pb-0">
                            <h5 className="fw-bold">Reject Application</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            <p className="text-muted small">Provide a specific reason for rejection. This will be shown to the user.</p>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Reason for Rejection</label>
                                <textarea
                                    className="form-control rounded-3"
                                    rows="3"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g. Identity photo is blurred and unreadable."
                                ></textarea>
                            </div>
                            <button
                                className="btn btn-danger w-100 py-3 rounded-pill fw-bold"
                                disabled={!rejectionReason || actionLoading}
                                onClick={() => handleVerify(selectedRequest._id, 'rejected', rejectionReason)}
                            >
                                {actionLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`.extra-small { font-size: 0.72rem; }`}</style>
        </AdminLayout>
    );
};

export default AdminKYC;
