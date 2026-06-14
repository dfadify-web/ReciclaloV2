import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Star, Tag, Package, Sparkles, Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { generateRedemptionCode } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Gift },
  { id: 'descuento', label: 'Descuentos', icon: Tag },
  { id: 'producto', label: 'Productos', icon: Package },
  { id: 'experiencia', label: 'Experiencias', icon: Sparkles },
  { id: 'sorteo', label: 'Sorteos', icon: Star },
  { id: 'donacion', label: 'Donaciones', icon: Heart },
];

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Reward.list({ filters: { is_active: true } });
      setRewards(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = category === 'all' ? rewards : rewards.filter(r => r.category === category);
  const points = user?.total_points || 0;

  async function handleRedeem() {
    if (!selectedReward || !user) return;
    if (points < selectedReward.points_required) return;
    setRedeeming(true);

    const code = generateRedemptionCode();
    await base44.entities.UserReward.create({
      user_email: user.email,
      reward_id: selectedReward.id,
      reward_title: selectedReward.title,
      reward_category: selectedReward.category,
      points_spent: selectedReward.points_required,
      status: 'claimed',
      redemption_code: code,
    });

    await base44.auth.updateMe({
      total_points: points - selectedReward.points_required,
    });

    setRedeeming(false);
    setSelectedReward(null);
    setToast(`¡Recompensa canjeada! Código: ${code}`);
    setTimeout(() => setToast(''), 4000);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 max-w-lg mx-auto z-50 bg-green-600 text-white rounded-2xl p-4 text-sm font-semibold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Recompensas</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Canjea tus puntos por premios increíbles.</p>
      </div>

      {/* Points card */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(204,56%,28%)] rounded-2xl p-4 flex items-center justify-between text-white">
        <div>
          <p className="text-sm opacity-80">Tus puntos disponibles</p>
          <p className="text-3xl font-extrabold">{points.toLocaleString('es-ES')}</p>
        </div>
        <Gift className="w-10 h-10 opacity-60" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === id ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Gift} title="Sin recompensas" description="No hay recompensas en esta categoría." />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((reward, i) => {
            const canRedeem = points >= reward.points_required;
            const missing = reward.points_required - points;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-sm flex flex-col"
              >
                {reward.image_url && (
                  <img src={reward.image_url} alt={reward.title} className="w-full h-28 object-cover" />
                )}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <p className="text-xs font-bold text-[hsl(var(--foreground))] leading-tight">{reward.title}</p>
                  {reward.sponsor && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">por {reward.sponsor}</p>
                  )}
                  <div className="mt-auto space-y-1.5">
                    <p className="text-sm font-extrabold text-[hsl(var(--primary))]">{reward.points_required} pts</p>
                    <button
                      onClick={() => canRedeem && setSelectedReward(reward)}
                      disabled={!canRedeem}
                      className={`w-full text-xs font-bold py-2 rounded-xl transition-all ${canRedeem ? 'bg-[hsl(var(--primary))] text-white hover:opacity-90' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'}`}
                    >
                      {canRedeem ? 'Canjear' : `Faltan ${missing} pts`}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation modal */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedReward(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg text-[hsl(var(--foreground))]">Confirmar canje</h3>
                <button onClick={() => setSelectedReward(null)} className="text-[hsl(var(--muted-foreground))]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {selectedReward.image_url && (
                <img src={selectedReward.image_url} alt={selectedReward.title} className="w-full h-32 object-cover rounded-2xl" />
              )}
              <div>
                <p className="font-semibold text-[hsl(var(--foreground))]">{selectedReward.title}</p>
                {selectedReward.description && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{selectedReward.description}</p>
                )}
              </div>
              <div className="bg-[hsl(var(--secondary))] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">Puntos a gastar</span>
                <span className="font-bold text-[hsl(var(--primary))]">-{selectedReward.points_required} pts</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedReward(null)} className="flex-1 border border-[hsl(var(--border))] rounded-xl py-3 text-sm font-semibold">Cancelar</button>
                <button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="flex-1 bg-[hsl(var(--primary))] text-white rounded-xl py-3 text-sm font-bold disabled:opacity-60"
                >
                  {redeeming ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
