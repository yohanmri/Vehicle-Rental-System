import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const AdminCustomers = () => {
    const { admin } = useAdminAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/admin/customers', {
                    params: { page, limit: 10 },
                    headers: { Authorization: `Bearer ${admin?.token}` },
                });
                setCustomers(data.customers);
                setTotal(data.total);
                setPages(data.pages);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch();
    }, [page]);

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', margin: 0 }}>Customers</h1>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{total} registered customers</p>
            </div>
            <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['Name', 'Email', 'Phone', 'Bookings', 'Joined'].map(h => (
                                    <th key={h} style={{ padding: '14px 20px', color: '#64748B', fontWeight: '600', textAlign: 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                                        <td key={j} style={{ padding: '14px 20px' }}><div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '70%' }} /></td>
                                    ))}</tr>
                                ))
                            ) : customers.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No customers found</td></tr>
                            ) : customers.map(c => (
                                <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '34px', height: '34px', background: 'rgba(234,179,8,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EAB308', fontWeight: '700', fontSize: '13px' }}>{c.name?.[0]?.toUpperCase()}</div>
                                            <span style={{ color: '#F8FAFC', fontWeight: '500' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#94A3B8' }}>{c.email}</td>
                                    <td style={{ padding: '14px 20px', color: '#94A3B8' }}>{c.phone || '—'}</td>
                                    <td style={{ padding: '14px 20px', color: '#EAB308', fontWeight: '600' }}>{c.totalBookings}</td>
                                    <td style={{ padding: '14px 20px', color: '#64748B' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
