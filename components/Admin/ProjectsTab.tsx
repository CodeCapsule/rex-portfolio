import React from 'react';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';
import { Project, ProjectCategory } from '../../types';

interface ProjectsTabProps {
    projects: Project[];
    onAddProject: () => void;
    onEditProject: (project: Project) => void;
    onDeleteProject: (id: number) => void;
    categories: ProjectCategory[];
    onManageCategories: () => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
    projects,
    onAddProject,
    onEditProject,
    onDeleteProject,
    categories,
    onManageCategories
}) => {
    const getCategoryName = (id: string) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : id;
    };
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Project Management</h1>
                    <p className="text-gray-500 text-sm">Manage your portfolio projects and case studies.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onManageCategories}
                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        <Wrench size={18} />
                        CATEGORIES
                    </button>
                    <button
                        onClick={onAddProject}
                        className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-accent/20"
                    >
                        <Plus size={18} />
                        ADD PROJECT
                    </button>
                </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 flex flex-col">
                        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => onEditProject(project)}
                                    className="p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-accent rounded-xl transition-all shadow-lg"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDeleteProject(project.id)}
                                    className="p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-xl transition-all shadow-lg"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase text-white tracking-wider">
                                    {getCategoryName(project.category)}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-lg truncate pr-2">{project.title}</h4>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase flex-shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                                {project.description || "No description provided for this project."}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                                    ID: #{project.id}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
