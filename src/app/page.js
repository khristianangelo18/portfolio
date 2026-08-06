'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowRight, Mail, Github, Linkedin, MapPin, GraduationCap, 
  Award, Users, CheckCircle, AlertCircle, Briefcase, Heart, 
  Code2, Layers, Wrench, Filter 
} from 'lucide-react';

import SplitText from "@/components/SplitText";
import PortfolioChatbot from '@/components/PortfolioChatbot';
import TiltedCard from '@/components/TiltedCard/TiltedCard';
import LogoLoop from '@/components/LogoLoop/LogoLoop';
import Navbar from '@/components/Navbar';
import { FeaturedProjectCard } from '@/components/ProjectCards';

import { 
  PROJECTS, SKILLS, SKILL_ICONS, EDUCATION, 
  WORK_EXPERIENCE, INTERESTS, LEADERSHIP 
} from '@/data/portfolio';

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

const contactSchema = z.object({
  name: z.string().min(2, "Name is required (min 2 chars)"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

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

  const getSkillIconUrl = ({ source, slug }) => {
    if (source === 'local') return `/images/${slug}.png`;
    if (source === 'devicon') {
      const variant = slug === 'csharp' ? 'plain' : 'original';
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
    }
    return `https://cdn.simpleicons.org/${slug}`;
  };

  const technicalStackLogos = useMemo(() => {
    return Object.entries(SKILL_ICONS).map(([name, iconConfig]) => {
      const darkModeHoverClass = iconConfig.invertInDarkMode
        ? 'group-hover:brightness-0 group-hover:invert group-hover:opacity-100'
        : 'group-hover:filter-none group-hover:opacity-100';

      const lightModeHoverClass = 'group-hover:filter-none group-hover:opacity-100';

      return {
        node: (
          <div className="group relative flex items-center justify-center p-1 cursor-pointer">
            <img
              src={getSkillIconUrl(iconConfig)}
              alt={name}
              className={`w-7 h-7 object-contain transition-all duration-300 transform group-hover:scale-110 ${
                theme === 'dark'
                  ? `brightness-0 invert opacity-70 ${darkModeHoverClass}`
                  : `brightness-0 opacity-70 ${lightModeHoverClass}`
              }`}
            />
          </div>
        ),
        title: name,
      };
    });
  }, [theme]);

  const getSkillInitials = (name) => {
    const clean = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
    if (clean.length <= 4) return clean.toUpperCase();
    const words = clean.split(/\s+/);
    if (words.length > 1) return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase();
    return clean.slice(0, 3).toUpperCase();
  };

  const skillFilters = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'languages', label: 'Languages', icon: Code2 },
    { id: 'frameworks', label: 'Frameworks', icon: Layers },
    { id: 'tools', label: 'Tools', icon: Wrench }
  ];

  const skillTheme = {
    languages: {
      label: 'Language',
      dot: 'bg-cyan-400',
      border: 'hover:border-cyan-500/50',
      glow: 'group-hover:bg-cyan-500/10'
    },
    frameworks: {
      label: 'Framework',
      dot: 'bg-indigo-400',
      border: 'hover:border-indigo-500/50',
      glow: 'group-hover:bg-indigo-500/10'
    },
    tools: {
      label: 'Tool',
      dot: 'bg-sky-400',
      border: 'hover:border-sky-500/50',
      glow: 'group-hover:bg-sky-500/10'
    }
  };

  const visibleSkills = Object.entries(SKILLS)
    .filter(([category]) => activeSkillFilter === 'all' || activeSkillFilter === category)
    .flatMap(([category, items]) => items.map((name) => ({ name, category })));

  return (
    <div className={`theme-root ${theme === 'light' ? 'theme-light' : 'theme-dark'} bg-[#030712] min-h-screen text-slate-100 overflow-hidden`}>
      <div className="fixed inset-0 z-0 pointer-events-none bg-split-tone">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950/80 to-[#030712]"></div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-[#030712] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-slate-900 via-indigo-950 to-[#030712]"></div>

          <div className="relative text-center space-y-12 w-full max-w-5xl px-6 sm:px-8">
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-full text-center space-y-6">
                <SplitText
                  text="Welcome to My Portfolio!"
                  className="theme-loading-title text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white dark:text-white"
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
            
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="relative">
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-slate-700 via-cyan-500 to-indigo-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                <span className="text-slate-400 font-mono tracking-wide">
                  Initializing experience...
                </span>
                <span className="text-slate-100 dark:text-white font-mono font-bold text-lg tabular-nums">
                  {loadingProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div 
          className="fixed inset-0 opacity-20 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 58, 138, 0.25), transparent 50%)`
          }}
        />

        <Navbar setShowHeroAnimations={setShowHeroAnimations} theme={theme} toggleTheme={toggleTheme}/>
        
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          {/* HERO SECTION */}
          <section className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 relative overflow-hidden">
            <div className="w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-6 max-w-4xl">
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 dark:bg-slate-900/90 border border-slate-700/60 rounded-full text-slate-300 dark:text-slate-300 text-sm backdrop-blur-md shadow-lg ${showHeroAnimations ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  Available for new projects & opportunities. Let's connect!
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none break-words">
                    <div className={`transition-all duration-1200 ease-out ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                      <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                        KHRISTIAN
                      </span>
                    </div>

                    <div className={`transition-all duration-1200 ease-out ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                      <span className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 dark:from-slate-300 dark:via-slate-500 dark:to-slate-700 bg-clip-text text-transparent">
                        ANGELO
                      </span>
                    </div>
                  </h1>
                  
                  <div className={`h-[42px] flex items-center transition-all duration-1200 ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-sm font-mono text-slate-300 backdrop-blur-md flex items-center gap-2 shadow-inner">
                      {currentRole}
                      <span className="inline-block w-[2px] h-4 bg-cyan-400 animate-pulse"></span>
                    </span>
                  </div>
                </div>

                <p className={`text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl transition-all duration-1200 ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  I craft <span className="text-slate-900 dark:text-slate-100 font-semibold">exceptional digital experiences</span> by 
                  combining technical expertise with strategic thinking. Specializing in scalable full-stack 
                  architecture and seamless project execution.
                </p>

                <div className={`flex flex-wrap gap-4 pt-4 transition-all duration-1200 ${showHeroAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <a 
                    href="#projects" 
                    className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer shadow-xl"
                  >
                    <span className="relative z-10">Explore My Work</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 text-cyan-400" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </div>
              </div>

              {/* CODE-EDITOR STYLE CARD */}
              <div className="developer-card w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0b1120] text-left transition-all duration-300">
                {/* window chrome */}
                <div className="developer-card-header flex items-center gap-2 px-4 py-3 bg-[#11182b] border-b border-slate-800">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-end">
                    <span className="developer-pill px-3 py-1 rounded-md bg-slate-950/60 dark:bg-slate-950/60 text-slate-700 dark:text-slate-400 text-xs font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      developer.js
                    </span>
                  </div>
                </div>

                {/* code body */}
                <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto">
                  <p><span className="text-purple-400">const</span> <span className="text-cyan-300">Developer</span> <span className="text-slate-500">=</span> <span className="text-slate-500">{'{'}</span></p>
                  <p className="pl-4 sm:pl-6"><span className="text-sky-300">name</span><span className="text-slate-500">:</span> <span className="text-emerald-400">"Khristian Angelo Tiu"</span><span className="text-slate-500">,</span></p>
                  <p className="pl-4 sm:pl-6">
                    <span className="text-sky-300">role</span><span className="text-slate-500">:</span>{' '}
                    <span className="text-emerald-400">"Software Engineer, Project Management, Full-Stack Developer, Quality Assurance"</span><span className="text-slate-500">,</span>
                  </p>
                  <p className="pl-4 sm:pl-6"><span className="text-sky-300">location</span><span className="text-slate-500">:</span> <span className="text-emerald-400">"Manila, Philippines"</span><span className="text-slate-500">,</span></p>
                  <p className="pl-4 sm:pl-6">
                    <span className="text-sky-300">skills</span><span className="text-slate-500">:</span>{' '}
                    <span className="text-slate-500">[</span>
                    <span className="text-emerald-400">"React"</span><span className="text-slate-500">, </span>
                    <span className="text-emerald-400">"Next.js"</span><span className="text-slate-500">, </span>
                    <span className="text-emerald-400">"Node.js"</span>
                    <span className="text-slate-500">],</span>
                  </p>
                  <p className="pl-4 sm:pl-6"><span className="text-sky-300">availableForWork</span><span className="text-slate-500">:</span> <span className="text-orange-400">true</span></p>
                  <p><span className="text-slate-500">{'}'}</span><span className="text-slate-500">;</span></p>
                </div>
              </div>
            </div>

            <div className={`mt-16 sm:mt-0 sm:absolute sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center gap-2 animate-bounce transition-opacity duration-500 ${showHeroAnimations ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs text-slate-500 font-mono">SCROLL</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="py-32 border-t border-slate-300 dark:border-slate-900">
            <div className="space-y-16">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-950 dark:text-white">
                  About <span className="text-slate-500">Me</span>
                </h2>
              </div>
              <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                    <div className="relative w-[350px] h-[350px] sm:w-[380px] sm:h-[380px]">
                      <TiltedCard
                        imageSrc="/images/aboutme.jpg"
                        altText="Khristian Angelo Tiu"
                        captionText="Khristian Angelo Tiu"
                        containerClassName="w-full h-full shadow-2xl"
                        imageClassName="w-full h-full object-cover rounded-2xl border border-slate-300 dark:border-slate-800"
                        rotateAmplitude={12}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 order-2 lg:order-1">
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    Results-driven Information Technology graduate with a strong focus on Frontend Development and 
                    Project Management. Skilled in translating business requirements into actionable technical specifications, 
                    building AI-powered applications, and delivering production-ready interfaces — with hands-on experience 
                    across the full product lifecycle, from stakeholder alignment to Agile-driven delivery.
                  </p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span>Manila, Philippines</span>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <a 
                      href="/Khristian_Angelo_Tiu_Resume.pdf"
                      download="Khristian_Angelo_Tiu_Resume.pdf"
                      className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer shadow-lg"
                    >
                      <span className="relative z-10">Download Resume</span>
                      <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform relative z-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                    
                    <a 
                      href="#contact" 
                      className="px-8 py-4 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg font-semibold text-slate-800 dark:text-slate-300 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-5 h-5 text-slate-500" />
                      Get In Touch
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* EDUCATION SECTION */}
              <Reveal className="space-y-7" from="left" delayMs={100}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-950 dark:text-white">
                    <GraduationCap className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    Education
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Academic foundation shaped by consistent performance and technical curiosity.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-slate-300 dark:from-slate-700 via-slate-400 dark:via-slate-800 to-transparent md:left-1/2"></div>
                  <div className="space-y-6">
                    {EDUCATION.map((edu, i) => (
                      <div key={i} className="relative grid grid-cols-[2.75rem_1fr] md:grid-cols-[1fr_4rem_1fr] gap-4 items-stretch">
                        <div className={`hidden md:block ${i % 2 === 0 ? 'text-right' : 'md:col-start-3 md:row-start-1 text-left'}`}>
                          <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                            {edu.year}
                          </span>
                        </div>
                        <div className="relative flex justify-center md:col-start-2 md:row-start-1">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-md">
                            <GraduationCap className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                          </div>
                        </div>
                        <div className={`group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600 ${i % 2 === 0 ? 'md:col-start-3' : 'md:col-start-1 md:row-start-1'}`}>
                          <span className="mb-3 inline-flex md:hidden px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                            {edu.year}
                          </span>
                          <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-1">{edu.school}</h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 italic">{edu.degree}</p>
                          {edu.achievement && (
                            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                              <Award className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-slate-700 dark:text-slate-300">{edu.achievement}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* WORK EXPERIENCE */}
              <Reveal className="space-y-6" from="left" delayMs={100}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-950 dark:text-white">
                    <Briefcase className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    Work Experience
                  </h3>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">Product + Engineering</span>
                </div>
                <div className="space-y-4">
                  {WORK_EXPERIENCE.map((job, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-950 dark:text-white">{job.role}</h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">{job.company}</p>
                        </div>
                        <span className="w-fit rounded-full border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 py-1 text-xs font-mono text-slate-600 dark:text-slate-400">{job.year}</span>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.responsibilities.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 p-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300">
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

              {/* TECHNICAL SKILLS */}
              <Reveal className="space-y-6" from="right" delayMs={100}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Technical Skills</h3>
                    <p className="mt-2 text-sm text-slate-500">Filter the stack by category to scan what matters first.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 p-1.5">
                    {skillFilters.map((filter) => {
                      const Icon = filter.icon;
                      const isActive = activeSkillFilter === filter.id;
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setActiveSkillFilter(filter.id)}
                          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] transition-all duration-300 ${
                            isActive
                              ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border border-slate-700 shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white'
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

                <div className="w-full relative py-4 overflow-hidden select-none group/loop">
                  <LogoLoop
                    logos={technicalStackLogos}
                    speed={60}
                    direction="right"
                    logoHeight={32}
                    gap={55}
                    pauseOnHover={true}
                    scaleOnHover={true}
                    fadeOut={true}
                    fadeOutColor={theme === 'dark' ? '#030712' : '#f8fafc'}
                    ariaLabel="Technical Stack Rotation Timeline"
                  />
                </div>

                <div className="relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6">
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    {Object.entries(SKILLS).map(([category, items]) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveSkillFilter(category)}
                        className={`rounded-lg border p-3 text-left transition-all duration-300 ${
                          activeSkillFilter === category
                            ? 'border-slate-500 bg-slate-100 dark:bg-slate-800/80'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className={`mb-2 h-1.5 w-8 rounded-full ${skillTheme[category].dot}`}></div>
                        <p className="text-lg font-bold text-slate-950 dark:text-white">{items.length}</p>
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">{category}</p>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {visibleSkills.map((skill) => {
                      const icon = SKILL_ICONS[skill.name];
                      return (
                        <div
                          key={`${skill.category}-${skill.name}`}
                          className={`group relative overflow-hidden rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 ${skillTheme[skill.category].border}`}
                        >
                          <div className="relative flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 flex-shrink-0 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                                {icon && (
                                  <img
                                    src={getSkillIconUrl(icon)}
                                    alt=""
                                    loading="lazy"
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
                                  className="items-center justify-center text-[9px] font-bold text-slate-700 dark:text-slate-300 leading-none"
                                  style={{ display: icon ? 'none' : 'flex' }}
                                >
                                  {getSkillInitials(skill.name)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{skill.name}</p>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">{skillTheme[skill.category].label}</p>
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

              {/* LEADERSHIP */}
              <Reveal className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-950 dark:text-white">
                    <Users className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    Leadership & Student Organizations
                  </h3>
                  <p className="text-sm text-slate-500">Community learning, cloud exposure, and developer events.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LEADERSHIP.map((item, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600">
                      <div className="relative mb-5 flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-mono text-slate-800 dark:text-slate-300">
                          0{i + 1}
                        </div>
                        <span className="rounded-full border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 py-1 text-xs font-mono text-slate-600 dark:text-slate-400">{item.year}</span>
                      </div>
                      <h4 className="relative text-lg font-bold text-slate-950 dark:text-white">{item.org}</h4>
                      <p className="relative mt-1 text-slate-600 dark:text-slate-400 text-sm">{item.role}</p>
                      <p className="relative mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* RESTORED ACCENTED INTERESTS SECTION */}
              <Reveal className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-950 dark:text-white">
                    <Heart className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    Interests
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    The areas I keep exploring when I build, lead, and polish software.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4">
                  {INTERESTS.map((interest, i) => (
                    <div
                      key={interest.title}
                      className={`group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-900/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 dark:hover:border-white/30 ${i === 0 || i === 3 ? 'lg:col-span-2' : ''}`}
                    >
                      {/* Gradient Overlay restored */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${interest.accent} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}></div>
                      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-slate-400 dark:via-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex h-full min-h-36 flex-col justify-between gap-8">
                        <span className="w-fit rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-950/50 px-3 py-1 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {interest.marker}
                        </span>
                        <div>
                          <h4 className="text-lg font-bold text-slate-950 dark:text-white">{interest.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{interest.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* FEATURED PROJECTS */}
          <section id="projects" className="py-32 border-t border-slate-300 dark:border-slate-900">
            <div className="space-y-16">
              <Reveal className="space-y-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-950 dark:text-white">
                  Featured <span className="text-slate-500">Projects</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                  A selection of recent work showcasing my approach to building modern, scalable applications.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {PROJECTS.map((project) => (
                  <Reveal key={project.title} className="h-full">
                    <FeaturedProjectCard {...project} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT FORM */}
          <section id="contact" className="pt-32 pb-12 border-t border-slate-300 dark:border-slate-900">
            <Reveal as="div" className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-950 dark:text-white">
                      Let's Create
                      <br />
                      <span className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-900 dark:from-slate-200 dark:via-slate-400 dark:to-slate-600 bg-clip-text text-transparent">
                        Something Great
                      </span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                      I'm currently open for internships and freelance projects. 
                      Whether you have a question or just want to say hi, I'll get back to you as soon as possible.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="group bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 rounded-xl p-6 hover:border-slate-400 dark:hover:border-slate-700 transition-all shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                        </div>
                        <div>
                          <h3 className="text-slate-950 dark:text-white font-semibold mb-1">Email</h3>
                          <a href="mailto:khristianangelo.tiu@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors text-sm">
                            khristianangelo.tiu@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 rounded-xl p-6 hover:border-slate-400 dark:hover:border-slate-700 transition-all shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                        </div>
                        <div>
                          <h3 className="text-slate-950 dark:text-white font-semibold mb-1">Location</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">Manila, Philippines</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-slate-500 text-sm mb-4">Connect with me</p>
                    <div className="flex items-center gap-4">
                      <a 
                        href="https://github.com/khristianangelo18" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center hover:border-slate-400 dark:hover:border-slate-600 transition-all group shadow-sm"
                      >
                        <Github className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center hover:border-slate-400 dark:hover:border-slate-600 transition-all group shadow-sm"
                      >
                        <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="h-16">
                    {submitStatus === 'success' && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 animate-fade-in">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">Message sent successfully! I'll get back to you soon.</p>
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 animate-fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">Failed to send message. Please try again or contact me directly.</p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-300 dark:border-slate-800 rounded-xl p-8 space-y-6 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-slate-700 dark:text-slate-400 text-sm font-medium">Your Name</label>
                          <input 
                            {...register("name")}
                            type="text" 
                            placeholder="Your Name" 
                            className={`w-full bg-slate-50 dark:bg-slate-950 border ${errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'} rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors`}
                            disabled={isSubmitting}
                          />
                          {errors.name && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-slate-700 dark:text-slate-400 text-sm font-medium">Your Email</label>
                          <input 
                            {...register("email")}
                            type="email" 
                            placeholder="your.email@example.com" 
                            className={`w-full bg-slate-50 dark:bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'} rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors`}
                            disabled={isSubmitting}
                          />
                          {errors.email && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-slate-700 dark:text-slate-400 text-sm font-medium">Subject</label>
                        <input 
                          {...register("subject")}
                          type="text" 
                          placeholder="Project Inquiry" 
                          className={`w-full bg-slate-50 dark:bg-slate-950 border ${errors.subject ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'} rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors`}
                          disabled={isSubmitting}
                        />
                        {errors.subject && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-slate-700 dark:text-slate-400 text-sm font-medium">Message</label>
                        <textarea 
                          {...register("message")}
                          placeholder="What is it..."
                          rows="6"
                          className={`w-full bg-slate-50 dark:bg-slate-950 border ${errors.message ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'} rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors resize-none`}
                          disabled={isSubmitting}
                        ></textarea>
                        {errors.message && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.message.message}</p>}
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        <span className="relative z-10">
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 text-cyan-400" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="relative border-t border-slate-300 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                    <img 
                      src="/images/profile.jpg" 
                      alt="Khristian Angelo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-slate-950 dark:text-white font-bold">Khristian Angelo</h3>
                    <p className="text-slate-500 text-xs">Software Engineer</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Building exceptional digital experiences through code and creativity.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-slate-950 dark:text-white font-semibold text-sm">Quick Links</h4>
                <div className="flex flex-col gap-3 text-sm">
                  <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">Home</a>
                  <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">About</a>
                  <a href="#projects" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">Projects</a>
                  <a href="#contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">Contact</a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-slate-950 dark:text-white font-semibold text-sm">Connect</h4>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/khristianangelo18" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm">
                    <Github className="w-4 h-4 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white" />
                  </a>
                  <a href="https://www.linkedin.com/in/khristian-angelo-tiu-878863312/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg flex items-center justify-center hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm">
                    <Linkedin className="w-4 h-4 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-300 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">© 2026 Khristian Angelo Tiu. All rights reserved.</p>
              <p className="text-slate-600 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Built with React & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
        <PortfolioChatbot />
      </div>
    </div>
  );
}