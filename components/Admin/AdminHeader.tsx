import React, { useState, useEffect } from 'react';
import {
    Menu,
    Search,
    Clock,
    Calendar as CalendarIcon,
    Bell
} from 'lucide-react';
import { Profile } from '../../types';

interface AdminHeaderProps {
    profile: Profile;
    setIsMobileMenuOpen: (open: boolean) => void;
}

const AdminClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <div className="p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl">
                <Clock size={18} className="text-accent" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Current Time</span>
                <span className="text-sm font-bold dark:text-white tabular-nums">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>
        </div>
    );
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ profile, setIsMobileMenuOpen }) => {
    const currentDate = new Date();

    return (
        <header className="h-20 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-gray-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="relative hidden sm:block w-64 md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
                <div className="hidden md:flex items-center gap-6 pr-6 border-r border-gray-100 dark:border-gray-800">
                    <AdminClock />
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                        <div className="p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl">
                            <CalendarIcon size={18} className="text-accent" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Today's Date</span>
                            <span className="text-sm font-bold dark:text-white">
                                {currentDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 relative text-gray-500">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden border-2 border-accent/20">
                    <img src={profile.image} alt="Admin" className="w-full h-full object-cover scale-[1.1]" />
                </div>
            </div>
        </header>
    );
};
