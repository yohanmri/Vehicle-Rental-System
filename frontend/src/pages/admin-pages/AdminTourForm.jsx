import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { ArrowLeft, Image as ImageIcon, Save, Plus, X } from 'lucide-react';
import ImageCropperModal from '../../components/admin-components/ImageCropperModal';

const AdminTourForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { admin } = useAdminAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', duration: '', price: '', description: ''
    });
    const [destinations, setDestinations] = useState(['']);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // Image Cropping State
    const [cropImgSrc, setCropImgSrc] = useState('');
    const [isCropping, setIsCropping] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchTour = async () => {
                try {
                    const { data } = await axios.get(`/api/admin/tours/${id}`, {
                        headers: { Authorization: `Bearer ${admin?.token}` }
                    });
                    setFormData({
                        title: data.title, duration: data.duration, price: data.price,
                        description: data.description || ''
                    });
                    setDestinations(data.destinations?.length ? data.destinations : ['']);
                    if (data.imageUrl) setPreviewUrl(data.imageUrl);
                } catch (err) { alert('Failed to load tour'); navigate('/admin/tours'); }
            };
            fetchTour();
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

    const handleDestChange = (index, value) => {
        const newDests = [...destinations];
        newDests[index] = value;
        setDestinations(newDests);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('destinations', JSON.stringify(destinations.filter(d => d.trim() !== '')));
        if (imageFile) data.append('image', imageFile);

        try {
            if (isEdit) {
                await axios.put(`/api/admin/tours/${id}`, data, {
                    headers: { Authorization: `Bearer ${admin?.token}` }
                });
            } else {
                await axios.post('/api/admin/tours', data, {
                    headers: { Authorization: `Bearer ${admin?.token}` }
                });
            }
            navigate('/admin/tours');
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving tour');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', color: '#1e2a3b', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' };
    const labelStyle = { display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '8px' };

    const previewPkg = {
        title: formData.title,
        duration: formData.duration,
        price: formData.price,
        destinations: destinations,
        image: previewUrl
    };

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>{isEdit ? 'Edit Tour' : 'Add New Tour'}</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>Fill out the details below to {isEdit ? 'update the' : 'add a'} tour.</p>
                </div>
                <button onClick={() => navigate('/admin/tours')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1e2a3b'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <ArrowLeft size={20} color="#1e2a3b" />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Form Column */}
                <form onSubmit={handleSubmit} style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Tour Image</label>
                        <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '32px', textAlign: 'center', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                            {previewUrl ? (
                                <div style={{ position: 'relative', height: '200px' }}>
                                    <img src={previewUrl} alt="Preview" style={{ height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Tour Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Duration (e.g., "3 Days")</label>
                            <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Price (LKR)</label>
                            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Destinations</label>
                        {destinations.map((dest, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input type="text" value={dest} onChange={e => handleDestChange(i, e.target.value)} required style={inputStyle} placeholder={`Destination ${i + 1}`} onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                                {destinations.length > 1 && (
                                    <button type="button" onClick={() => setDestinations(destinations.filter((_, idx) => idx !== i))} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', width: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => setDestinations([...destinations, ''])} style={{ background: 'transparent', color: '#1e2a3b', border: '1px dashed #cbd5e1', padding: '10px', borderRadius: '10px', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#1e2a3b'}>
                            <Plus size={16} /> Add Destination
                        </button>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} style={{...inputStyle, resize: 'vertical'}} required onFocus={e => { e.target.style.borderColor = '#ffc107'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={loading} style={{ background: loading ? '#94A3B8' : '#1e2a3b', color: '#ffffff', fontWeight: '600', padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; } }} onMouseLeave={e => { if(!loading) { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffffff'; } }}>
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Tour'}
                        </button>
                    </div>
                </form>

                {/* Live Preview Column */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div style={{ color: '#475569', fontSize: '13px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</div>
                    <div style={{ background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(30,42,59,0.05)', pointerEvents: 'none' }}>
                        <div style={{ height: '256px', position: 'relative', overflow: 'hidden', background: '#e2e8f0' }}>
                            {previewPkg.image ? (
                                <img src={previewPkg.image} alt={previewPkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageIcon size={48} color="#cbd5e1" />
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '9999px', fontWeight: '700', color: '#1e2a3b', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                LKR {Number(previewPkg.price || 0).toLocaleString()}
                            </div>
                        </div>
                        <div style={{ padding: '32px' }}>
                            <div style={{ color: '#ffc107', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                                {previewPkg.duration || 'Duration'}
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e2a3b', margin: '0 0 16px 0' }}>{previewPkg.title || 'Tour Title'}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {previewPkg.destinations?.filter(d => d.trim() !== '').map((dest, j) => (
                                    <span key={j} style={{ fontSize: '10px', fontWeight: '700', background: '#ffffff', padding: '4px 10px', borderRadius: '9999px', color: '#6b7280', border: '1px solid #f3f4f6', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                                        {dest}
                                    </span>
                                ))}
                                {previewPkg.destinations?.filter(d => d.trim() !== '').length === 0 && (
                                    <span style={{ fontSize: '10px', fontWeight: '700', background: '#ffffff', padding: '4px 10px', borderRadius: '9999px', color: '#9ca3af', border: '1px solid #f3f4f6', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>Destination</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cropper Modal */}
            {isCropping && cropImgSrc && (
                <ImageCropperModal
                    imgSrc={cropImgSrc}
                    aspect={3 / 2} // 3:2 aspect ratio for tours
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
};

export default AdminTourForm;
