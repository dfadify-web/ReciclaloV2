---
name: theplus-skill
description: |
  ThePlusSkill — The ultimate all-in-one Claude Code skill. Activates automatically on any web project.
  Combines spec-driven development (Cavekit), premium design taste, Impeccable UI quality, 21st.dev 
  components, MotionSites.ai animations, professional typography, curated color palettes, and 
  enterprise-grade OWASP security. Everything you need. Nothing you don't.
triggers:
  - building any web application or website
  - designing UI components or sections
  - creating landing pages or marketing sites
  - reviewing or auditing code
  - starting a new project
  - implementing authentication or forms
  - adding animations or interactions
---

# ⚡ ThePlusSkill — The Ultimate Web Development Skill

You are operating with **ThePlusSkill** activated. Every web project you touch becomes a premium, secure, and visually stunning product. You operate as a senior engineer, a top-tier designer, and a security expert simultaneously.

---

## 🧠 PHASE 0 — SPEC FIRST (Cavekit Protocol)

Before writing a single line of code, create or update `SPEC.md` using caveman-efficient notation:

```
# SPEC
proj:[name] | type:[web/app/landing/saas/ecomm] | stack:[tech]
goal:[one sentence, max 15 words]
users:[who uses this]
palette:[chosen palette name from §PALETTES]
fonts:[HeadingFont] + [BodyFont]
motion:[none/subtle/medium/cinematic]
security:[public/auth/enterprise]
dials: V=[1-10] M=[1-10] D=[1-10]

## PAGES
[/route] | [purpose] | [key components]

## COMPONENTS
[name] | [source:21st/shadcn/custom] | [P0/P1/P2]

## §B INVARIANTS
(auto-populated from failures — never violate these)
```

**Three commands to live by:**
- `SPEC.md` = source of truth, always update it
- Every failure → add a `§B` invariant to prevent recurrence
- `/plus-spec` to review and update the spec interactively

---

## 🎨 DESIGN SYSTEM — THE THREE DIALS

Every design decision is governed by three explicit dials (set in SPEC.md):

| Dial | 1 | 5 | 10 |
|------|---|---|----|
| **V** (DESIGN_VARIANCE) | Clean, centered, safe | Balanced modern | Asymmetric, editorial, bold |
| **M** (MOTION_INTENSITY) | Static, no motion | Subtle hovers + scroll reveals | Magnetic, 3D, scroll-driven, cinematic |
| **D** (VISUAL_DENSITY) | Ultra minimal, lots of white space | Comfortable reading | Information-rich, dense grid |

**Defaults:** V=7, M=6, D=5

When dials are not set, ask. Never guess the aesthetic.

---

## 🖋️ TYPOGRAPHY SYSTEM — APPROVED FONT PAIRS

ALWAYS choose from these pairs. Never use system fonts or generic combinations. Never mix more than 2 families.

### ✦ EDITORIAL / LUXURY
| # | Heading | Body | Vibe |
|---|---------|------|------|
| E1 | Playfair Display | Inter | Classic editorial |
| E2 | Cormorant Garamond | Plus Jakarta Sans | Haute couture |
| E3 | Fraunces | Satoshi | Organic luxury |
| E4 | DM Serif Display | DM Sans | Google editorial |
| E5 | Editorial New | Neue Haas Grotesk | Magazine |
| E6 | Libre Baskerville | Source Sans 3 | Literary |
| E7 | Instrument Serif | Instrument Sans | Refined neutral |
| E8 | Garamond | Lato | Timeless |

### ✦ MODERN / TECH / SAAS
| # | Heading | Body | Vibe |
|---|---------|------|------|
| T1 | Geist | Geist Mono | Vercel / dev tools |
| T2 | Cabinet Grotesk | Manrope | Modern SaaS |
| T3 | General Sans | Inter | Clean product |
| T4 | Space Grotesk | Space Mono | Futuristic |
| T5 | Clash Display | Clash Grotesk | Bold tech |
| T6 | Syne | Outfit | Creative agency |
| T7 | Onest | Onest | Ukrainian modern |
| T8 | Switzer | Switzer | Neutral system |

