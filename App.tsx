import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { SkillsSection } from './components/SkillsSection';
import { LoginModal } from './components/LoginModal';
import { ResumeModal } from './components/ResumeModal';
import { ContentProtection } from './components/ContentProtection';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-load heavy components
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard }))
);
const ParticlesBackground = lazy(() =>
  import('./components/ParticlesBackground').then(m => ({ default: m.ParticlesBackground }))
);
const UnderMaintenancePage = lazy(() =>
  import('./components/UnderMaintenancePage').then(m => ({ default: m.UnderMaintenancePage }))
);

import initialProjectsData from './data/db.json';
import initialProfileData from './data/profile.json';
import initialServicesData from './data/services.json';
import initialSkillsData from './data/skills.json';
import { Project, Profile, Service, Skill, SocialLink, ProjectCategory } from './types';
import { Facebook, Twitter, Linkedin, Github, Instagram, Youtube, Link } from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_CATEGORIES: ProjectCategory[] = [
  { id: 'app', name: 'Web Apps' },
  { id: 'card', name: 'Graphic Designs' },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: '1', platform: 'Facebook', url: 'https://facebook.com', icon: 'Facebook', hoverColor: '#1877F2' },
  { id: '2', platform: 'Twitter', url: 'https://twitter.com', icon: 'Twitter', hoverColor: '#1DA1F2' },
  { id: '3', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', hoverColor: '#0A66C2' },
  { id: '4', platform: 'GitHub', url: 'https://github.com', icon: 'Github', hoverColor: '#333333' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'admin'>('landing');

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>(DEFAULT_CATEGORIES);
  const [profile, setProfile] = useState<Profile>({
    name: 'Rex J. Punlagao',
    image: 'https://ui-avatars.com/api/?name=Rex+Punlagao&background=fccb4e&color=000&bold=true',
    title: 'Vibe Coding Developer and Graphic Designer',
    resume_url: '/Rex_CV.pdf',
  });
  const [services, setServices] = useState<Service[]>([
    {
      icon: 'Code2',
      title: 'Web Design',
      description:
        'Performance-driven landing pages and full-scale websites (Personal, Business, & eCommerce) optimized for user experience and modern SEO.',
      color: 'bg-[#fccb4e]',
    },
    {
      icon: 'Palette',
      title: 'Graphic Design',
      description:
        'Professional design for all your business needs, including logos, business card, social media content, marketing flyers. From digital banners to custom T-shirts.',
      color: 'bg-[#fccb4e]',
    },
    {
      icon: 'Megaphone',
      title: 'Digital Marketing',
      description:
        'End-to-end branding solutions including product mock-ups, label architecture, and menu design.',
      color: 'bg-[#ff5b5b]',
    },
  ]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-login via secret URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('access') === 'rex-super-admin') {
      setView('admin');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch all data from local API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projectsRes,
          profileRes,
          servicesRes,
          skillsRes,
          socialLinksRes,
          categoriesRes,
          maintenanceRes,
        ] = await Promise.all([
          fetch('/api/projects').then(r => r.json()).catch(() => null),
          fetch('/api/profile').then(r => r.json()).catch(() => null),
          fetch('/api/services').then(r => r.json()).catch(() => null),
          fetch('/api/skills').then(r => r.json()).catch(() => null),
          fetch('/api/social-links').then(r => r.json()).catch(() => null),
          fetch('/api/categories').then(r => r.json()).catch(() => null),
          fetch('/api/maintenance').then(r => r.json()).catch(() => null),
        ]);

        // Projects — always sort by id
        const rawProjects: Project[] = (Array.isArray(projectsRes) && projectsRes.length > 0)
          ? projectsRes
          : (initialProjectsData as Project[]);
        setProjects([...rawProjects].sort((a, b) => a.id - b.id));

        // Profile
        if (profileRes && profileRes.name) setProfile(profileRes as Profile);
        else setProfile(initialProfileData as Profile);

        // Services
        if (Array.isArray(servicesRes) && servicesRes.length > 0) setServices(servicesRes);
        else setServices(initialServicesData as Service[]);

        // Skills
        const rawSkills = (Array.isArray(skillsRes) && skillsRes.length > 0)
          ? skillsRes
          : (initialSkillsData as any[]);
        setSkills(rawSkills.map((s: any) => ({
          ...s,
          icon_type: s.icon_type || s.iconType,
          icon_value: s.icon_value || s.iconValue,
        })) as Skill[]);

        // Social links
        if (Array.isArray(socialLinksRes) && socialLinksRes.length > 0)
          setSocialLinks(socialLinksRes);

        // Categories
        if (Array.isArray(categoriesRes) && categoriesRes.length > 0)
          setCategories(categoriesRes);

        // Maintenance
        if (maintenanceRes?.enabled !== undefined)
          setIsMaintenanceMode(maintenanceRes.enabled);
      } catch (err) {
        console.error('Failed to fetch data; using local fallback:', err);
        setProjects([...(initialProjectsData as Project[])].sort((a, b) => a.id - b.id));
        setProfile(initialProfileData as Profile);
        setServices(initialServicesData as Service[]);
        setSkills((initialSkillsData as any[]).map((s: any) => ({
          ...s,
          icon_type: s.icon_type || s.iconType,
          icon_value: s.icon_value || s.iconValue,
        })) as Skill[]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'portfolio', 'skills'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse text-sm font-medium tracking-widest uppercase">
          Initializing Portfolio...
        </p>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#111]">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <AdminDashboard
            onLogout={() => setView('landing')}
            projects={projects}
            setProjects={setProjects}
            profile={profile}
            setProfile={setProfile}
            services={services}
            setServices={setServices}
            skills={skills}
            setSkills={setSkills}
            categories={categories}
            setCategories={setCategories}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            isMaintenanceMode={isMaintenanceMode}
            setIsMaintenanceMode={setIsMaintenanceMode}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (isMaintenanceMode) {
    return (
      <Suspense fallback={null}>
        <UnderMaintenancePage />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white transition-colors duration-300 relative">
        <ContentProtection />
        <Suspense fallback={null}>
          <ParticlesBackground />
        </Suspense>
        <Header activeSection={activeSection} onOpenResume={() => setIsResumeModalOpen(true)} />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => setView('admin')}
        />

        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          pdfUrl={profile.resume_url}
        />

        <main className="flex flex-col relative z-10">
          <ErrorBoundary>
            <Hero id="home" profile={profile} />
          </ErrorBoundary>

          {/* Section Separator */}
          <div className="w-full bg-transparent pb-4 pt-6 px-6 lg:px-12 flex justify-center">
            <div className="w-full max-w-6xl border-t-2 border-accent dark:shadow-[0_0_15px_rgba(252,203,78,0.3)]" />
          </div>

          <ErrorBoundary>
            <Services id="services" services={services} />
          </ErrorBoundary>

          {/* Section Separator */}
          <div className="w-full bg-transparent pb-4 pt-6 px-6 lg:px-12 flex justify-center">
            <div className="w-full max-w-6xl border-t-2 border-accent dark:shadow-[0_0_15px_rgba(252,203,78,0.3)]" />
          </div>

          {/* Portfolio Section */}
          <div className="bg-transparent text-black dark:text-white transition-colors duration-300">
            <ErrorBoundary>
              <Portfolio id="portfolio" projects={projects} categories={categories} />
            </ErrorBoundary>
          </div>

          {/* Skills Section */}
          <ErrorBoundary>
            <SkillsSection id="skills" skills={skills} />
          </ErrorBoundary>

          {/* Footer */}
          <footer className="bg-transparent py-12 px-6 lg:px-12 text-center border-t border-accent/30 dark:border-accent/20 transition-colors duration-300">
            <motion.div
              className="container mx-auto max-w-6xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center space-x-8 mb-8">
                {socialLinks.map(link => {
                  const iconMap: Record<string, React.ElementType> = {
                    Facebook, Twitter, Linkedin, Github, Instagram, Youtube, Link,
                  };
                  const IconComponent = iconMap[link.icon] || Link;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 transition-transform duration-300 hover:-translate-y-1 hover:scale-110"
                      onMouseEnter={e => (e.currentTarget.style.color = link.hoverColor)}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}
                      aria-label={link.platform}
                    >
                      <IconComponent size={20} fill="currentColor" strokeWidth={0} />
                    </a>
                  );
                })}
              </div>

              <div className="mb-4 text-gray-900 dark:text-white font-medium text-xs">
                Designed &amp; Developed with <span className="text-red-500 mx-1">💖</span> by{' '}
                <span className="text-yellow-400">Rex</span>
              </div>

              <div className="text-gray-500 text-sm">
                &copy; rexdesigns.
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hover:text-accent transition-colors"
                >
                  me
                </button>{' '}
                {new Date().getFullYear()}. All Rights Reserved.
              </div>
            </motion.div>
          </footer>
        </main>
      </div>
    </ErrorBoundary>
  );
}
