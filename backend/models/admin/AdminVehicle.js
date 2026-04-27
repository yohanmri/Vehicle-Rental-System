const mongoose = require('mongoose');

function arrayLimit(val) {
    return val.length <= 3;
}

// Extended Vehicle model with full admin fields
const vehicleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a vehicle name'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['Bike', 'Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'],
            required: [true, 'Please add a vehicle type'],
        },
        capacity: {
            type: Number,
            required: [true, 'Please add capacity'],
        },
        steering: {
            type: String,
            enum: ['Manual', 'Automatic'],
            default: 'Manual',
        },
        fuel: {
            type: Number,
            default: 40,
        },
        pricePerDay: {
            type: Number,
            required: [true, 'Please add price per day'],
        },
        originalPrice: {
            type: Number,
        },
        description: {
            type: String,
            default: '',
        },
        imageUrl: {
            type: String,
            default: '',
        },
        additionalImages: {
            type: [String],
            default: [],
            validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('AdminVehicle', vehicleSchema);
