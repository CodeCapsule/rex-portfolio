import React from 'react';
import { Plus, Globe, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialLink } from '../../types';

interface SettingsTabProps {
    socialLinks: SocialLink[];
    onAddSocialLink: () => void;
    onEditSocialLink: (link: SocialLink) => void;
    onDeleteSocialLink: (id: string) => void;
    getIconComponent: (iconName: string) => React.ElementType;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    socialLinks,
    onAddSocialLink,
    onEditSocialLink,
    onDeleteSocialLink,
    getIconComponent
}) => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Settings</h1>
                    <p className="text-gray-500 text-sm">Manage social media links displayed in your portfolio footer.</p>
                </div>
                <button
                    onClick={onAddSocialLink}
                    className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    ADD SOCIAL LINK
                </button>
            </div>

            <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Globe size={20} className="text-accent" />
                        Footer Social Links
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">These links appear in the footer of your portfolio.</p>
                </div>

                {socialLinks.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Globe size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No social links yet</p>
                        <p className="text-sm mt-1">Click "Add Social Link" to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {socialLinks.map((link) => {
                            const IconComponent = getIconComponent(link.icon);
                            return (
                                <motion.div
                                    key={link.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                >
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${link.hoverColor}20`, color: link.hoverColor }}
                                    >
                                        <IconComponent size={22} fill="currentColor" strokeWidth={0} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm">{link.platform}</h4>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-gray-400 hover:text-accent transition-colors truncate block"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button
                                            onClick={() => onEditSocialLink(link)}
                                            className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteSocialLink(link.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
