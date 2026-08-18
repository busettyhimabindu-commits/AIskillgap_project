import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, FileText, Sparkles, Map, Search, Settings
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-indigo-400' },
    { label: 'Student Profile', path: '/profile', icon: User, color: 'text-emerald-400' },
    { label: 'Resume Parser', path: '/resume-upload', icon: FileText, color: 'text-purple-400' },
    { label: 'AI Skill Analyzer', path: '/analyzer', icon: Sparkles, color: 'text-pink-400' },
    { label: 'Career Roadmap', path: '/roadmap', icon: Map, color: 'text-cyan-400' },
    { label: 'Job Explorer', path: '/jobs', icon: Search, color: 'text-amber-400' },
    { label: 'Settings', path: '/settings', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col shrink-0 border-r border-slate-800 bg-slate-900/60 p-4 min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
        Core Navigation
      </div>
      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Career Goal Banner Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-indigo-300 uppercase">2026 Readiness</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Upload your resume and test against 15+ industry roles to generate a roadmap.
        </p>
      </div>
    </aside>
  );
};
