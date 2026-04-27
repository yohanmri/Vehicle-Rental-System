import { Routes, Route, Navigate } from 'react-router-dom';

// ─── User Components ─────────────────────────────────────────────────────────
import Navbar from './components/user-components/Navbar';
import Footer from './components/user-components/Footer';
import ProtectedRoute from './components/user-components/ProtectedRoute';
import ScrollToTop from './components/user-components/ScrollToTop';

// ─── User Pages ───────────────────────────────────────────────────────────────
import Home from './pages/user-pages/Home';
import Login from './pages/user-pages/Login';
import Register from './pages/user-pages/Register';
import Vehicles from './pages/user-pages/Vehicles';
import VehicleDetail from './pages/user-pages/VehicleDetail';
import MyBookings from './pages/user-pages/MyBookings';
import Profile from './pages/user-pages/Profile';
import About from './pages/user-pages/About';
import Contact from './pages/user-pages/Contact';
import Business from './pages/user-pages/Business';
import Tours from './pages/user-pages/Tours';

// ─── Admin Context & Guards ───────────────────────────────────────────────────
import { AdminAuthProvider } from './context/admin-context/AdminAuthContext';
import AdminProtectedRoute from './components/admin-components/AdminProtectedRoute';
import AdminLayout from './components/admin-components/AdminLayout';

// ─── Admin Pages ──────────────────────────────────────────────────────────────
import AdminLogin from './pages/admin-pages/AdminLogin';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import AdminAnalytics from './pages/admin-pages/AdminAnalytics';
import AdminContactMessages from './pages/admin-pages/AdminContactMessages';
import AdminBookings from './pages/admin-pages/AdminBookings';
import AdminVehicles from './pages/admin-pages/AdminVehicles';
import AdminVehicleForm from './pages/admin-pages/AdminVehicleForm';
import AdminCustomers from './pages/admin-pages/AdminCustomers';
import AdminPayments from './pages/admin-pages/AdminPayments';
import AdminTours from './pages/admin-pages/AdminTours';
import AdminTourForm from './pages/admin-pages/AdminTourForm';
import AdminSettings from './pages/admin-pages/AdminSettings';

function App() {
  return (
    <AdminAuthProvider>
      <Routes>

        {/* ── Admin: Login (no sidebar) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin: Protected pages (with sidebar layout) ── */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="analytics"  element={<AdminAnalytics />} />
          <Route path="messages"   element={<AdminContactMessages />} />
          <Route path="bookings"   element={<AdminBookings />} />
          <Route path="vehicles"       element={<AdminVehicles />} />
          <Route path="vehicles/add"   element={<AdminVehicleForm />} />
          <Route path="vehicles/edit/:id" element={<AdminVehicleForm />} />
          <Route path="customers"      element={<AdminCustomers />} />
          <Route path="payments"       element={<AdminPayments />} />
          <Route path="tours"          element={<AdminTours />} />
          <Route path="tours/add"      element={<AdminTourForm />} />
          <Route path="tours/edit/:id" element={<AdminTourForm />} />
          <Route path="settings"   element={<AdminSettings />} />
        </Route>

        {/* ── User: All public routes (with Navbar/Footer) ── */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
              <ScrollToTop />
              <Navbar />
              <main className="flex-grow w-full overflow-x-hidden">
                <Routes>
                  <Route path="/"              element={<Home />} />
                  <Route path="/login"         element={<Login />} />
                  <Route path="/register"      element={<Register />} />
                  <Route path="/vehicles"      element={<Vehicles />} />
                  <Route path="/vehicles/:id"  element={<VehicleDetail />} />
                  <Route path="/about"         element={<About />} />
                  <Route path="/contact"       element={<Contact />} />
                  <Route path="/business"      element={<Business />} />
                  <Route path="/tours"         element={<Tours />} />
                  <Route path="/my-bookings"   element={<MyBookings />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
