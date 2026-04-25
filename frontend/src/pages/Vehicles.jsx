import { useState, useEffect } from 'react';
import axios from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import Loader from '../components/Loader';
import { Search, MapPin, Calendar, ArrowDownUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Import images from src/assets to ensure Vite bundles them correctly
import car1 from '../assets/images/vehicle/Car (1).png';
import car2 from '../assets/images/vehicle/Car (2).png';
import car3 from '../assets/images/vehicle/Car (3).png';
import car4 from '../assets/images/vehicle/Car (4).png';
import car5 from '../assets/images/vehicle/Car (5).png';
import carDefault from '../assets/images/vehicle/Car.png';
import bike1 from '../assets/images/vehicle/bike1.png';
import bike2 from '../assets/images/vehicle/bike2.png';
import bike3 from '../assets/images/vehicle/bike3.png';

const carImages = [car1, car2, car3, car4, car5];

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [selectedTypes, setSelectedTypes] = useState(['Bike', 'Sport', 'SUV']);
    const [selectedCapacities, setSelectedCapacities] = useState(['2 Person', '4 Person', '8 or More']);
    const [maxPrice, setMaxPrice] = useState(150);
    const [showFilters, setShowFilters] = useState(false);

    const vehicleTypes = [
        { name: 'Bike', count: 3 },
        { name: 'Sport', count: 10 },
        { name: 'SUV', count: 12 },
        { name: 'MPV', count: 16 },
        { name: 'Sedan', count: 20 },
        { name: 'Coupe', count: 14 },
        { name: 'Hatchback', count: 14 }
    ];

    const capacities = [
        { name: '2 Person', count: 10 },
        { name: '4 Person', count: 14 },
        { name: '6 Person', count: 12 },
        { name: '8 or More', count: 16 }
    ];

    useEffect(() => {
        // Bypassing backend and using hardcoded data based on the images provided
        const mockVehicles = [
            { _id: 'b1', name: 'Yamaha FZ', type: 'Bike', capacity: 2, price: '2500.00', image: bike1 },
            { _id: 'b2', name: 'Honda Hornet', type: 'Bike', capacity: 2, price: '2800.00', image: bike2 },
            { _id: 'b3', name: 'TVS Apache', type: 'Bike', capacity: 2, price: '2200.00', image: bike3 },
            { _id: '1', name: 'Koenigsegg', type: 'Sport', capacity: 2, price: '150000.00', image: car1 },
            { _id: '2', name: 'Nissan GT - R', type: 'Sport', capacity: 2, price: '80000.00', image: car2 },
            { _id: '3', name: 'Rolls-Royce', type: 'Sport', capacity: 4, price: '120000.00', image: car3 },
            { _id: '4', name: 'All New Rush', type: 'SUV', capacity: 6, price: '15000.00', image: car4 },
            { _id: '5', name: 'CR - V', type: 'SUV', capacity: 6, price: '18000.00', image: car5 },
            { _id: '6', name: 'All New Terios', type: 'SUV', capacity: 6, price: '12000.00', image: carDefault },
            { _id: '7', name: 'MG ZX Exclusice', type: 'Hatchback', capacity: 4, price: '14000.00', image: car1 },
            { _id: '8', name: 'New MG ZS', type: 'SUV', capacity: 6, price: '16000.00', image: car2 },
            { _id: '9', name: 'MG ZX Excite', type: 'Hatchback', capacity: 4, price: '13000.00', image: car3 },
        ];

        // Simulate a slight network delay for the loader
        setTimeout(() => {
            setVehicles(mockVehicles);
            setLoading(false);
        }, 500);
    }, []);

    const toggleType = (type) => {
        setSelectedTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleCapacity = (capacity) => {
        setSelectedCapacities(prev => 
            prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]
        );
    };

    // For demonstration, we're not fully filtering because backend data might lack 'Sport' etc.
    // In a real app, you'd apply the filter strictly.
    const filteredVehicles = vehicles;

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-20 pb-24">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-6 px-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-[#1e2a3b] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md text-sm"
                    >
                        <Search className="w-4 h-4" />
                        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Filters */}
                    <aside className={`w-full lg:w-64 flex-shrink-0 bg-[#f1f5f9] rounded-xl shadow-sm p-6 self-start border border-[#1e2a3b]/10 mb-6 lg:mb-0 lg:sticky lg:top-28 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    
                    {/* SEARCH - Not in screenshot but useful */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Search</span>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search here" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-[#ffc107]"
                            />
                        </div>
                    </div>

                    {/* TYPE */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Type</span>
                        <div className="space-y-3">
                            {vehicleTypes.map((type) => (
                                <label key={type.name} className="flex items-center cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedTypes.includes(type.name) ? 'bg-[#ffc107] border-[#ffc107]' : 'border-gray-300 group-hover:border-[#ffc107]'}`}>
                                        {selectedTypes.includes(type.name) && (
                                            <svg className="w-3 h-3 text-[#1e2a3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`ml-3 text-[15px] ${selectedTypes.includes(type.name) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{type.name}</span>
                                    <span className="ml-1 text-[15px] text-gray-400">({type.count})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* CAPACITY */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Capacity</span>
                        <div className="space-y-3">
                            {capacities.map((cap) => (
                                <label key={cap.name} className="flex items-center cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedCapacities.includes(cap.name) ? 'bg-[#ffc107] border-[#ffc107]' : 'border-gray-300 group-hover:border-[#ffc107]'}`}>
                                        {selectedCapacities.includes(cap.name) && (
                                            <svg className="w-3 h-3 text-[#1e2a3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`ml-3 text-[15px] ${selectedCapacities.includes(cap.name) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{cap.name}</span>
                                    <span className="ml-1 text-[15px] text-gray-400">({cap.count})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PRICE */}
                    <div>
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Price</span>
                        <input 
                            type="range" 
                            min="0" 
                            max="200" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ffc107]"
                        />
                        <div className="mt-3 text-[15px] font-semibold text-gray-700">
                            Max. LKR{maxPrice}.00
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    
                    {/* Top Pick-Up / Drop-Off Widget Area */}
                    <div className="flex flex-col xl:flex-row items-center gap-4 mb-8">
                        
                        {/* Pick-Up Box */}
                        <div className="flex-1 bg-[#f1f5f9] p-3 sm:p-3.5 rounded-xl shadow-sm border border-[#1e2a3b]/10 w-full relative">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-3.5 h-3.5 rounded-full border-4 border-[#ffc107]/30 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></div>
                                </div>
                                <span className="font-bold text-[#1e2a3b] text-base sm:text-lg">Pick - Up</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                                <div className="border-r border-gray-200 pr-2 sm:pr-4">
                                    <h4 className="font-bold text-[#1e2a3b] text-[13px] sm:text-[15px] mb-0.5 whitespace-nowrap">Locations</h4>
                                    <select className="bg-transparent text-gray-500 text-[12px] sm:text-[13px] outline-none w-full cursor-pointer truncate">
                                        <option>Select city</option>
                                    </select>
                                </div>
                                <div className="border-r border-gray-200 pr-2 sm:pr-4">
                                    <h4 className="font-bold text-[#1e2a3b] text-[13px] sm:text-[15px] mb-0.5 whitespace-nowrap">Date</h4>
                                    <select className="bg-transparent text-gray-500 text-[12px] sm:text-[13px] outline-none w-full cursor-pointer truncate">
                                        <option>Select date</option>
                                    </select>
                                </div>
                                <div className="pl-1 sm:pl-0">
                                    <h4 className="font-bold text-[#1e2a3b] text-[13px] sm:text-[15px] mb-0.5 whitespace-nowrap">Time</h4>
                                    <select className="bg-transparent text-gray-500 text-[12px] sm:text-[13px] outline-none w-full cursor-pointer truncate">
                                        <option>Select time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Swap Button */}
                        <button className="bg-[#1e2a3b] hover:bg-[#ffc107] text-white hover:text-[#1e2a3b] w-10 h-10 rounded-[4px] flex items-center justify-center shadow-lg shadow-[#1e2a3b]/20 z-10 xl:-mx-5 my-2 xl:my-0 transition-colors shrink-0 mx-auto">
                            <ArrowDownUp className="w-4 h-4" />
                        </button>

                        {/* Drop-Off Box */}
                        <div className="flex-1 bg-[#f1f5f9] p-3 sm:p-3.5 rounded-xl shadow-sm border border-[#1e2a3b]/10 w-full relative">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-3.5 h-3.5 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                </div>
                                <span className="font-bold text-[#1e2a3b] text-base sm:text-lg">Drop - Off</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                                <div className="border-r border-gray-200 pr-2 sm:pr-4">
                                    <h4 className="font-bold text-[#1e2a3b] text-[13px] sm:text-[15px] mb-0.5 whitespace-nowrap">Locations</h4>
                                    <select className="bg-transparent text-gray-500 text-[12px] sm:text-[13px] outline-none w-full cursor-pointer truncate">
                                        <option>Select city</option>
                                    </select>
                                </div>
                                <div className="border-r border-gray-200 pr-2 sm:pr-4">
                                    <h4 className="font-bold text-[#1e2a3b] text-[13px] sm:text-[15px] mb-0.5 whitespace-nowrap">Date</h4>
                                    <select className="bg-transparent text-gray-500 text-[12px] sm:text-[13px] outline-none w-full cursor-pointer truncate">
                                        <option>Select date</option>
                                    </select>
                                </div>
                                <div className="pl-1 sm:pl-0">
                                    <h4 className="font-bold text-[#1e2a3b] text-[13px] sm:text-[15px] mb-0.5 whitespace-nowrap">Time</h4>
                                    <select className="bg-transparent text-gray-500 text-[12px] sm:text-[13px] outline-none w-full cursor-pointer truncate">
                                        <option>Select time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredVehicles.map((vehicle, i) => (
                                <motion.div
                                    key={vehicle._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                    
                    {/* Show More Button */}
                    {!loading && filteredVehicles.length > 0 && (
                        <div className="mt-12 flex justify-center">
                            <button className="bg-[#1e2a3b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ffc107] hover:text-[#1e2a3b] transition-colors shadow-sm">
                                Show more car
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
        </div>
    );
};

export default Vehicles;