### ✦ BOLD / IMPACT / BRANDING
| # | Heading | Body | Vibe |
|---|---------|------|------|
| B1 | Anton | Lato | High impact |
| B2 | Bebas Neue | Open Sans | Display power |
| B3 | Monument Extended | Neue Montreal | Ultra bold |
| B4 | Migra | Synonym | Contrast heavy |
| B5 | Tusker Grotesk | Aktiv Grotesk | Brutalist |
| B6 | Array | Switzer | Statement brand |
| B7 | Archivo Black | Archivo | System bold |
| B8 | Big Shoulders Display | Big Shoulders Text | Industrial |

### ✦ HUMANIST / WARM / CONSUMER
| # | Heading | Body | Vibe |
|---|---------|------|------|
| H1 | Nunito | Merriweather | Friendly & warm |
| H2 | Poppins | Lora | Approachable |
| H3 | Jost | Crimson Pro | Warm modern |
| H4 | Quicksand | Karla | Soft brand |
| H5 | Raleway | Source Serif 4 | Elegant consumer |
| H6 | Lexend | Lexend | Readability-first |
| H7 | Rubik | Rubik | Rounded friendly |
| H8 | Nunito Sans | Pt Serif | Balanced |

### ✦ EXPERIMENTAL / CREATIVE
| # | Heading | Body | Vibe |
|---|---------|------|------|
| X1 | Bricolage Grotesque | Bricolage Grotesque | Variable optical |
| X2 | Unbounded | Unbounded | Web3 / DAO |
| X3 | Sora | Sora | Japanese-inspired |
| X4 | Hubot Sans | Mona Sans | GitHub style |
| X5 | Boska | Synonym | Art direction |
| X6 | Tanker | Supreme | Poster |
| X7 | Alpino | Alpino | Swiss neutral |

### Implementation Rules (always)
```css
/* Never block render */
font-display: swap;

/* Fluid type scale */
--text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm:   clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg:   clamp(1.125rem, 1rem + 0.625vw, 1.375rem);
--text-xl:   clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
--text-2xl:  clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);
--text-3xl:  clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
--text-4xl:  clamp(2.5rem, 1.75rem + 3.75vw, 5rem);
--text-5xl:  clamp(3rem, 2rem + 5vw, 7rem);

/* Heading rhythm */
line-height: 1.1; /* headings */
line-height: 1.65; /* body */
letter-spacing: -0.03em; /* large headings */
letter-spacing: -0.01em; /* subheadings */
letter-spacing:  0.01em; /* body */
```

---

## 🎨 COLOR PALETTES — MASTER COLLECTION

Reference a palette by name in SPEC.md. Apply semantic tokens, never hardcode colors.

### ✦ MINIMAL / NEUTRAL
```
Chalk      bg:#FAFAF8  fg:#1A1A1A  muted:#6B6B6B  accent:#2D2D2D
Pure       bg:#FFFFFF  fg:#0A0A0A  muted:#888888  accent:#000000
Fog        bg:#F4F4F0  fg:#2C2C2C  muted:#9B9B9B  accent:#D4D0C8
Parchment  bg:#FBF8F3  fg:#1C1A17  muted:#8C8070  accent:#C4B49A
Bone       bg:#F7F5F2  fg:#18171A  muted:#7A7570  accent:#B5A898
```

### ✦ LUXURY / PREMIUM
```
Obsidian   bg:#0A0A0F  fg:#FAFAFA  muted:#8B8B9B  accent:#C9B037
Midnight   bg:#0D0D1A  fg:#F0F0FF  muted:#7070A0  accent:#9B59B6
Onyx       bg:#111111  fg:#EEEEEE  muted:#666666  accent:#C41E3A
Empire     bg:#1A0A00  fg:#FFF8F0  muted:#A08060  accent:#D4A017
Velvet     bg:#1A001A  fg:#FFF0FF  muted:#9060A0  accent:#8B008B
Noir       bg:#0C0C0C  fg:#F5F5F5  muted:#555555  accent:#E8D5B7
Mahogany   bg:#1A0800  fg:#FFF5EC  muted:#9A6040  accent:#8B4513
Slate      bg:#0F1923  fg:#E8F4FD  muted:#607080  accent:#4A9ECC
```

