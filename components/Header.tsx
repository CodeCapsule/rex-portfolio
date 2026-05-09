import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onOpenResume: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onOpenResume }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check initial theme preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Services', id: 'services' },
    { name: 'Projects', id: 'portfolio' },
    { name: 'Skills', id: 'skills' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 ${isScrolled || isMobileMenuOpen ? 'bg-white dark:bg-black shadow-sm py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        {/* Left side: Logo */}
        <div className="flex items-center space-x-2">
          <a href="#home" className="block hover:opacity-80 transition-opacity">
            <img
              src="https://image2url.com/r2/default/images/1771661420532-dfa406ca-2ded-490e-9ab2-a54a31fcb9c3.png"
              alt="Logo"
              className="h-8 sm:h-10 w-auto object-contain dark:invert transition-all duration-300"
            />
          </a>
        </div>

        {/* Right side: Nav + Theme Toggle + Resume Button */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-bold tracking-wide transition-colors uppercase ${activeSection === link.id
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white'
                  }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-black dark:text-white" />}
            </button>

            <button
              onClick={onOpenResume}
              className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 transition-transform hover:scale-105"
            >
              RESUME <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-black dark:text-white" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 p-6 flex flex-col space-y-4 shadow-xl lg:hidden">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className="text-left text-lg font-semibold text-gray-800 dark:text-white py-2 border-b border-gray-50 dark:border-gray-800 uppercase"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={onOpenResume}
            className="bg-accent text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            RESUME <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </header>
  );
}