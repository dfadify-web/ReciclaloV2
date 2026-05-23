import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { MATERIAL_LABELS } from '@/lib/gamification';
import { timeAgo } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

const TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'approved', label: 'Aprobados' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'rejected', label: 'Rechazados' },
];

const STATUS_CONFIG = {
  approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Aprobado' },
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pendiente' },
  validating: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Validando' },
  rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Rechazado' },
};

export default function History() {
  const { user } = useAuth();
  const [actions, setActions] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const data = await base44.entities.RecyclingAction.list({
        filters: { user_email: user.email },
        order_by: '-created_at',
      });
      setActions(data);
      setLoading(false);
    }
    load();
  }, [user]);

  const filtered = tab === 'all' ? actions : actions.filter(a => {
    if (tab === 'pending') return ['pending', 'validating'].includes(a.validation_status);
    return a.validation_status === tab;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Mis reciclajes</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{actions.length} reciclajes registrados</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${tab === t.id ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Recycle}
          title="Sin reciclajes"
          description="Aún no tienes reciclajes en esta categoría."
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((action, i) => {
              const cfg = STATUS_CONFIG[action.validation_status] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[hsl(var(--foreground))] truncate">
                      {action.product_name || 'Envase'}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {MATERIAL_LABELS[action.product_type] || action.product_type} · {timeAgo(action.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    {action.points_awarded > 0 && (
                      <span className="text-xs font-bold text-[hsl(var(--primary))]">+{action.points_awarded} pts</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
