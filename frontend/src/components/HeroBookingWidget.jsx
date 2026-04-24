import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plane, Calendar, Info, ArrowRight, Car, CarFront, Bus, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs = ['AIRPORT PICK UP', 'AIRPORT DROP', 'RIDE NOW', 'TOURS', 'RENTALS'];

const vehicles = [
    { id: 'budget', name: 'Budget', Icon: Car, model: 'Suzuki Alto', price: '0.00', passengers: 3, baggage: 'Limited baggage' },
    { id: 'city', name: 'City', Icon: CarFront, model: 'Honda Fit', price: '0.00', passengers: 4, baggage: '2 bags' },
    { id: 'semi', name: 'Semi', Icon: Car, model: 'Toyota Prius', price: '0.00', passengers: 4, baggage: '3 bags' },
    { id: 'car', name: 'Car', Icon: CarFront, model: 'Toyota Axio', price: '0.00', passengers: 4, baggage: '3 bags' },
    { id: '9seater', name: '9 Seater', Icon: Bus, model: 'Toyota KDH', price: '0.00', passengers: 9, baggage: '6 bags' },
    { id: '14seater', name: '14 Seater', Icon: Truck, model: 'Nissan Caravan', price: '0.00', passengers: 14, baggage: '8 bags' },
];

const HeroBookingWidget = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('AIRPORT PICK UP');
    const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

    return (
        <div className="w-full max-w-[950px] mx-auto mt-8">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3 px-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 text-[13px] font-bold rounded-md transition-colors ${
                            activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'bg-[#2a3b50]/80 text-white hover:bg-[#2a3b50] backdrop-blur-sm'
                        }`}
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Widget Body */}
            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-5">
                
                {/* Vehicle Selection & Details Bordered Box */}
                <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-5 mb-5 flex flex-col lg:flex-row gap-6">
                    {/* Left: Vehicle Selection */}
                    <div className="flex-1">
                        <label className="block text-gray-900 text-sm font-bold mb-3">Select a vehicle</label>
                        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                            {vehicles.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => navigate('/vehicles')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all aspect-square sm:w-[72px] sm:h-[72px] ${
                                        selectedVehicle.id === v.id
                                            ? 'bg-[#ffc107] text-gray-900 shadow-md border border-[#ffc107]'
                                            : 'bg-gray-50/80 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-[12px] font-bold mb-1 leading-none">{v.name}</span>
                                    <div className={`${selectedVehicle.id === v.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                       <v.Icon className="w-6 h-6" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Vehicle Details */}
                    <div className="w-full lg:w-[380px] lg:border-l border-gray-200 lg:pl-6 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <h3 className="font-bold text-gray-900 text-[15px]">{selectedVehicle.model}</h3>
                                <button onClick={() => navigate('/vehicles')} className="text-blue-600 text-sm font-semibold ml-2 hover:underline">View</button>
                            </div>
                            <div className="bg-gray-100 rounded-md px-2.5 py-1 flex items-center shadow-sm border border-gray-200">
                                <span className="text-[13px] font-bold text-gray-900 mr-1.5">Est. LKR {selectedVehicle.price}</span>
                                <Info className="w-3.5 h-3.5 text-gray-900 fill-gray-900" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px] text-gray-800 font-medium">
                            <div className="flex items-center space-x-2">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M32 96v256h448V96H32zm160.5 224h-80.4c0-26.6-21.5-48.1-48.1-48.1V192c35.3 0 64-28.7 64-64h64.5c-19.9 23.5-32.5 57.8-32.5 96s12.6 72.5 32.5 96zM448 271.9c-26 0-48 21.5-48 48.1h-80.5c19.9-23.5 32.5-57.8 32.5-96s-12.6-72.5-32.5-96H384c0 35.3 28.7 64 64 64v79.9zM32 384h448v32H32z"></path></svg>
                                <span>Flexible Payment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M7.59 5.41c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83-.79.79-2.05.79-2.83 0zM6 16V7H4v9c0 2.76 2.24 5 5 5h6v-2H9c-1.66 0-3-1.34-3-3zm14 4.07L14.93 15H11.5v-3.68c1.4 1.15 3.6 2.16 5.5 2.16v-2.16c-1.66.02-3.61-.87-4.67-2.04l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C8.01 7 7 8.01 7 9.25V15c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07z"></path></svg>
                                <span>{selectedVehicle.passengers} passengers</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg>
                                <span>Air Conditioned</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9.5 18H8V9h1.5v9zm3.25 0h-1.5V9h1.5v9zm.75-12h-3V3.5h3V6zM16 18h-1.5V9H16v9z"></path></svg>
                                <span>{selectedVehicle.baggage}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location & Time Inputs */}
                <div className="flex flex-col lg:flex-row items-center gap-3">
                    
                    {/* Pick Location */}
                    <div className="flex-1 relative w-full border-2 border-gray-200 rounded-full bg-white flex items-center px-4 hover:border-gray-300 transition-colors">
                        <div className="w-full flex items-center py-2.5">
                            <input
                                type="text"
                                className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                                placeholder={activeTab === 'AIRPORT DROP' ? 'Pick Location' : 'BIA Arrival Terminal, Katunayake, Sri Lanka'}
                                defaultValue={activeTab === 'AIRPORT DROP' ? '' : 'BIA Arrival Terminal, Katunayake, Sri Lanka'}
                                disabled={activeTab === 'AIRPORT PICK UP'}
                            />
                        </div>
                        {activeTab === 'AIRPORT DROP' ? <MapPin className="h-5 w-5 text-gray-500 shrink-0 ml-2" /> : <Plane className="h-5 w-5 text-gray-500 shrink-0 ml-2" />}
                    </div>

                    <ArrowRight className="hidden lg:block w-5 h-5 text-gray-400 shrink-0 mx-[-4px] z-10" />

                    {/* Drop Location */}
                    <div className="flex-1 relative w-full border-2 border-gray-200 rounded-full bg-white flex items-center px-4 hover:border-gray-300 transition-colors">
                        <div className="w-full flex items-center py-2.5">
                            <input
                                type="text"
                                className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                                placeholder={activeTab === 'AIRPORT DROP' ? 'BIA Departure Terminal, Katunayake, Sri Lanka' : 'Drop Location'}
                                defaultValue={activeTab === 'AIRPORT DROP' ? 'BIA Departure Terminal, Katunayake, Sri Lanka' : ''}
                                disabled={activeTab === 'AIRPORT DROP'}
                            />
                        </div>
                        {activeTab === 'AIRPORT DROP' ? <Plane className="h-5 w-5 text-gray-500 shrink-0 ml-2" /> : <MapPin className="h-5 w-5 text-gray-500 shrink-0 ml-2" />}
                    </div>

                    {/* Date Time */}
                    <div className="relative w-full lg:w-[260px] border-2 border-gray-200 rounded-full bg-white flex items-center px-4 hover:border-gray-300 transition-colors">
                        <div className="w-full flex items-center py-2.5">
                            <input
                                type="text"
                                className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                                placeholder="04/25/2026 00:15"
                                defaultValue="04/25/2026 00:15"
                            />
                        </div>
                        <Calendar className="h-5 w-5 text-gray-500 shrink-0 ml-2" />
                    </div>

                    {/* Book Now Button */}
                    <button 
                        onClick={() => navigate('/vehicles')}
                        className="bg-[#1e2a3b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2c3e50] transition-colors w-full lg:w-auto shadow-md shrink-0 text-[15px]"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroBookingWidget;
