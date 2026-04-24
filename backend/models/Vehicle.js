const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a vehicle name']
    },
    type: {
        type: String,
        required: [true, 'Please add a vehicle type']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price per day']
    },
    image: {
        type: String,
        required: [true, 'Please add a vehicle image']
    },
    availability: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
