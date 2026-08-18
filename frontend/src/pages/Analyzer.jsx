import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SkillBadge } from '../components/SkillBadge';
import { ProgressRing } from '../components/ProgressRing';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Target, Search, BarChart2 
} from 'lucide-react';

export const Analyzer = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchJobRoles = async () => {
    try {
      const res = await api.get('/jobs');
      setJobRoles(res.data);
      if (res.data.length > 0) {
        setSelectedRole(res.data[0]);
        runAnalysis(res.data[0].id);
      }
    } catch (err) {
      console.error("Job roles error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const runAnalysis = async (roleId) => {
    setAnalyzing(true);
    try {
      const res = await api.post('/analysis/skill-gap', { target_role_id: roleId });
      setAnalysisResult(res.data);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    runAnalysis(role.id);
  };

  const filteredRoles = jobRoles.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scikit-learn TF-IDF Machine Learning Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Skill Gap Analyzer</h1>
          <p className="text-sm text-slate-400">Select any target industry job role to calculate your match % and placement readiness score.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Role Selector */}
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Select Industry Job Role
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles e.g. Full Stack, AI..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredRoles.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelectRole(r)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedRole?.id === r.id
                    ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-700/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{r.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">{r.category}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{r.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: AI Analysis Output */}
        <div className="lg:col-span-2 space-y-6">
          
          {analyzing ? (
            <div className="p-12 rounded-3xl bg-slate-800/60 border border-slate-700/80 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-300">Calculating TF-IDF Cosine Similarity Vector...</p>
            </div>
          ) : analysisResult ? (
            <>
              {/* Match % & Readiness Score Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Match Percentage</span>
                  <div className="text-5xl font-extrabold text-indigo-400">{analysisResult.match_percentage}%</div>
                  <p className="text-xs text-slate-400">TF-IDF Vector Overlap</p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Readiness</span>
                  <div className="text-5xl font-extrabold text-emerald-400">{analysisResult.readiness_score}</div>
                  <p className="text-xs text-slate-400">Composite Readiness Score (0-100)</p>
                </div>

              </div>

              {/* Matching Skills */}
              <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Matching Acquired Skills ({analysisResult.matching_skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.matching_skills?.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} status="matched" />
                  ))}
                </div>
              </div>

              {/* Missing Skills with Priorities */}
              <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  Missing Skills Needed for Placement ({analysisResult.missing_skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missing_skills?.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} status="missing" priority={s.priority || 'High'} />
                  ))}
                </div>
              </div>

              {/* Generate Roadmap CTA Button */}
              <button
                onClick={() => navigate('/roadmap')}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all text-sm"
              >
                Generate Personalized Phased Career Roadmap
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : null}

        </div>

      </div>

    </div>
  );
};
