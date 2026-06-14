import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getLevelByPoints } from '@/lib/gamification';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'municipality', label: 'Municipio' },
  { id: 'province', label: 'Provincia' },
  { id: 'community', label: 'C. Autónoma' },
];

const MEDAL_CONFIG = {
  1: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', emoji: '🥇', size: 'h-20' },
  2: { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', emoji: '🥈', size: 'h-16' },
  3: { color: 'text-amber-700', bg: 'bg-amber-50/60', border: 'border-amber-100', emoji: '🥉', size: 'h-14' },
};

function getDisplayName(u) {
  if (u.username) return `@${u.username}`;
  return u.fullName?.split(' ')[0] || u.email?.split('@')[0] || 'Usuario';
}

function getInitial(u) {
  if (u.username) return u.username[0].toUpperCase();
  return (u.fullName || u.email || '?')[0].toUpperCase();
}

const MOCK_USERNAMES = ['ana_recicla', 'carloseco', 'verde_maria', 'jose_planet', 'laurita_r', 'pedro_green', 'isa_reciclaje', 'fran_eco', 'carmen_verde', 'miguel_azul'];
const MOCK_POINTS = [2850, 2430, 1980, 1720, 1540, 1230, 980, 760, 520, 310];

function buildMockRanking(currentUser) {
  const stored = JSON.parse(localStorage.getItem('reciclalo_user') || 'null');
  const names = ['Ana García', 'Carlos López', 'María Martín', 'José Fernández', 'Laura Sánchez', 'Pedro Gómez', 'Isabel Díaz', 'Francisco Rodríguez', 'Carmen González', 'Miguel Torres'];
  const users = names.map((name, i) => ({
    id: `mock-${i}`,
    email: `user${i}@example.com`,
    fullName: name,
    username: MOCK_USERNAMES[i],
    total_points: MOCK_POINTS[i],
    municipality: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'][i % 4],
    province: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'][i % 4],
    community: ['Comunidad de Madrid', 'Cataluña', 'Comunitat Valenciana', 'Andalucía'][i % 4],
  }));
  if (stored) users.push(stored);
  return users.sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
}

export default function Rankings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('general');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = buildMockRanking(user);
    let filtered = all;
    if (tab === 'municipality' && user?.municipality) {
      filtered = all.filter(u => u.municipality === user.municipality);
    } else if (tab === 'province' && user?.province) {
      filtered = all.filter(u => u.province === user.province);
    } else if (tab === 'community' && user?.community) {
      filtered = all.filter(u => u.community === user.community);
    }
    setRanking(filtered.slice(0, 50));
    setLoading(false);
  }, [tab, user]);

  const myPosition = ranking.findIndex(u => u.email === user?.email) + 1;
  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Clasificación</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Compite con los mejores recicladores.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${tab === t.id ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      {top3.length >= 2 && (
        <div className="flex items-end justify-center gap-3 py-4">
          {podiumOrder.map((u, idx) => {
            const pos = top3.indexOf(u) + 1;
            const cfg = MEDAL_CONFIG[pos];
            const isMe = u.email === user?.email;
            return (
              <motion.div
                key={u.id || u.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col items-center gap-1 flex-1 ${cfg.bg} ${cfg.border} border rounded-2xl p-3 ${isMe ? 'ring-2 ring-[hsl(var(--primary))]' : ''}`}
              >
                <span className="text-2xl">{cfg.emoji}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${isMe ? 'bg-[hsl(var(--primary))]' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                  {getInitial(u)}
                </div>
                <p className="text-xs font-semibold text-center leading-tight text-[hsl(var(--foreground))] truncate w-full">{getDisplayName(u)}</p>
                <p className={`text-sm font-extrabold ${cfg.color}`}>{(u.total_points || 0).toLocaleString('es-ES')}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* My position highlight */}
      {myPosition > 3 && (
        <div className="bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white font-bold text-sm">
            {myPosition}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Tu posición</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{user?.username ? `@${user.username}` : (user?.fullName || user?.email)}</p>
          </div>
          <p className="font-extrabold text-[hsl(var(--primary))]">{(user?.total_points || 0).toLocaleString('es-ES')} pts</p>
        </div>
      )}

      {/* Rest list */}
      <div className="space-y-2">
        {rest.map((u, i) => {
          const pos = i + 4;
          const isMe = u.email === user?.email;
          const level = getLevelByPoints(u.total_points || 0);
          return (
            <motion.div
              key={u.id || u.email}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isMe ? 'bg-[hsl(var(--primary))]/5 border-[hsl(var(--primary))]/30' : 'bg-[hsl(var(--card))] border-[hsl(var(--border))]'}`}
            >
              <span className="w-7 text-center text-sm font-bold text-[hsl(var(--muted-foreground))]">{pos}</span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${isMe ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground))]'}`}>
                {getInitial(u)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{getDisplayName(u)}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{level.name}</p>
              </div>
              <p className="text-sm font-bold text-[hsl(var(--primary))] shrink-0">{(u.total_points || 0).toLocaleString('es-ES')} pts</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
