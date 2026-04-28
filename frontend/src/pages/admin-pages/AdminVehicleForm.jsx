import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { ArrowLeft, Image as ImageIcon, Save } from 'lucide-react';
import VehicleCard from '../../components/user-components/VehicleCard';
import ImageCropperModal from '../../components/admin-components/ImageCropperModal';

const AdminVehicleForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { admin } = useAdminAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', type: 'Bike', capacity: 2, pricePerDay: '', description: '',
        fuel: 70, steering: 'Manual', available: true
    });
    const [showOriginalPrice, setShowOriginalPrice] = useState(false);
    const [originalPrice, setOriginalPrice] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [originalImgSrc, setOriginalImgSrc] = useState(''); // Always the full original image
    const [loading, setLoading] = useState(false);

    const [additionalImages, setAdditionalImages] = useState([
        { file: null, previewUrl: '', originalImgSrc: '', url: '' },
        { file: null, previewUrl: '', originalImgSrc: '', url: '' },
        { file: null, previewUrl: '', originalImgSrc: '', url: '' }
    ]);
    const [croppingIndex, setCroppingIndex] = useState(-1); // -1 = main, 0,1,2 = additional

    // Image Cropping State
    const [cropImgSrc, setCropImgSrc] = useState('');
    const [isCropping, setIsCropping] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchVehicle = async () => {
                try {
                    const { data } = await axios.get(`/api/admin/vehicles/${id}`, {
                        headers: { Authorization: `Bearer ${admin?.token}` }
                    });
                    setFormData({
                        name: data.name, type: data.type, capacity: data.capacity,
                        pricePerDay: data.pricePerDay, description: data.description || '',
                        fuel: data.fuel || 70, steering: data.steering || 'Manual',
                        available: data.available !== false, // default true
                    });
                    if (data.originalPrice && data.originalPrice !== data.pricePerDay) {
                        setShowOriginalPrice(true);
                        setOriginalPrice(data.originalPrice);
                    }
                    if (data.imageUrl) setPreviewUrl(data.imageUrl);
                    if (data.additionalImages && data.additionalImages.length > 0) {
                        const loadedImages = [
                            { file: null, previewUrl: '', originalImgSrc: '', url: '' },
                            { file: null, previewUrl: '', originalImgSrc: '', url: '' },
                            { file: null, previewUrl: '', originalImgSrc: '', url: '' }
                        ];
                        data.additionalImages.forEach((url, i) => {
                            if (i < 3) loadedImages[i] = { file: null, previewUrl: url, originalImgSrc: url, url };
                        });
                        setAdditionalImages(loadedImages);
                    }
                } catch (err) { alert('Failed to load vehicle'); navigate('/admin/vehicles'); }
            };
            fetchVehicle();
        }
    }, [id]);

    const handleImageChange = (e, index = -1) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const src = reader.result?.toString() || '';
                if (index === -1) {
                    setOriginalImgSrc(src);
                } else {
                    const newArr = [...additionalImages];
                    newArr[index].originalImgSrc = src;
                    setAdditionalImages(newArr);
                }
                setCroppingIndex(index);
                setCropImgSrc(src);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
        if (croppingIndex === -1) {
            setImageFile(croppedFile);
            setPreviewUrl(croppedPreviewUrl);
        } else {
            const newArr = [...additionalImages];
            newArr[croppingIndex].file = croppedFile;
            newArr[croppingIndex].previewUrl = croppedPreviewUrl;
            newArr[croppingIndex].url = ''; // reset URL since it is now a local file
            setAdditionalImages(newArr);
        }
        setIsCropping(false);
        setCropImgSrc('');
        setCroppingIndex(-1);
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        setCropImgSrc('');
        setCroppingIndex(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        // Add originalPrice: if checkbox is on use the value, otherwise set same as pricePerDay (no discount)
        data.append('originalPrice', showOriginalPrice && originalPrice ? originalPrice : formData.pricePerDay);
        if (imageFile) data.append('image', imageFile);

        additionalImages.forEach((img) => {
            if (img.url) {
                data.append('existingAdditionalImages', img.url);
            }
            if (img.file) {
                data.append('additionalImages', img.file);
            }
        });

        try {
            if (isEdit) {
                // Backend uses PATCH
                await axios.patch(`/api/admin/vehicles/${id}`, data, {
                    headers: { Authorization: `Bearer ${admin?.token}` }
                });
            } else {
                await axios.post('/api/admin/vehicles', data, {
                    headers: { Authorization: `Bearer ${admin?.token}` }
                });
            }
            navigate('/admin/vehicles');
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving vehicle');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', color: '#1e2a3b', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' };
    const labelStyle = { display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '8px' };

    const previewVehicle = {
        _id: 'preview',
        name: formData.name || 'Vehicle Name',
        type: formData.type,
        capacity: formData.capacity,
        price: formData.pricePerDay || '0',
        originalPrice: (showOriginalPrice && originalPrice) ? parseFloat(originalPrice) : null,
        fuel: formData.fuel,
        steering: formData.steering,
        image: previewUrl || null,
        available: formData.available,
    };

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>Fill out the details below to {isEdit ? 'update the' : 'add a'} vehicle.</p>
                </div>
                <button onClick={() => navigate('/admin/vehicles')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1e2a3b'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <ArrowLeft size={20} color="#1e2a3b" />
                </button>
            </div>

            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Form Column */}
                <form onSubmit={handleSubmit} style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Vehicle Image</label>
                        <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: previewUrl ? '0' : '32px', textAlign: 'center', background: '#f8fafc', position: 'relative', overflow: 'hidden', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {previewUrl ? (
                                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f8fafc' }} />
                                    {/* Re-crop button — re-opens cropper with the ORIGINAL image */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (originalImgSrc) {
                                                setCropImgSrc(originalImgSrc);
                                                setIsCropping(true);
                                            }
                                        }}
                                        style={{ position: 'absolute', bottom: '8px', left: '8px', background: '#ffc107', color: '#1e2a3b', fontSize: '12px', fontWeight: '700', padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', opacity: originalImgSrc ? 1 : 0.4 }}
                                    >
                                        ✂ Re-crop
                                    </button>
                                    {/* Click to change — opens file picker */}
                                    <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                                        <div style={{ background: '#1e2a3b', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer' }}>Click to change</div>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, -1)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <ImageIcon size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                                    <div style={{ color: '#64748B', fontSize: '14px', fontWeight: '500' }}>Click or drag image to upload</div>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, -1)} required={!isEdit} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Additional Images (Up to 3)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {additionalImages.map((img, index) => (
                                <div key={index} style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: img.previewUrl ? '0' : '16px', textAlign: 'center', background: '#f8fafc', position: 'relative', overflow: 'hidden', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {img.previewUrl ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img src={img.previewUrl} alt={`Additional ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f8fafc' }} />
                                            <button type="button" onClick={() => {
                                                const newArr = [...additionalImages];
                                                newArr[index] = { file: null, previewUrl: '', originalImgSrc: '', url: '' };
                                                setAdditionalImages(newArr);
                                            }} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', border: 'none', cursor: 'pointer', zIndex: 10 }}>✕</button>
                                            
                                            {img.originalImgSrc && (
                                                <button type="button" onClick={() => {
                                                    setCroppingIndex(index);
                                                    setCropImgSrc(img.originalImgSrc);
                                                    setIsCropping(true);
                                                }} style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#ffc107', color: '#1e2a3b', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>✂ Re-crop</button>
                                            )}

                                            <div style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 5 }}>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageIcon size={24} color="#cbd5e1" style={{ marginBottom: '4px' }} />
                                            <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '500' }}>Add</div>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Vehicle Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Price Per Day (LKR)</label>
                            <input type="number" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                    </div>

                    {/* Original Price (Cutting Price) */}
                    <div style={{ marginBottom: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                            <div
                                onClick={() => setShowOriginalPrice(!showOriginalPrice)}
                                style={{
                                    width: '42px', height: '24px', borderRadius: '12px',
                                    background: showOriginalPrice ? '#ffc107' : '#e2e8f0',
                                    position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0
                                }}
                            >
                                <div style={{
                                    position: 'absolute', top: '3px', left: showOriginalPrice ? '21px' : '3px',
                                    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }} />
                            </div>
                            <span style={{ color: '#1e2a3b', fontSize: '14px', fontWeight: '600' }}>
                                Show Cutting Price (Original / Strikethrough Price)
                            </span>
                        </label>
                        {showOriginalPrice && (
                            <div style={{ marginTop: '14px' }}>
                                <label style={labelStyle}>Original Price — LKR (will appear crossed out)</label>
                                <input
                                    type="number"
                                    value={originalPrice}
                                    onChange={e => setOriginalPrice(e.target.value)}
                                    placeholder="e.g. 15000"
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = '#ffc107'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Type</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}>
                                {['Bike', 'Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Capacity (Persons)</label>
                            <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Fuel Tank (Litres)</label>
                            <input type="number" value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Steering</label>
                            <select value={formData.steering} onChange={e => setFormData({...formData, steering: e.target.value})} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Description (Optional)</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} style={{...inputStyle, resize: 'vertical'}} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                    </div>

                    {/* Availability Toggle */}
                    <div style={{ marginBottom: '32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                            <div
                                onClick={() => setFormData({...formData, available: !formData.available})}
                                style={{
                                    width: '42px', height: '24px', borderRadius: '12px',
                                    background: formData.available ? '#22c55e' : '#ef4444',
                                    position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0
                                }}
                            >
                                <div style={{
                                    position: 'absolute', top: '3px', left: formData.available ? '21px' : '3px',
                                    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }} />
                            </div>
                            <span style={{ color: '#1e2a3b', fontSize: '14px', fontWeight: '600' }}>
                                {formData.available ? '🟢 Available — Customers can rent this vehicle' : '🔴 Not Available — Hidden from rentals (e.g. broken/maintenance)'}
                            </span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={loading} style={{ background: loading ? '#94A3B8' : '#1e2a3b', color: '#ffffff', fontWeight: '600', padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; } }} onMouseLeave={e => { if(!loading) { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffffff'; } }}>
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Vehicle'}
                        </button>
                    </div>
                </form>

                {/* Live Preview Column */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div style={{ color: '#475569', fontSize: '13px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</div>
                    <div style={{ pointerEvents: 'none' }}>
                        <VehicleCard vehicle={previewVehicle} />
                    </div>
                </div>
            </div>

            {/* Cropper Modal */}
            {isCropping && cropImgSrc && (
                <ImageCropperModal
                    imgSrc={cropImgSrc}
                    aspect={16 / 9}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
};

export default AdminVehicleForm;
