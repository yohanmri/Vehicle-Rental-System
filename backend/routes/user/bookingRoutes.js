const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking, updateBookingStatus, getBookedDates } = require('../../controllers/user/bookingController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getAllBookings);

router.get('/mybookings', protect, getMyBookings);
router.get('/booked-dates/:vehicleId', getBookedDates);

router.route('/:id')
    .put(protect, cancelBooking);

router.route('/:id/status')
    .put(protect, admin, updateBookingStatus);

module.exports = router;
