import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { CreditCard } from 'lucide-react';

const STATUS_COLORS = { 
    pending: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' }, 
    success: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' }, 
    refunded: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' } 
};

const AdminPayments = () => {
    const { admin } = useAdminAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/admin/payments', {
                    params: { method: activeTab, page, limit: 10 },
                    headers: { Authorization: `Bearer ${admin?.token}` },
                });
                setPayments(data.payments);
                setTotal(data.total);
                setPages(data.pages);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch();
    }, [activeTab, page]);

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Payments</h1>
                <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>{total} transactions</p>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(30,42,59,0.08)' }}>
                {['all', 'cash', 'card'].map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                        padding: '8px 24px', borderRadius: '8px', border: 'none',
                        background: activeTab === tab ? '#ffc107' : 'transparent',
                        color: activeTab === tab ? '#1e2a3b' : '#64748B',
                        fontWeight: activeTab === tab ? '700' : '600',
                        fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize',
                        transition: 'all 0.2s'
                    }}>{tab}</button>
                ))}
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(30,42,59,0.08)' }}>
                                {['Transaction ID', 'Customer', 'Booking', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)' }}>
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} style={{ padding: '16px 24px' }}><div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '80%', animation: 'pulse 1.5s infinite' }} /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '64px', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <CreditCard size={40} color="#cbd5e1" />
                                            <span style={{ fontSize: '15px', fontWeight: '500' }}>No transactions found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : payments.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 24px', color: '#1e2a3b', fontFamily: 'monospace', fontSize: '13px', fontWeight: '600' }}>{p.transactionId}</td>
                                    <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '600' }}>{p.customerId?.name || '—'}</td>
                                    <td style={{ padding: '16px 24px', color: '#64748B', fontFamily: 'monospace', fontSize: '13px' }}>{p.bookingId?.bookingId || '—'}</td>
                                    <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '800' }}>LKR {p.amount?.toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px', color: '#64748B', textTransform: 'capitalize', fontWeight: '500' }}>{p.method}</td>
                                    <td style={{ padding: '16px 24px', color: '#64748B', fontWeight: '500' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ 
                                            background: STATUS_COLORS[p.status]?.bg || '#f1f5f9', 
                                            color: STATUS_COLORS[p.status]?.text || '#64748b', 
                                            border: `1px solid ${STATUS_COLORS[p.status]?.border || '#e2e8f0'}`, 
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' 
                                        }}>{p.status}</span>
                                    </td>
                                </tr>
                            ))}
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

export default AdminPayments;
