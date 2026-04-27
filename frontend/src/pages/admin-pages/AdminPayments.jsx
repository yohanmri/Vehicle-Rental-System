import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const STATUS_COLORS = { pending: '#F59E0B', success: '#22C55E', refunded: '#EF4444' };

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
                <h1 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', margin: 0 }}>Payments</h1>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{total} transactions</p>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#1E293B', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                {['all', 'cash', 'card'].map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{
                        padding: '8px 20px', borderRadius: '8px', border: 'none',
                        background: activeTab === tab ? '#EAB308' : 'transparent',
                        color: activeTab === tab ? '#0F172A' : '#94A3B8',
                        fontWeight: activeTab === tab ? '700' : '500',
                        fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize',
                    }}>{tab}</button>
                ))}
            </div>

            <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['Transaction ID', 'Customer', 'Booking', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', color: '#64748B', fontWeight: '600', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                                    <td key={j} style={{ padding: '14px 20px' }}><div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '80%' }} /></td>
                                ))}</tr>
                            ))
                        ) : payments.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No transactions found</td></tr>
                        ) : payments.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '14px 20px', color: '#EAB308', fontFamily: 'monospace', fontSize: '11px' }}>{p.transactionId}</td>
                                <td style={{ padding: '14px 20px', color: '#F8FAFC' }}>{p.customerId?.name || '—'}</td>
                                <td style={{ padding: '14px 20px', color: '#64748B', fontFamily: 'monospace', fontSize: '11px' }}>{p.bookingId?.bookingId || '—'}</td>
                                <td style={{ padding: '14px 20px', color: '#22C55E', fontWeight: '600' }}>LKR {p.amount?.toLocaleString()}</td>
                                <td style={{ padding: '14px 20px', color: '#94A3B8', textTransform: 'capitalize' }}>{p.method}</td>
                                <td style={{ padding: '14px 20px', color: '#64748B' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '14px 20px' }}>
                                    <span style={{ background: `${STATUS_COLORS[p.status]}22`, color: STATUS_COLORS[p.status], border: `1px solid ${STATUS_COLORS[p.status]}44`, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{p.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayments;
