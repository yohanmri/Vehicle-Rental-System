import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';

const NAV_ITEMS = [
    {
        section: 'HOME',
        items: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: '▦' },
            { label: 'Analytics', path: '/admin/analytics', icon: '◈' },
        ],
    },
    {
        section: 'BOOKINGS',
        items: [
            { label: 'All Bookings', path: '/admin/bookings', icon: '📋' },
        ],
    },
    {
        section: 'FLEET',
        items: [
            { label: 'Vehicles', path: '/admin/vehicles', icon: '🚗' },
            { label: 'Add Vehicle', path: '/admin/vehicles/add', icon: '➕' },
        ],
    },
    {
        section: 'CUSTOMERS',
        items: [
            { label: 'All Customers', path: '/admin/customers', icon: '👥' },
        ],
    },
    {
        section: 'PAYMENTS',
        items: [
            { label: 'Transactions', path: '/admin/payments', icon: '💳' },
        ],
    },
    {
        section: 'TOURS',
        items: [
            { label: 'All Tours', path: '/admin/tours', icon: '🗺️' },
            { label: 'Add Tour', path: '/admin/tours/add', icon: '➕' },
        ],
    },
    {
        section: 'ACCOUNT',
        items: [
            { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
        ],
    },
];

const AdminLayout = () => {
    const { admin, logoutAdmin } = useAdminAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    const sidebarWidth = collapsed ? '72px' : '260px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                minHeight: '100vh',
                background: '#1E293B',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
                transition: 'width 0.3s ease',
                overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{
                    padding: collapsed ? '20px 0' : '24px 24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    gap: '10px',
                }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '34px', height: '34px',
                                background: '#EAB308',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '800', fontSize: '15px', color: '#0F172A', flexShrink: 0,
                            }}>P</div>
                            <div>
                                <div style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '14px', lineHeight: 1.2 }}>
                                    Pick <span style={{ color: '#EAB308' }}>'N'</span> Go 360
                                </div>
                                <div style={{ color: '#64748B', fontSize: '11px' }}>Admin Panel</div>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div style={{
                            width: '34px', height: '34px',
                            background: '#EAB308',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '800', fontSize: '15px', color: '#0F172A',
                        }}>P</div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: 'none',
                            borderRadius: '6px',
                            width: '28px', height: '28px',
                            cursor: 'pointer',
                            color: '#94A3B8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', flexShrink: 0,
                        }}
                    >{collapsed ? '→' : '←'}</button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0', scrollbarWidth: 'none' }}>
                    {NAV_ITEMS.map((group) => (
                        <div key={group.section} style={{ marginBottom: '8px' }}>
                            {!collapsed && (
                                <div style={{
                                    color: '#475569',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    letterSpacing: '0.1em',
                                    padding: '8px 24px 4px',
                                }}>{group.section}</div>
                            )}
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin/dashboard'}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: collapsed ? '10px 0' : '10px 24px',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        color: isActive ? '#EAB308' : '#94A3B8',
                                        background: isActive ? 'rgba(234,179,8,0.08)' : 'transparent',
                                        borderLeft: isActive ? '3px solid #EAB308' : '3px solid transparent',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: isActive ? '600' : '400',
                                        transition: 'all 0.15s',
                                        whiteSpace: 'nowrap',
                                    })}
                                    title={collapsed ? item.label : ''}
                                >
                                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                                    {!collapsed && item.label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* User + Logout */}
                <div style={{
                    padding: collapsed ? '16px 0' : '16px 24px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                    {!collapsed && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ color: '#F8FAFC', fontSize: '13px', fontWeight: '600' }}>
                                {admin?.username}
                            </div>
                            <div style={{ color: '#64748B', fontSize: '11px' }}>Administrator</div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '8px',
                            padding: collapsed ? '8px 0' : '8px 16px',
                            color: '#F87171',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        title={collapsed ? 'Logout' : ''}
                    >
                        <span>⏏</span>
                        {!collapsed && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                marginLeft: sidebarWidth,
                flex: 1,
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Top bar */}
                <header style={{
                    background: '#1E293B',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '16px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'rgba(234,179,8,0.15)',
                        border: '1px solid rgba(234,179,8,0.3)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#EAB308', fontWeight: '700', fontSize: '14px',
                    }}>
                        {admin?.username?.[0]?.toUpperCase() || 'A'}
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '32px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
