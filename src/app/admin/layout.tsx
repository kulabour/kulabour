import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    MessageSquare,
    LogOut,
    Menu
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-[#0f172a] text-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#020617] border-r border-slate-800 hidden md:flex flex-col relative z-20">
                <div className="p-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center glow-primary">
                            <span className="font-bold text-white">K</span>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            KULABOUR
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="px-3 mb-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overview</p>
                    </div>

                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg font-medium transition-all">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <div className="px-3 mt-6 mb-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</p>
                    </div>

                    <Link href="/admin/workers" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-all group">
                        <Users size={18} className="group-hover:text-blue-400 transition-colors" />
                        Workers
                    </Link>
                    <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-all group">
                        <Briefcase size={18} className="group-hover:text-emerald-400 transition-colors" />
                        Jobs
                    </Link>
                    <Link href="/admin/disputes" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-all group">
                        <MessageSquare size={18} className="group-hover:text-amber-400 transition-colors" />
                        Disputes
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg w-full transition-all">
                        <LogOut size={18} />
                        Logout
                    </button>

                    <div className="mt-4 flex items-center gap-3 px-3 py-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-slate-950">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-slate-500">Ops Manager</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between md:hidden sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="font-bold text-white">K</span>
                        </div>
                        <h1 className="font-bold text-white">Admin</h1>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

