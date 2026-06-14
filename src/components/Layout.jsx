import Navbar from './Navbar';
import NotificationToast from './NotificationToast';
import ParticleEffect from './ParticleEffect';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <NotificationToast />
      <ParticleEffect />
    </div>
  );
}
