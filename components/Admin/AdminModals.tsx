import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Wrench, Image as ImageIcon, Plus, Bell } from 'lucide-react';
import { Project, Skill, SocialLink, ProjectCategory } from '../../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = 'max-w-md' }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative w-full ${maxWidth} bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]`}
                >
                    <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-8 sticky top-0 bg-white dark:bg-[#111] z-10 pb-2">
                            <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        {children}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// Delete Confirmation Modal
export const DeleteConfirmModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 text-center"
                >
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-500/20"
                        >
                            REMOVE
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// Maintenance Mode Modal
export const MaintenanceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isMaintenanceMode: boolean;
    onToggle: () => void;
}> = ({ isOpen, onClose, isMaintenanceMode, onToggle }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 text-center"
                >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isMaintenanceMode
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500'
                        : 'bg-orange-50 dark:bg-orange-900/10 text-orange-500'
                        }`}>
                        <Wrench size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                        {isMaintenanceMode ? 'Bring Site Back Online?' : 'Enable Maintenance Mode?'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {isMaintenanceMode
                            ? 'Your site will become visible to visitors again immediately.'
                            : 'Your site will show an "Under Maintenance" page to all visitors. You can still access the admin panel.'}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onToggle}
                            className={`flex-1 font-bold py-4 rounded-2xl transition-all shadow-lg ${isMaintenanceMode
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                                }`}
                        >
                            {isMaintenanceMode ? 'GO LIVE' : 'ENABLE'}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// Project Modal
export const ProjectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    editingProject: Project | null;
    formData: Partial<Project>;
    setFormData: (data: Partial<Project>) => void;
    onSave: (e: React.FormEvent) => void;
    onImageUpload: (file: File) => Promise<string | null>;
    categories: ProjectCategory[];
    onAddCategory: (name: string) => void;
}> = ({ isOpen, onClose, editingProject, formData, setFormData, onSave, onImageUpload, categories }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editingProject ? 'Edit Project' : 'Add New Project'} maxWidth="max-w-2xl">
            <form onSubmit={onSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Project Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Modern Dashboard"
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white appearance-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Project Link (Optional)</label>
                    <input
                        type="url"
                        value={formData.link || ''}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://your-project-link.com"
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Project Image (Drag & Drop)</label>
                    <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                const file = e.dataTransfer.files[0];
                                const imageUrl = await onImageUpload(file);
                                if (imageUrl) {
                                    setFormData({ ...formData, image: imageUrl });
                                }
                            }
                        }}
                        className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden ${formData.image
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 dark:border-gray-800 hover:border-accent hover:bg-accent/5'
                            }`}
                    >
                        {formData.image ? (
                            <>
                                <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="p-3 bg-accent text-black rounded-full mb-2">
                                        <Plus size={20} className="rotate-45" />
                                    </div>
                                    <p className="text-sm font-bold">Image Uploaded</p>
                                    <p className="text-xs text-gray-500">Drag or click to change</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-2xl group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                    <ImageIcon size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold">Drop your image here</p>
                                    <p className="text-xs text-gray-500">or click to browse files</p>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const imageUrl = await onImageUpload(file);
                                    if (imageUrl) {
                                        setFormData({ ...formData, image: imageUrl });
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Description</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell about your project..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white resize-none"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        CANCEL
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent/20"
                    >
                        {editingProject ? 'SAVE CHANGES' : 'CREATE PROJECT'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
// Skill Modal
export const SkillModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    editingSkill: Skill | null;
    skillFormData: Partial<Skill>;
    setSkillFormData: (data: any) => void;
    onSave: (e: React.FormEvent) => void;
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
    onSvgDrop: (e: React.DragEvent) => void;
    onSvgFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
    isOpen,
    onClose,
    editingSkill,
    skillFormData,
    setSkillFormData,
    onSave,
    isDragging,
    setIsDragging,
    onSvgDrop,
    onSvgFileSelect
}) => (
        <Modal isOpen={isOpen} onClose={onClose} title={editingSkill ? 'Edit Skill' : 'Add New Skill'} maxWidth="max-w-2xl">
            <form onSubmit={onSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">ICON NAME</label>
                        <input
                            type="text"
                            required
                            value={skillFormData.name}
                            onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                            placeholder="e.g. PHOTOSHOP"
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">ICON TYPE</label>
                        <select
                            value={skillFormData.icon_type}
                            onChange={(e) => setSkillFormData({ ...skillFormData, icon_type: e.target.value as any })}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white appearance-none"
                        >
                            <option value="svg">SVG</option>
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="image">IMAGE (Other)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                        {skillFormData.icon_type === 'svg' ? 'SVG ICON' : 'IMAGE ICON'}
                    </label>
                    <div className="space-y-4">
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={onSvgDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${isDragging
                                ? 'border-accent bg-accent/5'
                                : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] hover:border-accent/50'
                                }`}
                            onClick={() => document.getElementById('icon-upload')?.click()}
                        >
                            <input
                                type="file"
                                id="icon-upload"
                                accept=".svg,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={onSvgFileSelect}
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-accent text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <Plus size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold dark:text-white">Drop icon here or click to upload</p>
                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPEG supported</p>
                            </div>
                        </div>

                        {skillFormData.icon_value && (
                            <div className="flex justify-center p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
                                {skillFormData.icon_type === 'svg' ? (
                                    <div
                                        className="w-20 h-20 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                        dangerouslySetInnerHTML={{ __html: skillFormData.icon_value }}
                                    />
                                ) : (
                                    <img src={skillFormData.icon_value} alt="Preview" className="max-h-20 object-contain" />
                                )}
                            </div>
                        )}

                        {skillFormData.icon_type === 'svg' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">SVG Code (Manual Edit)</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={skillFormData.icon_value}
                                    onChange={(e) => setSkillFormData({ ...skillFormData, icon_value: e.target.value })}
                                    placeholder='<svg>...</svg>'
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white font-mono text-xs"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">ICON COLOR</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={skillFormData.color}
                                onChange={(e) => setSkillFormData({ ...skillFormData, color: e.target.value })}
                                className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                                type="text"
                                value={skillFormData.color}
                                onChange={(e) => setSkillFormData({ ...skillFormData, color: e.target.value })}
                                className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white font-mono uppercase"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Description</label>
                    <textarea
                        rows={3}
                        required
                        value={skillFormData.description || ''}
                        onChange={(e) => setSkillFormData({ ...skillFormData, description: e.target.value })}
                        placeholder="Briefly describe this skill..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white resize-none"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        CANCEL
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                    >
                        {editingSkill ? 'SAVE CHANGES' : 'ADD SKILL'}
                    </button>
                </div>
            </form>
        </Modal>
    );

// Social Link Modal
export const SocialLinkModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    editingSocialLink: SocialLink | null;
    socialLinkFormData: Partial<SocialLink>;
    setSocialLinkFormData: (data: any) => void;
    onSave: (e: React.FormEvent) => void;
    ICON_OPTIONS: string[];
    getIconComponent: (name: string) => React.ElementType;
}> = ({
    isOpen,
    onClose,
    editingSocialLink,
    socialLinkFormData,
    setSocialLinkFormData,
    onSave,
    ICON_OPTIONS,
    getIconComponent
}) => (
        <Modal isOpen={isOpen} onClose={onClose} title={editingSocialLink ? 'Edit Social Link' : 'Add Social Link'}>
            <form onSubmit={onSave} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Platform Name</label>
                    <input
                        type="text"
                        required
                        value={socialLinkFormData.platform || ''}
                        onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, platform: e.target.value })}
                        placeholder="e.g. Facebook, Instagram..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">URL</label>
                    <input
                        type="url"
                        required
                        value={socialLinkFormData.url || ''}
                        onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Icon</label>
                    <div className="grid grid-cols-4 gap-2">
                        {ICON_OPTIONS.map((iconName) => {
                            const IconComp = getIconComponent(iconName);
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSocialLinkFormData({ ...socialLinkFormData, icon: iconName })}
                                    className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-xs font-bold border-2 transition-all ${socialLinkFormData.icon === iconName
                                        ? 'border-accent bg-accent/10 text-accent'
                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 text-gray-500'
                                        }`}
                                >
                                    <IconComp size={18} fill="currentColor" strokeWidth={0} />
                                    <span className="truncate w-full text-center text-[10px]">{iconName.replace('Icon', '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Hover Color</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={socialLinkFormData.hoverColor || '#000000'}
                            onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, hoverColor: e.target.value })}
                            className="w-12 h-12 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={socialLinkFormData.hoverColor || ''}
                            onChange={(e) => setSocialLinkFormData({ ...socialLinkFormData, hoverColor: e.target.value })}
                            placeholder="#000000"
                            className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white font-mono"
                        />
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        CANCEL
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent/20"
                    >
                        {editingSocialLink ? 'SAVE CHANGES' : 'ADD LINK'}
                    </button>
                </div>
            </form>
        </Modal>
    );



export const NotificationModal: React.FC<{
    notification: { show: boolean; title: string; message: string; type: 'success' | 'error' | 'info' };
    onClose: () => void;
}> = ({ notification, onClose }) => (
    <AnimatePresence>
        {notification.show && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 p-8 text-center"
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${notification.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500' :
                        notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/10 text-red-500' :
                            'bg-blue-50 dark:bg-blue-900/10 text-blue-500'
                        }`}>
                        {notification.type === 'success' ? <Bell size={32} /> :
                            notification.type === 'error' ? <Plus size={32} className="rotate-45" /> :
                                <Bell size={32} />}
                    </div>
                    <h2 className="text-xl font-bold mb-2">{notification.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                        {notification.message}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent/20"
                    >
                        GOT IT
                    </button>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// Category Management Modal
export const CategoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    categories: ProjectCategory[];
    onAddCategory: (name: string) => void;
    onDeleteCategory: (id: string) => void;
}> = ({ isOpen, onClose, categories, onAddCategory, onDeleteCategory }) => {
    const [newCategoryName, setNewCategoryName] = React.useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories" maxWidth="max-w-md">
            <div className="space-y-8">
                <form onSubmit={handleAdd} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Add New Category</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g. 3D Modeling"
                            required
                            className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                        />
                        <button
                            type="submit"
                            className="bg-accent hover:bg-yellow-400 text-black px-6 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-accent/20"
                        >
                            ADD
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Existing Categories</label>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl group hover:border-accent/30 transition-all"
                            >
                                <span className="font-bold text-sm tracking-wide">{category.name}</span>
                                <button
                                    onClick={() => onDeleteCategory(category.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-center text-gray-500 py-4 text-sm">No categories yet.</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all mt-4"
                >
                    CLOSE
                </button>
            </div>
        </Modal>
    );
};
