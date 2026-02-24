import React from 'react';

const PropertyCard = ({ id, image, title, location, price, yieldPercentage, progress, tokenPrice, availableShares, totalShares, onInvest }) => {
    const asset = { _id: id, title, location, price, yieldPercentage, progress, image, tokenPrice, availableShares, totalShares };

    return (
        <div className="card border-0 shadow-sm h-100 overflow-hidden property-card transition-all" style={{ cursor: 'pointer' }}>
            <div className="position-relative">
                <img
                    src={image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    className="card-img-top"
                    alt={title}
                    style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-3 px-2 py-1 bg-white rounded-pill shadow-sm">
                    <span className="text-primary fw-bold small">{yieldPercentage}% Expected Yield</span>
                </div>
            </div>

            <div className="card-body p-4 text-start">
                <p className="text-muted small mb-1"><i className="bi bi-geo-alt me-1"></i>{location}</p>
                <h5 className="card-title fw-bold text-dark mb-3">{title}</h5>

                <div className="row mb-3">
                    <div className="col-6">
                        <p className="text-muted small mb-0">Property Value</p>
                        <p className="fw-bold mb-0 text-primary">${price.toLocaleString()}</p>
                    </div>
                    <div className="col-6 text-end">
                        <p className="text-muted small mb-0">Share Price</p>
                        <p className="fw-bold mb-0 text-primary">${tokenPrice || 100}</p>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Available Shares</span>
                        <span className="fw-bold">{availableShares} / {totalShares}</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                        <div
                            className="progress-bar bg-primary rounded-pill"
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="d-flex justify-content-end mt-1">
                        <span className="extra-small text-muted">{progress}% Funded</span>
                    </div>
                </div>
            </div>

            <div className="card-footer bg-white border-0 p-4 pt-0">
                <button
                    className="btn btn-primary w-100 fw-semibold rounded-pill py-2 shadow-sm"
                    onClick={() => onInvest && onInvest(asset)}
                    data-bs-toggle="modal"
                    data-bs-target="#investModal"
                    disabled={availableShares <= 0}
                >
                    {availableShares <= 0 ? 'Sold Out' : 'Invest Now'}
                </button>
            </div>
            <style>{`
                .extra-small { font-size: 0.7rem; }
            `}</style>
        </div>
    );
};

export default PropertyCard;
