import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Clock, Star, Filter, Search, Crown } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';
import { CATEGORIES } from '../data/auctions';
import AuctionCard from '../components/AuctionCard';
import Layout from '../components/Layout';

const SORT_OPTIONS = [
  { value: 'ending',  label: '⏱ Terminando pronto' },
  { value: 'hot',     label: '🔥 Más populares'     },
  { value: 'deal',    label: '💰 Mejor precio'       },
  { value: 'newest',  label: '✨ Más recientes'      },
];

export default function Home() {
  const { auctions, user } = useAuction();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('ending');
  const [search, setSearch] = useState('');

  const flashAuctions = auctions.filter(a => a.isFlash && a.endTime > Date.now());
  const vipAuctions   = auctions.filter(a => a.isVip  && a.endTime > Date.now());

  const filtered = useMemo(() => {
    let list = auctions.filter(a => a.endTime > Date.now());
    if (category !== 'All') list = list.filter(a => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.tags?.some(t => t.toLowerCase().includes(q)));
    }
    switch (sort) {
      case 'ending':  return [...list].sort((a, b) => a.endTime - b.endTime);
      case 'hot':     return [...list].sort((a, b) => b.totalBids - a.totalBids);
      case 'deal':    return [...list].sort((a, b) => (a.currentBid / a.retailValue) - (b.currentBid / b.retailValue));
      case 'newest':  return [...list].sort((a, b) => b.endTime - a.endTime);
      default:        return list;
    }
  }, [auctions, category, sort, search]);

  const stats = useMemo(() => ({
    active: auctions.filter(a => a.endTime > Date.now()).length,
    totalBids: auctions.reduce((s, a) => s + a.totalBids, 0),
    flash: flashAuctions.length,
  }), [auctions]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/5 min-h-[280px] flex items-center">
          {/* Background */}
          <div className="absolute inset-0 hex-pattern opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-black to-indigo-900/30" />
          {/* Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

          <div className="relative z-10 px-8 py-10 w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
                    ⚡ Live Auction House
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black leading-none tracking-tight">
                  <span className="shimmer-text">PUJA.</span>
                  <br />
                  <span className="text-white">GANA.</span>
                  <br />
                  <span className="gradient-text">DOMINA.</span>
                </h1>
                <p className="text-white/50 text-base max-w-sm">
                  El mejor sistema de subastas en tiempo real. {stats.active} subastas activas ahora mismo.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🎯', val: stats.active,    label: 'Activas',    color: 'text-violet-400' },
                  { icon: '💥', val: stats.totalBids, label: 'Pujas hoy',  color: 'text-indigo-400' },
                  { icon: '💎', val: user.balance,    label: 'Tus PujaCoins', color: 'text-amber-400' },
                ].map(s => (
                  <motion.div
                    key={s.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center backdrop-blur-sm min-w-[90px]"
                  >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`text-2xl font-black ${s.color}`}>{s.val.toLocaleString()}</div>
                    <div className="text-white/40 text-[10px] uppercase tracking-wide">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FLASH AUCTIONS ───────────────────────────────────── */}
        {flashAuctions.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-yellow-400 animate-heartbeat" fill="currentColor" />
              <h2 className="text-lg font-black text-white">Subastas Flash</h2>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold animate-heartbeat">
                ¡Tiempo limitado!
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashAuctions.map((a, i) => (
                <AuctionCard key={a.id} auction={a} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ─── VIP LOUNGE ───────────────────────────────────────── */}
        {vipAuctions.length > 0 && (
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-900/10 to-yellow-900/10 p-6">
              <div className="absolute right-4 top-4 text-4xl opacity-10">👑</div>
              <div className="flex items-center gap-2 mb-4">
                <Crown size={16} className="text-amber-400" />
                <h2 className="text-lg font-black gradient-text-gold">VIP Lounge</h2>
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Exclusivo
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vipAuctions.map((a, i) => (
                  <AuctionCard key={a.id} auction={a} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── MAIN GRID ────────────────────────────────────────── */}
        <section>
          {/* Controls */}
          <div className="space-y-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar artículos, marcas, categorías..."
                className="w-full h-11 bg-white/3 border border-white/8 rounded-xl pl-10 pr-4 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 focus:bg-violet-500/5 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category filters */}
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      category === cat
                        ? 'bg-violet-600 text-white border-violet-500'
                        : 'text-white/50 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5 ml-auto">
                <Filter size={12} className="text-white/30" />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-white/3 border border-white/10 rounded-lg text-xs text-white/70 px-3 py-1.5 focus:outline-none focus:border-violet-500/40 cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-sm">
              <span className="text-white font-bold">{filtered.length}</span> artículos encontrados
            </p>
            {Object.keys(user.activeBids).length > 0 && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
                <TrendingUp size={11} />
                {Object.keys(user.activeBids).length} pujas activas
              </div>
            )}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`${category}-${sort}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((auction, i) => (
                  <AuctionCard key={auction.id} auction={auction} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 space-y-3"
              >
                <p className="text-5xl">🔍</p>
                <p className="text-white/60 text-lg font-bold">No hay resultados</p>
                <p className="text-white/30 text-sm">Prueba otra categoría o término de búsqueda</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </Layout>
  );
}
