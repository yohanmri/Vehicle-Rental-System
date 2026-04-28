import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { ClipboardList, DollarSign, Car, Users, BarChart3 } from 'lucide-react';
import axios from '../../api/axios';

const StatCard = ({ label, value, icon, color }) => (
    <div style={{
        background: '#f1f5f9',
        border: `1px solid rgba(30, 42, 59, 0.08)`,
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flex: '1 1 200px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{
            width: '56px', height: '56px',
            background: color,
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1e2a3b', flexShrink: 0,
        }}>{icon}</div>
        <div>
            <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800' }}>{value}</div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { admin } = useAdminAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        revenue: 0,
        activeRides: 0,
        totalCustomers: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, paymentsRes] = await Promise.all([
                    axios.get('/api/admin/dashboard/stats?period=month', { headers: { Authorization: `Bearer ${admin?.token}` } }),
                    axios.get('/api/admin/payments?limit=5', { headers: { Authorization: `Bearer ${admin?.token}` } })
                ]);
                setStats(statsRes.data);
                setRecentTransactions(paymentsRes.data.payments);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [admin]);

    if (loading) return <div style={{ padding: '24px' }}>Loading dashboard...</div>;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>
                        Dashboard
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>
                        Welcome back, <span style={{ color: '#1e2a3b', fontWeight: '700' }}>{admin?.username}</span>. Here's what's happening.
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <StatCard label="Total Bookings" value={stats.totalBookings} icon={<ClipboardList size={28} />} color="#ffc107" />
                <StatCard label="Revenue This Month" value={`LKR ${stats.revenue.toLocaleString()}`} icon={<DollarSign size={28} />} color="#60a5fa" />
                <StatCard label="Active Rides" value={stats.activeRides} icon={<Car size={28} />} color="#34d399" />
                <StatCard label="Total Customers" value={stats.totalCustomers} icon={<Users size={28} />} color="#c084fc" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

                {/* Recent Transactions Table */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(30,42,59,0.08)' }}>
                        <h3 style={{ color: '#1e2a3b', fontSize: '16px', fontWeight: '700', margin: 0 }}>Recent Transactions</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(30,42,59,0.08)' }}>
                                <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', textAlign: 'left' }}>Transaction</th>
                                <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', textAlign: 'left' }}>Amount</th>
                                <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', textAlign: 'left' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((trx) => (
                                <tr key={trx._id} style={{ borderBottom: '1px solid rgba(30,42,59,0.04)' }}>
                                    <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '500' }}>{trx.transactionId}</td>
                                    <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '700' }}>LKR {trx.amount?.toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ 
                                            background: trx.status === 'success' || trx.status === 'paid' ? '#dcfce7' : trx.status === 'pending' ? '#fef3c7' : '#f1f5f9', 
                                            color: trx.status === 'success' || trx.status === 'paid' ? '#16a34a' : trx.status === 'pending' ? '#d97706' : '#64748b', 
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' 
                                        }}>
                                            {trx.status || trx.bookingStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '16px 24px', textAlign: 'center', color: '#64748B' }}>No recent transactions</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
