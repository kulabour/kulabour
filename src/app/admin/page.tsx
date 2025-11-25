export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <div className="flex gap-2">
                    <button className="btn btn-ghost border border-gray-200 bg-white">Export Report</button>
                    <button className="btn btn-primary">Add Worker</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card bg-white p-6">
                    <p className="text-sm text-gray-500 font-medium">Active Workers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
                        ↑ 12% from last week
                    </span>
                </div>
                <div className="card bg-white p-6">
                    <p className="text-sm text-gray-500 font-medium">Jobs Today</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">356</p>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
                        ↑ 8% from yesterday
                    </span>
                </div>
                <div className="card bg-white p-6">
                    <p className="text-sm text-gray-500 font-medium">Avg. Response</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">4m 12s</p>
                    <span className="text-xs text-red-600 font-medium flex items-center gap-1 mt-2">
                        ↓ 30s slower
                    </span>
                </div>
                <div className="card bg-white p-6">
                    <p className="text-sm text-gray-500 font-medium">Pending Verification</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
                    <span className="text-xs text-yellow-600 font-medium flex items-center gap-1 mt-2">
                        Action Required
                    </span>
                </div>
            </div>

            {/* Live Map Placeholder */}
            <div className="card bg-white p-6 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-4">Live Operations Map</h3>
                <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                        <p className="text-gray-400 font-medium">Interactive Map View</p>
                        <p className="text-xs text-gray-400 mt-1">Showing real-time worker locations</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="card bg-white overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg">Recent Jobs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Job ID</th>
                                <th className="px-6 py-3 font-medium">Service</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Worker</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">#JOB-8291</td>
                                <td className="px-6 py-4">Plumbing</td>
                                <td className="px-6 py-4">Rahul M.</td>
                                <td className="px-6 py-4">Suresh K.</td>
                                <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Completed</span></td>
                                <td className="px-6 py-4">₹450</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">#JOB-8292</td>
                                <td className="px-6 py-4">Electrical</td>
                                <td className="px-6 py-4">Anita S.</td>
                                <td className="px-6 py-4">Rajesh P.</td>
                                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">In Progress</span></td>
                                <td className="px-6 py-4">₹350</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">#JOB-8293</td>
                                <td className="px-6 py-4">Cleaning</td>
                                <td className="px-6 py-4">Office 202</td>
                                <td className="px-6 py-4">Meena D.</td>
                                <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Searching</span></td>
                                <td className="px-6 py-4">₹1200</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
