import React from 'react';
import { Mail, Phone, Globe, Hash, Zap, FileText, CheckCircle2, XCircle } from 'lucide-react';

function StatCard({ Icon, label, value, ok, sub }) {
  return (
    <div className={`stat-card ${ok ? 'ok' : 'bad'}`}>
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: ok ? 'rgba(16,185,129,.14)' : 'rgba(244,63,94,.12)' }}>
          <Icon className="w-4.5 h-4.5" style={{ color: ok ? '#10b981' : '#f43f5e' }} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-white/35 font-medium uppercase tracking-[.05em] leading-none mb-1.5">{label}</p>
          <p className="text-sm font-bold leading-tight" style={{ color: ok ? '#34d399' : '#fb7185' }}>{value}</p>
          {sub && <p className="text-[11px] text-white/25 mt-1 truncate leading-none">{sub}</p>}
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {ok
            ? <CheckCircle2 className="w-4 h-4 text-emerald-400/55" strokeWidth={2} />
            : <XCircle className="w-4 h-4 text-rose-400/40" strokeWidth={2} />
          }
        </div>
      </div>
    </div>
  );
}

export default function ContactAndStats({
  hasEmail, hasPhone, hasLinkedIn,
  wordCount, usedActionVerbs, hasQuantifiedAchievements,
}) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="section-label">&nbsp;&nbsp; Quick Stats</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
        <StatCard Icon={Mail} label="Email Address" value={hasEmail ? 'Detected' : 'Not Found'} ok={hasEmail} />
        <StatCard Icon={Phone} label="Phone Number" value={hasPhone ? 'Detected' : 'Not Found'} ok={hasPhone} />
        <StatCard Icon={Globe} label="LinkedIn Profile" value={hasLinkedIn ? 'Included' : 'Missing'} ok={hasLinkedIn} />
        <StatCard Icon={FileText} label="Word Count"
          value={`${wordCount} words`}
          ok={wordCount >= 300}
          sub={wordCount < 300 ? 'Aim for 300+ words' : 'Good length'} />
        <StatCard Icon={Zap} label="Action Verbs"
          value={`${usedActionVerbs.length} used`}
          ok={usedActionVerbs.length >= 5}
          sub={usedActionVerbs.length < 5 ? 'Use at least 5' : 'Great variety'} />
        <StatCard Icon={Hash} label="Quantified Achievements"
          value={hasQuantifiedAchievements ? 'Found' : 'None Detected'}
          ok={hasQuantifiedAchievements}
          sub={!hasQuantifiedAchievements ? 'Add numbers & metrics' : 'Excellent!'} />
      </div>

      {usedActionVerbs.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-white/30 font-medium">Action verbs detected:</p>
          <div className="flex flex-wrap gap-2">
            {usedActionVerbs.map(v => (
              <span key={v} className="badge badge-info capitalize">{v}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
