const asyncHandler = require('express-async-handler');
const Tour = require('../../models/admin/Tour');

// @desc    Get all public tours
// @route   GET /api/tours
// @access  Public
const getPublicTours = asyncHandler(async (req, res) => {
    // Only return the ones you need or simply return all.
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
});

module.exports = { getPublicTours };
