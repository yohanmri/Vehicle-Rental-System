const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Admin = require('./models/admin/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Remove existing admin
        await Admin.deleteMany({});

        // Pass plain password — the Admin model's pre-save hook hashes it
        await Admin.create({
            username: 'admin',
            passwordHash: 'admin123',
        });

        console.log('✅ Admin seeded successfully!');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
