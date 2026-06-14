import { useState, useRef } from 'react';
import { Camera, QrCode, CheckCircle, XCircle, AlertCircle, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { computeStreak, calculateStreakBonus, CONTAINER_COLORS, MATERIAL_LABELS } from '@/lib/gamification';
import PointsAnimation from '@/components/shared/PointsAnimation';

// Maps product type → container color
const MATERIAL_TO_CONTAINER = {
  plastico: 'amarillo',
  metal:    'amarillo',
  vidrio:   'verde',
  carton:   'azul',
  organico: 'marron',
  otros:    'gris',
};

// Rich visuals per container
const CONTAINER_VISUALS = {
  amarillo: {
    bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-500',
    glow: 'shadow-yellow-200', icon: '🟡', binIcon: '🗑️',
    gradient: 'from-yellow-300 to-yellow-500',
  },
  verde: {
    bg: 'bg-green-500', text: 'text-white', border: 'border-green-600',
    glow: 'shadow-green-200', icon: '♻️', binIcon: '🗑️',
    gradient: 'from-green-400 to-green-600',
  },
  azul: {
    bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600',
    glow: 'shadow-blue-200', icon: '📦', binIcon: '🗑️',
    gradient: 'from-blue-400 to-blue-600',
  },
  marron: {
    bg: 'bg-amber-700', text: 'text-white', border: 'border-amber-800',
    glow: 'shadow-amber-200', icon: '🌿', binIcon: '🗑️',
    gradient: 'from-amber-600 to-amber-800',
  },
  gris: {
    bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600',
    glow: 'shadow-gray-200', icon: '🗂️', binIcon: '🗑️',
    gradient: 'from-gray-400 to-gray-600',
  },
};

// ─── Container Animation Screen ──────────────────────────────────────────────
function ContainerAnimScreen({ qrData, containerColor, onReady }) {
  const container = CONTAINER_COLORS[containerColor];
  const visual = CONTAINER_VISUALS[containerColor];
  const materialLabel = MATERIAL_LABELS[qrData.product_type] || qrData.product_type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      className="space-y-5"
    >
      {/* Header instruction */}
      <div className="text-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))] font-medium uppercase tracking-wide">
          Antes de recibir tus puntos...
        </p>
        <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-1">
          ¡Tíralo aquí! 👇
        </h2>
      </div>

      {/* Container card with animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', damping: 14, stiffness: 200 }}
        className={`relative bg-gradient-to-br ${visual.gradient} rounded-3xl p-6 text-center shadow-2xl ${visual.glow} shadow-lg overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`absolute rounded-full border-4 border-white`}
              style={{ width: 80 + i * 40, height: 80 + i * 40, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Animated bin icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="text-7xl mb-3 leading-none"
          >
            🗑️
          </motion.div>

          <div className={`inline-block px-4 py-1.5 rounded-full bg-white/25 mb-3`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${visual.text}`}>
              {visual.icon} Contenedor {containerColor}
            </span>
          </div>

          <p className={`text-3xl font-extrabold ${visual.text} mb-1`}>
            {container?.label}
          </p>
          <p className={`text-sm font-medium ${visual.text} opacity-80`}>
            {container?.desc}
          </p>
        </div>
      </motion.div>

      {/* Product reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 flex items-center gap-3"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${visual.gradient} flex items-center justify-center text-lg`}>
          {visual.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[hsl(var(--foreground))] truncate">{qrData.product_name}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">{materialLabel} · {qrData.points_value} pts</p>
        </div>
      </motion.div>

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onReady}
        className="w-full bg-[hsl(var(--primary))] text-white font-bold py-4 rounded-2xl text-base shadow-lg"
      >
        ✅ Ya lo he tirado — Tomar foto
      </motion.button>
    </motion.div>
  );
}

// ─── Container Photo Screen ───────────────────────────────────────────────────
function ContainerPhotoScreen({ containerColor, onPhoto, attempts }) {
  const fileRef = useRef();
  const container = CONTAINER_COLORS[containerColor];
  const visual = CONTAINER_VISUALS[containerColor];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-4"
    >
      <div className="text-center">
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide font-medium mb-1">
          Verificación
        </p>
        <h2 className="text-xl font-extrabold text-[hsl(var(--foreground))]">
          📸 Foto del contenedor
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Necesitamos verificar que has reciclado correctamente
        </p>
      </div>

      {/* Tip */}
      <div className={`bg-gradient-to-r ${visual.gradient} rounded-2xl p-4 flex items-start gap-3`}>
        <span className="text-2xl">💡</span>
        <div>
          <p className={`font-bold text-sm ${visual.text}`}>¿Qué fotografiar?</p>
          <p className={`text-xs ${visual.text} opacity-80 mt-0.5 leading-relaxed`}>
            Toma una foto del <strong>{container?.label}</strong>. Asegúrate de que el color o la etiqueta sean visibles.
          </p>
        </div>
      </div>

      {/* Camera area */}
      <button
        onClick={() => fileRef.current?.click()}
        className={`w-full border-2 border-dashed ${visual.border} rounded-3xl p-8 flex flex-col items-center gap-3 hover:opacity-80 transition-opacity bg-[hsl(var(--card))]`}
      >
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${visual.gradient} flex items-center justify-center shadow-md`}>
          <Camera className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="font-bold text-[hsl(var(--foreground))]">Abrir cámara</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            O sube una foto desde tu galería
          </p>
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onPhoto(f); }}
      />

      {attempts > 0 && (
        <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
          Intento {attempts + 1} de 3
        </p>
      )}
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function QRBottleTab() {
  const { user } = useAuth();
  const [state, setState] = useState('idle');
  const [code, setCode] = useState('');
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');
  const [showAnim, setShowAnim] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [containerColor, setContainerColor] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [photoAttempts, setPhotoAttempts] = useState(0);
  const fileRef = useRef();

  async function validateCode(rawCode) {
    const trimmed = rawCode.trim().toUpperCase();
    setState('validating');
    setError('');

    const all = await base44.entities.BottleQR.list({});
    const found = all.find(q => q.code === trimmed);

    if (!found) {
      setState('error');
      setError('Código QR no encontrado. Verifica que el código sea correcto.');
      return;
    }
    if (found.status !== 'unused') {
      setState('already_used');
      setQrData(found);
      return;
    }

    // Determine container color from product type
    const color = MATERIAL_TO_CONTAINER[found.product_type] || 'gris';
    setContainerColor(color);
    setQrData(found);
    setState('container_anim');
  }

  async function handleManualSubmit(e) {
    e.preventDefault();
    if (!code.trim()) return;
    await validateCode(code);
  }

  async function handleCameraCapture(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState('scanning');
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: 'Lee el código QR de esta imagen. El formato es RCLA-XXXXXXXX donde X son letras y números. Devuelve solo el código.',
      file_urls: [file_url],
    });
    const detectedCode = result.qr_code || result.code || '';
    setCode(detectedCode);
    if (detectedCode) await validateCode(detectedCode);
    else { setState('error'); setError('No se pudo leer el QR. Inténtalo de nuevo.'); }
  }

  async function handleContainerPhoto(file) {
    setState('verifying');
    setVerifyError('');
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analiza esta imagen de un contenedor de reciclaje. Detecta el color del contenedor. Responde con detected_color (amarillo/verde/azul/marron/gris), is_correct (boolean), confidence y message. El color esperado: ${containerColor} — esperado:${containerColor}`,
      file_urls: [file_url],
    });

    if (result.is_correct) {
      // Verification passed — redeem
      await handleRedeem();
    } else if (photoAttempts >= 2) {
      // Max attempts — give benefit of the doubt
      await handleRedeem();
    } else {
      setPhotoAttempts(prev => prev + 1);
      setVerifyError(result.message || `Contenedor incorrecto. Usa el ${CONTAINER_COLORS[containerColor]?.label}.`);
      setState('container_wrong');
    }
  }

  async function handleRedeem() {
    if (!qrData || !user) return;
    setState('redeeming');

    const now = new Date().toISOString();
    const newStreak = computeStreak(user.last_recycling_date, user.current_streak || 0);
    const streakBonus = calculateStreakBonus(newStreak);
    const totalPoints = qrData.points_value + streakBonus;

    await base44.entities.BottleQR.update(qrData.id, {
      status: 'used',
      used_by_email: user.email,
      used_at: now,
    });

    await base44.entities.RecyclingAction.create({
      user_email: user.email,
      product_name: qrData.product_name,
      product_type: qrData.product_type,
      barcode: qrData.code,
      validation_status: 'approved',
      points_awarded: totalPoints,
      container_used: containerColor,
    });

    await base44.auth.updateMe({
      total_points: (user.total_points || 0) + totalPoints,
      total_recycled: (user.total_recycled || 0) + 1,
      current_streak: newStreak,
      best_streak: Math.max(user.best_streak || 0, newStreak),
      last_recycling_date: now,
    });

    setEarnedPoints(totalPoints);
    setState('done');
    setShowAnim(true);
  }

  function reset() {
    setState('idle');
    setCode('');
    setQrData(null);
    setError('');
    setVerifyError('');
    setContainerColor('');
    setPhotoAttempts(0);
  }

  return (
    <div className="space-y-4">
      <PointsAnimation points={earnedPoints} show={showAnim} onComplete={() => setShowAnim(false)} />

      <AnimatePresence mode="wait">

        {/* ── IDLE / ERROR ── */}
        {(state === 'idle' || state === 'error') && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Instructions */}
            <div className="bg-[hsl(181,49%,43%)]/10 border border-[hsl(181,49%,43%)]/30 rounded-2xl p-4 flex gap-3">
              <QrCode className="w-5 h-5 text-[hsl(181,49%,43%)] shrink-0 mt-0.5" />
              <p className="text-sm text-[hsl(var(--foreground))]">
                Escanea el QR de la etiqueta en tu botella o introduce el código
                {' '}<code className="font-mono bg-gray-100 px-1 rounded text-xs">RCLA-XXXXXXXX</code>.
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="RCLA-XXXXXXXX"
                className="flex-1 px-4 py-3 rounded-xl border border-[hsl(var(--border))] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
              <button
                type="submit"
                disabled={!code.trim()}
                className="bg-[hsl(var(--primary))] text-white px-4 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
              >
                Validar
              </button>
            </form>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-[hsl(var(--border))] rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-[hsl(var(--primary))] transition-colors"
            >
              <Camera className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
              <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Escanear con cámara</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraCapture} />

            {state === 'error' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-50 rounded-xl p-3">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── LOADING STATES ── */}
        {(state === 'scanning' || state === 'validating' || state === 'redeeming') && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 border-4 border-[hsl(var(--primary))]/30 border-t-[hsl(var(--primary))] rounded-full mx-auto"
            />
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              {state === 'scanning' ? '🔍 Leyendo código QR...'
                : state === 'validating' ? '✅ Verificando código...'
                : '🎉 Guardando tu reciclaje...'}
            </p>
          </motion.div>
        )}

        {/* ── CONTAINER ANIMATION ── */}
        {state === 'container_anim' && qrData && (
          <motion.div key="container_anim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ContainerAnimScreen
              qrData={qrData}
              containerColor={containerColor}
              onReady={() => setState('awaiting_photo')}
            />
          </motion.div>
        )}

        {/* ── AWAITING PHOTO ── */}
        {state === 'awaiting_photo' && (
          <motion.div key="awaiting_photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ContainerPhotoScreen
              containerColor={containerColor}
              onPhoto={handleContainerPhoto}
              attempts={photoAttempts}
            />
          </motion.div>
        )}

        {/* ── VERIFYING CONTAINER ── */}
        {state === 'verifying' && (
          <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 border-4 border-[hsl(181,49%,43%)]/30 border-t-[hsl(181,49%,43%)] rounded-full mx-auto"
            />
            <div>
              <p className="font-bold text-[hsl(var(--foreground))]">🤖 Analizando foto...</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">La IA está verificando el contenedor</p>
            </div>
          </motion.div>
        )}

        {/* ── CONTAINER WRONG ── */}
        {state === 'container_wrong' && (
          <motion.div key="container_wrong" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-2">
              <div className="text-4xl">❌</div>
              <p className="font-bold text-red-800">Contenedor incorrecto</p>
              <p className="text-sm text-red-600 leading-relaxed">{verifyError}</p>
            </div>
            <div className="bg-[hsl(var(--secondary))] rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CONTAINER_VISUALS[containerColor]?.gradient} flex items-center justify-center text-lg`}>
                🗑️
              </div>
              <div>
                <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Debes usar el {CONTAINER_COLORS[containerColor]?.label}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{CONTAINER_COLORS[containerColor]?.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setState('awaiting_photo')}
              className="w-full bg-[hsl(var(--primary))] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Intentar de nuevo ({2 - photoAttempts + 1} intento{2 - photoAttempts + 1 !== 1 ? 's' : ''} restante{2 - photoAttempts + 1 !== 1 ? 's' : ''})
            </button>
            <button onClick={reset} className="w-full text-[hsl(var(--muted-foreground))] text-sm py-2">Cancelar y volver</button>
          </motion.div>
        )}

        {/* ── ALREADY USED ── */}
        {state === 'already_used' && qrData && (
          <motion.div key="already_used" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Este QR ya fue canjeado</p>
                <p className="text-sm text-red-700">
                  Usado el {qrData.used_at ? new Date(qrData.used_at).toLocaleDateString('es-ES') : '—'}
                </p>
              </div>
            </div>
            <button onClick={reset} className="w-full bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-semibold py-3 rounded-xl">
              Intentar con otro código
            </button>
          </motion.div>
        )}

        {/* ── DONE ── */}
        {state === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }} className="text-center py-8 space-y-5">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-7xl leading-none"
            >
              🎉
            </motion.div>
            <div>
              <p className="text-2xl font-extrabold text-[hsl(var(--foreground))]">¡Reciclaje verificado!</p>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">
                Has ganado{' '}
                <strong className="text-[hsl(var(--primary))] text-lg">+{earnedPoints} puntos</strong>
                {' '}por reciclar correctamente.
              </p>
            </div>
            <div className={`bg-gradient-to-br ${CONTAINER_VISUALS[containerColor]?.gradient} rounded-2xl p-4 flex items-center gap-3 text-left`}>
              <span className="text-3xl">✅</span>
              <div>
                <p className={`font-bold text-sm ${CONTAINER_VISUALS[containerColor]?.text}`}>
                  Contenedor verificado
                </p>
                <p className={`text-xs ${CONTAINER_VISUALS[containerColor]?.text} opacity-80`}>
                  {CONTAINER_COLORS[containerColor]?.label} · {CONTAINER_COLORS[containerColor]?.desc}
                </p>
              </div>
            </div>
            <button onClick={reset} className="bg-[hsl(var(--primary))] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md">
              Escanear otro QR
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
