import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function GoogleAuthModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');

  function toTitleCase(str) {
    return str.replace(/[._-]/g, ' ').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  async function handleContinue() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Introduce un correo electrónico válido');
      return;
    }
    setStep('loading');
    try {
      const name = toTitleCase(trimmed.split('@')[0]);
      await base44.auth.signInWithGoogle({ email: trimmed, name });
      onClose();
    } catch {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
      setStep('email');
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GoogleLogo />
              <span className="text-sm text-gray-500 font-medium">Google</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="px-6 pb-2">
            <h2 className="text-2xl font-semibold text-gray-800 mt-2">Iniciar sesión</h2>
            <p className="text-sm text-gray-500 mt-0.5">Usa tu cuenta de Google en Recíclalo</p>
          </div>

          {step === 'email' && (
            <div className="px-6 pb-6 pt-4 space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleContinue()}
                  placeholder="Correo electrónico"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {error && <p className="text-xs text-red-600 mt-1.5 px-1">{error}</p>}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Al continuar aceptas las{' '}
                <span className="text-blue-600 cursor-pointer">Condiciones del Servicio</span>{' '}
                y la{' '}
                <span className="text-blue-600 cursor-pointer">Política de Privacidad</span>{' '}
                de Google.
              </p>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={onClose}
                  className="text-sm text-blue-600 font-semibold px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!email.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="px-6 pb-8 pt-4 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Verificando cuenta...</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
