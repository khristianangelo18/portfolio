'use client';

import { useState } from 'react';
import { Github, Linkedin, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ setShowHeroAnimations, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 0;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => {
            setMobileMenuOpen(false);
            if (window.scrollY > 10) {
              setShowHeroAnimations(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                setShowHeroAnimations(true);
              }, 700);
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <img
            src={theme === 'dark' ? '/images/websitelogo-darkmode.png' : '/images/websitelogo-lightmode.png'}
            alt="Khristian Angelo portfolio logo"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              if (window.scrollY > 10) {
                setShowHeroAnimations(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  setShowHeroAnimations(true);
                }, 900);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }} 
            className="hover:text-white transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-white transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="hover:text-white transition-colors relative group">
            Projects
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-white transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 md:border-l md:border-zinc-800 md:pl-5">
          <button
            type="button"
            onClick={toggleTheme}
            className="light-theme-toggle group relative h-9 w-16 rounded-full border border-zinc-800 bg-zinc-900/70 p-1 transition-all duration-300 hover:border-blue-500/50 flex-shrink-0"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className={`light-toggle-thumb absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-zinc-950 shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-1' : 'left-8'}`}>
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
            </span>
          </button>
          <a href="https://github.com/khristianangelo18" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex text-zinc-500 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex text-zinc-500 hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-zinc-900/50 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5 text-sm font-mono uppercase tracking-[0.2em] text-zinc-400">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              if (window.scrollY > 10) {
                setShowHeroAnimations(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  setShowHeroAnimations(true);
                }, 900);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="hover:text-white transition-colors"
          >
            Home
          </a>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-white transition-colors">
            About
          </a>
          <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-white transition-colors">
            Contact
          </a>
          <div className="flex items-center gap-5 pt-2 border-t border-zinc-900/50">
            <a href="https://github.com/khristianangelo18" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}