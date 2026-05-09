import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile } from '../types';

interface HeroProps {
  id: string;
  profile: Profile;
}

export const Hero: React.FC<HeroProps> = ({ id, profile }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section 
      id={id} 
      className="min-h-screen w-full flex flex-col justify-center items-center px-6 lg:px-12 text-center pt-16 sm:pt-24"
    >
      <motion.div 
        className="max-w-6xl mx-auto w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Avatar */}
        <div className="mb-8 relative inline-block animate-float">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden relative z-10 bg-gray-100 dark:bg-gray-800 shadow-xl">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse z-0" />
            )}
            <img 
              src={profile.image}
              alt={profile.name}
              width={224}
              height={224}
              loading="eager"
              decoding="async"
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover scale-[1.1] transform hover:-rotate-6 transition-all duration-700 relative z-10 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        </div>

        {/* Greeting */}
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          Hi I'm {profile.name.split(' ')[0]}
        </h2>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black dark:text-white mb-6 leading-tight tracking-tight transition-colors duration-300">
          Building digital <br />
          products, brands, and experience.
        </h1>

        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          {profile.title}
        </p>

        {/* CTA Button */}
        <button 
           onClick={(e) => {
             e.preventDefault();
             // Open Gmail directly in a new tab to bypass unconfigured OS local mail clients
             const email = "rex.punlagao@gmail.com";
             const subject = encodeURIComponent("Portfolio Inquiry");
             window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`, '_blank', 'noopener,noreferrer');
             
             // Optional fallback: also try the traditional mailto protocol in case they don't use Gmail
             setTimeout(() => {
                window.location.href = `mailto:${email}?subject=${subject}`;
             }, 500);
           }}
           className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full font-extrabold tracking-wide bg-accent text-black transition-transform duration-300 hover:scale-105"
        >
          {/* Sliding Background */}
          <span className="absolute inset-0 w-full h-full bg-black -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
          
          {/* Content */}
          <span className="relative flex items-center justify-center group-hover:text-white transition-colors duration-300">
            <span className="transition-transform duration-300 group-hover:-translate-x-2">CONNECT WITH ME</span>
            <ArrowRight className="absolute left-full ml-2 w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </span>
        </button>
      </motion.div>
    </section>
  );
};