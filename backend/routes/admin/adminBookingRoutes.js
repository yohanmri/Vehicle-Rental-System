const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
} = require('../../controllers/admin/adminBookingController');
const { protectAdmin } = require('../../middleware/adminMiddleware');

router.get('/', protectAdmin, getAllBookings);
router.get('/:id', protectAdmin, getBookingById);
router.patch('/:id/status', protectAdmin, updateBookingStatus);
router.delete('/:id', protectAdmin, deleteBooking);

module.exports = router;
