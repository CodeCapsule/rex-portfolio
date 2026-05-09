import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Skill } from '../../types';

interface SkillsTabProps {
    skills: Skill[];
    onAddSkill: () => void;
    onEditSkill: (skill: Skill) => void;
    onDeleteSkill: (id: string) => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
    skills,
    onAddSkill,
    onEditSkill,
    onDeleteSkill
}) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Skills Management</h1>
                    <p className="text-gray-500 text-sm">Manage the skills displayed on your portfolio.</p>
                </div>
                <button
                    onClick={onAddSkill}
                    className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    ADD NEW SKILL
                </button>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {skills.map((skill) => (
                    <div key={skill.id} className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex-shrink-0">
                                {skill.icon_type === 'svg' ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: skill.icon_value }}
                                        className="w-10 h-10 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                    />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <img src={skill.icon_value} alt={skill.name} className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEditSkill(skill)}
                                    className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-accent rounded-xl transition-all"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDeleteSkill(skill.id)}
                                    className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-xl transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg uppercase tracking-wider" style={{ color: skill.color }}>{skill.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 uppercase">Type: {skill.icon_type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
