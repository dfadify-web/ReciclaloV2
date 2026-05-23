import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <Leaf className="w-8 h-8 text-[hsl(var(--primary))]" />
      </motion.div>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">{text}</p>
    </div>
  );
}
