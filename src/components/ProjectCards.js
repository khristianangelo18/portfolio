'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Users, CheckCircle, ExternalLink, Github, ArrowRight, X, Sparkles } from 'lucide-react';

export function BrowserPreview({ title, link, image, tall = false }) {
  const isExternalLink = link && link !== 'javascript:void(0)' && link !== '#';

  const domain = useMemo(() => {
    try {
      return new URL(link).hostname.replace('www.', '');
    } catch {
      return 'preview.local';
    }
  }, [link]);

  return (
    <div className="relative bg-zinc-950 border-b border-zinc-800/80 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0 px-3 py-0.5 rounded border border-zinc-800 bg-zinc-950">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-[11px] font-mono text-zinc-400 truncate">{domain}</span>
        </div>
      </div>

      <div className={`relative overflow-hidden ${tall ? 'h-64 sm:h-96' : 'h-48 sm:h-56'}`}>
        {image ? (
          <img src={image} alt={`${title} landing page preview`} className="w-full h-full object-cover object-top" />
        ) : isExternalLink ? (
          <div className="absolute top-0 left-0 origin-top-left pointer-events-none" style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}>
            <iframe src={link} title={`${title} live preview`} className="w-full h-full border-0" loading="lazy" sandbox="allow-same-origin allow-scripts" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-500 font-mono text-xs">
            [ Site Preview Unavailable ]
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectBadges({ team, status, isCapstone = false }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isCapstone && (
        <span className="capstone-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded text-[10px] font-mono uppercase tracking-wider font-medium">
          Capstone Project
        </span>
      )}
      {team && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900/60 dark:bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          <Users className="w-3 h-3" />
          {team}
        </span>
      )}
      {status && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900/60 dark:bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {status}
        </span>
      )}
    </div>
  );
}

export function ProjectLinks({ link, github, size = 'md' }) {
  const isExternalLink = link && link !== 'javascript:void(0)' && link !== '#';
  const hasGithub = !!github;
  const pad = size === 'lg' ? 'px-4 py-2.5' : 'px-3 py-1.5';

  if (!isExternalLink && !hasGithub) return null;

  return (
    <div className="flex flex-wrap gap-2.5" onClick={(e) => e.stopPropagation()}>
      {isExternalLink && (
        <a href={link} target="_blank" rel="noopener noreferrer" className={`visit-project-btn inline-flex items-center gap-2 ${pad} font-semibold rounded text-xs transition-colors`}>
          <span>visit project</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
      {hasGithub && (
        <a href={github} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${pad} bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium rounded text-xs transition-colors`}>
          <Github className="w-3.5 h-3.5" />
          <span>source code</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>
      )}
    </div>
  );
}

export function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const { title, subtitle, overview, description, features, tags, link, image, status, team, github } = project;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} aria-label="Close project details" className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        <BrowserPreview title={title} link={link} image={image} tall />

        <div className="p-6 sm:p-10 space-y-6">
          <ProjectBadges team={team} status={status} isCapstone={project.isCapstone} />
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">{title}</h3>
            {subtitle && <p className="text-zinc-400 font-mono text-sm mt-1">{subtitle}</p>}
          </div>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{overview || description}</p>

          {features && features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Key Features</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded border border-zinc-800/80 bg-zinc-900/60 p-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-zinc-300 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 font-mono">{tag}</span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900">
            <ProjectLinks link={link} github={github} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProjectCard(project) {
  const { title, subtitle, description, tags, link, image, status, team, github, isCapstone } = project;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const hasLinks = (link && link !== 'javascript:void(0)' && link !== '#') || !!github;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        className="group relative w-full h-full flex flex-col justify-between rounded-xl border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/50 overflow-hidden transition-all cursor-pointer"
      >
        <div>
          <BrowserPreview title={title} link={link} image={image} />
          <div className="p-5 sm:p-6 space-y-3">
            <ProjectBadges team={team} status={status} isCapstone={isCapstone} />
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">{title}</h3>
              {subtitle && <p className="text-zinc-400 font-mono text-xs mt-0.5">{subtitle}</p>}
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-400 font-mono">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-zinc-900 flex items-center justify-between gap-4">
          <div>{hasLinks ? <ProjectLinks link={link} github={github} /> : <span className="text-[11px] font-mono text-zinc-600">Mobile App</span>}</div>
          <span className="flex items-center gap-1 text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
            details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {isModalOpen && mounted && createPortal(<ProjectModal project={project} onClose={() => setIsModalOpen(false)} />, document.body)}
    </>
  );
}

export function ProjectCard(project) {
  const { title, subtitle, description, tags, link, github } = project;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 rounded-xl overflow-hidden transition-all h-full flex flex-col justify-between p-5 cursor-pointer"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
              <Sparkles className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
              details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
              {title}
            </h3>
            {subtitle && <p className="text-xs font-mono text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-900 mt-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-400 font-mono">
                {tag}
              </span>
            ))}
          </div>

          <ProjectLinks link={link} github={github} />
        </div>
      </div>

      {isModalOpen && mounted && createPortal(
        <ProjectModal project={project} onClose={() => setIsModalOpen(false)} />,
        document.body
      )}
    </>
  );
}