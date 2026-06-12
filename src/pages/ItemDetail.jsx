import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Shield, Star, Clock, TrendingUp, Users, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';
import { CATEGORY_CONFIG } from '../data/auctions';
import Layout from '../components/Layout';
import ItemVisual from '../components/ItemVisual';
import CountdownTimer from '../components/CountdownTimer';
import BidModal from '../components/BidModal';

function BidHistoryRow({ bid, index, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        isUser
          ? 'bg-violet-500/10 border border-violet-500/20'
          : index === 0
          ? 'bg-white/5 border border-white/8'
          : 'bg-transparent border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          index === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/40'
        }`}>
          {index === 0 ? '👑' : `#${index + 1}`}
        </div>
        <div>
          <p className={`text-sm font-bold ${isUser ? 'text-violet-300' : index === 0 ? 'text-white' : 'text-white/60'}`}>
            {bid.user} {isUser && '(Tú)'}
          </p>
          <p className="text-white/30 text-[10px]">
            {new Date(bid.time).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <span className={`font-black text-sm ${index === 0 ? 'text-emerald-400' : 'text-white/50'}`}>
        {bid.amount.toLocaleString()} PC
      </span>
    </motion.div>
  );
}

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auctions, user, toggleWatchlist } = useAuction();
  const [showBid, setShowBid] = useState(false);
  const [showAllBids, setShowAllBids] = useState(false);

  const auction = auctions.find(a => a.id === id);

  if (!auction) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span className="text-5xl">🔍</span>
          <p className="text-white/60 text-xl font-bold">Subasta no encontrada</p>
          <p className="text-white/30 text-sm">Puede que ya haya terminado</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-all">
            Ver subastas activas
          </button>
        </div>
      </Layout>
    );
  }

  const config = CATEGORY_CONFIG[auction.category] || CATEGORY_CONFIG['Electronics'];
  const isWatching = user.watchlist.includes(auction.id);
  const isLeading = user.activeBids[auction.id] === auction.currentBid;
  const isOutbid = user.activeBids[auction.id] && !isLeading;
  const dealPct = Math.round((1 - auction.currentBid / auction.retailValue) * 100);
  const displayedBids = showAllBids ? auction.bids : auction.bids.slice(0, 5);

  const similar = auctions.filter(a => a.id !== id && a.category === auction.category).slice(0, 3);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a subastas
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image + Details */}
          <div className="space-y-4">
            <div className="relative">
              <ItemVisual item={auction} size="detail" />
              {auction.isVip && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  👑 VIP Exclusive
                </div>
              )}
              {auction.isHot && !auction.isVip && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full animate-heartbeat">
                  🔥 Hot Item
                </div>
              )}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => toggleWatchlist(auction.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isWatching
                      ? 'bg-red-500/30 text-red-400 border border-red-500/40'
                      : 'bg-black/40 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Heart size={16} fill={isWatching ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Item info */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${config.badge}`}>
                  {auction.category}
                </span>
                <span className="text-xs font-medium text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {auction.condition}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white leading-tight">{auction.name}</h1>
                <p className="text-white/50 text-sm mt-1">{auction.subtitle}</p>
              </div>

              <p className="text-white/60 text-sm leading-relaxed">{auction.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {auction.tags?.map(tag => (
                  <span key={tag} className="text-[10px] text-white/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Seller */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                  {auction.seller[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{auction.seller}</p>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-amber-400" fill="currentColor" />
                    <span className="text-amber-400 text-xs font-bold">{auction.sellerRating}</span>
                    <span className="text-white/30 text-xs">· Vendedor verificado</span>
                  </div>
                </div>
                <Shield size={14} className="text-emerald-400 ml-auto" />
              </div>
            </div>
          </div>

          {/* Right: Bid section */}
          <div className="space-y-4">
            {/* Timer + bid */}
            <div
              className="rounded-2xl border p-5 space-y-4"
              style={{
                background: `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.8))`,
                borderColor: `${config.glow}`,
                boxShadow: `0 0 40px ${config.glow}40`,
              }}
            >
              {/* Timer */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Tiempo restante</p>
                  <CountdownTimer endTime={auction.endTime} />
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Vigilando</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Users size={12} className="text-white/50" />
                    <span className="text-white font-bold text-sm">{auction.watchCount}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-center py-4 border-y border-white/5">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Puja actual</p>
                <motion.div
                  key={auction.currentBid}
                  initial={{ scale: 1.2, color: '#4ade80' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-5xl font-black text-white"
                >
                  {auction.currentBid.toLocaleString()}
                  <span className="text-2xl text-white/40 font-bold ml-2">PC</span>
                </motion.div>
                <p className="text-white/30 text-sm mt-2">
                  Valor retail: <span className="text-white/50">{auction.retailValue.toLocaleString()} PC</span>
                  {dealPct > 0 && <span className="text-emerald-400 font-bold ml-2">(-{dealPct}%)</span>}
                </p>
              </div>

              {/* User status */}
              {isLeading && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                  <span className="text-emerald-400 text-lg">✅</span>
                  <div>
                    <p className="text-emerald-400 text-sm font-bold">¡Estás ganando!</p>
                    <p className="text-emerald-400/60 text-xs">Tu puja: {user.activeBids[auction.id]} PC</p>
                  </div>
                </div>
              )}
              {isOutbid && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 animate-heartbeat">
                  <span className="text-red-400 text-lg">⚠️</span>
                  <div>
                    <p className="text-red-400 text-sm font-bold">¡Te han superado!</p>
                    <p className="text-red-400/60 text-xs">Tu última puja: {user.activeBids[auction.id]} PC</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Pujas',     val: auction.totalBids,  icon: <TrendingUp size={14} /> },
                  { label: 'Puja mín.', val: `+${auction.minIncrement} PC`, icon: <ChevronUp size={14} /> },
                  { label: 'Tu saldo',  val: `${user.balance.toLocaleString()} PC`, icon: <Zap size={14} /> },
                ].map(s => (
                  <div key={s.label} className="bg-white/3 rounded-xl p-3">
                    <div className="flex justify-center text-white/30 mb-1">{s.icon}</div>
                    <p className="text-sm font-black text-white">{s.val}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Bid button */}
              <motion.button
                onClick={() => setShowBid(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full h-14 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all
                  ${auction.isVip
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black animate-glow-gold'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white animate-glow-pulse'
                  }`}
              >
                <Zap size={18} fill="currentColor" />
                {isLeading ? 'AUMENTAR PUJA' : 'PUJAR AHORA'}
              </motion.button>
            </div>

            {/* Bid history */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Historial de Pujas
                </h3>
                <span className="text-xs text-white/30">{auction.bids.length} pujas</span>
              </div>
              {auction.bids.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">Sin pujas aún. ¡Sé el primero!</p>
              ) : (
                <div className="space-y-1">
                  {displayedBids.map((bid, i) => (
                    <BidHistoryRow
                      key={`${bid.user}-${bid.time}`}
                      bid={bid}
                      index={i}
                      isUser={bid.user === user.name}
                    />
                  ))}
                  {auction.bids.length > 5 && (
                    <button
                      onClick={() => setShowAllBids(v => !v)}
                      className="w-full text-center text-white/40 text-xs py-2 hover:text-white/70 transition-colors flex items-center justify-center gap-1"
                    >
                      {showAllBids ? <><ChevronUp size={12} /> Menos</> : <><ChevronDown size={12} /> Ver {auction.bids.length - 5} más</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar items */}
        {similar.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-black text-white mb-4">Artículos similares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/item/${a.id}`)}
                  className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/30 transition-all group card-hover"
                >
                  <ItemVisual item={a} />
                  <div className="p-3">
                    <p className="text-sm font-bold text-white line-clamp-1 group-hover:gradient-text transition-all">{a.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-violet-400 font-black text-sm">{a.currentBid.toLocaleString()} PC</span>
                      <CountdownTimer endTime={a.endTime} compact />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {showBid && <BidModal auction={auction} onClose={() => setShowBid(false)} />}
    </Layout>
  );
}
