import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SkillBadge } from '../components/SkillBadge';
import { Search, Filter, Briefcase, Award, FolderGit2, ArrowRight } from 'lucide-react';

export const JobExplorer = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const categories = ['All', 'Web Development', 'Artificial Intelligence', 'Data & Analytics', 'Cloud & Infrastructure', 'Security'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', {
        params: { q: search, category: activeCategory }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Job search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, activeCategory]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">2026 Industry Job Roles & Skill Explorer</h1>
        <p className="text-sm text-slate-400">Search top tech roles and explore industry skill requirements, average salaries, and recommended certs.</p>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role title, framework, or skill..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-bold border border-indigo-500/30">
                    {job.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{job.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{job.avg_salary} • {job.exp_level}</p>
                </div>
                <Briefcase className="w-6 h-6 text-slate-500 shrink-0" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills Taxonomy</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills_json?.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs font-medium text-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/analyzer')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                Analyze My Skills Against This Role <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
