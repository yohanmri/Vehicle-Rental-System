const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
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
