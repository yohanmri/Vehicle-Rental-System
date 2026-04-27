import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { BarChart3 } from 'lucide-react';

const AdminAnalytics = () => {
    const { admin } = useAdminAuth();

    return (
        <div>
            {/* Header & Filter */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>
                        Analytics
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>
                        View detailed performance metrics and charts.
                    </p>
                </div>
                {/* Date Filter */}
                <select style={{
                    padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff',
                    color: '#1e2a3b', fontSize: '14px', fontWeight: '600', outline: 'none', cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="thisMonth">This Month</option>
                </select>
            </div>

            {/* Placeholder chart area */}
            <div style={{
                background: '#ffffff', border: '1px solid rgba(30, 42, 59, 0.08)', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '400px'
            }}>
                <div style={{ color: '#94A3B8', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <BarChart3 size={48} strokeWidth={1.5} />
                </div>
                <h3 style={{ color: '#1e2a3b', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Detailed Analytics</h3>
                <p style={{ color: '#64748B', fontSize: '14px' }}>Interactive charts and full reports will appear here based on the selected date range.</p>
            </div>
        </div>
    );
};

export default AdminAnalytics;
