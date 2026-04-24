import { Link } from 'react-router-dom';
import { Car, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1e2a3b] text-white pt-16 pb-8 border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between mb-16">
                    {/* Brand and Follow Us */}
                    <div className="mb-10 lg:mb-0">
                        <Link to="/" className="flex items-center space-x-2 mb-8 group">
                            <div className="bg-[#ffc107] p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <Car className="h-8 w-8 text-[#1e2a3b]" />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    Zameer
                                </span>
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    Cabs
                                </span>
                            </div>
                        </Link>
                        
                        <div className="mb-4 text-[#ffc107] font-bold">Follow Us On</div>
                        <div className="flex space-x-4">
                            <a href="#" className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Contacts and Hotlines */}
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                        <div className="flex flex-col space-y-4">
                            <div className="text-[#ffc107] font-bold text-lg mb-2">General Inquiries</div>
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Telephone</div>
                                <div className="font-semibold">+94 112 588 047</div>
                                <div className="font-semibold">+94 112 596 314</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm mb-1 mt-4">For custom packages</div>
                                <div className="font-semibold">tours@zameercabs.com</div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-[#ffc107] font-bold text-lg mb-6 text-right">Hotlines</div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                <div>
                                    <div className="text-gray-300 text-sm mb-1">Zameer Cabs</div>
                                    <div className="font-semibold text-sm">+94 112 588 588</div>
                                </div>
                                <div>
                                    <div className="text-gray-300 text-sm mb-1">Zameer City</div>
                                    <div className="font-semibold text-sm">+94 112 801 801</div>
                                </div>
                                <div>
                                    <div className="text-gray-300 text-sm mb-1">Zameer Budget</div>
                                    <div className="font-semibold text-sm">+94 112 592 592</div>
                                </div>
                                <div>
                                    <div className="text-gray-300 text-sm mb-1">Zameer Vans</div>
                                    <div className="font-semibold text-sm">+94 112 501 501</div>
                                </div>
                                <div>
                                    <div className="text-gray-300 text-sm mb-1">WhatsApp/Viber</div>
                                    <div className="font-semibold text-sm">+94 729 588 588</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Section: Links and Apps */}
                <div className="flex flex-col md:flex-row justify-between items-end border-t border-gray-700 pt-8 pb-12">
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <div className="text-[#ffc107] font-bold mb-4">Company</div>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link to="/" className="hover:text-white transition-colors">Ride</Link></li>
                            <li><Link to="/vehicles" className="hover:text-white transition-colors">Rentals</Link></li>
                            <li><Link to="/business" className="hover:text-white transition-colors">Business</Link></li>
                            <li><Link to="/tours" className="hover:text-white transition-colors">Tours</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="text-gray-300 text-sm">Download Zameer app</div>
                        <div className="flex space-x-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10 cursor-pointer" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10 cursor-pointer" />
                            {/* Using a placeholder for AppGallery or similar style */}
                            <div className="h-10 bg-black border border-gray-700 rounded-md flex items-center px-3 cursor-pointer">
                                <span className="text-white text-xs font-bold">EXPLORE IT ON<br/>AppGallery</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                    <p>© Copyright 2026, All Rights Reserved by Zameer Cabs</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
            
            {/* Floating FAQ and WhatsApp */}
            <div className="fixed bottom-6 right-6 flex items-center space-x-4 z-50">
                <button className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.373-.043c.098-.115.424-.494.54-.665.115-.173.231-.144.39-.087.159.058 1.011.477 1.184.564.173.087.289.129.332.202.043.073.043.423-.101.827z"/></svg>
                </button>
                <button className="bg-[#1e2a3b] text-[#ffc107] font-bold border-2 border-[#ffc107] px-4 py-2 rounded-full shadow-lg hover:bg-[#ffc107] hover:text-[#1e2a3b] transition-colors">
                    FAQ
                </button>
            </div>
        </footer>
    );
};

export default Footer;
