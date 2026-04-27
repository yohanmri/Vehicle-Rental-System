import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/user-context/AuthContext';
import Loader from '../../components/user-components/Loader';
import { toast } from 'react-hot-toast';
import { Star, ArrowLeft, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import carDefault from '../../assets/user-assets/images/vehicle/Car.png';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function buildBookedSet(ranges) {
    const set = new Set();
    ranges.forEach(({ startDate, endDate }) => {
        const s = new Date(startDate); s.setHours(0,0,0,0);
        const e = new Date(endDate);   e.setHours(0,0,0,0);
        for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            set.add(toDateStr(new Date(d)));
        }
    });
    return set;
}

function getImageUrl(img, baseURL) {
    if (!img) return carDefault;
    if (img.includes('http') || img.startsWith('data:') || img.startsWith('blob:') || img.includes('/assets/')) return img;
    return `${baseURL.replace('/api', '')}/${img}`;
}

const VehicleDetail = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookedRanges, setBookedRanges] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activeImage, setActiveImage] = useState('');

    const now = new Date();
    const [calMonth, setCalMonth] = useState(now.getMonth());
    const [calYear, setCalYear] = useState(now.getFullYear());

    const baseURL = axios.defaults.baseURL || '';

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/api/vehicles/${id}`);
                setVehicle(data);
                setActiveImage(getImageUrl(data.image, baseURL));
            } catch { toast.error('Vehicle not found'); }
            finally { setLoading(false); }
        })();
        (async () => {
            try {
                const { data } = await axios.get(`/api/bookings/booked-dates/${id}`);
                setBookedRanges(data);
            } catch {}
        })();
    }, [id]);

    const bookedSet = buildBookedSet(bookedRanges);
    const todayStr = toDateStr(new Date());

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
        else setCalMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
        else setCalMonth(m => m + 1);
    };

    const handleDayClick = (dateStr) => {
        if (!user) return; // guarded by UI message
        if (dateStr < todayStr) return;
        if (bookedSet.has(dateStr)) return;

        if (!startDate || (startDate && endDate)) {
            // Start fresh
            setStartDate(dateStr);
            setEndDate(null);
            return;
        }
        // startDate set, no endDate yet
        if (dateStr <= startDate) {
            // clicked same or earlier — restart
            setStartDate(dateStr);
            setEndDate(null);
            return;
        }
        // Check if any booked date lies between startDate and dateStr
        const s = new Date(startDate);
        const e = new Date(dateStr);
        let blocked = false;
        for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            const ds = toDateStr(new Date(d));
            if (bookedSet.has(ds)) { blocked = true; break; }
        }
        if (blocked) {
            toast.error('Range includes unavailable dates. Please pick a different end date.');
            return;
        }
        setEndDate(dateStr);
    };

    const nights = (startDate && endDate)
        ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000)
        : 0;

    const handleRentNow = () => {
        if (!user) { toast.error('Please login to rent a vehicle'); navigate('/login'); return; }
        if (!startDate || !endDate) { toast.error('Please select your rental dates on the calendar'); return; }
        setShowCheckout(true);
    };

    const confirmBooking = async () => {
        setIsProcessing(true);
        try {
            const total = parseFloat(vehicle.price) * nights;
            await axios.post('/api/bookings', { vehicleId: id, startDate, endDate, totalPrice: total, paymentMethod },
                { headers: { Authorization: `Bearer ${token}` } });
            toast.success(paymentMethod === 'card' ? 'Booking Confirmed! Card payment at pickup.' : 'Booking Confirmed! Pay cash on arrival.');
            setShowCheckout(false);
            navigate('/my-bookings');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally { setIsProcessing(false); }
    };

    if (loading) return <div className="min-h-screen pt-24"><Loader /></div>;
    if (!vehicle) return null;

    const mainImageUrl = getImageUrl(vehicle.image, baseURL);
    const galleryImages = [mainImageUrl];
    (vehicle.additionalImages || []).forEach(img => {
        if (img) galleryImages.push(getImageUrl(img, baseURL));
    });

    // Build calendar grid
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const calCells = [];
    for (let i = 0; i < firstDay; i++) calCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

    const getDayStyle = (dateStr) => {
        const isPast = dateStr < todayStr;
        const isBooked = bookedSet.has(dateStr);
        const isStart = dateStr === startDate;
        const isEnd = dateStr === endDate;
        const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;

        if (isPast) return { color: '#cbd5e1', cursor: 'not-allowed', fontSize: '12px', padding: '6px 0' };
        if (isBooked) return { background: '#fee2e2', color: '#ef4444', borderRadius: '6px', cursor: 'not-allowed', fontSize: '12px', padding: '6px 0', textDecoration: 'line-through' };
        if (isStart) return { background: '#1e2a3b', color: '#fff', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', padding: '6px 0' };
        if (isEnd) return { background: '#ffc107', color: '#1e2a3b', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', padding: '6px 0' };
        if (inRange) return { background: '#ffc10730', color: '#1e2a3b', cursor: 'pointer', fontSize: '12px', padding: '6px 0' };
        return { cursor: 'pointer', fontSize: '12px', padding: '6px 0', borderRadius: '6px' };
    };

    const pricePerDay = parseFloat(vehicle.price);
    const totalPrice = nights > 0 ? pricePerDay * nights : pricePerDay;

    return (
        <div className="min-h-screen bg-[#e1e7f0] pt-16 pb-12 sm:pt-20 sm:pb-24">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 flex flex-col lg:flex-row gap-6 sm:gap-8">

                {/* ── Left Sidebar: Vehicle Specs + Reviews ── */}
                <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm p-6 self-start hidden lg:block border border-gray-100">

                    {/* Reviews */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Reviews</span>
                        <div className="flex items-center gap-2 mb-2">
                            {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />)}
                            <Star className="w-4 h-4 text-gray-300" />
                        </div>
                        <p className="text-[14px] font-semibold text-gray-700">440+ Reviewer</p>
                        <p className="text-[13px] text-gray-400 mt-1">Highly rated by customers for comfort &amp; reliability.</p>
                    </div>

                    {/* Specs */}
                    <div className="mb-8">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4 block">Specifications</span>
                        <div className="space-y-3">
                            {[
                                { label: 'Type',     value: vehicle.type || '—' },
                                { label: 'Capacity', value: `${vehicle.capacity || '—'} Person` },
                                { label: 'Steering', value: vehicle.steering || 'Manual' },
                                { label: 'Fuel',     value: vehicle.fuel ? `${vehicle.fuel}L` : '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-gray-400 text-[14px]">{label}</span>
                                    <span className="text-gray-700 font-semibold text-[14px]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">Price</span>
                        <div className="text-[22px] font-bold text-[#1e2a3b] leading-none">
                            LKR {pricePerDay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[13px] text-gray-400 mt-1">per day</div>
                        {vehicle.originalPrice && vehicle.originalPrice !== vehicle.price && (
                            <div className="text-[13px] text-gray-400 line-through mt-1">
                                LKR {parseFloat(vehicle.originalPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                        )}
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <div className="flex-1">

                    {/* Top: Single merged container — name + description + availability */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-4 h-4 rounded-full border-4 border-[#ffc107]/30 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></div>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">{vehicle.name}</span>
                                    <div className="flex items-center gap-1 ml-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${vehicle.available !== false ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <span className={`text-xs font-semibold ${vehicle.available !== false ? 'text-green-600' : 'text-red-500'}`}>
                                            {vehicle.available !== false ? 'Available' : 'Not Available'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {vehicle.description || 'A premium vehicle available for rental. Experience comfort, style, and reliability on every journey with Zameer Cabs.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grid: Images left, Details/Calendar right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Images */}
                        <div className="flex flex-col gap-4 sm:gap-6">
                            <div className="bg-white rounded-[10px] sm:rounded-[20px] p-1 sm:p-1.5 border border-gray-100 overflow-hidden w-full flex items-center justify-center">
                                <img src={activeImage || mainImageUrl} alt={vehicle.name}
                                    className="w-full h-auto object-cover drop-shadow-xl transform hover:scale-105 transition-transform duration-500 rounded-[8px] sm:rounded-[16px]" />
                            </div>
                            {galleryImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-3 sm:gap-5">
                                    {galleryImages.map((img, i) => (
                                        <div key={i} onClick={() => setActiveImage(img)}
                                            className={`rounded-[10px] aspect-[4/3] p-1 flex items-center justify-center border overflow-hidden cursor-pointer transition-all ${activeImage === img ? 'bg-[#ffc107]/10 border-[#ffc107]' : 'bg-white border-gray-200 hover:border-[#ffc107]'}`}>
                                            <img src={img} alt={`Thumb ${i+1}`} className="w-full h-full object-cover rounded-[6px]" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details / Calendar / Checkout */}
                        <div className="bg-white rounded-[10px] p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col">
                            {!showCheckout ? (
                                <motion.div initial={{ opacity: 1 }} className="flex flex-col h-full justify-between gap-4">
                                    <div>
                                        {/* Vehicle name + availability */}
                                        <div className="flex justify-between items-start mb-3">
                                            <h1 className="text-2xl sm:text-[30px] font-bold text-gray-900 leading-tight">{vehicle.name}</h1>
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <div className={`w-3 h-3 rounded-full ${vehicle.available !== false ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                                <span className={`text-xs font-semibold ${vehicle.available !== false ? 'text-green-600' : 'text-red-500'}`}>
                                                    {vehicle.available !== false ? 'Available' : 'Not Available'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <div className="flex items-center gap-2 mb-4">
                                            {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />)}
                                            <Star className="w-4 h-4 text-gray-300" />
                                            <span className="text-gray-500 text-sm">440+ Reviewer</span>
                                        </div>

                                        {/* Spec grid */}
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5">
                                            {[
                                                ['Type', vehicle.type || '—'],
                                                ['Capacity', `${vehicle.capacity || '—'} Person`],
                                                ['Steering', vehicle.steering || 'Manual'],
                                                ['Fuel', vehicle.fuel ? `${vehicle.fuel}L` : '—'],
                                            ].map(([k,v]) => (
                                                <div key={k} className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                                                    <span className="text-gray-400 text-[14px]">{k}</span>
                                                    <span className="font-semibold text-gray-700 text-[14px]">{v}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Section */}
                                        <div className="bg-[#f8fafc] rounded-xl p-3 border border-gray-100">
                                            {/* Login notice if not logged in */}
                                            {!user && (
                                                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                                                    <LogIn className="w-4 h-4 text-amber-500 shrink-0" />
                                                    <p className="text-amber-700 text-xs font-medium">
                                                        Please <button onClick={() => navigate('/login')} className="underline font-bold">login</button> to select dates and make a booking.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Month navigation */}
                                            <div className="flex items-center justify-between mb-2">
                                                <button type="button" onClick={prevMonth}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="text-sm font-bold text-gray-800">{MONTHS[calMonth]} {calYear}</span>
                                                <button type="button" onClick={nextMonth}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>

                                            {/* Day headers */}
                                            <div className="grid grid-cols-7 text-center mb-1">
                                                {DAYS.map(d => (
                                                    <div key={d} className="text-[11px] font-bold text-gray-400 py-1">{d}</div>
                                                ))}
                                            </div>

                                            {/* Day cells */}
                                            <div className="grid grid-cols-7 text-center gap-y-0.5">
                                                {calCells.map((d, i) => {
                                                    if (!d) return <div key={`e-${i}`} />;
                                                    const ds = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                                                    const isBooked = bookedSet.has(ds);
                                                    const isPast = ds < todayStr;
                                                    const style = getDayStyle(ds);
                                                    return (
                                                        <div key={ds}
                                                            title={isBooked ? 'Not Available' : isPast ? '' : 'Click to select'}
                                                            style={style}
                                                            onClick={() => !isPast && !isBooked && user && handleDayClick(ds)}
                                                            className="text-center select-none transition-all hover:opacity-80"
                                                        >
                                                            {d}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Legend */}
                                            <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-gray-200">
                                                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                    <span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block"></span> Not Available
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                    <span className="w-3 h-3 rounded bg-[#1e2a3b] inline-block"></span> Start
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                    <span className="w-3 h-3 rounded bg-[#ffc107] inline-block"></span> End
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                    <span className="w-3 h-3 rounded bg-[#ffc107]/30 inline-block"></span> In Range
                                                </span>
                                            </div>

                                            {/* Selection summary */}
                                            {startDate && (
                                                <p className="text-xs text-gray-600 mt-2 font-medium">
                                                    {startDate}
                                                    {endDate
                                                        ? ` → ${endDate} · ${nights} night${nights !== 1 ? 's' : ''}`
                                                        : ' → Select end date'}
                                                </p>
                                            )}
                                            {!startDate && user && (
                                                <p className="text-xs text-gray-400 mt-2">Click a date to start your selection</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price + Rent Now */}
                                    <div className="flex items-center justify-between gap-4 mt-2">
                                        <div>
                                            <div className="text-[24px] sm:text-[28px] font-bold text-gray-900 flex items-end leading-none">
                                                LKR {pricePerDay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                <span className="text-[14px] text-gray-400 font-medium ml-2 mb-1">/ day</span>
                                            </div>
                                            {nights > 0 && (
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    Total: <span className="font-bold text-[#1e2a3b]">LKR {(pricePerDay * nights).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={handleRentNow}
                                            className="bg-[#ffc107] text-[#1e2a3b] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e0a800] transition-colors min-w-[140px]">
                                            Rent Now
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl sm:text-[28px] font-bold text-[#1e2a3b]">Checkout</h2>
                                        <button onClick={() => setShowCheckout(false)} className="flex items-center gap-1.5 text-gray-500 hover:text-[#ffc107] text-sm font-bold">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                    </div>

                                    <div className="space-y-4 flex-grow">
                                        <div className="bg-[#f1f5f9] rounded-lg p-3 text-sm">
                                            <div className="flex justify-between text-gray-600 mb-1">
                                                <span className="font-bold">{vehicle.name}</span>
                                                <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="text-gray-400 text-xs">{startDate} → {endDate}</div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-[#1e2a3b]/60 uppercase tracking-wider">Payment Method</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['cash','card'].map(m => (
                                                    <button key={m} onClick={() => setPaymentMethod(m)}
                                                        className={`py-2 rounded-lg border-2 font-bold text-xs transition-all ${paymentMethod === m ? 'border-[#ffc107] bg-[#ffc107]/5 text-[#1e2a3b]' : 'border-gray-100 text-gray-400 bg-gray-50'}`}>
                                                        {m === 'cash' ? '💵 Cash' : '💳 Card'}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-400 text-center">
                                                {paymentMethod === 'card' ? 'Card payment collected at pickup' : 'Pay with cash on arrival'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 space-y-2">
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>LKR {pricePerDay.toLocaleString()} × {nights} nights</span>
                                                <span>LKR {(pricePerDay * nights).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-[22px] font-bold text-[#1e2a3b]">
                                                <span>Total</span>
                                                <span className="text-[#ffc107]">LKR {(pricePerDay * nights).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={confirmBooking} disabled={isProcessing}
                                        className="w-full bg-[#ffc107] text-[#1e2a3b] py-3 rounded-xl font-bold mt-6 hover:bg-[#e0a800] transition-all flex items-center justify-center gap-3 shadow-lg text-sm disabled:opacity-50">
                                        {isProcessing
                                            ? <div className="w-5 h-5 border-2 border-[#1e2a3b]/30 border-t-[#1e2a3b] rounded-full animate-spin"></div>
                                            : 'Confirm & Book'}
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