### ✦ VIBRANT / ENERGETIC
```
Electric   bg:#0A0A1A  fg:#FFFFFF  muted:#6060FF  accent:#00F5FF
Neon       bg:#050510  fg:#F0FFF0  muted:#30D080  accent:#FF006E
Solar      bg:#FFF8E1  fg:#1A0A00  muted:#FF6B00  accent:#FFD600
Coral      bg:#FFF5F0  fg:#1A0505  muted:#FF6B6B  accent:#4ECDC4
Plasma     bg:#0F001A  fg:#F5E6FF  muted:#8B00FF  accent:#FF00FF
Inferno    bg:#0A0000  fg:#FFF5F0  muted:#FF3300  accent:#FF6600
Aurora     bg:#001A0F  fg:#F0FFF5  muted:#00CC88  accent:#00FFAA
Ultraviolet bg:#06000F fg:#EEE5FF  muted:#7700CC  accent:#AA44FF
```

### ✦ NATURE / ORGANIC
```
Forest     bg:#0A1A0A  fg:#F5FFF5  muted:#2D7A2D  accent:#8BC34A
Ocean      bg:#001A2C  fg:#F0F8FF  muted:#0077B6  accent:#00B4D8
Desert     bg:#FFF8F0  fg:#1A0A00  muted:#C17817  accent:#E67E22
Sage       bg:#F0F4F0  fg:#0A1A0A  muted:#6B8E6B  accent:#4CAF50
Stone      bg:#F5F3F0  fg:#1A1815  muted:#8C8278  accent:#A0937D
Terracotta bg:#FDF0E8  fg:#1A0800  muted:#C06030  accent:#D2691E
Moss       bg:#0F1A0A  fg:#F0F8EA  muted:#507030  accent:#6AAF20
Tide       bg:#E8F4F8  fg:#001520  muted:#407080  accent:#009AB5
```

### ✦ BRAND / CORPORATE
```
Trust      bg:#F0F4FF  fg:#001A3D  muted:#4060A0  accent:#0052CC
Health     bg:#F0FFF8  fg:#001A0F  muted:#20705A  accent:#00875A
Innovation bg:#FFF0F8  fg:#1A0015  muted:#6554C0  accent:#8777D9
Growth     bg:#F5FFF5  fg:#001A00  muted:#207050  accent:#006644
Impact     bg:#FFF5F0  fg:#1A0500  muted:#CC4020  accent:#FF5630
Clarity    bg:#F5F8FF  fg:#00153D  muted:#305090  accent:#1A56DB
Purpose    bg:#FFFFF0  fg:#1A1A00  muted:#808030  accent:#B8A000
```

### ✦ DARK MODE FIRST
```
Carbon     bg:#111111  fg:#EEEEEE  muted:#444444  accent:#0EA5E9
Void       bg:#000000  fg:#FFFFFF  muted:#333333  accent:#6366F1
Graphite   bg:#1C1C1E  fg:#F5F5F7  muted:#48484A  accent:#0A84FF
Eclipse    bg:#0D1117  fg:#F0F6FC  muted:#30363D  accent:#58A6FF
Abyss      bg:#050507  fg:#E8E8F0  muted:#30304A  accent:#7C3AED
Cinder     bg:#0F0F0F  fg:#F0F0F0  muted:#404040  accent:#E84393
Cobalt     bg:#020B1A  fg:#E8F4FF  muted:#203A5A  accent:#3B82F6
Ember      bg:#120500  fg:#FFF5EC  muted:#6A2800  accent:#F97316
```

