import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Loader from '../components/Loader';
import { Calendar, Clock, DollarSign, Tag, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/bookings/mybookings');
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        try {
            await axios.put(`/bookings/${id}`);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">My <span className="text-primary">Bookings</span></h1>

            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map((booking, i) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card flex flex-col md:flex-row items-center gap-8"
                        >
                            <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden shrink-0">
                                <img src={booking.vehicle.image} alt={booking.vehicle.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-grow w-full space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold">{booking.vehicle.name}</h3>
                                        <div className={`mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            <span>{booking.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-500 text-sm block">Total Price</span>
                                        <span className="text-2xl font-bold text-primary">${booking.totalPrice}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center space-x-3 text-gray-400">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-400">
                                        <Tag className="w-4 h-4 text-primary" />
                                        <span>{booking.vehicle.type}</span>
                                    </div>
                                </div>
                            </div>

                            {booking.status === 'pending' && (
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="px-6 py-3 rounded-lg border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold w-full md:w-auto"
                                >
                                    Cancel
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-card">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">No bookings yet</h3>
                    <p className="text-gray-400 mb-8">Ready to hit the road? Explore our fleet and book your first ride.</p>
                    <a href="/vehicles" className="btn-primary">Browse Vehicles</a>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
