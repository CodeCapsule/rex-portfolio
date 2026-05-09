import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../types';

interface SkillsSectionProps {
  id: string;
  skills: Skill[];
}

const SkillCard = ({ skill }: { skill: Skill }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative flex flex-col items-center justify-center text-center p-6 bg-transparent border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-md hover:border-accent transition-all duration-300 min-h-[200px]"
    >
      {/* Icon Container */}
      <div className="mb-4 flex items-center justify-center relative">
        {skill.icon_type === 'svg' ? (
          <div
            className="w-20 h-20 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: skill.icon_value }}
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center relative">
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg z-0" />
            )}
            <img
              src={skill.icon_value}
              alt={skill.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-contain relative z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Skill Name */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-wide uppercase">
        {skill.name}
      </h3>
      {skill.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {skill.description}
        </p>
      )}
    </motion.div>
  );
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ id, skills }) => {
  return (
    <section id={id} className="pt-16 sm:pt-24 pb-24 px-6 lg:px-12 bg-transparent transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight mb-6 transition-colors duration-300">
            Software Skills
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-300">
            My workflow is built on a foundation of industry-standard tools, allowing for seamless transitions from initial concept to final delivery. I prioritize efficiency, data integrity, and cross-platform collaboration.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {skills.map((skill) => (
             <SkillCard key={skill.id} skill={skill} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
