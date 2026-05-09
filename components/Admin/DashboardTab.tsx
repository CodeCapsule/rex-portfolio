import React from 'react';
import {
    Plus,
    TrendingUp,
    Eye,
    MessageSquare,
    Briefcase,
    Users,
    Clock,
    Calendar as CalendarIcon,
    Settings,
    Code2,
    Globe,
    Trash2,
    Wrench
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, Skill, SocialLink } from '../../types';

interface DashboardTabProps {
    profileName: string;
    projects: Project[];
    skills: Skill[];
    socialLinks: SocialLink[];
    onAddProject: () => void;
    recentChanges: any[];
    isMaintenanceMode: boolean;
    setIsMaintenanceModalOpen: (open: boolean) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
    profileName,
    projects,
    skills,
    socialLinks,
    onAddProject,
    recentChanges,
    isMaintenanceMode,
    setIsMaintenanceModalOpen
}) => {
    const stats = [
        { label: 'Total Views', value: '12,842', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        { label: 'New Messages', value: '24', icon: MessageSquare, color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Active Projects', value: projects.length.toString(), icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
        { label: 'Unique Visitors', value: '3,240', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
    ];

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getChangeIcon = (icon: string) => {
        switch (icon) {
            case 'project': return <Briefcase size={16} />;
            case 'profile': return <Users size={16} />;
            case 'service': return <Settings size={16} />;
            case 'skill': return <Code2 size={16} />;
            case 'social': return <Globe size={16} />;
            case 'delete': return <Trash2 size={16} />;
            default: return <Eye size={16} />;
        }
    };

    const currentTime = new Date();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Welcome back, {profileName.split(' ')[0]}!</h1>
                    <p className="text-gray-500 text-sm">Here's what's happening with your portfolio today.</p>
                </div>
                <button
                    onClick={onAddProject}
                    className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    NEW PROJECT
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                <TrendingUp size={14} />
                                +12%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Changes */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="font-bold">Recent Changes</h2>
                        <span className="text-xs text-gray-400 font-medium">{recentChanges.length} entries</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {recentChanges.length === 0 ? (
                            <div className="p-10 text-center text-gray-400 text-sm">No recent changes yet.</div>
                        ) : (
                            recentChanges.slice(0, 5).map((change) => (
                                <div key={change.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${change.color}`}>
                                            {getChangeIcon(change.icon)}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm truncate">{change.action}</h4>
                                            <p className="text-xs text-gray-500 truncate">{change.detail}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0 ml-4">{getTimeAgo(change.time)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Calendar & Quick Actions */}
                <div className="space-y-8">
                    {/* Calendar Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold">{currentTime.toLocaleDateString([], { month: 'long', year: 'numeric' })}</h2>
                            <CalendarIcon size={18} className="text-accent" />
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-[10px] font-bold uppercase text-gray-400 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {(() => {
                                const year = currentTime.getFullYear();
                                const month = currentTime.getMonth();
                                const today = currentTime.getDate();
                                const firstDay = new Date(year, month, 1).getDay();
                                const daysInMonth = new Date(year, month + 1, 0).getDate();
                                const cells: React.ReactNode[] = [];
                                for (let i = 0; i < firstDay; i++) {
                                    cells.push(<div key={`empty-${i}`} />);
                                }
                                for (let d = 1; d <= daysInMonth; d++) {
                                    const isToday = d === today;
                                    cells.push(
                                        <div
                                            key={d}
                                            className={`text-center py-1.5 rounded-lg text-xs font-bold transition-colors ${isToday
                                                ? 'bg-accent text-black shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {d}
                                        </div>
                                    );
                                }
                                return cells;
                            })()}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="font-bold mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-full p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center gap-3 hover:border-accent hover:bg-accent/5 transition-all text-left group">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                                    <Eye size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Preview Site</h4>
                                    <p className="text-xs text-gray-500">See live changes</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setIsMaintenanceModalOpen(true)}
                                className={`w-full p-4 rounded-xl border border-dashed flex items-center gap-3 transition-all text-left group ${isMaintenanceMode
                                    ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                                    : 'border-gray-200 dark:border-gray-800 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${isMaintenanceMode
                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-500'
                                    : 'bg-orange-50 dark:bg-orange-900/10 text-orange-500'
                                    }`}>
                                    <Wrench size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{isMaintenanceMode ? 'Disable Maintenance' : 'Maintenance Mode'}</h4>
                                    <p className="text-xs text-gray-500">{isMaintenanceMode ? 'Site is currently offline' : 'Take site offline'}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
