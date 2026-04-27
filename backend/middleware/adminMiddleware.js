const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/admin/Admin');

const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ensure this token belongs to an admin
            if (decoded.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized as admin');
            }

            req.admin = await Admin.findById(decoded.id).select('-passwordHash');

            if (!req.admin) {
                res.status(401);
                throw new Error('Admin not found');
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protectAdmin };
