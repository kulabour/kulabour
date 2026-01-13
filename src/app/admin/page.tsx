'use client';

import {
    Users,
    Activity,
    AlertCircle,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    LucideIcon
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const data = [
    { name: 'Mon', revenue: 4000, jobs: 24 },
    { name: 'Tue', revenue: 3000, jobs: 18 },
    { name: 'Wed', revenue: 2000, jobs: 12 },
    { name: 'Thu', revenue: 2780, jobs: 20 },
    { name: 'Fri', revenue: 1890, jobs: 15 },
    { name: 'Sat', revenue: 6390, jobs: 45 },
    { name: 'Sun', revenue: 3490, jobs: 32 },
];

const jobsData = [
    { name: 'Done', value: 400, color: '#10b981' },
    { name: 'Active', value: 300, color: '#3b82f6' },
    { name: 'Pending', value: 100, color: '#f59e0b' },
];

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: LucideIcon;
    colorClass: { text: string; bg: string };
}

import RecentActivityTable from '@/components/admin/RecentActivityTable';

// ... existing code ...

const StatCard = ({ title, value, change, isPositive, icon: Icon, colorClass }: StatCardProps) => (
    <div className="glass-card p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.text}`}>
            <Icon size={48} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-slate-800 ${colorClass.text}`}>
                    <Icon size={20} />
                </div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
            </div>
            <div className="flex items-end gap-3 mt-2">
                <h3 className="text-2xl font-bold text-white">{value}</h3>
                <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </span>
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-slate-400 text-sm mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors">
                        <Calendar size={16} />
                        <span>Last 7 Days</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/25">
                        <DollarSign size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹1,24,500"
                    change="+12.5%"
                    isPositive={true}
                    icon={DollarSign}
                    colorClass={{ text: 'text-emerald-400', bg: 'bg-emerald-500/10' }}
                />
                <StatCard
                    title="Active Workers"
                    value="1,248"
                    change="+2.4%"
                    isPositive={true}
                    icon={Users}
                    colorClass={{ text: 'text-blue-400', bg: 'bg-blue-500/10' }}
                />
                <StatCard
                    title="New Bookings"
                    value="356"
                    change="+18%"
                    isPositive={true}
                    icon={Activity}
                    colorClass={{ text: 'text-purple-400', bg: 'bg-purple-500/10' }}
                />
                <StatCard
                    title="Pending Disputes"
                    value="12"
                    change="-2"
                    isPositive={false}
                    icon={AlertCircle}
                    colorClass={{ text: 'text-amber-400', bg: 'bg-amber-500/10' }}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-white">Revenue Trend</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Revenue
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
                                <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Distribution */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg text-white mb-6">Job Status</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={jobsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {jobsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">800</p>
                                <p className="text-xs text-slate-400">Total Jobs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table Component */}
            <RecentActivityTable />
        </div>
    );
}
