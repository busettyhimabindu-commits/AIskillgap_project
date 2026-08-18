import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Map, FileText, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 AI Placement Readiness Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto"
          >
            Bridge Your Skill Gap. <br />
            <span className="gradient-text-indigo">Land Your Target Tech Job.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Upload your PDF resume, parse technical skills using AI NLP, compare against 15+ industry standard roles with Scikit-learn similarity models, and generate a step-by-step career learning roadmap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 text-base"
            >
              Analyze Your Skill Gap
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold rounded-2xl transition-all text-base"
            >
              Explore Job Requirements
            </Link>
          </motion.div>

          {/* Feature Badge Strip */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Scikit-learn Cosine Matching</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF Resume Text Parser</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Placement Readiness Score</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ReportLab PDF Export</span>
          </div>

          {/* Interactive Mock Dashboard Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-8 max-w-5xl mx-auto"
          >
            <div className="rounded-3xl bg-slate-900/80 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-2xl text-left grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Match Percentage</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">78.5%</div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[78.5%] rounded-full"></div>
                </div>
                <p className="text-xs text-slate-400">Target Role: Full Stack Developer</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Readiness Score</span>
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">82.0 / 100</div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%] rounded-full"></div>
                </div>
                <p className="text-xs text-slate-400">Status: Placement Ready</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Top Missing Skills</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">FastAPI</span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">Docker</span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">AWS</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Modules Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Everything You Need for Career Placement</h2>
          <p className="text-slate-400 text-sm">Powered by modern machine learning vectorization and NLP resume parsing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">1. AI Resume Parser</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Extract technical skills, certifications, education, and portfolio projects directly from PDF resumes using regex boundary taxonomy matching.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-purple-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">2. Scikit-learn TF-IDF Analyzer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compute mathematical Cosine Similarity between candidate vectors and target role requirement sets. Get exact matching vs missing skills.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-emerald-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
              <Map className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">3. Phased Career Roadmap</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Get week-by-week learning milestones, recommended industry certs, and real-world portfolio project ideas to bridge your gap.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
