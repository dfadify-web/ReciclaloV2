import { useState } from 'react';
import { motion } from 'framer-motion';
import { AtSign, CheckCircle, XCircle, Leaf } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function validateUsername(u) {
  if (!u) return '';
  if (u.length < 3) return 'Mínimo 3 caracteres';
  if (u.length > 20) return 'Máximo 20 caracteres';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Solo letras, números y guión bajo (_)';
  return '';
}

export default function UsernameModal({ onComplete }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationError = validateUsername(username);
  const isValid = username.length >= 3 && !validationError;

  function handleChange(e) {
    // auto-lowercase + strip invalid chars
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(val);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await base44.auth.updateMe({ username: username.trim() });
      onComplete(username.trim());
    } catch {
      setError('No se pudo guardar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="bg-white rounded-3xl w-full max-w-sm p-7 shadow-2xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(154,53%,44%)] to-[hsl(181,49%,43%)] flex items-center justify-center shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
            ¡Elige tu nombre!
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1.5 leading-relaxed">
            Así aparecer&aacute;s en el <span className="font-semibold text-[hsl(var(--primary))]">ranking</span> de recicladores. Hazlo memorable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input */}
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              value={username}
              onChange={handleChange}
              placeholder="tu_nombre"
              maxLength={20}
              autoFocus
              className="w-full pl-9 pr-10 py-3.5 rounded-2xl border-2 border-[hsl(var(--border))] font-mono text-sm bg-[hsl(var(--background))] focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
            />
            {username.length > 0 && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {isValid
                  ? <CheckCircle className="w-4 h-4 text-green-500" />
                  : <XCircle className="w-4 h-4 text-red-400" />
                }
              </span>
            )}
          </div>

          {/* Validation hint */}
          {(error || validationError) ? (
            <p className="text-xs text-red-500 px-1">{error || validationError}</p>
          ) : (
            <p className="text-xs text-[hsl(var(--muted-foreground))] px-1">
              Letras, números y guión bajo • 3-20 caracteres
            </p>
          )}

          {/* Preview */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[hsl(var(--secondary))] rounded-xl px-4 py-2.5 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(154,53%,44%)] to-[hsl(181,49%,43%)] flex items-center justify-center text-white text-xs font-bold">
                {username[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-[hsl(var(--foreground))]">@{username}</span>
              <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">así te verán</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-[hsl(var(--primary))] text-white font-bold py-3.5 rounded-2xl disabled:opacity-50 transition-opacity text-base shadow-md"
          >
            {loading ? 'Guardando...' : '¡Listo, a reciclar! 🌱'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
