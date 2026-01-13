import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Search,
    Filter,
    MoreVertical,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    PlayCircle,
    ChevronLeft,
    ChevronRight,
    Loader
} from 'lucide-react';

const MOCK_BOOKINGS = [
    { id: 'BK-1001', service: 'Plumbing Repair', customer: 'Priya Patel', worker: 'Rahul Sharma', status: 'completed', amount: 450, date: '2024-03-10' },
    { id: 'BK-1002', service: 'House Cleaning', customer: 'Sneha Gupta', worker: 'Amit Kumar', status: 'pending', amount: 800, date: '2024-03-11' },
    { id: 'BK-1003', service: 'AC Service', customer: 'John Doe', worker: 'Vikram Singh', status: 'accepted', amount: 1200, date: '2024-03-12' },
];

export default function BookingsTable() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings');
                if (Array.isArray(response.data)) {
                    const mappedBookings = response.data.map((b: any) => ({
                        id: b._id || b.id || 'Unknown',
                        service: b.serviceId || 'General Service', // Populate if available or use ID
                        customer: b.userId || 'Unknown Customer', // Ideally backend expands this
                        worker: b.providerId || 'Unassigned',
                        status: b.status || 'pending',
                        amount: b.fare || 0,
                        date: new Date(b.createdAt || Date.now()).toLocaleDateString()
                    }));
                    setBookings(mappedBookings);
                } else {
                    setBookings(MOCK_BOOKINGS);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
                setBookings(MOCK_BOOKINGS);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(booking.id).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || booking.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-50 text-green-700 border-green-100';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'accepted': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return <CheckCircle size={14} />;
            case 'pending': return <Clock size={14} />;
            case 'accepted': return <PlayCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 items-center justify-center p-12">
                <Loader className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-gray-500">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Header Controls */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Bookings Management</h2>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium">Service</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Worker</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">#{String(booking.id).slice(-6).toUpperCase()}</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-800">
                                    {booking.service}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {booking.customer}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {booking.worker}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="capitalize">{booking.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                    ₹{booking.amount}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {booking.date}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">Showing {filteredBookings.length} of {bookings.length} bookings</span>
                <div className="flex gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors" disabled>
                        <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <ChevronRight size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
