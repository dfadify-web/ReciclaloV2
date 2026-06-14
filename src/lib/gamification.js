export const LEVELS = [
  { level: 1, name: 'Semilla', min: 0, max: 99 },
  { level: 2, name: 'Brote', min: 100, max: 299 },
  { level: 3, name: 'Planta', min: 300, max: 699 },
  { level: 4, name: 'Árbol', min: 700, max: 1499 },
  { level: 5, name: 'Bosque', min: 1500, max: 2999 },
  { level: 6, name: 'Selva', min: 3000, max: Infinity },
];

export const CONTAINER_COLORS = {
  amarillo: { label: 'Contenedor Amarillo', bg: 'bg-yellow-400', text: 'text-yellow-900', desc: 'Plástico y metal', hex: '#facc15' },
  verde: { label: 'Contenedor Verde', bg: 'bg-green-500', text: 'text-white', desc: 'Vidrio', hex: '#22c55e' },
  azul: { label: 'Contenedor Azul', bg: 'bg-blue-500', text: 'text-white', desc: 'Papel y cartón', hex: '#3b82f6' },
  marron: { label: 'Contenedor Marrón', bg: 'bg-amber-700', text: 'text-white', desc: 'Orgánico', hex: '#b45309' },
  gris: { label: 'Contenedor Gris', bg: 'bg-gray-400', text: 'text-white', desc: 'Resto', hex: '#9ca3af' },
};

export const MATERIAL_LABELS = {
  plastico: 'Plástico',
  vidrio: 'Vidrio',
  carton: 'Cartón',
  metal: 'Metal',
  organico: 'Orgánico',
  otros: 'Otros',
};

export function getLevelByPoints(points) {
  return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
}

export function getNextLevel(points) {
  const current = getLevelByPoints(points);
  return LEVELS.find(l => l.level === current.level + 1) || null;
}

export function getLevelProgress(points) {
  const current = getLevelByPoints(points);
  const next = getNextLevel(points);
  if (!next) return 100;
  const range = next.min - current.min;
  const progress = points - current.min;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function calculateStreakBonus(streak) {
  if (streak >= 30) return 15;
  if (streak >= 14) return 10;
  if (streak >= 7) return 5;
  if (streak >= 3) return 2;
  return 0;
}

export function getLevelColor(level) {
  const colors = {
    1: 'from-green-300 to-green-400',
    2: 'from-green-400 to-emerald-500',
    3: 'from-emerald-500 to-teal-500',
    4: 'from-teal-500 to-cyan-600',
    5: 'from-cyan-600 to-blue-600',
    6: 'from-amber-400 to-yellow-500',
  };
  return colors[level] || colors[1];
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr.startsWith(today);
}

export function isYesterday(dateStr) {
  if (!dateStr) return false;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  return dateStr.startsWith(yesterday);
}

export function computeStreak(lastDate, currentStreak) {
  const today = new Date().toISOString().split('T')[0];
  if (!lastDate) return 1;
  if (isToday(lastDate)) return currentStreak;
  if (isYesterday(lastDate)) return currentStreak + 1;
  return 1;
}
