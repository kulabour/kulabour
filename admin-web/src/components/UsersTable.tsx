import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Search,
    Filter,
    MoreVertical,
    Shield,
    User,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Loader
} from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'Worker', service: 'Plumber', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', role: 'Customer', service: '-', status: 'Active', joined: '2024-01-20' },
    { id: 3, name: 'Amit Kumar', email: 'amit.k@example.com', role: 'Worker', service: 'Electrician', status: 'Pending', joined: '2024-02-01' },
    { id: 4, name: 'Sneha Gupta', email: 'sneha.g@example.com', role: 'Customer', service: '-', status: 'Inactive', joined: '2024-02-10' },
    { id: 5, name: 'Vikram Singh', email: 'vikram.s@example.com', role: 'Worker', service: 'Carpenter', status: 'Active', joined: '2024-02-15' },
];

export default function UsersTable() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                if (Array.isArray(response.data)) {
                    const mappedUsers = response.data.map((u: any) => ({
                        id: u._id || u.id,
                        name: u.name || 'Unknown',
                        email: u.email || 'No Email',
                        role: u.userType ? u.userType.charAt(0).toUpperCase() + u.userType.slice(1) : 'Customer',
                        service: u.profile?.service || '-',
                        status: u.isVerified ? 'Active' : 'Pending',
                        joined: new Date(u.createdAt || Date.now()).toLocaleDateString()
                    }));
                    setUsers(mappedUsers);
                } else {
                    setUsers(MOCK_USERS);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setUsers(MOCK_USERS);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 items-center justify-center p-12">
                <Loader className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-gray-500">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Header Controls */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Users Management</h2>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="All">All Roles</option>
                            <option value="Worker">Workers</option>
                            <option value="Customer">Customers</option>
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
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Service</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'Worker'
                                        ? 'bg-orange-50 text-orange-700 border-orange-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {user.role === 'Worker' ? <Shield size={12} /> : <User size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium text-sm">
                                    {user.service}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' :
                                        user.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'
                                        }`}>
                                        {user.status === 'Active' ? <CheckCircle size={12} /> : user.status === 'Inactive' ? <XCircle size={12} /> : null}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {user.joined}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">Showing {filteredUsers.length} users</span>
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
