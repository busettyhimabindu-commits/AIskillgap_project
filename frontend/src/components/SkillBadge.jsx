import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const SkillBadge = ({ skill, status = 'default', priority, onDelete }) => {
  const name = typeof skill === 'string' ? skill : skill.name;
  const category = typeof skill === 'object' ? skill.category : null;
  const proficiency = typeof skill === 'object' ? skill.proficiency : null;

  // Category Color Map
  const categoryColors = {
    'Languages': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Frameworks & Libraries': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'Databases': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Cloud & DevOps': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'AI / ML & Data Science': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    'Soft Skills': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  let badgeStyle = categoryColors[category] || 'bg-slate-800 text-slate-300 border-slate-700';

  if (status === 'matched') {
    badgeStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10';
  } else if (status === 'missing') {
    badgeStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${badgeStyle}`}>
      {status === 'matched' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
      {status === 'missing' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
      <span>{name}</span>

      {proficiency && (
        <span className="text-[10px] opacity-75 font-normal px-1 py-0.2 rounded bg-slate-900/40">
          {proficiency}
        </span>
      )}

      {priority && (
        <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
          priority === 'High' ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'
        }`}>
          {priority}
        </span>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 text-slate-400 hover:text-rose-400 font-bold focus:outline-none"
        >
          ×
        </button>
      )}
    </div>
  );
};
