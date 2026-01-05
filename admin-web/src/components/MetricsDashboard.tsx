import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';

interface Metrics {
    totalBookings: number;
    totalRevenue: number;
    activeUsers: number;
    workerUtilization: number;
    bookingsByDay: Array<{ date: string; count: number }>;
    revenueByCategory: Array<{ category: string; revenue: number }>;
    userGrowth: Array<{ month: string; users: number }>;
}

const COLORS = ['#0078D4', '#FF6B35', '#10B981', '#F59E0B', '#8B5CF6'];

export function MetricsDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await fetch('/api/dashboard/metrics');
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !metrics) {
        return <div className="p-8 text-center">Loading metrics...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics.totalBookings.toLocaleString()}
                    </p>
                </Card>

                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        ₹{(metrics.totalRevenue / 100000).toFixed(1)}L
                    </p>
                </Card>

                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics.activeUsers.toLocaleString()}
                    </p>
                </Card>

                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600">Worker Utilization</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics.workerUtilization}%
                    </p>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bookings Trend */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Bookings Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics.bookingsByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#0078D4" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Revenue by Category */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={metrics.revenueByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry: any) => entry.category}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="revenue"
                            >
                                {metrics.revenueByCategory.map((_: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* User Growth */}
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="users" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
