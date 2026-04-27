import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Edit2, Trash2 } from 'lucide-react';

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
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Fleet</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>{total} vehicles</p>
                </div>
                <button
                    onClick={() => navigate('/admin/vehicles/add')}
                    style={{
                        background: '#1e2a3b', color: '#ffffff', fontWeight: '600',
                        padding: '12px 24px', borderRadius: '12px', border: 'none',
                        cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffffff'; }}
                >
                    <Plus size={18} /> Add Vehicle
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                        padding: '8px 20px', borderRadius: '20px', border: '1px solid',
                        borderColor: activeTab === tab ? '#ffc107' : '#e2e8f0',
                        background: activeTab === tab ? '#ffc107' : '#ffffff',
                        color: activeTab === tab ? '#1e2a3b' : '#64748B',
                        fontSize: '14px', fontWeight: activeTab === tab ? '700' : '600',
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: activeTab === tab ? '0 2px 4px rgba(255,193,7,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
                    }}>{tab}</button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ background: '#f1f5f9', borderRadius: '16px', height: '260px', animation: 'pulse 1.5s infinite', border: '1px solid #e2e8f0' }} />
                    ))}
                </div>
            ) : vehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#64748B', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Car size={64} color="#cbd5e1" />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>No vehicles found. <span style={{ color: '#1e2a3b', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }} onClick={() => navigate('/admin/vehicles/add')}>Add one here</span></p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {vehicles.map(v => (
                        <div key={v._id} style={{
                            background: '#ffffff',
                            border: '1px solid rgba(30,42,59,0.08)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            {/* Image */}
                            <div style={{ height: '180px', background: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {v.imageUrl ? (
                                    <img src={v.imageUrl} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                                ) : (
                                    <Car size={64} color="#cbd5e1" />
                                )}
                            </div>
                            {/* Info */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ color: '#1e2a3b', fontWeight: '800', fontSize: '16px' }}>{v.name}</div>
                                        <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '500' }}>{v.type}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#1e2a3b', fontWeight: '800', fontSize: '15px' }}>LKR {v.pricePerDay?.toLocaleString()}</div>
                                        <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '500' }}>/ day</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => navigate(`/admin/vehicles/edit/${v._id}`)} style={{
                                        flex: 1, padding: '10px', borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        background: '#f8fafc',
                                        color: '#1e2a3b', fontWeight: '600', fontSize: '14px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffc107'; e.currentTarget.style.borderColor = '#1e2a3b'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e2a3b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(v._id)} style={{
                                        flex: 1, padding: '10px', borderRadius: '10px',
                                        border: '1px solid #fecaca',
                                        background: '#fef2f2',
                                        color: '#ef4444', fontWeight: '600', fontSize: '14px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s'
                                    }}
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

            {/* Pagination */}
            {pages > 1 && (
                <div style={{ marginTop: '32px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{
                            width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                            background: page === p ? '#1e2a3b' : '#ffffff',
                            color: page === p ? '#ffc107' : '#64748B',
                            border: page === p ? 'none' : '1px solid #e2e8f0',
                            fontWeight: page === p ? '700' : '600', cursor: 'pointer', fontSize: '15px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                        }}>{p}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVehicles;
