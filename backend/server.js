const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── User Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/user/authRoutes'));
app.use('/api/vehicles', require('./routes/user/vehicleRoutes'));
app.use('/api/bookings', require('./routes/user/bookingRoutes'));
app.use('/api/users',    require('./routes/user/userRoutes'));

// ─── Admin Routes ───────────────────────────────────────────────────────────
app.use('/api/admin/auth',      require('./routes/admin/adminAuthRoutes'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboardRoutes'));
app.use('/api/admin/bookings',  require('./routes/admin/adminBookingRoutes'));
app.use('/api/admin/vehicles',  require('./routes/admin/adminVehicleRoutes'));
app.use('/api/admin/customers', require('./routes/admin/customerRoutes'));
app.use('/api/admin/payments',  require('./routes/admin/paymentRoutes'));
app.use('/api/admin/tours',     require('./routes/admin/tourRoutes'));

// ─── Static Uploads ─────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
