import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Award, Users, Star } from 'lucide-react';

const About = () => {
    const stats = [
        { label: 'Vehicles in Fleet', value: '150+' },
        { label: 'Happy Customers', value: '10K+' },
        { label: 'Years of Excellence', value: '15+' },
        { label: 'Professional Drivers', value: '200+' }
    ];

    const values = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-[#ffc107]" />,
            title: 'Safety First',
            description: 'Your safety is our top priority. All our vehicles undergo rigorous maintenance and safety checks.'
        },
        {
            icon: <Clock className="w-8 h-8 text-[#ffc107]" />,
            title: 'Always On Time',
            description: 'We value your time. Our punctuality is what sets us apart in the transport industry.'
        },
        {
            icon: <Award className="w-8 h-8 text-[#ffc107]" />,
            title: 'Premium Service',
            description: 'Experience luxury and comfort with our well-maintained fleet and professional chauffeurs.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[42px] font-bold text-[#1e2a3b] mb-4 tracking-tight"
                    >
                        About Pick 'N' Go 360 Pvt Ltd.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto text-lg"
                    >
                        We are Sri Lanka's leading premium transport provider, committed to delivering exceptional travel experiences with safety and comfort.
                    </motion.p>
                </div>

                {/* Content Block */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[4px] overflow-hidden shadow-2xl"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1470" 
                            alt="Luxury Car Interior" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-[#1e2a3b]">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Founded over 15 years ago, Pick 'N' Go 360 Pvt Ltd. began with a single vision: to redefine the transport landscape in Sri Lanka. Today, we are proud to be the trusted partner for thousands of travelers, businesses, and tourists.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our mission is to provide seamless, high-quality, and reliable transportation solutions through innovation, a modern fleet, and a dedicated team of professionals who go above and beyond.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-[#f1f5f9] p-4 rounded-[4px] border border-[#1e2a3b]/5 shadow-sm">
                                    <div className="text-2xl font-bold text-[#1e2a3b]">{stat.value}</div>
                                    <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div className="bg-[#1e2a3b] rounded-[4px] p-12 lg:p-20 text-white relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {values.map((value, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-center">{value.icon}</div>
                                <h3 className="text-xl font-bold">{value.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#ffc107]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Team/Testimonial Teaser */}
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-bold text-[#1e2a3b] mb-12">Trusted by Global Partners</h2>
                    <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale mb-16">
                        {/* Placeholder logos */}
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="h-12 w-32 bg-gray-400 rounded-[4px]"></div>
                        ))}
                    </div>

                    {/* Google Map */}
                    <div className="w-full h-[450px] rounded-[4px] overflow-hidden shadow-lg border-2 border-white">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585987134!2d79.82118593857317!3d6.921838643115456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1713531600000!5m2!1sen!2slk" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
