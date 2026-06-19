import React from 'react';

const COLOR = {
  high:   { bar: '#10b981', text: '#34d399' },
  medium: { bar: '#7c3aed', text: '#a78bfa' },
  low:    { bar: '#f43f5e', text: '#fb7185' },
};

function color(score, max) {
  const pct = score / max;
  if (pct >= .70) return COLOR.high;
  if (pct >= .40) return COLOR.medium;
  return COLOR.low;
}

function Bar({ label, score, max }) {
  const pct = Math.round((score / max) * 100);
  const c   = color(score, max);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-white/65 font-medium leading-none">{label}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold tabular-nums" style={{ color: c.text }}>{score}/{max}</span>
          <span className="text-[10px] text-white/28">({pct}%)</span>
        </div>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${c.bar}99, ${c.bar})`,
            boxShadow: `0 0 10px ${c.bar}45`,
          }}
        />
      </div>
    </div>
  );
}

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="section-label">Score Breakdown</h3>
      {Object.entries(breakdown).map(([k, { label, score, max }]) => (
        <Bar key={k} label={label} score={score} max={max} />
      ))}
    </div>
  );
}
