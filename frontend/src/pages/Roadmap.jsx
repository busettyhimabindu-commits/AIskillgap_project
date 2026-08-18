import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Map, CheckCircle2, Circle, ExternalLink, Sparkles, Award, FolderGit2, RefreshCw, Download 
} from 'lucide-react';

export const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roadmap');
      setRoadmap(res.data);
    } catch (err) {
      console.error("Roadmap fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleItem = async (itemId) => {
    try {
      await api.patch(`/roadmap/items/${itemId}`);
      fetchRoadmap();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleReGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/roadmap/generate');
      setRoadmap(res.data);
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRoadmap = () => {
    if (!roadmap) return;
    const jsonStr = JSON.stringify(roadmap, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Career_Roadmap_${roadmap.target_role?.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2">
            <Map className="w-3.5 h-3.5" />
            <span>Target Role: {roadmap?.target_role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Personalized Phased Career Roadmap</h1>
          <p className="text-sm text-slate-400">Step-by-step 12-week timeline to master missing skills and get placement ready.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReGenerate}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Roadmap
          </button>
          
          <button
            onClick={handleDownloadRoadmap}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Overall Roadmap Completion: {roadmap?.completed_items} / {roadmap?.total_items} Milestones
          </span>
          <span className="text-base font-extrabold text-indigo-400">{roadmap?.progress_percentage}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${roadmap?.progress_percentage || 0}%` }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800">
        {roadmap?.items?.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-start gap-4 pl-12"
          >
            {/* Timeline Circle */}
            <button
              onClick={() => handleToggleItem(item.id)}
              className="absolute left-3.5 top-3.5 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-white focus:outline-none"
            >
              {item.is_completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 bg-slate-900 rounded-full" />
              ) : (
                <Circle className="w-3 h-3 text-indigo-400" />
              )}
            </button>

            {/* Card Content */}
            <div className={`w-full p-6 rounded-2xl border transition-all ${
              item.is_completed
                ? 'bg-slate-900/40 border-slate-800 opacity-75'
                : 'bg-slate-800/60 border-slate-700/80 shadow-lg'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                  Week {item.week_number} • {item.phase_name}
                </span>
                {item.resource_url && (
                  <a
                    href={item.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-400"
                  >
                    Tutorial Resource <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              <h3 className={`text-base font-bold ${item.is_completed ? 'line-through text-slate-400' : 'text-white'}`}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommended Certifications & Portfolio Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Recommended Industry Certifications
          </h3>
          <div className="space-y-2">
            {roadmap?.recommended_certs?.map((cert, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs font-semibold text-amber-300">
                • {cert}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" /> Recommended Portfolio Projects
          </h3>
          <div className="space-y-3">
            {roadmap?.recommended_projects?.map((proj, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                <h4 className="font-bold text-white text-xs">{proj.title}</h4>
                <p className="text-[11px] text-slate-400">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
