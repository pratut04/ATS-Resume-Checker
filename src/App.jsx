import React, { useState, useCallback } from 'react';
import {
  Sparkles, RotateCcw, Loader2, AlertCircle, ArrowRight,
  BarChart2, Key, Layout, Lightbulb, Shield,
} from 'lucide-react';
import FileUploader from './components/FileUploader';
import ScoreGauge from './components/ScoreGauge';
import ScoreBreakdown from './components/ScoreBreakdown';
import SectionAnalysis from './components/SectionAnalysis';
import KeywordsPanel from './components/KeywordsPanel';
import Suggestions from './components/Suggestions';
import ContactAndStats from './components/ContactAndStats';
import { analyzeResume, extractText } from './utils/atsAnalyzer';

/* ─────────────────────────────────────────────────────────── */
const RESULT_TABS = [
  { id: 'overview', label: 'Overview', Icon: BarChart2 },
  { id: 'keywords', label: 'Keywords', Icon: Key },
  { id: 'sections', label: 'Sections', Icon: Layout },
  { id: 'suggestions', label: 'Suggestions', Icon: Lightbulb },
];

const FEATURES = [
  { emoji: '📊', title: 'ATS Score', desc: '0–100 compatibility score with category-level breakdown', color: '#7c3aed' },
  { emoji: '🎯', title: 'Keyword Match', desc: 'Detects 50+ technical, soft and business skills', color: '#06b6d4' },
  { emoji: '📋', title: 'Section Check', desc: 'Detects all 6 key resume sections ATS systems look for', color: '#10b981' },
  { emoji: '💡', title: 'Smart Tips', desc: 'Prioritized suggestions ranked Critical → High → Medium', color: '#f59e0b' },
];

