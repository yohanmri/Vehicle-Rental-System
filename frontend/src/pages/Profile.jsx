import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Shield, Save, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put('/users/profile', { name, email, password });
            login(data, localStorage.getItem('token'));
            toast.success('Profile updated successfully');
            setPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
            >
                <div className="flex items-center space-x-6 mb-12 pb-8 border-b border-white/5">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-secondary-dark font-bold text-3xl">
                        {user?.name[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user?.name}</h1>
                        <div className="flex items-center space-x-2 text-primary font-medium mt-1">
                            <Shield className="w-4 h-4" />
                            <span className="capitalize">{user?.role} Account</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="text" 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:border-primary/50 outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="email" 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:border-primary/50 outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Change Password (leave blank to keep current)</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="password" 
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:border-primary/50 outline-none"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2 px-8 py-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-secondary-dark border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
