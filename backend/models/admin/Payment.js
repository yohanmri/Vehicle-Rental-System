const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        transactionId: {
            type: String,
            unique: true,
            default: () => 'TXN-' + Date.now(),
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        method: {
            type: String,
            enum: ['cash', 'card'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'refunded'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
