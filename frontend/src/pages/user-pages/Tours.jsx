import React from 'react';
import { motion } from 'framer-motion';
import { Palmtree, Map, Camera, Umbrella, Coffee, Compass } from 'lucide-react';

import sigiriyaImg from '../../assets/user-assets/images/tours/sigiriya.jpg';
import kandyImg from '../../assets/user-assets/images/tours/kandy.jpg';
import southImg from '../../assets/user-assets/images/tours/south.jpg';

const Tours = () => {
    const packages = [
        {
            title: 'Cultural Triangle',
            image: sigiriyaImg,
            price: '35,000',
            duration: '3 Days / 2 Nights',
            destinations: ['Sigiriya', 'Anuradhapura', 'Polonnaruwa']
        },
        {
            title: 'Hill Country Escape',
            image: kandyImg,
            price: '42,000',
            duration: '4 Days / 3 Nights',
            destinations: ['Kandy', 'Ella', 'Nuwara Eliya']
        },
        {
            title: 'Southern Coast Glow',
            image: southImg,
            price: '28,000',
            duration: '3 Days / 2 Nights',
            destinations: ['Galle', 'Mirissa', 'Unawatuna']
        }
    ];

    const whyTours = [
        { icon: <Map className="w-6 h-6" />, title: 'Curated Routes', desc: 'Expertly designed itineraries to see the best of Sri Lanka.' },
        { icon: <Umbrella className="w-6 h-6" />, title: 'All Weather Support', desc: 'Rain or shine, we ensure your tour remains comfortable.' },
        { icon: <Coffee className="w-6 h-6" />, title: 'Local Insights', desc: 'Our drivers know the best hidden gems and tea spots.' },
        { icon: <Compass className="w-6 h-6" />, title: 'Total Flexibility', desc: 'Want to spend an extra hour at the beach? No problem.' }
    ];

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="bg-[#1e2a3b] p-3 rounded-[4px] shadow-xl">
                            <Palmtree className="w-8 h-8 text-[#ffc107]" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1e2a3b] mb-4 tracking-tight">Explore Sri Lanka with Pick 'N' Go 360 Pvt Ltd.</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Customizable tour packages designed for comfort, adventure, and local discovery.
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {packages.map((pkg, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#f1f5f9] rounded-[4px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-[#1e2a3b]/5 group"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img 
                                    src={pkg.image} 
                                    alt={pkg.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-[#1e2a3b] text-sm shadow-sm">
                                    LKR {pkg.price}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="text-[#ffc107] font-bold text-xs uppercase tracking-widest mb-2">{pkg.duration}</div>
                                <h3 className="text-2xl font-bold text-[#1e2a3b] mb-4">{pkg.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {pkg.destinations.map((dest, j) => (
                                        <span key={j} className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-full text-gray-500 border border-gray-100 uppercase tracking-tighter">
                                            {dest}
                                        </span>
                                    ))}
                                </div>
                                <button className="w-full bg-[#1e2a3b] text-white py-4 rounded-[4px] font-bold hover:bg-[#2a3b50] transition-colors flex items-center justify-center gap-2 group">
                                    View Itinerary
                                    <Camera className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="bg-[#1e2a3b] rounded-[4px] p-10 lg:p-20 text-white relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {whyTours.map((item, i) => (
                            <div key={i} className="text-center md:text-left">
                                <div className="w-12 h-12 bg-[#ffc107]/20 rounded-[4px] flex items-center justify-center mb-6 text-[#ffc107] mx-auto md:mx-0">
                                    {item.icon}
                                </div>
                                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Travel Teaser Section */}
                <div className="mt-24 flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2">
                         <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a3b] mb-6 leading-tight">Your Journey, <br/> Your Way.</h2>
                         <p className="text-gray-500 leading-relaxed mb-8">
                            We don't just provide a driver; we provide a travel companion. Our tour specialists are trained to help you navigate the rich history and vibrant culture of Sri Lanka with ease and luxury.
                         </p>
                         <button className="bg-transparent border-2 border-[#1e2a3b] text-[#1e2a3b] px-10 py-3.5 rounded-full font-bold hover:bg-[#1e2a3b] hover:text-white transition-all">
                            Customize Your Tour
                         </button>
                    </div>
                    <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                        <img src={kandyImg} className="rounded-[4px] h-48 w-full object-cover" />
                        <img src={sigiriyaImg} className="rounded-[4px] h-48 w-full object-cover mt-8" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tours;
