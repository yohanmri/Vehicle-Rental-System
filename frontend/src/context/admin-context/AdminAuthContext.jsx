import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../api/axios';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('adminInfo');
        if (stored) {
            setAdmin(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const loginAdmin = async (username, password) => {
        const { data } = await axios.post('/api/admin/auth/login', { username, password });
        localStorage.setItem('adminInfo', JSON.stringify(data));
        setAdmin(data);
        return data;
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminInfo');
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
