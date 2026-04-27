const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a tour title'],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, 'Please add a duration (e.g. 3 Days / 2 Nights)'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price in LKR'],
        },
        destinations: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        imageUrl: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
