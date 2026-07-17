'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Mail, Github, Linkedin, MapPin, GraduationCap, Award, Users, CheckCircle, AlertCircle, ExternalLink, Sparkles, Facebook, Instagram, Briefcase, Heart, Code2, Layers, Wrench, Filter, Sun, Moon, Menu, X } from 'lucide-react';
import SplitText from "./SplitText";

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

// Define Zod Schema for validation
const contactSchema = z.object({
  name: z.string().min(2, "Name is required (min 2 chars)"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Add custom animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /* NEW: Soft Stealth Transition (Right-Heavy) */
  .bg-split-tone {
    background: linear-gradient(
      100deg, 
      #09090b 0%,    /* Pure Black (Left) */
      #0b0b0d 30%,   /* Very subtle lift */
      #0f0f11 70%,   /* Transitioning... */
      #161618 100%   /* Soft Charcoal Gray (Right) */
    );
    background-attachment: fixed;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .theme-root {
    color-scheme: dark;
    transition: background-color 300ms ease, color 300ms ease;
  }
  .theme-light {
    color-scheme: light;
  }
  .theme-light .bg-split-tone {
    background:
      radial-gradient(circle at 18% 18%, rgba(37, 99, 235, 0.12), transparent 28%),
      radial-gradient(circle at 86% 12%, rgba(14, 165, 233, 0.11), transparent 30%),
      linear-gradient(120deg, #f8fafc 0%, #eef2f7 50%, #e2e8f0 100%);
  }
  .theme-light nav {
    background: rgba(255, 255, 255, 0.88);
    border-color: rgba(148, 163, 184, 0.45);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }
  .theme-light .bg-zinc-950 {
    background-color: #f8fafc !important;
  }
  .theme-light .bg-zinc-950\\/80 {
    background-color: rgba(255, 255, 255, 0.88) !important;
  }
  .theme-light .bg-zinc-950\\/70,
  .theme-light .bg-zinc-950\\/60,
  .theme-light .bg-zinc-950\\/50,
  .theme-light .bg-zinc-950\\/45,
  .theme-light .bg-zinc-950\\/35 {
    background-color: rgba(248, 250, 252, 0.92) !important;
  }
  .theme-light .bg-zinc-900\\/90,
  .theme-light .bg-zinc-900\\/80,
  .theme-light .bg-zinc-900\\/70,
  .theme-light .bg-zinc-900\\/60,
  .theme-light .bg-zinc-900\\/50,
  .theme-light .bg-zinc-900\\/45,
  .theme-light .bg-zinc-900\\/35 {
    background-color: rgba(255, 255, 255, 0.9) !important;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  }
  .theme-light .bg-zinc-900 {
    background-color: #ffffff !important;
  }
  .theme-light .bg-zinc-800\\/60,
  .theme-light .bg-zinc-800\\/50 {
    background-color: rgba(226, 232, 240, 0.82) !important;
  }
  .theme-light .border-zinc-900,
  .theme-light .border-zinc-900\\/50,
  .theme-light .border-zinc-800,
  .theme-light .border-zinc-800\\/70,
  .theme-light .border-zinc-800\\/60,
  .theme-light .border-zinc-800\\/50,
  .theme-light .border-zinc-700,
  .theme-light .border-zinc-700\\/50 {
    border-color: rgba(148, 163, 184, 0.58) !important;
  }
  .theme-light .text-white,
  .theme-light .text-zinc-100 {
    color: #0f172a !important;
  }
  .theme-light .text-zinc-300,
  .theme-light .text-zinc-400 {
    color: #334155 !important;
  }
  .theme-light .text-zinc-500,
  .theme-light .text-zinc-600 {
    color: #475569 !important;
  }
  .theme-light .hover\\:text-white:hover {
    color: #0f172a !important;
  }
  .theme-light .skill-filter-bar .hover\\:bg-zinc-900:hover {
    background-color: rgba(15, 23, 42, 0.08) !important;
  }
  .theme-light .skill-filter-bar .hover\\:text-white:hover {
    color: #0f172a !important;
  }
  .theme-light .skill-category-active {
    border-color: rgba(37, 99, 235, 0.45) !important;
    background-color: rgba(37, 99, 235, 0.08) !important;
  }
  .theme-light .skill-filter-pill-active {
    background-color: #0f172a !important;
    color: #ffffff !important;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.18) !important;
  }
  .theme-light .bg-clip-text.text-transparent {
    background-image: linear-gradient(90deg, #0f172a, #2563eb, #475569) !important;
  }
  .theme-light .skill-icon-chip {
    background-color: #f1f5f9 !important;
    border-color: rgba(15, 23, 42, 0.12) !important;
  }
  .theme-light input,
  .theme-light textarea {
    background-color: rgba(255, 255, 255, 0.96) !important;
    color: #0f172a !important;
  }
  .theme-light input::placeholder,
  .theme-light textarea::placeholder {
    color: #94a3b8 !important;
  }
  .theme-light .shadow-blue-500\\/10,
  .theme-light .hover\\:shadow-blue-500\\/10:hover {
    box-shadow: 0 20px 45px rgba(59, 130, 246, 0.12) !important;
  }
  .theme-light .light-brand-badge {
    background: #0f172a !important;
    color: #ffffff !important;
  }
  .theme-light .light-theme-toggle {
    background: rgba(226, 232, 240, 0.9) !important;
    border-color: rgba(100, 116, 139, 0.55) !important;
  }
  .theme-light .light-toggle-thumb {
    background: #ffffff !important;
    color: #0f172a !important;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
  }
  .theme-dark .theme-heading-muted {
    color: #a1a1aa !important;
  }
  .theme-light .theme-heading-muted {
    color: #475569 !important;
  }
  .theme-dark .theme-section-title {
    color: #ffffff !important;
  }
  .theme-light .theme-section-title {
    color: #0f172a !important;
  }
  .theme-dark .theme-project-icon {
    background: linear-gradient(135deg, #27272a, #18181b) !important;
  }
  .theme-light .theme-project-icon {
    background: linear-gradient(135deg, #dbeafe, #ffffff) !important;
    border: 1px solid rgba(59, 130, 246, 0.24);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
  }
  .theme-dark .theme-subtle-icon {
    color: #52525b !important;
  }
  .theme-light .theme-subtle-icon {
    color: #64748b !important;
  }
  .theme-light .theme-loading-screen {
    background: #f8fafc !important;
  }
  .theme-light .theme-loading-title {
    color: #0f172a !important;
  }
  .theme-light .theme-loading-track {
    background: rgba(226, 232, 240, 0.95) !important;
    border-color: rgba(148, 163, 184, 0.62) !important;
  }
  .theme-light .theme-loading-bar {
    background: linear-gradient(90deg, #2563eb, #0ea5e9) !important;
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.22) !important;
  }
  .theme-light .theme-loading-glow {
    background: rgba(37, 99, 235, 0.24) !important;
  }
  .theme-light .theme-loading-dot {
    background: #2563eb !important;
  }
  .theme-light .theme-outline-button {
  color: #0f172a !important;
  background: rgba(255, 255, 255, 0.78) !important;
  border-color: rgba(37, 99, 235, 0.45) !important;
  }

  .theme-light .theme-outline-button svg {
    color: #2563eb !important;
  }

  .theme-light .theme-outline-button:hover {
    background: rgba(219, 234, 254, 0.95) !important;
    border-color: rgba(37, 99, 235, 0.8) !important;
  }
  .theme-light .submit-btn-text {
    color: #ffffff !important;
  }
  .theme-dark .invert-dark-logo {
    filter: invert(1) brightness(2);
  }
  .theme-light .invert-dark-logo {
    filter: none !important;
  }
`;

// Navbar Component
function Navbar({ setShowHeroAnimations, theme, toggleTheme }) {
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
          <a href="#" onClick={(e) => { e.preventDefault(); 
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
          <a href="https://github.com/khristianangelo18" target="_blank" className="hidden md:inline-flex text-zinc-500 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" target="_blank" className="hidden md:inline-flex text-zinc-500 hover:text-white transition-colors">
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

// ProjectCard Component
function ProjectCard({ title, description, tags, link, gradient }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="relative p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="theme-project-icon w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <ExternalLink className={`theme-subtle-icon w-5 h-5 text-zinc-600 transition-all duration-300 ${isHovered ? 'text-blue-500 translate-x-1 -translate-y-1' : ''}`} />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs text-zinc-300 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reveal Component
// Wraps content that fades/slides in whenever it's scrolled into view, and
// fades back out when it scrolls out of view — so it replays every time you
// scroll past it. Each instance watches only its own element (not a large
// parent section) and uses a threshold of 0 so it doesn't need a big
// fraction of a tall block to be on-screen at once.
function Reveal({ children, className = '', delayMs = 0, durationMs = 1000, from = 'up', as = 'div', ...rest }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    from === 'left' ? '-translate-x-10'
    : from === 'right' ? 'translate-x-10'
    : from === 'down' ? '-translate-y-10'
    : 'translate-y-10';

  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : '0ms',
        transitionDuration: `${durationMs}ms`
      }}
      className={`transition-all ${visible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${hiddenTransform}`} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Main Landing Page
export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentRole, setCurrentRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHeroAnimations, setShowHeroAnimations] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSkillFilter, setActiveSkillFilter] = useState('all');
  const [theme, setTheme] = useState('dark');
  
  const roles = ['Software Engineer', 'Project Manager', 'Full-stack Developer', 'Quality Assurance'];

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema),
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const duration = 4500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    let currentProgress = 0;

    const progressTimer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressTimer);
      }
      setLoadingProgress(Math.floor(currentProgress));
    }, interval);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    const heroTimer = setTimeout(() => {
      setShowHeroAnimations(true);
    }, 4600);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(loadingTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  useEffect(() => {
    const currentRoleText = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentRole.length < currentRoleText.length) {
          setCurrentRole(currentRoleText.slice(0, currentRole.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentRole.length > 0) {
          setCurrentRole(currentRole.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentRole, isDeleting, roleIndex, roles]);

  // NEW onSubmit function for Hook Form
  const onSubmit = async (data) => {
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    }
  };

  const myProjects = [
    { 
      title: "3Whites", 
      description: "AI-Driven Powerlifting & Progress Tracking Android Application with real-time AR bar path visualization.", 
      tags: ["Mobile Developer", "Documentation"], 
      link: "#",
      gradient: "from-blue-600 to-cyan-600"
    },
    { 
      title: "TechSync", 
      description: "AI-Powered Developer Collaboration & Upskilling Platform with skill-matching algorithm.", 
      tags: ["Frontend Developer", "Project Manager", "Documentation"], 
      link: "#",
      gradient: "from-purple-600 to-pink-600"
    },
  ];

  const skills = {
    languages: ["JavaScript", "Python", "C++", "C#", "Java", "SQL", "HTML5", "CSS3", "XML", "Kotlin", "PHP"],
    frameworks: ["Next.js", "React", "Node.js", "TailwindCSS"],
    tools: ["GitHub", "Google Cloud", "VS Code", "Figma", "Supabase", "Android Studio", "Postman", "PostgreSQL", "Vite", "Jira", "AGILE", "Scrum", "Vercel"]
  };

  const skillIcons = {
    "JavaScript": { source: 'simple', slug: 'javascript' },
    "Python": { source: 'simple', slug: 'python' },
    "C++": { source: 'simple', slug: 'cplusplus' },
    "C#": { source: 'devicon', slug: 'csharp' },
    "Java": { source: 'devicon', slug: 'java' },
    "SQL": { source: 'devicon', slug: 'mysql' },
    "HTML5": { source: 'simple', slug: 'html5' },
    "CSS3": { source: 'simple', slug: 'css' },
    "XML": { source: 'devicon', slug: 'xml' },
    "Kotlin": { source: 'simple', slug: 'kotlin' },
    "PHP": { source: 'simple', slug: 'php' },
    "Next.js": { source: 'simple', slug: 'nextdotjs', invertInDarkMode: true },
    "React": { source: 'simple', slug: 'react' },
    "Node.js": { source: 'simple', slug: 'nodedotjs' },
    "TailwindCSS": { source: 'simple', slug: 'tailwindcss' },
    "GitHub": { source: 'simple', slug: 'github', invertInDarkMode: true },
    "Google Cloud": { source: 'simple', slug: 'googlecloud' },
    "VS Code": { source: 'devicon', slug: 'vscode' },
    "Figma": { source: 'simple', slug: 'figma' },
    "Supabase": { source: 'simple', slug: 'supabase' },
    "Android Studio": { source: 'simple', slug: 'androidstudio' },
    "Postman": { source: 'simple', slug: 'postman' },
    "PostgreSQL": { source: 'simple', slug: 'postgresql' },
    "Vite": { source: 'simple', slug: 'vite' },
    "Jira": { source: 'simple', slug: 'jira' },
    "Scrum": { source: 'local', slug: 'scrum', invertInDarkMode: true },
    "AGILE": { source: 'local', slug: 'agile', invertInDarkMode: true },
    "Vercel": { source: 'simple', slug: 'vercel', invertInDarkMode: true }
  };

  const getSkillIconUrl = ({ source, slug }) => {
    if (source === 'local') return `/images/${slug}.png`;
    if (source === 'devicon') return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
    return `https://cdn.simpleicons.org/${slug}`;
  };

  const getSkillInitials = (name) => {
    const clean = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
    if (clean.length <= 4) return clean.toUpperCase();
    const words = clean.split(/\s+/);
    if (words.length > 1) return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase();
    return clean.slice(0, 3).toUpperCase();
  };

  const skillFilters = [
    { id: 'all', label: 'All', icon: Filter, accent: 'from-white to-zinc-400' },
    { id: 'languages', label: 'Languages', icon: Code2, accent: 'from-blue-400 to-cyan-300' },
    { id: 'frameworks', label: 'Frameworks', icon: Layers, accent: 'from-purple-400 to-pink-300' },
    { id: 'tools', label: 'Tools', icon: Wrench, accent: 'from-emerald-400 to-teal-300' }
  ];

  const skillTheme = {
    languages: {
      label: 'Language',
      dot: 'bg-blue-400',
      border: 'hover:border-blue-400/60',
      glow: 'group-hover:bg-blue-400/10'
    },
    frameworks: {
      label: 'Framework',
      dot: 'bg-purple-400',
      border: 'hover:border-purple-400/60',
      glow: 'group-hover:bg-purple-400/10'
    },
    tools: {
      label: 'Tool',
      dot: 'bg-emerald-400',
      border: 'hover:border-emerald-400/60',
      glow: 'group-hover:bg-emerald-400/10'
    }
  };

  const visibleSkills = Object.entries(skills)
    .filter(([category]) => activeSkillFilter === 'all' || activeSkillFilter === category)
    .flatMap(([category, items]) => items.map((name) => ({ name, category })));

  const education = [
    {
      school: "Pamantasan ng Lungsod ng Maynila",
      degree: "Bachelor of Science in Information Technology",
      year: "2022 - Present",
      achievement: "Consistent Dean's Lister (GWA: 1.43)"
    },
    {
      school: "Mariano Marcos Memorial High School",
      degree: "Science, Technology, Engineering, and Mathematics",
      year: "2020 - 2022",
      achievement: "Graduated with High Honors"
    }
  ];

  const workExperience = [
    {
      company: "Bank of the Philippine Islands (BPI)",
      role: "Project Manager Intern",
      year: "Feb 2026 - May 2026",
      responsibilities: [
        "Authored and pitched comprehensive digital transformation project proposals to key corporate stakeholders, aligning technical platform initiatives with overarching institutional goals.",
        "Developed and structured detailed Business Requirement Documents (BRDs) and complex system use cases, establishing clear project scopes and actionable roadmaps for the development team.",
        "Formulated and validated precise API contract specifications using Postman, streamlining backend integration requirements and ensuring data reliability across platform workflows.",
        "Designed and developed high-fidelity Figma prototypes and responsive React interfaces, bridging the gap between UI/UX design and production-ready frontend code."
      ]
    }
  ];

  const interests = [
    {
      title: "Software Development",
      description: "Turning rough ideas into reliable product features.",
      accent: "from-blue-500/20 to-cyan-400/10",
      marker: "01"
    },
    {
      title: "Web Development",
      description: "Designing responsive interfaces that feel fast and polished.",
      accent: "from-purple-500/20 to-pink-400/10",
      marker: "02"
    },
    {
      title: "Database Management",
      description: "Structuring data so apps stay clear, searchable, and scalable.",
      accent: "from-emerald-500/20 to-teal-400/10",
      marker: "03"
    },
    {
      title: "Project Management",
      description: "Keeping people, scope, and delivery moving in the same direction.",
      accent: "from-amber-500/20 to-yellow-400/10",
      marker: "04"
    },
    {
      title: "APIs & Integrations",
      description: "Connecting systems through clean contracts and tested workflows.",
      accent: "from-sky-500/20 to-indigo-400/10",
      marker: "05"
    },
    {
      title: "Quality Assurance",
      description: "Catching edge cases before they become user problems.",
      accent: "from-rose-500/20 to-red-400/10",
      marker: "06"
    },
    {
      title: "Cloud Integrations",
      description: "Exploring cloud services that make products smarter and easier to scale.",
      accent: "from-cyan-500/20 to-blue-400/10",
      marker: "07"
    },
    {
      title: "Software Engineering",
      description: "Balancing clean code, teamwork, and long-term maintainability.",
      accent: "from-violet-500/20 to-fuchsia-400/10",
      marker: "08"
    }
  ];

  const leadership = [
    {
      org: "PLM Google Developer Student Club (GDSC)",
      role: "Noogler",
      year: "2023 - 2025",
      description: "Engaged in Google-led technical workshops and developer events, gaining hands-on experience in modern web development and cloud infrastructure."
    },
    {
      org: "AWS Cloud Club — Haribon",
      role: "Software Engineer & Data Engineer Skillbuilder",
      year: "2024 - 2025",
      description: "Engaged in hands-on technical sessions focused on AWS core services and cloud computing architecture."
    }
  ];

  return (
    <div className={`theme-root ${theme === 'light' ? 'theme-light' : 'theme-dark'} bg-zinc-950 min-h-screen text-white overflow-hidden`}>
      <style>{styles}</style>

      <div className="fixed inset-0 z-0 pointer-events-none bg-split-tone">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.02)_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {isLoading && (
        <div className="theme-loading-screen fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
          </div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

          <div className="relative text-center space-y-12 w-full max-w-5xl px-6 sm:px-8">
            {/* Main Title with SplitText Animation */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-full text-center space-y-6">
                <SplitText
                  text="Welcome to My Portfolio!"
                  className="theme-loading-title text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  onLetterAnimationComplete={handleAnimationComplete}
                  showCallback
                />
              </div>
            </div>
            
            {/* Loading Progress Section */}
            <div className="space-y-4 max-w-xl mx-auto">
              {/* Progress Bar */}
              <div className="relative">
                {/* Background track with subtle glow */}
                <div className="theme-loading-track w-full h-2.5 bg-zinc-900/80 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
                  {/* Animated progress bar - WHITE */}
                  <div 
                    className="theme-loading-bar h-full bg-white rounded-full transition-all duration-300 ease-out relative overflow-hidden shadow-lg shadow-white/20"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    {/* Shimmer effect on progress bar */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100 to-transparent opacity-60"
                      style={{
                        animation: 'shimmer 1.5s ease-in-out infinite',
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Glow effect under progress bar */}
                <div 
                  className="theme-loading-glow absolute -bottom-1 left-0 h-4 bg-white/20 blur-xl rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>

              {/* Progress Text */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                <span className="text-zinc-400 font-mono tracking-wide">
                  Initializing experience...
                </span>
                <div className="flex items-center gap-2">
                  <span className="theme-loading-title text-white font-mono font-bold text-lg tabular-nums">
                    {loadingProgress}%
                  </span>
                  <div className="flex gap-1">
                    <div className="theme-loading-dot w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="theme-loading-dot w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="theme-loading-dot w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add keyframe animation for shimmer */}
          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      )}

      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div 
          className="fixed inset-0 opacity-30 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
          }}
        />

      <Navbar setShowHeroAnimations={setShowHeroAnimations} theme={theme} toggleTheme={toggleTheme}/>
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        
        <section className="flex flex-col items-start justify-center min-h-[80vh] pt-32 sm:pt-40 md:pt-44 pb-10 relative overflow-hidden">
          <div className="space-y-6 max-w-4xl">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm backdrop-blur-sm ${showHeroAnimations ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0s' }}>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Available for new projects/internships/work opportunities. Let's connect!
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none break-words">
                <div className={`transition-all duration-1200 ease-out ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} 
                    style={{ animationDelay: '0.1s' }}>
                  <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    KHRISTIAN
                  </span>
                </div>

                <div className={`transition-all duration-1200 ease-out ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} 
                    style={{ animationDelay: '0.2s' }}>
                  <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                    ANGELO
                  </span>
                </div>
              </h1>
              
              <div className={`h-[42px] flex items-center transition-all duration-1200 ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.3s' }}>
                <span className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-300 backdrop-blur-sm flex items-center gap-2">
                  {currentRole}
                  <span className="inline-block w-[2px] h-4 bg-white animate-pulse"></span>
                </span>
              </div>
            </div>

            <p className={`text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl transition-all duration-1200 ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.4s' }}>
              I craft <span className="text-white font-semibold">exceptional digital experiences</span> by 
              combining technical expertise with strategic thinking. Specializing in scalable full-stack 
              architecture and seamless project execution.
            </p>

            <div className={`flex flex-wrap gap-4 pt-4 transition-all duration-1200 ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.5s' }}>
              <a 
                href="#projects" 
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">Explore My Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>

          <div className={`self-center mt-16 sm:mt-0 sm:absolute sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center gap-2 animate-bounce transition-opacity duration-500 ${showHeroAnimations ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <span className="text-xs text-zinc-600 font-mono">SCROLL</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
          </div>
        </section>

        <section 
          id="about" 
          className="py-32 border-t border-zinc-900"
        >
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="theme-section-title text-4xl sm:text-5xl md:text-6xl font-bold">
                About <span className="theme-heading-muted text-zinc-600">Me</span>
              </h2>
            </div>
            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
              {/* IMAGE CONTAINER: First on mobile (order-1), second on desktop (lg:order-2) */}
              <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-zinc-400/10 via-white/10 to-zinc-600/10 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                  
                  <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border-2 border-zinc-800/50 bg-zinc-950">
                    <img 
                      src="/images/aboutme.jpg" 
                      alt="Profile" 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90"></div>
                  </div>
                </div>
              </div>

              {/* BIO & BUTTONS CONTAINER: Second on mobile (order-2), first on desktop (lg:order-1) */}
              <div className="space-y-6 order-2 lg:order-1">
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Results-driven Information Technology graduate with a strong focus on Frontend Development and 
                  Project Management. Skilled in translating business requirements into actionable technical specifications, 
                  building AI-powered applications, and delivering production-ready interfaces — with hands-on experience 
                  across the full product lifecycle, from stakeholder alignment to Agile-driven delivery.
                </p>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Manila, Philippines</span>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="/Khristian_Angelo_Tiu_Resume.pdf"
                    download="Khristian_Angelo_Tiu_Resume.pdf"
                    className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">Download Resume</span>
                    <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                  
                  <a 
                    href="#contact" 
                    className="theme-outline-button px-8 py-4 border-2 border-zinc-700 hover:border-zinc-600 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-zinc-900/50 cursor-pointer"
                  >
                    <Mail className="w-5 h-5" />
                    Get In Touch
                  </a>
                </div>
              </div>

            </Reveal>

            <Reveal className="space-y-7" from="left" delayMs={100}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <h3 className="theme-section-title text-2xl font-bold flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                  Education
                </h3>
                <p className="text-sm text-zinc-500 max-w-md">
                  Academic foundation shaped by consistent performance and technical curiosity.
                </p>
              </div>
              <div className="relative">
                <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-blue-500 via-zinc-700 to-transparent md:left-1/2"></div>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <div key={i} className="relative grid grid-cols-[2.75rem_1fr] md:grid-cols-[1fr_4rem_1fr] gap-4 items-stretch">
                      <div className={`hidden md:block ${i % 2 === 0 ? 'text-right' : 'md:col-start-3 md:row-start-1 text-left'}`}>
                        <span className="inline-flex px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-400">
                          {edu.year}
                        </span>
                      </div>
                      <div className="relative flex justify-center md:col-start-2 md:row-start-1">
                        <div className="w-10 h-10 rounded-full bg-zinc-950 border border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-500/10">
                          <GraduationCap className="w-5 h-5 text-blue-400" />
                        </div>
                      </div>
                      <div className={`group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/45 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-zinc-900/70 ${i % 2 === 0 ? 'md:col-start-3' : 'md:col-start-1 md:row-start-1'}`}>
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <span className="mb-3 inline-flex md:hidden px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-400">
                          {edu.year}
                        </span>
                        <h4 className="text-lg font-bold text-white mb-1">{edu.school}</h4>
                        <p className="text-blue-400 text-sm mb-4 italic">{edu.degree}</p>
                        {edu.achievement && (
                          <div className="flex items-start gap-2 rounded-lg border border-yellow-500/15 bg-yellow-500/5 px-3 py-2">
                            <Award className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-zinc-300">{edu.achievement}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="space-y-6" from="left" delayMs={100}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <h3 className="theme-section-title text-2xl font-bold flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-500" />
                  Work Experience
                </h3>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Product + Engineering</span>
              </div>
              <div className="space-y-4">
                {workExperience.map((job, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/45 p-6 transition-all duration-300 hover:border-blue-500/40 hover:bg-zinc-900/70">
                    <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{job.role}</h4>
                        <p className="text-blue-400 text-sm">{job.company}</p>
                      </div>
                      <span className="w-fit rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1 text-xs font-mono text-zinc-400">{job.year}</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.responsibilities.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 rounded-lg border border-zinc-800/60 bg-zinc-950/35 p-3 text-zinc-400 text-sm leading-relaxed">
                          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-mono text-blue-300">
                            {j + 1}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="space-y-6" from="right" delayMs={100}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h3 className="theme-section-title text-2xl font-bold">Technical Skills</h3>
                  <p className="mt-2 text-sm text-zinc-500">Filter the stack by category to scan what matters first.</p>
                </div>
                <div className="skill-filter-bar flex flex-wrap gap-2 rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-1.5">
                  {skillFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeSkillFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setActiveSkillFilter(filter.id)}
                        className={`skill-filter-pill group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] transition-all duration-300 ${
                          isActive
                            ? 'skill-filter-pill-active bg-white text-zinc-950 shadow-lg shadow-white/10'
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                        }`}
                        aria-pressed={isActive}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/45 p-5 md:p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent"></div>
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {Object.entries(skills).map(([category, items]) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveSkillFilter(category)}
                      className={`skill-category-card rounded-lg border p-3 text-left transition-all duration-300 ${
                        activeSkillFilter === category
                          ? 'skill-category-active border-white/40 bg-white/10'
                          : 'border-zinc-800/70 bg-zinc-950/35 hover:border-zinc-700'
                      }`}
                    >
                      <div className={`mb-2 h-1.5 w-8 rounded-full ${skillTheme[category].dot}`}></div>
                      <p className="text-lg font-bold text-white">{items.length}</p>
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">{category}</p>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {visibleSkills.map((skill) => {
                    const icon = skillIcons[skill.name];
                    return (
                      <div
                        key={`${skill.category}-${skill.name}`}
                        className={`group relative overflow-hidden rounded-lg border border-zinc-800/70 bg-zinc-950/45 p-4 transition-all duration-300 hover:-translate-y-1 ${skillTheme[skill.category].border}`}
                      >
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${skillTheme[skill.category].glow}`}></div>
                        <div className="relative flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="skill-icon-chip relative w-9 h-9 flex-shrink-0 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center overflow-hidden">
                              {icon && (
                                <img
                                  src={getSkillIconUrl(icon)}
                                  alt=""
                                  loading="lazy"
                                  // Replace 'dark:invert' with our new custom dynamic class:
                                  className={`w-5 h-5 object-contain transition-all duration-300 ${
                                    icon.invertInDarkMode ? 'invert-dark-logo' : ''
                                  }`}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              )}
                              <span
                                className="items-center justify-center text-[9px] font-bold text-zinc-700 dark:text-zinc-300 leading-none"
                                style={{ display: icon ? 'none' : 'flex' }}
                              >
                                {getSkillInitials(skill.name)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{skill.name}</p>
                              <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">{skillTheme[skill.category].label}</p>
                            </div>
                          </div>
                          <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${skillTheme[skill.category].dot}`}></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <h3 className="theme-section-title text-2xl font-bold flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-500" />
                  Leadership & Student Organizations
                </h3>
                <p className="text-sm text-zinc-500">Community learning, cloud exposure, and developer events.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leadership.map((item, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/45 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-blue-400/20"></div>
                    <div className="relative mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-mono text-blue-300">
                        0{i + 1}
                      </div>
                      <span className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1 text-xs font-mono text-zinc-400">{item.year}</span>
                    </div>
                    <h4 className="relative text-lg font-bold text-white">{item.org}</h4>
                    <p className="relative mt-1 text-blue-400 text-sm">{item.role}</p>
                    <p className="relative mt-4 text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <h3 className="theme-section-title text-2xl font-bold flex items-center gap-3">
                  <Heart className="w-6 h-6 text-blue-500" />
                  Interests
                </h3>
                <p className="text-sm text-zinc-500 max-w-md">
                  The areas I keep exploring when I build, lead, and polish software.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4">
                {interests.map((interest, i) => (
                  <div
                    key={interest.title}
                    className={`group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 ${i === 0 || i === 3 ? 'lg:col-span-2' : ''}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${interest.accent} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}></div>
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative flex h-full min-h-36 flex-col justify-between gap-8">
                      <span className="w-fit rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1 text-xs font-mono text-zinc-400">
                        {interest.marker}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white">{interest.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{interest.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section 
          id="projects" 
          className="py-32 border-t border-zinc-900"
        >
          <div className="space-y-16">
            <Reveal className="space-y-4">
              <h2 className="theme-section-title text-4xl sm:text-5xl md:text-6xl font-bold">
                Featured <span className="theme-heading-muted text-zinc-600">Projects</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl">
                A selection of recent work showcasing my approach to building modern, scalable applications.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {myProjects.map((project, i) => (
                <Reveal
                  key={project.title}
                  durationMs={700}
                  delayMs={i * 150}
                >
                  <ProjectCard {...project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section 
          id="contact" 
          className="pt-32 pb-12 border-t border-zinc-900"
        >
          <Reveal as="div" className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="theme-section-title text-4xl sm:text-5xl md:text-6xl font-bold">
                    Let's Create
                    <br />
                    <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                      Something Great
                    </span>
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    I'm currently open for internships and freelance projects. 
                    Whether you have a question or just want to say hi, I'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="group bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Email</h3>
                        <a href="mailto:khristianangelo.tiu@gmail.com" className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
                          khristianangelo.tiu@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                          <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Phone</h3>
                        <a href="tel:+639218704508" className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
                          +63 921 8704 508
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <MapPin className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Location</h3>
                        <p className="text-zinc-400 text-sm">Manila, Philippines</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-zinc-500 text-sm mb-4">Connect with me</p>
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://github.com/khristianangelo18" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                    >
                      <Github className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                    >
                      <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="h-16">
                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 animate-fade-in">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">Message sent successfully! I'll get back to you soon.</p>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-fade-in">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">Failed to send message. Please try again or contact me directly.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-b from-zinc-400/20 via-zinc-800/10 to-transparent rounded-2xl blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-zinc-400 text-sm font-medium">Your Name</label>
                          <input 
                            {...register("name")}
                            type="text" 
                            placeholder="Your Name" 
                            className={`w-full bg-zinc-800/50 border ${errors.name ? 'border-red-500' : 'border-zinc-700'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors`}
                            disabled={isSubmitting}
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-zinc-400 text-sm font-medium">Your Email</label>
                          <input 
                            {...register("email")}
                            type="email" 
                            placeholder="your.email@example.com" 
                            className={`w-full bg-zinc-800/50 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors`}
                            disabled={isSubmitting}
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-400 text-sm font-medium">Subject</label>
                        <input 
                          {...register("subject")}
                          type="text" 
                          placeholder="Project Inquiry" 
                          className={`w-full bg-zinc-800/50 border ${errors.subject ? 'border-red-500' : 'border-zinc-700'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors`}
                          disabled={isSubmitting}
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-400 text-sm font-medium">Message</label>
                        <textarea 
                          {...register("message")}
                          placeholder="What is it..."
                          rows="6"
                          className={`w-full bg-zinc-800/50 border ${errors.message ? 'border-red-500' : 'border-zinc-700'} rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none`}
                          disabled={isSubmitting}
                        ></textarea>
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 text-white submit-btn-text">
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </Reveal>
        </section>

      </main>

      <footer className="relative border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                  <img 
                    src="/images/profile.jpg" 
                    alt="Khristian Angelo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold">Khristian Angelo</h3>
                  <p className="text-zinc-500 text-xs">Software Engineer</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Building exceptional digital experiences through code and creativity.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm">Quick Links</h4>
              <div className="flex flex-col gap-3">
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
                  className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
                </a>
                <a 
                  href="#about" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    const element = document.getElementById('about');
                    if (element) {
                      const offset = 80;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit"
                >
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>

                <a 
                  href="#projects" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    const element = document.getElementById('projects');
                    if (element) {
                      const offset = 80;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit"
                >
                  Projects
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>

                <a 
                  href="#contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('contact');
                    if (element) {
                      const elementPosition = element.offsetTop;
                      const offsetPosition = elementPosition - 0; 
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm">Connect</h4>
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com/khristianangelo18" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                >
                  <Github className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </a>
                <a 
                  href="https://www.facebook.com/khristianangelo18" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                >
                  <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </a>
                <a 
                  href="https://www.instagram.com/_kaetiu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                >
                  <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </a>
              </div>
              <p className="text-zinc-500 text-xs">Thank you for visiting! Let's build something amazing together.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-zinc-500 text-sm">
                © 2026 Khristian Angelo Tiu. All rights reserved.
              </p>
              <p className="text-zinc-600 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Built with React & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}