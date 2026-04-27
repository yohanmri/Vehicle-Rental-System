import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { ArrowLeft, Image as ImageIcon, Save, Edit2 } from 'lucide-react';
import VehicleCard from '../../components/user-components/VehicleCard';
import ImageCropperModal from '../../components/admin-components/ImageCropperModal';

const AdminVehicleForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { admin } = useAdminAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', type: 'Bike', capacity: 2, pricePerDay: '', description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

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
                        pricePerDay: data.pricePerDay, description: data.description || ''
                    });
                    if (data.imageUrl) setPreviewUrl(data.imageUrl);
                } catch (err) { alert('Failed to load vehicle'); navigate('/admin/vehicles'); }
            };
            fetchVehicle();
        }
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCropImgSrc(reader.result?.toString() || '');
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
        // Reset the input value so the same file can be selected again
        e.target.value = '';
    };

    const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
        setImageFile(croppedFile);
        setPreviewUrl(croppedPreviewUrl);
        setIsCropping(false);
        setCropImgSrc('');
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        setCropImgSrc('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            if (isEdit) {
                await axios.put(`/api/admin/vehicles/${id}`, data, {
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
        price: formData.pricePerDay || '0.00',
        image: previewUrl || null // Use previewUrl for local preview, fallback to null
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

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Form Column */}
                <form onSubmit={handleSubmit} style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Vehicle Image</label>
                        <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '32px', textAlign: 'center', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                            {previewUrl ? (
                                <div style={{ position: 'relative', height: '200px' }}>
                                    <img src={previewUrl} alt="Preview" style={{ height: '100%', objectFit: 'contain' }} />
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <ImageIcon size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                                    <div style={{ color: '#64748B', fontSize: '14px', fontWeight: '500' }}>Click or drag image to upload</div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} required={!isEdit} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Vehicle Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Price Per Day (LKR)</label>
                            <input type="number" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

                    <div style={{ marginBottom: '32px' }}>
                        <label style={labelStyle}>Description (Optional)</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} style={{...inputStyle, resize: 'vertical'}} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
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
                    aspect={16 / 9} // 16:9 aspect ratio for vehicles
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
};

export default AdminVehicleForm;
