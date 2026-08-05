'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowRight, Mail, Github, Linkedin, MapPin, GraduationCap, 
  Award, Users, CheckCircle, AlertCircle, Briefcase, Heart, 
  Code2, Layers, Wrench, Filter, Facebook, Instagram 
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

  const visibleSkills = Object.entries(SKILLS)
    .filter(([category]) => activeSkillFilter === 'all' || activeSkillFilter === category)
    .flatMap(([category, items]) => items.map((name) => ({ name, category })));

  return (
    <div className={`theme-root ${theme === 'light' ? 'theme-light' : 'theme-dark'} bg-zinc-950 min-h-screen text-white overflow-hidden`}>
      <div className="fixed inset-0 z-0 pointer-events-none bg-split-tone">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.02)_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {isLoading && (
        <div className="theme-loading-screen fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
          </div>

          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

          <div className="relative text-center space-y-12 w-full max-w-5xl px-6 sm:px-8">
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
            
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="relative">
                <div className="theme-loading-track w-full h-2.5 bg-zinc-900/80 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
                  <div 
                    className="theme-loading-bar h-full bg-white rounded-full transition-all duration-300 ease-out relative overflow-hidden shadow-lg shadow-white/20"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100 to-transparent opacity-60"
                      style={{
                        animation: 'shimmer 1.5s ease-in-out infinite',
                      }}
                    ></div>
                  </div>
                </div>
                
                <div 
                  className="theme-loading-glow absolute -bottom-1 left-0 h-4 bg-white/20 blur-xl rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>

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

          <section id="about" className="py-32 border-t border-zinc-900">
            <div className="space-y-16">
              <div className="space-y-4">
                <h2 className="theme-section-title text-4xl sm:text-5xl md:text-6xl font-bold">
                  About <span className="theme-heading-muted text-zinc-600">Me</span>
                </h2>
              </div>
              <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-zinc-400/10 via-white/10 to-zinc-600/10 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative w-[350px] h-[350px] sm:w-[380px] sm:h-[380px]">
                      <TiltedCard
                        imageSrc="/images/aboutme.jpg"
                        altText="Khristian Angelo Tiu"
                        captionText="Khristian Angelo Tiu"
                        containerClassName="w-full h-full shadow-2xl"
                        imageClassName="w-full h-full object-cover rounded-2xl"
                        rotateAmplitude={12}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip={true}
                      />
                    </div>
                  </div>
                </div>

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
                    {EDUCATION.map((edu, i) => (
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
                  {WORK_EXPERIENCE.map((job, i) => (
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
                <div className="w-full relative py-4 overflow-hidden select-none group/loop">
                  <LogoLoop
                    logos={technicalStackLogos}
                    speed={60}
                    direction="right"
                    logoHeight={32}
                    gap={55}
                    hoverSpeed={15}
                    scaleOnHover={true}
                    fadeOut={true}
                    fadeOutColor={theme === 'dark' ? '#09090b' : '#f8fafc'}
                    ariaLabel="Technical Stack Rotation Timeline"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/45 p-5 md:p-6">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent"></div>
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    {Object.entries(SKILLS).map(([category, items]) => (
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
                      const icon = SKILL_ICONS[skill.name];
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
                  {LEADERSHIP.map((item, i) => (
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
                  {INTERESTS.map((interest, i) => (
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

          <section id="projects" className="py-32 border-t border-zinc-900">
            <div className="space-y-16">
              <Reveal className="space-y-4">
                <h2 className="theme-section-title text-4xl sm:text-5xl md:text-6xl font-bold">
                  Featured <span className="theme-heading-muted text-zinc-600">Projects</span>
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl">
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

          <section id="contact" className="pt-32 pb-12 border-t border-zinc-900">
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
        <PortfolioChatbot />
      </div>
    </div>
  );
}