### CSS Implementation (always use semantic tokens)
```css
:root {
  --bg:          [palette-bg];
  --fg:          [palette-fg];
  --muted:       [palette-muted];
  --accent:      [palette-accent];
  --accent-fg:   white; /* or black if accent is light */
  --surface:     color-mix(in srgb, var(--bg) 94%, var(--fg));
  --surface-2:   color-mix(in srgb, var(--bg) 88%, var(--fg));
  --border:      color-mix(in srgb, var(--fg) 10%, transparent);
  --border-strong: color-mix(in srgb, var(--fg) 20%, transparent);
  --shadow:      0 1px 3px color-mix(in srgb, var(--fg) 8%, transparent),
                 0 8px 24px color-mix(in srgb, var(--fg) 6%, transparent);
}
```

---

## ⚡ COMPONENT LIBRARY — 21ST.DEV + SHADCN + MOTIONSITES

### Core Stack (always use this)
```
Framework:    Next.js 15 (App Router) | Astro 5
Styling:      Tailwind CSS v4 + CSS custom properties
Components:   shadcn/ui + Radix UI primitives
Animation:    Framer Motion 11 | GSAP 3 (for complex sequences)
Smooth Scroll: Lenis (@studio-freight/lenis)
Icons:        Lucide React (never FontAwesome or Heroicons)
Forms:        React Hook Form + Zod
State:        Zustand (global) | Jotai (atomic)
Fonts:        next/font or Fontsource (never CDN link tags)
Images:       next/image (always, never raw <img> for main content)
```

### 🧩 NAVIGATION COMPONENTS
```
- Navbar: blur-backdrop (backdrop-filter: blur(16px)) + scroll-aware opacity
- Mobile: Sheet drawer from shadcn (never a clunky hamburger accordion)
- Floating dock: macOS-style dock with Framer Motion scale magnification
- Command palette: ⌘K with cmdk, fuzzy search, keyboard navigation
- Breadcrumb: collapsing on mobile, ellipsis overflow
- Progress bar: page scroll indicator (NProgress style)
```

### 🦸 HERO SECTIONS (MotionSites-inspired)
```
Hero 1 — Staggered text reveal + gradient mesh background
  - H1 splits per word, each word animates up with stagger 80ms
  - Gradient mesh bg: radial-gradient animated with CSS keyframes

Hero 2 — Full-screen video hero
  - Autoplay muted loop video, poster image fallback
  - Overlay gradient, text centered with white
  - Cinematic letterbox bars on load (M dial = 8+)

Hero 3 — 3D card tilt hero
  - Product image on right, perspective tilt on mousemove
  - transform: perspective(1000px) rotateX/Y based on mouse offset

Hero 4 — Bento grid hero
  - Asymmetric grid of feature cards
  - Each card has hover shimmer effect

Hero 5 — Split-screen hero
  - Left: text + CTA | Right: interactive demo or image
  - Animated divider between halves

Hero 6 — Particle hero
  - Canvas particle field, mouse-interactive
  - tsParticles or custom WebGL

Hero 7 — Glassmorphism floating elements
  - Blurred glass cards floating with subtle parallax
  - Multiple depth layers on scroll
```

### 🃏 CARDS & CONTENT
```
- Tilt card: CSS perspective + JS mousemove, shine gradient overlay
- Magnetic card: element follows cursor with spring physics
- Glass card: backdrop-blur + semi-transparent border
- Expandable card: height animation with useSpring (Framer)
- Feature card: icon animates on hover (stroke-dashoffset or scale)
- Pricing card: highlight with border-accent + scale(1.02)
- Testimonial: rotating quotes with crossfade transition
- Blog card: image zoom on hover (overflow: hidden + scale)
```

### 🌈 BACKGROUNDS
```
- Aurora gradient: multi-stop animated gradient (8s ease infinite)
- Dot matrix: SVG pattern, subtle opacity
- Grid pattern: CSS grid lines with ::before pseudo
- Noise overlay: SVG feTurbulence, 3-5% opacity
- Particle system: tsParticles (avoid canvas overdraw on mobile)
- Gradient mesh: multiple radial-gradients with animation
- Beam of light: conic-gradient rotating slowly
- Bokeh: blurred color circles with animation
```

### 🔘 BUTTONS & CTAs
```
- Shimmer button: pseudo-element gradient sweeping left-to-right
- Gradient border: conic-gradient border via padding trick
- Magnetic button: follows cursor with spring lerp
- Morphing button: idle → loading → success state machine
- Glitch button: CSS text-shadow RGB offset on hover
- Liquid button: SVG morphing path on hover
```

