import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Contact from './pages/Contact';
import Business from './pages/Business';
import Tours from './pages/Tours';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageBookings from './pages/admin/ManageBookings';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business" element={<Business />} />
          <Route path="/tours" element={<Tours />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/vehicles" element={<ManageVehicles />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
