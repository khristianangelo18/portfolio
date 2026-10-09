'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, Calendar, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CertificateModal({ certificate, onClose, theme }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!certificate) return null;

  const {
    title,
    issuer,
    issueDate,
    credentialId,
    instructor,
    authority,
    image,
    fileUrl,
    skills,
    description,
    badge
  } = certificate;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-slate-950 backdrop-blur-xl shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Image Banner */}
        <div className="relative bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-4 sm:p-6 group">
          <div className="relative max-h-[55vh] w-full flex items-center justify-center">
            <img
              src={image}
              alt={`${title} certificate`}
              className="max-h-[52vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-slate-200/80 dark:border-slate-800"
            />
          </div>
        </div>

        {/* Certificate Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                {badge || 'Verified Certificate'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md text-xs font-mono text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {issueDate}
              </span>
            </div>

            {credentialId && (
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                ID: <span className="font-semibold text-slate-800 dark:text-slate-200">{credentialId}</span>
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm sm:text-base font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              {issuer}
            </p>
            {(instructor || authority) && (
              <p className="mt-1 text-xs text-slate-500 font-mono">
                Issued by / Authority: {instructor || authority}
              </p>
            )}
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {description}
          </p>

          {skills && skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
                Skills & Topics Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-mono font-medium text-slate-800 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
            <a
              href={fileUrl || image}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-lg transition-all hover:opacity-90 shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Full Certificate</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
