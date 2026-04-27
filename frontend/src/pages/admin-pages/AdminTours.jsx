import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Edit2, Trash2 } from 'lucide-react';

const AdminTours = () => {
    const { admin } = useAdminAuth();
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/admin/tours', {
                headers: { Authorization: `Bearer ${admin?.token}` },
            });
            setTours(data.tours);
            setTotal(data.total);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tour?')) return;
        try {
            await axios.delete(`/api/admin/tours/${id}`, {
                headers: { Authorization: `Bearer ${admin?.token}` },
            });
            fetchTours();
        } catch (err) { alert('Failed to delete tour'); }
    };

    useEffect(() => { fetchTours(); }, []);

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Tours</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>{total} tours available</p>
                </div>
                <button onClick={() => navigate('/admin/tours/add')} style={{
                    background: '#1e2a3b', color: '#ffffff', fontWeight: '600',
                    padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px',
                    display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffffff'; }}
                >
                    <Plus size={18} /> Add Tour
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ background: '#f1f5f9', borderRadius: '16px', height: '300px', animation: 'pulse 1.5s infinite', border: '1px solid #e2e8f0' }} />
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#64748B', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Map size={64} color="#cbd5e1" />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>No tours found. <span style={{ color: '#1e2a3b', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }} onClick={() => navigate('/admin/tours/add')}>Add one here</span></p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {tours.map(t => (
                        <div key={t._id} style={{ 
                            background: '#ffffff', border: '1px solid rgba(30,42,59,0.08)', borderRadius: '16px', overflow: 'hidden',
                            transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '180px', background: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {t.imageUrl ? (
                                    <img src={t.imageUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Map size={64} color="#cbd5e1" />
                                )}
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={{ color: '#1e2a3b', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>{t.title}</div>
                                <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '12px', fontWeight: '500' }}>{t.duration} • LKR {t.price?.toLocaleString()}</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                    {t.destinations?.slice(0, 3).map(d => (
                                        <span key={d} style={{ background: '#f1f5f9', color: '#1e2a3b', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{d}</span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => navigate(`/admin/tours/edit/${t._id}`)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e2a3b', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffc107'; e.currentTarget.style.borderColor = '#1e2a3b'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e2a3b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(t._id)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTours;
