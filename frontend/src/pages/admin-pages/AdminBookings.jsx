import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { Search } from 'lucide-react';

const TABS = ['all', 'ride', 'rental', 'airport', 'tour'];
const STATUS_COLORS = {
    pending: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
    confirmed: { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' },
    active: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
    completed: { bg: '#e0e7ff', text: '#4f46e5', border: '#c7d2fe' },
    cancelled: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
};

const Badge = ({ status }) => {
    const style = STATUS_COLORS[status] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
    return (
        <span style={{
            background: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize',
        }}>{status}</span>
    );
};

const AdminBookings = () => {
    const { admin } = useAdminAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);

    const LIMIT = 10;

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/admin/bookings', {
                params: { type: activeTab, page, limit: LIMIT },
                headers: { Authorization: `Bearer ${admin?.token}` },
            });
            setBookings(data.bookings);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, [activeTab, page]);

    const filteredBookings = bookings.filter(b => 
        (b.bookingId && b.bookingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.customerId?.name && b.customerId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.serviceType && b.serviceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.pickupLocation && b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>All Bookings</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>{total} total bookings</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(30,42,59,0.08)' }}>
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                            padding: '8px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === tab ? '#ffc107' : 'transparent',
                            color: activeTab === tab ? '#1e2a3b' : '#64748B',
                            fontWeight: activeTab === tab ? '700' : '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s',
                        }}>{tab}</button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                    <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search bookings..." 
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

            {/* Table */}
            <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(30,42,59,0.08)' }}>
                                {['Booking ID', 'Customer', 'Service', 'Pickup', 'Date', 'Amount', 'Payment', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)' }}>
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} style={{ padding: '16px 24px' }}>
                                                <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '80%', animation: 'pulse 1.5s infinite' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: '64px', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <Search size={40} color="#cbd5e1" />
                                            <span style={{ fontSize: '15px', fontWeight: '500' }}>No bookings found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 24px', color: '#1e2a3b', fontFamily: 'monospace', fontSize: '13px', fontWeight: '600' }}>{b.bookingId}</td>
                                        <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '500' }}>{b.customerId?.name || '—'}</td>
                                        <td style={{ padding: '16px 24px', color: '#64748B', textTransform: 'capitalize', fontWeight: '500' }}>{b.serviceType}</td>
                                        <td style={{ padding: '16px 24px', color: '#64748B', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickupLocation}</td>
                                        <td style={{ padding: '16px 24px', color: '#64748B', whiteSpace: 'nowrap' }}>{new Date(b.fromDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '700' }}>LKR {b.totalAmount?.toLocaleString()}</td>
                                        <td style={{ padding: '16px 24px' }}><Badge status={b.paymentStatus} /></td>
                                        <td style={{ padding: '16px 24px' }}><Badge status={b.bookingStatus} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(30,42,59,0.08)', display: 'flex', gap: '8px', justifyContent: 'flex-end', background: '#f8fafc' }}>
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)} style={{
                                width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                                background: page === p ? '#1e2a3b' : '#ffffff',
                                color: page === p ? '#ffc107' : '#64748B',
                                border: page === p ? 'none' : '1px solid #e2e8f0',
                                fontWeight: page === p ? '700' : '600',
                                cursor: 'pointer', fontSize: '14px',
                                transition: 'all 0.2s'
                            }}>{p}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;
