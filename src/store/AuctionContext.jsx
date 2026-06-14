import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { INITIAL_AUCTIONS, BOT_USERS } from '../data/auctions';

const AuctionContext = createContext(null);

const INITIAL_USER = {
  id: 'u1',
  name: 'Tú',
  avatar: '🏆',
  balance: 10000,
  totalSpent: 0,
  wins: 0,
  bidsPlaced: 0,
  itemsSold: 0,
  wonItems: [],
  listedItems: [],
  activeBids: {},
  watchlist: [],
  achievements: [],
  joinDate: Date.now(),
  level: 1,
  xp: 0,
  lastDailyBonus: null,
  bidStreak: 0,
};

const ACHIEVEMENTS = [
  { id: 'first_bid',   label: 'Primera Puja',   desc: 'Haz tu primera puja',      icon: '🎯', req: b => b.bidsPlaced >= 1     },
  { id: 'winner',      label: 'Ganador',         desc: 'Gana tu primera subasta',   icon: '🏆', req: u => u.wins >= 1           },
  { id: 'collector',   label: 'Coleccionista',   desc: 'Gana 5 subastas',           icon: '💎', req: u => u.wins >= 5           },
  { id: 'spender',     label: 'Gran Gastador',   desc: 'Gasta 1000 PC',             icon: '💸', req: u => u.totalSpent >= 1000  },
  { id: 'whale',       label: 'Ballena',         desc: 'Gasta 5000 PC',             icon: '🐋', req: u => u.totalSpent >= 5000  },
  { id: 'seller',      label: 'Vendedor',        desc: 'Vende tu primer artículo',  icon: '🏪', req: u => u.itemsSold >= 1      },
  { id: 'watcher',     label: 'Observador',      desc: 'Añade 10 a favoritos',      icon: '👁️', req: u => u.watchlist.length >= 10 },
  { id: 'streak3',     label: 'Racha x3',        desc: '3 días seguidos pujando',   icon: '🔥', req: u => u.bidStreak >= 3      },
];

function calcLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function checkAchievements(user) {
  const earned = [...user.achievements];
  ACHIEVEMENTS.forEach(a => {
    if (!earned.includes(a.id) && a.req(user)) earned.push(a.id);
  });
  return earned;
}

const initialState = {
  user: INITIAL_USER,
  auctions: INITIAL_AUCTIONS.map(a => ({ ...a, endTime: a.endTime })),
  notifications: [],
  particles: [],
  bots: BOT_USERS,
  flashAuctions: [],
  showDailyBonus: false,
};

