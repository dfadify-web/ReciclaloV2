import { getLevelByPoints, getLevelColor } from '@/lib/gamification';

export default function LevelBadge({ points = 0, size = 'sm' }) {
  const level = getLevelByPoints(points);
  const colorClass = getLevelColor(level.level);
  const sizeClasses = size === 'lg'
    ? 'px-4 py-2 text-base gap-2'
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <div className={`inline-flex items-center rounded-full bg-gradient-to-r ${colorClass} text-white font-semibold ${sizeClasses}`}>
      <span>{level.name}</span>
      <span className="opacity-80">Nv.{level.level}</span>
    </div>
  );
}
