const asyncHandler = require('express-async-handler');
const Booking = require('../../models/user/Booking');
const Vehicle = require('../../models/user/Vehicle');
const AdminVehicle = require('../../models/admin/AdminVehicle');
const AdminBooking = require('../../models/admin/AdminBooking');

// Stripe is initialised lazily so the env var is always available
function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.includes('sk_test_51...')) {
        throw new Error('STRIPE_SECRET_KEY is not set in .env');
    }
    return require('stripe')(key);
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const { vehicleId, startDate, endDate, totalPrice, paymentMethod } = req.body;

    // Try both collections
    let vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) vehicle = await AdminVehicle.findById(vehicleId);

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    // Check for date overlap — only block if dates clash, not global flag
    const overlappingBooking = await Booking.findOne({
        vehicle: vehicleId,
        status: { $in: ['pending', 'confirmed'] },
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) },
    });
    if (overlappingBooking) {
        res.status(400);
        throw new Error('Vehicle is already booked for these dates');
    }

    // Create booking in Booking collection (user-facing)
    const booking = await Booking.create({
        user: req.user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        totalPrice,
        paymentMethod: paymentMethod || 'cash',
        status: 'pending'
    });

    // Also create in AdminBooking so admin sees it
    await AdminBooking.create({
        customerId: req.user._id,
        serviceType: 'rental',
        vehicleId: vehicleId,
        pickupLocation: 'Zameer Cabs - Main Branch',
        fromDate: startDate,
        toDate: endDate,
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: 'pending',
        bookingStatus: 'pending',
        totalAmount: totalPrice,
        linkedBookingId: booking._id,
    });

    // If card payment, create Stripe Checkout session and return URL
    if (paymentMethod === 'card') {
        // Stripe minimum for LKR is ~150 LKR ($0.50 equivalent)
        if (totalPrice < 150) {
            return res.status(201).json({
                ...booking.toObject(),
                stripeError: `Minimum card payment is LKR 150. Your total is LKR ${totalPrice}. Please use Cash instead.`
            });
        }
        try {
            const stripe = getStripe();
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'lkr',
                        product_data: {
                            name: `Vehicle Rental: ${vehicle.name}`,
                            description: `From ${startDate} to ${endDate}`,
                        },
                        unit_amount: Math.round(totalPrice * 100), // LKR: 1000 LKR → 100000 (in paisa)
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                metadata: { bookingId: booking._id.toString() },
                client_reference_id: booking._id.toString(),
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-bookings?payment_success=true&bookingId=${booking._id}`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/vehicles/${vehicleId}?payment_canceled=true`,
            });
            return res.status(201).json({ ...booking.toObject(), stripeUrl: session.url });
        } catch (stripeError) {
            console.error('Stripe error:', stripeError.message);
            return res.status(201).json({ ...booking.toObject(), stripeError: stripeError.message });
        }
    }

    res.status(201).json(booking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('vehicle')
        .sort({ createdAt: -1 });
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

        // Also update AdminBooking
        await AdminBooking.findOneAndUpdate(
            { linkedBookingId: booking._id },
            { bookingStatus: 'cancelled' }
        );

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

// @desc    Get booked dates for a vehicle
// @route   GET /api/bookings/booked-dates/:vehicleId
// @access  Public
const getBookedDates = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;
    const bookings = await Booking.find({
        vehicle: vehicleId,
        status: { $in: ['pending', 'confirmed'] }
    }).select('startDate endDate');
    res.json(bookings);
});

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking, updateBookingStatus, getBookedDates };
