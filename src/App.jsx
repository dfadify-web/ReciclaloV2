import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Scan from '@/pages/Scan';
import UploadVideo from '@/pages/UploadVideo';
import Validation from '@/pages/Validation';
import Profile from '@/pages/Profile';
import History from '@/pages/History';
import Rankings from '@/pages/Rankings';
import Rewards from '@/pages/Rewards';
import MyRewards from '@/pages/MyRewards';
import Campaigns from '@/pages/Campaigns';
import Settings from '@/pages/Settings';
import DailyChallenges from '@/pages/DailyChallenges';
import QRGenerator from '@/pages/admin/QRGenerator';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/upload-video" element={<UploadVideo />} />
              <Route path="/validation" element={<Validation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/my-rewards" element={<MyRewards />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/challenges" element={<DailyChallenges />} />
              <Route path="/admin/qr-generator" element={<QRGenerator />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
