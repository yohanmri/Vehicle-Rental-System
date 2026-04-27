import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

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
                    <h1 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', margin: 0 }}>Tours</h1>
                    <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{total} tours</p>
                </div>
                <button onClick={() => navigate('/admin/tours/add')} style={{
                    background: '#EAB308', color: '#0F172A', fontWeight: '700',
                    padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px',
                }}>＋ Add Tour</button>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ background: '#1E293B', borderRadius: '12px', height: '240px' }} />
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#64748B' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                    <p>No tours found. <span style={{ color: '#EAB308', cursor: 'pointer' }} onClick={() => navigate('/admin/tours/add')}>Add one →</span></p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {tours.map(t => (
                        <div key={t._id} style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(234,179,8,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                            <div style={{ height: '160px', background: '#0F172A', overflow: 'hidden' }}>
                                {t.imageUrl ? (
                                    <img src={t.imageUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🗺️</div>
                                )}
                            </div>
                            <div style={{ padding: '16px' }}>
                                <div style={{ color: '#F8FAFC', fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{t.title}</div>
                                <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>{t.duration} • LKR {t.price?.toLocaleString()}</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {t.destinations?.slice(0, 3).map(d => (
                                        <span key={d} style={{ background: 'rgba(234,179,8,0.1)', color: '#EAB308', padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{d}</span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => navigate(`/admin/tours/edit/${t._id}`)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.08)', color: '#EAB308', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(t._id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#F87171', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
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
