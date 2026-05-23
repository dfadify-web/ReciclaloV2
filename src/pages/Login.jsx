import { useState } from 'react';
import { Leaf, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogle, setShowGoogle] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await base44.auth.signIn({ email, password });
      } else {
        await base44.auth.signUp({ email, password, fullName });
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[hsl(154,55%,38%)] via-[hsl(181,49%,38%)] to-[hsl(204,56%,28%)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Leaf className="w-10 h-10 text-[hsl(154,53%,44%)]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recíclalo</h1>
          <p className="text-white/70 text-sm mt-1">Gamificación del reciclaje</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <div className="flex rounded-xl bg-[hsl(var(--secondary))] p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'register' ? 'bg-white shadow text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass ? <EyeOff className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /> : <Eye className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-[hsl(var(--destructive))] bg-red-50 rounded-xl p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(var(--primary))] text-white font-bold py-3 rounded-xl transition-opacity disabled:opacity-60 hover:opacity-90"
            >
              {loading ? '...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 h-px bg-[hsl(var(--border))]" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">o</span>
            <div className="flex-1 h-px bg-[hsl(var(--border))]" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={() => setShowGoogle(true)}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors shadow-sm"
          >
            <GoogleLogo />
            Continuar con Google
          </button>

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
            Al continuar aceptas los <span className="underline cursor-pointer">Términos de Uso</span>
          </p>
        </div>

        <p className="text-center text-white/60 text-xs mt-6">
          Recicla • Gana puntos • Salva el planeta 🌍
        </p>
      </motion.div>

      <AnimatePresence>
        {showGoogle && <GoogleAuthModal onClose={() => setShowGoogle(false)} />}
      </AnimatePresence>
    </div>
  );
}
