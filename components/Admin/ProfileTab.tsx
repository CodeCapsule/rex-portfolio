import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Profile } from '../../types';

interface ProfileTabProps {
    profileFormData: Profile;
    setProfileFormData: (profile: Profile) => void;
    onImageUpload: (file: File) => Promise<string | null>;
    onSaveProfile: (e: React.FormEvent) => void;
    showNotification: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
    profileFormData,
    setProfileFormData,
    onImageUpload,
    onSaveProfile,
    showNotification
}) => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
                <p className="text-gray-500 text-sm">Update your personal information and profile image.</p>
            </div>

            <form onSubmit={onSaveProfile} className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden">
                            <img src={profileFormData.image} alt="Profile" className="w-full h-full object-cover scale-[1.1]" />
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-accent text-black rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                            <ImageIcon size={18} />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const imageUrl = await onImageUpload(file);
                                        if (imageUrl) {
                                            setProfileFormData({ ...profileFormData, image: imageUrl });
                                            showNotification('Profile Image Uploaded', 'Your profile image has been updated and is ready to be saved.', 'success');
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold">Profile Picture</p>
                        <p className="text-xs text-gray-500">Click the icon to upload a new photo</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={profileFormData.name}
                            onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Professional Title</label>
                        <input
                            type="text"
                            required
                            value={profileFormData.title}
                            onChange={(e) => setProfileFormData({ ...profileFormData, title: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Resume PDF URL</label>
                        <input
                            type="text"
                            value={profileFormData.resume_url || ''}
                            onChange={(e) => setProfileFormData({ ...profileFormData, resume_url: e.target.value })}
                            placeholder="/Rex_CV.pdf or Supabase URL"
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                    >
                        SAVE PROFILE
                    </button>
                </div>
            </form>
        </div>
    );
};
