import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/user-context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, loading, token } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
