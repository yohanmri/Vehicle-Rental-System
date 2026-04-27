import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import {
    LayoutDashboard,
    Car,
    Users,
    CreditCard,
    Map,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    X,
    PlusCircle,
    List,
    ClipboardList,
    ExternalLink,
    BarChart3
} from 'lucide-react';

const NAV_ITEMS = [
    {
        section: 'HOME',
        items: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
        ],
    },
    {
        section: 'BOOKINGS',
        items: [
            { label: 'All Bookings', path: '/admin/bookings', icon: <ClipboardList size={20} /> },
        ],
    },
    {
        section: 'FLEET',
        items: [
            { label: 'Vehicles', path: '/admin/vehicles', icon: <Car size={20} /> },
            { label: 'Add Vehicle', path: '/admin/vehicles/add', icon: <PlusCircle size={20} /> },
        ],
    },
    {
        section: 'CUSTOMERS',
        items: [
            { label: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
        ],
    },
    {
        section: 'PAYMENTS',
        items: [
            { label: 'Transactions', path: '/admin/payments', icon: <CreditCard size={20} /> },
        ],
    },
    {
        section: 'TOURS',
        items: [
            { label: 'All Tours', path: '/admin/tours', icon: <Map size={20} /> },
            { label: 'Add Tour', path: '/admin/tours/add', icon: <PlusCircle size={20} /> },
        ],
    },
];

const AdminLayout = () => {
    const { admin, logoutAdmin } = useAdminAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sidebarWidth = collapsed ? '80px' : '260px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#e1e7f0', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                minHeight: '100vh',
                background: '#f1f5f9',
                borderRight: '1px solid rgba(30, 42, 59, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                boxShadow: '2px 0 8px rgba(0,0,0,0.02)',
            }}>
                {/* Logo Area */}
                <div style={{
                    padding: collapsed ? '20px 0' : '24px 24px 20px',
                    borderBottom: '1px solid rgba(30, 42, 59, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '34px', height: '34px',
                                background: '#1e2a3b',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '800', fontSize: '16px', color: '#ffc107', flexShrink: 0,
                            }}>P</div>
                            <div>
                                <div style={{ color: '#1e2a3b', fontWeight: '800', fontSize: '15px', lineHeight: 1.2 }}>
                                    Pick <span style={{ color: '#ffc107' }}>'N'</span> Go
                                </div>
                                <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600' }}>ADMIN PANEL</div>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div style={{
                            width: '36px', height: '36px',
                            background: '#1e2a3b',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '800', fontSize: '18px', color: '#ffc107',
                        }}>P</div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#1e2a3b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '4px',
                        }}
                    >
                        {collapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Nav Links */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '24px 0', scrollbarWidth: 'none' }}>
                    {NAV_ITEMS.map((group) => (
                        <div key={group.section} style={{ marginBottom: '16px' }}>
                            {!collapsed && (
                                <div style={{
                                    color: '#94A3B8',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '0.05em',
                                    padding: '0 24px 8px',
                                }}>{group.section}</div>
                            )}
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin/dashboard' || item.path === '/admin/vehicles' || item.path === '/admin/tours'}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: collapsed ? '12px 0' : '10px 24px',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        color: isActive ? '#1e2a3b' : '#64748B',
                                        background: isActive ? 'rgba(255, 193, 7, 0.15)' : 'transparent',
                                        borderRight: isActive ? '3px solid #ffc107' : '3px solid transparent',
                                        textDecoration: 'none',
                                        fontSize: '15px',
                                        fontWeight: isActive ? '600' : '500',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap',
                                    })}
                                    title={collapsed ? item.label : ''}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span style={{ color: isActive ? '#1e2a3b' : 'inherit' }}>
                                                {item.icon}
                                            </span>
                                            {!collapsed && item.label}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: sidebarWidth,
                flex: 1,
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Top Header */}
                <header style={{
                    background: '#f1f5f9',
                    borderBottom: '1px solid rgba(30, 42, 59, 0.1)',
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '24px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}>
                    {/* Link to Website */}
                    <a href="/" target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: '#64748B', textDecoration: 'none', fontSize: '13px', fontWeight: '600',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1e2a3b'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                        <ExternalLink size={16} /> View Website
                    </a>

                    {/* User Profile Dropdown */}
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,42,59,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#1e2a3b', fontSize: '14px', fontWeight: '600' }}>{admin?.username}</div>
                                <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '500' }}>Administrator</div>
                            </div>
                            <div style={{
                                width: '38px', height: '38px',
                                background: '#1e2a3b',
                                color: '#ffc107',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '700', fontSize: '16px',
                            }}>
                                {admin?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <ChevronDown size={16} color="#64748B" />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '200px',
                                background: '#ffffff',
                                border: '1px solid rgba(30,42,59,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                overflow: 'hidden',
                                zIndex: 200,
                            }}>
                                <div style={{ padding: '8px' }}>
                                    <button
                                        onClick={() => { navigate('/admin/settings'); setDropdownOpen(false); }}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '10px 16px', background: 'transparent', border: 'none',
                                            borderRadius: '8px', cursor: 'pointer', color: '#475569',
                                            fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <Settings size={18} />
                                        Settings
                                    </button>
                                    <div style={{ height: '1px', background: 'rgba(30,42,59,0.06)', margin: '4px 0' }} />
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '10px 16px', background: 'transparent', border: 'none',
                                            borderRadius: '8px', cursor: 'pointer', color: '#ef4444',
                                            fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '16px 40px 32px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
