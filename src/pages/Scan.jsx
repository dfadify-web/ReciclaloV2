import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, Loader2, CheckCircle, Package, QrCode } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { CONTAINER_COLORS, MATERIAL_LABELS, computeStreak, calculateStreakBonus } from '@/lib/gamification';
import PointsAnimation from '@/components/shared/PointsAnimation';
import QRBottleTab from '@/components/scan/QRBottleTab';

const TABS = [
  { id: 'manual', label: 'Manual', icon: Search },
  { id: 'photo', label: 'Foto', icon: Camera },
  { id: 'qr', label: 'QR', icon: QrCode },
];

function ManualTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [done, setDone] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!barcode.trim()) return;
    setLoading(true);
    setProduct(null);

    const products = await base44.entities.Product.list({ filters: { barcode: barcode.trim() } });
    if (products.length > 0) {
      setProduct(products[0]);
    } else {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Identifica este producto por su código de barras: ${barcode}. Devuelve: brand (marca), type (plastico/vidrio/carton/metal/organico/otros), container_color (amarillo/verde/azul/marron/gris), base_points (número entre 5 y 20), y una breve description. Si no puedes identificarlo, usa valores genéricos razonables.`,
      });
      setProduct({
        id: null,
        brand: result.brand || 'Producto genérico',
        type: result.type || 'plastico',
        container_color: result.container_color || 'amarillo',
        base_points: result.base_points || 10,
        barcode: barcode,
        description: result.description || 'Identificado por inteligencia artificial',
        ai: true,
      });
    }
    setLoading(false);
  }

  async function awardPoints() {
    if (!product || !user) return;
    setLoading(true);
    const today = new Date().toISOString();
    const newStreak = computeStreak(user.last_recycling_date, user.current_streak || 0);
    const streakBonus = calculateStreakBonus(newStreak);
    const pts = product.base_points + streakBonus;

    await base44.entities.RecyclingAction.create({
      user_email: user.email,
      product_name: product.brand,
      product_type: product.type,
      barcode: product.barcode || barcode,
      validation_status: 'approved',
      points_awarded: pts,
      container_used: product.container_color,
    });

    await base44.auth.updateMe({
      total_points: (user.total_points || 0) + pts,
      total_recycled: (user.total_recycled || 0) + 1,
      current_streak: newStreak,
      best_streak: Math.max(user.best_streak || 0, newStreak),
      last_recycling_date: today,
    });

    setEarnedPoints(pts);
    setShowAnim(true);
    setDone(true);
    setLoading(false);
  }

  const container = product ? CONTAINER_COLORS[product.container_color] : null;

  return (
    <div className="space-y-4">
      <PointsAnimation points={earnedPoints} show={showAnim} onComplete={() => setShowAnim(false)} />

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          placeholder="Código de barras del envase"
          className="flex-1 px-4 py-3 rounded-xl border border-[hsl(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
        />
        <button
          type="submit"
          disabled={loading || !barcode.trim()}
          className="bg-[hsl(var(--primary))] text-white px-4 py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>

      <AnimatePresence>
        {product && !done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-sm"
          >
            <div className={`${container?.bg || 'bg-gray-200'} h-2`} />
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[hsl(var(--secondary))] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[hsl(var(--foreground))]">{product.brand}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{MATERIAL_LABELS[product.type] || product.type}</p>
                  {product.ai && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Identificado por IA</span>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[hsl(var(--primary))]">+{product.base_points}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">puntos</p>
                </div>
              </div>

              {container && (
                <div className={`${container.bg} text-white rounded-xl p-3 flex items-center gap-2`}>
                  <span className="text-sm font-semibold">{container.label}</span>
                  <span className="text-xs opacity-80">· {container.desc}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => navigate(`/upload-video?barcode=${product.barcode || barcode}`)}
                  className="border border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-semibold py-2.5 rounded-xl text-sm"
                >
                  Grabar vídeo
                </button>
                <button
                  onClick={awardPoints}
                  disabled={loading}
                  className="bg-[hsl(var(--primary))] text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
                >
                  {loading ? '...' : 'Obtener puntos'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col items-center gap-3"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
            <p className="font-bold text-green-800 text-lg">¡{earnedPoints} puntos ganados!</p>
            <button onClick={() => { setProduct(null); setBarcode(''); setDone(false); }} className="text-sm text-green-700 underline">
              Escanear otro envase
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotoTab() {
  const { user } = useAuth();
  const fileRef = useRef();
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState(null);
  const [showAnim, setShowAnim] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [done, setDone] = useState(false);

  const steps = ['Subiendo imagen', 'Leyendo código', 'Identificando producto'];

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStep(1);

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setStep(2);

    const barcodeResult = await base44.integrations.Core.InvokeLLM({
      prompt: 'Lee el código de barras de esta imagen. Devuelve solo el número del código.',
      file_urls: [file_url],
    });
    const barcode = barcodeResult.barcode || '0000000000';
    setStep(3);

    const products = await base44.entities.Product.list({ filters: { barcode } });
    let prod;
    if (products.length > 0) {
      prod = products[0];
    } else {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Identifica el producto con código de barras ${barcode}. Devuelve brand, type (plastico/vidrio/carton/metal), container_color (amarillo/verde/azul/marron/gris), base_points.`,
        file_urls: [file_url],
      });
      prod = { id: null, brand: result.brand || 'Producto genérico', type: result.type || 'plastico', container_color: result.container_color || 'amarillo', base_points: result.base_points || 10, barcode, ai: true };
    }
    setProduct(prod);
    setStep(4);
  }

  async function awardPoints() {
    if (!product || !user) return;
    const today = new Date().toISOString();
    const newStreak = computeStreak(user.last_recycling_date, user.current_streak || 0);
    const streakBonus = calculateStreakBonus(newStreak);
    const pts = product.base_points + streakBonus;

    await base44.entities.RecyclingAction.create({
      user_email: user.email,
      product_name: product.brand,
      product_type: product.type,
      barcode: product.barcode,
      validation_status: 'approved',
      points_awarded: pts,
      container_used: product.container_color,
    });

    await base44.auth.updateMe({
      total_points: (user.total_points || 0) + pts,
      total_recycled: (user.total_recycled || 0) + 1,
      current_streak: newStreak,
      best_streak: Math.max(user.best_streak || 0, newStreak),
      last_recycling_date: today,
    });

    setEarnedPoints(pts);
    setShowAnim(true);
    setDone(true);
  }

  const container = product ? CONTAINER_COLORS[product.container_color] : null;

  return (
    <div className="space-y-4">
      <PointsAnimation points={earnedPoints} show={showAnim} onComplete={() => setShowAnim(false)} />

      {step === 0 && (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-[hsl(var(--border))] rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-[hsl(var(--primary))] transition-colors"
        >
          <Camera className="w-10 h-10 text-[hsl(var(--muted-foreground))]" />
          <p className="font-semibold text-[hsl(var(--foreground))]">Tomar foto del envase</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">La IA leerá el código de barras automáticamente</p>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      {step > 0 && step < 4 && (
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i + 1 === step ? 'bg-[hsl(var(--primary))]/10' : i + 1 < step ? 'opacity-50' : 'opacity-30'}`}>
              {i + 1 < step ? (
                <CheckCircle className="w-5 h-5 text-[hsl(var(--primary))]" />
              ) : i + 1 === step ? (
                <Loader2 className="w-5 h-5 text-[hsl(var(--primary))] animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[hsl(var(--border))]" />
              )}
              <span className={`text-sm font-medium ${i + 1 === step ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {step === 4 && product && !done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{product.brand}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{MATERIAL_LABELS[product.type] || product.type}</p>
            </div>
            <p className="text-2xl font-extrabold text-[hsl(var(--primary))]">+{product.base_points}</p>
          </div>
          {container && (
            <div className={`${container.bg} text-white rounded-xl p-2.5 text-sm font-semibold`}>{container.label} · {container.desc}</div>
          )}
          <button onClick={awardPoints} className="w-full bg-[hsl(var(--primary))] text-white font-bold py-3 rounded-xl">Obtener puntos</button>
        </motion.div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-3">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <p className="font-bold text-lg">¡{earnedPoints} puntos ganados!</p>
          <button onClick={() => { setStep(0); setProduct(null); setDone(false); }} className="text-sm text-[hsl(var(--primary))] underline">
            Escanear otro
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function Scan() {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Escanear envase</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">Recicla y gana puntos instantáneamente.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[hsl(var(--secondary))] rounded-2xl p-1 gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === id ? 'bg-white shadow text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'manual' && <ManualTab />}
          {activeTab === 'photo' && <PhotoTab />}
          {activeTab === 'qr' && <QRBottleTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
