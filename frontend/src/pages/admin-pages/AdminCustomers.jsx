import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { Users, Search } from 'lucide-react';

const AdminCustomers = () => {
    const { admin } = useAdminAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredCustomers = customers.filter(c => 
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.phone && c.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Customers</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>{total} registered customers</p>
                </div>
                
                <div style={{ position: 'relative', width: '280px' }}>
                    <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
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
            
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(30,42,59,0.08)' }}>
                                {['Name', 'Email', 'Phone', 'Bookings', 'Joined'].map(h => (
                                    <th key={h} style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)' }}>
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} style={{ padding: '16px 24px' }}><div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s infinite' }} /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '64px', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <Users size={40} color="#cbd5e1" />
                                            <span style={{ fontSize: '15px', fontWeight: '500' }}>No customers found matching search</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.map(c => (
                                <tr key={c._id} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '38px', height: '38px', background: '#1e2a3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffc107', fontWeight: '800', fontSize: '15px' }}>{c.name?.[0]?.toUpperCase()}</div>
                                            <span style={{ color: '#1e2a3b', fontWeight: '600' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#64748B', fontWeight: '500' }}>{c.email}</td>
                                    <td style={{ padding: '16px 24px', color: '#64748B', fontWeight: '500' }}>{c.phone || '—'}</td>
                                    <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '800' }}>
                                        <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>{c.totalBookings}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#64748B', fontWeight: '500' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
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
                                width: '36px', height: '36px', borderRadius: '8px',
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

export default AdminCustomers;
