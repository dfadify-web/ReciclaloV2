import { Link } from 'react-router-dom';
import { Leaf, QrCode } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[hsl(var(--border))] px-4 h-14 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-xl flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-[hsl(var(--foreground))]">Recíclalo</span>
      </Link>

      <div className="flex items-center gap-3">
        {user?.role === 'admin' && (
          <Link
            to="/admin/qr-generator"
            className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--accent))] border border-[hsl(var(--accent))] rounded-full px-3 py-1 hover:bg-[hsl(var(--accent))/10]"
          >
            <QrCode className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}
        {user && (
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-sm font-bold">
            {(user.fullName || user.email || '?')[0].toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
