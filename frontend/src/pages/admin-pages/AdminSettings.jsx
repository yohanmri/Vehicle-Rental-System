import { useState } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const AdminSettings = () => {
    const { admin, loginAdmin } = useAdminAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setLoading(true);
        try {
            await axios.put('/api/admin/settings', {
                currentPassword,
                newPassword: newPassword || undefined,
                newUsername: newUsername || undefined,
            }, {
                headers: { Authorization: `Bearer ${admin?.token}` }
            });
            setMessage('Settings updated successfully!');
            setCurrentPassword(''); setNewPassword('');
            
            if (newUsername) {
                // Re-login to get new token
                await loginAdmin(newUsername, newPassword || currentPassword);
                setNewUsername('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Settings</h1>
                <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>Manage your admin credentials</p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                {message && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', fontSize: '14px', border: '1px solid #bbf7d0' }}>{message}</div>}
                {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', fontSize: '14px', border: '1px solid #fecaca' }}>{error}</div>}

                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Current Password (Required)</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', color: '#1e2a3b', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                            onFocus={e => { e.target.style.borderColor = '#ffc107'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    
                    <div style={{ height: '1px', background: 'rgba(30,42,59,0.06)', margin: '24px 0' }} />

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>New Username (Optional)</label>
                        <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder={`Current: ${admin?.username}`}
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', color: '#1e2a3b', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                            onFocus={e => { e.target.style.borderColor = '#ffc107'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>New Password (Optional)</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', color: '#1e2a3b', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
                            onFocus={e => { e.target.style.borderColor = '#ffc107'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                    </div>

                    <button type="submit" disabled={loading || !currentPassword}
                        style={{ background: (loading || !currentPassword) ? '#94A3B8' : '#1e2a3b', color: '#ffffff', fontWeight: '600', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: (loading || !currentPassword) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        onMouseEnter={e => { if (!loading && currentPassword) { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.color = '#1e2a3b'; } }}
                        onMouseLeave={e => { if (!loading && currentPassword) { e.currentTarget.style.background = '#1e2a3b'; e.currentTarget.style.color = '#ffffff'; } }}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
