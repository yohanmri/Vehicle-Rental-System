import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const TABS = ['all', 'Bike', 'Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'];

const AdminVehicles = () => {
    const { admin } = useAdminAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/admin/vehicles', {
                params: { type: activeTab, page, limit: 9 },
                headers: { Authorization: `Bearer ${admin?.token}` },
            });
            setVehicles(data.vehicles);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            await axios.delete(`/api/admin/vehicles/${id}`, {
                headers: { Authorization: `Bearer ${admin?.token}` },
            });
            fetchVehicles();
        } catch (err) {
            alert('Failed to delete vehicle');
        }
    };

    useEffect(() => { fetchVehicles(); }, [activeTab, page]);

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', margin: 0 }}>Fleet</h1>
                    <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{total} vehicles</p>
                </div>
                <button
                    onClick={() => navigate('/admin/vehicles/add')}
                    style={{
                        background: '#EAB308', color: '#0F172A', fontWeight: '700',
                        padding: '10px 20px', borderRadius: '10px', border: 'none',
                        cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                    ＋ Add Vehicle
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                        padding: '7px 16px', borderRadius: '8px', border: '1px solid',
                        borderColor: activeTab === tab ? '#EAB308' : 'rgba(255,255,255,0.1)',
                        background: activeTab === tab ? 'rgba(234,179,8,0.12)' : 'transparent',
                        color: activeTab === tab ? '#EAB308' : '#94A3B8',
                        fontSize: '13px', fontWeight: activeTab === tab ? '600' : '400',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}>{tab}</button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ background: '#1E293B', borderRadius: '12px', height: '220px', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            ) : vehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#64748B' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚗</div>
                    <p>No vehicles found. <span style={{ color: '#EAB308', cursor: 'pointer' }} onClick={() => navigate('/admin/vehicles/add')}>Add one →</span></p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {vehicles.map(v => (
                        <div key={v._id} style={{
                            background: '#1E293B',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(234,179,8,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                            {/* Image */}
                            <div style={{ height: '160px', background: '#0F172A', overflow: 'hidden' }}>
                                {v.imageUrl ? (
                                    <img src={v.imageUrl} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🚗</div>
                                )}
                            </div>
                            {/* Info */}
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <div style={{ color: '#F8FAFC', fontWeight: '600', fontSize: '15px' }}>{v.name}</div>
                                        <div style={{ color: '#64748B', fontSize: '12px' }}>{v.type}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#EAB308', fontWeight: '700', fontSize: '14px' }}>LKR {v.pricePerDay?.toLocaleString()}</div>
                                        <div style={{ color: '#64748B', fontSize: '11px' }}>/ day</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => navigate(`/admin/vehicles/edit/${v._id}`)} style={{
                                        flex: 1, padding: '8px', borderRadius: '8px',
                                        border: '1px solid rgba(234,179,8,0.3)',
                                        background: 'rgba(234,179,8,0.08)',
                                        color: '#EAB308', fontWeight: '600', fontSize: '13px',
                                        cursor: 'pointer',
                                    }}>Edit</button>
                                    <button onClick={() => handleDelete(v._id)} style={{
                                        flex: 1, padding: '8px', borderRadius: '8px',
                                        border: '1px solid rgba(239,68,68,0.3)',
                                        background: 'rgba(239,68,68,0.08)',
                                        color: '#F87171', fontWeight: '600', fontSize: '13px',
                                        cursor: 'pointer',
                                    }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{
                            width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                            background: page === p ? '#EAB308' : '#1E293B',
                            color: page === p ? '#0F172A' : '#94A3B8',
                            fontWeight: page === p ? '700' : '400', cursor: 'pointer', fontSize: '13px',
                        }}>{p}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVehicles;
