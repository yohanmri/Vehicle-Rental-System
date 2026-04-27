const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: [true, 'Please add a password'],
        },
    },
    { timestamps: true }
);

// Match entered password to hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

module.exports = mongoose.model('Admin', adminSchema);
