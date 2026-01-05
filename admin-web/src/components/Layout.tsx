import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn'; // We'll create this utility

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Users, label: 'Users', active: false },
        { icon: Calendar, label: 'Bookings', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-800">
                    <h1 className={cn("font-bold text-xl tracking-wider", !isSidebarOpen && "hidden")}>
                        KULABOUR
                    </h1>
                    {/* Logo icon for collapsed state could go here */}
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-full flex items-center p-3 rounded-xl transition-colors",
                                item.active
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon size={22} />
                            <span className={cn("ml-3 font-medium", !isSidebarOpen && "hidden")}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button className="w-full flex items-center p-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
                        <LogOut size={22} />
                        <span className={cn("ml-3 font-medium", !isSidebarOpen && "hidden")}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={cn("flex-1 flex flex-col transition-all duration-300", isSidebarOpen ? "ml-64" : "ml-20")}>
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                            />
                        </div>

                        <button className="relative p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                AD
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Admin</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
