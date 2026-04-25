import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[42px] font-bold text-[#1e2a3b] mb-2 tracking-tight"
                    >
                        Connect with Us
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-[15px]"
                    >
                        We're here to answer your questions and provide support for your journeys.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Info Column */}
                    <div className="w-full lg:w-5/12 flex flex-col gap-4">
                        <div className="bg-[#f1f5f9] rounded-[4px] p-8 flex-1 border border-[#1e2a3b]/5 shadow-sm">
                            <div className="mb-8 group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Mail className="w-5 h-5 text-[#ffc107]" />
                                    </div>
                                    <h4 className="text-gray-500 font-medium text-sm">Email</h4>
                                </div>
                                <p className="text-[#1e2a3b] font-semibold text-[15px] pl-10">bookings@2588588.com</p>
                            </div>

                            <div className="mb-8 group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Phone className="w-5 h-5 text-[#ffc107]" />
                                    </div>
                                    <h4 className="text-gray-500 font-medium text-sm">Phone</h4>
                                </div>
                                <p className="text-[#1e2a3b] font-semibold text-[15px] pl-10">+94 112 588 588</p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <MapPin className="w-5 h-5 text-[#ffc107]" />
                                    </div>
                                    <h4 className="text-gray-500 font-medium text-sm">Address</h4>
                                </div>
                                <p className="text-[#1e2a3b] font-semibold text-[15px] leading-relaxed pl-10">
                                    Pick 'N' Go 360 Pvt Ltd. - Headquarters<br/>
                                    No 485 7/A, Gunawardena Mawatha, Wijerama, Nugegoda,<br/>
                                    Sri Lanka
                                </p>
                            </div>
                        </div>
                        
                        {/* Map & WhatsApp Row */}
                        <div className="flex gap-4 h-24">
                            <div className="flex-1 rounded-[4px] overflow-hidden relative border border-[#1e2a3b]/5 group cursor-pointer shadow-sm">
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Map" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-[#1e2a3b]">
                                    Nugegoda, Sri Lanka
                                </div>
                            </div>
                            <div className="flex-1 bg-[#f1f5f9] rounded-[4px] border border-[#1e2a3b]/5 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors group shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 text-white p-2 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1e2a3b] text-[15px] leading-tight">WhatsApp</h4>
                                        <p className="text-gray-400 text-[11px] font-medium">Live Chat</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="w-full lg:w-7/12 bg-[#f1f5f9] rounded-[4px] p-8 border border-[#1e2a3b]/5 shadow-sm">
                        <form className="flex flex-col gap-4">
                            <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#1e2a3b] focus-within:ring-1 focus-within:ring-[#1e2a3b] transition-all">
                                <div className="flex items-center gap-2 px-4 bg-gray-50 border-r border-gray-200 text-gray-500 text-sm font-medium">
                                    <img src="https://flagcdn.com/w20/lk.png" alt="Sri Lanka" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                                    <span>+94</span>
                                </div>
                                <input type="tel" placeholder="Enter Mobile Number" className="flex-1 px-4 py-3 outline-none text-[15px]" />
                            </div>

                            <input type="text" placeholder="Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px] bg-white" />
                            <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px] bg-white" />
                            <input type="text" placeholder="Subject" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px] bg-white" />
                            
                            <textarea rows="4" placeholder="Leave us a message" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px] resize-none bg-white"></textarea>

                            <label className="flex items-center gap-3 mt-2 cursor-pointer group w-fit">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1e2a3b] focus:ring-[#1e2a3b] cursor-pointer" />
                                <span className="text-gray-500 text-[13px] group-hover:text-gray-700 transition-colors">I would like to receive more information about Pick 'N' Go 360 Pvt Ltd.</span>
                            </label>

                            <div className="mt-4 flex justify-end">
                                <button type="button" className="bg-[#1e2a3b] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#2a3b50] transition-colors shadow-lg shadow-[#1e2a3b]/10 text-[15px]">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
