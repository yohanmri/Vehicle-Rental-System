import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/auth/register', { name, email, password });
            login(data, data.token);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2">Join Zameer Cabs</h1>
                        <p className="text-gray-400">Create an account to start booking</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="John Doe"
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
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full py-3 flex items-center justify-center space-x-2 text-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-secondary-dark border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <UserPlus className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-semibold inline-flex items-center">
                                Log in <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
