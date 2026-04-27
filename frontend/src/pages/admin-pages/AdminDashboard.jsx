import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { ClipboardList, DollarSign, Car, Users, BarChart3 } from 'lucide-react';

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
                <StatCard label="Total Bookings" value="124" icon={<ClipboardList size={28} />} color="#ffc107" />
                <StatCard label="Revenue (LKR)" value="24,500" icon={<DollarSign size={28} />} color="#60a5fa" />
                <StatCard label="Active Rides" value="18" icon={<Car size={28} />} color="#34d399" />
                <StatCard label="New Customers" value="32" icon={<Users size={28} />} color="#c084fc" />
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
                            <tr style={{ borderBottom: '1px solid rgba(30,42,59,0.04)' }}>
                                <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '500' }}>TRX-82910</td>
                                <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '700' }}>LKR 4,500</td>
                                <td style={{ padding: '16px 24px' }}><span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Success</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(30,42,59,0.04)' }}>
                                <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '500' }}>TRX-82909</td>
                                <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '700' }}>LKR 12,000</td>
                                <td style={{ padding: '16px 24px' }}><span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Pending</span></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '500' }}>TRX-82908</td>
                                <td style={{ padding: '16px 24px', color: '#1e2a3b', fontWeight: '700' }}>LKR 2,500</td>
                                <td style={{ padding: '16px 24px' }}><span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Success</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
