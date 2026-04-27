import { useState } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const Field = ({ label, children }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>{label}</label>
        {children}
    </div>
);

const inputStyle = {
    width: '100%', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '11px 16px', color: '#F8FAFC', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
};

const AdminSettings = () => {
    const { admin, loginAdmin, logoutAdmin } = useAdminAuth();
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [unForm, setUnForm] = useState({ newUsername: '' });
    const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
    const [unMsg, setUnMsg] = useState({ type: '', text: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [unLoading, setUnLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirm) {
            setPwMsg({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setPwLoading(true);
        try {
            await axios.post('/api/admin/auth/change-password',
                { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
                { headers: { Authorization: `Bearer ${admin?.token}` } }
            );
            setPwMsg({ type: 'success', text: 'Password updated successfully' });
            setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
        } catch (err) {
            setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        } finally { setPwLoading(false); }
    };

    const handleChangeUsername = async (e) => {
        e.preventDefault();
        setUnLoading(true);
        try {
            await axios.patch('/api/admin/auth/change-username',
                { newUsername: unForm.newUsername },
                { headers: { Authorization: `Bearer ${admin?.token}` } }
            );
            setUnMsg({ type: 'success', text: 'Username updated. Please log in again.' });
            setTimeout(() => logoutAdmin(), 2000);
        } catch (err) {
            setUnMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update username' });
        } finally { setUnLoading(false); }
    };

    const msgStyle = (type) => ({
        padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
        background: type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        color: type === 'success' ? '#4ADE80' : '#FCA5A5',
        border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
    });

    const Card = ({ title, children }) => (
        <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px', maxWidth: '520px', marginBottom: '24px' }}>
            <h2 style={{ color: '#F8FAFC', fontSize: '17px', fontWeight: '600', marginBottom: '24px' }}>{title}</h2>
            {children}
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700', margin: 0 }}>Settings</h1>
                <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>Manage your admin account</p>
            </div>

            {/* Change Password */}
            <Card title="Change Password">
                {pwMsg.text && <div style={msgStyle(pwMsg.type)}>{pwMsg.text}</div>}
                <form onSubmit={handleChangePassword}>
                    <Field label="Current Password">
                        <input type="password" style={inputStyle} value={pwForm.currentPassword}
                            onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                    </Field>
                    <Field label="New Password">
                        <input type="password" style={inputStyle} value={pwForm.newPassword}
                            onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                    </Field>
                    <Field label="Confirm New Password">
                        <input type="password" style={inputStyle} value={pwForm.confirm}
                            onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required />
                    </Field>
                    <button type="submit" disabled={pwLoading} style={{
                        background: '#EAB308', color: '#0F172A', fontWeight: '700',
                        padding: '11px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px',
                    }}>{pwLoading ? 'Updating...' : 'Update Password'}</button>
                </form>
            </Card>

            {/* Change Username */}
            <Card title="Change Username">
                <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>
                    Current username: <span style={{ color: '#EAB308', fontWeight: '600' }}>{admin?.username}</span>
                </p>
                {unMsg.text && <div style={msgStyle(unMsg.type)}>{unMsg.text}</div>}
                <form onSubmit={handleChangeUsername}>
                    <Field label="New Username">
                        <input type="text" style={inputStyle} value={unForm.newUsername}
                            onChange={e => setUnForm({ newUsername: e.target.value })} required />
                    </Field>
                    <button type="submit" disabled={unLoading} style={{
                        background: '#EAB308', color: '#0F172A', fontWeight: '700',
                        padding: '11px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px',
                    }}>{unLoading ? 'Updating...' : 'Update Username'}</button>
                </form>
            </Card>
        </div>
    );
};

export default AdminSettings;
