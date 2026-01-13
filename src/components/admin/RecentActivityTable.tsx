'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Transaction {
    id: string;
    service: string;
    customer: string;
    worker: string;
    status: 'completed' | 'pending' | 'cancelled' | 'active';
    amount: number;
    date: string;
}

const allTransactions: Transaction[] = [
    { id: 'JOB-8291', service: 'Plumbing Service', customer: 'Rahul M.', worker: 'Suresh K.', status: 'completed', amount: 450, date: '2 min ago' },
    { id: 'JOB-8292', service: 'Home Cleaning', customer: 'Priya S.', worker: 'Anita R.', status: 'active', amount: 1200, date: '15 min ago' },
    { id: 'JOB-8293', service: 'AC Repair', customer: 'Amit B.', worker: 'Rajesh P.', status: 'pending', amount: 850, date: '1 hour ago' },
    { id: 'JOB-8294', service: 'Electrician', customer: 'Sneha G.', worker: 'Vikram S.', status: 'completed', amount: 350, date: '2 hours ago' },
    { id: 'JOB-8295', service: 'Carpentry', customer: 'Mohit D.', worker: 'Arun K.', status: 'cancelled', amount: 0, date: '3 hours ago' },
];

const FILTERS = ['all', 'completed', 'pending', 'active', 'cancelled'] as const;

export default function RecentActivityTable() {
    const [filter, setFilter] = useState<string>('all');

    const handleFilterClick = () => {
        const currentIndex = FILTERS.indexOf(filter as typeof FILTERS[number]);
        const nextIndex = (currentIndex + 1) % FILTERS.length;
        setFilter(FILTERS[nextIndex]);
    };

    const recentTransactions = allTransactions.filter(tx =>
        filter === 'all' ? true : tx.status === filter
    );

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-lg text-white">Real-time Operations</h3>
                    <p className="text-sm text-slate-500">
                        {filter === 'all' ? 'Live feed of global activity' : `Showing ${filter} transactions`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search IDs..."
                            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleFilterClick}
                        className={clsx(
                            "p-2 rounded-lg border transition-colors",
                            filter === 'all'
                                ? "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/50 hover:bg-blue-500/20"
                        )}
                    >
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Job ID</th>
                            <th className="px-6 py-4">Service Type</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Worker</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {recentTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                                    {tx.id}
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <div className={twMerge(
                                            "w-2 h-2 rounded-full",
                                            tx.status === 'completed' && "bg-emerald-400",
                                            tx.status === 'active' && "bg-blue-400 animate-pulse",
                                            tx.status === 'pending' && "bg-amber-400",
                                            tx.status === 'cancelled' && "bg-rose-400"
                                        )} />
                                        {tx.service}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">{tx.date}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-medium text-slate-300">
                                            {tx.customer.charAt(0)}
                                        </div>
                                        {tx.customer}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-400">
                                            {tx.worker.charAt(0)}
                                        </div>
                                        {tx.worker}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={tx.status} />
                                </td>
                                <td className="px-6 py-4 text-slate-300 text-right font-mono">
                                    {tx.amount > 0 ? `₹${tx.amount}` : '-'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div>Showing 5 of 128 transactions</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors disabled:opacity-50">Prev</button>
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
    const styles = {
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    const icons = {
        completed: CheckCircle,
        active: Activity,
        pending: Clock,
        cancelled: AlertCircle
    };

    const Icon = icons[status] || Activity;

    return (
        <span className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            styles[status]
        )}>
            <Icon size={12} />
            <span className="capitalize">{status}</span>
        </span>
    );
}
