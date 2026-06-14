import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, History } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { computeStreak, calculateStreakBonus } from '@/lib/gamification';
import PointsAnimation from '@/components/shared/PointsAnimation';

const STEP_LABELS = ['Subiendo vídeo', 'Analizando con IA', 'Resultado'];

export default function Validation() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const actionId = searchParams.get('actionId');
  const [action, setAction] = useState(null);
  const [step, setStep] = useState(1);
  const [showAnim, setShowAnim] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    if (!actionId) return;
    let cancelled = false;

    async function validate() {
      const a = await base44.entities.RecyclingAction.get(actionId);
      if (!a || cancelled) return;
      setAction(a);

      if (a.validation_status !== 'pending') {
        setStep(3);
        return;
      }

      await base44.entities.RecyclingAction.update(actionId, { validation_status: 'validating' });
      setStep(2);

      await new Promise(r => setTimeout(r, 2000));
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: 'Analiza este vídeo de reciclaje. ¿El usuario muestra claramente que deposita un envase en el contenedor correcto? Devuelve validation_status (approved/rejected) y validation_details (explicación en español).',
        file_urls: [a.video_url],
      });

      const approved = result.validation_status === 'approved';
      let pts = 0;

      if (approved) {
        const newStreak = computeStreak(user?.last_recycling_date, user?.current_streak || 0);
        const streakBonus = calculateStreakBonus(newStreak);
        pts = 15 + streakBonus;

        await base44.entities.RecyclingAction.update(actionId, {
          validation_status: 'approved',
          validation_details: result.validation_details,
          points_awarded: pts,
        });

        if (user) {
          await base44.auth.updateMe({
            total_points: (user.total_points || 0) + pts,
            total_recycled: (user.total_recycled || 0) + 1,
            current_streak: newStreak,
            best_streak: Math.max(user.best_streak || 0, newStreak),
            last_recycling_date: new Date().toISOString(),
          });
        }
      } else {
        await base44.entities.RecyclingAction.update(actionId, {
          validation_status: 'rejected',
          validation_details: result.validation_details,
          points_awarded: 0,
        });
      }

      if (!cancelled) {
        setAction(prev => ({ ...prev, validation_status: approved ? 'approved' : 'rejected', validation_details: result.validation_details, points_awarded: pts }));
        setStep(3);
        if (approved) { setEarnedPoints(pts); setShowAnim(true); }
      }
    }

    validate();
    return () => { cancelled = true; };
  }, [actionId]);

  return (
    <div className="px-4 py-6 space-y-6">
      <PointsAnimation points={earnedPoints} show={showAnim} onComplete={() => setShowAnim(false)} />

      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Validación</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">La IA está verificando tu reciclaje.</p>
      </div>

      {/* Stepper */}
      <div className="space-y-2">
        {STEP_LABELS.map((label, i) => {
          const s = i + 1;
          const done = step > s;
          const active = step === s;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${done ? 'bg-green-50 border-green-200' : active ? 'bg-[hsl(var(--primary))]/5 border-[hsl(var(--primary))]/30' : 'bg-[hsl(var(--secondary))] border-transparent opacity-40'}`}
            >
              {done ? (
                <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              ) : active ? (
                <Loader2 className="w-6 h-6 text-[hsl(var(--primary))] animate-spin shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-[hsl(var(--border))] shrink-0 flex items-center justify-center text-xs font-bold text-[hsl(var(--muted-foreground))]">{s}</div>
              )}
              <span className={`font-medium text-sm ${done ? 'text-green-700' : active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Result */}
      <AnimatePresence>
        {step === 3 && action && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {action.validation_status === 'approved' ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-center space-y-3">
                <CheckCircle className="w-14 h-14 text-green-600 mx-auto" />
                <h2 className="text-xl font-extrabold text-green-800">¡Reciclaje validado!</h2>
                <p className="text-3xl font-extrabold text-[hsl(var(--primary))]">+{action.points_awarded} pts</p>
                {action.validation_details && (
                  <p className="text-sm text-green-700">{action.validation_details}</p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3">
                <XCircle className="w-14 h-14 text-red-500 mx-auto" />
                <h2 className="text-xl font-extrabold text-red-800">Validación rechazada</h2>
                {action.validation_details && (
                  <p className="text-sm text-red-700">{action.validation_details}</p>
                )}
                <p className="text-xs text-red-600">Vuelve a intentarlo siguiendo las instrucciones.</p>
              </div>
            )}

            <Link to="/history">
              <button className="w-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2">
                <History className="w-4 h-4" />
                Ver mis reciclajes
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
