const asyncHandler = require('express-async-handler');
const Tour = require('../../models/admin/Tour');
const { cloudinary } = require('../../config/cloudinary');

// @desc    Get all tours
// @route   GET /api/admin/tours
// @access  Private (Admin)
const getAllTours = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [tours, total] = await Promise.all([
        Tour.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Tour.countDocuments(),
    ]);

    res.json({ tours, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single tour
// @route   GET /api/admin/tours/:id
// @access  Private (Admin)
const getTourById = asyncHandler(async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        res.status(404);
        throw new Error('Tour not found');
    }
    res.json(tour);
});

// @desc    Create tour
// @route   POST /api/admin/tours
// @access  Private (Admin)
const createTour = asyncHandler(async (req, res) => {
    const { title, duration, price, destinations, description } = req.body;

    if (!title || !duration || !price || !description) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const imageUrl = req.file ? req.file.path : '';

    // destinations can come as JSON string or array
    let parsedDestinations = [];
    if (destinations) {
        try {
            parsedDestinations = JSON.parse(destinations);
        } catch {
            parsedDestinations = destinations.split(',').map((d) => d.trim());
        }
    }

    const tour = await Tour.create({
        title,
        duration,
        price: Number(price),
        destinations: parsedDestinations,
        description,
        imageUrl,
    });

    res.status(201).json(tour);
});

// @desc    Update tour
// @route   PATCH /api/admin/tours/:id
// @access  Private (Admin)
const updateTour = asyncHandler(async (req, res) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        res.status(404);
        throw new Error('Tour not found');
    }

    const fields = ['title', 'duration', 'price', 'description'];
    fields.forEach((f) => {
        if (req.body[f] !== undefined) tour[f] = req.body[f];
    });

    if (req.body.destinations) {
        try {
            tour.destinations = JSON.parse(req.body.destinations);
        } catch {
            tour.destinations = req.body.destinations.split(',').map((d) => d.trim());
        }
    }

    if (req.file) {
        if (tour.imageUrl) {
            const publicId = tour.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`pick-n-go-360/${publicId}`).catch(() => {});
        }
        tour.imageUrl = req.file.path;
    }

    const updated = await tour.save();
    res.json(updated);
});

// @desc    Delete tour
// @route   DELETE /api/admin/tours/:id
// @access  Private (Admin)
const deleteTour = asyncHandler(async (req, res) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        res.status(404);
        throw new Error('Tour not found');
    }

    if (tour.imageUrl) {
        const publicId = tour.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`pick-n-go-360/${publicId}`).catch(() => {});
    }

    await tour.deleteOne();
    res.json({ message: 'Tour removed' });
});

module.exports = { getAllTours, getTourById, createTour, updateTour, deleteTour };