function reducer(state, action) {
  switch (action.type) {

    case 'PLACE_BID': {
      const { auctionId, amount } = action;
      const auction = state.auctions.find(a => a.id === auctionId);
      if (!auction) return state;
      if (amount < auction.currentBid + auction.minIncrement) return state;
      if (amount > state.user.balance) return state;
      if (auction.endTime <= Date.now()) return state;

      const newBid = { user: state.user.name, amount, time: Date.now() };
      const updatedAuctions = state.auctions.map(a =>
        a.id === auctionId
          ? { ...a, currentBid: amount, totalBids: a.totalBids + 1, bids: [newBid, ...a.bids.slice(0, 19)] }
          : a
      );

      const newActiveBids = { ...state.user.activeBids, [auctionId]: amount };
      const newUser = {
        ...state.user,
        bidsPlaced: state.user.bidsPlaced + 1,
        xp: state.user.xp + 10,
        activeBids: newActiveBids,
      };
      newUser.level = calcLevel(newUser.xp);
      newUser.achievements = checkAchievements(newUser);

      const notif = {
        id: Date.now(),
        type: 'bid',
        title: '¡Puja realizada!',
        message: `Pujaste ${amount} PC por ${auction.name}`,
        icon: '🎯',
        color: 'purple',
      };

      return {
        ...state,
        auctions: updatedAuctions,
        user: newUser,
        notifications: [notif, ...state.notifications.slice(0, 4)],
      };
    }

    case 'BOT_BID': {
      const { auctionId, botName, amount } = action;
      const auction = state.auctions.find(a => a.id === auctionId);
      if (!auction || auction.endTime <= Date.now()) return state;
      if (amount <= auction.currentBid) return state;

      const newBid = { user: botName, amount, time: Date.now() };
      const updatedAuctions = state.auctions.map(a =>
        a.id === auctionId
          ? { ...a, currentBid: amount, totalBids: a.totalBids + 1, bids: [newBid, ...a.bids.slice(0, 19)] }
          : a
      );

      const userWasLeading = state.user.activeBids[auctionId] === auction.currentBid;
      const notifs = [...state.notifications];

      if (userWasLeading) {
        notifs.unshift({
          id: Date.now(),
          type: 'outbid',
          title: '¡Te han superado!',
          message: `${botName} superó tu puja en ${auction.name} con ${amount} PC`,
          icon: '⚡',
          color: 'red',
        });
      }

      return {
        ...state,
        auctions: updatedAuctions,
        notifications: notifs.slice(0, 5),
      };
    }

    case 'AUCTION_END': {
      const { auctionId } = action;
      const auction = state.auctions.find(a => a.id === auctionId);
      if (!auction) return state;

      const userBid = state.user.activeBids[auctionId];
      const isWinner = userBid && userBid === auction.currentBid;

      let newUser = { ...state.user };
      const notifs = [...state.notifications];

      if (isWinner) {
        newUser.balance = newUser.balance - auction.currentBid;
        newUser.totalSpent = newUser.totalSpent + auction.currentBid;
        newUser.wins = newUser.wins + 1;
        newUser.wonItems = [...newUser.wonItems, { ...auction, wonAt: Date.now(), paidPrice: auction.currentBid }];
        newUser.xp = newUser.xp + 100;
        newUser.level = calcLevel(newUser.xp);
        newUser.achievements = checkAchievements(newUser);
        const { [auctionId]: _, ...restBids } = newUser.activeBids;
        newUser.activeBids = restBids;

        notifs.unshift({
          id: Date.now(),
          type: 'win',
          title: '🎉 ¡GANASTE!',
          message: `¡Ganaste "${auction.name}" por ${auction.currentBid} PC!`,
          icon: '🏆',
          color: 'gold',
        });
      } else if (userBid) {
        const { [auctionId]: _, ...restBids } = newUser.activeBids;
        newUser.activeBids = restBids;
        notifs.unshift({
          id: Date.now(),
          type: 'lost',
          title: 'Subasta terminada',
          message: `Perdiste "${auction.name}". Ganó ${auction.bids[0]?.user} con ${auction.currentBid} PC`,
          icon: '😔',
          color: 'gray',
        });
      }

      return {
        ...state,
        user: newUser,
        auctions: state.auctions.filter(a => a.id !== auctionId),
        notifications: notifs.slice(0, 5),
        particles: isWinner ? [{ id: Date.now() }] : state.particles,
      };
    }

    case 'LIST_ITEM': {
      const { item } = action;
      const listingFee = 10;
      if (state.user.balance < listingFee) return state;

      const newAuction = {
        id: `user_${Date.now()}`,
        ...item,
        currentBid: item.startingBid,
        totalBids: 0,
        bids: [],
        watchCount: 0,
        sellerRating: 5.0,
        isHot: false, isVip: false, isFlash: false,
        endTime: Date.now() + item.duration * 60 * 60 * 1000,
        seller: state.user.name,
      };

      const newUser = {
        ...state.user,
        balance: state.user.balance - listingFee,
        itemsSold: state.user.itemsSold + 1,
        listedItems: [...state.user.listedItems, newAuction],
        xp: state.user.xp + 50,
        achievements: checkAchievements({ ...state.user, itemsSold: state.user.itemsSold + 1 }),
      };
      newUser.level = calcLevel(newUser.xp);

      const notif = {
        id: Date.now(),
        type: 'listed',
        title: '¡Artículo listado!',
        message: `"${item.name}" está ahora en subasta`,
        icon: '🏪',
        color: 'green',
      };

      return {
        ...state,
        auctions: [...state.auctions, newAuction],
        user: newUser,
        notifications: [notif, ...state.notifications.slice(0, 4)],
      };
    }

    case 'TOGGLE_WATCHLIST': {
      const { auctionId } = action;
      const isWatching = state.user.watchlist.includes(auctionId);
      const newWatchlist = isWatching
        ? state.user.watchlist.filter(id => id !== auctionId)
        : [...state.user.watchlist, auctionId];

      return {
        ...state,
        user: { ...state.user, watchlist: newWatchlist, achievements: checkAchievements({ ...state.user, watchlist: newWatchlist }) },
      };
    }

    case 'CLAIM_DAILY_BONUS': {
      const bonus = 100 + state.user.bidStreak * 25;
      const newUser = {
        ...state.user,
        balance: state.user.balance + bonus,
        lastDailyBonus: Date.now(),
        bidStreak: state.user.bidStreak + 1,
        xp: state.user.xp + 25,
        achievements: checkAchievements({ ...state.user, bidStreak: state.user.bidStreak + 1 }),
      };
      newUser.level = calcLevel(newUser.xp);

      return {
        ...state,
        user: newUser,
        showDailyBonus: false,
        notifications: [{
          id: Date.now(),
          type: 'bonus',
          title: '¡Bonus diario!',
          message: `+${bonus} PC reclamados 🎁`,
          icon: '🎁',
          color: 'gold',
        }, ...state.notifications.slice(0, 4)],
      };
    }

    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };
    }

    case 'CLEAR_PARTICLES': {
      return { ...state, particles: [] };
    }

    case 'SHOW_DAILY_BONUS': {
      return { ...state, showDailyBonus: true };
    }

    case 'TICK': {
      const now = Date.now();
      const ended = state.auctions.filter(a => a.endTime <= now);
      if (ended.length === 0) return state;
      const userEndedAuctions = ended.filter(a => state.user.activeBids[a.id]);
      if (userEndedAuctions.length === 0) return { ...state, auctions: state.auctions.filter(a => a.endTime > now) };
      return state;
    }

    default:
      return state;
  }
}

