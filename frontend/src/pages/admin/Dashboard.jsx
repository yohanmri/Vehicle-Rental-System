import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/Loader';
import { Car, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, you'd have a specific stats endpoint
                const [vehicles, bookings, users] = await Promise.all([
                    axios.get('/vehicles'),
                    axios.get('/bookings'),
                    axios.get('/users')
                ]);

                const revenue = bookings.data.reduce((acc, curr) => curr.status === 'confirmed' ? acc + curr.totalPrice : acc, 0);

                setStats({
                    vehicles: vehicles.data.length,
                    bookings: bookings.data.length,
                    users: users.data.length,
                    revenue
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.revenue}`, icon: <DollarSign />, color: 'text-green-500', trend: '+12.5%', isUp: true },
        { label: 'Total Bookings', value: stats.bookings, icon: <Calendar />, color: 'text-blue-500', trend: '+5.2%', isUp: true },
        { label: 'Total Vehicles', value: stats.vehicles, icon: <Car />, color: 'text-primary', trend: '+2', isUp: true },
        { label: 'Registered Users', value: stats.users, icon: <Users />, color: 'text-purple-500', trend: '-1.4%', isUp: false },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Admin <span className="text-primary">Dashboard</span></h1>
                    <p className="text-gray-400">Welcome back, Administrator.</p>
                </div>
                <div className="flex space-x-4">
                    <Link to="/admin/vehicles" className="btn-outline">Manage Vehicles</Link>
                    <Link to="/admin/bookings" className="btn-primary">View Bookings</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.trend}
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6">Recent Activities</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-center justify-between pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">New Booking Request</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-primary">+$120.00</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/vehicles" className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center">
                            <Car className="w-8 h-8 text-primary mx-auto mb-3" />
                            <p className="font-bold">Add Vehicle</p>
                        </Link>
                        <button className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center">
                            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                            <p className="font-bold">Users List</p>
                        </button>
                        <button className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center">
                            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-3" />
                            <p className="font-bold">Reports</p>
                        </button>
                        <button className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center">
                            <Shield className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                            <p className="font-bold">Settings</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
