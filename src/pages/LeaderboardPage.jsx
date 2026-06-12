import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap, Crown } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';
import { BOT_USERS } from '../data/auctions';
import Layout from '../components/Layout';

const SORT_MODES = [
  { key: 'balance',   label: '💰 Mayor Saldo'  },
  { key: 'spent',     label: '💸 Más Gastado'  },
  { key: 'wins',      label: '🏆 Más Victorias' },
];

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user, auctions } = useAuction();
  const [sortMode, setSortMode] = useState('spent');

  const allUsers = [
    {
      id: 'u1',
      name: user.name,
      avatar: user.avatar,
      balance: user.balance,
      totalSpent: user.totalSpent,
      wins: user.wins,
      bidsPlaced: user.bidsPlaced,
      isMe: true,
      color: '#a855f7',
    },
    ...BOT_USERS.map(b => ({ ...b, isMe: false })),
  ].sort((a, b) => {
    if (sortMode === 'balance') return b.balance - a.balance;
    if (sortMode === 'spent')   return b.totalSpent - a.totalSpent;
    if (sortMode === 'wins')    return b.wins - a.wins;
    return 0;
  });

  const myRank = allUsers.findIndex(u => u.isMe) + 1;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/20 via-black to-yellow-900/10 p-8 text-center">
          <div className="absolute inset-0 hex-pattern opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Crown size={40} className="text-amber-400 mx-auto mb-3 animate-float" />
            <h1 className="text-4xl font-black text-white mb-2">
              <span className="gradient-text-gold">RANKING</span> GLOBAL
            </h1>
            <p className="text-white/40 text-sm">Los mejores pujadores de PUJALO</p>
          </div>

          {myRank <= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10 mt-4 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black px-4 py-2 rounded-full"
            >
              {RANK_MEDALS[myRank - 1]} ¡Estás en el top {myRank}!
            </motion.div>
          )}
        </div>

        {/* My rank summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tu posición', val: `#${myRank}`, icon: '🎯', color: 'text-violet-400' },
            { label: 'Tu saldo',    val: `${user.balance.toLocaleString()} PC`, icon: '💰', color: 'text-amber-400' },
            { label: 'Victorias',   val: user.wins, icon: '🏆', color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sort tabs */}
        <div className="flex gap-2">
          {SORT_MODES.map(m => (
            <button
              key={m.key}
              onClick={() => setSortMode(m.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                sortMode === m.key
                  ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                  : 'text-white/40 border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        <div className="space-y-2">
          {allUsers.map((u, i) => {
            const rank = i + 1;
            const isTop3 = rank <= 3;

            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`
                  relative flex items-center gap-4 p-4 rounded-2xl border transition-all
                  ${u.isMe
                    ? 'bg-violet-900/20 border-violet-500/30 ring-1 ring-violet-500/20'
                    : isTop3
                    ? 'bg-amber-900/10 border-amber-500/20'
                    : 'bg-white/2 border-white/5 hover:bg-white/4'
                  }
                `}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0 ${
                  rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  rank === 2 ? 'bg-gray-500/20 text-gray-300 border border-gray-500/40' :
                  rank === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                  'bg-white/5 text-white/40 border border-white/8'
                }`}>
                  {rank <= 3 ? RANK_MEDALS[rank - 1] : `#${rank}`}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 flex-shrink-0"
                  style={{ borderColor: u.color + '60', background: u.color + '20' }}
                >
                  {u.avatar}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${u.isMe ? 'text-violet-300' : 'text-white'}`}>
                      {u.name}
                      {u.isMe && <span className="ml-1 text-[10px] text-violet-400">(Tú)</span>}
                    </p>
                    {rank === 1 && <Crown size={12} className="text-amber-400" />}
                  </div>
                  {/* Progress bar relative to leader */}
                  <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden max-w-[160px]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((sortMode === 'balance' ? u.balance : sortMode === 'spent' ? u.totalSpent : u.wins) / (sortMode === 'balance' ? allUsers[0].balance : sortMode === 'spent' ? allUsers[0].totalSpent : allUsers[0].wins)) * 100)}%`,
                        background: `linear-gradient(to right, ${u.color}, ${u.color}80)`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className="font-black text-sm" style={{ color: u.color }}>
                    {sortMode === 'balance'
                      ? `${u.balance.toLocaleString()} PC`
                      : sortMode === 'spent'
                      ? `${u.totalSpent.toLocaleString()} PC`
                      : `${u.wins} wins`
                    }
                  </p>
                  <p className="text-[10px] text-white/30">
                    {sortMode === 'balance' ? 'saldo' : sortMode === 'spent' ? 'gastado' : 'victorias'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs pb-4">
          Ranking actualizado en tiempo real · {allUsers.length} participantes
        </p>
      </div>
    </Layout>
  );
}
