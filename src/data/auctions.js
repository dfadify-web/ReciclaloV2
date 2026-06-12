export const CATEGORIES = ['All', 'Electronics', 'Watches & Jewelry', 'Sneakers & Fashion', 'Collectibles', 'Gaming', 'Vintage & Art'];

export const CATEGORY_CONFIG = {
  'Electronics':       { from: '#6366f1', to: '#a855f7', glow: 'rgba(99,102,241,0.6)',   badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  'Watches & Jewelry': { from: '#f59e0b', to: '#ef4444', glow: 'rgba(245,158,11,0.6)',   badge: 'bg-amber-500/20  text-amber-300  border-amber-500/30'  },
  'Sneakers & Fashion':{ from: '#10b981', to: '#6366f1', glow: 'rgba(16,185,129,0.6)',    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'},
  'Collectibles':      { from: '#ec4899', to: '#8b5cf6', glow: 'rgba(236,72,153,0.6)',    badge: 'bg-pink-500/20   text-pink-300   border-pink-500/30'    },
  'Gaming':            { from: '#3b82f6', to: '#10b981', glow: 'rgba(59,130,246,0.6)',    badge: 'bg-blue-500/20   text-blue-300   border-blue-500/30'    },
  'Vintage & Art':     { from: '#f97316', to: '#ec4899', glow: 'rgba(249,115,22,0.6)',    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30'  },
};

function mins(m) { return Date.now() + m * 60 * 1000; }

export const BOT_USERS = [
  { id: 'b1',  name: 'NightBidder',  avatar: '🦉', balance: 12400, totalSpent: 8900,  wins: 14, color: '#a855f7' },
  { id: 'b2',  name: 'FlipKing',     avatar: '👑', balance: 9800,  totalSpent: 15200, wins: 22, color: '#f59e0b' },
  { id: 'b3',  name: 'AuctionWolf',  avatar: '🐺', balance: 7600,  totalSpent: 11000, wins: 18, color: '#ef4444' },
  { id: 'b4',  name: 'CryptoFlip',   avatar: '💎', balance: 18500, totalSpent: 6500,  wins: 9,  color: '#60a5fa' },
  { id: 'b5',  name: 'SneakerGod',   avatar: '👟', balance: 5200,  totalSpent: 19800, wins: 31, color: '#10b981' },
  { id: 'b6',  name: 'LuxuryHunter', avatar: '🔱', balance: 22000, totalSpent: 4200,  wins: 7,  color: '#fbbf24' },
  { id: 'b7',  name: 'VaultBreaker', avatar: '🔓', balance: 3400,  totalSpent: 24600, wins: 38, color: '#ec4899' },
  { id: 'b8',  name: 'GhostBid',     avatar: '👻', balance: 8100,  totalSpent: 9300,  wins: 15, color: '#94a3b8' },
  { id: 'b9',  name: 'DragonMaster', avatar: '🐉', balance: 14200, totalSpent: 7800,  wins: 11, color: '#f97316' },
  { id: 'b10', name: 'ThunderPuja',  avatar: '⚡', balance: 6700,  totalSpent: 13500, wins: 20, color: '#a3e635' },
];

export const INITIAL_AUCTIONS = [
  // ── ELECTRONICS ──────────────────────────────────────────────────────────────
  {
    id: 'e1', name: 'Sony WH-1000XM5', subtitle: 'Premium Noise-Cancelling Headphones',
    category: 'Electronics', emoji: '🎧',
    retailValue: 399, startingBid: 80, currentBid: 145, minIncrement: 10,
    endTime: mins(47), condition: 'Like New',
    description: 'Industria líder en cancelación de ruido. 30h de batería, soporte vocal y plegable. Caja original incluida.',
    seller: 'TechFlip', sellerRating: 4.9, totalBids: 12, isHot: true, isVip: false, isFlash: false,
    bids: [
      { user: 'AudioFan22', amount: 145, time: Date.now() - 120000 },
      { user: 'NightBidder', amount: 130, time: Date.now() - 300000 },
      { user: 'BeatsMaster', amount: 110, time: Date.now() - 600000 },
    ], watchCount: 34, tags: ['Sony', 'Wireless', 'ANC', 'Premium'],
  },
  {
    id: 'e2', name: 'iPhone 15 Pro Max', subtitle: '256GB Titanio Negro, Libre',
    category: 'Electronics', emoji: '📱',
    retailValue: 1199, startingBid: 500, currentBid: 720, minIncrement: 25,
    endTime: mins(23), condition: 'Good',
    description: 'Titanio con chip A17 Pro. Rayones menores en pantalla. Cargador original incluido. Totalmente funcional.',
    seller: 'GadgetGuru', sellerRating: 4.7, totalBids: 28, isHot: true, isVip: false, isFlash: false,
    bids: [
      { user: 'FlipKing', amount: 720, time: Date.now() - 90000 },
      { user: 'TechBuyer', amount: 695, time: Date.now() - 200000 },
      { user: 'AuctionWolf', amount: 650, time: Date.now() - 450000 },
    ], watchCount: 67, tags: ['Apple', 'Libre', 'Titanio'],
  },
  {
    id: 'e3', name: 'iPad Pro M2 11"', subtitle: 'WiFi + Cellular 128GB + Apple Pencil',
    category: 'Electronics', emoji: '📟',
    retailValue: 899, startingBid: 300, currentBid: 445, minIncrement: 20,
    endTime: mins(95), condition: 'Like New',
    description: 'Pantalla ProMotion 120Hz. Apple Pencil 2ª gen incluido. Smart Folio case negra.',
    seller: 'TabletFlip', sellerRating: 4.8, totalBids: 16, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'DrawingPro', amount: 445, time: Date.now() - 150000 },
      { user: 'GhostBid', amount: 425, time: Date.now() - 400000 },
    ], watchCount: 29, tags: ['Apple', 'Cellular', 'ProMotion'],
  },
  {
    id: 'e4', name: 'MacBook Pro M3', subtitle: '14" 16GB RAM 512GB SSD Space Black',
    category: 'Electronics', emoji: '💻',
    retailValue: 1999, startingBid: 900, currentBid: 1240, minIncrement: 50,
    endTime: mins(180), condition: 'Good',
    description: 'Chip M3, 18h batería. Desgaste leve en tapa. Ideal para profesionales y creadores de contenido.',
    seller: 'MacFlipPro', sellerRating: 5.0, totalBids: 19, isHot: false, isVip: true, isFlash: false,
    bids: [
      { user: 'DevMaster', amount: 1240, time: Date.now() - 60000 },
      { user: 'CryptoFlip', amount: 1190, time: Date.now() - 250000 },
      { user: 'DragonMaster', amount: 1100, time: Date.now() - 600000 },
    ], watchCount: 52, tags: ['Apple', 'M3 Chip', 'Profesional'],
  },
  {
    id: 'e5', name: 'Bose QuietComfort Ultra', subtitle: 'Earbuds True Wireless con ANC',
    category: 'Electronics', emoji: '🎵',
    retailValue: 299, startingBid: 70, currentBid: 115, minIncrement: 10,
    endTime: mins(35), condition: 'New',
    description: 'Sellados en caja original. Audio inmersivo con 6h + 24h de estuche. ANC adaptativo.',
    seller: 'BoseFlip', sellerRating: 4.6, totalBids: 9, isHot: false, isVip: false, isFlash: true,
    bids: [
      { user: 'AudioPhile', amount: 115, time: Date.now() - 180000 },
      { user: 'ThunderPuja', amount: 105, time: Date.now() - 500000 },
    ], watchCount: 21, tags: ['Bose', 'True Wireless', 'Precintado'],
  },
  {
    id: 'e6', name: 'Canon EOS R5', subtitle: 'Full Frame Mirrorless 45MP + RF 24-105mm',
    category: 'Electronics', emoji: '📷',
    retailValue: 4299, startingBid: 1800, currentBid: 2450, minIncrement: 75,
    endTime: mins(220), condition: 'Good',
    description: 'Cámara mirrorless profesional 8K. Obturador a 50k disparos. Objetivo RF 24-105mm incluido.',
    seller: 'CameraFlip', sellerRating: 4.9, totalBids: 15, isHot: false, isVip: true, isFlash: false,
    bids: [
      { user: 'LuxuryHunter', amount: 2450, time: Date.now() - 100000 },
      { user: 'PhotoArtist', amount: 2375, time: Date.now() - 350000 },
    ], watchCount: 43, tags: ['Canon', '8K', 'Profesional', 'Full Frame'],
  },

  // ── WATCHES & JEWELRY ─────────────────────────────────────────────────────────
  {
    id: 'w1', name: 'Casio G-Shock GA-2100', subtitle: 'CasiOak Skeleton Edición Limitada',
    category: 'Watches & Jewelry', emoji: '⌚',
    retailValue: 199, startingBid: 50, currentBid: 89, minIncrement: 5,
    endTime: mins(52), condition: 'New',
    description: 'Edición skeleton limitada. Caja original, sin usar. Resistente 200M al agua.',
    seller: 'WatchDrops', sellerRating: 4.8, totalBids: 14, isHot: true, isVip: false, isFlash: false,
    bids: [
      { user: 'WatchHead', amount: 89, time: Date.now() - 100000 },
      { user: 'CasioFan', amount: 79, time: Date.now() - 350000 },
    ], watchCount: 38, tags: ['G-Shock', 'Limitado', 'Skeleton'],
  },
  {
    id: 'w2', name: 'Cadena Cubana Dorada', subtitle: '18K Gold Plated 6mm Cuban Link 55cm',
    category: 'Watches & Jewelry', emoji: '📿',
    retailValue: 180, startingBid: 40, currentBid: 72, minIncrement: 5,
    endTime: mins(78), condition: 'New',
    description: 'Chapado 18K resistente al óxido. Alta calidad, ideal para layering. Certificado de autenticidad.',
    seller: 'GoldRush', sellerRating: 4.5, totalBids: 11, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'Drip247', amount: 72, time: Date.now() - 200000 },
      { user: 'GoldGang', amount: 62, time: Date.now() - 600000 },
    ], watchCount: 25, tags: ['Oro', 'Cuban Link', 'Joyería'],
  },
  {
    id: 'w3', name: 'Omega Seamaster Vintage', subtitle: 'Suizo 1974, Revisado y Certificado',
    category: 'Watches & Jewelry', emoji: '🕐',
    retailValue: 2400, startingBid: 800, currentBid: 1350, minIncrement: 50,
    endTime: mins(240), condition: 'Good',
    description: 'Vintage Omega 1974 revisado recientemente. Funcionamiento perfecto. Esfera y agujas originales.',
    seller: 'VintageTime', sellerRating: 5.0, totalBids: 22, isHot: false, isVip: true, isFlash: false,
    bids: [
      { user: 'VintageKing', amount: 1350, time: Date.now() - 80000 },
      { user: 'LuxuryHunter', amount: 1300, time: Date.now() - 300000 },
      { user: 'FlipKing', amount: 1200, time: Date.now() - 700000 },
    ], watchCount: 61, tags: ['Vintage', 'Suizo', 'Omega', 'Colección'],
  },
  {
    id: 'w4', name: 'Anillo Diamante Solitario', subtitle: '0.5ct VS2 Certificado GIA, Oro 18K',
    category: 'Watches & Jewelry', emoji: '💍',
    retailValue: 1600, startingBid: 500, currentBid: 780, minIncrement: 30,
    endTime: mins(310), condition: 'New',
    description: 'Diamante natural 0.5ct certificado GIA. Talla redonda brillante. Montadura oro blanco 18K.',
    seller: 'DiamondFlip', sellerRating: 5.0, totalBids: 18, isHot: false, isVip: true, isFlash: false,
    bids: [
      { user: 'LuxuryHunter', amount: 780, time: Date.now() - 150000 },
      { user: 'RingMaster', amount: 750, time: Date.now() - 500000 },
    ], watchCount: 39, tags: ['Diamante', 'GIA', 'Oro 18K', 'Solitario'],
  },

  // ── SNEAKERS & FASHION ───────────────────────────────────────────────────────
  {
    id: 's1', name: 'Nike Air Jordan 1 Retro OG', subtitle: '"Chicago" Talla 44 EU',
    category: 'Sneakers & Fashion', emoji: '👟',
    retailValue: 170, startingBid: 120, currentBid: 285, minIncrement: 15,
    endTime: mins(28), condition: 'New',
    description: 'DS Deadstock. Sin usar, caja y accesorios originales. SNKRS exclusive drop.',
    seller: 'KickFlip', sellerRating: 4.9, totalBids: 31, isHot: true, isVip: false, isFlash: true,
    bids: [
      { user: 'SneakerHead', amount: 285, time: Date.now() - 50000 },
      { user: 'VaultBreaker', amount: 270, time: Date.now() - 150000 },
      { user: 'JordanFan', amount: 250, time: Date.now() - 300000 },
    ], watchCount: 89, tags: ['Jordan', 'Chicago', 'DS', 'OG'],
  },
  {
    id: 's2', name: 'Supreme Box Logo Hoodie', subtitle: 'FW23 Negro/Blanco Talla M',
    category: 'Sneakers & Fashion', emoji: '👕',
    retailValue: 168, startingBid: 100, currentBid: 195, minIncrement: 10,
    endTime: mins(66), condition: 'Like New',
    description: 'Temporada FW23. Usado 2 veces, lavado en frío. Sin decoloración. Print perfecto.',
    seller: 'SupremeFlip', sellerRating: 4.7, totalBids: 18, isHot: true, isVip: false, isFlash: false,
    bids: [
      { user: 'HypeBeast', amount: 195, time: Date.now() - 130000 },
      { user: 'StreetWear', amount: 180, time: Date.now() - 400000 },
    ], watchCount: 44, tags: ['Supreme', 'Hypebeast', 'Streetwear'],
  },
  {
    id: 's3', name: 'New Balance 990v5', subtitle: 'Made in USA, Gris, Talla 43 EU',
    category: 'Sneakers & Fashion', emoji: '🥾',
    retailValue: 185, startingBid: 90, currentBid: 142, minIncrement: 10,
    endTime: mins(115), condition: 'Like New',
    description: 'Made in USA 990v5 clásico. Usadas 3 veces, extremadamente limpias.',
    seller: 'NBFlip', sellerRating: 4.6, totalBids: 13, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'NBFan', amount: 142, time: Date.now() - 250000 },
      { user: 'MadeInUSA', amount: 125, time: Date.now() - 600000 },
    ], watchCount: 19, tags: ['New Balance', 'Made in USA', 'Clásico'],
  },
  {
    id: 's4', name: 'Bomber de Cuero Vintage', subtitle: 'Cuero Italiano 90s, Talla L',
    category: 'Sneakers & Fashion', emoji: '🧥',
    retailValue: 450, startingBid: 80, currentBid: 165, minIncrement: 10,
    endTime: mins(190), condition: 'Good',
    description: 'Auténtica bomber italiana de los 90. Pátina preciosa, todas cremalleras funcionan.',
    seller: 'VintageThread', sellerRating: 4.8, totalBids: 16, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'VintageFashion', amount: 165, time: Date.now() - 300000 },
      { user: 'LeatherLove', amount: 150, time: Date.now() - 700000 },
    ], watchCount: 32, tags: ['Vintage', 'Cuero', '90s', 'Italiano'],
  },
  {
    id: 's5', name: 'Off-White x Nike Dunk Low', subtitle: '"The 50" #23/50 Talla 42 EU',
    category: 'Sneakers & Fashion', emoji: '🩴',
    retailValue: 180, startingBid: 300, currentBid: 520, minIncrement: 25,
    endTime: mins(55), condition: 'New',
    description: 'Edición limitada collab Virgil Abloh. Número 23 de 50 en este colorway. DS.',
    seller: 'PremiumKicks', sellerRating: 5.0, totalBids: 27, isHot: true, isVip: true, isFlash: false,
    bids: [
      { user: 'SneakerGod', amount: 520, time: Date.now() - 80000 },
      { user: 'HypeBeast', amount: 495, time: Date.now() - 200000 },
      { user: 'VaultBreaker', amount: 460, time: Date.now() - 500000 },
    ], watchCount: 95, tags: ['Off-White', 'Nike', 'Dunk', 'Virgil'],
  },

  // ── COLLECTIBLES ─────────────────────────────────────────────────────────────
  {
    id: 'c1', name: 'Pokémon Charizard Holo', subtitle: 'Base Set 1ª Edición PSA 7',
    category: 'Collectibles', emoji: '🃏',
    retailValue: 1800, startingBid: 600, currentBid: 950, minIncrement: 50,
    endTime: mins(72), condition: 'Graded',
    description: 'PSA 7 1ª Edición Charizard Holo. Brillo holográfico clásico. Certificado incluido.',
    seller: 'CardGods', sellerRating: 5.0, totalBids: 24, isHot: true, isVip: true, isFlash: false,
    bids: [
      { user: 'PokeMaster', amount: 950, time: Date.now() - 70000 },
      { user: 'CardCollect', amount: 900, time: Date.now() - 200000 },
      { user: 'DragonMaster', amount: 850, time: Date.now() - 500000 },
    ], watchCount: 102, tags: ['Pokémon', '1ª Ed.', 'PSA 7', 'Raro'],
  },
  {
    id: 'c2', name: 'Funko Pop Batman #01', subtitle: 'Primera Edición 2010 VAULTED',
    category: 'Collectibles', emoji: '🦇',
    retailValue: 350, startingBid: 60, currentBid: 145, minIncrement: 10,
    endTime: mins(88), condition: 'Good',
    description: 'Funko Pop Batman #01 original de 2010. Caja con desgaste leve, figura perfecta.',
    seller: 'PopHunter', sellerRating: 4.8, totalBids: 17, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'FunkoFan', amount: 145, time: Date.now() - 150000 },
      { user: 'DCCollector', amount: 130, time: Date.now() - 450000 },
    ], watchCount: 27, tags: ['Funko Pop', 'Batman', 'Vaulted', 'DC'],
  },
  {
    id: 'c3', name: 'Camiseta Firmada CR7', subtitle: 'Real Madrid 2016 #7 con COA',
    category: 'Collectibles', emoji: '⚽',
    retailValue: 800, startingBid: 200, currentBid: 380, minIncrement: 20,
    endTime: mins(144), condition: 'Good',
    description: 'Camiseta match oficial firmada por Cristiano Ronaldo con pluma plateada. COA incluido.',
    seller: 'SportLegends', sellerRating: 4.9, totalBids: 21, isHot: true, isVip: false, isFlash: false,
    bids: [
      { user: 'CR7Fan', amount: 380, time: Date.now() - 100000 },
      { user: 'SportCollect', amount: 360, time: Date.now() - 300000 },
      { user: 'ThunderPuja', amount: 320, time: Date.now() - 600000 },
    ], watchCount: 58, tags: ['Firmada', 'CR7', 'Real Madrid', '2016'],
  },
  {
    id: 'c4', name: 'Carta Magic The Gathering', subtitle: 'Black Lotus Alpha PSA 6',
    category: 'Collectibles', emoji: '🌸',
    retailValue: 12000, startingBid: 3000, currentBid: 4800, minIncrement: 200,
    endTime: mins(360), condition: 'Graded',
    description: 'Black Lotus Alpha PSA 6. Una de las cartas más raras del mundo. Grial del coleccionismo.',
    seller: 'MagicVault', sellerRating: 5.0, totalBids: 8, isHot: true, isVip: true, isFlash: false,
    bids: [
      { user: 'LuxuryHunter', amount: 4800, time: Date.now() - 200000 },
      { user: 'CardGodKing', amount: 4600, time: Date.now() - 600000 },
    ], watchCount: 156, tags: ['Magic', 'Black Lotus', 'Alpha', 'PSA 6'],
  },

  // ── GAMING ───────────────────────────────────────────────────────────────────
  {
    id: 'g1', name: 'PlayStation 5', subtitle: 'Edición Disc + 2 DualSense',
    category: 'Gaming', emoji: '🎮',
    retailValue: 549, startingBid: 200, currentBid: 375, minIncrement: 15,
    endTime: mins(42), condition: 'Good',
    description: 'PS5 disc edition en excelente estado. Incluye 2 DualSense, todos los cables y base.',
    seller: 'ConsoleFlip', sellerRating: 4.8, totalBids: 26, isHot: true, isVip: false, isFlash: false,
    bids: [
      { user: 'GamerPro', amount: 375, time: Date.now() - 90000 },
      { user: 'PS5Hunter', amount: 360, time: Date.now() - 250000 },
      { user: 'AuctionWolf', amount: 335, time: Date.now() - 500000 },
    ], watchCount: 73, tags: ['PS5', 'Sony', 'Next-Gen'],
  },
  {
    id: 'g2', name: 'Nintendo Switch OLED', subtitle: 'Edición Blanca + 4 Juegos',
    category: 'Gaming', emoji: '🕹️',
    retailValue: 349, startingBid: 120, currentBid: 215, minIncrement: 10,
    endTime: mins(68), condition: 'Like New',
    description: 'Switch OLED con Zelda: TotK, Mario Kart 8, Animal Crossing y Splatoon 3.',
    seller: 'NintendoFlip', sellerRating: 4.7, totalBids: 19, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'NintendoFan', amount: 215, time: Date.now() - 160000 },
      { user: 'GhostBid', amount: 200, time: Date.now() - 450000 },
    ], watchCount: 41, tags: ['Nintendo', 'Switch', 'OLED', 'Bundle'],
  },
  {
    id: 'g3', name: 'PC Gaming RTX 4070 Super', subtitle: 'i9-13900K, 32GB DDR5, 1TB Gen4',
    category: 'Gaming', emoji: '🖥️',
    retailValue: 2200, startingBid: 900, currentBid: 1480, minIncrement: 50,
    endTime: mins(160), condition: 'Good',
    description: 'RTX 4070 Super, i9-13900K, 32GB DDR5, 1TB NVMe Gen4. 1.5 años de uso. Overclocked.',
    seller: 'PCFlipMaster', sellerRating: 4.9, totalBids: 23, isHot: false, isVip: true, isFlash: false,
    bids: [
      { user: 'PCGamer', amount: 1480, time: Date.now() - 120000 },
      { user: 'RTXFan', amount: 1430, time: Date.now() - 350000 },
      { user: 'GameDevPro', amount: 1350, time: Date.now() - 700000 },
    ], watchCount: 55, tags: ['RTX 4070', 'i9', 'PC Gaming', 'High-End'],
  },
  {
    id: 'g4', name: 'SteelSeries Arctis Nova Pro', subtitle: 'Wireless + Base Station ANC',
    category: 'Gaming', emoji: '🎤',
    retailValue: 349, startingBid: 80, currentBid: 155, minIncrement: 10,
    endTime: mins(93), condition: 'Like New',
    description: 'Headset gaming wireless premium con doble wireless y ANC. Casi sin uso.',
    seller: 'GearFlip', sellerRating: 4.6, totalBids: 14, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'StreamerPro', amount: 155, time: Date.now() - 200000 },
      { user: 'GamingGear', amount: 140, time: Date.now() - 600000 },
    ], watchCount: 28, tags: ['SteelSeries', 'Wireless', 'Gaming', 'ANC'],
  },

  // ── VINTAGE & ART ─────────────────────────────────────────────────────────────
  {
    id: 'v1', name: 'Polaroid OneStep SX-70', subtitle: 'Cámara Land Camera Vintage, Funcional',
    category: 'Vintage & Art', emoji: '📸',
    retailValue: 220, startingBid: 40, currentBid: 92, minIncrement: 5,
    endTime: mins(108), condition: 'Good',
    description: 'Polaroid SX-70 revisada y probada. Pack de película nuevo incluido. Pátina vintage preciosa.',
    seller: 'VintageSnap', sellerRating: 4.7, totalBids: 15, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'VintagePop', amount: 92, time: Date.now() - 280000 },
      { user: 'PhotoArtist', amount: 82, time: Date.now() - 600000 },
    ], watchCount: 23, tags: ['Polaroid', 'Vintage', 'Film', 'Funcional'],
  },
  {
    id: 'v2', name: 'Colección Vinilos Classic Rock', subtitle: '12 Álbumes Prensados en los 70s',
    category: 'Vintage & Art', emoji: '🎸',
    retailValue: 600, startingBid: 80, currentBid: 175, minIncrement: 10,
    endTime: mins(135), condition: 'Good',
    description: '12 vinilos originales 70s. Led Zeppelin IV, DSOTM, AC/DC y más. Grado VG+ a NM.',
    seller: 'VinylDig', sellerRating: 4.9, totalBids: 17, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'VinylJunkie', amount: 175, time: Date.now() - 150000 },
      { user: 'RecordStore', amount: 160, time: Date.now() - 500000 },
    ], watchCount: 31, tags: ['Vinyl', 'Classic Rock', '70s', 'Original'],
  },
  {
    id: 'v3', name: 'Print Digital Arte #047', subtitle: 'Edición Limitada 1/50 Giclée Firmado',
    category: 'Vintage & Art', emoji: '🖼️',
    retailValue: 400, startingBid: 60, currentBid: 135, minIncrement: 10,
    endTime: mins(200), condition: 'New',
    description: 'Limitado 1 de 50. Firmado a mano por @NXVR_ART. Tamaño A2 Giclée print.',
    seller: 'ArtDrop', sellerRating: 4.8, totalBids: 12, isHot: false, isVip: false, isFlash: false,
    bids: [
      { user: 'ArtCollect', amount: 135, time: Date.now() - 320000 },
      { user: 'WallArt', amount: 120, time: Date.now() - 700000 },
    ], watchCount: 18, tags: ['Arte Digital', 'Limitado', 'Firmado', 'Giclée'],
  },
  {
    id: 'v4', name: 'Macallan 18 Year 1990', subtitle: 'Single Malt Highland, Precintado',
    category: 'Vintage & Art', emoji: '🥃',
    retailValue: 850, startingBid: 200, currentBid: 420, minIncrement: 25,
    endTime: mins(300), condition: 'New',
    description: 'Macallan 18 años de 1990 sin abrir. Guardado en posición vertical en oscuro.',
    seller: 'SpiritsCellar', sellerRating: 5.0, totalBids: 20, isHot: false, isVip: true, isFlash: false,
    bids: [
      { user: 'WhiskeyGod', amount: 420, time: Date.now() - 200000 },
      { user: 'SpiritHunter', amount: 395, time: Date.now() - 500000 },
      { user: 'ScotchLover', amount: 350, time: Date.now() - 900000 },
    ], watchCount: 47, tags: ['Macallan', 'Whiskey', 'Vintage', '1990'],
  },
];