/* ─────────────────────────────────────────────────────────── */
export default function App() {
  const [resumeText, setResumeText] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleText = useCallback((text) => { setResumeText(text); setError(''); setAnalysis(null); }, []);
  const handleError = useCallback((msg) => { setError(msg); setResumeText(null); setAnalysis(null); }, []);

  const runAnalysis = async () => {
    if (!resumeText) return;
    setIsAnalyzing(true); setError('');
    await new Promise(r => setTimeout(r, 480));
    try {
      setAnalysis(analyzeResume(extractText(resumeText), ''));
      setActiveTab('overview');
    } catch { setError('Analysis failed. Please try again.'); }
    finally { setIsAnalyzing(false); }
  };

  const reset = () => {
    setResumeText(null);
    setAnalysis(null);
    setError('');
    setActiveTab('overview');
    setUploaderKey(k => k + 1);
  };

  /* ═══════════════════════════════════════════════════════ */
  return (
    <>
      <div className="mesh-bg" />
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ╔══════════════════ NAV ════════════════════╗ */}
        <nav className="nav-root">
          <div className="nav-inner">

            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                <Sparkles className="w-4.5 h-4.5 text-white" strokeWidth={2} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-[15px] text-white tracking-tight leading-none">
                  ATS<span className="text-violet-400">Checker</span>
                </span>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[.14em] text-violet-400
                  bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">
                  AI
                </span>
              </div>
            </div>

            {/* Step indicator — desktop */}
            <div className="hidden md:flex items-center gap-1 glass px-2 py-2 rounded-2xl">
              {['Upload', 'Analyze', 'Results'].map((s, i) => {
                const active = i === (analysis ? 2 : resumeText ? 1 : 0);
                const done = i < (analysis ? 2 : resumeText ? 1 : 0);
                return (
                  <span key={s}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300"
                    style={active
                      ? { background: 'rgba(124,58,237,.24)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,.28)' }
                      : done
                        ? { color: 'rgba(255,255,255,.50)' }
                        : { color: 'rgba(255,255,255,.22)' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: active || done ? 'rgba(124,58,237,.38)' : 'rgba(255,255,255,.07)' }}>
                      {i + 1}
                    </span>
                    {s}
                  </span>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400/65" strokeWidth={2} />
                <span className="text-xs text-white/25">Privacy-first</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/28 hidden sm:inline">by</span>
                <span className="grad-text-animate font-extrabold text-sm tracking-[.12em]">PRATU</span>
              </div>
              {(resumeText || analysis) && (
                <button onClick={reset}
                  className="btn-ghost ml-1 text-xs text-white/40">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ╔══════════════════ HERO ════════════════════╗ */}
        {!analysis && (
          <section className="hero-section anim-fade-up">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 100% at 50% -10%, rgba(124,58,237,.20) 0%, transparent 70%)' }} />

            {/* Pill badge */}
            <div className="relative inline-flex items-center gap-2.5 text-xs font-semibold text-violet-300
              bg-violet-400/10 border border-violet-400/20 px-5 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                style={{ animation: 'pulseDot 2s ease-in-out infinite' }} />
              Free · No signup · Instant · 100% client-side
            </div>

            <h1 className="hero-title relative">
              Beat the ATS.<br />
              <span className="grad-text">Land the Interview.</span>
            </h1>

            <p className="hero-sub relative">
              Upload your PDF resume and get an instant ATS compatibility score
              with keyword analysis and actionable improvements — in seconds.
            </p>

            {/* Stats row */}
            <div className="relative flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
              {[['10K+', 'Resumes Analyzed'], ['6', 'Sections Checked'], ['50+', 'Keywords Tracked'], ['100%', 'Privacy Safe']].map(([n, l]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="font-extrabold text-violet-400">{n}</span>
                  <span className="text-white/30">{l}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ╔══════════════════ MAIN ════════════════════╗ */}
        <main className="page-main">
          <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">

            {/* ── UPLOAD CARD ──────────────────────────── */}
            {!analysis && (
              <div className="flex justify-center anim-fade-up" style={{ animationDelay: '.12s' }}>
                <div className="w-full max-w-[540px] glass-card flex flex-col gap-6 p-8">

                  {/* Card header */}
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.32),rgba(79,70,229,.22))' }}>
                      <Sparkles className="w-6 h-6 text-violet-300" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-bold text-white/90 text-lg leading-tight">Upload Your Resume</p>
                      <p className="text-sm text-white/35 mt-1.5">PDF format · max 10 MB · text-based only</p>
                    </div>
                  </div>

                  <FileUploader
                    key={uploaderKey}
                    onTextExtracted={handleText}
                    onError={handleError}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </div>
            )}

            {/* ── ERROR ────────────────────────────────── */}
            {error && (
              <div className="flex justify-center anim-fade-up">
                <div className="w-full max-w-[540px] flex items-start gap-3 p-5 rounded-2xl"
                  style={{ background: 'rgba(244,63,94,.07)', border: '1px solid rgba(244,63,94,.22)' }}>
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div>
                    <p className="font-semibold text-rose-400 text-sm">Upload Error</p>
                    <p className="text-xs text-white/45 mt-1 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── ANALYZE BUTTON ───────────────────────── */}
            {resumeText && !analysis && (
              <div className="flex flex-col items-center gap-4 py-6 anim-scale-in">
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="btn-glow text-base px-14 py-[18px]">
                  {isAnalyzing
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your resume…</>
                    : <><Sparkles className="w-5 h-5" /> Analyze Resume <ArrowRight className="w-5 h-5" /></>
                  }
                </button>
                <p className="text-xs text-white/25">Your resume never leaves your browser — 100% private</p>
              </div>
            )}

            {/* ── RESULTS ──────────────────────────────── */}
            {analysis && (
              <div className="anim-fade-up flex flex-col gap-8">

                {/* Score + Breakdown card */}
                <div className="w-full rounded-3xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(124,58,237,.12) 0%, rgba(79,70,229,.06) 50%, rgba(6,182,212,.06) 100%)',
                    border: '1px solid rgba(124,58,237,.22)',
                    boxShadow: '0 0 80px rgba(124,58,237,.10), 0 0 160px rgba(124,58,237,.05), inset 0 1px 0 rgba(255,255,255,.07)',
                  }}>

                  {/* Decorative glows */}
                  <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 80% 10%, rgba(124,58,237,.18) 0%, transparent 65%)' }} />
                  <div className="absolute bottom-0 left-1/3 w-64 h-64 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(6,182,212,.09) 0%, transparent 65%)' }} />

                  {/* Inner grid */}
                  <div className="score-panel-grid relative z-10">
                    <div className="flex flex-col items-center gap-3 pb-8 md:pb-0">
                      <p className="section-label mb-2">ATS Compatibility</p>
                      <ScoreGauge score={analysis.score} />
                    </div>

                    <div className="score-divider" />

                    <div className="pt-8 md:pt-0 md:pl-2">
                      <ScoreBreakdown breakdown={analysis.breakdown} />
                    </div>
                  </div>
                </div>

                {/* Tabs + content */}
                <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-6">

                  {/* Mobile/tablet: horizontal tabs */}
                  <div className="xl:hidden">
                    <div className="tab-strip">
                      {RESULT_TABS.map(({ id, label, Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                          className={`tab-btn ${activeTab === id ? 'active' : ''}`}>
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                          <span className="hidden sm:inline">{label}</span>
                          <span className="sm:hidden">{label.slice(0, 3)}</span>
                          {id === 'suggestions' && analysis.suggestions.length > 0 && (
                            <span className="sidebar-badge">
                              {analysis.suggestions.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: vertical sidebar — PREMIUM */}
                  <div className="hidden xl:flex flex-col sidebar-panel p-6 sm:p-8 justify-between">
                    {/* Navigation label */}
                    <p className="sidebar-section-label">&nbsp; &nbsp;Navigation</p>

                    {/* Tab buttons */}
                    <div className="flex flex-col gap-1">
                      {RESULT_TABS.map(({ id, label, Icon }) => {
                        const isActive = activeTab === id;
                        return (
                          <button key={id} onClick={() => setActiveTab(id)}
                            className={`sidebar-tab-btn ${isActive ? 'sidebar-tab-active' : ''}`}>
                            {/* Icon container */}
                            <span className={`sidebar-tab-icon ${isActive ? 'sidebar-tab-icon-active' : ''}`}>
                              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                            </span>
                            <span className="flex-1 text-left">{label}</span>
                            {id === 'suggestions' && analysis.suggestions.length > 0 && (
                              <span className="sidebar-badge">
                                {analysis.suggestions.length}
                              </span>
                            )}
                            {isActive && <span className="sidebar-active-dot" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="sidebar-divider" />

                    {/* Action label */}
                    <p className="sidebar-section-label">Actions</p>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <button onClick={runAnalysis} className="sidebar-action-btn sidebar-action-reanalyze">
                        <span className="sidebar-action-icon" style={{ background: 'rgba(124,58,237,.18)', border: '1px solid rgba(124,58,237,.28)' }}>
                          <RotateCcw className="w-3.5 h-3.5 text-violet-400" strokeWidth={2} />
                        </span>
                        <span className="flex-1 text-left">
                          <span className="block text-xs font-semibold text-white/75">Re-analyze</span>
                          <span className="block text-[10px] text-white/30 mt-0.5">Run again with same file</span>
                        </span>
                      </button>

                      <button onClick={reset} className="sidebar-action-btn sidebar-action-upload">
                        <span className="sidebar-action-icon" style={{ background: 'rgba(6,182,212,.14)', border: '1px solid rgba(6,182,212,.24)' }}>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2} />
                        </span>
                        <span className="flex-1 text-left">
                          <span className="block text-xs font-semibold text-white/75">Upload New Resume</span>
                          <span className="block text-[10px] text-white/30 mt-0.5">Start fresh analysis</span>
                        </span>
                      </button>
                    </div>

                    {/* Footer info */}
                    <div className="sidebar-footer">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulseDot 2s ease-in-out infinite' }} />
                      <span className="text-[10px] text-white/25">100% client-side · Private</span>
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="glass-card p-6 sm:p-8 min-h-[420px]" key={activeTab}>
                    {activeTab === 'overview' && <ContactAndStats  {...analysis} />}
                    {activeTab === 'keywords' && <KeywordsPanel    {...analysis} />}
                    {activeTab === 'sections' && <SectionAnalysis sections={analysis.sections} />}
                    {activeTab === 'suggestions' && <Suggestions suggestions={analysis.suggestions} />}
                  </div>
                </div>

                {/* Mobile action row */}
                <div className="flex flex-wrap justify-center gap-3 pb-2 xl:hidden">
                  <button onClick={runAnalysis}
                    className="flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm text-white/55 hover:text-white/85 hover:border-violet-500/30 transition-all">
                    <RotateCcw className="w-4 h-4 text-violet-400" /> Re-analyze
                  </button>
                  <button onClick={reset}
                    className="flex items-center gap-2 text-sm text-white/55 hover:text-white/85 px-5 py-2.5 rounded-xl transition-all"
                    style={{ background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.22)' }}>
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Upload New Resume
                  </button>
                </div>
              </div>
            )}

            {/* ── FEATURE GRID ─────────────────────────── */}
            {!analysis && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 pt-4 stagger-children">
                {FEATURES.map(({ emoji, title, desc, color }) => (
                  <div key={title}
                    className="glass-card feature-card group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${color}16`, border: `1px solid ${color}28` }}>
                      {emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white/88 text-sm mb-1.5 leading-tight">{title}</p>
                      <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
                    </div>
                    <div className="h-px rounded-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>

        {/* ╔══════════════════ FOOTER ══════════════════╗ */}
        <footer className="w-full mt-auto">
          <div className="divider" />
          <div className="w-full px-6 sm:px-10 xl:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/20">
              <span className="font-semibold text-white/35">ATS Resume Checker</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400/50" strokeWidth={2} />
                Resume never uploaded to any server
              </span>
              <span>© 2025 PRATU</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/25">Crafted by</span>
              <span className="grad-text-animate font-extrabold tracking-[.14em] text-base">PRATU</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
