import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuctionProvider } from './store/AuctionContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LeaderboardPage from './pages/LeaderboardPage';
import Sell from './pages/Sell';
import ItemDetail from './pages/ItemDetail';

export default function App() {
  return (
    <AuctionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<Home />}          />
          <Route path="/item/:id"    element={<ItemDetail />}    />
          <Route path="/profile"     element={<Profile />}       />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/sell"        element={<Sell />}          />
        </Routes>
      </BrowserRouter>
    </AuctionProvider>
  );
}
