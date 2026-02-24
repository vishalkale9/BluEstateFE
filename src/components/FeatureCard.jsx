import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4 transition-all">
                <div className="feature-icon-wrapper mb-3 d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-3" style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${icon} fs-2 text-primary`}></i>
                </div>
                <h5 className="fw-bold text-dark mb-3">{title}</h5>
                <p className="text-muted small mb-0">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
