import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, TrendingUp, Package, Star, Shield, Clock, Wallet, Award, Eye } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';
import Layout from '../components/Layout';
import ItemVisual from '../components/ItemVisual';
import CountdownTimer from '../components/CountdownTimer';

const LEVEL_TIERS = [
  { min: 1,  max: 4,  name: 'Bronce',   color: 'text-orange-400', bg: 'from-orange-900/30 to-orange-800/10', border: 'border-orange-500/30' },
  { min: 5,  max: 9,  name: 'Plata',    color: 'text-gray-300',   bg: 'from-gray-700/30 to-gray-600/10',   border: 'border-gray-500/30'   },
  { min: 10, max: 19, name: 'Oro',      color: 'text-amber-400',  bg: 'from-amber-900/30 to-amber-800/10', border: 'border-amber-500/30'  },
  { min: 20, max: 49, name: 'Platino',  color: 'text-cyan-400',   bg: 'from-cyan-900/30 to-cyan-800/10',   border: 'border-cyan-500/30'   },
  { min: 50, max: 999,name: 'Diamante', color: 'text-violet-400', bg: 'from-violet-900/30 to-violet-800/10', border: 'border-violet-500/30'},
];

function getTier(level) {
  return LEVEL_TIERS.find(t => level >= t.min && level <= t.max) || LEVEL_TIERS[0];
}

const ALL_ACHIEVEMENTS = [
  { id: 'first_bid',  icon: '🎯', label: 'Primera Puja',   desc: 'Haz tu primera puja'   },
  { id: 'winner',     icon: '🏆', label: 'Ganador',         desc: 'Gana una subasta'       },
  { id: 'collector',  icon: '💎', label: 'Coleccionista',   desc: 'Gana 5 subastas'        },
  { id: 'spender',    icon: '💸', label: 'Gran Gastador',   desc: 'Gasta 1000 PC'          },
  { id: 'whale',      icon: '🐋', label: 'Ballena',         desc: 'Gasta 5000 PC'          },
  { id: 'seller',     icon: '🏪', label: 'Vendedor',        desc: 'Vende un artículo'      },
  { id: 'watcher',    icon: '👁️', label: 'Observador',      desc: 'Añade 10 a favoritos'   },
  { id: 'streak3',    icon: '🔥', label: 'Racha x3',        desc: '3 días seguidos'        },
];

