import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Gift, Trophy, Settings, LogOut, Recycle, Flame, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getLevelByPoints, getLevelProgress, getNextLevel } from '@/lib/gamification';
import LevelBadge from '@/components/shared/LevelBadge';
import StatCard from '@/components/shared/StatCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ approved: 0, rejected: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const actions = await base44.entities.RecyclingAction.list({ filters: { user_email: user.email } });
      const approved = actions.filter(a => a.validation_status === 'approved').length;
      const rejected = actions.filter(a => a.validation_status === 'rejected').length;
      const pending = actions.filter(a => ['pending', 'validating'].includes(a.validation_status)).length;
      setStats({ approved, rejected, pending });
      setLoading(false);
    }
    load();
  }, [user]);

  async function handleLogout() {
    await base44.auth.logout();
    navigate('/');
  }

  if (loading) return <LoadingSpinner />;

  const points = user?.total_points || 0;
  const level = getLevelByPoints(points);
  const progress = getLevelProgress(points);
  const nextLevel = getNextLevel(points);
  const initial = (user?.fullName || user?.email || '?')[0].toUpperCase();

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(181,49%,43%)] flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
          {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" /> : initial}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-[hsl(var(--foreground))]">{user?.fullName || 'Usuario'}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{user?.email}</p>
          <div className="mt-1">
            <LevelBadge points={points} />
          </div>
        </div>
      </motion.div>

      {/* Points card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(204,56%,28%)] rounded-3xl p-5 text-white"
      >
        <p className="text-sm opacity-80">Puntos acumulados</p>
        <p className="text-4xl font-extrabold">{points.toLocaleString('es-ES')}</p>
        {nextLevel && (
          <div className="mt-3">
            <div className="flex justify-between text-xs opacity-75 mb-1">
              <span>Hacia {nextLevel.name}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Recycle} label="Reciclajes totales" value={user?.total_recycled || 0} />
        <StatCard icon={Flame} label="Racha actual" value={`${user?.current_streak || 0} días`} color="text-orange-500" />
        <StatCard icon={Star} label="Mejor racha" value={`${user?.best_streak || 0} días`} color="text-amber-500" />
        <StatCard icon={CheckCircle} label="Aprobados" value={stats.approved} color="text-green-600" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={XCircle} label="Rechazados" value={stats.rejected} color="text-red-500" />
        <StatCard icon={Clock} label="Pendientes" value={stats.pending} color="text-blue-500" />
      </div>

      {/* Links */}
      <div className="space-y-2">
        {[
          { to: '/history', icon: History, label: 'Historial de reciclajes' },
          { to: '/my-rewards', icon: Gift, label: 'Mis recompensas' },
          { to: '/rankings', icon: Trophy, label: 'Clasificación' },
          { to: '/settings', icon: Settings, label: 'Ajustes' },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
            >
              <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
              <span className="font-medium text-sm text-[hsl(var(--foreground))]">{label}</span>
              <span className="ml-auto text-[hsl(var(--muted-foreground))]">›</span>
            </motion.div>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
