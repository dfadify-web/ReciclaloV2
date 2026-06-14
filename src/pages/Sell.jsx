import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Tag, Clock, ChevronDown, Zap, AlertTriangle, CheckCircle, PlusCircle, Info } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';
import { CATEGORY_CONFIG } from '../data/auctions';
import Layout from '../components/Layout';
import ItemVisual from '../components/ItemVisual';

const CATEGORIES_SELL = ['Electronics', 'Watches & Jewelry', 'Sneakers & Fashion', 'Collectibles', 'Gaming', 'Vintage & Art'];

const DURATIONS = [
  { hours: 1,  label: '1 hora',   desc: 'Urgente'      },
  { hours: 6,  label: '6 horas',  desc: 'Popular'       },
  { hours: 24, label: '1 día',    desc: 'Recomendado', recommended: true },
  { hours: 72, label: '3 días',   desc: 'Máxima visib.' },
];

const EMOJIS_BY_CATEGORY = {
  'Electronics':        ['💻', '📱', '🎧', '📷', '🖥️', '⌨️', '🖱️', '📺'],
  'Watches & Jewelry':  ['⌚', '💍', '📿', '🕐', '🔮'],
  'Sneakers & Fashion': ['👟', '🥾', '👕', '🧥', '🩴', '🧢'],
  'Collectibles':       ['🃏', '🦇', '⚽', '🌸', '🎭', '🏆'],
  'Gaming':             ['🎮', '🕹️', '🖥️', '🎤', '🎯'],
  'Vintage & Art':      ['📸', '🎸', '🖼️', '🥃', '📚', '🎨'],
};

const LISTING_FEE = 10;

