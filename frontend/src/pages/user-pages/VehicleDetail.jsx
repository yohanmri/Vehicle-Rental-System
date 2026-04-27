import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/user-context/AuthContext';
import Loader from '../../components/user-components/Loader';
import { toast } from 'react-hot-toast';
import { Heart, Star, ArrowDownUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Import images from src/assets
import car1 from '../../assets/user-assets/images/vehicle/Car (1).png';
import car2 from '../../assets/user-assets/images/vehicle/Car (2).png';
import car3 from '../../assets/user-assets/images/vehicle/Car (3).png';
import car4 from '../../assets/user-assets/images/vehicle/Car (4).png';
import car5 from '../../assets/user-assets/images/vehicle/Car (5).png';
import carDefault from '../../assets/user-assets/images/vehicle/Car.png';
import bike1 from '../../assets/user-assets/images/vehicle/bike1.png';
import bike2 from '../../assets/user-assets/images/vehicle/bike2.png';
import bike3 from '../../assets/user-assets/images/vehicle/bike3.png';

const carImages = [car1, car2, car3, car4, car5];

const VehicleDetail = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingDates, setBookingDates] = useState({
        start: '',
        end: ''
    });
    const [activeImage, setActiveImage] = useState('');

    // Mock Card state
    const [cardData, setCardData] = useState({
        number: '**** **** **** 4242',
        name: 'John Doe',
        expiry: '12/26',
        cvv: '***'
    });

    // Sidebar state (mocked to match design)
    const selectedTypes = ['Sport', 'SUV'];
    const selectedCapacities = ['2 Person'];
    
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`/api/vehicles/${id}`);
                setVehicle(data);
                
                // Initialize active image
                let imageUrl = data.image || carDefault;
                if (data.image && (data.image.includes('http') || data.image.startsWith('data:') || data.image.startsWith('blob:') || data.image.includes('/assets/') || data.image.startsWith('/src/assets/'))) {
                    imageUrl = data.image;
                } else if (data.image && typeof data.image === 'string') {
                    imageUrl = `${axios.defaults.baseURL.replace('/api', '')}/${data.image}`;
                }
                setActiveImage(imageUrl);
            } catch (err) {
                console.error('Vehicle not found for ID:', id);
                toast.error('Vehicle not found');
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id, navigate]);

    const handleBooking = () => {
        // Removed login check for prototype
        setShowCheckout(true);
    };

    const confirmBooking = async () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            toast.success(paymentMethod === 'card' ? 'Payment Successful & Booking Confirmed!' : 'Booking Confirmed! Pay on Arrival.');
            setShowCheckout(false);
            // navigate('/my-bookings'); // Disabled for prototype to avoid login redirect
        }, 2000);
    };

    if (loading) return <div className="min-h-screen pt-24"><Loader /></div>;
    if (!vehicle) return null;

    // Use imported image logic for base image reference
    let mainImageUrl = vehicle.image || carDefault;
    if (vehicle.image && (vehicle.image.includes('http') || vehicle.image.startsWith('data:') || vehicle.image.startsWith('blob:') || vehicle.image.includes('/assets/') || vehicle.image.startsWith('/src/assets/'))) {
        mainImageUrl = vehicle.image;
    } else if (vehicle.image && typeof vehicle.image === 'string') {
        mainImageUrl = `${axios.defaults.baseURL.replace('/api', '')}/${vehicle.image}`;
    }

    // Process additional images
    const galleryImages = [mainImageUrl];
    if (vehicle.additionalImages && vehicle.additionalImages.length > 0) {
        vehicle.additionalImages.forEach(img => {
            if (!img) return;
            if (img.includes('http') || img.startsWith('data:') || img.startsWith('blob:') || img.includes('/assets/') || img.startsWith('/src/assets/')) {
                galleryImages.push(img);
            } else {
                galleryImages.push(`${axios.defaults.baseURL.replace('/api', '')}/${img}`);
            }
        });
    }

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-16 pb-12 sm:pt-20 sm:pb-24">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 flex flex-col lg:flex-row gap-6 sm:gap-8">
                
                {/* Left Sidebar - Shared from Rentals */}
                <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm p-6 self-start hidden lg:block border border-gray-100">
                    {/* TYPE */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Type</span>
                        <div className="space-y-3">
                            {['Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'].map((type) => (
                                <label key={type} className="flex items-center cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedTypes.includes(type) ? 'bg-[#ffc107] border-[#ffc107]' : 'border-gray-300 group-hover:border-[#ffc107]'}`}>
                                        {selectedTypes.includes(type) && (
                                            <svg className="w-3 h-3 text-[#1e2a3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`ml-3 text-[15px] ${selectedTypes.includes(type) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{type}</span>
                                    <span className="ml-1 text-[15px] text-gray-400">(10)</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* CAPACITY */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Capacity</span>
                        <div className="space-y-3">
                            {['2 Person', '4 Person', '6 Person', '8 or More'].map((cap) => (
                                <label key={cap} className="flex items-center cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedCapacities.includes(cap) ? 'bg-[#ffc107] border-[#ffc107]' : 'border-gray-300 group-hover:border-[#ffc107]'}`}>
                                        {selectedCapacities.includes(cap) && (
                                            <svg className="w-3 h-3 text-[#1e2a3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`ml-3 text-[15px] ${selectedCapacities.includes(cap) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{cap}</span>
                                    <span className="ml-1 text-[15px] text-gray-400">(10)</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    
                    {/* Top Pick-Up / Drop-Off Widget Area */}
                    <div className="flex flex-col xl:flex-row items-center gap-4 mb-8">
                        {/* Pick-Up Box */}
                        <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-full relative">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-4 h-4 rounded-full border-4 border-[#ffc107]/30 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></div>
                                </div>
                                <span className="font-bold text-gray-900">Pick - Up</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-1">Locations</label>
                                    <div className="flex items-center justify-between text-gray-400 text-xs">
                                        <span>Select city</span>
                                        <ArrowDownUp className="w-3 h-3" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-1">Date</label>
                                    <div className="flex items-center justify-between text-gray-400 text-xs">
                                        <span>Select date</span>
                                        <ArrowDownUp className="w-3 h-3" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-1">Time</label>
                                    <div className="flex items-center justify-between text-gray-400 text-xs">
                                        <span>Select time</span>
                                        <ArrowDownUp className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Swap Button */}
                        <button className="bg-[#1e2a3b] hover:bg-[#ffc107] text-white hover:text-[#1e2a3b] w-14 h-14 rounded-xl flex items-center justify-center shadow-lg shadow-[#1e2a3b]/20 z-10 xl:-mx-8 transition-colors shrink-0">
                            <ArrowDownUp className="w-6 h-6" />
                        </button>

                        {/* Drop-Off Box */}
                        <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-full relative">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-4 h-4 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                </div>
                                <span className="font-bold text-gray-900">Drop - Off</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-1">Locations</label>
                                    <div className="flex items-center justify-between text-gray-400 text-xs">
                                        <span>Select city</span>
                                        <ArrowDownUp className="w-3 h-3" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-1">Date</label>
                                    <div className="flex items-center justify-between text-gray-400 text-xs">
                                        <span>Select date</span>
                                        <ArrowDownUp className="w-3 h-3" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-1">Time</label>
                                    <div className="flex items-center justify-between text-gray-400 text-xs">
                                        <span>Select time</span>
                                        <ArrowDownUp className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                        {/* Left Side: Images */}
                        <div className="flex flex-col gap-4 sm:gap-6">
                            {/* Main Image Card */}
                            <div className="bg-[#1e2a3b] rounded-[10px] sm:rounded-[20px] relative overflow-hidden h-[300px] sm:h-[400px] lg:h-auto lg:aspect-[4/3] flex items-center justify-center">
                                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#ffc107]/10 rounded-full blur-3xl z-0"></div>
                                <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-white/5 rounded-full blur-2xl z-0"></div>
                                <img 
                                    src={activeImage || mainImageUrl} 
                                    alt={vehicle.name} 
                                    className="relative z-10 w-full h-full object-cover drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
 
                            {/* Thumbnails */}
                            {galleryImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-3 sm:gap-5">
                                    {galleryImages.map((img, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => setActiveImage(img)}
                                            className={`rounded-[10px] aspect-[4/3] p-1 flex items-center justify-center border overflow-hidden cursor-pointer transition-all ${
                                                activeImage === img ? 'bg-[#ffc107]/10 border-[#ffc107]' : 'bg-white border-gray-200 hover:border-[#ffc107]'
                                            }`}
                                        >
                                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-[6px]" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Side: Details / Checkout */}
                        <div className="bg-white rounded-[10px] p-5 sm:p-8 shadow-sm border border-gray-100 flex flex-col min-h-[450px] sm:min-h-[500px]">
                            {!showCheckout ? (
                                <motion.div 
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col h-full justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 leading-tight">{vehicle.name}</h1>
                                            <button className="text-red-500 hover:text-red-600 transition-colors pt-1 sm:pt-2">
                                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-6 sm:mb-8">
                                            <div className="flex text-[#ffc107]">
                                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
                                            </div>
                                            <span className="text-gray-500 text-xs sm:text-sm font-medium">440+ Reviewer</span>
                                        </div>

                                        <p className="text-gray-500 text-sm sm:text-[16px] leading-relaxed sm:leading-loose mb-8 sm:mb-10">
                                            {vehicle.description || "No description provided for this vehicle."}
                                        </p>

                                        <div className="grid grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-12 mb-8 sm:mb-10">
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-gray-400 text-xs sm:text-[15px]">Type</span>
                                                <span className="font-semibold text-gray-700 text-xs sm:text-[15px]">{vehicle.type || 'Sport'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-gray-400 text-xs sm:text-[15px]">Capacity</span>
                                                <span className="font-semibold text-gray-700 text-xs sm:text-[15px]">{vehicle.capacity || '2 Person'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-gray-400 text-xs sm:text-[15px]">Steering</span>
                                                <span className="font-semibold text-gray-700 text-xs sm:text-[15px]">{vehicle.steering || 'Manual'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-gray-400 text-xs sm:text-[15px]">Fuel</span>
                                                <span className="font-semibold text-gray-700 text-xs sm:text-[15px]">{vehicle.fuel ? `${vehicle.fuel}L` : (vehicle.type === 'Bike' ? '12L' : '70L')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col xs:flex-row items-center justify-between mt-auto gap-4">
                                        <div className="w-full xs:w-auto">
                                            <div className="text-[24px] sm:text-[28px] font-bold text-gray-900 flex items-end leading-none">
                                                LKR {parseFloat(vehicle.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<span className="text-[12px] sm:text-[14px] text-gray-400 font-medium ml-2 mb-1">/ day</span>
                                            </div>
                                            {vehicle.originalPrice && vehicle.originalPrice !== vehicle.price && (
                                                <div className="text-[13px] sm:text-[15px] text-gray-400 line-through mt-1">
                                                    LKR {parseFloat(vehicle.originalPrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleBooking}
                                            className="w-full xs:w-auto bg-[#ffc107] text-[#1e2a3b] px-8 py-3.5 rounded-lg text-sm sm:text-[16px] font-bold hover:bg-[#e0a800] transition-colors disabled:opacity-50 min-w-[140px]"
                                        >
                                            Rent Now
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                                        <h2 className="text-xl sm:text-[28px] font-bold text-[#1e2a3b]">Checkout</h2>
                                        <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-[#ffc107] text-xs sm:text-sm font-bold transition-colors">
                                            Back
                                        </button>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8 flex-grow">
                                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] sm:text-[12px] font-bold text-[#1e2a3b]/60 uppercase tracking-wider">From Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full bg-[#f1f5f9] border border-gray-200 rounded-xl p-3 sm:p-4 text-[13px] sm:text-[15px] font-semibold text-[#1e2a3b] outline-none focus:border-[#ffc107] transition-colors" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] sm:text-[12px] font-bold text-[#1e2a3b]/60 uppercase tracking-wider">To Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full bg-[#f1f5f9] border border-gray-200 rounded-xl p-3 sm:p-4 text-[13px] sm:text-[15px] font-semibold text-[#1e2a3b] outline-none focus:border-[#ffc107] transition-colors" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            <label className="text-[10px] sm:text-[12px] font-bold text-[#1e2a3b]/60 uppercase tracking-wider">Payment Method</label>
                                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                                <button 
                                                    onClick={() => setPaymentMethod('cash')}
                                                    className={`w-full py-2.5 sm:py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all ${paymentMethod === 'cash' ? 'border-[#ffc107] bg-[#ffc107]/5 text-[#1e2a3b]' : 'border-gray-100 text-gray-400 bg-gray-50/50 hover:border-gray-200'}`}
                                                >
                                                    Cash
                                                </button>
                                                <button 
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`w-full py-2.5 sm:py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all ${paymentMethod === 'card' ? 'border-[#ffc107] bg-[#ffc107]/5 text-[#1e2a3b]' : 'border-gray-100 text-gray-400 bg-gray-50/50 hover:border-gray-200'}`}
                                                >
                                                    Card
                                                </button>
                                            </div>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-[#1e2a3b] rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 text-white space-y-4 sm:space-y-6 shadow-xl"
                                            >
                                                <div className="space-y-2">
                                                    <label className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Card Number</label>
                                                    <div className="bg-white/10 border border-white/10 p-3 sm:p-4 rounded-xl text-sm sm:text-lg font-mono tracking-[2px] sm:tracking-[4px]">{cardData.number}</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expiry</label>
                                                        <div className="bg-white/10 border border-white/10 p-3 sm:p-4 rounded-xl text-xs sm:text-base font-semibold">{cardData.expiry}</div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">CVV</label>
                                                        <div className="bg-white/10 border border-white/10 p-3 sm:p-4 rounded-xl text-xs sm:text-base font-semibold">{cardData.cvv}</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="pt-4 sm:pt-6 border-t border-gray-100 space-y-2 sm:space-y-3">
                                            <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-gray-500">
                                                <span>Rental Amount</span>
                                                <span>LKR {parseFloat(vehicle.price).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-lg sm:text-[24px] font-bold text-[#1e2a3b]">
                                                <span>Total Price</span>
                                                <span className="text-[#ffc107]">LKR {(parseFloat(vehicle.price) * 1.1).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={confirmBooking}
                                        disabled={isProcessing}
                                        className="w-full bg-[#ffc107] text-[#1e2a3b] py-4 sm:py-5 rounded-2xl font-bold mt-6 sm:mt-10 hover:bg-[#e0a800] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-[#ffc107]/20 text-sm sm:text-base"
                                    >
                                        {isProcessing ? (
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-[#1e2a3b]/30 border-t-[#1e2a3b] rounded-full animate-spin"></div>
                                        ) : (
                                            "Confirm & Pay"
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;
