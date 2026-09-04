import {
  Code, Terminal, FileCode, Coffee, Smartphone,
  RefreshCw, ListChecks, Laptop
} from 'lucide-react';
import {
  SiJavascript, SiPython, SiCplusplus, SiMysql, SiHtml5, SiXml, SiKotlin, SiPhp,
  SiNextdotjs, SiReact, SiNodedotjs, SiTailwindcss,
  SiGithub, SiGooglecloud, SiFigma, SiSupabase, SiPostman, SiPostgresql, SiVite, SiJira, SiVercel
} from 'react-icons/si';
import { TbBrandCSharp, TbBrandCss3, TbCoffee, TbBrandAndroid, TbAgile } from 'react-icons/tb';
import { VscCode, VscProject } from 'react-icons/vsc';

export const PROJECTS = [
  { 
    title: "TechSync", 
    subtitle: "AI-Powered Developer Collaboration & Upskilling Platform",
    description: "An end-to-end platform with an AI skill-matching algorithm that pairs developers for peer code reviews and collaboration.", 
    overview: "Designed and engineered an end-to-end web platform featuring an AI skill-matching algorithm to pair developers for peer code reviews and project collaboration. Built with modern Next.js, Node.js, and PostgreSQL with an emphasis on seamless UI execution and high performant workflows.",
    features: [
      "AI skill-matching algorithm pairs developers by complementary strengths for peer code reviews",
      "Collaboration workspace built for real project handoffs, not just chat",
      "Responsive Next.js + React front end tuned for fast, seamless navigation",
      "PostgreSQL backend database structure for efficient skill and account aggregation"
    ],
    tags: ["React", "Next.js", "Node.js", "PostgreSQL"], 
    link: "https://tech-sync-remastered.vercel.app/",
    github: "https://github.com/khristianangelo18/TechSync",
    isCapstone: true,
    status: "Live",
    team: "2-Person Team"
  },
  { 
    title: "Athlete Pulse", 
    subtitle: "Workout & Nutrition Tracking Web & Mobile App",
    description: "High-performance fitness and macro nutrition progressive web application featuring custom workout routine splits, live exercise logging, and local data persistence.", 
    overview: "Engineered Athlete Pulse, a modern fitness and nutrition tracking web and mobile application built with React Native and Expo. Developed to give athletes full control over training splits, volume progression, and daily macronutrient targets, featuring interactive exercise logging, automated workout receipt generation, and a 100% private local-first storage architecture.",
    features: [
      "Custom routine and split builder with targeted muscle groups, volume, and rep goals",
      "Real-time active workout logger with set completion tracking and dynamic volume tallying",
      "Daily energy and macro nutrition dashboard (Calories, Protein, Carbs, Fat) with visual target gauges",
      "Shareable workout receipt summary generator rendered with automated canvas export",
      "Local-first privacy architecture with complete JSON data backup and restore capabilities"
    ],
    tags: ["React Native", "Expo", "JavaScript", "TailwindCSS"], 
    link: "https://athlete-pulse-app.vercel.app/",
    github: "https://github.com/khristianangelo18/fitness-app",
    isCapstone: false,
    status: "Live",
    team: "Solo Developer"
  },
  { 
    title: "3Whites", 
    subtitle: "AI & AR Powerlifting Progress Tracker",
    description: "AI-driven powerlifting and progress tracking Android application featuring real-time AR bar path visualization and dynamic lift analysis.", 
    overview: "Designed an Android application focused on precision powerlifting tracking. Integrates AR Core for real-time visual bar path tracking and posture alignment analysis to give powerlifters immediate bio-mechanical feedback during training sessions.",
    features: [
      "Real-time AR bar path tracking utilizing AR Core camera overlay",
      "Dynamic velocity and movement trajectory analysis per repetition",
      "Native Android interface crafted with Kotlin in Android Studio",
      "Custom powerlifting progress logging and performance breakdown"
    ],
    tags: ["Kotlin", "AR Core", "Android Studio"], 
    link: "",
    github: "https://github.com/khristianangelo18/3whites-mobileapp",
    isCapstone: false,
    status: "Completed",
    team: "Mobile App"
  },
];

export const SKILLS = {
  languages: ["JavaScript", "Python", "C++", "C#", "Java", "SQL", "HTML5", "CSS3", "XML", "Kotlin", "PHP"],
  frameworks: ["Next.js", "React", "React Native", "Node.js", "TailwindCSS"],
  tools: ["GitHub", "Google Cloud", "VS Code", "Figma", "Supabase", "Android Studio", "Postman", "PostgreSQL", "Vite", "Jira", "AGILE", "Scrum", "Vercel", "Expo"]
};

export const SKILL_ICONS = {
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
  "React Native": { source: 'simple', slug: 'react' },
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
  "Vercel": { source: 'simple', slug: 'vercel', invertInDarkMode: true },
  "Expo": { source: 'simple', slug: 'expo', invertInDarkMode: true }
};

export const EDUCATION = [
  {
    school: "Pamantasan ng Lungsod ng Maynila",
    degree: "Bachelor of Science in Information Technology",
    year: "2022 - Present",
    achievement: "Magna Cum Laude"
  },
  {
    school: "Mariano Marcos Memorial High School",
    degree: "Science, Technology, Engineering, and Mathematics",
    year: "2020 - 2022",
    achievement: "Graduated with High Honors"
  }
];

export const WORK_EXPERIENCE = [
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

export const INTERESTS = [
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

export const LEADERSHIP = [
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