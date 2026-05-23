import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, Trophy, Gift, History, Flame, Star, ChevronRight, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getLevelByPoints, getNextLevel, getLevelProgress, getLevelColor } from '@/lib/gamification';
import { timeAgo } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const STATUS_STYLES = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  validating: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
};
const STATUS_LABELS = { approved: 'Aprobado', pending: 'Pendiente', validating: 'Validando', rejected: 'Rechazado' };

export default function Home() {
  const { user } = useAuth();
  const [recentActions, setRecentActions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [actions, camps] = await Promise.all([
        base44.entities.RecyclingAction.list({ filters: { user_email: user?.email }, order_by: '-created_at', limit: 3 }),
        base44.entities.Campaign.list({ filters: { is_active: true }, limit: 2 }),
      ]);
      setRecentActions(actions);
      setCampaigns(camps);
      setLoading(false);
    }
    if (user) load();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const points = user?.total_points || 0;
  const level = getLevelByPoints(points);
  const nextLevel = getNextLevel(points);
  const progress = getLevelProgress(points);
  const streak = user?.current_streak || 0;
  const colorClass = getLevelColor(level.level);

  const firstName = (user?.fullName || user?.email || 'Usuario').split(' ')[0];

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          ¡Hola, {firstName}! 🌱
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Cada reciclaje cuenta para un planeta mejor.
        </p>
      </motion.div>

      {/* Points card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl p-5 bg-gradient-to-br ${colorClass} text-white shadow-lg`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Puntos totales</p>
            <p className="text-4xl font-extrabold">{points.toLocaleString('es-ES')}</p>
          </div>
          <div className="text-right">
            <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">
              {level.name} · Nv.{level.level}
            </span>
            {streak > 0 && (
              <div className="flex items-center gap-1 justify-end mt-2">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{streak} días de racha</span>
              </div>
            )}
          </div>
        </div>

        {nextLevel && (
          <div>
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>Progreso al nivel {nextLevel.name}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-xs opacity-70 mt-1">
              Te faltan {nextLevel.min - points} pts para {nextLevel.name}
            </p>
          </div>
        )}
      </motion.div>

      {/* Reciclar ahora */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Link to="/scan">
          <div className="bg-[hsl(var(--primary))] rounded-2xl p-4 flex items-center justify-between shadow-md hover:opacity-95 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ScanLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Reciclar ahora</p>
                <p className="text-xs text-white/70">Escanea un envase y gana puntos</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </Link>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { to: '/challenges', icon: Trophy, label: 'Retos', color: 'text-amber-500', bg: 'bg-amber-50' },
          { to: '/rankings', icon: Star, label: 'Ranking', color: 'text-blue-500', bg: 'bg-blue-50' },
          { to: '/history', icon: History, label: 'Historial', color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(({ to, icon: Icon, label, color, bg }) => (
          <Link key={to} to={to}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2 border border-[hsl(var(--border))] hover:shadow-sm transition-shadow`}
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="text-xs font-semibold text-[hsl(var(--foreground))]">{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Campaigns */}
      {campaigns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[hsl(var(--foreground))]">Campañas activas</h2>
            <Link to="/campaigns" className="text-xs text-[hsl(var(--accent))] font-semibold">Ver todas</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {campaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="bg-[hsl(var(--card))] rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-sm"
              >
                {c.image_url && (
                  <img src={c.image_url} alt={c.title} className="w-full h-24 object-cover" />
                )}
                <div className="p-3">
                  <p className="text-xs font-bold text-[hsl(var(--foreground))] leading-tight">{c.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-amber-600 font-semibold">+{c.bonus_points} pts extra</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent actions */}
      {recentActions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[hsl(var(--foreground))]">Últimos reciclajes</h2>
            <Link to="/history" className="text-xs text-[hsl(var(--accent))] font-semibold">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {recentActions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-[hsl(var(--card))] rounded-2xl p-4 flex items-center justify-between border border-[hsl(var(--border))]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[hsl(var(--secondary))] rounded-xl flex items-center justify-center text-lg">
                    ♻️
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      {action.product_name || 'Envase'}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{timeAgo(action.created_at)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[action.validation_status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[action.validation_status] || action.validation_status}
                  </span>
                  {action.points_awarded > 0 && (
                    <span className="text-xs text-[hsl(var(--primary))] font-bold">+{action.points_awarded} pts</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards CTA */}
      <Link to="/rewards">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[hsl(181,49%,43%)] to-[hsl(204,56%,28%)] rounded-2xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-white text-sm">¡Canjea tus puntos!</p>
            <p className="text-xs text-white/70">Descuentos, productos y más</p>
          </div>
          <div className="flex items-center gap-1">
            <Gift className="w-6 h-6 text-white" />
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
