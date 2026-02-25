import React, { useState, useEffect } from 'react';
import { financialService } from '../services/apiService';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await financialService.getNotifications();
            const data = response.data?.data || response.data || [];
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds for a real-time feel
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await financialService.markNotificationAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    return (
        <div className="dropdown me-2">
            <button
                className="btn btn-light position-relative rounded-circle p-2 shadow-sm border"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-bell text-dark fs-5"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                        {unreadCount}
                    </span>
                )}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-0 mt-3 overflow-hidden" style={{ width: '320px' }}>
                <li className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Alerts Control Center</h6>
                    <span className="badge bg-white text-primary rounded-pill small">{unreadCount} New</span>
                </li>
                <div className="notification-scroll" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <li className="p-4 text-center text-muted">
                            <i className="bi bi-bell-slash display-6 opacity-25 mb-2 d-block"></i>
                            <p className="small mb-0">No active notifications found.</p>
                        </li>
                    ) : (
                        notifications.map((notif) => (
                            <li
                                key={notif._id}
                                className={`p-3 border-bottom transition-all ${notif.isRead ? 'opacity-75 bg-transparent' : 'bg-light bg-opacity-50 fw-bold'}`}
                                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex gap-3">
                                    <div className={`p-2 rounded-circle bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0 ${notif.type === 'KYC_UPDATE' ? 'bg-info text-info' :
                                            notif.type === 'MARKET_ALERT' ? 'bg-warning text-warning' :
                                                notif.type === 'TRANSACTION_SUCCESS' ? 'bg-success text-success' :
                                                    'bg-primary text-primary'
                                        }`} style={{ width: '40px', height: '40px' }}>
                                        <i className={`bi ${notif.type === 'KYC_UPDATE' ? 'bi-shield-check' :
                                                notif.type === 'MARKET_ALERT' ? 'bi-megaphone' :
                                                    notif.type === 'TRANSACTION_SUCCESS' ? 'bi-check-circle' :
                                                        'bi-info-circle'
                                            }`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="small mb-1 text-dark line-clamp-2">{notif.message}</p>
                                        <span className="extra-small text-muted">{new Date(notif.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    {!notif.isRead && <div className="bg-primary rounded-circle mt-2" style={{ width: '8px', height: '8px' }}></div>}
                                </div>
                            </li>
                        ))
                    )}
                </div>
                <li className="p-2 border-top text-center bg-white">
                    <Link to="/portfolio" className="text-primary text-decoration-none small fw-bold">View Portfolio Updates</Link>
                </li>
            </ul>
            <style>{`
                .extra-small { font-size: 0.7rem; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .notification-scroll::-webkit-scrollbar { width: 4px; }
                .notification-scroll::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default NotificationDropdown;
