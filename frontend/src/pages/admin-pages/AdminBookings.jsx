import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const TABS = ['all', 'ride', 'rental', 'airport', 'tour'];
const STATUS_COLORS = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    active: '#22C55E',
    completed: '#6366F1',
    cancelled: '#EF4444',
};

const Badge = ({ status }) => (
    <span style={{
        background: `${STATUS_COLORS[status] || '#64748B'}22`,
        color: STATUS_COLORS[status] || '#64748B',
        border: `1px solid ${STATUS_COLORS[status] || '#64748B'}44`,
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize',
    }}>{status}</span>
);

const AdminBookings = () => {
    const { admin } = useAdminAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', margin: 0 }}>All Bookings</h1>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{total} total bookings</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#1E293B', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeTab === tab ? '#EAB308' : 'transparent',
                        color: activeTab === tab ? '#0F172A' : '#94A3B8',
                        fontWeight: activeTab === tab ? '700' : '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.15s',
                    }}>{tab}</button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['Booking ID', 'Customer', 'Service', 'Pickup', 'Date', 'Amount', 'Payment', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '14px 20px', color: '#64748B', fontWeight: '600', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} style={{ padding: '14px 20px' }}>
                                                <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '80%' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                bookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 20px', color: '#EAB308', fontFamily: 'monospace', fontSize: '12px' }}>{b.bookingId}</td>
                                        <td style={{ padding: '14px 20px', color: '#F8FAFC' }}>{b.customerId?.name || '—'}</td>
                                        <td style={{ padding: '14px 20px', color: '#94A3B8', textTransform: 'capitalize' }}>{b.serviceType}</td>
                                        <td style={{ padding: '14px 20px', color: '#94A3B8', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickupLocation}</td>
                                        <td style={{ padding: '14px 20px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{new Date(b.fromDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '14px 20px', color: '#22C55E', fontWeight: '600' }}>LKR {b.totalAmount?.toLocaleString()}</td>
                                        <td style={{ padding: '14px 20px' }}><Badge status={b.paymentStatus} /></td>
                                        <td style={{ padding: '14px 20px' }}><Badge status={b.bookingStatus} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)} style={{
                                width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                                background: page === p ? '#EAB308' : 'rgba(255,255,255,0.06)',
                                color: page === p ? '#0F172A' : '#94A3B8',
                                fontWeight: page === p ? '700' : '400',
                                cursor: 'pointer', fontSize: '13px',
                            }}>{p}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;
