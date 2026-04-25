import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, Fuel, Settings2 } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
    const navigate = useNavigate();
    // Determine image source - handle both relative paths and absolute URLs
    // Using a default car image if none is provided
    let imageUrl = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1036"; // Fallback
    
    if (vehicle.image) {
        imageUrl = vehicle.image;
        // If it's already a full URL or a bundled asset, don't modify it
        if (
            imageUrl.includes('http') || 
            imageUrl.startsWith('data:') || 
            imageUrl.startsWith('blob:') ||
            imageUrl.includes('/assets/') || 
            imageUrl.startsWith('/src/assets/')
        ) {
            imageUrl = vehicle.image;
        } else if (!imageUrl.includes('/')) {
            // If it's just a filename, assume it's in the default assets folder
            imageUrl = `/assets/images/vehicle/${imageUrl}`;
        }
    }

    return (
        <div 
            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
            className="bg-[#f1f5f9] rounded-[20px] p-5 shadow-sm border border-[#1e2a3b]/10 hover:shadow-xl transition-all duration-300 flex flex-col h-full group cursor-pointer"
        >
            {/* Header: Title and Heart */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-[18px] font-bold text-gray-900 group-hover:text-[#ffc107] transition-colors line-clamp-1">
                        {vehicle.name}
                    </h3>
                    <span className="text-[13px] text-gray-400 font-medium">
                        {vehicle.type || 'Standard'}
                    </span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="text-gray-300 hover:text-red-500 transition-colors z-10"
                >
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-40 my-4 flex items-center justify-center overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={vehicle.name} 
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        // Fallback if image path is broken
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1036";
                    }}
                />
            </div>

            {/* Specifications Row */}
            <div className="flex items-center justify-between mt-auto pt-4 pb-6">
                <div className="flex items-center space-x-1.5 text-gray-400">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-medium">70L</span>
                </div>
                <div className="flex items-center space-x-1.5 text-gray-400">
                    <Settings2 className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-medium">Manual</span>
                </div>
                <div className="flex items-center space-x-1.5 text-gray-400">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-medium">{vehicle.capacity || 4} People</span>
                </div>
            </div>

            {/* Bottom: Pricing and Action */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#1e2a3b]/10 gap-2">
                <div className="flex-1 min-w-0">
                    <div className="text-[16px] xl:text-[18px] font-bold text-gray-900 flex items-end leading-none truncate">
                        LKR {parseFloat(vehicle.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<span className="text-[12px] text-gray-400 font-medium ml-1 mb-0.5">/ day</span>
                    </div>
                    <div className="text-[13px] text-gray-400 line-through mt-1 truncate">
                        LKR {(parseFloat(vehicle.price) + 2000).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                </div>
                <button 
                    className="bg-[#1e2a3b] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffc107] hover:text-[#1e2a3b] transition-colors whitespace-nowrap shrink-0"
                >
                    Rent Now
                </button>
            </div>
        </div>
    );
};

export default VehicleCard;
