import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const StatCard = ({ label, value, icon, color }) => (
    <div style={{
        background: '#1E293B',
        border: `1px solid ${color}22`,
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flex: '1 1 200px',
    }}>
        <div style={{
            width: '52px', height: '52px',
            background: `${color}18`,
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', flexShrink: 0,
        }}>{icon}</div>
        <div>
            <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '4px' }}>{label}</div>
            <div style={{ color: '#F8FAFC', fontSize: '28px', fontWeight: '700' }}>{value}</div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { admin } = useAdminAuth();

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#F8FAFC', fontSize: '26px', fontWeight: '700', margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '6px' }}>
                    Welcome back, <span style={{ color: '#EAB308' }}>{admin?.username}</span>. Here's what's happening today.
                </p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <StatCard label="Total Bookings" value="—" icon="📋" color="#EAB308" />
                <StatCard label="Revenue (LKR)" value="—" icon="💰" color="#22C55E" />
                <StatCard label="Active Rides" value="—" icon="🚗" color="#3B82F6" />
                <StatCard label="Customers" value="—" icon="👥" color="#A855F7" />
            </div>

            {/* Placeholder chart area */}
            <div style={{
                background: '#1E293B',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
                <p style={{ color: '#64748B', fontSize: '14px' }}>
                    Analytics charts will appear here. Go to{' '}
                    <span style={{ color: '#EAB308' }}>Analytics</span> for full charts.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
