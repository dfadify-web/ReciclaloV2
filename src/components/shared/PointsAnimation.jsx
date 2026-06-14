import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function PointsAnimation({ points, show, onComplete }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onComplete, 2200);
      return () => clearTimeout(t);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-[hsl(var(--primary))] text-white rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-2">
            <span className="text-5xl">🎉</span>
            <span className="text-3xl font-extrabold">+{points} pts</span>
            <span className="text-sm opacity-80">¡Reciclaje validado!</span>
          </div>
          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: (Math.cos((i * Math.PI * 2) / 8) * 120),
                y: (Math.sin((i * Math.PI * 2) / 8) * 120),
                scale: 0,
              }}
              transition={{ duration: 1.5, delay: 0.1 }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: ['#57CC99', '#38A3A5', '#80ED99', '#22577A', '#C7F9CC'][i % 5] }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
