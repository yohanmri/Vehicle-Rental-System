import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Edit2, Trash2, Heart, Fuel, Settings2, Users, Search } from 'lucide-react';

const TABS = ['all', 'Bike', 'Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'];

const AdminVehicles = () => {
    const { admin } = useAdminAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredVehicles = vehicles.filter(v => 
        (v.name && v.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.type && v.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Fleet</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>{total} vehicles</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/admin/vehicles/add')}
                        style={{
                            background: '#1e2a3b', color: '#ffffff', fontWeight: '600',
                            padding: '10px 24px', borderRadius: '12px', border: 'none',
                            cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '42px'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffffff'; }}
                    >
                        <Plus size={18} /> Add Vehicle
                    </button>
                </div>
            </div>

            {/* Tabs and Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div className="admin-filter-tabs" style={{ display: 'flex', gap: '8px' }}>
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                            padding: '8px 20px', borderRadius: '20px',
                            borderColor: activeTab === tab ? '#ffc107' : '#e2e8f0',
                            border: '1px solid',
                            background: activeTab === tab ? '#ffc107' : '#ffffff',
                            color: activeTab === tab ? '#1e2a3b' : '#64748B',
                            fontSize: '14px', fontWeight: activeTab === tab ? '700' : '600',
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: activeTab === tab ? '0 2px 4px rgba(255,193,7,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
                        }}>{tab}</button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                    <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search vehicles..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 16px 10px 40px', background: '#ffffff',
                            border: '1px solid rgba(30,42,59,0.08)', borderRadius: '12px', fontSize: '14px',
                            color: '#1e2a3b', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s'
                        }}
                        onFocus={e => e.currentTarget.style.border = '1px solid #ffc107'}
                        onBlur={e => e.currentTarget.style.border = '1px solid rgba(30,42,59,0.08)'}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ background: '#f1f5f9', borderRadius: '20px', height: '360px', opacity: 0.6, border: '1px solid #e2e8f0' }} />
                    ))}
                </div>
            ) : filteredVehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#64748B', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Car size={64} color="#cbd5e1" />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>No vehicles found. <span style={{ color: '#1e2a3b', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }} onClick={() => navigate('/admin/vehicles/add')}>Add one here</span></p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredVehicles.map(v => (
                        /* Card styled exactly like VehicleCard from user side */
                        <div key={v._id} style={{
                            background: '#f1f5f9', borderRadius: '20px', padding: '20px',
                            boxShadow: '0 2px 8px rgba(30,42,59,0.06)', border: '1px solid rgba(30,42,59,0.1)',
                            display: 'flex', flexDirection: 'column', transition: 'all 0.3s'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(30,42,59,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,42,59,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {/* Header: Name + Heart (decorative) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <h3 style={{ color: '#111827', fontWeight: '800', fontSize: '18px', margin: 0, lineHeight: 1.2 }}>{v.name}</h3>
                                    <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>{v.type || 'Standard'}</span>
                                </div>
                                <Heart size={20} color="#d1d5db" />
                            </div>

                            {/* Image */}
                            <div style={{ position: 'relative', width: '100%', height: '160px', margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {v.imageUrl ? (
                                    <img src={v.imageUrl} alt={v.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.5s' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                ) : (
                                    <Car size={80} color="#d1d5db" />
                                )}
                            </div>

                            {/* Specs Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af' }}>
                                    <Fuel size={16} />
                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{v.fuel || 70}L</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af' }}>
                                    <Settings2 size={16} />
                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{v.steering || 'Manual'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af' }}>
                                    <Users size={16} />
                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{v.capacity || 4} People</span>
                                </div>
                            </div>

                            {/* Pricing + Actions */}
                            <div style={{ borderTop: '1px solid rgba(30,42,59,0.08)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '17px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>
                                        LKR {Number(v.pricePerDay).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', marginLeft: '4px' }}>/ day</span>
                                    </div>
                                    {v.originalPrice != null && String(v.originalPrice) !== "" && (
                                        <div style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through', marginTop: '2px' }}>
                                            LKR {Number(v.originalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => navigate(`/admin/vehicles/edit/${v._id}`)} style={{
                                        background: '#1e2a3b', color: '#fff', border: 'none',
                                        padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#fff'; }}
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(v._id)} style={{
                                        background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca',
                                        padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                                    >
                                        <Trash2 size={14} /> Delete
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
                            width: '40px', height: '40px', borderRadius: '10px',
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
