const asyncHandler = require('express-async-handler');
const Payment = require('../../models/admin/Payment');

// @desc    Get all payments with filters
// @route   GET /api/admin/payments
// @access  Private (Admin)
const getAllPayments = asyncHandler(async (req, res) => {
    const { method, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (method && method !== 'all') filter.method = method;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate('customerId', 'name email')
            .populate('bookingId', 'bookingId serviceType')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Payment.countDocuments(filter),
    ]);

    res.json({ payments, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single payment
// @route   GET /api/admin/payments/:id
// @access  Private (Admin)
const getPaymentById = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id)
        .populate('customerId', 'name email phone')
        .populate('bookingId');

    if (!payment) {
        res.status(404);
        throw new Error('Payment not found');
    }

    res.json(payment);
});

module.exports = { getAllPayments, getPaymentById };
