import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Zap, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuction } from '../store/AuctionContext';
import { CATEGORY_CONFIG } from '../data/auctions';
import ItemVisual from './ItemVisual';
import CountdownTimer from './CountdownTimer';
import BidModal from './BidModal';

export default function AuctionCard({ auction, index = 0 }) {
  const { user, toggleWatchlist } = useAuction();
  const [showBid, setShowBid] = useState(false);
  const [flash, setFlash] = useState(false);
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[auction.category] || CATEGORY_CONFIG['Electronics'];

  const isWatching = user.watchlist.includes(auction.id);
  const isLeading = user.activeBids[auction.id] === auction.currentBid;
  const isOutbid = user.activeBids[auction.id] && !isLeading;
  const dealPct = Math.round((1 - auction.currentBid / auction.retailValue) * 100);

  const handleBid = useCallback((e) => {
    e.stopPropagation();
    setFlash(true);
    setShowBid(true);
    setTimeout(() => setFlash(false), 600);
  }, []);

  const handleWatch = useCallback((e) => {
    e.stopPropagation();
    toggleWatchlist(auction.id);
  }, [auction.id, toggleWatchlist]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
        className={`
          card-border-glow card-hover relative rounded-2xl overflow-hidden cursor-pointer
          bg-[#0d0d0d] border border-white/5 group
          ${auction.isVip ? 'vip-glow' : ''}
          ${flash ? 'bid-flash' : ''}
          ${isLeading ? 'ring-1 ring-emerald-500/50' : ''}
          ${isOutbid ? 'ring-1 ring-red-500/50' : ''}
        `}
        onClick={() => navigate(`/item/${auction.id}`)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Status ribbons */}
        {auction.isVip && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
            👑 VIP
          </div>
        )}
        {auction.isHot && !auction.isVip && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-heartbeat">
            🔥 HOT
          </div>
        )}
        {isLeading && (
          <div className="absolute top-3 right-12 z-20 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Liderando
          </div>
        )}
        {isOutbid && (
          <div className="absolute top-3 right-12 z-20 bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30 animate-heartbeat">
            ¡Superado!
          </div>
        )}

        {/* Watch button */}
        <button
          onClick={handleWatch}
          className={`absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
            isWatching
              ? 'bg-red-500/30 text-red-400 border border-red-500/50'
              : 'bg-black/40 text-white/40 border border-white/10 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={13} fill={isWatching ? 'currentColor' : 'none'} />
        </button>

        {/* Image */}
        <ItemVisual item={auction} />

        {/* Deal badge */}
        {dealPct > 20 && (
          <div
            className="absolute bottom-[168px] right-3 z-10 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${config.from}, ${config.to})` }}
          >
            -{dealPct}% retail
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category + timer */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badge}`}>
              {auction.category}
            </span>
            <CountdownTimer endTime={auction.endTime} compact />
          </div>

          {/* Name */}
          <div>
            <h3 className="font-bold text-white text-sm leading-tight line-clamp-1 group-hover:gradient-text transition-all">
              {auction.name}
            </h3>
            <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{auction.subtitle}</p>
          </div>

          {/* Bid info */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Puja actual</p>
              <div className="flex items-center gap-1.5">
                <motion.p
                  key={auction.currentBid}
                  initial={{ scale: 1.3, color: '#4ade80' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-xl font-black text-white"
                >
                  {auction.currentBid.toLocaleString()}
                </motion.p>
                <span className="text-white/40 text-xs font-bold">PC</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Users size={10} className="text-white/30" />
                <span className="text-white/30 text-[10px]">{auction.totalBids} pujas</span>
                <span className="text-white/20 text-[10px] mx-1">·</span>
                <Eye size={10} className="text-white/30" />
                <span className="text-white/30 text-[10px]">{auction.watchCount}</span>
              </div>
            </div>

            {/* Bid button */}
            <motion.button
              onClick={handleBid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className={`
                btn-bid relative px-4 py-2.5 rounded-xl text-xs font-black text-white
                flex items-center gap-1.5 overflow-hidden transition-all
                ${auction.isVip
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black animate-glow-gold'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 animate-glow-pulse'
                }
              `}
            >
              <Zap size={12} fill="currentColor" />
              PUJAR
            </motion.button>
          </div>

          {/* Value bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/30">
              <span>Precio inicial: {auction.startingBid} PC</span>
              <span className="flex items-center gap-1">
                <TrendingUp size={9} />
                Valor: {auction.retailValue} PC
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${config.from}, ${config.to})` }}
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(100, (auction.currentBid / auction.retailValue) * 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {showBid && (
        <BidModal auction={auction} onClose={() => setShowBid(false)} />
      )}
    </>
  );
}
