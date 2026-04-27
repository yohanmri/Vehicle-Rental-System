const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
    },
    wantsInfo: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
