import { Link } from 'react-router-dom';
import { Home, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="w-20 h-20 bg-[hsl(var(--secondary))] rounded-3xl flex items-center justify-center">
        <Leaf className="w-10 h-10 text-[hsl(var(--primary))]" />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-[hsl(var(--foreground))]">404</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-2">Esta página no existe.</p>
      </div>
      <Link to="/">
        <button className="bg-[hsl(var(--primary))] text-white font-semibold px-6 py-3 rounded-2xl flex items-center gap-2">
          <Home className="w-4 h-4" />
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}
