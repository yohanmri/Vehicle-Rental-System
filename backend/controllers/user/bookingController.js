const asyncHandler = require('express-async-handler');
const Booking = require('../../models/user/Booking');
const Vehicle = require('../../models/user/Vehicle');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const { vehicleId, startDate, endDate, totalPrice } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    if (!vehicle.availability) {
        res.status(400);
        throw new Error('Vehicle is not available');
    }

    const booking = await Booking.create({
        user: req.user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        totalPrice
    });

    res.status(201).json(booking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('vehicle');
    res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'name email').populate('vehicle');
    res.json(bookings);
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized');
        }

        booking.status = 'cancelled';
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.status = req.body.status || booking.status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking, updateBookingStatus };
