import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function formatTime(ms) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, s: sec };
}

export default function CountdownTimer({ endTime, compact = false }) {
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const { d, h, m, s } = formatTime(remaining);
  const isEnded = remaining <= 0;
  const isCritical = remaining < 5 * 60 * 1000 && remaining > 0;
  const isWarning = remaining < 30 * 60 * 1000 && !isCritical;

  if (isEnded) {
    return (
      <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/30">
        TERMINADO
      </span>
    );
  }

  if (compact) {
    const timeStr = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border transition-all ${
        isCritical
          ? 'text-red-400 bg-red-500/10 border-red-500/30 timer-critical'
          : isWarning
          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      }`}>
        <Clock size={10} />
        {timeStr}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isCritical ? 'timer-critical rounded-lg px-2 py-1' : ''}`}>
      <Clock size={14} className={isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-gray-400'} />
      {d > 0 ? (
        <span className="font-mono text-sm font-bold">
          <Unit val={d} label="d" crit={isCritical} warn={isWarning} />
          <Unit val={h} label="h" crit={isCritical} warn={isWarning} />
        </span>
      ) : h > 0 ? (
        <span className="font-mono text-sm font-bold">
          <Unit val={h} label="h" crit={isCritical} warn={isWarning} />
          <Unit val={m} label="m" crit={isCritical} warn={isWarning} />
        </span>
      ) : (
        <span className={`font-mono text-sm font-bold ${isCritical ? 'text-red-400 animate-glow-red' : 'text-amber-400'}`}>
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}

function Unit({ val, label, crit, warn }) {
  const color = crit ? 'text-red-400' : warn ? 'text-amber-400' : 'text-emerald-400';
  return (
    <span className={color}>
      {String(val).padStart(2, '0')}{label}{' '}
    </span>
  );
}
