import { Routes, Route } from 'react-router-dom';
import Navbar from './components/user-components/Navbar';
import Footer from './components/user-components/Footer';
import Home from './pages/user-pages/Home';
import Login from './pages/user-pages/Login';
import Register from './pages/user-pages/Register';
import Vehicles from './pages/user-pages/Vehicles';
import VehicleDetail from './pages/user-pages/VehicleDetail';
import MyBookings from './pages/user-pages/MyBookings';
import Profile from './pages/user-pages/Profile';
import ProtectedRoute from './components/user-components/ProtectedRoute';
import About from './pages/user-pages/About';
import Contact from './pages/user-pages/Contact';
import Business from './pages/user-pages/Business';
import Tours from './pages/user-pages/Tours';
import ScrollToTop from './components/user-components/ScrollToTop';

// Admin Pages
import Dashboard from './pages/admin-pages/Dashboard';
import ManageVehicles from './pages/admin-pages/ManageVehicles';
import ManageBookings from './pages/admin-pages/ManageBookings';

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow w-full overflow-x-hidden">
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
          
          <Route path="/my-bookings" element={<MyBookings />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
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
