import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, CheckCircle, AlertCircle, XCircle, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/user-context/AuthContext';
import axios from '../../api/axios';
import Loader from '../../components/user-components/Loader';

const MyBookings = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        const fetch = async () => {
            try {
                const { data } = await axios.get('/api/bookings/mybookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(data);
            } catch { toast.error('Failed to load bookings'); }
            finally { setLoading(false); }
        };
        fetch();
    }, [token]);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await axios.put(`/api/bookings/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
            toast.success('Booking cancelled');
        } catch { toast.error('Failed to cancel booking'); }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getVehicleImage = (booking) => {
        if (!booking.vehicle) return null;
        const img = booking.vehicle.image || booking.vehicle.imageUrl;
        if (!img) return null;
        if (img.includes('http') || img.startsWith('data:') || img.includes('/assets/')) return img;
        return `${axios.defaults.baseURL.replace('/api', '')}/${img}`;
    };

    if (loading) return <div className="min-h-screen pt-24"><Loader /></div>;

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-28 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#1e2a3b] tracking-tight">My Bookings</h1>
                    <p className="text-gray-500 mt-2">Manage your vehicle rentals and upcoming trips.</p>
                </div>

                {bookings.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map((booking, i) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[4px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center"
                            >
                                <div className="w-full md:w-40 h-24 rounded-[4px] overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                                    {getVehicleImage(booking) ? (
                                        <img src={getVehicleImage(booking)} alt={booking.vehicle?.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-gray-300 text-4xl">🚗</div>
                                    )}
                                </div>

                                <div className="flex-grow w-full space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1e2a3b]">{booking.vehicle?.name || 'Vehicle'}</h3>
                                            <div className={`mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-bold uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                <span>{booking.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block mb-1">Total Price</span>
                                            <span className="text-xl font-bold text-[#1e2a3b]">LKR {parseFloat(booking.totalPrice).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                            <Calendar className="w-4 h-4 text-[#ffc107]" />
                                            <span className="font-medium">
                                                {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                            <Tag className="w-4 h-4 text-[#ffc107]" />
                                            <span className="font-medium">{booking.vehicle?.type || '—'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                            {booking.paymentMethod === 'card' ? <CreditCard className="w-4 h-4 text-[#ffc107]" /> : <Banknote className="w-4 h-4 text-[#ffc107]" />}
                                            <span className="font-medium capitalize">{booking.paymentMethod || 'cash'}</span>
                                        </div>
                                    </div>
                                </div>

                                {booking.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancel(booking._id)}
                                        className="px-6 py-2.5 rounded-[4px] border-2 border-red-50 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all font-bold w-full md:w-auto text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[4px] shadow-sm">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-[#1e2a3b] mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-8">Ready to hit the road? Explore our fleet and book your first ride.</p>
                        <a href="/vehicles" className="bg-[#ffc107] text-[#1e2a3b] px-8 py-3 rounded-[4px] font-bold hover:bg-[#e0a800] transition-colors inline-block">Browse Vehicles</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
