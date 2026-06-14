import { NavLink } from 'react-router-dom';
import { Home, ScanLine, Trophy, Gift, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/scan', icon: ScanLine, label: 'Escanear', central: true },
  { to: '/challenges', icon: Trophy, label: 'Retos' },
  { to: '/rewards', icon: Gift, label: 'Premios' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[hsl(var(--border))] flex items-center h-16 px-2 max-w-lg mx-auto">
      {navItems.map(({ to, icon: Icon, label, central }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              central ? 'relative -mt-4' : ''
            } ${isActive && !central ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`
          }
        >
          {({ isActive }) =>
            central ? (
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isActive ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--primary))]'}`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            ) : (
              <>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )
          }
        </NavLink>
      ))}
    </nav>
  );
}
