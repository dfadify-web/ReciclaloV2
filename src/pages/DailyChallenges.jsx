import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, CheckCircle, Lock, Star, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PointsAnimation from '@/components/shared/PointsAnimation';

const CHALLENGE_TEMPLATES = [
  { id: 'plastic_3', title: 'Reciclador de Plástico', description: 'Recicla 3 envases de plástico hoy', challenge_type: 'recycle_plastic', target_value: 3, points_reward: 50, multiplier: 1.5, emoji: '♻️' },
  { id: 'glass_2', title: 'Guardián del Vidrio', description: 'Recicla 2 envases de vidrio', challenge_type: 'recycle_glass', target_value: 2, points_reward: 40, emoji: '🍾' },
  { id: 'any_5', title: 'Superreciclador', description: 'Recicla 5 envases de cualquier tipo', challenge_type: 'recycle_any', target_value: 5, points_reward: 80, emoji: '🌟' },
  { id: 'streak_3', title: 'Racha Imparable', description: 'Mantén una racha de 3 días', challenge_type: 'streak', target_value: 3, points_reward: 30, emoji: '🔥' },
  { id: 'carton_2', title: 'Amigo del Cartón', description: 'Recicla 2 envases de cartón', challenge_type: 'recycle_carton', target_value: 2, points_reward: 35, emoji: '📦' },
  { id: 'metal_2', title: 'Metal Warrior', description: 'Recicla 2 latas de metal', challenge_type: 'recycle_metal', target_value: 2, points_reward: 45, emoji: '🥫' },
  { id: 'any_3', title: 'Reto Express', description: 'Recicla 3 envases hoy', challenge_type: 'recycle_any', target_value: 3, points_reward: 35, emoji: '⚡' },
  { id: 'plastic_5', title: 'Cazador de Plásticos', description: 'Recicla 5 envases de plástico', challenge_type: 'recycle_plastic', target_value: 5, points_reward: 70, emoji: '🎯' },
  { id: 'glass_3', title: 'Maestro del Vidrio', description: 'Recicla 3 botellas de vidrio', challenge_type: 'recycle_glass', target_value: 3, points_reward: 55, emoji: '💎' },
  { id: 'carton_3', title: 'Rey del Cartón', description: 'Recicla 3 cajas o cartones', challenge_type: 'recycle_carton', target_value: 3, points_reward: 50, emoji: '📬' },
];

