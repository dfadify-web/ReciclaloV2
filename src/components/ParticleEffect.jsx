import { useEffect } from 'react';
import { useAuction } from '../store/AuctionContext';

const COLORS = ['#a855f7', '#6366f1', '#f59e0b', '#10b981', '#ec4899', '#60a5fa', '#ffffff', '#fbbf24'];

export default function ParticleEffect() {
  const { particles, clearParticles } = useAuction();

  useEffect(() => {
    if (particles.length > 0) {
      const t = setTimeout(clearParticles, 2000);
      return () => clearTimeout(t);
    }
  }, [particles]);

  if (particles.length === 0) return null;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  const pts = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: cx + (Math.random() - 0.5) * 200,
    y: cy + (Math.random() - 0.5) * 200,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 8,
    tx: (Math.random() - 0.5) * 600,
    ty: (Math.random() - 0.5) * 600,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="particles-container">
      {pts.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
      {/* Big central burst */}
      <div
        className="absolute text-6xl"
        style={{
          left: cx - 40,
          top: cy - 40,
          animation: 'celebrate 1s ease-out forwards',
        }}
      >
        🏆
      </div>
    </div>
  );
}
