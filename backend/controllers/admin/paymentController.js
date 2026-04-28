const asyncHandler = require('express-async-handler');
const AdminBooking = require('../../models/admin/AdminBooking');

// @desc    Get all payments (sourced from AdminBooking) with filters
// @route   GET /api/admin/payments
// @access  Private (Admin)
const getAllPayments = asyncHandler(async (req, res) => {
    const { method, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (method && method !== 'all') filter.paymentMethod = method;
    if (status && status !== 'all') filter.paymentStatus = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
        AdminBooking.find(filter)
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        AdminBooking.countDocuments(filter),
    ]);

    // Map AdminBooking fields to a payment-shaped response
    const payments = bookings.map(b => ({
        _id: b._id,
        transactionId: `TRX-${b._id.toString().slice(-8).toUpperCase()}`,
        customerId: b.customerId,
        bookingId: { bookingId: `BK-${b._id.toString().slice(-13).toUpperCase()}` },
        amount: b.totalAmount,
        method: b.paymentMethod,
        status: b.paymentStatus,
        bookingStatus: b.bookingStatus,
        serviceType: b.serviceType,
        fromDate: b.fromDate,
        toDate: b.toDate,
        createdAt: b.createdAt,
    }));

    res.json({ payments, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single payment
// @route   GET /api/admin/payments/:id
// @access  Private (Admin)
const getPaymentById = asyncHandler(async (req, res) => {
    const booking = await AdminBooking.findById(req.params.id)
        .populate('customerId', 'name email phone');

    if (!booking) {
        res.status(404);
        throw new Error('Payment not found');
    }

    res.json({
        _id: booking._id,
        transactionId: `TRX-${booking._id.toString().slice(-8).toUpperCase()}`,
        customerId: booking.customerId,
        amount: booking.totalAmount,
        method: booking.paymentMethod,
        status: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
        createdAt: booking.createdAt,
    });
});

module.exports = { getAllPayments, getPaymentById };

