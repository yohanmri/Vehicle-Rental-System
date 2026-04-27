const express = require('express');
const router = express.Router();
const {
    getAllCustomers,
    getCustomerById,
    getCustomerBookings,
    getCustomerPayments,
} = require('../../controllers/admin/customerController');
const { protectAdmin } = require('../../middleware/adminMiddleware');

router.get('/', protectAdmin, getAllCustomers);
router.get('/:id', protectAdmin, getCustomerById);
router.get('/:id/bookings', protectAdmin, getCustomerBookings);
router.get('/:id/payments', protectAdmin, getCustomerPayments);

module.exports = router;
