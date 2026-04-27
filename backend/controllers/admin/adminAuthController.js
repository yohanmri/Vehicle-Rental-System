const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin/Admin');

// Generate JWT for admin
const generateAdminToken = (id) => {
    return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Admin Login
// @route   POST /api/admin/auth/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400);
        throw new Error('Please provide username and password');
    }

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            username: admin.username,
            token: generateAdminToken(admin._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Change Admin Password
// @route   POST /api/admin/auth/change-password
// @access  Private (Admin)
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin || !(await admin.matchPassword(currentPassword))) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    admin.passwordHash = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
});

// @desc    Change Admin Username
// @route   PATCH /api/admin/auth/change-username
// @access  Private (Admin)
const changeUsername = asyncHandler(async (req, res) => {
    const { newUsername } = req.body;

    if (!newUsername) {
        res.status(400);
        throw new Error('Please provide a new username');
    }

    const exists = await Admin.findOne({ username: newUsername });
    if (exists) {
        res.status(400);
        throw new Error('Username already taken');
    }

    const admin = await Admin.findById(req.admin._id);
    admin.username = newUsername;
    await admin.save();

    res.json({ message: 'Username updated successfully', username: admin.username });
});

module.exports = { adminLogin, changePassword, changeUsername };
