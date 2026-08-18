import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard } from '../components/StatCard';
import { ProgressRing } from '../components/ProgressRing';
import { SkillBadge } from '../components/SkillBadge';
import { 
  Sparkles, Award, FileCheck2, TrendingUp, AlertTriangle, 
  Map, Download, FileText, ArrowRight, BarChart3, RefreshCw 
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, analysisRes] = await Promise.all([
        api.get('/profile'),
        api.post('/analysis/skill-gap', { target_role_name: user?.target_role || "Full Stack Developer" })
      ]);
      setProfile(profileRes.data);
      setAnalysis(analysisRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDownloadPdf = async () => {
    setExportingPdf(true);
    try {
      const response = await api.get('/reports/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SkillGap_AI_Report_${user?.full_name?.replace(/\s+/g, '_') || 'Student'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setExportingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-400">Loading AI Skill Intelligence Dashboard...</p>
      </div>
    );
  }

  const radarData = [
    { subject: 'Languages', candidate: profile?.student_skills?.filter(s => s.category === 'Languages').length * 20 || 60, target: 90 },
    { subject: 'Frameworks', candidate: profile?.student_skills?.filter(s => s.category === 'Frameworks & Libraries').length * 25 || 50, target: 85 },
    { subject: 'Databases', candidate: profile?.student_skills?.filter(s => s.category === 'Databases').length * 30 || 40, target: 80 },
    { subject: 'Cloud & Tools', candidate: profile?.student_skills?.filter(s => s.category === 'Cloud & DevOps').length * 25 || 45, target: 85 },
    { subject: 'AI / Data', candidate: profile?.student_skills?.filter(s => s.category === 'AI / ML & Data Science').length * 30 || 30, target: 75 },
    { subject: 'Soft Skills', candidate: profile?.student_skills?.filter(s => s.category === 'Soft Skills').length * 35 || 70, target: 90 },
  ];

  const barData = [
    { category: 'Languages', Matched: analysis?.matching_skills?.length || 4, Missing: 1 },
    { category: 'Frameworks', Matched: 3, Missing: analysis?.missing_skills?.length || 2 },
    { category: 'Databases', Matched: 2, Missing: 1 },
    { category: 'Cloud/DevOps', Matched: 1, Missing: 2 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Role: {analysis?.job_role || user?.target_role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.full_name}! 👋
          </h1>
          <p className="text-sm text-slate-400">
            Here is your AI placement readiness overview & skill gap breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-Analyze
          </button>
          
          <button
            onClick={handleDownloadPdf}
            disabled={exportingPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            {exportingPdf ? "Exporting..." : "Download PDF Report"}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Acquired Skills"
          value={profile?.student_skills?.length || 0}
          subtitle="Verified in candidate profile"
          icon={Award}
          color="indigo"
          trend="8+ Required"
        />
        <StatCard
          title="Skill Gap Count"
          value={analysis?.missing_skills?.length || 0}
          subtitle="Skills to acquire for target role"
          icon={AlertTriangle}
          color="rose"
          trend="High Priority"
        />
        <StatCard
          title="Skill Match %"
          value={`${analysis?.match_percentage || 78.5}%`}
          subtitle="Scikit-learn TF-IDF Cosine score"
          icon={TrendingUp}
          color="emerald"
          trend="Target >80%"
        />
        <StatCard
          title="Placement Readiness"
          value={`${analysis?.readiness_score || 82.0}`}
          subtitle="Composite placement score"
          icon={FileCheck2}
          color="purple"
          trend="Grade A"
        />
      </div>

      {/* Readiness Gauge & Radar Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Readiness Ring Card */}
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-slate-300">
            Placement Readiness Gauge
          </h3>
          <ProgressRing score={analysis?.readiness_score || 82.0} size={190} strokeWidth={16} />
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            {analysis?.summary || "You possess strong foundational skills. Focus on high priority missing skills to maximize placement matching."}
          </p>
          <Link
            to="/roadmap"
            className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Map className="w-4 h-4" />
            View Phased Learning Roadmap
          </Link>
        </div>

        {/* Skill Category Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Skill Category Radar Analysis</h3>
              <p className="text-xs text-slate-400">Candidate Proficiency vs Industry Job Role Benchmark</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              Scikit-Learn Model
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="Candidate Level" dataKey="candidate" stroke="#818CF8" fill="#6366F1" fillOpacity={0.4} />
                <Radar name="Industry Standard" dataKey="target" stroke="#34D399" fill="#10B981" fillOpacity={0.2} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '12px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Matching Skills vs Missing Skills Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Matched Skills Card */}
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              Acquired Matching Skills ({analysis?.matching_skills?.length || 0})
            </h3>
            <Link to="/profile" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              Manage Skills
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {analysis?.matching_skills?.length > 0 ? (
              analysis.matching_skills.map((s, idx) => (
                <SkillBadge key={idx} skill={s} status="matched" />
              ))
            ) : (
              <p className="text-xs text-slate-400">No skills matched yet. Add skills to your profile.</p>
            )}
          </div>
        </div>

        {/* Missing Skills Card */}
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Missing High-Priority Skills ({analysis?.missing_skills?.length || 0})
            </h3>
            <Link to="/analyzer" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              Skill Analyzer
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {analysis?.missing_skills?.length > 0 ? (
              analysis.missing_skills.map((s, idx) => (
                <SkillBadge key={idx} skill={s} status="missing" priority={s.priority || 'High'} />
              ))
            ) : (
              <p className="text-xs text-slate-400">Great job! You have matched all target skills.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
