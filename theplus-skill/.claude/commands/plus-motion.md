# /plus-motion — Animation & Motion System

Add MotionSites.ai-inspired animation patterns to components or the entire project. Activates Motion Architect agent.

## Usage
```
/plus-motion                        # Add motion to current page/component
/plus-motion install                # Install Lenis + Framer Motion setup
/plus-motion hero                   # Add cinematic hero animations
/plus-motion scroll                 # Add scroll-driven reveal animations
/plus-motion page-transitions       # Add route transition animations
/plus-motion cursor                 # Add custom cursor follower
/plus-motion M=8                    # Set motion intensity and apply
/plus-motion audit                  # Check for animation performance issues
```

## Motion Intensity Guide (M dial)

### M=1-3 — Subtle (Corporate, Enterprise, Minimal)
- Hover: opacity 1 → 0.8, transition 150ms
- Focus: ring scale pulse
- No scroll animations
- No JS required — pure CSS

### M=4-6 — Balanced (SaaS, Consumer, Modern)
- Scroll reveals: fade-up, stagger 80ms
- Hover lifts: translateY(-2px) + shadow
- Smooth scroll with Lenis (lerp: 0.1)
- Page fade transitions (250ms)

### M=7-9 — Expressive (Creative, Portfolio, Agency)
- Magnetic buttons and cards
- 3D card tilt on mousemove
- Parallax sections (2-3 layers)
- Text blur-in reveals
- Animated gradient backgrounds
- Custom cursor follower

### M=10 — Cinematic (Landing Pages, Product Launches)
- Full page transitions with Framer Motion
- GSAP scroll timelines
- Particle systems (tsParticles)
- 3D scenes (Three.js / Spline)
- Video hero with cinematic letterbox
- SVG path animations
- Scroll-driven camera movements

## Lenis Setup (always)
```tsx
// src/components/providers/lenis-provider.tsx
'use client'
import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

const LenisContext = createContext<Lenis | null>(null)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  
  useEffect(() => {
    lenisRef.current = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false })
    const raf = (t: number) => { lenisRef.current?.raf(t); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenisRef.current?.destroy()
  }, [])
  
  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)
```

## Performance Rules (always enforce)
- Only animate `transform` and `opacity` (no layout properties)
- Use `will-change: transform` sparingly (only on actively animating elements)
- Remove `will-change` after animation completes
- Use `requestAnimationFrame` for JS-driven animations
- Check 60fps in DevTools Performance panel before shipping
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `useReducedMotion()` — disable animations when user prefers it
- Lazy load heavy animation libraries (tsParticles, Three.js)
