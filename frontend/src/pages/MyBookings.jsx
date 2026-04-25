import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

import car1 from '../assets/images/vehicle/Car (1).png';
import car2 from '../assets/images/vehicle/Car (2).png';
import car3 from '../assets/images/vehicle/Car (3).png';
import car4 from '../assets/images/vehicle/Car (4).png';
import car5 from '../assets/images/vehicle/Car (5).png';

const MyBookings = () => {
    const [bookings, setBookings] = useState([
        {
            _id: 'b1',
            vehicle: {
                name: 'Koenigsegg',
                image: car1,
                type: 'Sport'
            },
            status: 'confirmed',
            totalPrice: '165,000',
            startDate: '2026-05-10',
            endDate: '2026-05-12'
        },
        {
            _id: 'b2',
            vehicle: {
                name: 'Audi R8',
                image: car2,
                type: 'Sport'
            },
            status: 'pending',
            totalPrice: '120,000',
            startDate: '2026-06-01',
            endDate: '2026-06-03'
        },
        {
            _id: 'b3',
            vehicle: {
                name: 'All New Rush',
                image: car4,
                type: 'SUV'
            },
            status: 'confirmed',
            totalPrice: '45,000',
            startDate: '2026-07-15',
            endDate: '2026-07-18'
        },
        {
            _id: 'b4',
            vehicle: {
                name: 'MG ZX Exclusive',
                image: car3,
                type: 'Hatchback'
            },
            status: 'cancelled',
            totalPrice: '28,000',
            startDate: '2026-04-10',
            endDate: '2026-04-12'
        },
        {
            _id: 'b5',
            vehicle: {
                name: 'CR - V',
                image: car5,
                type: 'SUV'
            },
            status: 'confirmed',
            totalPrice: '18,000',
            startDate: '2026-08-20',
            endDate: '2026-08-25'
        }
    ]);

    const handleCancel = (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
        toast.success('Booking cancelled');
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
                                <div className="w-full md:w-40 h-24 rounded-[4px] overflow-hidden shrink-0 bg-gray-100">
                                    <img src={booking.vehicle.image} alt={booking.vehicle.name} className="w-full h-full object-contain" />
                                </div>

                                <div className="flex-grow w-full space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1e2a3b]">{booking.vehicle.name}</h3>
                                            <div className={`mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-bold uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                <span>{booking.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block mb-1">Total Price</span>
                                            <span className="text-xl font-bold text-[#1e2a3b]">LKR {booking.totalPrice}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                            <Calendar className="w-4 h-4 text-[#ffc107]" />
                                            <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                            <Tag className="w-4 h-4 text-[#ffc107]" />
                                            <span className="font-medium">{booking.vehicle.type}</span>
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
