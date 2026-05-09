import React, { useState, useEffect, useCallback } from 'react';
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Globe,
  Link as LinkIcon,
  Plus,
  Trash2,
  Wrench,
  Smile,
  Users,
  Code2,
} from 'lucide-react';
import { Project, Profile, Service, Skill, SocialLink, ProjectCategory } from '../types';

import { AdminSidebar } from './Admin/AdminSidebar';
import { AdminHeader } from './Admin/AdminHeader';
import { DashboardTab } from './Admin/DashboardTab';
import { ProjectsTab } from './Admin/ProjectsTab';
import { ServicesTab } from './Admin/ServicesTab';
import { SkillsTab } from './Admin/SkillsTab';
import { ProfileTab } from './Admin/ProfileTab';
import { SettingsTab } from './Admin/SettingsTab';
import {
  ProjectModal,
  SkillModal,
  SocialLinkModal,
  MaintenanceModal,
  DeleteConfirmModal,
  NotificationModal,
  CategoryModal,
} from './Admin/AdminModals';

interface AdminDashboardProps {
  onLogout: () => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  categories: ProjectCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ProjectCategory[]>>;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: React.Dispatch<React.SetStateAction<boolean>>;
}

/** Helper: POST JSON to a local API route */
async function apiPost(endpoint: string, body: unknown): Promise<void> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  projects,
  setProjects,
  categories,
  setCategories,
  profile,
  setProfile,
  services,
  setServices,
  skills,
  setSkills,
  socialLinks,
  setSocialLinks,
  isMaintenanceMode,
  setIsMaintenanceMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'profile' | 'services' | 'skills' | 'settings'
  >('dashboard');

  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, title: '', message: '', type: 'success' });

  const showNotification = useCallback(
    (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setNotification({ show: true, title, message, type });
    },
    []
  );

  // ── Image Upload (local server) ──────────────────────────────────────────
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.url as string;
    } catch (err: any) {
      showNotification('Error', 'Failed to upload image: ' + err.message, 'error');
      return null;
    }
  };

  // ── Theme ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.theme = newMode ? 'dark' : 'light';
    setIsDarkMode(newMode);
  };

  // ── Recent Changes ────────────────────────────────────────────────────────
  const [recentChanges, setRecentChanges] = useState<
    { id: number; action: string; detail: string; time: Date; icon: string; color: string }[]
  >(() => {
    const saved = localStorage.getItem('rex_admin_log');
    if (saved) {
      try {
        return JSON.parse(saved).map((item: any) => ({ ...item, time: new Date(item.time) }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const addChange = useCallback(
    (action: string, detail: string, icon: string, color: string) => {
      setRecentChanges(prev => {
        const updated = [
          { id: Date.now(), action, detail, time: new Date(), icon, color },
          ...prev,
        ].slice(0, 10);
        localStorage.setItem('rex_admin_log', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // ── Categories ────────────────────────────────────────────────────────────
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleAddCategory = async (name: string) => {
    const newCategory: ProjectCategory = { id: name.toLowerCase().replace(/\s+/g, '-'), name };
    const updatedCategories = [...categories, newCategory];
    try {
      await apiPost('/api/categories', updatedCategories);
      setCategories(updatedCategories);
      showNotification('Category Added', `Category "${name}" created.`, 'success');
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to add category.', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    try {
      await apiPost('/api/categories', updatedCategories);
      setCategories(updatedCategories);
      showNotification('Category Removed', 'Category has been deleted.', 'success');
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to delete category.', 'error');
    }
  };

  // ── Projects ──────────────────────────────────────────────────────────────
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({
    title: '',
    category: 'app',
    image: '',
    description: '',
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectFormData({ title: '', category: 'app', image: '', description: '', link: '' });
    setIsProjectModalOpen(true);
  };
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormData(project);
    setIsProjectModalOpen(true);
  };
  const handleDeleteProject = (id: number) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete === null) return;
    const updatedProjects = projects
      .filter(p => p.id !== projectToDelete)
      .sort((a, b) => a.id - b.id);
    try {
      setProjects(updatedProjects);
      await apiPost('/api/projects', updatedProjects);
      setIsDeleteModalOpen(false);
      showNotification('Project Deleted', 'The project has been removed.', 'info');
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to delete project.', 'error');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = projects.map(p =>
        p.id === editingProject.id ? ({ ...p, ...projectFormData } as Project) : p
      );
    } else {
      const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
      const newProject = { ...projectFormData, id: newId } as Project;
      updatedProjects = [...projects, newProject];
    }
    updatedProjects.sort((a, b) => a.id - b.id);
    try {
      await apiPost('/api/projects', updatedProjects);
      setProjects(updatedProjects);
      showNotification(
        editingProject ? 'Project Updated' : 'Project Created',
        'Saved successfully.',
        'success'
      );
      addChange(
        editingProject ? 'Project Updated' : 'Project Added',
        `"${projectFormData.title}" saved`,
        'project',
        'text-purple-500 bg-purple-50 dark:bg-purple-900/10'
      );
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to save project.', 'error');
    }
    setIsProjectModalOpen(false);
  };

  // ── Skills ────────────────────────────────────────────────────────────────
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isDeleteSkillModalOpen, setIsDeleteSkillModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillFormData, setSkillFormData] = useState<Partial<Skill>>({
    name: '',
    icon_type: 'svg',
    icon_value: '',
    color: '#31A8FF',
    description: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleAddSkill = () => {
    setEditingSkill(null);
    setSkillFormData({ name: '', icon_type: 'svg', icon_value: '', color: '#31A8FF', description: '' });
    setIsSkillModalOpen(true);
  };
  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData(skill);
    setIsSkillModalOpen(true);
  };
  const handleDeleteSkill = (id: string) => {
    setSkillToDelete(id);
    setIsDeleteSkillModalOpen(true);
  };

  const confirmDeleteSkill = async () => {
    if (!skillToDelete) return;
    const updatedSkills = skills.filter(s => s.id !== skillToDelete);
    try {
      setSkills(updatedSkills);
      await apiPost('/api/skills', updatedSkills);
      setIsDeleteSkillModalOpen(false);
      showNotification('Skill Deleted', 'The skill has been removed.', 'info');
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to delete skill.', 'error');
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSkills: Skill[];
    if (editingSkill) {
      updatedSkills = skills.map(s =>
        s.id === editingSkill.id ? ({ ...s, ...skillFormData } as Skill) : s
      );
    } else {
      const newSkill = { ...skillFormData, id: Date.now().toString() } as Skill;
      updatedSkills = [...skills, newSkill];
    }
    try {
      await apiPost('/api/skills', updatedSkills);
      setSkills(updatedSkills);
      showNotification(
        editingSkill ? 'Skill Updated' : 'Skill Added',
        'Saved successfully.',
        'success'
      );
      addChange(
        editingSkill ? 'Skill Updated' : 'Skill Added',
        `"${skillFormData.name}" saved`,
        'skill',
        'text-blue-500 bg-blue-50 dark:bg-blue-900/10'
      );
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to save skill.', 'error');
    }
    setIsSkillModalOpen(false);
  };

  const handleSvgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processIconFile(file);
  };
  const handleSvgFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processIconFile(file);
  };
  const processIconFile = (file: File) => {
    const reader = new FileReader();
    const isSvg = file.type === 'image/svg+xml';
    reader.onload = event => {
      const content = event.target?.result as string;
      setSkillFormData(prev => ({ ...prev, icon_value: content, icon_type: isSvg ? 'svg' : 'image' }));
    };
    if (isSvg) reader.readAsText(file);
    else reader.readAsDataURL(file);
  };

  // ── Services ──────────────────────────────────────────────────────────────
  const [servicesFormData, setServicesFormData] = useState<Service[]>(services);
  useEffect(() => setServicesFormData(services), [services]);

  const handleAddService = () =>
    setServicesFormData(prev => [
      ...prev,
      { icon: 'Code2', title: 'New Service', description: '', color: 'bg-[#fccb4e]' },
    ]);
  const handleDeleteService = (index: number) =>
    setServicesFormData(prev => prev.filter((_, i) => i !== index));

  const handleSaveServices = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('/api/services', servicesFormData);
      setServices(servicesFormData);
      showNotification('Services Updated', 'Services saved.', 'success');
      addChange(
        'Services Updated',
        `${servicesFormData.length} services saved`,
        'service',
        'text-accent bg-accent/10'
      );
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to save services.', 'error');
    }
  };

  // ── Profile ───────────────────────────────────────────────────────────────
  const [profileFormData, setProfileFormData] = useState<Profile>(profile);
  useEffect(() => setProfileFormData(profile), [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('/api/profile', profileFormData);
      setProfile(profileFormData);
      showNotification('Profile Updated', 'Profile saved.', 'success');
      addChange(
        'Profile Updated',
        'About info and links updated',
        'profile',
        'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
      );
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to save profile.', 'error');
    }
  };

  // ── Social Links ──────────────────────────────────────────────────────────
  const [isSocialLinkModalOpen, setIsSocialLinkModalOpen] = useState(false);
  const [isDeleteSocialLinkModalOpen, setIsDeleteSocialLinkModalOpen] = useState(false);
  const [socialLinkToDelete, setSocialLinkToDelete] = useState<string | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [socialLinkFormData, setSocialLinkFormData] = useState<Partial<SocialLink>>({
    platform: '',
    url: 'https://',
    icon: 'Globe',
    hoverColor: '#000000',
  });

  const handleAddSocialLink = () => {
    setEditingSocialLink(null);
    setSocialLinkFormData({ platform: '', url: 'https://', icon: 'Globe', hoverColor: '#000000' });
    setIsSocialLinkModalOpen(true);
  };
  const handleEditSocialLink = (link: SocialLink) => {
    setEditingSocialLink(link);
    setSocialLinkFormData(link);
    setIsSocialLinkModalOpen(true);
  };
  const handleDeleteSocialLink = (id: string) => {
    setSocialLinkToDelete(id);
    setIsDeleteSocialLinkModalOpen(true);
  };

  const confirmDeleteSocialLink = async () => {
    if (!socialLinkToDelete) return;
    const updatedLinks = socialLinks.filter(l => l.id !== socialLinkToDelete);
    try {
      setSocialLinks(updatedLinks);
      await apiPost('/api/social-links', updatedLinks);
      setIsDeleteSocialLinkModalOpen(false);
      showNotification('Link Deleted', 'Social link removed.', 'info');
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to delete social link.', 'error');
    }
  };

  const handleSaveSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedLinks: SocialLink[];
    if (editingSocialLink) {
      updatedLinks = socialLinks.map(l =>
        l.id === editingSocialLink.id ? ({ ...l, ...socialLinkFormData } as SocialLink) : l
      );
    } else {
      updatedLinks = [
        ...socialLinks,
        { ...socialLinkFormData, id: Date.now().toString() } as SocialLink,
      ];
    }
    try {
      await apiPost('/api/social-links', updatedLinks);
      setSocialLinks(updatedLinks);
      showNotification('Links Updated', 'Social links saved.', 'success');
      addChange(
        'Social Links Updated',
        `${updatedLinks.length} links active`,
        'social',
        'text-blue-400 bg-blue-50 dark:bg-blue-900/10'
      );
    } catch (err: any) {
      showNotification('Error', err.message || 'Failed to save social links.', 'error');
    }
    setIsSocialLinkModalOpen(false);
  };

  const ICON_OPTIONS = ['Facebook', 'Twitter', 'Linkedin', 'Github', 'Instagram', 'Youtube', 'Globe', 'LinkIcon'];
  const getIconComponent = (iconName: string): React.ElementType => {
    const map: Record<string, React.ElementType> = {
      Facebook, Twitter, Linkedin, Github, Instagram, Youtube, Globe, LinkIcon,
    };
    return map[iconName] || Globe;
  };

  // ── Maintenance ───────────────────────────────────────────────────────────
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        <div className="p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              profileName={profile.name}
              projects={projects}
              skills={skills}
              socialLinks={socialLinks}
              onAddProject={handleAddProject}
              recentChanges={recentChanges}
              isMaintenanceMode={isMaintenanceMode}
              setIsMaintenanceModalOpen={setIsMaintenanceModalOpen}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              categories={categories}
              onManageCategories={() => setIsCategoryModalOpen(true)}
            />
          )}
          {activeTab === 'services' && (
            <ServicesTab
              servicesFormData={servicesFormData}
              setServicesFormData={setServicesFormData}
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
              onSaveServices={handleSaveServices}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsTab
              skills={skills}
              onAddSkill={handleAddSkill}
              onEditSkill={handleEditSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              profileFormData={profileFormData}
              setProfileFormData={setProfileFormData}
              onImageUpload={handleImageUpload}
              onSaveProfile={handleSaveProfile}
              showNotification={showNotification}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              socialLinks={socialLinks}
              onAddSocialLink={handleAddSocialLink}
              onEditSocialLink={handleEditSocialLink}
              onDeleteSocialLink={handleDeleteSocialLink}
              getIconComponent={getIconComponent}
            />
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        editingProject={editingProject}
        formData={projectFormData}
        setFormData={setProjectFormData}
        onSave={handleSaveProject}
        onImageUpload={handleImageUpload}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        editingSkill={editingSkill}
        skillFormData={skillFormData}
        setSkillFormData={setSkillFormData}
        onSave={handleSaveSkill}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onSvgDrop={handleSvgDrop}
        onSvgFileSelect={handleSvgFileSelect}
      />
      <SocialLinkModal
        isOpen={isSocialLinkModalOpen}
        onClose={() => setIsSocialLinkModalOpen(false)}
        editingSocialLink={editingSocialLink}
        socialLinkFormData={socialLinkFormData}
        setSocialLinkFormData={setSocialLinkFormData}
        onSave={handleSaveSocialLink}
        ICON_OPTIONS={ICON_OPTIONS}
        getIconComponent={getIconComponent}
      />
      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        isMaintenanceMode={isMaintenanceMode}
        onToggle={async () => {
          const newState = !isMaintenanceMode;
          try {
            await apiPost('/api/maintenance', { enabled: newState });
            setIsMaintenanceMode(newState);
            setIsMaintenanceModalOpen(false);
            showNotification(
              newState ? 'Maintenance Enabled' : 'Site is Live',
              'Status updated and saved.',
              newState ? 'info' : 'success'
            );
          } catch {
            showNotification('Error', 'Failed to update maintenance status.', 'error');
          }
        }}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project?"
        message="This action cannot be undone."
      />
      <DeleteConfirmModal
        isOpen={isDeleteSkillModalOpen}
        onClose={() => setIsDeleteSkillModalOpen(false)}
        onConfirm={confirmDeleteSkill}
        title="Delete Skill?"
        message="This action cannot be undone."
      />
      <DeleteConfirmModal
        isOpen={isDeleteSocialLinkModalOpen}
        onClose={() => setIsDeleteSocialLinkModalOpen(false)}
        onConfirm={confirmDeleteSocialLink}
        title="Remove Link?"
        message="This link will be removed from your footer."
      />
      <NotificationModal
        notification={notification}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};
