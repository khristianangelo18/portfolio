'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail, Github, Linkedin, MapPin, GraduationCap, Award, Users, CheckCircle, AlertCircle, ExternalLink, Sparkles, Terminal, Facebook, Instagram } from 'lucide-react';

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
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

// Navbar Component
function Navbar() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 0; // Approximate navbar height
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex items-center bg-white text-black px-2 py-0.5 rounded-sm font-mono font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Terminal className="w-4 h-4 mr-1.5" />
            KAT // DEV-PM
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
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
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <ExternalLink className={`w-5 h-5 text-zinc-600 transition-all duration-300 ${isHovered ? 'text-blue-500 translate-x-1 -translate-y-1' : ''}`} />
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

// Main Landing Page
export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentRole, setCurrentRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [animatedSections, setAnimatedSections] = useState(new Set());
  const lastScrollY = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showHeroAnimations, setShowHeroAnimations] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const roles = ['Software Engineer', 'Project Manager', 'Frontend Developer'];
  const sectionRefs = useRef({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading screen effect
  useEffect(() => {
    // Animate progress from 0 to 100
    const duration = 2500; // 2.5 seconds
    const interval = 20; // Update every 20ms
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

    // First hide loading screen
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Then trigger hero animations after loading is done
    const heroTimer = setTimeout(() => {
      setShowHeroAnimations(true);
    }, 2600); // 100ms after loading screen disappears

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

  // Intersection Observer - only animate when scrolling DOWN
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY.current;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Always make section visible
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
            
            // Only mark as animated if scrolling down
            if (isScrollingDown) {
              setAnimatedSections((prev) => new Set([...prev, entry.target.id]));
            }
          } else {
            // Remove from both sets when out of view
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
            setAnimatedSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
        
        lastScrollY.current = currentScrollY;
      },
      { threshold: 0.15, rootMargin: '-80px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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
    languages: ["JavaScript", "Python", "C++", "C#", "Java", "SQL", "HTML", "Kotlin"],
    frameworks: ["Next.js", "React", "Node.js", "Kotlin"],
    tools: ["Git/GitHub", "Google Cloud", "VS Code", "Figma", "Supabase", "Android Studio", "Jira"]
  };

  const education = [
    {
      school: "Pamantasan ng Lungsod ng Maynila",
      degree: "Bachelor of Science in Information Technology",
      year: "2022 - Present",
      achievement: "Consistent Dean's Lister (GWA: 1.45)"
    },
    {
      school: "Mariano Marcos Memorial High School",
      degree: "Science, Technology, Engineering, and Mathematics",
      year: "2020 - 2022",
      achievement: "Graduated with High Honors"
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
    <div className="bg-zinc-950 min-h-screen text-white overflow-hidden">
      {/* Inject custom styles */}
      <style>{styles}</style>
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center">
          {/* Minimalist Loading Content */}
          <div className="text-center space-y-8 w-full max-w-md px-8">
            {/* Logo/Monogram */}
            <div className="relative inline-block">
              <div className="text-8xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  KAT
                </span>
              </div>
              {/* Underline animation */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-pulse"></div>
              </div>
            </div>
            
            {/* Loading Bar */}
            <div className="space-y-3">
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              
              {/* Percentage */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-mono">Loading portfolio...</span>
                <span className="text-blue-400 font-mono font-bold">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when loading is done */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div 
          className="fixed inset-0 opacity-30 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
          }}
        />

      <Navbar />
      
      <main className="relative max-w-7xl mx-auto px-6 pb-20">
        
        {/* Hero Section */}
        <section className="flex flex-col items-start justify-center min-h-screen pt-20 relative">
          <div className="space-y-8 max-w-4xl">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm backdrop-blur-sm ${showHeroAnimations ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0s' }}>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Available for new projects
            </div>

            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
                <div className={`${showHeroAnimations ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                  <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    KHRISTIAN
                  </span>
                </div>
                <div className={`${showHeroAnimations ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    ANGELO
                  </span>
                </div>
              </h1>
              
              <div className={`flex flex-wrap gap-3 ${showHeroAnimations ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                <span className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-300 backdrop-blur-sm flex items-center gap-2">
                  {currentRole}
                  <span className="inline-block w-[2px] h-4 bg-blue-500 animate-pulse"></span>
                </span>
              </div>
            </div>

            <p className={`text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-3xl ${showHeroAnimations ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              I craft <span className="text-white font-semibold">exceptional digital experiences</span> by 
              combining technical expertise with strategic thinking. Specializing in scalable frontend 
              architecture and seamless project execution.
            </p>

            <div className={`flex flex-wrap gap-4 pt-4 ${showHeroAnimations ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <a 
                href="#projects" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('projects');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">Explore My Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>

          <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce transition-opacity duration-500 ${showHeroAnimations ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <span className="text-xs text-zinc-600 font-mono">SCROLL</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
          </div>
        </section>

        {/* About Section */}
        <section 
          id="about" 
          ref={(el) => (sectionRefs.current['about'] = el)}
          className={`py-32 border-t border-zinc-900 ${
            animatedSections.has('about')
              ? 'opacity-100 translate-y-0 transition-all duration-1000' 
              : visibleSections.has('about')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Text Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold">
                    About <span className="text-zinc-600">Me</span>
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Results-driven Information Technology student with a strong focus on Frontend Development and 
                    Project Management. Proven experience in architecting AI-powered solutions, including Augmented 
                    Reality (AR) visualization tools and predictive algorithms using Decision Trees and Skill-Matching logic.
                  </p>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Manila, Philippines</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="/resume.pdf"
                    download="Khristian_Angelo_Tiu_Resume.pdf"
                    className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">Download CV</span>
                    <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                  
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('contact');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 border-2 border-zinc-700 hover:border-zinc-600 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-zinc-900/50 cursor-pointer"
                  >
                    <Mail className="w-5 h-5" />
                    Get In Touch
                  </a>
                </div>
              </div>

              {/* Right Side - Profile Picture */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative group">
                  {/* Animated gradient border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  
                  {/* Image container */}
                  <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border-4 border-zinc-900">
                    <img 
                      src="/images/aboutme.png" 
                      alt="Khristian Angelo Tiu" 
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div 
              className={`space-y-6 ${
                animatedSections.has('about')
                  ? 'opacity-100 translate-x-0 transition-all duration-1000 delay-200' 
                  : visibleSections.has('about')
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-10'
              }`}
            >
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-500" />
                Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700 transition-all">
                    <h4 className="text-lg font-bold text-white mb-1">{edu.school}</h4>
                    <p className="text-blue-400 text-sm mb-2">{edu.degree}</p>
                    <p className="text-zinc-500 text-sm mb-3">{edu.year}</p>
                    {edu.achievement && (
                      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-zinc-800">
                        <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-zinc-400">{edu.achievement}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills - Redesigned */}
            <div 
              className={`space-y-6 ${
                animatedSections.has('about')
                  ? 'opacity-100 translate-x-0 transition-all duration-1000 delay-300' 
                  : visibleSections.has('about')
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-10'
              }`}
            >
              <h3 className="text-2xl font-bold">Technical Skills</h3>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-xs font-mono text-blue-400 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      LANGUAGES
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.languages.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-xs text-zinc-300 hover:border-blue-500/50 hover:text-white transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-purple-400 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      FRAMEWORKS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.frameworks.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-xs text-zinc-300 hover:border-purple-500/50 hover:text-white transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-cyan-400 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      TOOLS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-xs text-zinc-300 hover:border-cyan-500/50 hover:text-white transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div 
              className={`space-y-6 ${
                animatedSections.has('about')
                  ? 'opacity-100 translate-y-0 transition-all duration-1000 delay-500' 
                  : visibleSections.has('about')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" />
                Leadership & Student Organizations
              </h3>
              <div className="space-y-4">
                {leadership.map((item, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{item.org}</h4>
                        <p className="text-blue-400 text-sm">{item.role}</p>
                      </div>
                      <span className="text-zinc-500 text-sm">{item.year}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section 
          id="projects" 
          ref={(el) => (sectionRefs.current['projects'] = el)}
          className={`py-32 border-t border-zinc-900 ${
            animatedSections.has('projects')
              ? 'opacity-100 translate-y-0 transition-all duration-1000' 
              : visibleSections.has('projects')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold">
                Featured <span className="text-zinc-600">Projects</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl">
                A selection of recent work showcasing my approach to building modern, scalable applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {myProjects.map((project, i) => (
                <div 
                  key={project.title}
                  className={`${
                    animatedSections.has('projects')
                      ? 'opacity-100 translate-y-0 transition-all duration-700'
                      : visibleSections.has('projects')
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: animatedSections.has('projects') ? `${i * 150}ms` : '0ms'
                  }}
                >
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          id="contact" 
          ref={(el) => (sectionRefs.current['contact'] = el)}
          className={`pt-32 pb-12 border-t border-zinc-900 ${
            animatedSections.has('contact')
              ? 'opacity-100 translate-y-0 transition-all duration-1000' 
              : visibleSections.has('contact')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-bold">
                    Let's Create
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20"></div>
                    <div className="relative bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-zinc-400 text-sm font-medium">Your Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe" 
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-zinc-400 text-sm font-medium">Your Email</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com" 
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-400 text-sm font-medium">Subject</label>
                        <input 
                          type="text" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Project Inquiry" 
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-400 text-sm font-medium">Message</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="What is it..."
                          rows="6"
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
                          required
                          disabled={isSubmitting}
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
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
                <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit">
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit">
                  Projects
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-zinc-400 hover:text-white transition-colors text-sm relative group w-fit">
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