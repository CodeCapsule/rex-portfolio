import React from 'react';
import {
    LayoutDashboard,
    Briefcase,
    Megaphone,
    Code2,
    Settings,
    LogOut,
    Sun,
    Moon,
    Image as ImageIcon,
    MessageSquare,
    X,
    ExternalLink,
    UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    onLogout: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleTheme,
    onLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}) => {
    const NavItems = () => (
        <nav className="space-y-2">
            <a
                href="/"
                className="w-full flex items-center justify-between gap-3 px-4 py-3 mb-4 rounded-xl font-bold text-sm bg-accent text-black hover:opacity-90 transition-all shadow-lg shadow-accent/20"
            >
                <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    View Landing Site
                </div>
                <ExternalLink size={14} />
            </a>
            <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <LayoutDashboard size={18} />
                Dashboard
            </button>
            <button
                onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'projects' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Briefcase size={18} />
                Projects
            </button>

            <button
                onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'services' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Megaphone size={18} />
                Services
            </button>

            <button
                onClick={() => { setActiveTab('skills'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'skills' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Code2 size={18} />
                Skills
            </button>
            <button
                onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <ImageIcon size={18} />
                Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm transition-all">
                <MessageSquare size={18} />
                Messages
            </button>
            <button
                onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-accent/10 text-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Settings size={18} />
                Settings
            </button>
        </nav>
    );

    return (
        <>
            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-white dark:bg-[#111] border-r border-gray-100 dark:border-gray-800 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-black font-bold">R</div>
                        <span className="font-bold text-xl tracking-tight">AdminPanel</span>
                    </div>
                    <NavItems />
                </div>

                <div className="mt-auto p-8 space-y-4">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm transition-all"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold text-sm transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#111] z-[70] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-black font-bold">R</div>
                                        <span className="font-bold text-xl tracking-tight">AdminPanel</span>
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                                        <X size={24} />
                                    </button>
                                </div>
                                <NavItems />
                            </div>
                            <div className="mt-auto p-6 space-y-4">
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm transition-all"
                                >
                                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold text-sm transition-all"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
