const asyncHandler = require('express-async-handler');
const AdminVehicle = require('../../models/admin/AdminVehicle');
const { cloudinary } = require('../../config/cloudinary');

// @desc    Get all vehicles with optional type filter
// @route   GET /api/admin/vehicles
// @access  Private (Admin)
const getAllVehicles = asyncHandler(async (req, res) => {
    const { type, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.type = { $regex: new RegExp(type, 'i') };

    const skip = (Number(page) - 1) * Number(limit);
    const [vehicles, total] = await Promise.all([
        AdminVehicle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        AdminVehicle.countDocuments(filter),
    ]);

    res.json({ vehicles, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single vehicle
// @route   GET /api/admin/vehicles/:id
// @access  Private (Admin)
const getVehicleById = asyncHandler(async (req, res) => {
    const vehicle = await AdminVehicle.findById(req.params.id);
    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }
    res.json(vehicle);
});

// @desc    Create vehicle (with Cloudinary image)
// @route   POST /api/admin/vehicles
// @access  Private (Admin)
const createVehicle = asyncHandler(async (req, res) => {
    const { name, type, capacity, steering, fuel, pricePerDay, originalPrice, description, available } = req.body;

    if (!name || !type || !capacity || !pricePerDay) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const imageUrl = req.file ? req.file.path : '';

    const vehicle = await AdminVehicle.create({
        name,
        type,
        capacity: Number(capacity),
        steering,
        fuel: Number(fuel) || 40,
        pricePerDay: Number(pricePerDay),
        originalPrice: Number(originalPrice) || Number(pricePerDay),
        description,
        imageUrl,
        available: available !== undefined ? available : true,
    });

    res.status(201).json(vehicle);
});

// @desc    Update vehicle
// @route   PATCH /api/admin/vehicles/:id
// @access  Private (Admin)
const updateVehicle = asyncHandler(async (req, res) => {
    const vehicle = await AdminVehicle.findById(req.params.id);

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    const fields = ['name', 'type', 'capacity', 'steering', 'fuel', 'pricePerDay', 'originalPrice', 'description', 'available'];
    fields.forEach((f) => {
        if (req.body[f] !== undefined) vehicle[f] = req.body[f];
    });

    if (req.file) {
        // Delete old image from Cloudinary if exists
        if (vehicle.imageUrl) {
            const publicId = vehicle.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`pick-n-go-360/${publicId}`).catch(() => {});
        }
        vehicle.imageUrl = req.file.path;
    }

    const updated = await vehicle.save();
    res.json(updated);
});

// @desc    Delete vehicle
// @route   DELETE /api/admin/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await AdminVehicle.findById(req.params.id);

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    if (vehicle.imageUrl) {
        const publicId = vehicle.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`pick-n-go-360/${publicId}`).catch(() => {});
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
});

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
