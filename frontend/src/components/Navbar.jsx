import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Ride', path: '/' },
        { name: 'Rentals', path: '/vehicles' },
        { name: 'Business', path: '/business' },
        { name: 'Tours', path: '/tours' },
        { name: 'About', path: '/about' },
        { name: 'Connect with Us', path: '/contact' },
    ];

    // If it's not the home page, or if we've scrolled down, show solid background
    const navBackground = (scrolled || !isHome || isOpen) ? 'bg-[#1e2a3b] shadow-lg' : 'bg-transparent';

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${navBackground}`}>
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Left: Logo & Links */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center mr-3 sm:mr-6 shrink-0" onClick={() => setIsOpen(false)}>
                            <div className="flex flex-col -space-y-1">
                                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#ffc107] italic">
                                    Zameer
                                </span>
                                <span className="text-lg sm:text-xl font-bold tracking-tight text-white bg-[#1e2a3b] px-1 italic border border-white rounded-sm mt-0.5">
                                    Cabs
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden xl:flex items-center space-x-5 ml-4">
                            {navLinks.map((link, i) => (
                                <Link key={i} to={link.path} className="text-white text-[15px] font-semibold hover:text-[#ffc107] transition-colors whitespace-nowrap">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: Button & Auth */}
                    <div className="hidden xl:flex items-center">
                        <Link to="/my-bookings" className="bg-[#ffc107] text-[#1e2a3b] px-5 py-2 rounded font-bold text-[14px] hover:bg-[#e0a800] transition-colors whitespace-nowrap">
                            Check your booking
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-[#ffc107] font-semibold hover:text-white transition-colors">Admin</Link>
                                )}
                                <Link to="/profile" className="flex items-center space-x-2 text-white hover:text-[#ffc107]">
                                    <User className="w-5 h-5" />
                                </Link>
                                <button onClick={logout} className="text-gray-300 hover:text-red-400 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
                                <Link to="/login" className="text-white font-semibold hover:text-[#ffc107]">Login</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="xl:hidden flex items-center gap-3">
                         <Link to="/my-bookings" className="bg-[#ffc107] text-[#1e2a3b] px-3.5 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-[#e0a800] transition-colors whitespace-nowrap shadow-sm">
                            Bookings
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="xl:hidden bg-[#1e2a3b] border-t border-white/10 shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)] animate-in fade-in slide-in-from-top duration-200">
                    <div className="px-5 pt-4 pb-12 space-y-1">
                        {navLinks.map((link, i) => (
                            <Link 
                                key={i} 
                                to={link.path} 
                                onClick={() => setIsOpen(false)}
                                className="block text-white/90 font-bold hover:text-[#ffc107] py-4 border-b border-white/5 text-[15px] tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <div className="pt-6 space-y-3">
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 text-white font-bold py-3.5 px-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="bg-[#ffc107]/20 p-2 rounded-lg">
                                        <User className="w-5 h-5 text-[#ffc107]" />
                                    </div>
                                    <span>My Profile</span>
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 text-[#ffc107] font-bold py-3.5 px-4 bg-white/5 rounded-xl border border-[#ffc107]/20">
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                                <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center space-x-3 text-red-400 font-bold w-full py-3.5 px-4 bg-red-400/5 rounded-xl border border-red-400/20 mt-4">
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout Account</span>
                                </button>
                            </div>
                        ) : (
                            <div className="pt-8 grid grid-cols-2 gap-4">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center text-white font-bold py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors border border-white/10">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center bg-[#ffc107] text-[#1e2a3b] font-bold py-4 rounded-2xl hover:bg-[#e0a800] transition-colors shadow-lg shadow-[#ffc107]/10">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
