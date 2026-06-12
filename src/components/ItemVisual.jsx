import { CATEGORY_CONFIG } from '../data/auctions';

const CATEGORY_PATTERNS = {
  'Electronics': (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-15">
      <defs><pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M5 20 H15 M25 20 H35 M20 5 V15 M20 25 V35" stroke="white" strokeWidth="1" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="white"/>
        <circle cx="5" cy="20" r="1.5" fill="white"/>
        <circle cx="35" cy="20" r="1.5" fill="white"/>
        <circle cx="20" cy="5" r="1.5" fill="white"/>
        <circle cx="20" cy="35" r="1.5" fill="white"/>
      </pattern></defs>
      <rect width="200" height="200" fill="url(#circuit)"/>
    </svg>
  ),
  'Watches & Jewelry': (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-10">
      <defs><pattern id="hex2" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
        <polygon points="15,2 28,9 28,22 15,29 2,22 2,9" fill="none" stroke="white" strokeWidth="0.8"/>
      </pattern></defs>
      <rect width="200" height="200" fill="url(#hex2)"/>
    </svg>
  ),
  'Sneakers & Fashion': (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-10">
      <defs><pattern id="dots2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2" fill="white"/>
      </pattern></defs>
      <rect width="200" height="200" fill="url(#dots2)"/>
    </svg>
  ),
  'Collectibles': (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-10">
      <defs><pattern id="stars2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon points="20,5 23,15 34,15 25,22 28,33 20,26 12,33 15,22 6,15 17,15" fill="white"/>
      </pattern></defs>
      <rect width="200" height="200" fill="url(#stars2)"/>
    </svg>
  ),
  'Gaming': (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-10">
      <defs><pattern id="grid2" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="white" strokeWidth="0.5"/>
      </pattern></defs>
      <rect width="200" height="200" fill="url(#grid2)"/>
    </svg>
  ),
  'Vintage & Art': (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0 opacity-10">
      <defs><pattern id="waves2" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 Q10 0, 20 10 Q30 20, 40 10" fill="none" stroke="white" strokeWidth="1"/>
      </pattern></defs>
      <rect width="200" height="200" fill="url(#waves2)"/>
    </svg>
  ),
};

export default function ItemVisual({ item, className = '', size = 'card' }) {
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Electronics'];
  const sizeClasses = size === 'card' ? 'h-52' : 'h-80';

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${sizeClasses} ${className}`}
      style={{ background: `linear-gradient(135deg, ${config.from}dd, ${config.to}dd)` }}
    >
      {/* Background gradient orbs */}
      <div
        className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-30 blur-2xl"
        style={{ background: config.from }}
      />
      <div
        className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-30 blur-2xl"
        style={{ background: config.to }}
      />

      {/* Pattern overlay */}
      {CATEGORY_PATTERNS[item.category]}

      {/* Scan line effect */}
      <div className="scan-overlay" />

      {/* Center glow */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Main emoji */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <span
          className={`select-none ${size === 'card' ? 'text-7xl' : 'text-9xl'}`}
          style={{ filter: `drop-shadow(0 0 24px white) drop-shadow(0 0 8px ${config.from})` }}
        >
          {item.emoji}
        </span>
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-20"
        style={{
          background: `linear-gradient(225deg, white, transparent)`,
          borderBottomLeftRadius: '100%',
        }}
      />

      {/* Flash badge */}
      {item.isFlash && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-500 text-black text-xs font-black px-2 py-1 rounded-full animate-heartbeat">
          ⚡ FLASH
        </div>
      )}
    </div>
  );
}
