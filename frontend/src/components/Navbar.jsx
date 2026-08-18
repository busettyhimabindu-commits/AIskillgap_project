import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, Sun, Moon, LogOut, User as UserIcon, 
  LayoutDashboard, Map, Search, FileText, Settings as SettingsIcon, Menu, X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            SkillGap <span className="gradient-text-indigo">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                Dashboard
              </Link>
              <Link to="/analyzer" className="text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Skill Analyzer
              </Link>
              <Link to="/roadmap" className="text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5">
                <Map className="w-4 h-4 text-emerald-400" />
                Roadmap
              </Link>
              <Link to="/jobs" className="text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400" />
                Job Explorer
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-slate-300 hover:text-white font-medium text-sm">Home</Link>
              <Link to="/jobs" className="text-slate-300 hover:text-white font-medium text-sm">Explore Roles</Link>
            </>
          )}
        </nav>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:border-indigo-500/50 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {user?.full_name?.charAt(0) || 'S'}
                </div>
                <span className="text-sm font-semibold hidden sm:inline">{user?.full_name}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-700/60">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/resume-upload"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  >
                    <FileText className="w-4 h-4 text-purple-400" />
                    Resume Parser
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    Account Settings
                  </Link>
                  <div className="border-t border-slate-700/60 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Dashboard</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Student Profile</Link>
              <Link to="/resume-upload" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Resume Upload</Link>
              <Link to="/analyzer" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Skill Analyzer</Link>
              <Link to="/roadmap" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Career Roadmap</Link>
              <Link to="/jobs" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white font-medium">Job Explorer</Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 font-medium">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-indigo-400 font-medium">Create Account</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
