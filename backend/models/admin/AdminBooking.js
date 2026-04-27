const mongoose = require('mongoose');

// Extended Booking model for full admin view
const bookingSchema = mongoose.Schema(
    {
        bookingId: {
            type: String,
            unique: true,
            default: () => 'BK-' + Date.now(),
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        serviceType: {
            type: String,
            enum: ['ride', 'rental', 'airport', 'tour'],
            required: true,
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            default: null,
        },
        pickupLocation: {
            type: String,
            required: true,
        },
        dropoffLocation: {
            type: String,
            default: '',
        },
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            default: null,
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card'],
            default: 'cash',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending',
        },
        bookingStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
            default: 'pending',
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('AdminBooking', bookingSchema);
