const asyncHandler = require('express-async-handler');
const AdminBooking = require('../../models/admin/AdminBooking');
const AdminVehicle = require('../../models/admin/AdminVehicle');
const User = require('../../models/user/User');
const Payment = require('../../models/admin/Payment');

// Helper: get date range filter
const getDateRange = (period) => {
    const now = new Date();
    let from;

    switch (period) {
        case 'today':
            from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            from = new Date(now);
            from.setDate(now.getDate() - 7);
            break;
        case 'year':
            from = new Date(now.getFullYear(), 0, 1);
            break;
        case 'month':
        default:
            from = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
    }

    return { $gte: from, $lte: now };
};

// @desc    Get KPI stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = asyncHandler(async (req, res) => {
    const { period = 'month' } = req.query;
    const dateRange = getDateRange(period);

    const [totalBookings, revenue, activeRides, totalCustomers] = await Promise.all([
        AdminBooking.countDocuments({ createdAt: dateRange }),
        AdminBooking.aggregate([
            // In a rental system, you might want to sum all bookings or just paid ones.
            // Let's sum 'paid', 'success', or even 'pending' if they are confirmed bookings.
            // Assuming successful payments or all bookings for the month:
            { $match: { createdAt: dateRange } }, // Let's just sum all revenue for the month to match the "real" metric
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        AdminBooking.countDocuments({
            bookingStatus: 'active',
            createdAt: dateRange,
        }),
        User.countDocuments({ role: 'user' }) // Total customers
    ]);

    res.json({
        totalBookings,
        revenue: revenue[0]?.total || 0,
        activeRides,
        totalCustomers
    });
});

// Helper function to parse dates for analytics
const getAnalyticsDateRange = (req) => {
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
        // Set to start of day and end of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return { $gte: start, $lte: end };
    }
    // Default to last 30 days
    return { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
};

// @desc    Bookings over time
// @route   GET /api/admin/dashboard/analytics/bookings-over-time
// @access  Private (Admin)
const getBookingsOverTime = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    const data = await AdminBooking.aggregate([
        { $match: { createdAt: dateRange } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.json(data.map((d) => ({ date: d._id, bookings: d.count })));
});

// @desc    Revenue over time
// @route   GET /api/admin/dashboard/analytics/revenue-over-time
// @access  Private (Admin)
const getRevenueOverTime = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    const data = await AdminBooking.aggregate([
        { $match: { createdAt: dateRange } }, // Using all bookings for revenue to match stats
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.json(data.map((d) => ({ date: d._id, revenue: d.revenue })));
});

// @desc    Bookings by service type
// @route   GET /api/admin/dashboard/analytics/by-service-type
// @access  Private (Admin)
const getByServiceType = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    const data = await AdminBooking.aggregate([
        { $match: { createdAt: dateRange } },
        { $group: { _id: '$serviceType', value: { $sum: 1 } } },
    ]);

    res.json(data.map((d) => ({ name: d._id || 'Unknown', value: d.value })));
});

// @desc    Top performing vehicles
// @route   GET /api/admin/dashboard/analytics/top-vehicles
// @access  Private (Admin)
const getTopVehicles = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    const data = await AdminBooking.aggregate([
        { $match: { vehicleId: { $ne: null }, createdAt: dateRange } },
        { $group: { _id: '$vehicleId', bookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { revenue: -1 } },
        { $limit: 8 },
        {
            $lookup: {
                from: 'adminvehicles',
                localField: '_id',
                foreignField: '_id',
                as: 'vehicle',
            },
        },
        { $unwind: { path: '$vehicle', preserveNullAndEmptyArrays: true } },
    ]);

    res.json(
        data.map((d) => ({
            name: d.vehicle?.name || 'Unknown',
            bookings: d.bookings,
            revenue: d.revenue
        }))
    );
});

// @desc    Bookings by city
// @route   GET /api/admin/dashboard/analytics/by-city
// @access  Private (Admin)
const getByCity = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    const data = await AdminBooking.aggregate([
        { $match: { pickupLocation: { $ne: null }, createdAt: dateRange } },
        { $group: { _id: '$pickupLocation', bookings: { $sum: 1 } } },
        { $sort: { bookings: -1 } },
        { $limit: 8 },
    ]);

    res.json(data.map((d) => ({ city: d._id || 'Unknown', bookings: d.bookings })));
});

// @desc    Payment method distribution
// @route   GET /api/admin/dashboard/analytics/payment-methods
// @access  Private (Admin)
const getPaymentMethods = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    const data = await AdminBooking.aggregate([
        { $match: { paymentMethod: { $ne: null }, createdAt: dateRange } },
        { $group: { _id: '$paymentMethod', value: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    res.json(data.map((d) => ({ name: d._id || 'Unknown', value: d.value, count: d.count })));
});

// @desc    User conversion stats
// @route   GET /api/admin/dashboard/analytics/user-conversion
// @access  Private (Admin)
const getUserConversion = asyncHandler(async (req, res) => {
    const dateRange = getAnalyticsDateRange(req);
    
    // Count total users created in this period
    const totalRegistered = await User.countDocuments({ createdAt: dateRange });
    
    // Count distinct users who made a booking in this period
    const rentedUsersCount = await AdminBooking.distinct('userId', { createdAt: dateRange }).then(users => users.length);
    
    res.json([
        { name: 'Registered', value: totalRegistered, fill: '#3b82f6' },
        { name: 'Rented', value: rentedUsersCount, fill: '#10b981' },
        { name: 'No Activity', value: Math.max(0, totalRegistered - rentedUsersCount), fill: '#94a3b8' }
    ]);
});

module.exports = {
    getDashboardStats,
    getBookingsOverTime,
    getRevenueOverTime,
    getByServiceType,
    getTopVehicles,
    getByCity,
    getPaymentMethods,
    getUserConversion,
};
