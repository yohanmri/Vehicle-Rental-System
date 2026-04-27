const asyncHandler = require('express-async-handler');
const Vehicle = require('../../models/user/Vehicle');
const AdminVehicle = require('../../models/admin/AdminVehicle');

// @desc    Get all vehicles (merges old Vehicle collection + admin-managed AdminVehicle collection)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = asyncHandler(async (req, res) => {
    // Fetch from both collections in parallel
    const [legacyVehicles, adminVehicles] = await Promise.all([
        Vehicle.find({}),
        AdminVehicle.find({}).sort({ createdAt: -1 }),
    ]);

    // Map AdminVehicle fields → VehicleCard-compatible shape
    const mappedAdminVehicles = adminVehicles.map(v => ({
        _id: v._id,
        name: v.name,
        type: v.type,
        capacity: v.capacity,
        price: v.pricePerDay,           // VehicleCard reads 'price'
        originalPrice: v.originalPrice, // VehicleCard reads 'originalPrice' for strikethrough
        image: v.imageUrl,              // VehicleCard reads 'image'
        additionalImages: v.additionalImages,
        description: v.description,
        available: v.available,
        steering: v.steering,
        fuel: v.fuel,
    }));

    // Admin-added vehicles come first, then legacy ones
    res.json([...mappedAdminVehicles, ...legacyVehicles]);
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = asyncHandler(async (req, res) => {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
        const adminVehicle = await AdminVehicle.findById(req.params.id);
        if (adminVehicle) {
            vehicle = {
                _id: adminVehicle._id,
                name: adminVehicle.name,
                type: adminVehicle.type,
                capacity: adminVehicle.capacity,
                price: adminVehicle.pricePerDay,
                originalPrice: adminVehicle.originalPrice,
                image: adminVehicle.imageUrl,
                additionalImages: adminVehicle.additionalImages,
                description: adminVehicle.description,
                available: adminVehicle.available,
                steering: adminVehicle.steering,
                fuel: adminVehicle.fuel,
            };
        }
    }

    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
});

// @desc    Add new vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
const addVehicle = asyncHandler(async (req, res) => {
    const { name, type, price, image, description } = req.body;
    const vehicle = await Vehicle.create({ name, type, price, image, description });
    res.status(201).json(vehicle);
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        vehicle.name = req.body.name || vehicle.name;
        vehicle.type = req.body.type || vehicle.type;
        vehicle.price = req.body.price || vehicle.price;
        vehicle.image = req.body.image || vehicle.image;
        vehicle.description = req.body.description || vehicle.description;
        vehicle.availability = req.body.availability !== undefined ? req.body.availability : vehicle.availability;

        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
});

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
});

module.exports = { getVehicles, getVehicleById, addVehicle, updateVehicle, deleteVehicle };
