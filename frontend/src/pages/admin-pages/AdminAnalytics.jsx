import { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/admin-context/AdminAuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Car, MapPin, Activity, Calendar as CalendarIcon, DollarSign, Users, ChevronDown, CreditCard, UserPlus } from 'lucide-react';
import { DateRangePicker } from 'react-date-range';
import { format, subDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const AdminAnalytics = () => {
    const { admin } = useAdminAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('revenue');
    
    // Date Range Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: subDays(new Date(), 30),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const datePickerRef = useRef(null);

    // Data States
    const [bookingsData, setBookingsData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [vehiclesData, setVehiclesData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [userConversionData, setUserConversionData] = useState([]);

    // Close date picker on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const headers = { Authorization: `Bearer ${admin?.token}` };
                const start = dateRange[0].startDate.toISOString();
                const end = dateRange[0].endDate.toISOString();
                const params = { startDate: start, endDate: end };

                const [bRes, rRes, sRes, vRes, cRes, pRes, uRes] = await Promise.all([
                    axios.get('/api/admin/dashboard/analytics/bookings-over-time', { headers, params }),
                    axios.get('/api/admin/dashboard/analytics/revenue-over-time', { headers, params }),
                    axios.get('/api/admin/dashboard/analytics/by-service-type', { headers, params }),
                    axios.get('/api/admin/dashboard/analytics/top-vehicles', { headers, params }),
                    axios.get('/api/admin/dashboard/analytics/by-city', { headers, params }),
                    axios.get('/api/admin/dashboard/analytics/payment-methods', { headers, params }),
                    axios.get('/api/admin/dashboard/analytics/user-conversion', { headers, params }),
                ]);
                
                const formatData = (data) => data.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));
                
                setBookingsData(formatData(bRes.data));
                setRevenueData(formatData(rRes.data));
                setServiceData(sRes.data);
                setVehiclesData(vRes.data);
                setCityData(cRes.data);
                setPaymentData(pRes.data);
                setUserConversionData(uRes.data);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [admin, dateRange]);

    const RevenueTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#fff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
                    <p style={{ margin: 0, color: '#1e2a3b', fontWeight: '700', fontSize: '14px' }}>
                        LKR {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Header & Advanced Filters */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>Advanced Analytics</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>Deep dive into revenue, vehicle performance, and user activity.</p>
                </div>
                
                {/* Advanced Date Range Picker */}
                <div style={{ position: 'relative' }} ref={datePickerRef}>
                    <button 
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff',
                            color: '#1e2a3b', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s'
                        }}
                    >
                        <CalendarIcon size={18} color="#64748b" />
                        {format(dateRange[0].startDate, 'MMM dd, yyyy')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}
                        <ChevronDown size={16} color="#64748b" style={{ marginLeft: '4px' }} />
                    </button>
                    
                    {showDatePicker && (
                        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                            <DateRangePicker
                                onChange={item => setDateRange([item.selection])}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={dateRange}
                                direction="horizontal"
                                rangeColors={['#ffc107']}
                            />
                            <style>
                                {`
                                    .rdrStaticRangeLabel { color: #1e2a3b !important; font-weight: 500; }
                                    .rdrInputRangeInput { color: #1e2a3b !important; }
                                    .rdrDefinedRangesWrapper { border-right: 1px solid #e2e8f0; background: #f8fafc; }
                                `}
                            </style>
                        </div>
                    )}
                </div>
            </div>

            {/* Advanced Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <button onClick={() => setActiveTab('revenue')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: activeTab === 'revenue' ? '#1e2a3b' : 'transparent', color: activeTab === 'revenue' ? '#ffffff' : '#64748b', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s'
                }}>
                    <DollarSign size={18} /> Revenue & Cashflow
                </button>
                <button onClick={() => setActiveTab('vehicles')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: activeTab === 'vehicles' ? '#1e2a3b' : 'transparent', color: activeTab === 'vehicles' ? '#ffffff' : '#64748b', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s'
                }}>
                    <Car size={18} /> Vehicle Performance
                </button>
                <button onClick={() => setActiveTab('users')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: activeTab === 'users' ? '#1e2a3b' : 'transparent', color: activeTab === 'users' ? '#ffffff' : '#64748b', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s'
                }}>
                    <Users size={18} /> User Activity & Locations
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: '#64748B' }}>
                    <Activity size={48} className="animate-spin" style={{ margin: '0 auto 20px' }} color="#ffc107" />
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>Crunching the numbers...</p>
                </div>
            ) : (
                <div style={{ minHeight: '500px' }}>
                    {/* ─── TAB 1: REVENUE & CASHFLOW ─── */}
                    {activeTab === 'revenue' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                            {/* Cashflow Trend (Full Width) */}
                            <div style={{ gridColumn: '1 / -1', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px', color: '#3b82f6' }}><TrendingUp size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>Cashflow & Revenue Trend</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Daily confirmed revenue across all payment methods</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px', width: '100%' }}>
                                    {revenueData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `LKR ${val/1000}k`} width={80} />
                                                <RechartsTooltip content={<RevenueTooltip />} />
                                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" activeDot={{ r: 8, strokeWidth: 0 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No revenue data for this period</div>}
                                </div>
                            </div>

                            {/* Highest Earning Vehicles */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', color: '#d97706' }}><DollarSign size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>Highest Earning Vehicles</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Vehicles ranked by total revenue generated</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px', width: '100%' }}>
                                    {vehiclesData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={vehiclesData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(val) => `LKR ${val/1000}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
                                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#1e2a3b', fontWeight: 600 }} width={120} />
                                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Revenue']} />
                                                <Bar dataKey="revenue" fill="#ffc107" radius={[0, 6, 6, 0]} barSize={24} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No vehicle revenue data</div>}
                                </div>
                            </div>
                            
                            {/* Payment Methods */}
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: '#f3e8ff', padding: '10px', borderRadius: '10px', color: '#9333ea' }}><CreditCard size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>Payment Method Mix</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Cash vs Card revenue distribution</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px', width: '100%' }}>
                                    {paymentData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={paymentData} cx="50%" cy="45%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                                                    {paymentData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.name === 'card' ? '#3b82f6' : '#10b981'} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Revenue']} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No payment data</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 2: VEHICLES ─── */}
                    {activeTab === 'vehicles' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '10px', color: '#16a34a' }}><Car size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>Most Rented Vehicles</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Vehicles ranked by booking count</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px', width: '100%' }}>
                                    {vehiclesData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={vehiclesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No vehicle data available</div>}
                                </div>
                            </div>

                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ background: '#f3e8ff', padding: '10px', borderRadius: '10px', color: '#9333ea' }}><Activity size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>Service Distribution</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Rental vs Rides vs Airport vs Tours</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px' }}>
                                    {serviceData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={serviceData} cx="50%" cy="45%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                                                    {serviceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No service data available</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 3: USERS & ACTIVITY ─── */}
                    {activeTab === 'users' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px', color: '#3b82f6' }}><Activity size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>User Booking Volume</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Daily total active bookings</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px', width: '100%' }}>
                                    {bookingsData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                <Area type="step" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBook)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No bookings data available</div>}
                                </div>
                            </div>

                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', color: '#d97706' }}><UserPlus size={20} /></div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e2a3b', fontSize: '18px', fontWeight: '700' }}>User Conversion</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Registered vs Active Renters</p>
                                    </div>
                                </div>
                                <div style={{ height: '350px' }}>
                                    {userConversionData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={userConversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                                                    {userConversionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '500' }}>No conversion data available</div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;

