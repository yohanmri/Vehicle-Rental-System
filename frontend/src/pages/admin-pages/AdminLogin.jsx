import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginAdmin } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await loginAdmin(username, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#e1e7f0', // Ash background from client
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            {/* Main Card */}
            <div style={{
                background: '#ffffff',
                border: '1px solid rgba(30, 42, 59, 0.1)',
                borderRadius: '16px',
                padding: '48px 44px',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 10px 40px rgba(30, 42, 59, 0.08)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: '#1e2a3b',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '18px',
                            color: '#ffc107',
                        }}>P</div>
                        <span style={{ color: '#1e2a3b', fontWeight: '800', fontSize: '18px' }}>
                            Pick <span style={{ color: '#ffc107' }}>'N'</span> Go 360
                        </span>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '13px', margin: 0, fontWeight: '500', letterSpacing: '0.05em' }}>ADMIN PANEL</p>
                </div>

                <h2 style={{
                    color: '#1e2a3b',
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '6px',
                    textAlign: 'center',
                }}>Welcome back</h2>
                <p style={{
                    color: '#64748B',
                    fontSize: '14px',
                    textAlign: 'center',
                    marginBottom: '32px',
                }}>Sign in to your admin account</p>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#ef4444',
                        fontSize: '14px',
                        marginBottom: '20px',
                        fontWeight: '500'
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            color: '#475569',
                            fontSize: '13px',
                            fontWeight: '600',
                            marginBottom: '8px',
                        }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                color: '#1e2a3b',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'all 0.2s',
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#ffc107'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{
                            display: 'block',
                            color: '#475569',
                            fontSize: '13px',
                            fontWeight: '600',
                            marginBottom: '8px',
                        }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    padding: '12px 44px 12px 16px',
                                    color: '#1e2a3b',
                                    fontSize: '15px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#ffc107'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#64748B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading ? '#64748B' : '#1e2a3b',
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '15px',
                            padding: '13px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => { if (!loading) { e.target.style.background = '#ffc107'; e.target.style.color = '#1e2a3b'; } }}
                        onMouseLeave={(e) => { if (!loading) { e.target.style.background = '#1e2a3b'; e.target.style.color = '#ffffff'; } }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
