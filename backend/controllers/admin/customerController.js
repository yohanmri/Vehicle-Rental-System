const asyncHandler = require('express-async-handler');
const User = require('../../models/user/User');
const AdminBooking = require('../../models/admin/AdminBooking');
const Payment = require('../../models/admin/Payment');

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
const getAllCustomers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
        User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        User.countDocuments({ role: 'user' }),
    ]);

    // Attach booking count to each customer
    const customersWithBookings = await Promise.all(
        customers.map(async (c) => {
            const bookingCount = await AdminBooking.countDocuments({ customerId: c._id });
            return { ...c.toObject(), totalBookings: bookingCount };
        })
    );

    res.json({ customers: customersWithBookings, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get customer by ID
// @route   GET /api/admin/customers/:id
// @access  Private (Admin)
const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await User.findById(req.params.id).select('-password');

    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    res.json(customer);
});

// @desc    Get customer bookings
// @route   GET /api/admin/customers/:id/bookings
// @access  Private (Admin)
const getCustomerBookings = asyncHandler(async (req, res) => {
    const bookings = await AdminBooking.find({ customerId: req.params.id })
        .populate('vehicleId', 'name type')
        .sort({ createdAt: -1 });

    res.json(bookings);
});

// @desc    Get customer payments
// @route   GET /api/admin/customers/:id/payments
// @access  Private (Admin)
const getCustomerPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({ customerId: req.params.id })
        .populate('bookingId', 'bookingId serviceType')
        .sort({ createdAt: -1 });

    res.json(payments);
});

module.exports = { getAllCustomers, getCustomerById, getCustomerBookings, getCustomerPayments };
