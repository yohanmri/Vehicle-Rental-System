import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/Loader';
import { Calendar, User, Car, Check, X, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/bookings');
            setBookings(data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/bookings/${id}/status`, { status });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        };
        return (
            <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-12">Manage <span className="text-primary">Bookings</span></h1>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 font-bold">Client</th>
                                <th className="px-6 py-4 font-bold">Vehicle</th>
                                <th className="px-6 py-4 font-bold">Dates</th>
                                <th className="px-6 py-4 font-bold">Total</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{booking.user?.name}</span>
                                            <span className="text-xs text-gray-500">{booking.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                                <Car className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm">{booking.vehicle?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-primary">${booking.totalPrice}</td>
                                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        {booking.status === 'pending' && (
                                            <div className="flex justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                                    title="Confirm"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;
