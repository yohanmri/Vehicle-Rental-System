import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Star, ShieldCheck, Clock, CheckCircle, Car as CarIcon, Baby, ChevronDown, MessageCircle } from 'lucide-react';
import HeroBookingWidget from '../components/HeroBookingWidget';

const Home = () => {
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        { category: 'Zameer Cabs booking a ride from airport', question: 'How do I book a Zameer Cab from the airport?', answer: 'You can easily book a ride through our mobile app or website before your arrival. Alternatively, you can visit our dedicated airport counters located in the arrival lounge.' },
        { category: 'Zameer Cabs payment methods', question: 'Can I pay by card or do I need cash?', answer: 'We offer flexible payment options. You can pay using major credit/debit cards directly in the cab, via our app, or choose to pay with cash.' },
        { category: 'Zameer Cabs drivers', question: 'Are your drivers licensed and reliable?', answer: 'Absolutely. All our drivers hold professional licenses, undergo strict background checks, and receive regular training to ensure your safety and comfort.' },
        { category: 'Zameer Cabs English-speaking drivers', question: 'Will I get an English-speaking driver?', answer: 'Yes, we prioritize assigning drivers who are fluent in English for all our airport transfers to ensure clear and easy communication.' }
    ];

    return (
        <div className="flex flex-col bg-[#f8f9fa]">
            {/* Hero Section */}
            <section className="relative min-h-[100vh] flex flex-col items-center justify-start pt-24 lg:pt-28 pb-16">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#1e2a3b]/40 z-10" />
                    <img 
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070" 
                        alt="Luxury car" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Hero Text */}
                <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-[28px] sm:text-[42px] md:text-[52px] font-bold mb-4 text-white leading-[1.2] font-sans tracking-tight">
                            Your Journey with <br className="sm:hidden" />
                            <span className="text-[#ffc107]">Zameer Cabs</span> <br />
                            Starts Here
                        </h1>
                        <p className="text-[14px] sm:text-[18px] text-white/90 mb-6 font-medium max-w-lg mx-auto">
                            Your safety and comfort is our concern
                        </p>
                        
                        <div className="flex justify-center">
                            <button className="flex items-center space-x-2 text-white font-bold text-sm border border-white/50 rounded-md px-4 py-1.5 hover:bg-white/10 transition-colors bg-black/20 backdrop-blur-sm">
                                <PlayCircle className="w-4 h-4" />
                                <span>Watch Video</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
                
                {/* Booking Widget */}
                <div className="relative z-30 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <HeroBookingWidget />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-[40px] font-bold text-[#1e2a3b] mb-4">
                        Ride with the Best where Service, <br/>
                        Safety and <span className="text-[#1e2a3b]">Reliability</span> Meet!
                    </h2>
                    <p className="text-gray-500 mb-16 text-lg">These are just a few of the reasons why we're Sri Lanka's preferred cab service.</p>

                    <div className="flex flex-col items-center space-y-12">
                        {/* Top Row (4 items) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl w-full">
                            {[
                                { icon: <ShieldCheck className="w-8 h-8 text-[#ffc107]" />, title: 'Flight Monitoring', desc: "We track your flight to ensure we're there right when you land and we'll adjust if your flight gets delayed - no waiting, no stress!" },
                                { icon: <Clock className="w-8 h-8 text-[#ffc107]" />, title: '24/7/365 Support', desc: "Need help? We've got you covered around the clock, every day of the year, through any channel you prefer." },
                                { icon: <CarIcon className="w-8 h-8 text-[#ffc107]" />, title: 'Trained Drivers', desc: "Our friendly, professional drivers are not just experts behind the wheel, they've gone through a thorough vetting and selection process." },
                                { icon: <Star className="w-8 h-8 text-[#ffc107]" />, title: '35 Years Excellence', desc: "With over 35 years of experience, you're in trusted hands with every ride." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center px-4">
                                    <div className="w-[70px] h-[70px] rounded-full border-2 border-gray-100 flex items-center justify-center mb-6 shadow-sm bg-white">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1e2a3b] mb-3">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Row (3 items) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
                            {[
                                { icon: <CheckCircle className="w-8 h-8 text-[#ffc107]" />, title: 'Free Cancellations', desc: "Plans changed? No worries, enjoy the flexibility of free cancellations." },
                                { icon: <CarIcon className="w-8 h-8 text-[#ffc107]" />, title: 'Wide range of fleet', desc: "Whether you're traveling solo or with a group, we have the perfect ride for every journey." },
                                { icon: <Baby className="w-8 h-8 text-[#ffc107]" />, title: 'Baby Seat', desc: "Traveling with little ones? We've got safe, comfy baby seats to keep your family happy on the go." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center px-4">
                                    <div className="w-[70px] h-[70px] rounded-full border-2 border-gray-100 flex items-center justify-center mb-6 shadow-sm bg-white">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1e2a3b] mb-3">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-[#1a2530]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center">Our Passenger's <span className="font-extrabold">Stories</span></h2>
                    <p className="text-gray-400 mb-12 text-center text-lg">See why people love Zameer Cabs</p>

                    <div className="w-full max-w-7xl">
                        <div className="bg-[#2a3b50] rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg mx-auto w-full max-w-6xl">
                            <div>
                                <div className="text-xl font-bold text-white flex items-center space-x-2">
                                    <span className="text-blue-400 font-extrabold text-2xl">G</span>
                                    <span>Google Zameer Cabs Reviews</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-yellow-400 font-bold text-lg">4.5</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, star) => (
                                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 text-sm">(3,372)</span>
                                </div>
                            </div>
                            <button className="bg-[#1a2530] text-white px-6 py-2.5 rounded-full font-semibold border border-gray-600 hover:bg-gray-800 transition-colors text-sm">
                                Review us on Google
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: 'Ketpharima Sansud', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', initial: 'K', color: 'bg-purple-500', text: 'I had a great experience with Zameer Van during my one-week trip...', date: '1 day ago' },
                                { name: 'Jithendra Gunatilake', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face', initial: 'J', color: 'bg-orange-500', text: 'Had a very comfortable trip with Isanka Wijesinha. It is a...', date: '2 days ago' },
                                { name: 'Jmss Silva', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face', initial: 'J', color: 'bg-green-500', text: 'My mother ordered a cab to pick me up at 7.30 am to take me to university...', date: '2 days ago' },
                                { name: 'mubashir Rahman', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face', initial: 'm', color: 'bg-gray-500', text: 'CAB 6280 Service rendered was top notch', date: '3 days ago' },
                                { name: 'Hand Surgeon', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', initial: 'H', color: 'bg-blue-500', text: 'Fantastic service! Always punctual, the drivers are polite and the vehicles...', date: '3 days ago' },
                                { name: 'Ashanthi Wijenaike', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face', initial: 'A', color: 'bg-pink-500', text: 'Very good', date: '3 days ago' },
                                { name: 'Truls Eriksen', image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face', initial: 'T', color: 'bg-red-500', text: 'My wife ordered a taxi for 04:30 on 18 November 2023. The taxi arrived 20...', date: '3 days ago' },
                                { name: 'Abhishek Jain', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', initial: 'A', color: 'bg-yellow-500', text: 'Very Professional experience. Our driver Mr Manjula is very safe...', date: '4 days ago' }
                            ].map((testi, i) => (
                                <div key={i} className="bg-[#2a3b50] rounded-xl p-6 shadow-lg flex flex-col justify-between">
                                    <div>
                                        <div className="flex mb-3">
                                            {[...Array(5)].map((_, star) => (
                                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-300 text-sm mb-2 leading-relaxed">{testi.text}</p>
                                        <a href="#" className="text-blue-400 text-sm hover:underline mb-6 inline-block font-semibold">Read more</a>
                                    </div>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <div className="relative">
                                            {testi.image ? (
                                                <img src={testi.image} alt={testi.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#2a3b50]" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full ${testi.color} flex items-center justify-center text-white font-bold`}>
                                                    {testi.initial}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                                <span className="text-blue-500 font-bold text-[10px] w-3 h-3 flex items-center justify-center">G</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-[13px] flex items-center">
                                                {testi.name}
                                                <CheckCircle className="w-3.5 h-3.5 text-blue-400 ml-1.5 fill-blue-400/20" />
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{testi.date}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 flex justify-center">
                            <button className="bg-gray-700/50 text-white px-8 py-2.5 rounded-full font-semibold hover:bg-gray-600 transition-colors text-sm">
                                See More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-24 bg-[#1e2a3b]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <h2 className="text-[42px] font-bold text-white mb-2 tracking-tight">FAQs</h2>
                    <p className="text-gray-300 mb-12 text-[15px]">Discover more information about Zameer Cabs for Your Travel</p>

                    <div className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className="bg-[#f8f9fa] rounded-xl overflow-hidden cursor-pointer"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <div className="p-5 flex justify-between items-center">
                                    <div>
                                        <p className="text-[12px] text-gray-500 font-medium mb-1">{faq.category}</p>
                                        <h3 className="font-bold text-[#1e2a3b] text-[18px]">{faq.question}</h3>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </div>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }} 
                                            animate={{ height: 'auto', opacity: 1 }} 
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 pt-0 text-gray-600 border-t border-gray-200 mt-2">
                                                <p className="pt-3 leading-relaxed text-[15px]">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <button className="bg-white text-[#1e2a3b] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm">
                            See more
                        </button>
                    </div>
                </div>
            </section>

            {/* Connect With Us Section */}
            <section id="connect-with-us" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-[42px] font-bold text-[#1e2a3b] mb-2 tracking-tight">Connect with Us</h2>
                        <p className="text-gray-500 text-[15px]">We're here to answer your questions and provide support</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Info Column */}
                        <div className="w-full lg:w-5/12 flex flex-col gap-4">
                            <div className="bg-[#f8f9fa] rounded-2xl p-8 flex-1 border border-gray-100">
                                <div className="mb-8">
                                    <h4 className="text-gray-500 font-medium text-sm mb-2">Email</h4>
                                    <p className="text-[#1e2a3b] font-semibold text-[15px]">bookings@2588588.com</p>
                                </div>
                                <div className="mb-8">
                                    <h4 className="text-gray-500 font-medium text-sm mb-2">Phone</h4>
                                    <p className="text-[#1e2a3b] font-semibold text-[15px]">+94 112 588 588</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-500 font-medium text-sm mb-2">Address</h4>
                                    <p className="text-[#1e2a3b] font-semibold text-[15px] leading-relaxed">
                                        Zameer Cabs - Headquarters<br/>
                                        No 485 7/A, Gunawardena Mawatha, Wijerama, Nugegoda,<br/>
                                        Sri Lanka
                                    </p>
                                </div>
                            </div>
                            
                            {/* Map & WhatsApp Row */}
                            <div className="flex gap-4 h-24">
                                <div className="flex-1 rounded-2xl overflow-hidden relative border border-gray-100 group cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Map" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-[#1e2a3b]">
                                        Nugegoda, Sri Lanka
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500 text-white p-2 rounded-full group-hover:scale-110 transition-transform">
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
                        <div className="w-full lg:w-7/12 bg-[#f8f9fa] rounded-2xl p-8 border border-gray-100">
                            <form className="flex flex-col gap-4">
                                <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#1e2a3b] focus-within:ring-1 focus-within:ring-[#1e2a3b] transition-all">
                                    <div className="flex items-center gap-2 px-4 bg-gray-50 border-r border-gray-200 text-gray-500 text-sm font-medium">
                                        <img src="https://flagcdn.com/w20/lk.png" alt="Sri Lanka" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                                        <span>+94</span>
                                    </div>
                                    <input type="tel" placeholder="Enter Mobile Number" className="flex-1 px-4 py-3 outline-none text-[15px]" />
                                </div>

                                <input type="text" placeholder="Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px]" />
                                <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px]" />
                                <input type="text" placeholder="Subject" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px]" />
                                
                                <textarea rows="4" placeholder="Leave us a message" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1e2a3b] focus:ring-1 focus:ring-[#1e2a3b] transition-all text-[15px] resize-none"></textarea>

                                <label className="flex items-center gap-3 mt-2 cursor-pointer group w-fit">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1e2a3b] focus:ring-[#1e2a3b] cursor-pointer" />
                                    <span className="text-gray-500 text-[13px] group-hover:text-gray-700 transition-colors">I would like to receive more information about Zameer Cabs.</span>
                                </label>

                                <div className="mt-4 flex justify-end">
                                    <button type="button" className="bg-[#1e2a3b] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#2a3b50] transition-colors shadow-sm text-[15px]">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
