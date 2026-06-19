import React from 'react';
import { ShieldAlert, ArrowUpCircle, Info } from 'lucide-react';

const PRIORITY = {
  critical: { Icon: ShieldAlert,   color: '#f43f5e', cls: 'critical', label: 'Critical'      },
  high:     { Icon: ArrowUpCircle, color: '#f59e0b', cls: 'high',     label: 'High Priority' },
  medium:   { Icon: Info,          color: '#7c3aed', cls: 'medium',   label: 'Suggested'     },
};

export default function Suggestions({ suggestions }) {
  if (!suggestions?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl">🎉</span>
        <div>
          <p className="text-white/60 font-semibold text-base leading-tight">No major issues found!</p>
          <p className="text-white/30 text-sm mt-2">Your resume looks well-structured.</p>
        </div>
      </div>
    );
  }

  const ordered = ['critical', 'high', 'medium']
    .flatMap(t => suggestions.filter(s => s.type === t));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="section-label">Improvement Suggestions</h3>
        <span className="badge badge-neutral">{suggestions.length} items</span>
      </div>

      <div className="flex flex-col gap-3 stagger-children">
        {ordered.map((s, i) => {
          const p      = PRIORITY[s.type];
          const { Icon } = p;
          return (
            <div key={i} className={`suggestion-card ${p.cls}`}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${p.color}18` }}>
                <Icon className="w-4 h-4" style={{ color: p.color }} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                  style={{ color: p.color }}>
                  {p.label}
                </span>
                <p className="text-sm text-white/70 leading-relaxed">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
