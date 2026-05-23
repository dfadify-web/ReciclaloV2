import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import LoginPage from '@/pages/Login';
import UsernameModal from '@/components/shared/UsernameModal';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <LoadingSpinner text="Iniciando Recíclalo..." />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Show username picker after any login if not yet set
  // Disappears automatically once updateMe saves the username to auth context
  const needsUsername = !user.username;

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto">
      <TopBar />
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
      {needsUsername && <UsernameModal onComplete={() => {}} />}
    </div>
  );
}