function getDateHash(dateStr) {
  return dateStr.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function selectChallengesForDate(dateStr) {
  const hash = getDateHash(dateStr);
  const n = CHALLENGE_TEMPLATES.length;
  const i1 = hash % n;
  const i2 = (hash + 3) % n;
  const i3 = (hash + 7) % n;
  const indices = [...new Set([i1, i2, i3])];
  while (indices.length < 3) indices.push((indices[indices.length - 1] + 1) % n);
  return indices.slice(0, 3).map(i => CHALLENGE_TEMPLATES[i]);
}

function computeProgress(challenge, todayActions, currentStreak) {
  if (challenge.challenge_type === 'streak') {
    return Math.min(challenge.target_value, currentStreak || 0);
  }
  const filtered = todayActions.filter(a => {
    if (a.validation_status !== 'approved') return false;
    if (challenge.challenge_type === 'recycle_any') return true;
    const typeMap = { recycle_plastic: 'plastico', recycle_glass: 'vidrio', recycle_carton: 'carton', recycle_metal: 'metal' };
    return a.product_type === typeMap[challenge.challenge_type];
  });
  return Math.min(challenge.target_value, filtered.length);
}

export default function DailyChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState('');
  const [showAnim, setShowAnim] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const loadingRef = useRef(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function load() {
      if (!user || loadingRef.current) return;
      loadingRef.current = true;
      const dateStr = today;

      let userChallenges = await base44.entities.UserChallenge.list({
        filters: { user_email: user.email, challenge_date: dateStr },
      });

      // Only keep the 3 most recent (in case of duplicates from dev reloads)
      if (userChallenges.length > 3) {
        userChallenges = userChallenges.slice(-3);
      }

      if (userChallenges.length === 0) {
        const templates = selectChallengesForDate(dateStr);
        const created = await base44.entities.UserChallenge.bulkCreate(
          templates.map(t => ({
            user_email: user.email,
            challenge_date: dateStr,
            challenge_id: t.id,
            title: t.title,
            description: t.description,
            challenge_type: t.challenge_type,
            target_value: t.target_value,
            current_progress: 0,
            points_reward: t.points_reward,
            multiplier: t.multiplier || 1,
            completed: false,
          }))
        );
        userChallenges = created;
      }

      const todayActions = await base44.entities.RecyclingAction.list({
        filters: { user_email: user.email },
      });
      const todayApproved = todayActions.filter(a => a.created_at?.startsWith(dateStr) && a.validation_status === 'approved');

      const updated = userChallenges.map(ch => {
        const progress = computeProgress(ch, todayApproved, user?.current_streak || 0);
        return { ...ch, current_progress: progress, completed: progress >= ch.target_value };
      });

      setChallenges(updated);
      setLoading(false);
    }
    load();
  }, [user]);

  async function claimChallenge(challenge) {
    if (claiming || challenge.claimed) return;
    setClaiming(challenge.id);
    const pts = Math.round(challenge.points_reward * (challenge.multiplier || 1));
    await base44.entities.UserChallenge.update(challenge.id, {
      claimed: true,
      completed_at: new Date().toISOString(),
    });
    await base44.auth.updateMe({
      total_points: (user.total_points || 0) + pts,
    });
    setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, claimed: true } : c));
    setEarnedPoints(pts);
    setShowAnim(true);
    setClaiming('');
  }

  async function claimBonus() {
    if (bonusClaimed) return;
    const pts = 100;
    await base44.auth.updateMe({ total_points: (user.total_points || 0) + pts });
    setBonusClaimed(true);
    setEarnedPoints(pts);
    setShowAnim(true);
  }

  if (loading) return <LoadingSpinner />;

  const allCompleted = challenges.length === 3 && challenges.every(c => c.completed);
  const allClaimed = challenges.every(c => c.claimed);

  return (
    <div className="px-4 py-6 space-y-5">
      <PointsAnimation points={earnedPoints} show={showAnim} onComplete={() => setShowAnim(false)} />

      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Retos diarios</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* All-complete bonus */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-4 border ${bonusClaimed || allClaimed ? 'bg-[hsl(var(--secondary))] border-[hsl(var(--border))]' : 'bg-amber-50 border-amber-200'}`}
        >
          <div className="flex items-center gap-3">
            <Star className={`w-6 h-6 ${bonusClaimed ? 'text-[hsl(var(--muted-foreground))]' : 'text-amber-500'}`} />
            <div className="flex-1">
              <p className="font-bold text-sm text-[hsl(var(--foreground))]">¡Todos los retos completados!</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Bonus especial: +100 puntos extra</p>
            </div>
            <button
              onClick={claimBonus}
              disabled={bonusClaimed}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${bonusClaimed ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
            >
              {bonusClaimed ? 'Reclamado' : 'Reclamar'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Challenges list */}
      <div className="space-y-3">
        {challenges.map((ch, i) => {
          const progress = ch.current_progress || 0;
          const pct = Math.min(100, Math.round((progress / ch.target_value) * 100));
          const pts = Math.round(ch.points_reward * (ch.multiplier || 1));
          const template = CHALLENGE_TEMPLATES.find(t => t.id === ch.challenge_id);
          const emoji = template?.emoji || '♻️';

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-[hsl(var(--card))] rounded-2xl border p-4 space-y-3 ${ch.completed ? 'border-green-200' : 'border-[hsl(var(--border))]'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{emoji}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-bold text-sm text-[hsl(var(--foreground))]">{ch.title}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-bold text-amber-600">{pts} pts</span>
                      {ch.multiplier > 1 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">×{ch.multiplier}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{ch.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))] mb-1.5">
                  <span>{progress} de {ch.target_value}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                    className={`h-full rounded-full ${ch.completed ? 'bg-green-500' : 'bg-[hsl(var(--primary))]'}`}
                  />
                </div>
              </div>

              {ch.completed && (
                <button
                  onClick={() => claimChallenge(ch)}
                  disabled={!!ch.claimed || claiming === ch.id}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    ch.claimed ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {ch.claimed ? (
                    <><CheckCircle className="w-4 h-4" /> Recompensa reclamada</>
                  ) : claiming === ch.id ? (
                    'Procesando...'
                  ) : (
                    <><Trophy className="w-4 h-4" /> Reclamar recompensa</>
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Streak reminder */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
        <Flame className="w-5 h-5 text-orange-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-orange-800">Racha actual: {user?.current_streak || 0} días</p>
          <p className="text-xs text-orange-600">¡Recicla hoy para no romper tu racha!</p>
        </div>
      </div>
    </div>
  );
}
