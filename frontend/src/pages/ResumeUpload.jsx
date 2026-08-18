import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SkillBadge } from '../components/SkillBadge';
import { 
  UploadCloud, FileText, CheckCircle2, Sparkles, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setErrorMsg('');
    } else {
      setErrorMsg('Please select a valid PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setErrorMsg('');
    } else {
      setErrorMsg('Please drop a valid PDF file.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    setImportSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setParsedData(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to upload and parse resume PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;
    setImporting(true);
    try {
      const res = await api.post('/resume/import-parsed', parsedData);
      setImportSuccess(res.data.message);
      setTimeout(() => {
        navigate('/analyzer');
      }, 1500);
    } catch (err) {
      setErrorMsg('Failed to import parsed skills.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border border-slate-700/80 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NLP Extraction Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Resume Parser & Skill Tagger</h1>
        <p className="text-sm text-slate-400">
          Upload your PDF resume. Our NLP pipeline will extract technical skills, certifications, and projects automatically.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {importSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{importSuccess} Redirecting to AI Skill Analyzer...</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
              dragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-indigo-400" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                {file ? file.name : "Drag and drop your PDF resume here"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF format up to 10MB</p>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-file-input"
            />
            
            <label
              htmlFor="resume-file-input"
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Browse PDF File
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Parsing PDF Resume with NLP...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Upload & Parse Skills with AI
              </>
            )}
          </button>
        </form>

        {/* NLP Results Preview Panel */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Parsed Resume Results
            </h3>
            {parsedData && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {Math.round(parsedData.confidence_score * 100)}% Confidence
              </span>
            )}
          </div>

          {parsedData ? (
            <div className="space-y-6">
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Technical Skills ({parsedData.extracted_skills?.length || 0})</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.extracted_skills?.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} />
                  ))}
                </div>
              </div>

              {parsedData.extracted_certs?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Certifications</h4>
                  <div className="space-y-1">
                    {parsedData.extracted_certs.map((c, idx) => (
                      <p key={idx} className="text-xs text-amber-300 font-semibold">• {c}</p>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Raw Text Snippet Preview</h4>
                <p className="text-xs text-slate-300 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 max-h-32 overflow-y-auto">
                  {parsedData.text_preview}
                </p>
              </div>

              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {importing ? "Importing to Profile..." : "Import Extracted Skills to Profile"}
              </button>

            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">No resume parsed yet</p>
              <p className="text-xs text-slate-500">Upload a PDF resume to view AI skill extractions.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
