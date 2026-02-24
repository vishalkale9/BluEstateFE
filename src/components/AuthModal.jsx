import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/apiService';

const AuthModal = ({ id }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '', // Backend expects username or name, user guide says 'name' for Signup
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (isLogin) {
                // Login Logic
                await login({ email: formData.email, password: formData.password });
                setMessage({ type: 'success', text: 'Login successful!' });
                setTimeout(() => {
                    const modalElement = document.getElementById(id);
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                }, 1500);
            } else {
                // Signup Logic (API expects name, email, password)
                await authService.register({
                    name: formData.username,
                    email: formData.email,
                    password: formData.password
                });
                setMessage({ type: 'success', text: 'Registration successful! You can now login.' });
                setIsLogin(true);
            }
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header border-0 pb-0">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4 pt-0">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-primary">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
                            <p className="text-muted small">Access your RWA portfolio with BluEstate</p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type} py-2 small`} role="alert">
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-person"></i></span>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            placeholder="John Doe"
                                            required={!isLogin}
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-envelope"></i></span>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control bg-light border-0 px-3 py-2"
                                        placeholder="name@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-lock"></i></span>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control bg-light border-0 px-3 py-2"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-3"
                                disabled={loading}
                            >
                                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <p className="small text-muted mb-0">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    className="btn btn-link p-0 small fw-bold text-decoration-none"
                                    onClick={toggleMode}
                                >
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
