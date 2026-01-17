'use client';

import { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function ProjectCard({ title, description, tags, link, gradient }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Animated border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <ExternalLink className={`w-5 h-5 text-zinc-600 transition-all duration-300 ${isHovered ? 'text-blue-500 translate-x-1 -translate-y-1' : ''}`} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
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