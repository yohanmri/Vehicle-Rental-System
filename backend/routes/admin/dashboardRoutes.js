const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getBookingsOverTime,
    getRevenueOverTime,
    getByServiceType,
    getTopVehicles,
    getByCity,
    getPaymentMethods,
    getUserConversion,
} = require('../../controllers/admin/dashboardController');
const { protectAdmin } = require('../../middleware/adminMiddleware');

router.get('/stats', protectAdmin, getDashboardStats);
router.get('/analytics/bookings-over-time', protectAdmin, getBookingsOverTime);
router.get('/analytics/revenue-over-time', protectAdmin, getRevenueOverTime);
router.get('/analytics/by-service-type', protectAdmin, getByServiceType);
router.get('/analytics/top-vehicles', protectAdmin, getTopVehicles);
router.get('/analytics/by-city', protectAdmin, getByCity);
router.get('/analytics/payment-methods', protectAdmin, getPaymentMethods);
router.get('/analytics/user-conversion', protectAdmin, getUserConversion);

module.exports = router;