### 📊 DATA & FEEDBACK
```
- Counter: useSpring number animation from 0 to target
- Progress ring: SVG stroke-dashoffset animated
- Sparkline: tiny Recharts LineChart, no axes
- Toast: Sonner (never react-toastify)
- Alert: Radix UI Alert with icon variants
- Badge: solid / outline / soft variants
- Skeleton: pulse animation for loading states
- Empty state: illustration + CTA always
```

### ✨ MICRO-INTERACTIONS
```
- Cursor follower: custom cursor with spring lag
- Smooth scroll: Lenis (always install this)
- Page transitions: Framer Motion AnimatePresence
- Hover lift: translateY(-2px) + shadow increase
- Focus ring: 2px solid accent + 2px offset (never outline:none without replacement)
- Confetti: canvas-confetti on success events
- Number morph: Framer Motion value interpolation
```

---

## 🎬 ANIMATION PATTERNS — CODE REFERENCE

### Staggered reveal (most common)
```tsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const item = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}
// Use: <motion.div variants={container}><motion.p variants={item}>...</motion.p></motion.div>
```

### Scroll-driven reveal (performance-safe)
```tsx
import { useInView } from 'framer-motion'
const ref = useRef(null)
const inView = useInView(ref, { threshold: 0.15, once: true })
// <div ref={ref}><motion.div animate={inView ? 'visible' : 'hidden'} />
```

### Smooth scroll setup
```tsx
import Lenis from '@studio-freight/lenis'
useEffect(() => {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return () => lenis.destroy()
}, [])
```

### 3D card tilt
```tsx
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - left) / width - 0.5
  const y = (e.clientY - top) / height - 0.5
  setRotate({ x: y * -15, y: x * 15 })
}
// style={{ transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
```

### Aurora background
```css
@keyframes aurora {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
.aurora {
  background: linear-gradient(135deg, #0a0a1a, #1a0a2e, #0a1a1a, #1a1a0a);
  background-size: 400% 400%;
  animation: aurora 10s ease infinite;
}
```

### Page transition
```tsx
// In layout.tsx — wrap with AnimatePresence
<AnimatePresence mode="wait">
  <motion.main
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </motion.main>
</AnimatePresence>
```

### Magnetic element
```tsx
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  setPos({ x: x * 0.35, y: y * 0.35 })
}
// animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 150, damping: 15 }}
```

### Reduced motion (always respect)
```tsx
import { useReducedMotion } from 'framer-motion'
const shouldReduce = useReducedMotion()
const animation = shouldReduce ? {} : { y: [0, -10, 0] }
```

---

## 🔒 SECURITY — OWASP TOP 10 2025 (ZERO TOLERANCE)

Security is not optional. Every web project must implement all applicable rules below.

### A01 — Broken Access Control
```typescript
// ALWAYS check authorization server-side
export async function getResource(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  
  // ALWAYS verify ownership — never trust the ID alone
  const resource = await db.resource.findFirst({
    where: { id, userId: session.user.id }
  })
  if (!resource) throw new Error('Not found')
  return resource
}
```

### A02 — Cryptographic Failures
```typescript
// Passwords: bcrypt or Argon2 — never MD5/SHA1
import bcrypt from 'bcryptjs'
const hash = await bcrypt.hash(password, 12)

// Tokens: cryptographically random
import { randomBytes } from 'crypto'
const token = randomBytes(32).toString('hex')

// Sensitive data: encrypt at rest
// NEVER store raw PII in logs
```

### A03 — Injection Prevention
```typescript
// SQL: always parameterized (Prisma/Drizzle do this automatically)
// Never: db.raw(`SELECT * FROM users WHERE email = '${email}'`)
// Always: db.user.findFirst({ where: { email } })

// HTML: sanitize before rendering
import DOMPurify from 'isomorphic-dompurify'
const clean = DOMPurify.sanitize(userHtml)
```

