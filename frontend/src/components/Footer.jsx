import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-200">SkillGap AI</span> — Portfolio-Ready 2026 Engine
        </div>
        <p className="flex items-center gap-1">
          Built with React.js, Tailwind CSS, Python FastAPI & Scikit-learn
        </p>
        <p>© 2026 SkillGap AI. All rights reserved.</p>
      </div>
    </footer>
  );
};
