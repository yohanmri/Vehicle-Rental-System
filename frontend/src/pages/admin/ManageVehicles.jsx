import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Loader from '../../components/Loader';
import { Plus, Edit, Trash2, X, Car, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Sedan',
        price: '',
        image: '',
        description: '',
        availability: true
    });

    const fetchVehicles = async () => {
        try {
            const { data } = await axios.get('/vehicles');
            setVehicles(data);
        } catch (error) {
            toast.error('Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentVehicle) {
                await axios.put(`/vehicles/${currentVehicle._id}`, formData);
                toast.success('Vehicle updated');
            } else {
                await axios.post('/vehicles', formData);
                toast.success('Vehicle added');
            }
            setIsModalOpen(false);
            fetchVehicles();
            resetForm();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            await axios.delete(`/vehicles/${id}`);
            toast.success('Vehicle deleted');
            fetchVehicles();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const openEditModal = (vehicle) => {
        setCurrentVehicle(vehicle);
        setFormData(vehicle);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentVehicle(null);
        setFormData({ name: '', type: 'Sedan', price: '', image: '', description: '', availability: true });
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold">Manage <span className="text-primary">Vehicles</span></h1>
                <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Vehicle</span>
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 font-bold">Vehicle</th>
                                <th className="px-6 py-4 font-bold">Type</th>
                                <th className="px-6 py-4 font-bold">Price/Day</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {vehicles.map((v) => (
                                <tr key={v._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <span className="font-bold">{v.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{v.type}</td>
                                    <td className="px-6 py-4 font-bold text-primary">${v.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${v.availability ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {v.availability ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => openEditModal(v)} className="p-2 hover:text-primary transition-colors">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(v._id)} className="p-2 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-secondary-dark border border-white/10 p-8 rounded-3xl w-full max-w-2xl shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold mb-8">
                                {currentVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Name</label>
                                        <input 
                                            required 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 outline-none focus:border-primary"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Type</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 outline-none focus:border-primary"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option value="Sedan">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Luxury">Luxury</option>
                                            <option value="Van">Van</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Price Per Day ($)</label>
                                        <input 
                                            type="number" required 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 outline-none focus:border-primary"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
                                        <input 
                                            required 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 outline-none focus:border-primary"
                                            value={formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                        <textarea 
                                            rows="4"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 outline-none focus:border-primary resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" id="avail"
                                            checked={formData.availability}
                                            onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                                        />
                                        <label htmlFor="avail" className="text-gray-400">Available for rent</label>
                                    </div>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button type="submit" className="btn-primary w-full py-3 text-lg font-bold">
                                        {currentVehicle ? 'Update Vehicle' : 'Create Vehicle'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageVehicles;
