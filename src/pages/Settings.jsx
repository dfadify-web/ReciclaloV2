import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell, Save, LogOut, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [municipality, setMunicipality] = useState(user?.municipality || '');
  const [province, setProvince] = useState(user?.province || '');
  const [community, setCommunity] = useState(user?.community || '');
  const [notifications, setNotifications] = useState(user?.notifications !== false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await base44.auth.updateMe({ municipality, province, community, notifications });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleLogout() {
    await base44.auth.logout();
    navigate('/');
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]";

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-4 right-4 max-w-lg mx-auto z-50 bg-green-600 text-white rounded-2xl p-4 flex items-center gap-2 shadow-xl"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-semibold">Ajustes guardados correctamente.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Ajustes</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Personaliza tu experiencia en Recíclalo.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Location */}
        <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[hsl(var(--primary))]" />
            <h2 className="font-semibold text-[hsl(var(--foreground))]">Ubicación</h2>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Usamos tu ubicación para mostrarte el ranking de tu zona y campañas locales.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Municipio</label>
              <input type="text" value={municipality} onChange={e => setMunicipality(e.target.value)} placeholder="Ej: Madrid" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Provincia</label>
              <input type="text" value={province} onChange={e => setProvince(e.target.value)} placeholder="Ej: Madrid" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Comunidad autónoma</label>
              <input type="text" value={community} onChange={e => setCommunity(e.target.value)} placeholder="Ej: Comunidad de Madrid" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[hsl(var(--primary))]" />
              <div>
                <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Notificaciones</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Recibe recordatorios y novedades</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--border))]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-4 space-y-2">
          <h2 className="font-semibold text-sm text-[hsl(var(--foreground))]">Cuenta</h2>
          <div className="text-sm text-[hsl(var(--muted-foreground))] space-y-1">
            <p>Nombre: <span className="text-[hsl(var(--foreground))] font-medium">{user?.fullName || '—'}</span></p>
            <p>Email: <span className="text-[hsl(var(--foreground))] font-medium">{user?.email}</span></p>
            <p>Rol: <span className="text-[hsl(var(--foreground))] font-medium capitalize">{user?.role || 'usuario'}</span></p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[hsl(var(--primary))] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 border border-red-200 text-red-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
}
