import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectCategory } from '../types';
import { Plus, Link as LinkIcon, X, ExternalLink } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface PortfolioProps {
  id: string;
  projects: Project[];
  categories: ProjectCategory[];
}

interface ProjectCardProps {
  project: Project;
  onClick: (p: Project) => void;
  categoryLabel: string;
  key?: React.Key;
}

const ProjectCard = ({ project, onClick, categoryLabel }: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect: Moves the image container vertically as we scroll
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] transition-all duration-300 cursor-pointer aspect-square"
      onClick={() => onClick(project)}
    >
      {/* Wrapper for parallax effect. We make it taller than container to allow movement without gaps. */}
      <motion.div
        style={{ y, height: "110%", marginTop: "-5%" }}
        className="w-full h-full relative"
      >
        {/* Skeleton Loader */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse z-0" />
        )}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-95 group-hover:opacity-100' : 'opacity-0'
            }`}
        />
      </motion.div>

      {/* Modern Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6 sm:p-8">
        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <p className="text-accent uppercase text-[11px] font-bold tracking-widest mb-2">{categoryLabel}</p>
          <h4 className="text-white font-bold text-2xl sm:text-3xl mb-4 leading-tight">{project.title}</h4>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full text-black hover:bg-accent hover:scale-110 transition-all duration-300 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClick(project);
              }}
              title="View Details"
            >
              <Plus size={24} strokeWidth={2} />
            </button>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 shadow-lg"
                onClick={(e) => e.stopPropagation()}
                title="Visit Project"
              >
                <LinkIcon size={20} strokeWidth={2} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Portfolio: React.FC<PortfolioProps> = ({ id, projects, categories }) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalImageLoaded, setIsModalImageLoaded] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      setIsModalImageLoaded(false); // Reset when a new project is selected
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  const filterTabs = [
    { id: 'all', label: 'All' },
    ...categories.map(cat => ({ id: cat.id, label: cat.name }))
  ];

  const getCategoryLabel = (catId: string) => {
    const tab = filterTabs.find(t => t.id === catId);
    return tab ? tab.label : catId;
  };

  return (
    <section id={id} className="pt-16 sm:pt-24 pb-24 px-6 lg:px-12 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight mb-6 transition-colors duration-300">
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">
            A collection of my recent work in web development, Graphic Art Design, and brand identity design.
          </p>
        </motion.div>

        {/* Animated Filters */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 md:gap-10 overflow-x-auto pb-2 no-scrollbar max-w-full px-4 snap-x snap-mandatory">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`relative pb-3 text-sm md:text-base font-bold transition-all duration-300 outline-none whitespace-nowrap flex-shrink-0 snap-center ${filter === tab.id
                  ? 'text-black dark:text-white'
                  : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
                  }`}
              >
                {tab.label}
                {filter === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setSelectedProject}
              categoryLabel={getCategoryLabel(project.category)}
            />
          ))}
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.3 }
              }}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 shadow-md transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-auto bg-gray-100 dark:bg-gray-800 relative flex-shrink-0">
                {!isModalImageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse z-0" />
                )}
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setIsModalImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isModalImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-5 pt-12 sm:p-8 sm:pt-12 md:p-10 md:pt-16 flex flex-col overflow-y-auto">
                <div className="mb-6 pr-6 md:pr-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent rounded-full">
                      {getCategoryLabel(selectedProject.category)}
                    </span>
                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink size={16} />
                        Visit Site
                      </a>
                    )}
                  </div>
                  <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    {selectedProject.description || "This project represents a detailed exploration of modern design principles combined with robust functionality. It demonstrates proficiency in creating intuitive user experiences and efficient code structures."}
                  </p>
                  <p>
                    Built with attention to detail and performance optimization in mind, ensuring a seamless experience across all devices and platforms.
                  </p>
                </div>


              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}