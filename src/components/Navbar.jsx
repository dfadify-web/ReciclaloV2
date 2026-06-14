import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, User, Trophy, PlusCircle, Bell, Wallet, Gift, Menu, X } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';

const NAV = [
  { to: '/',            icon: Gavel,      label: 'Subastas'   },
  { to: '/sell',        icon: PlusCircle, label: 'Vender'     },
  { to: '/leaderboard', icon: Trophy,     label: 'Ranking'    },
  { to: '/profile',     icon: User,       label: 'Perfil'     },
];

export default function Navbar() {
  const { user, notifications, showDailyBonus, claimDailyBonus } = useAuction();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBonus, setShowBonus] = useState(true);

  const unread = notifications.length;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/5"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="text-2xl font-black tracking-tight gradient-text">PUJALO</span>
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[10px] text-white/30 font-medium border border-white/10 px-1.5 py-0.5 rounded-full hidden sm:block">
              ELITE AUCTION
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Daily bonus */}
            {showDailyBonus && showBonus && (
              <motion.button
                onClick={() => { claimDailyBonus(); setShowBonus(false); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full hover:from-amber-500/30"
              >
                <Gift size={13} />
                +100 PC
              </motion.button>
            )}

            {/* Notifications */}
            <button className="relative w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {/* Balance */}
            <Link to="/profile" className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 hover:border-violet-500/30 px-3 py-1.5 rounded-xl transition-all group">
              <Wallet size={14} className="text-violet-400" />
              <span className="font-bold text-white text-sm">{user.balance.toLocaleString()}</span>
              <span className="text-white/30 text-xs">PC</span>
            </Link>

            {/* Avatar */}
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white border border-violet-500/30 hover:border-violet-400 transition-all"
            >
              {user.avatar}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed top-16 inset-x-0 z-30 bg-black/95 border-b border-white/10 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-4 space-y-1">
              {NAV.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === to
                      ? 'bg-violet-600/20 text-violet-300'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <div className="flex items-center gap-2 p-3 mt-2 border-t border-white/5">
                <Wallet size={16} className="text-violet-400" />
                <span className="text-white font-bold">{user.balance.toLocaleString()} PC</span>
                {showDailyBonus && showBonus && (
                  <button
                    onClick={() => { claimDailyBonus(); setShowBonus(false); }}
                    className="ml-auto text-xs text-amber-400 font-bold"
                  >
                    Reclamar +100 PC 🎁
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
