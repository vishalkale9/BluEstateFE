import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { kycService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const KYC = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        documentType: 'Passport',
        documentNumber: '',
        document: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, document: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.document) {
            setError('Please upload your identity document.');
            return;
        }

        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            await kycService.submitKYC(data);
            setSuccess(true);
            refreshUser(); // Update user status in context
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit KYC. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.kycStatus === 'verified') {
        return (
            <div className="min-vh-100 bg-light">
                <Navbar />
                <div className="container py-5 mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="card border-0 shadow-lg rounded-4 p-5 animate__animated animate__fadeIn">
                                <div className="text-success mb-4">
                                    <i className="bi bi-shield-check display-1"></i>
                                </div>
                                <h2 className="fw-bold text-dark">Identity Verified</h2>
                                <p className="text-muted mb-4">You have full institutional access to the marketplace. Your account is secured and regulation-ready.</p>
                                <a href="/#explore" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm">Start Investing</a>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (user?.kycStatus === 'pending') {
        return (
            <div className="min-vh-100 bg-light">
                <Navbar />
                <div className="container py-5 mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="card border-0 shadow-lg rounded-4 p-5 animate__animated animate__fadeIn">
                                <div className="text-warning mb-4">
                                    <i className="bi bi-clock-history display-1"></i>
                                </div>
                                <h2 className="fw-bold text-dark">Verification Pending</h2>
                                <p className="text-muted mb-0">Our compliance team is currently reviewing your documents.</p>
                                <p className="text-muted mb-4 small text-uppercase fw-bold mt-2">Estimated time: 12-24 Hours</p>
                                <a href="/portfolio" className="btn btn-outline-primary px-5 py-3 rounded-pill fw-bold">Back to Dashboard</a>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <Navbar />
            <div className="container py-5 mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeIn">
                            <div className="row g-0">
                                <div className="col-lg-5 bg-primary text-white p-5 d-flex flex-column justify-content-center">
                                    <h2 className="fw-bold mb-4">Identity Verification</h2>
                                    <p className="opacity-75 mb-4">To comply with global financial regulations, we require identity verification for all investors.</p>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-3 d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill me-2"></i> High-level security
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill me-2"></i> Anti-fraud protection
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill me-2"></i> Regulation compliant
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-7 p-5 bg-white">
                                    {success ? (
                                        <div className="text-center py-4">
                                            <div className="text-success mb-3">
                                                <i className="bi bi-send-check-fill display-3"></i>
                                            </div>
                                            <h3 className="fw-bold">Submission Received</h3>
                                            <p className="text-muted">Your documents have been successfully uploaded. We will notify you once the verification is complete.</p>
                                            <button className="btn btn-primary px-4 py-2 rounded-pill mt-3" onClick={() => window.location.href = '/'}>Return Home</button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            {error && <div className="alert alert-danger mb-4 small">{error}</div>}

                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-uppercase">Legal Full Name</label>
                                                <input type="text" name="fullName" className="form-control" required value={formData.fullName} onChange={handleInputChange} placeholder="As per document" />
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label small fw-bold text-uppercase">Date of Birth</label>
                                                    <input type="date" name="dob" className="form-control" required value={formData.dob} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label small fw-bold text-uppercase">Document Type</label>
                                                    <select name="documentType" className="form-select" value={formData.documentType} onChange={handleInputChange}>
                                                        <option value="Passport">Passport</option>
                                                        <option value="ID_Card">ID Card</option>
                                                        <option value="Drivers_License">Driver's License</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-uppercase">Document Number</label>
                                                <input type="text" name="documentNumber" className="form-control" required value={formData.documentNumber} onChange={handleInputChange} placeholder="e.g. L8902341" />
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-uppercase">Upload ID Photo</label>
                                                <div className="input-group">
                                                    <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required />
                                                </div>
                                                <div className="mt-2 extra-small text-muted">Please ensure the text and photo are clearly visible. Max size 5MB.</div>
                                            </div>

                                            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" disabled={loading}>
                                                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Submit for Verification'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>{`.extra-small { font-size: 0.75rem; }`}</style>
        </div>
    );
};

export default KYC;
