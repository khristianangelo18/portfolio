'use client';

import { Terminal, Github, Linkedin } from 'lucide-react';

export default function Navbar() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Terminal Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex items-center bg-white text-black px-2 py-0.5 rounded-sm font-mono font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Terminal className="w-4 h-4 mr-1.5" />
            KAT // DEV-PM
          </div>
        </div>
        
        {/* Smooth Scroll Navigation */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors relative group">
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
          {/* Border and padding removed here */}
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-white transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5 border-l border-zinc-800 pl-5">
          <a href="https://github.com/khristianangelo18" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}