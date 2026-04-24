import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, Plane, ShieldCheck, Globe, Clock } from 'lucide-react';

const Business = () => {
    const services = [
        {
            icon: <Plane className="w-8 h-8 text-[#ffc107]" />,
            title: 'Airport Transfers',
            description: 'Reliable airport pickups and drops for your executives and clients with real-time flight tracking.'
        },
        {
            icon: <Briefcase className="w-8 h-8 text-[#ffc107]" />,
            title: 'Corporate Accounts',
            description: 'Streamlined billing and priority booking for registered corporate partners.'
        },
        {
            icon: <Clock className="w-8 h-8 text-[#ffc107]" />,
            title: 'Hourly Rentals',
            description: 'Flexible disposal services for meetings, events, and city tours on an hourly basis.'
        }
    ];

    const benefits = [
        { title: 'Priority Dispatch', desc: 'Corporate bookings are automatically prioritized in our system.' },
        { title: 'Monthly Billing', desc: 'Consolidated invoices for all your company trips, payable monthly.' },
        { title: 'Premium Fleet', desc: 'Access to our top-tier luxury sedans and executive SUVs.' },
        { title: 'Dedicated Support', desc: 'A dedicated account manager for all your transport needs.' }
    ];

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="bg-[#1e2a3b] rounded-[40px] overflow-hidden mb-20 shadow-2xl relative">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" 
                            alt="Modern Office" 
                            className="w-full h-full object-cover opacity-20"
                        />
                    </div>
                    <div className="relative z-10 p-12 lg:p-24 flex flex-col items-center text-center">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#ffc107]/20 p-3 rounded-2xl mb-8"
                        >
                            <Building2 className="w-10 h-10 text-[#ffc107]" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Corporate Mobility <br/> Solutions
                        </h1>
                        <p className="text-gray-400 max-w-2xl text-lg mb-10">
                            Partner with Zameer Cabs to provide your team and clients with the most reliable, safe, and professional transport service in Sri Lanka.
                        </p>
                        <button className="bg-[#ffc107] text-[#1e2a3b] px-10 py-4 rounded-full font-bold hover:bg-[#e0a800] transition-colors shadow-lg">
                            Register Your Business
                        </button>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {services.map((service, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#f1f5f9] p-10 rounded-[30px] border border-[#1e2a3b]/5 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1e2a3b] mb-4">{service.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a3b]">Why Choose Zameer Cabs for Business?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <div className="w-5 h-5 bg-[#ffc107] rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#1e2a3b] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1e2a3b] mb-1">{benefit.title}</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full aspect-video rounded-[30px] overflow-hidden shadow-2xl relative group">
                         <img 
                            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=1473" 
                            alt="Business Meeting" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a3b]/60 to-transparent"></div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 text-center">
                    <div className="bg-[#ffc107] rounded-[40px] p-12 lg:p-20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a3b] mb-6">Ready to upgrade your corporate travel?</h2>
                            <p className="text-[#1e2a3b]/70 mb-10 font-medium max-w-xl mx-auto">
                                Join over 500+ Sri Lankan companies who trust Zameer Cabs for their daily transport needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-[#1e2a3b] text-white px-10 py-4 rounded-full font-bold hover:bg-[#2a3b50] transition-colors">
                                    Contact Sales
                                </button>
                                <button className="bg-white text-[#1e2a3b] px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors border border-[#1e2a3b]/10">
                                    Request Demo
                                </button>
                            </div>
                        </div>
                        {/* Decorative Icons */}
                        <Globe className="absolute -bottom-10 -right-10 w-64 h-64 text-[#1e2a3b]/5 -rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Business;
