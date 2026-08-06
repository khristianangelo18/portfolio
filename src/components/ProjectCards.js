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
    <div className="relative bg-white/70 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-[11px] font-mono text-slate-700 dark:text-slate-400 truncate font-semibold">{domain}</span>
        </div>
      </div>

      <div className={`relative overflow-hidden ${tall ? 'h-64 sm:h-96' : 'h-48 sm:h-56'}`}>
        {image ? (
          <img src={image} alt={`${title} preview`} className="w-full h-full object-cover object-top" />
        ) : isExternalLink ? (
          <div className="absolute top-0 left-0 origin-top-left pointer-events-none" style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}>
            <iframe src={link} title={`${title} preview`} className="w-full h-full border-0" loading="lazy" sandbox="allow-same-origin allow-scripts" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-900 flex items-center justify-center text-slate-500 font-mono text-xs font-bold">
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded text-[10px] font-mono uppercase tracking-wider font-extrabold">
          Capstone Project
        </span>
      )}
      {team && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-[10px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-400 font-bold">
          <Users className="w-3 h-3 text-slate-600 dark:text-slate-400" />
          {team}
        </span>
      )}
      {status && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-[10px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-400 font-bold">
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
        <a href={link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${pad} bg-white dark:bg-slate-100 border border-slate-300 dark:border-slate-800 text-slate-900 font-extrabold rounded text-xs transition-all hover:bg-slate-50 dark:hover:bg-white shadow-xs`}>
          <span>visit project</span>
          <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-slate-900" />
        </a>
      )}
      {hasGithub && (
        <a href={github} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${pad} bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-300 font-extrabold rounded text-xs transition-all shadow-xs`}>
          <Github className="w-3.5 h-3.5" />
          <span>source code</span>
          <ExternalLink className="w-3 h-3 text-slate-500 dark:text-slate-400" />
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
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-slate-950 backdrop-blur-xl shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        <BrowserPreview title={title} link={link} image={image} tall />

        <div className="p-6 sm:p-10 space-y-6">
          <ProjectBadges team={team} status={status} isCapstone={project.isCapstone} />
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">{title}</h3>
            {subtitle && <p className="text-slate-600 dark:text-slate-400 font-mono text-sm mt-1">{subtitle}</p>}
          </div>
          <p className="text-slate-900 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">{overview || description}</p>

          {features && features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Key Features</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-900 dark:text-slate-300 leading-relaxed font-semibold">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 font-bold">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-300 font-mono font-bold">{tag}</span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-900">
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
  const hasLinks = (link && link !== 'javascript:void(0)' && link !== '#');

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        className="group relative w-full h-full flex flex-col justify-between rounded-2xl border border-slate-300/80 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5"
      >
        <div>
          <BrowserPreview title={title} link={link} image={image} />
          <div className="p-5 sm:p-6 space-y-3">
            <ProjectBadges team={team} status={status} isCapstone={isCapstone} />
            <div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white transition-colors">{title}</h3>
              {subtitle && <p className="text-slate-600 dark:text-slate-400 font-mono text-xs mt-0.5 font-semibold">{subtitle}</p>}
            </div>
            <p className="text-slate-800 dark:text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">{description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-white/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md text-[11px] text-slate-900 dark:text-slate-400 font-mono font-bold">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-200/80 dark:border-slate-900 flex items-center justify-between gap-4">
          <div>{hasLinks ? <ProjectLinks link={link} github={github} /> : <span className="text-[11px] font-mono text-slate-500 font-bold">Mobile App</span>}</div>
          <span className="flex items-center gap-1 text-xs font-mono text-slate-700 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200 transition-colors font-bold">
            details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-blue-600 dark:text-cyan-400" />
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
        className="group relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-md border border-slate-300/80 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col justify-between p-5 cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border border-slate-300 dark:border-slate-700/50">
              <Sparkles className="w-4 h-4 text-slate-800 dark:text-slate-300" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-700 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200 transition-colors font-bold">
              details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-blue-600 dark:text-cyan-400" />
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white transition-colors">
              {title}
            </h3>
            {subtitle && <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">{subtitle}</p>}
          </div>

          <p className="text-slate-800 dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-900 mt-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-[10px] text-slate-900 dark:text-slate-400 font-mono font-bold">
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