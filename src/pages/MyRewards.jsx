import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Copy, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { timeAgo } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

const STATUS_CONFIG = {
  claimed: { label: 'Canjeado', bg: 'bg-green-100', text: 'text-green-700' },
  delivered: { label: 'Entregado', bg: 'bg-blue-100', text: 'text-blue-700' },
  expired: { label: 'Expirado', bg: 'bg-gray-100', text: 'text-gray-600' },
};

export default function MyRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    async function load() {
      if (!user) return;
      const data = await base44.entities.UserReward.list({
        filters: { user_email: user.email },
        order_by: '-created_at',
      });
      setRewards(data);
      setLoading(false);
    }
    load();
  }, [user]);

  function copyCode(code, id) {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Mis recompensas</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{rewards.length} recompensas canjeadas</p>
      </div>

      {rewards.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="Sin recompensas aún"
          description="Recicla y acumula puntos para canjear recompensas increíbles."
          action={
            <Link to="/rewards">
              <button className="bg-[hsl(var(--primary))] text-white font-semibold px-6 py-3 rounded-xl">
                Ver recompensas
              </button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {rewards.map((r, i) => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.claimed;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[hsl(var(--foreground))]">{r.reward_title}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 capitalize">{r.reward_category} · {timeAgo(r.created_at)}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="bg-[hsl(var(--secondary))] rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Código de canje</p>
                    <p className="font-mono font-bold text-sm tracking-widest text-[hsl(var(--foreground))]">{r.redemption_code}</p>
                  </div>
                  <button
                    onClick={() => copyCode(r.redemption_code, r.id)}
                    className={`p-2 rounded-xl transition-all ${copied === r.id ? 'bg-green-100 text-green-600' : 'bg-white text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]'}`}
                  >
                    {copied === r.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-[hsl(var(--muted-foreground))]">-{r.points_spent} puntos gastados</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
