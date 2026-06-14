# /plus-components — Component Scaffolder

Scaffold premium UI components from 21st.dev, shadcn/ui, and MotionSites patterns. Activates Component Wizard + Motion Architect agents.

## Usage
```
/plus-components                    # Scaffold based on SPEC.md components list
/plus-components hero               # Generate a hero section
/plus-components navbar             # Generate navbar with mobile sheet
/plus-components [section-name]     # Generate any named section
/plus-components list               # Show all available component templates
```

## Available Templates

### 🦸 Hero Sections
- `hero-stagger` — Staggered word reveal, gradient mesh background
- `hero-video` — Full-screen video with overlay text
- `hero-bento` — Asymmetric bento grid layout
- `hero-split` — 50/50 split with 3D card tilt
- `hero-glass` — Glassmorphism floating elements + aurora background
- `hero-particle` — tsParticles canvas, mouse-interactive
- `hero-typewriter` — Morphing/typewriter headline
- `hero-3d` — Three.js or Spline embedded 3D object

### 🗺️ Navigation
- `navbar-blur` — Blur backdrop navbar, scroll-aware
- `navbar-floating` — Floating pill navbar
- `dock-macos` — macOS-style magnetic icon dock
- `command-palette` — ⌘K search palette (cmdk)
- `sidebar` — Collapsible sidebar (shadcn)

### 📦 Sections
- `features-bento` — Feature cards in bento grid
- `features-alternating` — Left/right alternating feature rows
- `pricing` — 3-tier pricing with toggle (monthly/annual)
- `testimonials` — Carousel with avatar + rating
- `faq` — Accordion (Radix UI)
- `cta` — Full-width CTA with gradient background
- `stats` — Animated number counters
- `logos` — Infinite scrolling logo ticker
- `footer` — Sitemap footer with newsletter input

### 🎨 UI Primitives
- `button-shimmer` — Shimmer sweep button
- `button-gradient` — Gradient border button
- `button-magnetic` — Cursor-following magnetic button
- `card-tilt` — 3D tilt card with shine
- `card-glass` — Glassmorphism card
- `badge-variants` — Solid/outline/soft badge
- `input-floating` — Floating label input
- `toast-setup` — Sonner toast provider

### 🌈 Backgrounds
- `bg-aurora` — Animated aurora gradient
- `bg-dots` — Dot matrix SVG pattern
- `bg-grid` — CSS grid lines
- `bg-noise` — SVG noise texture overlay
- `bg-beam` — Rotating beam of light
- `bg-gradient-mesh` — Multi-radial gradient mesh

## Component Generation Rules
1. Always use TypeScript + proper types
2. Always mobile-first responsive
3. Always include dark mode support via CSS vars
4. Always add `aria-*` attributes for accessibility
5. Always use `useReducedMotion()` when adding animations
6. Always destructure and export named component
7. Add JSDoc only if props are non-obvious