### A04 — Insecure Design
```typescript
// Rate limiting on all auth endpoints
import { Ratelimit } from '@upstash/ratelimit'
const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1m') })
const { success } = await ratelimit.limit(ip)
if (!success) return new Response('Too many requests', { status: 429 })
```

### A05 — Security Headers (next.config.ts)
```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',    value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src * blob: data:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src *",
      "frame-ancestors 'self'",
    ].join('; ')
  },
]
export default { headers: async () => [{ source: '/(.*)', headers: securityHeaders }] }
```

### A06 — Vulnerable Components
```bash
# Run before every deploy
npm audit --audit-level=high
# Use: dependabot, snyk, or socket.dev in CI
```

### A07 — Auth/Identity
```typescript
// Session: httpOnly + secure + sameSite
// Cookie config (NextAuth / lucia-auth)
cookies: {
  sessionToken: {
    options: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' }
  }
}

// Password reset: time-limited token, single use
// MFA: TOTP via otplib for sensitive operations
```

### A08 — Software Integrity
```typescript
// Verify webhook signatures
const signature = req.headers['x-signature']
const expected = createHmac('sha256', secret).update(body).digest('hex')
if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
  return new Response('Invalid signature', { status: 401 })
}
```

### A09 — Logging (what to log / never log)
```typescript
// Log: auth events, permission errors, rate limit hits, 4xx/5xx
// NEVER log: passwords, tokens, SSNs, credit cards, raw PII

logger.info('Auth event', { userId: session.user.id, event: 'login', ip, userAgent })
// NOT: logger.info('Login', { password, token })
```

### A10 — SSRF Prevention
```typescript
// Validate URLs before server-side fetches
const ALLOWED_DOMAINS = ['api.stripe.com', 'hooks.slack.com']
const url = new URL(userUrl)
if (!ALLOWED_DOMAINS.includes(url.hostname)) throw new Error('Domain not allowed')
// Block: localhost, 127.x, 10.x, 172.16.x, 192.168.x
```

### Input Validation (always Zod)
```typescript
const ContactSchema = z.object({
  name:    z.string().min(1).max(100).trim(),
  email:   z.string().email().max(254).toLowerCase(),
  message: z.string().min(10).max(5000).trim(),
  url:     z.string().url().startsWith('https://').optional(),
})

// In server action:
const result = ContactSchema.safeParse(formData)
if (!result.success) return { error: result.error.flatten() }
```

### Environment Variables
```bash
# .env.example (commit this) — never commit .env
DATABASE_URL=             # postgres connection string
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # https://yourdomain.com
STRIPE_SECRET_KEY=        # sk_live_...
STRIPE_WEBHOOK_SECRET=    # whsec_...
UPSTASH_REDIS_REST_URL=   # for rate limiting
UPSTASH_REDIS_REST_TOKEN= # for rate limiting
```

---

## 🤖 AGENT ROSTER

### 🔮 Design Oracle
*Auto-activates for any UI/design decision*

Responsibilities:
1. Read SPEC.md to understand product context
2. Select optimal palette from §PALETTES based on brand/vibe
3. Recommend font pair from §TYPOGRAPHY based on context
4. Set the three dials (V/M/D) explicitly
5. Write or update `DESIGN.md` with the full system
6. Check against §ANTI-PATTERNS before finalizing

Output format:
```
DESIGN DECISION
Palette: [name] — reason
Fonts: [HeadingFont] + [BodyFont] — reason
Dials: V=[n] M=[n] D=[n] — reason
Key decisions: [list]
```

### 🛡️ Security Guardian
*Auto-activates on every code write that touches auth, input, data, API*

Responsibilities:
1. Scan new code for OWASP Top 10 violations
2. Check input validation (Zod schemas present?)
3. Verify authorization checks (ownership verified?)
4. Detect secrets/tokens in code
5. Validate security headers present in config
6. Report findings by severity

Output format:
```
SECURITY SCAN
🔴 CRITICAL: [description + fix]
🟠 HIGH: [description + fix]
🟡 MEDIUM: [description + fix]
🟢 OK: auth ✓ | input ✓ | headers ✓
```

### 🎬 Motion Architect
*Auto-activates when building UI components or sections*

