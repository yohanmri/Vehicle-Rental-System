const asyncHandler = require('express-async-handler');
const AdminBooking = require('../../models/admin/AdminBooking');
const Booking = require('../../models/user/Booking');
const Vehicle = require('../../models/user/Vehicle');
const AdminVehicle = require('../../models/admin/AdminVehicle');

// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
    const { type, status, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (type && type !== 'all') filter.serviceType = type;
    if (status) filter.bookingStatus = status;
    if (dateFrom || dateTo) {
        filter.fromDate = {};
        if (dateFrom) filter.fromDate.$gte = new Date(dateFrom);
        if (dateTo) filter.fromDate.$lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
        AdminBooking.find(filter)
            .populate('customerId', 'name email phone nic')
            .populate('vehicleId', 'name type imageUrl pricePerDay')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        AdminBooking.countDocuments(filter),
    ]);

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single booking
// @route   GET /api/admin/bookings/:id
// @access  Private (Admin)
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await AdminBooking.findById(req.params.id)
        .populate('customerId', 'name email phone nic')
        .populate('vehicleId', 'name type imageUrl');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    res.json(booking);
});

// @desc    Update booking status (admin confirm/cancel/edit)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await AdminBooking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const prevStatus = booking.bookingStatus;

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    const updated = await booking.save();

    // Sync status back to user-facing Booking
    if (booking.linkedBookingId) {
        const statusMap = {
            confirmed: 'confirmed',
            cancelled: 'cancelled',
            pending: 'pending',
            active: 'confirmed',
            completed: 'confirmed',
        };
        await Booking.findByIdAndUpdate(booking.linkedBookingId, {
            status: statusMap[bookingStatus] || bookingStatus
        });
    }

    res.json(updated);
});

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private (Admin)
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await AdminBooking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
});

module.exports = { getAllBookings, getBookingById, updateBookingStatus, deleteBooking };
