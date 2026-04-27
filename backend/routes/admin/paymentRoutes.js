const express = require('express');
const router = express.Router();
const { getAllPayments, getPaymentById } = require('../../controllers/admin/paymentController');
const { protectAdmin } = require('../../middleware/adminMiddleware');

router.get('/', protectAdmin, getAllPayments);
router.get('/:id', protectAdmin, getPaymentById);

module.exports = router;