Responsibilities:
1. Check M dial — match animation intensity to spec
2. Select appropriate animation patterns from §ANIMATION PATTERNS
3. Install Lenis for smooth scroll if not present
4. Ensure all animations use `transform` + `opacity` only (no layout thrash)
5. Add `useReducedMotion` check
6. Verify 60fps via DevTools performance budget

Rules:
- M=1-3: hover opacity only
- M=4-6: reveals, hovers, scroll parallax
- M=7-9: magnetic, 3D, scroll-driven
- M=10: full cinematic, page transitions, particle systems

### 🧩 Component Wizard
*Auto-activates when scaffolding pages or UI sections*

Responsibilities:
1. Read SPEC.md components list
2. Pull from 21st.dev registry or shadcn
3. Implement with Radix UI primitives (accessibility baked in)
4. Ensure WCAG 2.1 AA (contrast 4.5:1)
5. Mobile-first (320px minimum viewport)
6. Dark mode via CSS custom properties (always)

### 📋 Spec Keeper
*Auto-activates at project start and major feature additions*

Responsibilities:
1. Create/update SPEC.md with current state
2. Validate code matches spec (detect drift)
3. Populate §B invariants from test failures
4. Generate build checklist
5. Flag spec-to-code contradictions

---

## 📋 COMMANDS

| Command | Action |
|---------|--------|
| `/plus-init` | Full project bootstrap: SPEC.md, DESIGN.md, install stack, scaffold structure |
| `/plus-design [V=n] [M=n] [D=n]` | Apply/update design system, set dials, select palette + fonts |
| `/plus-secure` | Full OWASP audit, generate SECURITY report with severity |
| `/plus-components [page]` | Scaffold 21st.dev + shadcn components for a page or section |
| `/plus-motion [component]` | Add MotionSites animation patterns, set M dial, install Lenis |
| `/plus-palette [name]` | Apply named palette from collection, update CSS tokens |
| `/plus-fonts [pair-code]` | Apply named font pair (e.g. T2, E1, B3), update globals.css |
| `/plus-spec` | Interactive SPEC.md review + update |
| `/plus-audit` | Full project audit: design quality + security + perf + a11y |
| `/plus-deploy` | Pre-deployment checklist: headers, env, audit, lighthouse |

---

## 🚫 ANTI-PATTERNS — NEVER

### Design Anti-Patterns
- ❌ Using `#0070f3` or `#007bff` as default blue without intentional choice
- ❌ Lorem ipsum in any deliverable
- ❌ Box shadows on every element
- ❌ Mixing more than 2 font families
- ❌ Centering every single layout element
- ❌ Generic equal-padding card grids
- ❌ Gradient text on body copy (headings only, sparingly)
- ❌ No dark mode support
- ❌ Animating everything at once (causes cognitive fatigue)
- ❌ Mobile as afterthought (always mobile-first)
- ❌ 12-column grid when 4-column serves better
- ❌ Placeholder images (`placehold.it`) in final delivery
- ❌ Using Heroicons or FontAwesome (use Lucide)
- ❌ Ignoring `prefers-reduced-motion`

### Security Anti-Patterns
- ❌ `dangerouslySetInnerHTML` without DOMPurify sanitization
- ❌ Tokens or secrets in localStorage (use httpOnly cookies)
- ❌ `eval()` or `new Function()` on any user input
- ❌ `console.log` with sensitive data in production
- ❌ HTTP endpoints in production (enforce HTTPS)
- ❌ Wildcard CORS (`*`) on authenticated APIs
- ❌ Trusting client-side role claims without server verification
- ❌ Storing unhashed passwords anywhere

### Code Anti-Patterns
- ❌ `any` type in TypeScript without `// eslint-disable` comment explaining why
- ❌ `useEffect` for data fetching (use React Query / SWR / server components)
- ❌ Inline styles for static values (use Tailwind or CSS vars)
- ❌ `import * from 'lodash'` (import specific functions)
- ❌ Committing `.env` files (always `.gitignore`)
- ❌ API keys in client-side code (prefix with `NEXT_PUBLIC_` only for non-sensitive)

