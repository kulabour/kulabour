import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Settings, LogOut, Bell, Search, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatDrawer from '../components/ChatDrawer';

const DashboardLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
            {/* Sidebar - Glass Effect */}
            <aside className="w-72 bg-slate-900 text-white m-4 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>

                <div className="relative z-10 p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold">K</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">KULABOUR</h1>
                            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Enterprise</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { path: '/', icon: LayoutDashboard, label: 'Overview' },
                            { path: '/bookings', icon: Calendar, label: 'Bookings' },
                            { path: '/users', icon: Users, label: 'User Management' },
                            { path: '/live-map', icon: Map, label: 'Live Operations' },
                            { path: '/settings', icon: Settings, label: 'System Settings' },
                        ].map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive(item.path)
                                    ? 'bg-blue-600/20 text-white shadow-lg backdrop-blur-sm border border-blue-500/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} />
                                <span className="font-medium tracking-wide">{item.label}</span>
                                {isActive(item.path) && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="relative z-10 mt-auto p-6 border-t border-white/10 mx-4 mb-2">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                <header className="sticky top-0 z-20 pt-6 px-8 pb-4 flex justify-between items-center bg-[#F3F4F6]/80 backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {location.pathname === '/' ? 'Dashboard Overview' : location.pathname.replace('/', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-white pl-10 pr-4 py-2.5 rounded-xl border-none shadow-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                        <button className="relative p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-blue-600">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-800">Anil Jadav</p>
                                <p className="text-xs text-slate-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl shadow-md border-2 border-white"></div>
                        </div>
                    </div>
                </header>

                <div className="px-8 pb-8">
                    <Outlet />
                </div>
            </main>
            <ChatDrawer />
        </div>
    );
};

export default DashboardLayout;
