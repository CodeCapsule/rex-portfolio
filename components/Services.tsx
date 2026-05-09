import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '../types';
import { 
  Code2, 
  Palette, 
  Megaphone, 
  MonitorSmartphone, 
  Laptop, 
  MessageCircle, 
  FileText, 
  PenTool, 
  Presentation, 
  LineChart,
  LucideIcon 
} from 'lucide-react';

interface ServicesProps {
  id: string;
  services: Service[];
}

const IconMap: Record<string, LucideIcon> = {
  Code2,
  Palette,
  Megaphone,
  MonitorSmartphone,
  Laptop,
  MessageCircle,
  FileText,
  PenTool,
  Presentation,
  LineChart
};

export function Services({ id, services }: ServicesProps) {
  return (
    <section id={id} className="pt-16 sm:pt-24 pb-12 px-6 lg:px-12 bg-transparent transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <motion.div 
          className="mb-16 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">
            SERVICES
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white font-display leading-tight max-w-xl">
            I Provide Wide Range <br className="hidden md:block" />
            Of Digital Services
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = IconMap[service.icon] || Code2;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="group bg-white dark:bg-gray-900 p-10 shadow-lg border-b-4 border-accent flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 shadow-md shadow-accent/20">
                  <IconComponent size={28} strokeWidth={2} className="text-black" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {service.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
