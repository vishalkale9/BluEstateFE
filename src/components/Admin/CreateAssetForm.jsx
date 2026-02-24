import React, { useState } from 'react';
import { assetService } from '../../services/apiService';

const CreateAssetForm = ({ onAssetCreated, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        totalShares: '',
        tokenPrice: '',
        apr: '',
        category: 'Residential',
        area: '',
        amenities: '',
        isFeatured: false,
        irr: '',
        propertyType: 'Office',
        listingType: 'Fractional',
        occupancyStatus: 'Vacant',
        yearBuilt: '',
        mapUrl: '',
        lat: '',
        lng: '',
        nearbyLandmarks: '',
        marketGrowth: '',
        projectHighlights: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Populate form for editing
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                location: initialData.location || '',
                price: initialData.price || '',
                totalShares: initialData.totalShares || '',
                tokenPrice: initialData.tokenPrice || '',
                apr: initialData.apr || initialData.yieldPercentage || '',
                category: initialData.category || 'Residential',
                area: initialData.area || '',
                amenities: initialData.amenities || '',
                isFeatured: initialData.isFeatured || false,
                irr: initialData.irr || '',
                propertyType: initialData.propertyType || 'Office',
                listingType: initialData.listingType || 'Fractional',
                occupancyStatus: initialData.occupancyStatus || 'Vacant',
                yearBuilt: initialData.yearBuilt || '',
                mapUrl: initialData.mapUrl || '',
                lat: initialData.coordinates?.lat || initialData.lat || '',
                lng: initialData.coordinates?.lng || initialData.lng || '',
                nearbyLandmarks: Array.isArray(initialData.nearbyLandmarks) ? initialData.nearbyLandmarks.join(', ') : (initialData.nearbyLandmarks || ''),
                marketGrowth: initialData.marketGrowth || '',
                projectHighlights: Array.isArray(initialData.projectHighlights) ? initialData.projectHighlights.join(', ') : (initialData.projectHighlights || ''),
            });
        } else {
            setFormData({
                title: '',
                description: '',
                location: '',
                price: '',
                totalShares: '',
                tokenPrice: '',
                apr: '',
                category: 'Residential',
                area: '',
                amenities: '',
                isFeatured: false,
                irr: '',
                propertyType: 'Office',
                listingType: 'Fractional',
                occupancyStatus: 'Vacant',
                yearBuilt: '',
                mapUrl: '',
                lat: '',
                lng: '',
                nearbyLandmarks: '',
                marketGrowth: '',
                projectHighlights: '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            data.append('availableShares', formData.totalShares);

            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i]);
            }

            if (initialData?._id) {
                await assetService.updateAsset(initialData._id, data);
            } else {
                await assetService.createAsset(data);
            }

            setMessage({
                type: 'success',
                text: `Asset ${initialData ? 'updated' : 'created'} successfully!`
            });

            // Only clear the form if we are NOT in edit mode
            if (!initialData) {
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    price: '',
                    totalShares: '',
                    tokenPrice: '',
                    apr: '',
                    category: 'Residential',
                    area: '',
                    amenities: '',
                    isFeatured: false,
                    irr: '',
                    propertyType: 'Office',
                    listingType: 'Fractional',
                    occupancyStatus: 'Vacant',
                    yearBuilt: '',
                    mapUrl: '',
                    lat: '',
                    lng: '',
                    nearbyLandmarks: '',
                    marketGrowth: '',
                    projectHighlights: '',
                });
                setImages([]);
            }

            if (onAssetCreated) {
                setTimeout(() => {
                    onAssetCreated();
                }, 1500);
            }
        } catch (error) {
            console.error("Failed to process asset", error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Failed to process asset.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="text-center mb-4">
                <h4 className="fw-bold text-primary">
                    <i className={`bi bi-${initialData ? 'pencil-square' : 'plus-circle'} me-2`}></i>
                    {initialData ? 'Update Property' : 'List New Property'}
                </h4>
                <p className="text-muted small">
                    {initialData ? `Editing: ${initialData.title}` : 'Tokenize a real estate asset on the platform'}
                </p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} py-2 small mb-4`} role="alert">
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label small fw-bold">Property Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="e.g. Manhattan Luxury Penthouse"
                            required
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Category</label>
                        <select
                            name="category"
                            className="form-select bg-light border-0 px-3 py-2"
                            onChange={handleChange}
                            value={formData.category}
                        >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Villas">Villas</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Land">Land</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="New York, USA"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Total Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="1000000"
                            required
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">APR (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="apr"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="10.5"
                            required
                            value={formData.apr}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Area (sq ft)</label>
                        <input
                            type="number"
                            name="area"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="1500"
                            required
                            value={formData.area}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Total Shares</label>
                        <input
                            type="number"
                            name="totalShares"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="10000"
                            required
                            value={formData.totalShares}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Token Price ($)</label>
                        <input
                            type="number"
                            name="tokenPrice"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="100"
                            required
                            value={formData.tokenPrice}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Target IRR (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="irr"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="15.8"
                            required
                            value={formData.irr}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Year Built</label>
                        <input
                            type="number"
                            name="yearBuilt"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="2021"
                            required
                            value={formData.yearBuilt}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Property Type</label>
                        <select
                            name="propertyType"
                            className="form-select bg-light border-0 px-3 py-2"
                            onChange={handleChange}
                            value={formData.propertyType}
                        >
                            <option value="Office">Office</option>
                            <option value="Retail">Retail</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Residential">Residential</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Villas">Villas</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Listing Type</label>
                        <select
                            name="listingType"
                            className="form-select bg-light border-0 px-3 py-2"
                            onChange={handleChange}
                            value={formData.listingType}
                        >
                            <option value="Fractional">Fractional Listing</option>
                            <option value="Direct Purchase">Direct Purchase</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Occupancy Status</label>
                        <select
                            name="occupancyStatus"
                            className="form-select bg-light border-0 px-3 py-2"
                            onChange={handleChange}
                            value={formData.occupancyStatus}
                        >
                            <option value="Rented">Rented</option>
                            <option value="Vacant">Vacant</option>
                            <option value="Under Construction">Under Construction</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold">Amenities</label>
                        <input
                            type="text"
                            name="amenities"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="Pool, Gym, Parking"
                            required
                            value={formData.amenities}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <hr className="my-2 border-secondary opacity-10" />
                        <h6 className="fw-bold text-primary mb-3">
                            <i className="bi bi-geo-fill me-2"></i>Project Intelligence & Location
                        </h6>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label small fw-bold">Google Maps URL</label>
                        <input
                            type="url"
                            name="mapUrl"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="https://maps.google.com/..."
                            value={formData.mapUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            name="lat"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="25.2048"
                            value={formData.lat}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            name="lng"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="55.2708"
                            value={formData.lng}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Nearby Landmarks (Comma separated)</label>
                        <input
                            type="text"
                            name="nearbyLandmarks"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="Burj Khalifa, Metro, Marina Mall"
                            value={formData.nearbyLandmarks}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Market Growth Cap (%)</label>
                        <input
                            type="text"
                            name="marketGrowth"
                            className="form-control bg-light border-0 px-3 py-2"
                            placeholder="7.5% annual growth forecast"
                            value={formData.marketGrowth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold">Project Highlights (Comma separated)</label>
                        <textarea
                            name="projectHighlights"
                            className="form-control bg-light border-0 px-3 py-2"
                            rows="2"
                            placeholder="Sea View, Sustainable Architecture, 24/7 Concierge"
                            value={formData.projectHighlights}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold">Description</label>
                        <textarea
                            name="description"
                            className="form-control bg-light border-0 px-3 py-2"
                            rows="3"
                            placeholder="Describe the property and yield details..."
                            required
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold d-block">Images {initialData && '(Optional if keep existing)'}</label>
                        <input
                            type="file"
                            name="images"
                            multiple
                            className="form-control bg-light border-0 px-3 py-2"
                            onChange={handleFileChange}
                            required={!initialData}
                        />
                    </div>

                    <div className="col-md-6 d-flex align-items-center mt-4">
                        <div className="form-check form-switch">
                            <input
                                className="form-check-label form-check-input"
                                type="checkbox"
                                name="isFeatured"
                                id="isFeaturedSwitch"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                            />
                            <label className="form-check-label fw-bold small ms-2" htmlFor="isFeaturedSwitch">Featured Asset</label>
                        </div>
                    </div>

                    <div className="col-12 mt-4 text-center">
                        <button
                            type="submit"
                            className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm"
                            disabled={loading}
                        >
                            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                            {loading ? 'Processing...' : (initialData ? 'Update Details' : 'Confirm Listing')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateAssetForm;
