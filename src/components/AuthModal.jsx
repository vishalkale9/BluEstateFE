import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/apiService';

const AuthModal = ({ id }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { login } = useAuth();

    // Reset message when switching between Login and Signup
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage({ type: '', text: '' });
    };

    const handleChange = (e) => {
        if (message.text) setMessage({ type: '', text: '' });
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
                setMessage({ type: 'success', text: 'Login successful! Redirecting...' });

                // Expert touch: Reset form and close modal
                setTimeout(() => {
                    const modalElement = document.getElementById(id);
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                    setFormData({ name: '', email: '', password: '' });
                    setMessage({ type: '', text: '' });
                }, 1500);
            } else {
                // Signup Logic
                await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                setMessage({ type: 'success', text: 'Registration successful! Please login.' });

                // Expert touch: Switch to login and clear success message after 3 seconds
                setTimeout(() => {
                    setIsLogin(true);
                    setFormData({ ...formData, password: '' }); // Keep email for convenience
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                }, 1000);
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

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header border-0 pb-0">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4 pt-0">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-primary">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
                            <p className="text-muted small">
                                {isLogin ? 'Login to manage your RWA portfolio' : 'Start investing in real world assets today'}
                            </p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type} py-2 small`} role="alert">
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control rounded-pill px-3"
                                        placeholder="Enter your name"
                                        required={!isLogin}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control rounded-pill px-3"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-semibold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control rounded-pill px-3"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                ) : null}
                                {isLogin ? 'Login' : 'Create Account'}
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