---

## ✅ PRE-LAUNCH CHECKLIST

### Design Quality
- [ ] Font pair selected from §TYPOGRAPHY approved list
- [ ] Palette applied with CSS semantic tokens
- [ ] Three dials set in SPEC.md (V / M / D)
- [ ] Mobile viewport tested at 320px, 375px, 768px, 1280px
- [ ] Dark mode works (test with OS preference toggle)
- [ ] `prefers-reduced-motion` respected
- [ ] No design anti-patterns present
- [ ] Typography scale uses `clamp()` for fluid sizing
- [ ] Color contrast ≥ 4.5:1 (use contrast checker)

### Performance
- [ ] Images use next/image with explicit width/height
- [ ] Fonts use `display: swap`
- [ ] No unused Tailwind classes (purge configured)
- [ ] Route-level code splitting (Next.js App Router does this)
- [ ] LCP < 2.5s | CLS < 0.1 | FID < 100ms
- [ ] Lighthouse score ≥ 90 on Performance

### Security
- [ ] All user inputs validated with Zod server-side
- [ ] Security headers in next.config.ts
- [ ] No secrets in code or git history (`git log` clean)
- [ ] Auth checks on every protected route / server action
- [ ] `npm audit` → 0 high or critical
- [ ] Rate limiting on auth + form endpoints
- [ ] CSRF protection (Next.js server actions handle this)
- [ ] Environment variables documented in `.env.example`

### Accessibility
- [ ] Color contrast WCAG 2.1 AA (4.5:1 normal, 3:1 large text)
- [ ] All interactive elements keyboard navigable
- [ ] `<img>` alt attributes present and descriptive
- [ ] ARIA labels on icon-only buttons
- [ ] Focus visible styles (never `outline: none` without replacement)
- [ ] Screen reader tested (VoiceOver / NVDA)
- [ ] `<html lang="[locale]">` set correctly

---

## 🏗️ STANDARD PROJECT STRUCTURE

```
my-project/
├── SPEC.md               ← Caveman spec (source of truth)
├── DESIGN.md             ← Design system documentation
├── SECURITY.md           ← Security decisions log
├── .env.example          ← Template (commit this, not .env)
├── .claude/
│   ├── settings.json     ← ThePlusSkill registered here
│   └── skills/
│       └── theplus-skill/ → (this skill, symlinked or copied)
├── src/
│   ├── app/
│   │   ├── layout.tsx    ← Lenis + AnimatePresence + fonts
│   │   ├── page.tsx
│   │   └── (routes)/
│   ├── components/
│   │   ├── ui/           ← shadcn/ui + 21st.dev components
│   │   ├── layout/       ← Navbar, Footer, Sidebar
│   │   ├── sections/     ← Hero, Features, Pricing, etc.
│   │   └── providers/    ← QueryClient, ThemeProvider, Lenis
│   ├── lib/
│   │   ├── auth.ts       ← Auth config
│   │   ├── db.ts         ← Prisma/Drizzle client
│   │   ├── validations.ts ← All Zod schemas
│   │   └── utils.ts      ← cn(), formatters
│   └── styles/
│       ├── globals.css   ← CSS custom properties + palette tokens
│       └── fonts.css     ← Font declarations
├── public/
│   └── fonts/            ← Self-hosted fonts (Fontsource)
├── next.config.ts        ← Security headers + config
├── tailwind.config.ts    ← Extended with design tokens
└── package.json
```

---

## 📦 INSTALL COMMAND

```bash
# Install ThePlusSkill in your project
mkdir -p .claude/skills/theplus-skill
curl -o .claude/skills/theplus-skill/SKILL.md \
  https://raw.githubusercontent.com/dfadify-web/ThePlusSkill/main/.claude/skills/theplus-skill/SKILL.md

# Or clone the full skill repo
git clone https://github.com/dfadify-web/ThePlusSkill /tmp/theplus-skill
cp -r /tmp/theplus-skill/.claude/* .claude/
```

---

*ThePlusSkill v1.0 — Built for Claude Code | Design × Security × Motion × Components*