export function AuctionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Bot bidding simulation ────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const s = stateRef.current;
      const now = Date.now();
      const active = s.auctions.filter(a => a.endTime > now + 5000);
      if (active.length === 0) return;

      if (Math.random() < 0.35) {
        const auction = active[Math.floor(Math.random() * active.length)];
        const bots = s.bots;
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const increment = auction.minIncrement * (1 + Math.floor(Math.random() * 3));
        const newBid = auction.currentBid + increment;
        const maxBid = Math.min(auction.retailValue * 0.9, auction.currentBid * 1.15 + increment * 3);
        if (newBid <= maxBid) {
          dispatch({ type: 'BOT_BID', auctionId: auction.id, botName: bot.name, amount: newBid });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Auction expiry check ──────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const s = stateRef.current;
      const now = Date.now();
      const ended = s.auctions.filter(a => a.endTime <= now);
      ended.forEach(a => dispatch({ type: 'AUCTION_END', auctionId: a.id }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Daily bonus check ─────────────────────────────────────────────────────
  useEffect(() => {
    const last = state.user.lastDailyBonus;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    if (!last || last < oneDayAgo) {
      const t = setTimeout(() => dispatch({ type: 'SHOW_DAILY_BONUS' }), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const placeBid = useCallback((auctionId, amount) => {
    dispatch({ type: 'PLACE_BID', auctionId, amount });
  }, []);

  const listItem = useCallback((item) => {
    dispatch({ type: 'LIST_ITEM', item });
  }, []);

  const toggleWatchlist = useCallback((auctionId) => {
    dispatch({ type: 'TOGGLE_WATCHLIST', auctionId });
  }, []);

  const claimDailyBonus = useCallback(() => {
    dispatch({ type: 'CLAIM_DAILY_BONUS' });
  }, []);

  const dismissNotification = useCallback((id) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', id });
  }, []);

  const clearParticles = useCallback(() => {
    dispatch({ type: 'CLEAR_PARTICLES' });
  }, []);

  return (
    <AuctionContext.Provider value={{
      ...state,
      dispatch,
      placeBid,
      listItem,
      toggleWatchlist,
      claimDailyBonus,
      dismissNotification,
      clearParticles,
      ACHIEVEMENTS,
    }}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction() {
  const ctx = useContext(AuctionContext);
  if (!ctx) throw new Error('useAuction must be used inside AuctionProvider');
  return ctx;
}