export default function Profile() {
  const { user, auctions, ACHIEVEMENTS } = useAuction();
  const navigate = useNavigate();
  const tier = getTier(user.level);

  const activeBids = auctions.filter(a => user.activeBids[a.id] && a.endTime > Date.now());
  const xpToNext = ((user.level) ** 2) * 100;
  const xpProgress = Math.min(100, (user.xp / xpToNext) * 100);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ─── PROFILE HERO ─────────────────────────────────────── */}
        <div className={`relative overflow-hidden rounded-3xl border ${tier.border} bg-gradient-to-br ${tier.bg} p-6`}>
          <div className="absolute inset-0 hex-pattern opacity-30" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-4xl border-2 ${tier.border} animate-glow-pulse`}>
                {user.avatar}
              </div>
              <div className={`absolute -bottom-2 -right-2 ${tier.color} text-[10px] font-black bg-black border ${tier.border} px-2 py-0.5 rounded-full`}>
                Nv.{user.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tier.color} ${tier.border} bg-black/20`}>
                  {tier.name}
                </span>
              </div>
              <p className="text-white/40 text-sm mt-1">
                Miembro desde {new Date(user.joinDate).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
              </p>

              {/* XP bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-white/40">
                  <span>{user.xp} XP</span>
                  <span>{xpToNext} XP para Nivel {user.level + 1}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600`}
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="text-right">
              <div className="flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-2xl px-5 py-3">
                <Wallet size={18} className="text-violet-400" />
                <div>
                  <p className="text-2xl font-black text-white">{user.balance.toLocaleString()}</p>
                  <p className="text-violet-400 text-xs font-bold uppercase tracking-wider">PujaCoins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── STATS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Zap,        label: 'Pujas',        val: user.bidsPlaced,              color: 'text-violet-400', bg: 'from-violet-900/20' },
            { icon: Trophy,     label: 'Victorias',    val: user.wins,                    color: 'text-amber-400',  bg: 'from-amber-900/20'  },
            { icon: TrendingUp, label: 'Total gastado',val: `${user.totalSpent.toLocaleString()} PC`, color: 'text-emerald-400', bg: 'from-emerald-900/20' },
            { icon: Package,    label: 'Vendidos',     val: user.itemsSold,               color: 'text-blue-400',   bg: 'from-blue-900/20'   },
          ].map(({ icon: Icon, label, val, color, bg }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${bg} to-transparent border border-white/8 rounded-2xl p-4 text-center`}
            >
              <Icon size={20} className={`${color} mx-auto mb-2`} />
              <p className={`text-2xl font-black ${color}`}>{val}</p>
              <p className="text-white/40 text-xs uppercase tracking-wide">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── ACTIVE BIDS ──────────────────────────────────────── */}
        {activeBids.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <Zap size={16} className="text-violet-400" fill="currentColor" />
              Pujas Activas
              <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                {activeBids.length}
              </span>
            </h2>
            <div className="space-y-2">
              {activeBids.map(auction => {
                const isLeading = user.activeBids[auction.id] === auction.currentBid;
                return (
                  <motion.div
                    key={auction.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate(`/item/${auction.id}`)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isLeading
                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                        : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <ItemVisual item={auction} size="thumb" className="!h-12" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white line-clamp-1">{auction.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        Tu puja: <span className="text-white font-semibold">{user.activeBids[auction.id]} PC</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <div className={`text-xs font-bold ${isLeading ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isLeading ? '✅ Liderando' : '⚡ Superado'}
                      </div>
                      <CountdownTimer endTime={auction.endTime} compact />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── WON ITEMS ────────────────────────────────────────── */}
        {user.wonItems.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <Trophy size={16} className="text-amber-400" />
              Artículos Ganados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.wonItems.map((item, i) => (
                <motion.div
                  key={`${item.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all"
                >
                  <ItemVisual item={item} />
                  <div className="p-3">
                    <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-amber-400 font-black text-sm">{item.paidPrice} PC</span>
                      <span className="text-white/30 text-[10px]">{new Date(item.wonAt).toLocaleDateString('es')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── ACHIEVEMENTS ─────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
            <Award size={16} className="text-violet-400" />
            Logros
            <span className="text-xs text-white/40">({user.achievements.length}/{ALL_ACHIEVEMENTS.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ALL_ACHIEVEMENTS.map(a => {
              const earned = user.achievements.includes(a.id);
              return (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    earned
                      ? 'bg-violet-900/20 border-violet-500/30 animate-glow-pulse'
                      : 'bg-white/2 border-white/5 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <p className="text-xs font-bold text-white">{a.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{a.desc}</p>
                  {earned && <p className="text-[9px] text-violet-400 font-bold mt-1.5">DESBLOQUEADO</p>}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── WATCHLIST ────────────────────────────────────────── */}
        {user.watchlist.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
              <Eye size={16} className="text-red-400" />
              Favoritos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {auctions.filter(a => user.watchlist.includes(a.id)).map(auction => (
                <motion.div
                  key={auction.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(`/item/${auction.id}`)}
                  className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-2xl p-3 cursor-pointer hover:border-red-500/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <ItemVisual item={auction} size="thumb" className="!h-12" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white line-clamp-1">{auction.name}</p>
                    <p className="text-violet-400 font-black text-sm">{auction.currentBid.toLocaleString()} PC</p>
                  </div>
                  <CountdownTimer endTime={auction.endTime} compact />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
