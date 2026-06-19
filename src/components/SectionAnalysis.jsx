import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const SECTION_META = {
  summary: { label: 'Professional Summary', icon: '👤', desc: 'Career overview at the top' },
  experience: { label: 'Work Experience', icon: '💼', desc: 'Employment history & roles' },
  education: { label: 'Education', icon: '🎓', desc: 'Degrees & certifications' },
  skills: { label: 'Skills', icon: '⚡', desc: 'Technical & soft skills' },
  projects: { label: 'Projects', icon: '🚀', desc: 'Portfolio & project work' },
  achievements: { label: 'Achievements', icon: '🏆', desc: 'Awards & recognition' },
};

export default function SectionAnalysis({ sections }) {
  const found = Object.values(sections).filter(Boolean).length;
  const total = Object.keys(sections).length;
  const pct = Math.round((found / total) * 100);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="section-label">&nbsp; &nbsp;Section Coverage</h3>
        <span className="badge badge-neutral">{found}/{total} detected · {pct}%</span>
      </div>

      {/* Progress */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: pct >= 80
              ? 'linear-gradient(90deg,#10b981,#06b6d4)'
              : pct >= 50
                ? 'linear-gradient(90deg,#7c3aed,#4f46e5)'
                : 'linear-gradient(90deg,#f43f5e,#f59e0b)',
          }}
        />
      </div>

      {/* Section rows */}
      <div className="flex flex-col gap-2 stagger-children">
        {Object.entries(SECTION_META).map(([key, { label, icon, desc }]) => {
          const ok = sections[key];
          return (
            <div key={key} className={`section-row ${ok ? 'found' : 'missing'}`}>
              <span className="text-xl flex-shrink-0 leading-none">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 leading-tight">{label}</p>
                <p className="text-xs text-white/30 mt-0.5 truncate">{desc}</p>
              </div>
              {ok
                ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                : <XCircle className="w-4.5 h-4.5 text-rose-400/55 flex-shrink-0" strokeWidth={2} />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
