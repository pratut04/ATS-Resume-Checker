import React, { useState } from 'react';
import { Search, Check, X, Zap } from 'lucide-react';

function Tag({ word, matched }) {
  return (
    <span className={`badge ${matched ? 'badge-matched' : 'badge-missing'} cursor-default hover:scale-105 transition-transform`}>
      {matched ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {word}
    </span>
  );
}

export default function KeywordsPanel({
  matchedSkills, missingCommonSkills,
  jobKeywords, matchedJobKeywords, missingJobKeywords,
}) {
  const [tab, setTab] = useState('skills');
  const [q, setQ] = useState('');

  const hasJD = jobKeywords.length > 0;
  const matchRate = hasJD
    ? Math.round((matchedJobKeywords.length / jobKeywords.length) * 100)
    : null;

  const tabs = [
    { id: 'skills', label: 'Skills Found', count: matchedSkills.length },
    { id: 'missing', label: 'Missing', count: missingCommonSkills.length },
    ...(hasJD ? [
      { id: 'jd-match', label: 'JD Match', count: matchedJobKeywords.length },
      { id: 'jd-gap', label: 'JD Gap', count: missingJobKeywords.length },
    ] : []),
  ];

  const getData = () => {
    const lq = q.toLowerCase();
    const filter = arr => arr.filter(s => s.toLowerCase().includes(lq));
    switch (tab) {
      case 'skills': return { data: filter(matchedSkills), matched: true };
      case 'missing': return { data: filter(missingCommonSkills), matched: false };
      case 'jd-match': return { data: filter(matchedJobKeywords), matched: true };
      case 'jd-gap': return { data: filter(missingJobKeywords), matched: false };
      default: return { data: [], matched: true };
    }
  };
  const { data, matched } = getData();

  return (
    <div className="flex flex-col gap-6">

      {/* JD match rate cards */}
      {hasJD && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: matchedJobKeywords.length, label: 'Matched', color: '#10b981' },
            { val: missingJobKeywords.length, label: 'Missing', color: '#f43f5e' },
            { val: `${matchRate}%`, label: 'Match Rate', color: matchRate >= 60 ? '#10b981' : matchRate >= 40 ? '#7c3aed' : '#f43f5e' },
          ].map(({ val, label, color }) => (
            <div key={label} className="glass-card p-4 text-center">
              <p className="text-2xl font-extrabold tabular-nums leading-tight"
                style={{ color, textShadow: `0 0 18px ${color}48` }}>{val}</p>
              <p className="text-xs text-white/35 mt-1.5 leading-none">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pro tip banner (no JD) */}
      {!hasJD && (
        <div className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.18)' }}>
          {/* <Zap className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" strokeWidth={2} /> */}
          <p className="text-xs text-white/45 leading-relaxed">
            {/* <span className="text-violet-400 font-semibold">Pro tip: </span> */}
            {/* Paste a job description above for targeted keyword matching and a more accurate ATS score. */}
          </p>
        </div>
      )}

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="tab-strip flex-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
              {t.label}
              <span className="opacity-55 text-[10px] ml-0.5">({t.count})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 glass px-3 py-2.5 rounded-xl min-w-[140px]">
          <Search className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search…"
            className="bg-transparent text-xs text-white/65 placeholder-white/20 outline-none w-full"
          />
        </div>
      </div>

      {/* Keyword tags */}
      <div className="flex flex-wrap gap-2 min-h-[100px] content-start py-1">
        {data.length === 0 ? (
          <div className="w-full flex items-center justify-center py-12 text-white/25 text-sm">
            {q ? 'No results for that search' : 'Nothing to show here'}
          </div>
        ) : data.map((s, i) => <Tag key={i} word={s} matched={matched} />)}
      </div>
    </div>
  );
}
