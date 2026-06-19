import React, { useEffect, useState } from 'react';

function getScoreMeta(score) {
  if (score >= 80) return { color: '#10b981', glow: 'rgba(16,185,129,.55)', label: 'Excellent', tip: 'Your resume is highly ATS-optimized!' };
  if (score >= 60) return { color: '#7c3aed', glow: 'rgba(124,58,237,.55)', label: 'Good',      tip: 'A few tweaks can push you even higher.'                  };
  if (score >= 40) return { color: '#f59e0b', glow: 'rgba(245,158,11,.55)', label: 'Average',   tip: 'Significant room to improve ATS compatibility.'           };
  return           { color: '#f43f5e', glow: 'rgba(244,63,94,.55)',  label: 'Poor',      tip: 'Needs major improvements to clear ATS filters.'         };
}

export default function ScoreGauge({ score }) {
  const [display, setDisplay] = useState(0);
  const meta = getScoreMeta(score);

  const R         = 88;
  const C         = 2 * Math.PI * R;
  const dashOffset = C - (display / 100) * C;

  useEffect(() => {
    setDisplay(0);
    let start     = null;
    const duration = 1600;
    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed  = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-5">

      {/* SVG Ring */}
      <div className="score-ring-container anim-scale-in">
        <div className="score-glow anim-pulse-glow" style={{ background: meta.glow }} />

        <svg width="220" height="220" viewBox="0 0 220 220"
          style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="110" cy="110" r={R} fill="none"
            stroke="rgba(255,255,255,.06)" strokeWidth="14" />
          {/* Tick marks */}
          {[0,25,50,75,100].map((pct) => {
            const angle = (pct / 100) * 2 * Math.PI;
            const x1 = 110 + (R - 10) * Math.cos(angle);
            const y1 = 110 + (R - 10) * Math.sin(angle);
            const x2 = 110 + (R + 4)  * Math.cos(angle);
            const y2 = 110 + (R + 4)  * Math.sin(angle);
            return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,.12)" strokeWidth="2" />;
          })}
          {/* Progress arc */}
          <circle
            cx="110" cy="110" r={R}
            fill="none"
            stroke={`url(#scoreGrad-${score})`}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dashOffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.04s linear',
              filter: `drop-shadow(0 0 10px ${meta.color}80)`,
            }}
          />
          <defs>
            <linearGradient id={`scoreGrad-${score}`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor={meta.color} stopOpacity=".7" />
              <stop offset="1" stopColor={meta.color} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold tabular-nums leading-none"
            style={{ color: meta.color, textShadow: `0 0 28px ${meta.color}55` }}>
            {display}
          </span>
          <span className="text-xs text-white/30 font-medium mt-1">/ 100</span>
        </div>
      </div>

      {/* Label pill */}
      <div className="flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-semibold"
        style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}38`, color: meta.color }}>
        <span className="w-2 h-2 rounded-full" style={{ background: meta.color, animation: 'pulseDot 2s ease-in-out infinite' }} />
        {meta.label} Match
      </div>

      {/* Tip text */}
      <p className="text-center text-xs text-white/35 max-w-[220px] leading-relaxed px-2">{meta.tip}</p>

      {/* Gradient track bar */}
      <div className="w-full flex flex-col gap-2">
        <div className="relative h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,.05)' }}>
          <div className="h-full rounded-full"
            style={{ width: '100%', background: 'linear-gradient(90deg,#f43f5e 0%,#f59e0b 33%,#7c3aed 66%,#10b981 100%)' }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg transition-all duration-1000"
            style={{ left: `calc(${display}% - 7px)`, background: meta.color, boxShadow: `0 0 12px ${meta.color}` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/25 px-0.5">
          <span>0</span>
          <span className="text-rose-400/65">Poor</span>
          <span className="text-amber-400/65">Average</span>
          <span className="text-violet-400/65">Good</span>
          <span className="text-emerald-400/65">Excellent</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
