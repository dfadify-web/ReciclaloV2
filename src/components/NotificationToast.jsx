import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuction } from '../store/AuctionContext';

const COLOR_MAP = {
  purple: { bg: 'from-violet-900/90 to-violet-800/80', border: 'border-violet-500/40', icon: 'text-violet-300' },
  red:    { bg: 'from-red-900/90 to-red-800/80',       border: 'border-red-500/40',    icon: 'text-red-300'    },
  gold:   { bg: 'from-amber-900/90 to-amber-800/80',   border: 'border-amber-500/40',  icon: 'text-amber-300'  },
  green:  { bg: 'from-emerald-900/90 to-emerald-800/80', border: 'border-emerald-500/40', icon: 'text-emerald-300' },
  gray:   { bg: 'from-gray-900/90 to-gray-800/80',     border: 'border-gray-500/40',   icon: 'text-gray-300'   },
};

function Toast({ notif }) {
  const { dismissNotification } = useAuction();
  const colors = COLOR_MAP[notif.color] || COLOR_MAP.purple;

  useEffect(() => {
    const t = setTimeout(() => dismissNotification(notif.id), 5000);
    return () => clearTimeout(t);
  }, [notif.id]);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`relative flex items-start gap-3 w-80 p-4 rounded-xl border backdrop-blur-custom bg-gradient-to-br ${colors.bg} ${colors.border} shadow-2xl overflow-hidden cursor-pointer`}
      onClick={() => dismissNotification(notif.id)}
    >
      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 bg-white/30`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />

      {/* Glow orb */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl ${
        notif.color === 'gold' ? 'bg-amber-400' : notif.color === 'red' ? 'bg-red-400' : notif.color === 'green' ? 'bg-emerald-400' : 'bg-violet-400'
      }`} />

      <span className="text-2xl leading-none mt-0.5 relative z-10">{notif.icon}</span>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="font-bold text-white text-sm leading-tight">{notif.title}</p>
        <p className="text-white/70 text-xs mt-0.5 leading-snug">{notif.message}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
        className="text-white/40 hover:text-white/80 transition-colors relative z-10 mt-0.5"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function NotificationToast() {
  const { notifications } = useAuction();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {notifications.map(n => (
          <Toast key={n.id} notif={n} />
        ))}
      </AnimatePresence>
    </div>
  );
}
