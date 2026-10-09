'use client';

import { useState, useEffect } from 'react';
import { Award, Calendar, ExternalLink, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import BorderGlow from '@/components/BorderGlow/BorderGlow';
import CertificateModal from '@/components/CertificateModal';

export default function CertificateCard({ certificate, theme }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const {
    title,
    issuer,
    issueDate,
    credentialId,
    image,
    fileUrl,
    skills,
    description,
    badge
  } = certificate;

  const amberColors = ['#f59e0b', '#fbbf24', '#d97706'];
  const amberGlow = '45 95 60';

  return (
    <>
      <BorderGlow
        colors={amberColors}
        glowColor={amberGlow}
        backgroundColor="transparent"
        borderRadius={16}
        edgeSensitivity={25}
        glowIntensity={1.1}
        fillOpacity={0}
        className="w-full h-full"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsModalOpen(true)}
          className="group relative w-full h-full flex flex-col justify-between rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-300/60 dark:border-slate-800/60 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg overflow-hidden text-left"
        >
          <div>
            {/* Certificate Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-mono text-slate-700 dark:text-slate-400 font-bold truncate">
                  {issuer}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3 text-slate-400" />
                {issueDate}
              </span>
            </div>

            {/* Certificate Image Preview */}
            <div className="relative h-48 sm:h-52 w-full bg-slate-950/5 dark:bg-slate-950/60 overflow-hidden flex items-center justify-center p-3 border-b border-slate-200/80 dark:border-slate-800">
              <img
                src={image}
                alt={`${title} preview`}
                className="w-full h-full object-contain rounded transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-mono font-bold shadow-lg backdrop-blur-sm">
                  <Eye className="w-3.5 h-3.5 text-cyan-500" />
                  View Credential
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-mono uppercase tracking-wider font-extrabold">
                  {badge || 'Certification'}
                </span>
                {credentialId && (
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                    {credentialId}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white transition-colors leading-snug">
                  {title}
                </h3>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-200/80 dark:border-slate-900 flex items-center justify-between">
            <div onClick={(e) => e.stopPropagation()}>
              <a
                href={fileUrl || image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-300 font-extrabold rounded text-xs transition-all shadow-xs"
              >
                <span>open credential</span>
                <ExternalLink className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </a>
            </div>

            <span className="flex items-center gap-1 text-xs font-mono text-slate-700 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200 transition-colors font-bold">
              details{' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-500 dark:text-amber-400" />
            </span>
          </div>
        </div>
      </BorderGlow>

      {isModalOpen && mounted && (
        <CertificateModal
          certificate={certificate}
          theme={theme}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