export default function Sell() {
  const { user, listItem } = useAuction();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    category: 'Electronics',
    emoji: '💻',
    condition: 'New',
    startingBid: 50,
    retailValue: 100,
    duration: 24,
    tags: '',
    isVip: false,
  });

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const config = CATEGORY_CONFIG[form.category] || CATEGORY_CONFIG['Electronics'];

  const previewItem = {
    ...form,
    id: 'preview',
    currentBid: form.startingBid,
    endTime: Date.now() + form.duration * 3600000,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
  };

  const canSubmit = form.name.trim() && form.description.trim() && form.startingBid > 0 && user.balance >= LISTING_FEE;

  const handleSubmit = () => {
    if (!canSubmit) return;
    listItem({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setSubmitted(true);
    setTimeout(() => navigate('/'), 2500);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl animate-float"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-black text-white">¡Artículo publicado!</h2>
          <p className="text-white/50 text-sm max-w-xs">
            <strong className="text-white">{form.name}</strong> está ahora en subasta. Los compradores pueden ver tu artículo en tiempo real.
          </p>
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full">
            <Tag size={14} />
            Comisión cobrada: {LISTING_FEE} PC
          </div>
          <p className="text-white/30 text-xs">Redirigiendo a subastas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <PlusCircle size={32} className="text-violet-400" />
            Poner en Subasta
          </h1>
          <p className="text-white/40 text-sm">Publica tu artículo y deja que la comunidad puje por él</p>

          {/* Fee notice */}
          <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400/80 text-xs px-3 py-2 rounded-lg w-fit">
            <Info size={12} />
            Comisión de publicación: <strong>{LISTING_FEE} PC</strong> (tu saldo: {user.balance.toLocaleString()} PC)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3 space-y-5">

            {/* Step indicator */}
            <div className="flex gap-2 mb-2">
              {['Detalles', 'Precio', 'Publicar'].map((s, i) => (
                <div
                  key={s}
                  onClick={() => canSubmit && setStep(i + 1)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    step === i + 1
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : step > i + 1
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/3 text-white/30 border border-white/8'
                  }`}
                >
                  {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Nombre del artículo *</label>
                    <input
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="Ej: Sony WH-1000XM5 Headphones"
                      className="w-full h-12 bg-white/3 border border-white/10 rounded-xl px-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Subtítulo</label>
                    <input
                      value={form.subtitle}
                      onChange={e => update('subtitle', e.target.value)}
                      placeholder="Ej: 256GB, Negro, Como nuevo"
                      className="w-full h-12 bg-white/3 border border-white/10 rounded-xl px-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>

                  {/* Category + Emoji */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Categoría *</label>
                      <select
                        value={form.category}
                        onChange={e => { update('category', e.target.value); update('emoji', EMOJIS_BY_CATEGORY[e.target.value][0]); }}
                        className="w-full h-12 bg-white/3 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                      >
                        {CATEGORIES_SELL.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Icono</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {(EMOJIS_BY_CATEGORY[form.category] || []).map(e => (
                          <button
                            key={e}
                            onClick={() => update('emoji', e)}
                            className={`w-10 h-10 rounded-xl text-xl transition-all ${form.emoji === e ? 'bg-violet-600/30 border border-violet-500/60 scale-110' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Condición</label>
                    <div className="flex gap-2">
                      {['New', 'Like New', 'Good', 'Fair'].map(c => (
                        <button
                          key={c}
                          onClick={() => update('condition', c)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            form.condition === c
                              ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                              : 'text-white/40 border-white/8 hover:border-white/15'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Descripción *</label>
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      rows={4}
                      placeholder="Describe el artículo con detalle: estado, accesorios incluidos, motivo de venta..."
                      className="w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Etiquetas (separadas por coma)</label>
                    <input
                      value={form.tags}
                      onChange={e => update('tags', e.target.value)}
                      placeholder="Sony, Wireless, ANC, Premium"
                      className="w-full h-12 bg-white/3 border border-white/10 rounded-xl px-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>

                  <button onClick={() => setStep(2)} disabled={!form.name || !form.description}
                    className="w-full h-12 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
                    Siguiente: Precio →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  {/* Starting bid */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Puja inicial (PC) *</label>
                    <input
                      type="number"
                      value={form.startingBid}
                      min={1}
                      onChange={e => update('startingBid', Number(e.target.value))}
                      className="w-full h-12 bg-white/3 border border-white/10 rounded-xl px-4 text-white text-xl font-bold focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                    <p className="text-white/30 text-xs mt-1">💡 Precios más bajos atraen más pujas. Entre 30-200 PC suele funcionar bien.</p>
                  </div>

                  {/* Retail value */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Valor retail estimado (PC)</label>
                    <input
                      type="number"
                      value={form.retailValue}
                      min={1}
                      onChange={e => update('retailValue', Number(e.target.value))}
                      className="w-full h-12 bg-white/3 border border-white/10 rounded-xl px-4 text-white text-xl font-bold focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                    <p className="text-white/30 text-xs mt-1">Esto muestra a los compradores cuánto se ahorran</p>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Duración de la subasta</label>
                    <div className="grid grid-cols-2 gap-2">
                      {DURATIONS.map(d => (
                        <button
                          key={d.hours}
                          onClick={() => update('duration', d.hours)}
                          className={`relative p-3 rounded-xl border text-left transition-all ${
                            form.duration === d.hours
                              ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                              : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20'
                          }`}
                        >
                          {d.recommended && (
                            <span className="absolute top-2 right-2 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                              Mejor
                            </span>
                          )}
                          <p className="font-bold text-sm">{d.label}</p>
                          <p className="text-[10px] opacity-60">{d.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 h-12 bg-white/5 hover:bg-white/8 text-white/60 font-bold rounded-xl border border-white/10 transition-all">
                      ← Atrás
                    </button>
                    <button onClick={() => setStep(3)} disabled={form.startingBid < 1}
                      className="flex-1 h-12 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all">
                      Revisar y publicar →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3">
                    <h3 className="text-sm font-black text-white uppercase tracking-wide">Resumen</h3>
                    {[
                      ['Artículo',       form.name || '—'],
                      ['Categoría',      form.category],
                      ['Condición',      form.condition],
                      ['Puja inicial',   `${form.startingBid} PC`],
                      ['Valor retail',   `${form.retailValue} PC`],
                      ['Duración',       `${form.duration}h`],
                      ['Comisión',       `${LISTING_FEE} PC`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-sm py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-white/40">{k}</span>
                        <span className="text-white font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>

                  {user.balance < LISTING_FEE && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                      <AlertTriangle size={14} className="text-red-400" />
                      <p className="text-red-400 text-xs">Saldo insuficiente para la comisión</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 h-12 bg-white/5 hover:bg-white/8 text-white/60 font-bold rounded-xl border border-white/10 transition-all">
                      ← Atrás
                    </button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 disabled:opacity-40 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all animate-glow-pulse"
                    >
                      <Zap size={16} fill="currentColor" />
                      PUBLICAR SUBASTA
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Package size={12} />
                Vista previa
              </p>
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  borderColor: config.glow,
                  boxShadow: `0 0 30px ${config.glow}30`,
                }}
              >
                <ItemVisual item={previewItem} />
                <div className="p-4 bg-[#0d0d0d] space-y-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badge}`}>
                    {form.category}
                  </span>
                  <p className="font-bold text-white text-sm">{form.name || 'Nombre del artículo'}</p>
                  <p className="text-white/40 text-xs">{form.subtitle || 'Subtítulo'}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-white/30 text-[10px]">Puja inicial</p>
                      <p className="text-xl font-black text-white">{form.startingBid} <span className="text-white/40 text-xs">PC</span></p>
                    </div>
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 animate-glow-pulse">
                      <Zap size={11} fill="currentColor" />
                      PUJAR
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
