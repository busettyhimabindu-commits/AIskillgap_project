import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SkillBadge } from '../components/SkillBadge';
import { 
  User, GraduationCap, Award, FolderGit2, Plus, Trash2, Save, Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'skills' | 'certs' | 'projects'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Form states
  const [personalForm, setPersonalForm] = useState({
    phone: '', location: '', bio: '', github_url: '', linkedin_url: ''
  });

  const [skillForm, setSkillForm] = useState({
    name: '', category: 'Languages', proficiency: 'Intermediate', years_exp: 1.0
  });

  const [eduForm, setEduForm] = useState({
    degree: 'B.Tech Computer Science & Engineering', institution: 'MITS University', branch: 'CSE', cgpa: 8.5, graduation_year: 2026
  });

  const [certForm, setCertForm] = useState({
    title: '', issuing_organization: '', issue_date: '', credential_url: ''
  });

  const [projForm, setProjForm] = useState({
    title: '', description: '', tech_stack: '', github_url: '', live_url: ''
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
      setPersonalForm({
        phone: res.data.phone || '',
        location: res.data.location || '',
        bio: res.data.bio || '',
        github_url: res.data.github_url || '',
        linkedin_url: res.data.linkedin_url || ''
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdatePersonal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', personalForm);
      setStatusMsg("Personal info updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    try {
      await api.post('/profile/skills', skillForm);
      setSkillForm({ name: '', category: 'Languages', proficiency: 'Intermediate', years_exp: 1.0 });
      setStatusMsg("Skill added successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/profile/skills/${id}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEdu = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profile/education', eduForm);
      setStatusMsg("Education added!");
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!certForm.title) return;
    try {
      await api.post('/profile/certifications', certForm);
      setCertForm({ title: '', issuing_organization: '', issue_date: '', credential_url: '' });
      setStatusMsg("Certification added!");
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projForm.title) return;
    try {
      await api.post('/profile/projects', projForm);
      setProjForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '' });
      setStatusMsg("Project added!");
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
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
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Profile Management</h1>
          <p className="text-sm text-slate-400">Keep your personal info, education, skills, certs, and projects up to date.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Profile Verified
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <User className="w-4 h-4" /> Personal & Edu
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'skills' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-400" /> Technical Skills ({profile?.student_skills?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('certs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'certs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" /> Certifications ({profile?.certifications?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FolderGit2 className="w-4 h-4 text-cyan-400" /> Portfolio Projects ({profile?.projects?.length || 0})
        </button>
      </div>

      {/* Tab 1: Personal & Education */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <form onSubmit={handleUpdatePersonal} className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" /> Personal Details
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={personalForm.phone}
                onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                placeholder="+1 (555) 000-1234"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={personalForm.location}
                onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={personalForm.linkedin_url}
                onChange={(e) => setPersonalForm({ ...personalForm, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={personalForm.github_url}
                onChange={(e) => setPersonalForm({ ...personalForm, github_url: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Summary</label>
              <textarea
                rows={3}
                value={personalForm.bio}
                onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                placeholder="Aspiring Full Stack Engineer passionate about React, FastAPI, and AI applications..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Details
            </button>
          </form>

          {/* Education Form & List */}
          <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Educational Qualifications
            </h3>

            <form onSubmit={handleAddEdu} className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
              <input
                type="text"
                required
                value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                placeholder="Degree (e.g. Bachelor of Technology)"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                required
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                placeholder="Institution / University Name"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={eduForm.cgpa}
                  onChange={(e) => setEduForm({ ...eduForm, cgpa: parseFloat(e.target.value) })}
                  placeholder="CGPA (e.g. 8.5)"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
                <input
                  type="number"
                  value={eduForm.graduation_year}
                  onChange={(e) => setEduForm({ ...eduForm, graduation_year: parseInt(e.target.value) })}
                  placeholder="Graduation Year"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </form>

            <div className="space-y-3">
              {profile?.education_entries?.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{edu.degree}</h4>
                    <p className="text-slate-400">{edu.institution} • CGPA: {edu.cgpa} • {edu.graduation_year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Technical Skills */}
      {activeTab === 'skills' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-6">
          
          <form onSubmit={handleAddSkill} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g. React, Python, Docker"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Languages">Languages</option>
                <option value="Frameworks & Libraries">Frameworks & Libraries</option>
                <option value="Databases">Databases</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI / ML & Data Science">AI / ML & Data Science</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency</label>
              <select
                value={skillForm.proficiency}
                onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </form>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Your Technical Skills</h3>
            <div className="flex flex-wrap gap-2.5">
              {profile?.student_skills?.map((sk) => (
                <SkillBadge
                  key={sk.id}
                  skill={sk}
                  onDelete={() => handleDeleteSkill(sk.id)}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Certifications */}
      {activeTab === 'certs' && (
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-6">
          <form onSubmit={handleAddCert} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Title</label>
              <input
                type="text"
                required
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                placeholder="e.g. AWS Certified Developer"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization</label>
              <input
                type="text"
                required
                value={certForm.issuing_organization}
                onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
                placeholder="Amazon Web Services"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile?.certifications?.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{c.title}</h4>
                  <p className="text-xs text-slate-400">{c.issuing_organization}</p>
                </div>
                <Award className="w-6 h-6 text-amber-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Projects */}
      {activeTab === 'projects' && (
        <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-6">
          <form onSubmit={handleAddProject} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={projForm.title}
                onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                placeholder="Project Title"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                value={projForm.tech_stack}
                onChange={(e) => setProjForm({ ...projForm, tech_stack: e.target.value })}
                placeholder="Tech Stack (e.g. React, FastAPI, MySQL)"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <textarea
              rows={2}
              value={projForm.description}
              onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
              placeholder="Short description of what the project accomplishes..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            ></textarea>
            <button
              type="submit"
              className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile?.projects?.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                <h4 className="font-bold text-white text-sm">{p.title}</h4>
                <p className="text-xs text-slate-400">{p.description}</p>
                {p.tech_stack && (
                  <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/30">
                    {p.tech_stack}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
