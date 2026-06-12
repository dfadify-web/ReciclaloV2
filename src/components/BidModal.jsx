import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp, Shield, AlertTriangle, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';
import { CATEGORY_CONFIG } from '../data/auctions';
import ItemVisual from './ItemVisual';
import CountdownTimer from './CountdownTimer';

function SmartSuggestion({ label, amount, description, color, onClick }) {
  return (
    <button
      onClick={() => onClick(amount)}
      className={`flex-1 p-3 rounded-xl border text-left transition-all hover:scale-102 active:scale-98 ${color}`}
    >
      <p className="text-xs font-bold leading-tight">{label}</p>
      <p className="text-lg font-black mt-0.5">{amount} <span className="text-xs font-normal opacity-60">PC</span></p>
      <p className="text-[10px] opacity-60 mt-0.5 leading-tight">{description}</p>
    </button>
  );
}

export default function BidModal({ auction, onClose }) {
  const { user, placeBid } = useAuction();
  const config = CATEGORY_CONFIG[auction.category] || CATEGORY_CONFIG['Electronics'];

  const minBid = auction.currentBid + auction.minIncrement;
  const [amount, setAmount] = useState(minBid);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');

  const canAfford = amount <= user.balance;
  const isValid = amount >= minBid;
  const dealPct = Math.round((1 - amount / auction.retailValue) * 100);

  const suggestions = useMemo(() => [
    {
      label: 'Puja mínima',
      amount: minBid,
      description: 'Solo lo necesario para liderar',
      color: 'border-white/10 text-white/70 hover:border-violet-500/40 hover:bg-violet-500/5',
    },
    {
      label: '🎯 Recomendada',
      amount: Math.round(minBid * 1.08),
      description: 'Disuade a competidores',
      color: 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20',
    },
    {
      label: '⚡ Agresiva',
      amount: Math.round(minBid * 1.2),
      description: 'Domina la subasta',
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20',
    },
  ], [minBid]);

  const handlePlace = () => {
    if (!isValid) { setError(`La puja mínima es ${minBid} PC`); return; }
    if (!canAfford) { setError('Saldo insuficiente'); return; }
    placeBid(auction.id, amount);
    setPlaced(true);
    setTimeout(onClose, 1800);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ boxShadow: `0 0 60px ${config.glow}, 0 30px 60px rgba(0,0,0,0.8)` }}
        >
          {/* Header gradient line */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${config.from}, ${config.to})` }} />

          {placed ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12 px-8 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.span
                className="text-6xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1.1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                🎯
              </motion.span>
              <h2 className="text-2xl font-black text-white mb-2">¡Puja Realizada!</h2>
              <p className="text-white/60 text-sm">
                Pujaste <span className="text-violet-400 font-bold">{amount} PC</span> por {auction.name}
              </p>
              <div
                className="mt-4 h-1 rounded-full"
                style={{ background: `linear-gradient(to right, ${config.from}, ${config.to})`, width: '60%' }}
              />
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start gap-3 p-5 border-b border-white/5">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <ItemVisual item={auction} size="thumb" className="!h-16" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-white text-base leading-tight line-clamp-1">{auction.name}</h2>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{auction.subtitle}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-white/50 text-xs flex items-center gap-1">
                      <Clock size={10} /> <CountdownTimer endTime={auction.endTime} compact />
                    </span>
                    <span className="text-white/30 text-xs">{auction.totalBids} pujas</span>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/30 hover:text-white transition-colors mt-0.5">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Current bid */}
                <div className="flex justify-between items-center bg-white/3 rounded-xl p-3">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Puja actual</p>
                    <p className="text-2xl font-black text-white">{auction.currentBid.toLocaleString()} <span className="text-white/40 text-sm font-normal">PC</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Valor retail</p>
                    <p className="text-lg font-bold text-white/50">{auction.retailValue.toLocaleString()} PC</p>
                  </div>
                </div>

                {/* Smart suggestions */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp size={10} /> Sugerencias inteligentes
                  </p>
                  <div className="flex gap-2">
                    {suggestions.map(s => (
                      <SmartSuggestion key={s.label} {...s} onClick={v => { setAmount(v); setError(''); }} />
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">O introduce tu puja</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAmount(v => Math.max(minBid, v - auction.minIncrement))}
                      className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all"
                    >
                      <ChevronDown size={18} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={amount}
                        min={minBid}
                        max={user.balance}
                        onChange={e => { setAmount(Number(e.target.value)); setError(''); }}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-white font-black text-xl text-center focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold">PC</span>
                    </div>
                    <button
                      onClick={() => setAmount(v => v + auction.minIncrement)}
                      className="w-10 h-12 flex items-center justify-center rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all"
                    >
                      <ChevronUp size={18} />
                    </button>
                  </div>
                </div>

                {/* Analysis */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/3 rounded-xl p-2">
                    <p className="text-[10px] text-white/40 mb-1">Ahorro</p>
                    <p className={`text-sm font-bold ${dealPct > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {dealPct > 0 ? `-${dealPct}%` : `+${Math.abs(dealPct)}%`}
                    </p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-2">
                    <p className="text-[10px] text-white/40 mb-1">Tu saldo</p>
                    <p className={`text-sm font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>
                      {(user.balance - amount).toLocaleString()} PC
                    </p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-2">
                    <p className="text-[10px] text-white/40 mb-1">Condición</p>
                    <p className="text-sm font-bold text-white">{auction.condition}</p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <AlertTriangle size={14} className="text-red-400" />
                    <p className="text-red-400 text-xs font-medium">{error}</p>
                  </div>
                )}

                {/* Warning if spending a lot */}
                {amount > user.balance * 0.5 && canAfford && (
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                    <Shield size={14} className="text-amber-400" />
                    <p className="text-amber-400 text-xs">Esta puja usa más del 50% de tu saldo</p>
                  </div>
                )}

                {/* Bid button */}
                <motion.button
                  onClick={handlePlace}
                  disabled={!isValid || !canAfford}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    w-full h-14 rounded-xl font-black text-base flex items-center justify-center gap-2
                    transition-all disabled:opacity-40 disabled:cursor-not-allowed
                    ${auction.isVip
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black animate-glow-gold'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white animate-glow-pulse'
                    }
                  `}
                >
                  <Zap size={18} fill="currentColor" />
                  CONFIRMAR PUJA — {amount.toLocaleString()} PC
                </motion.button>

                <p className="text-center text-white/20 text-[10px]">
                  Al pujar aceptas los términos de PUJALO. Las pujas son vinculantes.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
